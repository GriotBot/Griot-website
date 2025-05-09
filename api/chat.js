export default async function handler(req, res) {
  if (req.method !== "POST") {
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

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong, please try again later." });
  }
}
