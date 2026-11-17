
    function GuidePage({ onClose, onStart }) {
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
            className="guide-close"
            onClick={onClose}
            aria-label="안내창 닫기"
            >
            ×
            </button>

            <p className="section-eyebrow">HOW TO USE TARORO</p>

            <div className="guide-symbol">✦</div>

            <h2 id="guide-title">타로 이용 방법</h2>

            <p className="guide-description">
            간단한 세 단계를 통해 나만의 타로를 만나보세요.
            </p>

            <div className="guide-steps">
            <div className="guide-step">
                <div className="guide-step-icon">♡</div>
                <div>
                <strong>STEP 01. 주제 선택</strong>
                <p>궁금한 주제를 선택하고 질문을 입력해 주세요.</p>
                </div>
            </div>

            <div className="guide-step">
                <div className="guide-step-icon">✧</div>
                <div>
                <strong>STEP 02. 카드 선택</strong>
                <p>화면에 나타나는 카드 중 마음이 가는 카드를 선택해 주세요.</p>
                </div>
            </div>

            <div className="guide-step">
                <div className="guide-step-icon">☾</div>
                <div>
                <strong>STEP 03. 타로 결과 확인</strong>
                <p>선택한 카드의 의미와 질문에 대한 해석을 확인해 보세요.</p>
                </div>
            </div>
            </div>

            <button className="primary-button guide-start-button" onClick={onStart}>
            카드 선택하러 가기
            <span>→</span>
            </button>

            <p className="guide-caption">
            타로는 자신을 돌아보는 참고와 영감으로 활용해 주세요.
            </p>
        </section>
        </div>
    )
    }

    export default GuidePage
