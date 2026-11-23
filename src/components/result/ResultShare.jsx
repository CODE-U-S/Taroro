import { useState } from 'react'
import { buildShareText } from './shareText'
import './ResultShare.css'

// 결과 공유 화면: 이메일 주소를 받아 메일 앱으로 결과를 보낸다 (mailto)
function ResultShare({ topic, cards, activeCard, reading, onBack }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!reading) return
    const subject = `[타로로] ${reading.title}`
    const body = buildShareText(topic, cards, reading)
    window.location.href = `mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <main className="result-page">
      <img className="result-moons" src="/images/moons.png" alt="" />

      <section className="result-panel share-panel" aria-labelledby="share-title">
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
            onChange={(e) => {
              setEmail(e.target.value)
              setSent(false)
            }}
          />
          <p className="share-hint" aria-live="polite">
            {sent ? '메일 앱이 열렸어요. 내용을 확인하고 보내기를 눌러 주세요.' : ''}
          </p>

          <hr className="share-divider" />

          <div className="share-actions">
            <button type="button" className="share-btn" onClick={onBack}>
              돌아가기
            </button>
            <button type="submit" className="share-btn share-btn--primary">
              <img src="/images/result/share-icon.svg" alt="" />
              결과 공유
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default ResultShare
