import { CARD_IDS, getCard } from '../../data/cardMeanings'

// 결과 화면에서 쓰는 카드 정보 헬퍼 (카드 이름·이미지는 data/cardMeanings.js의 getCard 사용)

export const POSITION_KO = { past: '과거', present: '현재', future: '미래' }

export const TOPIC_KO = {
  love: '연애',
  money: '금전',
  study: '학업',
  career: '진로',
}

// [{ id, position }] → 화면 표시에 필요한 카드 정보 배열
export function resolveCards(selected = []) {
  return selected
    .filter(({ id }) => CARD_IDS.includes(id))
    .map(({ id, position }) => {
      const card = getCard(id)
      return {
        id: card.id,
        name: card.name,
        nameKo: card.nameKo,
        image: card.image,
        position,
        positionKo: POSITION_KO[position] ?? position,
      }
    })
}
