const https = require("https");

function callKimi(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "moonshot-v1-8k",
      messages,
      max_tokens: 300
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
            reject(new Error("Unexpected response: " + data));
          }
        } catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { followUpQuestion, conversationHistory = [], question, card, cards, spreadType } = req.body;

    if (!followUpQuestion) return res.status(400).json({ error: "No follow-up question provided" });

    const systemPrompt = `You are Luna, a warm tarot reader continuing a conversation about a reading. Be concise (2-3 sentences), warm, and insightful. Stay grounded in the card(s) drawn. Never repeat the initial reading verbatim — build on it.`;

    let contextContent = "";
    if (spreadType === "three-card" && cards) {
      contextContent = `Original question: "${question || "none"}"\nCards — Past: ${cards[0].name}, Present: ${cards[1].name}, Future: ${cards[2].name}`;
    } else if (card) {
      contextContent = `Original question: "${question || "none"}"\nCard drawn: ${card.name} (${card.tag})`;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: contextContent },
      ...conversationHistory,
      { role: "user", content: followUpQuestion }
    ];

    const reply = await callKimi(messages);
    res.status(200).json({ reply });

  } catch (err) {
    console.error("tarot-followup error:", err);
    res.status(500).json({ error: "Luna is unavailable. Please try again." });
  }
};
