export async function getTarotReading(topic, question, cards) {
  const response = await fetch("/api/tarot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      question,
      cards,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "타로 해석 요청 실패");
  }

  return data;
}
