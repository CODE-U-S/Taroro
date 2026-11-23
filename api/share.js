import nodemailer from "nodemailer";
import { createHmac } from "node:crypto";
import { createRequire } from "node:module";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// cards.json 경로가 다르면 실제 프로젝트 경로로 변경하세요.
// JSON 파일은 이 API와 함께 서버에 번들되며, 클라이언트의 카드 ID와 동일해야 합니다.
const require = createRequire(import.meta.url);
const deckData = require("../src/data/cards.json");
const deck = Array.isArray(deckData)
  ? deckData
  : Array.isArray(deckData.cards)
    ? deckData.cards
    : [];
const VALID_CARD_IDS = new Set(
  deck
    .map((card) => (typeof card === "string" ? card : card?.id))
    .filter((id) => typeof id === "string"),
);

const TOPICS = {
  love: "연애",
  money: "금전",
  study: "학업",
  career: "진로",
};
const POSITIONS = ["past", "present", "future"];
const POSITION_NAMES = ["과거", "현재", "미래"];

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isText(value, maxLength) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

function isEmail(value) {
  // 헤더 개행, 공백, 긴 주소와 주요 잘못된 형식을 차단하는 실용적 검사
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(
      value,
    ) &&
    !/[\r\n]/.test(value)
  );
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function htmlParagraph(value) {
  return escapeHtml(value.trim()).replace(/\r?\n/g, "<br>");
}

function parseAndValidate(body) {
  if (!isObject(body)) return { error: "요청 본문이 올바르지 않아요." };

  // 지나치게 큰 본문은 처리하지 않음
  if (JSON.stringify(body).length > 14000) {
    return { error: "요청 내용이 너무 길어요." };
  }

  const { email, topic, cards, reading } = body;
  if (!isEmail(email)) return { error: "올바른 이메일 주소를 입력해 주세요." };
  if (!Object.hasOwn(TOPICS, topic))
    return { error: "올바르지 않은 타로 주제예요." };

  if (
    !Array.isArray(cards) ||
    cards.length !== 3 ||
    VALID_CARD_IDS.size === 0
  ) {
    return { error: "카드 3장을 올바르게 전달해 주세요." };
  }

  const ids = new Set();
  for (let i = 0; i < cards.length; i += 1) {
    const card = cards[i];
    if (
      !isObject(card) ||
      typeof card.id !== "string" ||
      !VALID_CARD_IDS.has(card.id) ||
      card.position !== POSITIONS[i] ||
      ids.has(card.id)
    ) {
      return { error: "카드 ID 또는 위치 정보가 올바르지 않아요." };
    }
    ids.add(card.id);
  }

  if (
    !isObject(reading) ||
    !isText(reading.title, 150) ||
    !isText(reading.summary, 5000) ||
    !isText(reading.advice, 2000)
  ) {
    return { error: "공유할 해석 내용이 올바르지 않아요." };
  }

  return {
    value: {
      email: email.trim(),
      topic,
      cards,
      reading: {
        title: reading.title.trim(),
        summary: reading.summary.trim(),
        advice: reading.advice.trim(),
      },
    },
  };
}

function privateRateKey(value) {
  // Redis에는 주소/IP 원문 대신 비밀키로 만든 HMAC만 짧은 시간 보관
  return createHmac("sha256", process.env.GMAIL_APP_PASSWORD)
    .update(value)
    .digest("hex");
}

async function checkRateLimit(email, request) {
  const redis = Redis.fromEnv();
  const recipientLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(1, "1 m"),
    prefix: "taroro:share:recipient",
  });
  const senderLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "taroro:share:sender",
  });

  // Vercel에서 전달하는 사용자 IP. IP 자체는 저장하지 않음.
  const rawIp =
    request.headers["x-vercel-forwarded-for"] ||
    request.headers["x-forwarded-for"] ||
    request.socket?.remoteAddress ||
    "unknown";
  const ip = String(Array.isArray(rawIp) ? rawIp[0] : rawIp)
    .split(",")[0]
    .trim();

  const ipResult = await senderLimit.limit(privateRateKey(`ip:${ip}`));
  if (!ipResult.success) return false;

  const emailResult = await recipientLimit.limit(
    privateRateKey(`email:${email.toLowerCase()}`),
  );
  return emailResult.success;
}

function buildMessage({ email, topic, cards, reading }) {
  const cardLines = cards.map(
    (card, index) => `${POSITION_NAMES[index]}: ${card.id}`,
  );
  const topicLabel = TOPICS[topic];

  const text = [
    "Taroro · 나의 타로 해석",
    "",
    `주제: ${topicLabel}`,
    "",
    "선택한 카드",
    ...cardLines,
    "",
    reading.title,
    "",
    reading.summary,
    "",
    `조언: ${reading.advice}`,
    "",
    "이 메시지는 Taroro에서 결과 공유를 요청해 자동 발송되었습니다.",
  ].join("\n");

  const htmlCards = cards
    .map(
      (card, index) =>
        `<li><strong>${POSITION_NAMES[index]}</strong>: ${escapeHtml(card.id)}</li>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:28px;background:#f4eee3;color:#47214d;font-family:Arial,sans-serif;line-height:1.8">
  <div style="max-width:620px;margin:auto;background:white;border:1px solid #c6a15b;border-radius:16px;padding:28px">
    <h1 style="margin:0;color:#47214d">TARORO</h1>
    <p style="color:#705b74">${escapeHtml(topicLabel)} 타로 리딩 결과</p>
    <h2 style="margin-top:28px">선택한 카드</h2>
    <ol>${htmlCards}</ol>
    <hr style="border:0;border-top:1px solid #c6a15b;margin:24px 0">
    <h2>${htmlParagraph(reading.title)}</h2>
    <p>${htmlParagraph(reading.summary)}</p>
    <h3>오늘의 조언</h3>
    <p>${htmlParagraph(reading.advice)}</p>
    <p style="margin-top:32px;font-size:12px;color:#786b7c">Taroro에서 결과 공유를 요청해 자동 발송한 메일입니다.</p>
  </div>
</body></html>`;

  return {
    from: { name: "Taroro", address: process.env.GMAIL_USER },
    to: email,
    subject: "[Taroro] 나의 타로 해석 결과",
    text,
    html,
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST 요청만 지원해요." });
  }

  if (!String(req.headers["content-type"] || "").includes("application/json")) {
    return res.status(415).json({ error: "JSON 형식으로 요청해 주세요." });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "JSON 형식이 올바르지 않아요." });
  }

  const validated = parseAndValidate(body);
  if (validated.error) return res.status(400).json({ error: validated.error });

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("Gmail 환경변수 확인:", {
      hasUser: Boolean(process.env.GMAIL_USER),
      hasPassword: Boolean(process.env.GMAIL_APP_PASSWORD),
    });
    return res.status(503).json({ error: "메일 서버 설정을 확인해 주세요." });
  }
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return res.status(503).json({ error: "스팸 방지 설정을 확인해 주세요." });
  }

  try {
    const allowed = await checkRateLimit(validated.value.email, req);
    if (!allowed) {
      return res
        .status(429)
        .json({
          error: "잠시 후 다시 전송해 주세요. 전송 횟수 제한에 도달했어요.",
        });
    }
  } catch (error) {
    // 저장소 오류일 때 전송을 계속하면 대량 발송에 악용될 수 있음
    console.error("share rate-limit error:", error?.name || "unknown");
    return res
      .status(503)
      .json({
        error: "메일 전송을 준비하지 못했어요. 잠시 후 다시 시도해 주세요.",
      });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ""),
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.sendMail(buildMessage(validated.value));
    return res.status(200).json({ ok: true });
  } catch (error) {
    // 이메일/비밀번호/메일 본문을 로그에 출력하지 않음
    console.error("share SMTP error:", error?.code || error?.name || "unknown");
    return res
      .status(500)
      .json({ error: "이메일 발송에 실패했어요. 잠시 후 다시 시도해 주세요." });
  }
}
