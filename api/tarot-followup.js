const https = require("https");

function callKimi(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "moonshot-v1-8k",
      messages,
      max_tokens: 500
    });

    const options = {
      hostname: "api.moonshot.cn",
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.KIMI_API_KEY,
        "Content-Length": Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.choices && parsed.choices[0]) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error("Unexpected: " + data));
          }
        } catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question, card, cards, spreadType, followUpQuestion, conversationHistory = [] } = req.body;

  if (!followUpQuestion?.trim()) return res.status(400).json({ error: "Missing follow-up question" });

  let cardContext;
  if (spreadType === "three-card" && cards?.length === 3) {
    cardContext = `Past: "${cards[0].name}", Present: "${cards[1].name}", Future: "${cards[2].name}"`;
  } else if (card?.name) {
    cardContext = `Card: "${card.name}" (${card.tag})`;
  } else {
    return res.status(400).json({ error: "Missing card data" });
  }

  const systemPrompt = `You are Luna, a warm tarot reader. ${cardContext}${question ? ` Original question: "${question}"` : ""} Answer follow-ups in 2-4 sentences. Use "you". Don't start with "I".`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: followUpQuestion }
  ];

  try {
    const reply = await callKimi(messages);
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to generate response" });
  }
};
