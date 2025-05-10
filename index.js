async function fetchBotResponse(userMessage) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 350
      })
    });

    console.log("API Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Details:", errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || "Unknown issue"}`);
    }

    const data = await response.json();
    console.log("Full API Response:", data);

    return data.choices?.[0]?.message?.content || "OpenRouter responded, but no message found...";
  } catch (error) {
    console.error("Error fetching bot response:", error);
    return `Error: ${error.message}`;
  }
}
