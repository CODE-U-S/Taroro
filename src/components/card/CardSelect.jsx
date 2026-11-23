import { useEffect, useRef, useState } from "react";
import { CARD_IDS } from "../../data/cardMeanings";
import { POSITIONS } from "./positions";
import "./CardSelect.css";

// 카드 자체는 고정된 위치에 배치하고, 카드 묶음(track)만 좌우로 이동시킨다.
// 첫 22장의 카드 크기/간격/곡률은 친구가 작성한 기존 Figma 배치값 그대로다.
const DESKTOP_VISIBLE = 22;
const MOBILE_VISIBLE = 6;
const DESKTOP_STEP = 50.19;
const WHEEL_PIXELS_PER_CARD = 75;

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function drawCards() {
  const ids = [...CARD_IDS];
  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids; // 78장 모두 덱에 남긴다
}

function CardSelect({ onBack, onSelect }) {
  const [cards, setCards] = useState(drawCards);
  const [selected, setSelected] = useState([]);
  const [round, setRound] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [cardStepPixels, setCardStepPixels] = useState(DESKTOP_STEP);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 640px)").matches,
  );

  const fanRef = useRef(null);
  const scrollRef = useRef(0);
  const ignoreClickUntilRef = useRef(0);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    startScroll: 0,
    vertical: false,
  });

  const visibleCount = isMobile ? MOBILE_VISIBLE : DESKTOP_VISIBLE;
  const maxScroll = Math.max(0, cards.length - visibleCount);
  const isFull = selected.length === POSITIONS.length;

  // 리사이즈 시 CSS가 결정한 실제 카드 간격을 읽어 드래그 거리와 정확히 맞춘다.
  useEffect(() => {
    const fan = fanRef.current;
    if (!fan) return;

    const measure = () => {
      if (isMobile) {
        const card = fan.querySelector(".card-fan-card");
        if (card) {
          const cardWidth = parseFloat(window.getComputedStyle(card).width);
          if (Number.isFinite(cardWidth)) setCardStepPixels(cardWidth + 8);
        }
      } else {
        setCardStepPixels(
          (fan.getBoundingClientRect().width / 1320) * DESKTOP_STEP,
        );
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(fan);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMobile, round]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const onChange = (event) => setIsMobile(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (scrollRef.current > maxScroll) {
      scrollRef.current = maxScroll;
      setScrollPosition(maxScroll);
    }
  }, [maxScroll]);

  useEffect(() => {
    if (!isFull) return;
    const timer = setTimeout(() => onSelect(selected), 700);
    return () => clearTimeout(timer);
  }, [isFull, selected, onSelect]);

  const moveTo = (position) => {
    const next = clamp(position, 0, maxScroll);
    scrollRef.current = next;
    setScrollPosition(next);
  };

  useEffect(() => {
    const fan = fanRef.current;
    if (!fan || maxScroll === 0) return;

    const onWheel = (event) => {
      if (event.ctrlKey) return;
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const pixels =
        delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1);
      if (!pixels) return;

      const next = clamp(
        scrollRef.current + pixels / WHEEL_PIXELS_PER_CARD,
        0,
        maxScroll,
      );
      if (next === scrollRef.current) return; // 끝에 닿으면 페이지 스크롤 허용

      event.preventDefault();
      scrollRef.current = next;
      setScrollPosition(next);
    };

    fan.addEventListener("wheel", onWheel, { passive: false });
    return () => fan.removeEventListener("wheel", onWheel);
  }, [maxScroll, round]);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScroll: scrollRef.current,
      vertical: false,
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId || drag.vertical)
      return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.moved && Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx)) {
      drag.vertical = true;
      return;
    }
    if (!drag.moved && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) {
      drag.moved = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (drag.moved) {
      moveTo(drag.startScroll - dx / Math.max(1, cardStepPixels));
    }
  };

  const handlePointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    if (drag.moved) ignoreClickUntilRef.current = Date.now() + 350;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.active = false;
    setIsDragging(false);
  };

  const handlePointerCancel = () => {
    dragRef.current.active = false;
    setIsDragging(false);
  };

  const handleFanClickCapture = (event) => {
    if (Date.now() < ignoreClickUntilRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // 기존 카드 선택 기능 유지
  const handlePick = (id) => {
    if (selected.includes(id)) {
      setSelected((prev) => prev.filter((item) => item !== id));
    } else if (!isFull) {
      setSelected((prev) => [...prev, id]);
    }
  };

  const handleShuffle = () => {
    setCards(drawCards());
    setSelected([]);
    scrollRef.current = 0;
    setScrollPosition(0);
    setRound((value) => value + 1);
  };

  return (
    <>
      <button type="button" className="card-back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <header className="card-hero">
        <h1 className="card-title">지금, 당신을 부르는 카드</h1>
        <p className="card-subtitle">
          마음속에 질문을 떠올리고, 가장 끌리는 카드 세 장을 골라보세요.
        </p>
      </header>

      <div
        key={round}
        ref={fanRef}
        className={`card-fan${isFull ? " is-full" : ""}${isDragging ? " is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClickCapture={handleFanClickCapture}
        aria-label={`타로 카드 선택 영역, 전체 ${cards.length}장`}
      >
        {/* 중요: 카드 하나하나가 아니라 카드 묶음 하나만 이동 */}
        <div
          className="card-fan-track"
          style={{
            transform: `translate3d(${-scrollPosition * cardStepPixels}px, 0, 0)`,
          }}
        >
          {cards.map((id, index) => {
            // 인덱스에 따른 카드의 위치는 최초 배치 후 절대 바뀌지 않는다.
            // 기존 22장 부채꼴 모양을 반복하여 78장까지 이어 붙인다.
            const slotOffset =
              (index % DESKTOP_VISIBLE) - (DESKTOP_VISIBLE - 1) / 2;
            const order = selected.indexOf(id);
            const position = POSITIONS[order];

            return (
              <button
                key={id}
                type="button"
                className={`card-fan-card${position ? " is-selected" : ""}`}
                style={{
                  "--index": index,
                  "--slot-offset": slotOffset,
                  "--layer": Math.round(100 - Math.abs(slotOffset) * 2),
                }}
                onClick={() => handlePick(id)}
                aria-pressed={Boolean(position)}
                aria-label={
                  position
                    ? `카드 ${index + 1} (${position.label})`
                    : `카드 ${index + 1}`
                }
              >
                {position && (
                  <span className="card-fan-badge">{position.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card-fan-navigation">
        <div className="card-fan-navigation-label">
          <span>전체 {cards.length}장</span>
          <span>
            {Math.floor(scrollPosition) + 1}–
            {Math.min(cards.length, Math.ceil(scrollPosition + visibleCount))}장
            보는 중
          </span>
        </div>
        <input
          className="card-fan-range"
          type="range"
          min="0"
          max={maxScroll}
          step="0.01"
          value={scrollPosition}
          onChange={(event) => moveTo(Number(event.target.value))}
          disabled={maxScroll === 0 || isFull}
          aria-label="78장 카드 좌우 탐색"
        />
        <p className="card-fan-hint">
          카드를 좌우로 드래그하거나 스크롤해서 살펴보세요.
        </p>
      </div>

      <button type="button" className="card-shuffle" onClick={handleShuffle}>
        <span className="card-shuffle-icon" aria-hidden="true">
          ↻
        </span>
        카드 다시 섞기
      </button>
    </>
  );
}

export default CardSelect;
