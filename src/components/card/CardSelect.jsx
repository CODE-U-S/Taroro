import { useEffect, useRef, useState } from "react";
import { CARD_IDS } from "../../data/cardMeanings";
import { POSITIONS } from "./positions";
import "./CardSelect.css";

// 부채꼴에 한 번에 펼쳐지는 카드 수. CardSelect.css 의 카드 간격·곡률이 Figma 22장 기준이다
const FAN_SIZE = 22;
const CENTER = (FAN_SIZE - 1) / 2;
const LAST_START = CARD_IDS.length - FAN_SIZE;

function shuffleCards() {
    const ids = [...CARD_IDS];
    for (let i = ids.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function CardSelect({ onBack, onSelect }) {
    const [cards, setCards] = useState(shuffleCards);
    const [selected, setSelected] = useState([]);
    const [round, setRound] = useState(0);
    // 부채꼴 왼쪽 끝에 오는 카드의 순번. 넘기다 멈춘 자리에 그대로 두므로 소수일 수 있다
    const [start, setStart] = useState(LAST_START / 2);
    const [isDragging, setIsDragging] = useState(false);
    const drag = useRef(null);

    const isFull = selected.length === POSITIONS.length;

    useEffect(() => {
        if (!isFull) return;
        const timer = setTimeout(() => onSelect(selected), 700);
        return () => clearTimeout(timer);
    }, [isFull, selected, onSelect]);

    const handlePick = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((item) => item !== id));
        } else if (!isFull) {
            setSelected([...selected, id]);
        }
    };

    const handleShuffle = () => {
        setCards(shuffleCards());
        setSelected([]);
        setStart(LAST_START / 2);
        setRound(round + 1);
    };

    const handlePointerDown = (event) => {
        if (event.button !== 0) return;
        drag.current = {
            x: event.clientX,
            start,
            // 카드 한 장 간격(px). Figma 부채꼴 폭 1320 에서 50.19
            step: (event.currentTarget.offsetWidth / 1320) * 50.19,
            moved: false,
        };
    };

    const handlePointerMove = (event) => {
        const current = drag.current;
        if (!current || event.buttons !== 1) return;
        const dx = event.clientX - current.x;
        if (!current.moved) {
            // 살짝 흔들린 클릭은 그대로 카드 선택으로 둔다
            if (Math.abs(dx) < 8) return;
            current.moved = true;
            // 부채꼴이 포인터를 잡고 있으면 손을 뗄 때 카드에 click 이 가지 않는다
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
        }
        setStart(clamp(current.start - dx / current.step, 0, LAST_START));
    };

    const handlePointerUp = () => {
        drag.current = null;
        setIsDragging(false);
    };

    return (
        <>
            <button type="button" className="card-back-button" onClick={onBack}>
                ← 뒤로
            </button>

            <header className="card-hero">
                <h1 className="card-title">지금, 당신을 부르는 카드</h1>
                <p className="card-subtitle">
                    마음속에 질문을 떠올리고, 가장 끌리는 카드 세 장을
                    골라보세요.
                </p>
            </header>

            <div
                key={round}
                className={`card-fan${isFull ? " is-full" : ""}${isDragging ? " is-dragging" : ""}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                {cards.map((id, index) => {
                    const order = selected.indexOf(id);
                    const position = POSITIONS[order];
                    const distance = index - start - CENTER;
                    // 부채꼴 밖으로 밀려난 카드는 양 끝 자리에 쌓고 맨 위 한 장만 보인다.
                    // 오른쪽 끝은 마지막 카드가 맨 위라서 카드들이 그 밑에서 나오고 들어간다
                    const offset = clamp(distance, -CENTER, CENTER);
                    const isOutside =
                        distance <= -CENTER - 1 ||
                        (distance > CENTER && index < cards.length - 1);

                    return (
                        <button
                            key={id}
                            type="button"
                            className={`card-fan-card${position ? " is-selected" : ""}${isOutside ? " is-outside" : ""}`}
                            style={{ "--offset": offset }}
                            onClick={() => handlePick(id)}
                            aria-pressed={Boolean(position)}
                            aria-label={
                                position
                                    ? `카드 ${index + 1} (${position.label})`
                                    : `카드 ${index + 1}`
                            }
                        >
                            {position && (
                                <span className="card-fan-badge">
                                    {position.label}
                                </span>
                            )}
                        </button>
                    );
                })}

                <input
                    className="card-fan-slider"
                    type="range"
                    min="0"
                    max={LAST_START}
                    step="any"
                    value={start}
                    onChange={(event) => setStart(Number(event.target.value))}
                    onPointerDown={(event) => event.stopPropagation()}
                    aria-label="카드 넘기기"
                />
            </div>

            <button
                type="button"
                className="card-shuffle"
                onClick={handleShuffle}
            >
                <span className="card-shuffle-icon" aria-hidden="true">
                    ↻
                </span>
                카드 다시 섞기
            </button>
        </>
    );
}

export default CardSelect;
