export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { model, messages } = req.body;

  try {
    console.log("Sending request to OpenRouter...");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    console.log("Full OpenRouter Response:", JSON.stringify(data, null, 2));

    // ✅ Extract chatbot response
    const botMessage = data.choices?.[0]?.message?.content || "GriotBot is silent...";
    
    return res.status(200).json({ botMessage });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error, please try again later." });
  }
}
