import { useState } from "react";
import "./ResultShare.css";

// 서버에서 이메일 자동 발송
async function sendResultEmail(email, topic, cards, reading) {
  const response = await fetch("/api/share", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      topic,
      cards,
      reading,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "이메일 전송에 실패했어요.");
  }

  return data;
}

function ResultShare({ topic, cards, activeCard, reading, onBack }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  // 결과 공유 버튼 클릭
  async function handleSubmit(event) {
    event.preventDefault();

    if (!reading || isSending || sent) return;

    setIsSending(true);
    setError("");
    setSent(false);

    try {
      // API에서 요구하는 카드 데이터 형식
      const shareCards = cards.map((card, index) => ({
        id: card.id,
        position: ["past", "present", "future"][index],
      }));

      // 기존 Gemini 해석 결과를 그대로 사용
      const shareReading = {
        title: reading.title,
        summary: reading.summary,
        advice: reading.advice,
      };

      // 이메일 발송 API 호출
      await sendResultEmail(email.trim(), topic, shareCards, shareReading);

      // 발송 성공
      setSent(true);
    } catch (err) {
      // 발송 실패
      setError(
        err instanceof Error
          ? err.message
          : "이메일 전송 중 오류가 발생했어요.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="result-page">
      <img className="result-moons" src="/images/moons.png" alt="" />

      <section
        className="result-panel share-panel"
        aria-labelledby="share-title"
      >
        <div className="share-card-frame">
          {activeCard && (
            <img
              className="share-card-img"
              src={activeCard.image}
              alt={`${activeCard.positionKo} 카드: ${activeCard.nameKo}`}
            />
          )}
        </div>

        <form className="share-main" onSubmit={handleSubmit}>
          <div className="share-badge-row">
            <span className="share-line share-line--left" />

            <p className="share-badge">
              <img src="/images/result/share-sparkle.svg" alt="" />
              결과 공유하기
              <img src="/images/result/share-sparkle.svg" alt="" />
            </p>

            <span className="share-line share-line--right" />
          </div>

          <h1 id="share-title" className="share-title">
            결과를 이메일로 보내드릴게요
          </h1>

          <p className="share-subtitle">받을 이메일 주소를 입력해 주세요.</p>

          <label className="share-input-label" htmlFor="share-email">
            이메일 주소
          </label>

          <input
            id="share-email"
            className="share-input"
            type="email"
            required
            autoComplete="email"
            placeholder="이메일 주소 입력"
            value={email}
            disabled={isSending}
            onChange={(e) => {
              setEmail(e.target.value);
              setSent(false);
              setError("");
            }}
          />

          <p className="share-hint" aria-live="polite" role="status">
            {isSending
              ? "이메일을 전송하고 있어요..."
              : sent
                ? "이메일을 성공적으로 전송했어요!"
                : error}
          </p>

          <hr className="share-divider" />

          <div className="share-actions">
            <button
              type="button"
              className="share-btn"
              onClick={onBack}
              disabled={isSending}
            >
              돌아가기
            </button>

            <button
              type="submit"
              className="share-btn share-btn--primary"
              disabled={isSending || sent || !reading}
            >
              <img src="/images/result/share-icon.svg" alt="" />
              {isSending ? "전송 중..." : sent ? "전송 완료" : "결과 공유"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ResultShare;
