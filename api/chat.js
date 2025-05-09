export default async function handler(req, res) {
  // Only allow POST requests.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Log if the API key from Vercel is there.
  console.log("Using API Key:", process.env.OPENROUTER_API_KEY ? "Exists" : "Missing");

  // Get the model and messages from the request body.
  const { model, messages } = req.body;
  console.log("Received request with:", { model, messages });

  try {
    console.log("Sending request to OpenRouter...");

    // Make the request to OpenRouter.
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({ model, messages })
    });

    // Read the response from OpenRouter.
    const data = await response.json();
    console.log("Full OpenRouter Response:", JSON.stringify(data, null, 2));

    // Extract the chatbot message.
    const botMessage =
      data.choices?.[0]?.message?.content ||
      data.choices?.[0]?.message?.reasoning ||
      "GriotBot is silent...";
    console.log("Extracted Bot Message:", botMessage);

    // Send the chatbot message back to the frontend.
    return res.status(200).json({ botMessage });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error, please try again later." });
  }
}
