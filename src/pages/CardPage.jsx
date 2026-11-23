import { useEffect, useState } from 'react'
import CardDetail from '../components/card/CardDetail'
import CardSelect from '../components/card/CardSelect'
import { POSITIONS } from '../components/card/positions'
import { getCard } from '../data/cardMeanings'
import './CardPage.css'

// onComplete: [{ id, position }] 3장을 결과 화면으로 넘긴다 (api/tarot.js 요청 형식)
function CardPage({ onBack, onComplete }) {
  const [pickedIds, setPickedIds] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pickedIds])

  const handleConfirm = () => {
    onComplete(pickedIds.map((id, index) => ({ id, position: POSITIONS[index].id })))
  }

  return (
    <main className="card-page">
      <img className="card-moons" src="/images/moons.png" alt="" width="598" height="204" />

      {pickedIds ? (
        <CardDetail
          cards={pickedIds.map((id, index) => ({ ...getCard(id), position: POSITIONS[index].label }))}
          onReselect={() => setPickedIds(null)}
          onConfirm={handleConfirm}
        />
      ) : (
        <CardSelect onBack={onBack} onSelect={setPickedIds} />
      )}

      <footer className="card-footer">
        <span>TARORO · 나를 만나는 작은 여정</span>
        <span>운명과 정신적 여정 / 00 — XXI</span>
      </footer>
    </main>
  )
}

export default CardPage
