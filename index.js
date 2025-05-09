const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");
const modelSelector = document.getElementById("modelSelector");

async function fetchBotResponse(userMessage) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",  // Change from GET to POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-4o",  // Adjust if needed
        messages: [{ role: "user", content: userMessage }]
      })
    });

    if (!response.ok) throw new Error("Failed to reach AI server.");
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "GriotBot is silent for now...";
  } catch (error) {
    console.error("Error:", error);
    return "Something went wrong talking to the ancestors...";
  }
}


// Handle Chat Input
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInput = input.value.trim();
  if (!userInput) return;

  appendMessage("user", userInput);
  input.value = "";

  showLoadingIndicator();
  const reply = await fetchBotResponse(userInput);
  removeLoadingIndicator();
  appendMessage("bot", reply);
});

// Message UI Functions
function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.textContent = text;
  chat.appendChild(msg);
  setTimeout(() => chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" }), 100);
}

function showLoadingIndicator() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading";
  chat.appendChild(loadingDiv);
}

function removeLoadingIndicator() {
  const loadingDiv = document.querySelector(".loading");
  if (loadingDiv) chat.removeChild(loadingDiv);
}
