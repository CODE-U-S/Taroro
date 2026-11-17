
    const topics = [
    {
        id: 'love',
        icon: '♡',
        name: '연애운',
        description: '사랑과 인연에 대한 이야기',
    },
    {
        id: 'money',
        icon: '₩',
        name: '금전운',
        description: '재물과 경제적인 흐름',
    },
    {
        id: 'study',
        icon: '✎',
        name: '학업운',
        description: '공부와 목표에 대한 방향',
    },
    {
        id: 'career',
        icon: '✧',
        name: '진로운',
        description: '미래와 진로에 대한 고민',
    },
    ]

    function TopicPage({
    selectedTopic,
    onSelectTopic,
    question,
    onQuestionChange,
    onNext,
    onBack,
    }) {
    return (
        <main className="topic-page">
        <header className="top-header">
            <button className="back-button" onClick={onBack}>
            ← 뒤로
            </button>

            <div className="brand">
            <span className="brand-symbol">✦</span>
            TARORO
            </div>

            <span className="step-label">01 / 02</span>
        </header>

        <section className="topic-content">
            <p className="section-eyebrow">CHOOSE YOUR DESTINY</p>

            <h1>어떤 이야기가 궁금하신가요?</h1>

            <p className="topic-description">
            지금 가장 마음이 가는 주제를 선택해 주세요.
            </p>

            <div className="topic-grid">
            {topics.map((topic) => (
                <button
                key={topic.id}
                type="button"
                className={`topic-card ${
                    selectedTopic === topic.id ? 'selected' : ''
                }`}
                onClick={() => onSelectTopic(topic.id)}
                aria-pressed={selectedTopic === topic.id}
                >
                <span className="topic-icon">{topic.icon}</span>
                <span className="topic-name">{topic.name}</span>
                <span className="topic-card-description">
                    {topic.description}
                </span>

                {selectedTopic === topic.id && (
                    <span className="selected-check">✓</span>
                )}
                </button>
            ))}
            </div>

            <div className="question-section">
            <label htmlFor="tarot-question">
                나만의 질문을 적어보세요.
                <span> (선택사항)</span>
            </label>

            <textarea
                id="tarot-question"
                value={question}
                onChange={(event) => onQuestionChange(event.target.value)}
                placeholder="예: 앞으로 나에게 어떤 좋은 일이 생길까요?"
                maxLength={200}
            />

            <div className="question-count">
                {question.length} / 200
            </div>
            </div>

            <button
            className="primary-button topic-next-button"
            onClick={onNext}
            disabled={!selectedTopic}
            >
            다음으로
            <span>→</span>
            </button>
        </section>
        </main>
    )
    }

    export default TopicPage
