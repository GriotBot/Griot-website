async function fetchBotResponse(userMessage) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_API_KEY_HERE"  // 🔥 API Key is directly embedded here
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    if (!response.ok) throw new Error("Failed to reach OpenRouter.");
    const data = await response.json();
    console.log("OpenRouter Response:", data);  // Debugging log

    return data.choices?.[0]?.message?.content || "GriotBot is silent...";
  } catch (error) {
    console.error("Error:", error);
    return "Something went wrong...";
  }
}
