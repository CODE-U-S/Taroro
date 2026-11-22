import { useState } from 'react'
    import StartPage from './pages/StartPage'
    import TopicPage from './pages/TopicPage'
    import GuidePage from './components/GuidePage'
    import CardPage from './pages/CardPage'

    function PreviewApp() {
    const [page, setPage] = useState('start') // start | topic | card | result
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [question, setQuestion] = useState('')
    const [showGuide, setShowGuide] = useState(false)
    const [cards, setCards] = useState([]) // [{ id, position }]

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

    if (page === 'card') {
        return (
        <CardPage
            onBack={() => setPage('topic')}
            onComplete={(picked) => {
            setCards(picked)
            setPage('result')
            }}
        />
        )
    }

    return <p>결과 화면 준비 중 ({cards.map((card) => card.id).join(', ')})</p>
    }

    export default PreviewApp