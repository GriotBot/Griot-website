export default async function handler(req, res) {
  console.log("Received Request:", req.body); // Debugging log

  if (req.method !== "POST") {
    console.log("Invalid Method:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { model, messages } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({ model, messages, max_tokens: 350 })
    });

    console.log("Sent Request to OpenRouter, awaiting response...");

    const data = await response.json();
    console.log("OpenRouter Response:", data);

    return res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error, please try again later." });
  }
}
