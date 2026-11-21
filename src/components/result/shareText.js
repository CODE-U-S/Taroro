import { TOPIC_KO } from './cardInfo'

// 메일 본문으로 보낼 결과 텍스트
export function buildShareText(topic, cards, reading) {
  const cardLines = cards.map((c) => `- ${c.positionKo}: ${c.nameKo} (${c.name})`).join('\n')
  return [
    `[타로로] 오늘의 ${TOPIC_KO[topic] ?? ''} 운세`,
    '',
    reading.title,
    '',
    '선택한 카드',
    cardLines,
    '',
    reading.summary,
    '',
    `조언: ${reading.advice}`,
    '',
    `타로로에서 나도 해보기: ${window.location.origin}`,
  ].join('\n')
}
