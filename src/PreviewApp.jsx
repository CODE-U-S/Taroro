import { useState } from 'react'
    import StartPage from './pages/StartPage'
    import TopicPage from './pages/TopicPage'
    import GuidePage from './components/GuidePage'

    function PreviewApp() {
    const [page, setPage] = useState('start') // start | topic | card
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [question, setQuestion] = useState('')
    const [showGuide, setShowGuide] = useState(false)

    if (page === 'start') {
        return <StartPage onStart={() => setPage('topic')} />
    }

    if (page === 'topic') {
        return (
        <>
            <TopicPage
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            question={question}
            onQuestionChange={setQuestion}
            onNext={() => setShowGuide(true)}
            onBack={() => setPage('start')}
            />
            {showGuide && (
            <GuidePage
                onClose={() => setShowGuide(false)}
                onStart={() => {
                setShowGuide(false)
                setPage('card')
                }}
            />
            )}
        </>
        )
    }

    return <p>카드 선택 화면 준비 중</p>
    }

    export default PreviewApp