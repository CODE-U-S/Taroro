import { useEffect, useState } from 'react'
import { CARD_IDS } from '../../data/cardMeanings'
import { POSITIONS } from './positions'
import './CardSelect.css'

const FAN_SIZE = 22

// 78장을 섞어서 앞의 22장을 펼친다
function drawCards() {
  const ids = [...CARD_IDS]
  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = ids[i]
    ids[i] = ids[j]
    ids[j] = temp
  }
  return ids.slice(0, FAN_SIZE)
}

function CardSelect({ onBack, onComplete }) {
  const [cards, setCards] = useState(drawCards)
  const [selected, setSelected] = useState([])
  const [round, setRound] = useState(0)

  const isFull = selected.length === POSITIONS.length
  const center = (cards.length - 1) / 2

  useEffect(() => {
    if (!isFull) return
    const timer = setTimeout(() => onComplete(selected), 700)
    return () => clearTimeout(timer)
  }, [isFull, selected, onComplete])

  const handlePick = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id))
    } else if (!isFull) {
      setSelected([...selected, id])
    }
  }

  const handleShuffle = () => {
    setCards(drawCards())
    setSelected([])
    setRound(round + 1)
  }

  return (
    <>
      <button type="button" className="card-back-button" onClick={onBack}>
        ← 뒤로
      </button>

      <header className="card-hero">
        <h1 className="card-title">지금, 당신을 부르는 카드</h1>
        <p className="card-subtitle">
          마음속에 질문을 떠올리고, 가장 끌리는 카드 세 장을 골라보세요.
        </p>
      </header>

      <div key={round} className={`card-fan${isFull ? ' is-full' : ''}`}>
        {cards.map((id, index) => {
          const order = selected.indexOf(id)
          const offset = index - center
          const position = POSITIONS[order]

          return (
            <button
              key={id}
              type="button"
              className={`card-fan-card${position ? ' is-selected' : ''}`}
              style={{ '--offset': offset, '--layer': 100 - Math.abs(offset) * 2 }}
              onClick={() => handlePick(id)}
              aria-pressed={Boolean(position)}
              aria-label={position ? `카드 ${index + 1} (${position.label})` : `카드 ${index + 1}`}
            >
              {position && <span className="card-fan-badge">{position.label}</span>}
            </button>
          )
        })}
      </div>

      <button type="button" className="card-shuffle" onClick={handleShuffle}>
        <span className="card-shuffle-icon" aria-hidden="true">
          ↻
        </span>
        카드 다시 섞기
      </button>
    </>
  )
}

export default CardSelect
