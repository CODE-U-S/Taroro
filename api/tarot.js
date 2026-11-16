import cardsData from "../src/data/cards.json" with { type: "json" };
import { createFallbackReading } from "../src/utils/fallbackReading.js";

const topicNames = {
  love: "연애운",
  money: "금전운",
  study: "학업운",
  career: "진로운",
};

const positions = ["past", "present", "future"];
const positionNames = ["과거", "현재", "미래"];

export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "POST 요청만 가능합니다.",
    });
  }

  const { topic, question = "", cards } = req.body ?? {};

  // 요청 데이터 검사
  if (!Object.hasOwn(topicNames, topic)) {
    return res.status(400).json({
      error: "올바른 타로 주제를 선택해 주세요.",
    });
  }

  if (
    typeof question !== "string" ||
    question.length > 300 ||
    !Array.isArray(cards) ||
    cards.length !== 3
  ) {
    return res.status(400).json({
      error: "질문 또는 카드 데이터가 올바르지 않습니다.",
    });
  }

  // 실제 카드 데이터에서 선택한 카드 확인
  const selectedCards = cards.map((item, index) => {
    const card = cardsData.cards.find((c) => c.id === item?.id);

    if (!card || item.position !== positions[index]) {
      return null;
    }

    return {
      id: card.id,
      name: card.name,
      suit: card.suit,
      position: positionNames[index],
      meaning: card.upright,
      keywords: card.keywords,
    };
  });

  if (
    selectedCards.includes(null) ||
    new Set(selectedCards.map((c) => c.id)).size !== 3
  ) {
    return res.status(400).json({
      error: "유효하지 않거나 중복된 카드입니다.",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Gemini API 키가 설정되지 않았습니다.",
    });
  }

  // Gemini에게 전달할 프롬프트
  const prompt = `
너는 타로 카드를 상징적으로 해석하는 상담사야.

아래 정보를 바탕으로 한국어 타로 해석을 작성해.

주제: ${topicNames[topic]}
질문: ${question.trim() || "이 주제에 대한 전반적인 흐름"}
선택 카드: ${JSON.stringify(selectedCards)}

해석 규칙:
1. 과거, 현재, 미래 순서로 해석한다.
2. 카드별 기본 의미를 반영한다.
3. 자연스럽고 친근한 한국어로 작성한다.
4. 미래를 확정적으로 예언하지 않는다.
5. 사용자가 자신의 상황을 돌아볼 수 있도록 한다.
6. title은 짧은 제목으로 작성한다.
7. summary는 카드 세 장을 종합해 3~5문장으로 작성한다.
8. advice는 실천 가능한 조언 1~2문장으로 작성한다.
9. JSON 속성은 title, summary, advice를 사용한다.
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseJsonSchema: {
              type: "object",
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                advice: { type: "string" },
              },
              required: ["title", "summary", "advice"],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    if (!response.ok) {
      console.error("Gemini API 오류:", response.status);

      return res.status(200).json(createFallbackReading(topic, selectedCards));
    }

    const data = await response.json();

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("");

    if (!text) {
      return res.status(200).json(createFallbackReading(topic, selectedCards));
    }

    const result = JSON.parse(text);

    if (
      !["title", "summary", "advice"].every(
        (key) => typeof result[key] === "string",
      )
    ) {
      throw new Error("잘못된 응답 구조");
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Taroro API 오류:", error.message);

    return res.status(200).json(createFallbackReading(topic, selectedCards));
  }
}
