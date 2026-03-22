const https = require("https");

function callKimi(systemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "moonshot-v1-8k",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 1000
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

  const { question, card, cards, spreadType } = req.body;

  const system = `You are Luna, a wise and empathetic tarot reader. Speak directly to the seeker using "you". Be warm, practical, and empowering. Do not start with "I" or mention you are an AI.`;

  try {
    let userMessage;
    if (spreadType === "three-card" && cards && cards.length === 3) {
      userMessage = question
        ? `The user drew a Past · Present · Future spread.\nPast: "${cards[0].name}" (${cards[0].tag})\nPresent: "${cards[1].name}" (${cards[1].tag})\nFuture: "${cards[2].name}" (${cards[2].tag})\nQuestion: "${question}"\nGive a cohesive 5-7 sentence reading weaving all three cards.`
        : `Past: "${cards[0].name}" (${cards[0].tag})\nPresent: "${cards[1].name}" (${cards[1].tag})\nFuture: "${cards[2].name}" (${cards[2].tag})\nGive a cohesive 5-7 sentence reading.`;
    } else if (card?.name) {
      userMessage = question
        ? `Card: "${card.name}" (${card.tag}). Question: "${question}". Give a 3-4 sentence personalized reading.`
        : `Card: "${card.name}" (${card.tag}). Give a 3-4 sentence general reading.`;
    } else {
      return res.status(400).json({ error: "Missing card data" });
    }

    const reading = await callKimi(system, userMessage);
    res.status(200).json({ reading });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to generate reading" });
  }
};
