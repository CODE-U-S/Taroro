import { useEffect, useState } from 'react'
import { getTarotReading } from '../../services/tarotApi'

// 네트워크 끊김(TypeError)이나 JSON이 아닌 응답(SyntaxError)은 브라우저의 영어 메시지 대신 안내 문구로 바꾼다.
// 서버(api/tarot.js)가 보낸 한국어 오류 메시지는 그대로 보여준다.
function toUserMessage(error) {
  if (error instanceof TypeError || error instanceof SyntaxError) {
    return '서버와 연결하지 못했어요. 잠시 후 다시 시도해 주세요.'
  }
  return error?.message || '잠시 후 다시 시도해 주세요.'
}

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
        if (!cancelled) setState({ status: 'error', reading: null, error: toUserMessage(error) })
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
