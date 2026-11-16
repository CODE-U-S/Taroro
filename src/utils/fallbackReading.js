const majorMeanings = {
  "the-fool": "새로운 시작과 도전",
  "the-magician": "자신감과 실행력",
  "the-high-priestess": "직관과 내면의 지혜",
  "the-empress": "풍요와 성장",
  "the-emperor": "안정과 책임",
  "the-hierophant": "전통과 배움",
  "the-lovers": "사랑과 중요한 선택",
  "the-chariot": "의지와 추진력",
  strength: "용기와 인내",
  "the-hermit": "성찰과 자기 탐색",
  "wheel-of-fortune": "변화와 새로운 기회",
  justice: "균형과 공정한 판단",
  "the-hanged-man": "새로운 관점",
  death: "끝맺음과 변화",
  temperance: "조화와 균형",
  "the-devil": "집착과 속박",
  "the-tower": "예상치 못한 변화",
  "the-star": "희망과 회복",
  "the-moon": "불확실함과 내면의 감정",
  "the-sun": "기쁨과 긍정적인 에너지",
  judgement: "성찰과 새로운 깨달음",
  "the-world": "완성과 성취",
};

const suitMeanings = {
  wands: "열정과 행동",
  cups: "감정과 인간관계",
  swords: "생각과 판단",
  pentacles: "현실적인 안정과 성취",
};

const topicNames = {
  love: "연애운",
  money: "금전운",
  study: "학업운",
  career: "진로운",
};

const topicAdvice = {
  love: "자신의 감정을 돌아보고 상대방과 솔직하게 소통해 보세요.",
  money: "현재의 소비와 재정 상황을 차분히 점검해 보세요.",
  study: "작은 학습 목표부터 세워 꾸준히 실천해 보세요.",
  career: "자신의 강점과 관심사를 기준으로 다음 선택을 고민해 보세요.",
};

function getCardMeaning(card) {
  if (majorMeanings[card.id]) {
    return majorMeanings[card.id];
  }

  const suit = String(card.suit || "").toLowerCase();

  return suitMeanings[suit] || "변화와 새로운 가능성";
}

export function createFallbackReading(topic, cards) {
  const summary = cards
    .map((card) => {
      const meaning = getCardMeaning(card);

      return `${card.position}의 ${card.name} 카드는 ${meaning}과 관련된 상징을 담고 있어요.`;
    })
    .join(" ");

  return {
    title: `${topicNames[topic] || "오늘의"} 타로 메시지`,
    summary:
      summary + " 이 카드들을 통해 자신의 상황과 앞으로의 선택을 돌아보세요.",
    advice:
      topicAdvice[topic] ||
      "현재 상황을 돌아보고 자신에게 필요한 선택을 생각해 보세요.",
    source: "fallback",
  };
}
