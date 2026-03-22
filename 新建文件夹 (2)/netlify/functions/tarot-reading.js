const https = require("https");

function callQwen(systemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "moonshot-v1-8k",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 400
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
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  console.log("KEY_CHECK:", process.env.KIMI_API_KEY ? "Key exists, length=" + process.env.KIMI_API_KEY.length : "KEY IS UNDEFINED");
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const { question, card, cards, spreadType, isDailyCard, zodiac } = body;

    let systemPrompt = `You are Luna, a warm and insightful tarot reader with a poetic, mystical voice.
Speak directly to the seeker in second person. Be specific, emotionally resonant, and practical.
Never use generic platitudes. Keep the tone intimate and grounded.`;

    let userMessage = "";

    if (isDailyCard && card && zodiac) {
      systemPrompt += ` The seeker is a ${zodiac}.`;
      userMessage = `Give a brief daily guidance reading (2-3 sentences) for ${zodiac} who drew: ${card.name} (${card.tag}). Be encouraging and specific to today's energy.`;

    } else if (spreadType === "three-card" && cards) {
      userMessage = question
        ? `The seeker asks: "${question}"\n\nThree cards:\nPast: ${cards[0].name} (${cards[0].tag})\nPresent: ${cards[1].name} (${cards[1].tag})\nFuture: ${cards[2].name} (${cards[2].tag})\n\nWeave all three into a cohesive narrative. 5-6 sentences.`
        : `Three cards:\nPast: ${cards[0].name} (${cards[0].tag})\nPresent: ${cards[1].name} (${cards[1].tag})\nFuture: ${cards[2].name} (${cards[2].tag})\n\nWeave all three into a cohesive narrative. 5-6 sentences.`;

    } else if (card) {
      userMessage = question
        ? `The seeker asks: "${question}"\n\nCard drawn: ${card.name} (${card.tag})\n\nGive a personalized reading in 3-4 sentences.`
        : `Card drawn: ${card.name} (${card.tag})\n\nGive a general reading in 3-4 sentences.`;

    } else {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
    }

    const reading = await callQwen(systemPrompt, userMessage);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ reading })
    };

  } catch (err) {
    console.error("tarot-reading error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Luna is unavailable. Please try again." })
    };
  }
};
