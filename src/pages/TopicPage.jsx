import { useEffect, useRef } from "react";
import "./TopicPage.css";

// id는 api/tarot.js 가 받는 topic 값(love, money, study, career)과 같아야 합니다.
const topics = [
  {
    id: "study",
    name: "학업",
    questions: [
      "앞으로 공부 흐름은 어떻게 이어질까요?",
      "집중력을 높이려면 무엇이 필요할까요?",
      "시험 준비에서 신경 써야 할 점은 무엇일까요?",
    ],
  },
  {
    id: "love",
    name: "연애",
    questions: [
      "앞으로의 연애운은 어떨까요?",
      "새로운 인연이 찾아올까요?",
      "지금 내 마음을 어떻게 전하면 좋을까요?",
    ],
  },
  {
    id: "money",
    name: "금전",
    questions: [
      "앞으로의 금전 흐름은 어떨까요?",
      "지금의 소비 습관에서 돌아볼 점은 무엇일까요?",
      "재정적인 기회가 찾아올까요?",
    ],
  },
  {
    id: "career",
    name: "진로",
    questions: [
      "나에게 맞는 진로의 방향은 무엇일까요?",
      "지금 고민 중인 선택에서 중요하게 볼 점은 무엇일까요?",
      "나의 강점을 어떻게 살릴 수 있을까요?",
    ],
  },
];

const MAX_QUESTION_LENGTH = 300; // api/tarot.js 의 질문 길이 제한과 동일

// 주제 선택 화면
// selectedTopic / onSelectTopic : 선택한 주제 id (love, money, study, career)
// question / onQuestionChange   : 선택 또는 직접 입력한 질문 (선택사항)
// onNext                        : 이용 방법 안내(GuidePage)로 이동
// onBack                        : 시작 화면으로 돌아가기 (선택)
function TopicPage({
  selectedTopic,
  onSelectTopic,
  question = "",
  onQuestionChange,
  onNext,
  onBack,
}) {
  const panelRef = useRef(null);
  const current = topics.find((topic) => topic.id === selectedTopic);

  // 주제를 고르면 질문 영역이 화면에 보이도록 스크롤
  useEffect(() => {
    if (!current || !panelRef.current) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    panelRef.current.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
  }, [current]);

  const handleSelect = (id) => {
    // 주제가 바뀌면 이전 주제의 질문은 비웁니다.
    if (id !== selectedTopic) onQuestionChange?.("");
    onSelectTopic?.(id);
  };

  return (
    <main className="topic-page">
      {onBack && (
        <button type="button" className="topic-back" onClick={onBack}>
          ← 뒤로
        </button>
      )}

      {/* 달의 위상 장식 */}
      <svg
        className="topic-moons"
        viewBox="0 0 560 60"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="topic-moon-lit" cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#F6E4BC" />
            <stop offset="100%" stopColor="#C6A15B" />
          </radialGradient>
        </defs>

        <path
          d="M0 -9 Q1.2 -1.2 9 0 Q1.2 1.2 0 9 Q-1.2 1.2 -9 0 Q-1.2 -1.2 0 -9 Z"
          transform="translate(22 30)"
          fill="#E3C27A"
        />
        <line
          x1="34"
          y1="30"
          x2="205"
          y2="30"
          stroke="#C6A15B"
          strokeWidth="2"
        />

        {/* 초승달 · 상현 · 보름달 · 하현 · 그믐달 */}
        <g>
          <circle
            cx="232"
            cy="30"
            r="18"
            fill="#6f5b78"
            stroke="#C6A15B"
            strokeWidth="1.5"
          />
          <path
            d="M232 12 A18 18 0 0 0 232 48 A7 18 0 0 0 232 12 Z"
            fill="url(#topic-moon-lit)"
          />
          <circle
            cx="262"
            cy="30"
            r="18"
            fill="#6f5b78"
            stroke="#C6A15B"
            strokeWidth="1.5"
          />
          <path
            d="M262 12 A18 18 0 0 0 262 48 A9 18 0 0 1 262 12 Z"
            fill="url(#topic-moon-lit)"
          />
          <circle
            cx="300"
            cy="30"
            r="24"
            fill="url(#topic-moon-lit)"
            stroke="#C6A15B"
            strokeWidth="1.5"
          />
          <circle
            cx="338"
            cy="30"
            r="18"
            fill="#6f5b78"
            stroke="#C6A15B"
            strokeWidth="1.5"
          />
          <path
            d="M338 12 A18 18 0 0 1 338 48 A9 18 0 0 1 338 12 Z"
            fill="url(#topic-moon-lit)"
          />
          <circle
            cx="368"
            cy="30"
            r="18"
            fill="#6f5b78"
            stroke="#C6A15B"
            strokeWidth="1.5"
          />
          <path
            d="M368 12 A18 18 0 0 1 368 48 A7 18 0 0 0 368 12 Z"
            fill="url(#topic-moon-lit)"
          />
        </g>

        <line
          x1="395"
          y1="30"
          x2="526"
          y2="30"
          stroke="#C6A15B"
          strokeWidth="2"
        />
        <path
          d="M0 -9 Q1.2 -1.2 9 0 Q1.2 1.2 0 9 Q-1.2 1.2 -9 0 Q-1.2 -1.2 0 -9 Z"
          transform="translate(538 30)"
          fill="#E3C27A"
        />
      </svg>

      <h1 className="topic-title">오늘의 운세, 어떤 것이 궁금하신가요?</h1>

      <div className="topic-grid">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className={`topic-item${selectedTopic === topic.id ? " is-selected" : ""}`}
            onClick={() => handleSelect(topic.id)}
            aria-pressed={selectedTopic === topic.id}
            aria-label={`${topic.name} 운세 선택`}
          >
            <span className="topic-card" aria-hidden="true" />
            <span className="topic-label">{topic.name}</span>
          </button>
        ))}
      </div>

      {current && (
        <section className="topic-question" ref={panelRef}>
          <h2 className="topic-question-title">
            {current.name} 운세, 궁금한 점을 골라보세요.
          </h2>

          <ul className="topic-chips">
            {current.questions.map((text) => (
              <li key={text}>
                <button
                  type="button"
                  className={`topic-chip${question === text ? " is-active" : ""}`}
                  onClick={() => onQuestionChange?.(text)}
                  aria-pressed={question === text}
                >
                  {text}
                </button>
              </li>
            ))}
          </ul>

          <label className="topic-input-label" htmlFor="topic-question-input">
            직접 적어도 좋아요 (선택사항)
          </label>
          <textarea
            id="topic-question-input"
            className="topic-input"
            value={question}
            onChange={(event) => onQuestionChange?.(event.target.value)}
            maxLength={MAX_QUESTION_LENGTH}
            placeholder="예: 앞으로 나에게 어떤 좋은 일이 생길까요?"
          />
          <p className="topic-count">
            {question.length} / {MAX_QUESTION_LENGTH}
          </p>

          <button type="button" className="topic-next" onClick={onNext}>
            다음으로
          </button>
        </section>
      )}
    </main>
  );
}

export default TopicPage;
