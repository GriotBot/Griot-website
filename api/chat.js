export default async function handler(req, res) {
  console.log("Received request:", req.body); // Log incoming request
  console.log("Using API Key:", process.env.OPENROUTER_API_KEY ? "Exists" : "Missing"); // Check API key

  if (req.method !== "POST") {
    console.log("Invalid Method:", req.method);
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
      body: JSON.stringify({ model, messages, max_tokens: 350 })
    });

    console.log("Received response from OpenRouter:", response.status);
    const data = await response.json();
    console.log("OpenRouter Response Data:", data);

    return res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error, please try again later." });
  }
}
