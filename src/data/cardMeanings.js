import cardsData from './cards.json'

const ROMAN = [
  '0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI',
]

const GROUPS = {
  major: '메이저 아르카나 · 운명과 정신적 여정',
  wands: '지팡이 · 열정, 행동, 일',
  cups: '컵 · 감정, 사랑, 관계',
  swords: '검 · 이성, 논리, 갈등',
  pentacles: '펜타클 · 현실, 돈, 물질',
}

// 노션 '타로 기본 지식 정리'
const MEANINGS = {
  'the-fool': { name: '바보', meaning: '무한한 잠재력, 얽매이지 않는 자유, 철저한 계획은 없지만 직관에 맡긴 새로운 도약.' },
  'the-magician': { name: '마법사', meaning: '무에서 유를 창조하는 능력, 다재다능함, 모든 준비가 끝난 완벽한 시작.' },
  'the-high-priestess': { name: '고위 여사제', meaning: '내면의 직관과 통찰, 비밀스러움, 섣불리 행동하기보다 관망하는 수동적 지혜.' },
  'the-empress': { name: '여황제', meaning: '물질적/감정적 풍요, 조건 없는 모성애와 생명력, 예술적 감각과 편안함.' },
  'the-emperor': { name: '황제', meaning: '권위와 통제력, 엄격한 규칙과 질서, 세속적인 성공을 이룬 책임감 강한 리더십.' },
  'the-hierophant': { name: '교황', meaning: '정신적인 가르침, 전통과 규범, 기관과의 연계, 신뢰할 수 있는 조언자나 멘토.' },
  'the-lovers': { name: '연인', meaning: '영혼의 강렬한 끌림, 깊은 유대감과 사랑, 완벽한 조화, 매력적이고 중요한 선택.' },
  'the-chariot': { name: '전차', meaning: '방해물을 뚫고 나아가는 강한 의지력, 주도적인 전진, 신속한 추진력과 쟁취한 승리.' },
  strength: { name: '힘', meaning: '외유내강, 부드러운 카리스마로 본능을 다스리는 힘, 내면의 두려움을 극복하는 인내.' },
  'the-hermit': { name: '은둔자', meaning: '외부 활동을 멈춘 깊은 자아 성찰, 고독 속에서 진리를 찾는 구도자, 침체기.' },
  'wheel-of-fortune': { name: '운명의 수레바퀴', meaning: '피할 수 없는 운명적 변화, 새로운 사이클의 회전, 뜻밖의 전환점과 행운.' },
  justice: { name: '정의', meaning: '감정을 배제한 객관적이고 냉철한 판단, 오차 없는 공정함, 인과응보와 법적인 문제.' },
  'the-hanged-man': { name: '매달린 사람', meaning: '상황의 정체기, 깨달음을 위한 자발적인 희생과 기다림, 발상의 전환.' },
  death: { name: '죽음', meaning: '과거와의 철저한 단절, 불필요한 것의 강제적 종료, 극적인 끝이자 새로운 챕터의 시작.' },
  temperance: { name: '절제', meaning: '이질적인 에너지의 융합, 감정과 상황의 밸런스 유지, 인내심을 통한 타협과 치유.' },
  'the-devil': { name: '악마', meaning: '끊어내기 힘든 치명적인 유혹, 물질적/성적 집착, 벗어나기 힘든 구속과 나쁜 습관.' },
  'the-tower': { name: '탑', meaning: '급격하고 충격적인 붕괴, 피할 수 없는 외부의 타격, 낡은 가치관과 상황이 완전히 무너짐.' },
  'the-star': { name: '별', meaning: '절망 끝에 찾아오는 순수한 희망, 예술적 영감, 폭풍우가 지나간 후 맞이하는 평온한 치유.' },
  'the-moon': { name: '달', meaning: '숨겨진 진실이나 적, 모호하고 불확실한 상황, 무의식 깊은 곳의 불안감과 환상.' },
  'the-sun': { name: '태양', meaning: '모든 의혹이 걷힌 명확한 긍정, 눈부신 대성공, 폭발적인 활력과 크게 축하받을 일.' },
  judgement: { name: '심판', meaning: '과거의 노력에 대한 최종 보상과 부활, 결정적인 타이밍, 기다리던 중요한 소식.' },
  'the-world': { name: '세계', meaning: '한 사이클의 완벽한 종료, 목표의 궁극적인 성취, 새로운 차원으로 넘어가는 완벽한 해피엔딩.' },

  'ace-of-wands': { name: '지팡이 에이스', meaning: '일과 행동에 있어서 새로운 에너지의 폭발적인 시작과 열정.' },
  'two-of-wands': { name: '지팡이 2', meaning: '하나의 목표를 이루고, 새로운 방향이나 더 큰 확장을 위해 선택을 고민하는 균형 상태.' },
  'three-of-wands': { name: '지팡이 3', meaning: '기초적인 성장을 마치고 더 넓은 세계로 나아가기 위해 협력하고 미래를 내다봄.' },
  'four-of-wands': { name: '지팡이 4', meaning: '치열한 노력 끝에 맞이하는 안정적인 휴식, 긍정적인 통과 의례(결혼, 이사, 합격).' },
  'five-of-wands': { name: '지팡이 5', meaning: '주도권을 잡기 위한 다수의 치열한 경쟁, 잦은 의견 충돌과 피곤한 갈등 상황.' },
  'six-of-wands': { name: '지팡이 6', meaning: '고난을 이겨내고 승리함, 타인들의 인정과 환호를 한 몸에 받는 조화로운 성취.' },
  'seven-of-wands': { name: '지팡이 7', meaning: '불리하고 버거운 상황 속에서도 고군분투하며 자신의 자리와 신념을 굳건히 방어함.' },
  'eight-of-wands': { name: '지팡이 8', meaning: '방해물 없이 신속하게 진행되는 상황, 빠르고 긍정적인 소식의 갑작스러운 도달.' },
  'nine-of-wands': { name: '지팡이 9', meaning: '이미 상처를 입었음에도 포기하지 않고 끈기 있게 상황을 경계하며 끝까지 버팀.' },
  'ten-of-wands': { name: '지팡이 10', meaning: '혼자 감당하기 벅찬 과부하 상태, 무거운 책임감과 압박감에 짓눌린 힘겨운 결말.' },
  'page-of-wands': { name: '지팡이 시종', meaning: '열정 넘치고 호기심이 많으나 다소 미숙한 시작, 일에 대한 새로운 소식.' },
  'knight-of-wands': { name: '지팡이 기사', meaning: '거침없는 행동력과 맹렬한 추진력, 저돌적이고 진취적으로 상황을 밀어붙이는 인물.' },
  'queen-of-wands': { name: '지팡이 여왕', meaning: '다정함과 카리스마를 동시에 갖춘 성숙함, 포용력 있게 사람들을 이끄는 행동파 리더.' },
  'king-of-wands': { name: '지팡이 왕', meaning: '강한 권위와 열정으로 상황을 완벽하게 통제하고 지배하는 주도적인 최고 권위자.' },

  'ace-of-cups': { name: '컵 에이스', meaning: '감정과 사랑의 풍부한 시작, 기쁨이 넘쳐흐르는 새로운 인간관계의 열림.' },
  'two-of-cups': { name: '컵 2', meaning: '두 사람의 완벽한 마음의 화합, 감정적 교류와 깊은 호감, 긍정적인 계약이나 파트너십.' },
  'three-of-cups': { name: '컵 3', meaning: '여럿이 모여 함께 나누는 기쁨과 축하, 우정의 성장과 즐거운 친목 도모.' },
  'four-of-cups': { name: '컵 4', meaning: '무기력하고 권태로운 정체기, 외부의 새로운 호의나 제안을 거절하고 내면에 침잠함.' },
  'five-of-cups': { name: '컵 5', meaning: '잃어버린 것에 대한 깊은 슬픔과 상실감, 엎질러진 물에 대한 깊은 후회와 좌절.' },
  'six-of-cups': { name: '컵 6', meaning: '과거의 순수했던 시절에 대한 향수, 오래된 인연이나 첫사랑과의 재회, 조건 없는 선의.' },
  'seven-of-cups': { name: '컵 7', meaning: '허황된 환상과 백일몽, 구체적이지 않은 수많은 선택지와 유혹 앞에서의 혼란.' },
  'eight-of-cups': { name: '컵 8', meaning: '감정적인 미련을 뒤로하고 내면의 결핍을 채우기 위해 조용히 떠나는 씁쓸한 이동.' },
  'nine-of-cups': { name: '컵 9', meaning: '물질적, 감정적으로 깊이 만족한 상태, 스스로 누리는 뿌듯한 성취감과 여유.' },
  'ten-of-cups': { name: '컵 10', meaning: '가족이나 사랑하는 사람들과 함께 느끼는 완벽한 감정적 결말, 더할 나위 없는 행복.' },
  'page-of-cups': { name: '컵 시종', meaning: '상상력이 풍부하고 감성적인 인물, 기분 좋은 소식이나 조심스러운 호감의 표현.' },
  'knight-of-cups': { name: '컵 기사', meaning: '로맨틱하고 다정한 제안, 감정을 행동으로 옮겨 부드럽고 매력적으로 다가오는 인물.' },
  'queen-of-cups': { name: '컵 여왕', meaning: '뛰어난 직관과 공감 능력을 갖춘 성숙함, 타인의 감정을 수용하고 이해해 주는 인물.' },
  'king-of-cups': { name: '컵 왕', meaning: '자신의 감정을 흔들림 없이 통제하고 타인을 넓은 마음으로 포용하는 부드러운 권위자.' },

  'ace-of-swords': { name: '검 에이스', meaning: '날카로운 이성과 논리의 시작, 단호한 결단력과 명확한 진실을 꿰뚫어 봄.' },
  'two-of-swords': { name: '검 2', meaning: '외부와의 소통을 차단하고 팽팽한 긴장 속에서 진실을 외면하며 선택을 미루는 상태.' },
  'three-of-swords': { name: '검 3', meaning: '심장에 날카로운 칼이 꽂힌 듯한 깊은 슬픔, 상처, 인간관계에서의 고통스러운 이별.' },
  'four-of-swords': { name: '검 4', meaning: '치열한 생각과 갈등을 잠시 멈추고 고요히 안정을 취하는 휴식과 회복의 시간.' },
  'five-of-swords': { name: '검 5', meaning: '수단과 방법을 가리지 않은 이기적인 승리, 그러나 그로 인한 패배감과 인간관계의 씁쓸한 상실.' },
  'six-of-swords': { name: '검 6', meaning: '갈등과 슬픔을 딛고 더 나은 환경이나 마음의 평온을 향해 조용히 물을 건너 이동함.' },
  'seven-of-swords': { name: '검 7', meaning: '정면돌파를 피하고 요령과 속임수를 부리는 상태, 불안정한 미련과 찝찝한 도피.' },
  'eight-of-swords': { name: '검 8', meaning: '스스로 만든 제약과 두려움에 갇혀 눈을 가린 채 옴짝달싹 못하는 억압된 상황.' },
  'nine-of-swords': { name: '검 9', meaning: '밤잠을 설치게 만드는 극심한 스트레스, 다가오지 않은 일에 대한 불안감과 정신적 고통.' },
  'ten-of-swords': { name: '검 10', meaning: '돌이킬 수 없는 완전한 파국과 철저한 바닥, 극심한 고통이 끝남(역설적인 새로운 시작).' },
  'page-of-swords': { name: '검 시종', meaning: '경계심과 호기심이 많으며 상황을 예리하게 분석하고 정보를 수집하려는 미숙한 자.' },
  'knight-of-swords': { name: '검 기사', meaning: '확고한 논리를 바탕으로 뒤돌아보지 않고 목표를 향해 맹렬하게 베고 돌진하는 자.' },
  'queen-of-swords': { name: '검 여왕', meaning: '감정에 휘둘리지 않는 냉철함, 단호하게 맺고 끊는 능력이 탁월한 이성적인 인물.' },
  'king-of-swords': { name: '검 왕', meaning: '강력한 논리와 이성으로 규칙을 세우고, 상황을 엄격하고 냉정하게 심판하는 권위자.' },

  'ace-of-pentacles': { name: '펜타클 에이스', meaning: '현실적인 이익과 확실한 금전적 기회의 시작, 물질적 안정을 향한 첫걸음.' },
  'two-of-pentacles': { name: '펜타클 2', meaning: '두 가지 금전적 요소나 현실적 상황 사이에서 유연하지만 아슬아슬하게 균형을 잡음.' },
  'three-of-pentacles': { name: '펜타클 3', meaning: '타인(전문가)과의 협력과 논의를 통해 최초의 구체적이고 현실적인 성과를 만들어냄.' },
  'four-of-pentacles': { name: '펜타클 4', meaning: '자신이 가진 재물이나 기득권을 잃지 않으려고 집착하고 방어하는 고착된 안정.' },
  'five-of-pentacles': { name: '펜타클 5', meaning: '현실적인 기반이 무너져 겪는 극심한 금전적 궁핍과 육체적, 심리적 소외감.' },
  'six-of-pentacles': { name: '펜타클 6', meaning: '가진 것을 나누어주는 자선, 공정한 분배, 우위를 점한 상태에서 베푸는 금전적 원조.' },
  'seven-of-pentacles': { name: '펜타클 7', meaning: '그동안의 성과를 가만히 돌아보며, 더 나은 수확과 미래 투자를 위해 고민하는 시간.' },
  'eight-of-pentacles': { name: '펜타클 8', meaning: '꾸준하고 묵묵하게 자신의 기술을 연마하며 장인 정신으로 일에 몰입하는 끈기.' },
  'nine-of-pentacles': { name: '펜타클 9', meaning: '혼자서도 충분히 여유롭고 화려한 일상을 즐길 수 있는 성공적인 개인의 부와 성취.' },
  'ten-of-pentacles': { name: '펜타클 10', meaning: '가문이나 조직 전체가 누리는 확고하고 거대한 번영, 대를 잇는 물질적인 완전한 결말.' },
  'page-of-pentacles': { name: '펜타클 시종', meaning: '신중하고 성실하게 현실적인 배움이나 일을 시작하는 인물, 작지만 확실한 금전적 소식.' },
  'knight-of-pentacles': { name: '펜타클 기사', meaning: '속도는 느리지만 목표를 향해 흔들림 없이 끈기 있고 우직하게 전진하는 신뢰할 수 있는 자.' },
  'queen-of-pentacles': { name: '펜타클 여왕', meaning: '현실적인 안락함과 풍요를 자유자재로 다루며, 주변 사람들을 따뜻하게 챙기는 넉넉한 재력가.' },
  'king-of-pentacles': { name: '펜타클 왕', meaning: '거대한 부와 물질적 성공을 이룩하고 이를 완벽하게 통제하고 다스리는 현실의 최고 권위자.' },
}

export const CARD_IDS = cardsData.cards.map((card) => card.id)

export function getCard(id) {
  const card = cardsData.cards.find((item) => item.id === id)

  return {
    id,
    name: card.name,
    nameKo: MEANINGS[id].name,
    meaning: MEANINGS[id].meaning,
    image: card.image,
    numeral: card.arcana === 'major' ? ROMAN[card.number] : '',
    group: GROUPS[card.suit ?? 'major'],
  }
}
