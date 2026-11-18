import { useEffect, useRef } from 'react'
import './GuidePage.css'

const steps = [
  {
    title: 'STEP 01. 카드 고르기',
    text: '78장의 카드 중 마음이 가는 카드를 3장 골라요. 한 번의 리딩에서 같은 카드는 나오지 않아요.',
  },
  {
    title: 'STEP 02. 카드 확인하기',
    text: '카드를 뒤집어 이미지와 이름, 핵심 키워드를 확인해요.',
  },
  {
    title: 'STEP 03. 해석 보기',
    text: '고른 카드 3장을 과거, 현재, 미래 순서로 읽어 나만의 해석과 조언을 전해드려요.',
  },
]

// 타로 이용 방법 설명창 (모달)
// onClose: 닫기 / onStart: 카드 선택 화면(CardPage)으로 이동
function GuidePage({ onClose, onStart }) {
  const closeRef = useRef(null)

  // 열릴 때 닫기 버튼에 포커스, ESC로 닫기
  useEffect(() => {
    closeRef.current?.focus()
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="guide-overlay" onClick={onClose}>
      <section
        className="guide-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="guide-close"
          onClick={onClose}
          ref={closeRef}
          aria-label="안내창 닫기"
        >
          ×
        </button>

        <h2 id="guide-title" className="guide-title">
          타로 이용 방법
        </h2>
        <p className="guide-description">
          세 단계로 나만의 타로를 만나보세요.
        </p>

        <ol className="guide-steps">
          {steps.map((step) => (
            <li key={step.title} className="guide-step">
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <button type="button" className="guide-start" onClick={onStart}>
          카드 선택하러 가기
        </button>

        <p className="guide-caption">
          타로는 자신을 돌아보는 참고와 영감으로 활용해 주세요.
        </p>
      </section>
    </div>
  )
}

export default GuidePage
