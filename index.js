async function fetchBotResponse(userMessage) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 350
      })
    });
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    console.log("API Response:", data);

    return data.choices?.[0]?.message?.content || "Something went wrong...";
  } catch (error) {
    console.error("Error fetching bot response:", error);
    return "GriotBot is silent...";
  }
}
