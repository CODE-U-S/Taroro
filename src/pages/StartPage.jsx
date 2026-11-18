import './StartPage.css'


function StartPage({ onStart }) {
    return (
        <main className="start-page">
        <header className="start-hero">
            <p className="start-eyebrow">THE CODEUS PROJECT · 22개의 운명</p>
            <h1 className="start-title">TARORO</h1>
            <p className="start-subtitle">마음속에 숨겨진 운명의 이야기를 만나보세요.</p>
        </header>

        <div className="start-cards" aria-hidden="true">
            <span className="start-card start-card--left" />
            <span className="start-card start-card--right" />
            <span className="start-card start-card--center" />
        </div>

        <button
            type="button"
            className="start-button"
            onClick={onStart}
            aria-label="타로 시작하기"
        >
            START
        </button>
        </main>
    )
}

export default StartPage
