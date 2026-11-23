import { useState } from "react";
import { resolveCards, TOPIC_KO } from "../components/result/cardInfo";
import { useTarotReading } from "../components/result/useTarotReading";
import ResultShare from "../components/result/ResultShare";
import "./ResultPage.css";

/**
 * 결과 화면 (결과 화면 + 결과 공유)
 *
 * props
 * - topic: 'love' | 'money' | 'study' | 'career'
 * - question: 사용자가 입력한 질문
 * - cards: [{ id, position }]  (past / present / future 순서, cards.json의 id)
 * - reading: { title, summary, advice } 를 이미 받아왔다면 넘겨준다. 없으면 이 화면에서 API를 호출한다.
 * - onHome: 홈으로 (처음부터 다시 시작)
 * - onRetry: 다시보기 (같은 주제로 카드를 다시 뽑기)
 */
function ResultPage({ reading, ...props }) {
  if (reading) {
    return (
      <ResultScreen
        {...props}
        status="success"
        reading={reading}
        onBack={handleBackToCardDetail}
      />
    );
  }
  return <ResultPageWithFetch {...props} />;
}

function ResultPageWithFetch(props) {
  const { status, reading, error, retry } = useTarotReading(
    props.topic,
    props.question,
    props.cards,
  );
  return (
    <ResultScreen
      {...props}
      status={status}
      reading={reading}
      error={error}
      onReload={retry}
    />
  );
}

function ResultScreen({
  topic,
  cards,
  status,
  reading,
  error,
  onReload,
  onHome,
  onRetry,
  onBack,
}) {
  const resolved = resolveCards(cards);
  const [activeIndex, setActiveIndex] = useState(resolved.length - 1);
  const [view, setView] = useState("result"); // result | share
  const activeCard = resolved[activeIndex];

  if (view === "share") {
    return (
      <ResultShare
        topic={topic}
        cards={resolved}
        activeCard={activeCard}
        reading={reading}
        onBack={() => setView("result")}
      />
    );
  }

  return (
    <main className="result-page">
      {onBack && (
        <button type="button" className="result-back-button" onClick={onBack}>
          ← 이전
        </button>
      )}

      <img className="result-moons" src="/images/moons.png" alt="" />

      <section className="result-panel" aria-labelledby="result-title">
        <div className="result-cards">
          {activeCard && (
            <figure className="result-card">
              <img
                key={activeCard.id}
                className="result-card-img"
                src={activeCard.image}
                alt={`${activeCard.positionKo} 카드: ${activeCard.nameKo} (${activeCard.name})`}
              />
              <figcaption className="result-card-caption">
                {activeCard.positionKo} · {activeCard.nameKo}
              </figcaption>
            </figure>
          )}

          <div
            className="result-card-tabs"
            role="tablist"
            aria-label="선택한 카드"
          >
            {resolved.map((card, index) => (
              <button
                key={card.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                className="result-card-tab"
                onClick={() => setActiveIndex(index)}
              >
                {card.positionKo}
              </button>
            ))}
          </div>
        </div>

        <div className="result-main">
          <div className="result-badge-row">
            <img
              className="result-ornament"
              src="/images/result/ornament-line.png"
              alt=""
            />
            <div className="result-badge">
              <img src="/images/result/badge.png" alt="" />
              <p>오늘의 {TOPIC_KO[topic] ?? ""} 운세</p>
            </div>
            <img
              className="result-ornament"
              src="/images/result/ornament-line.png"
              alt=""
            />
          </div>

          <div className="result-body" aria-live="polite">
            {status === "loading" && (
              <div className="result-status">
                <img
                  className="result-status-icon"
                  src="/images/result/share-sparkle.svg"
                  alt=""
                />
                <p>카드의 이야기를 읽고 있어요…</p>
              </div>
            )}

            {status === "error" && (
              <div className="result-status">
                <p>해석을 불러오지 못했어요.</p>
                {error && <p className="result-status-detail">{error}</p>}
                {onReload && (
                  <button
                    type="button"
                    className="result-btn result-btn--primary"
                    onClick={onReload}
                  >
                    다시 시도
                  </button>
                )}
              </div>
            )}

            {status === "success" && reading && (
              <>
                <h1 id="result-title" className="result-title">
                  {reading.title}
                </h1>
                <p className="result-summary">{reading.summary}</p>
                <p className="result-advice">“{reading.advice}”</p>
                {reading.source === "fallback" && (
                  <p className="result-note">
                    AI 연결이 원활하지 않아 기본 해석을 보여드리고 있어요.
                  </p>
                )}
              </>
            )}
          </div>

          <hr className="result-divider" />
        </div>

        <div className="result-actions">
          <button type="button" className="result-btn" onClick={onHome}>
            <img src="/images/result/icon-home.svg" alt="" />
            홈으로
          </button>
          <button
            type="button"
            className="result-btn result-btn--primary"
            onClick={onRetry}
          >
            <img src="/images/result/icon-redo.svg" alt="" />
            다시보기
          </button>
          <button
            type="button"
            className="result-btn"
            onClick={() => setView("share")}
            disabled={status !== "success"}
          >
            <img src="/images/result/icon-share.svg" alt="" />
            공유하기
          </button>
        </div>
      </section>
    </main>
  );
}

export default ResultPage;
