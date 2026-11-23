import { useState } from "react";
import StartPage from "./pages/StartPage";
import TopicPage from "./pages/TopicPage";
import GuidePage from "./components/GuidePage";
import CardPage from "./pages/CardPage";
import ResultPage from "./pages/ResultPage";

function PreviewApp() {
  const [page, setPage] = useState("start");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [question, setQuestion] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [cards, setCards] = useState([]);

  if (page === "start") {
    return <StartPage onStart={() => setPage("topic")} />;
  }

  if (page === "topic") {
    return (
      <>
        <TopicPage
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          question={question}
          onQuestionChange={setQuestion}
          onNext={() => setShowGuide(true)}
          onBack={() => setPage("start")}
        />
        {showGuide && (
          <GuidePage
            onClose={() => setShowGuide(false)}
            onStart={() => {
              setShowGuide(false);
              setPage("card");
            }}
          />
        )}
      </>
    );
  }

  if (page === "card") {
    return (
      <CardPage
        onBack={() => setPage("topic")}
        // 결과 화면에서 돌아오면 선택한 3장을 복원
        initialPickedIds={
          cards.length > 0 ? cards.map((card) => card.id) : null
        }
        onComplete={(picked) => {
          setCards(picked);
          setPage("result");
        }}
      />
    );
  }

  return (
    <ResultPage
      topic={selectedTopic}
      question={question}
      cards={cards}
      // 이전: 카드 3장을 유지하고 설명 화면으로 이동
      onBack={() => setPage("card")}
      onHome={() => {
        setSelectedTopic(null);
        setQuestion("");
        setCards([]);
        setPage("start");
      }}
      onRetry={() => {
        setCards([]);
        setPage("card");
      }}
    />
  );
}

export default PreviewApp;
