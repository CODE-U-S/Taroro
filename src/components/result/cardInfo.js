import cardsData from '../../data/cards.json'

// 결과 화면에서 쓰는 카드 정보 헬퍼 (cards.json은 영어라 한글 이름을 여기서 붙인다)

const MAJOR_NAMES_KO = {
  'the-fool': '바보',
  'the-magician': '마법사',
  'the-high-priestess': '고위 여사제',
  'the-empress': '여황제',
  'the-emperor': '황제',
  'the-hierophant': '교황',
  'the-lovers': '연인',
  'the-chariot': '전차',
  strength: '힘',
  'the-hermit': '은둔자',
  'wheel-of-fortune': '운명의 수레바퀴',
  justice: '정의',
  'the-hanged-man': '매달린 사람',
  death: '죽음',
  temperance: '절제',
  'the-devil': '악마',
  'the-tower': '탑',
  'the-star': '별',
  'the-moon': '달',
  'the-sun': '태양',
  judgement: '심판',
  'the-world': '세계',
}

const SUIT_KO = { wands: '지팡이', cups: '컵', swords: '검', pentacles: '펜타클' }

const RANK_KO = {
  ace: '에이스',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  page: '시종',
  knight: '기사',
  queen: '여왕',
  king: '왕',
}

export const POSITION_KO = { past: '과거', present: '현재', future: '미래' }

export const TOPIC_KO = {
  love: '연애',
  money: '금전',
  study: '학업',
  career: '진로',
}

function getKoreanName(card) {
  if (MAJOR_NAMES_KO[card.id]) return MAJOR_NAMES_KO[card.id]
  const suit = SUIT_KO[card.suit]
  const rank = RANK_KO[card.rank]
  return suit && rank ? `${suit} ${rank}` : card.name
}

// [{ id, position }] → 화면 표시에 필요한 카드 정보 배열
export function resolveCards(selected = []) {
  return selected
    .map(({ id, position }) => {
      const card = cardsData.cards.find((c) => c.id === id)
      if (!card) return null
      return {
        id: card.id,
        name: card.name,
        nameKo: getKoreanName(card),
        image: card.image,
        position,
        positionKo: POSITION_KO[position] ?? position,
      }
    })
    .filter(Boolean)
}
