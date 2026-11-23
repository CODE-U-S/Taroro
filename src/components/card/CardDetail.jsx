import { useState } from 'react'
import './CardDetail.css'

function CardDetail({ cards, onReselect, onConfirm }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const card = cards[activeIndex]

  return (
    <>
      <header className="card-hero card-hero-detail">
        <h1 className="card-title">당신에게 도착한 별의 메시지</h1>
        <p className="card-subtitle">지금 당신의 마음에 필요한 이야기를 천천히 읽어보세요.</p>
      </header>

      <section className="card-detail">
        <figure className="card-detail-figure">
          {/* key 가 바뀌면 다시 뒤집힌다 */}
          <div className="card-flip" key={card.id}>
            <img
              className="card-flip-front"
              src={card.image}
              alt={`${card.position} 카드: ${card.nameKo} (${card.name})`}
            />
            <span className="card-flip-back" />
          </div>
          <figcaption className="card-detail-caption">
            {card.numeral && <span className="card-detail-numeral">{card.numeral}</span>}
            <span>{card.name}</span>
          </figcaption>
        </figure>

        <div className="card-detail-body">
          <div className="card-detail-tabs">
            {cards.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="card-detail-tab"
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              >
                {item.position}
              </button>
            ))}
          </div>

          <h2 className="card-detail-title">
            {card.nameKo}
            <span lang="en">{card.name}</span>
          </h2>
          <p className="card-detail-group">{card.group}</p>
          <p className="card-detail-meaning">{card.meaning}</p>

          <div className="card-detail-actions">
            <button type="button" className="card-detail-button" onClick={onReselect}>
              다른 카드 고르기
            </button>
            <button type="button" className="card-detail-button is-primary" onClick={onConfirm}>
              나의 운세 확인하기 →
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default CardDetail
