import { useEffect, useState } from 'react'
import { getTarotReading } from '../../services/tarotApi'

// 주제/질문/카드로 AI 해석을 요청하고 { status, reading, error, retry }를 돌려준다.
// status: 'loading' | 'success' | 'error'
export function useTarotReading(topic, question, cards) {
  const [state, setState] = useState({ status: 'loading', reading: null, error: null })
  const [attempt, setAttempt] = useState(0)
  const cardsKey = JSON.stringify(cards)

  useEffect(() => {
    let cancelled = false

    getTarotReading(topic, question, JSON.parse(cardsKey))
      .then((reading) => {
        if (!cancelled) setState({ status: 'success', reading, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', reading: null, error: error.message })
      })

    return () => {
      cancelled = true
    }
  }, [topic, question, cardsKey, attempt])

  function retry() {
    setState({ status: 'loading', reading: null, error: null })
    setAttempt((n) => n + 1)
  }

  return { ...state, retry }
}
