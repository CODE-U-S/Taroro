
    function StartPage({ onStart, onGuide }) {
    return (
        <main className="start-page">
        <header className="top-header">
            <div className="brand">
            <span className="brand-symbol">✦</span>
            TARORO
            </div>
            <button className="header-guide" onClick={onGuide}>
            이용 방법
            </button>
        </header>

        <section className="start-content">
            <div className="start-decoration">
            <span className="star star-one">✧</span>
            <span className="star star-two">✦</span>
            <span className="star star-three">✧</span>
            <div className="tarot-orbit">
                <div className="tarot-card">
                <span className="card-top">✦</span>
                <span className="card-moon">☾</span>
                <span className="card-bottom">TAROT</span>
                </div>
            </div>
            </div>

            <p className="start-eyebrow">
            YOUR MOMENT, YOUR DESTINY
            </p>

            <h1>
            오늘의 운세를
            <br />
            <span>타로로 만나보세요.</span>
            </h1>

            <p className="start-description">
            마음속에 담아둔 질문이 있나요?
            <br />
            TARORO와 함께 나만의 카드를 만나보세요.
            </p>

            <button className="primary-button start-button" onClick={onStart}>
            타로 시작하기
            <span>→</span>
            </button>

            <p className="start-caption">
            당신의 하루에 작은 영감을 전합니다.
            </p>
        </section>

        <footer className="start-footer">
            <span>✦ TARORO</span>
            <span>Find your own answer</span>
        </footer>
        </main>
    )
    }

    export default StartPage
