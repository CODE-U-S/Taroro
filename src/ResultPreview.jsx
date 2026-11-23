// 결과 화면 단독 미리보기 (개발용) — npm run dev 후 /result-preview.html 접속
// 카드 선택 화면이 완성되면 PreviewApp/App에 ResultPage를 연결하고 이 파일은 지워도 된다.
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ResultPage from './pages/ResultPage'

const mock = {
  topic: 'love',
  question: '앞으로의 연애운은?',
  cards: [
    { id: 'the-fool', position: 'past' },
    { id: 'the-lovers', position: 'present' },
    { id: 'the-sun', position: 'future' },
  ],
  reading: {
    title: '새로운 인연과 긍정적인 변화',
    summary:
      '과거의 바보 카드는 망설임 없이 새로운 감정에 뛰어들었던 순수한 시작을 보여줘요. 현재의 연인 카드는 마음이 깊이 끌리는 사람과의 중요한 선택 앞에 서 있음을 뜻해요. 미래의 태양 카드는 그 선택이 밝고 따뜻한 관계로 이어질 가능성을 비춰 줍니다.',
    advice: '자신의 마음을 솔직하게 표현해 보세요.',
  },
}

function Preview() {
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode') // ?mode=api → 실제 API 호출 (vercel dev 필요)
  const [key, setKey] = useState(0)
  const reset = () => setKey((k) => k + 1)

  return (
    <ResultPage
      key={key}
      topic={mock.topic}
      question={mock.question}
      cards={mock.cards}
      reading={mode === 'api' ? undefined : mock.reading}
      onHome={() => { console.log('onHome: 시작 화면으로'); reset() }}
      onRetry={() => { console.log('onRetry: 카드 선택 화면으로'); reset() }}
    />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
)
