
// File: /pages/index.js
import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  useEffect(() => {
    // Any client-side initialization can go here
  }, []);

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div id="header" role="banner">
        <button id="toggleSidebar">☰</button>
        <div className="logo-container">
          <span className="logo-icon">🌿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle"></button>
      </div>
      
      {<!-- HEADER + CONTROLS -->
  <div id="header" role="banner">
    <button id="toggleSidebar" aria-label="Toggle sidebar" aria-expanded="false" aria-controls="sidebar">☰</button>
    <div class="logo-container">
      <span class="logo-icon" aria-hidden="true">🌿</span>
      <span>GriotBot</span>
    </div>
    <button id="themeToggle" aria-label="Toggle dark/light mode"></button>
  </div>

  <!-- SIDEBAR -->
  <nav id="sidebar" aria-hidden="true" aria-label="Main navigation">
    <h2>
      <span class="logo-icon" aria-hidden="true">🌿</span>
      GriotBot
    </h2>
    
    <div class="sidebar-profile">
      <span class="free-badge">Free Account</span>
      <button class="upgrade-btn">Upgrade to Premium</button>
    </div>
    
    <div class="nav-section">
      <h3>Conversations</h3>
      <button id="newChat" aria-label="Start new chat">
        <span aria-hidden="true">+</span> New Chat
      </button>
      <a href="#" id="savedChats">Saved Conversations</a>
    </div>
    
    <div class="nav-section">
      <h3>Explore</h3>
      <a href="#" id="historicalFigures">Historical Figures</a>
      <a href="#" id="culturalStories">Cultural Stories</a>
      <a href="#" id="diasporaMap">Diaspora Map</a>
    </div>
    
    <div class="nav-section">
      <h3>About</h3>
      <a href="about.html">About GriotBot</a>
      <a href="feedback.html">Share Feedback</a>
    </div>
    
    <div class="sidebar-footer">
      "Preserving our stories,<br>empowering our future."
    </div>
  </nav>

  <!-- MAIN CHAT AREA -->
  <main id="chat-container" aria-label="Chat messages">
    <div class="welcome-container" id="welcome">
      <div id="logo" aria-hidden="true">🌿</div>
      <h1 class="welcome-title">Welcome to GriotBot</h1>
      <p class="welcome-subtitle">Your AI companion for culturally rich conversations and wisdom</p>
      
      <div id="quote" aria-label="Inspirational quote">
        "A people without the knowledge of their past history,<br>
        origin and culture is like a tree without roots."
        <span class="quote-attribution">— Marcus Mosiah Garvey</span>
      </div>
      
      <div class="suggestion-cards">
        <div class="suggestion-card" data-prompt="Tell me a story about resilience from the African diaspora">
          <div class="suggestion-category">Storytelling</div>
          <h3 class="suggestion-title">Tell me a diaspora story about resilience</h3>
        </div>
        
        <div class="suggestion-card" data-prompt="Share some wisdom about community building from African traditions">
          <div class="suggestion-category">Wisdom</div>
          <h3 class="suggestion-title">African wisdom on community building</h3>
        </div>
        
        <div class="suggestion-card" data-prompt="How can I connect more with my cultural heritage?">
          <div class="suggestion-category">Personal Growth</div>
          <h3 class="suggestion-title">Connect with my cultural heritage</h3>
        </div>
        
        <div class="suggestion-card" data-prompt="Explain the historical significance of Juneteenth">
          <div class="suggestion-category">History</div>
          <h3 class="suggestion-title">The historical significance of Juneteenth</h3>
        </div>
      </div>
    </div>
    
    <div id="chat" aria-live="polite"></div>
    <div id="empty-state">
      <p>Start a conversation with GriotBot</p>
    </div>
  </main>

  <!-- MESSAGE INPUT -->
  <div id="form-container">
    <form id="form" aria-label="Message form">
      <div class="input-wrapper">
        <textarea 
          id="input" 
          placeholder="Ask GriotBot about Black history, culture, or personal advice..." 
          required 
          aria-label="Message to send"
          rows="1"
        ></textarea>
        <button id="send" type="submit" aria-label="Send message">
          <div id="send-icon">↑</div>
          <div id="send-loading" class="spinner" style="display: none;"></div>
        </button>
      </div>
      
      <div class="form-actions">
        <div class="form-info">Free users: 30 messages per day</div>
        
        <div class="storyteller-mode">
          <label for="storytellerMode">
            Storyteller Mode
            <div class="toggle-switch">
              <input type="checkbox" id="storytellerMode">
              <span class="slider"></span>
            </div>
          </label>
        </div>
      </div>
    </form>
  </div>

  <!-- RANDOM PROVERB & COPYRIGHT -->
  <div id="fact" aria-label="Random proverb"></div>
  <div id="copyright" aria-label="Copyright information">© 2025 GriotBot. All rights reserved.</div>

  <script>
    //–– ELEMENT REFERENCES ––
    const sidebar        = document.getElementById('sidebar');
    const toggleBtn      = document.getElementById('toggleSidebar');
    const themeToggle    = document.getElementById('themeToggle');
    const chatContainer  = document.getElementById('chat-container');
    const welcomeDiv     = document.getElementById('welcome');
    const chat           = document.getElementById('chat');
    const emptyState     = document.getElementById('empty-state');
    const form           = document.getElementById('form');
    const input          = document.getElementById('input');
    const sendBtn        = document.getElementById('send');
    const sendIcon       = document.getElementById('send-icon');
    const sendLoading    = document.getElementById('send-loading');
    const factElement    = document.getElementById('fact');
    const newChatBtn     = document.getElementById('newChat');
    const storyMode      = document.getElementById('storytellerMode');
    const suggestionCards= document.querySelectorAll('.suggestion-card');

    //–– 1. SANITIZER TO PREVENT XSS ––
    function sanitize(text) {
      const d = document.createElement('div');
      d.textContent = text;
      return d.innerHTML;
    }

    //–– 2. AUTO-EXPAND TEXTAREA ––
    function autoExpand(field) {
      // Reset field height
      field.style.height = 'inherit';
    
      // Calculate the height
      const computed = window.getComputedStyle(field);
      const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                   + parseInt(computed.getPropertyValue('padding-top'), 10)
                   + field.scrollHeight
                   + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                   + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    
      field.style.height = `${Math.min(height, 120)}px`;
    }
    
    // Apply auto-expand to input field
    input.addEventListener('input', () => {
      autoExpand(input);
    });

    //–– 3. SIDEBAR TOGGLE ––
    toggleBtn.addEventListener('click', () => {
      const visible = sidebar.classList.toggle('visible');
      toggleBtn.setAttribute('aria-expanded', visible);
      sidebar.setAttribute('aria-hidden', !visible);
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (event) => {
      if (sidebar.classList.contains('visible') && 
          !sidebar.contains(event.target) && 
          !toggleBtn.contains(event.target)) {
        sidebar.classList.remove('visible');
        toggleBtn.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
      }
    });

    //–– 4. THEME TOGGLE ––
    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('griotbot-theme', theme);
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', 
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    
    // Initialize theme from localStorage or user preference
    (function() {
      const savedTheme = localStorage.getItem('griotbot-theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Check for system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    })();
    
    // Handle theme toggle click
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    //–– 5. RANDOM PROVERB ––
    const proverbs = [
      "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
      "Until the lion learns to write, every story will glorify the hunter. — African Proverb",
      "We are the drums, we are the dance. — Afro-Caribbean Proverb",
      "A tree cannot stand without its roots. — Jamaican Proverb",
      "Unity is strength, division is weakness. — Swahili Proverb",
      "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
      "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
      "A bird will always use another bird's feathers to feather its nest. — Ashanti Proverb",
      "You must act as if it is impossible to fail. — Yoruba Wisdom",
      "The child who is not embraced by the village will burn it down to feel its warmth. — West African Proverb",
      "However long the night, the dawn will break. — African Proverb",
      "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
      "It takes a village to raise a child. — African Proverb",
      "The fool speaks, the wise listen. — Ethiopian Proverb",
      "When the music changes, so does the dance. — Haitian Proverb"
    ];
    
    function showRandomProverb() {
      const randomIndex = Math.floor(Math.random() * proverbs.length);
      factElement.textContent = proverbs[randomIndex];
      factElement.setAttribute('aria-label', `Proverb: ${proverbs[randomIndex]}`);
    }

    //–– 6. CHAT HISTORY (localStorage) ––
    const HISTORY_LIMIT = 50; // Maximum number of messages to store
    
    function loadChatHistory() {
      try {
        const hist = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
        if (hist.length > 0) {
          hideWelcome();
          hist.forEach(m => appendMessage(m.role, m.content, m.time, false));
        } else {
          showWelcome();
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
        localStorage.removeItem('griotbot-history');
      }
    }
    
    function saveChatHistory() {
      const msgs = Array.from(chat.querySelectorAll('.message:not(.thinking)'))
        .map(el => ({ 
          role: el.classList.contains('user') ? 'user' : 'bot', 
          content: el.textContent,
          time: el.getAttribute('data-time') || new Date().toISOString()
        }))
        .slice(-HISTORY_LIMIT); // Keep only the most recent messages
        
      localStorage.setItem('griotbot-history', JSON.stringify(msgs));
    }

    //–– 7. APPEND MESSAGE & AUTO‑SCROLL ––
    function appendMessage(role, text, timestamp = null, save = true) {
      const now = timestamp || new Date().toISOString();
      const msg = document.createElement('div');
      msg.className = `message ${role}`;
      msg.setAttribute('data-time', now);
      
      // Format the message with appropriate wrapper
      if (role === 'user') {
        msg.innerHTML = sanitize(text);
        msg.setAttribute('aria-label', `You: ${text}`);
      } else {
        // Format bot message with header and process for proverbs
        const formattedText = formatBotMessage(text);
        msg.innerHTML = `
          <div class="bot-header">
            <span class="logo-icon" aria-hidden="true">🌿</span>
            <span class="bot-name">GriotBot</span>
          </div>
          ${formattedText}
          <div class="message-time">${formatTime(now)}</div>
        `;
        msg.setAttribute('aria-label', `GriotBot: ${text}`);
      }
      
      chat.appendChild(msg);
      scrollToBottom();
      
      if (save) saveChatHistory();
      return msg;
    }
    
    function formatBotMessage(text) {
      // Detect and format proverbs (text between quotation marks)
      // This is a simple implementation - a more robust version would use regex
      let formattedText = text;
      
      // Check for quoted proverbs and wrap them
      if (text.includes('"') && text.indexOf('"') !== text.lastIndexOf('"')) {
        const segments = text.split('"');
        for (let i = 1; i < segments.length; i += 2) {
          if (segments[i].trim().length > 0) {
            segments[i] = `<div class="message-proverb">"${segments[i]}"</div>`;
          }
        }
        formattedText = segments.join('');
      }
      
      // Check for line breaks and create paragraphs
      formattedText = formattedText.split('\n\n').map(para => {
        if (para.trim().length > 0) {
          return `<p>${para.replace(/\n/g, '<br>')}</p>`;
        }
        return '';
      }).join('');
      
      return formattedText;
    }
    
    function formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    function scrollToBottom() {
      chatContainer.scrollTo({ 
        top: chatContainer.scrollHeight, 
        behavior: 'smooth' 
      });
    }

    //–– 8. UI STATE MANAGEMENT ––
    function hideWelcome() {
      welcomeDiv.style.display = 'none';
      emptyState.style.display = 'none';
    }
    
    function showWelcome() {
      welcomeDiv.style.display = 'flex';
      if (chat.childElementCount === 0) {
        emptyState.style.display = 'none';
      }
    }
    
    function setLoadingState(isLoading) {
      input.disabled = isLoading;
      sendBtn.disabled = isLoading;
      sendIcon.style.display = isLoading ? 'none' : 'inline-block';
      sendLoading.style.display = isLoading ? 'inline-block' : 'none';
    }

    //–– 9. SEND MESSAGE HANDLER ––
form.addEventListener('submit', async e => {
  e.preventDefault();
  const userInput = input.value.trim();
  if (!userInput) return;
  
  // Set UI to loading state
  setLoadingState(true);
  hideWelcome();
  
  // Get storyteller mode state
  const isStorytellerMode = storyMode.checked;
  
  // Add user message
  appendMessage('user', userInput);
  input.value = '';
  input.style.height = 'inherit'; // Reset height
  
  // Add thinking indicator
  const thinkingMsg = document.createElement('div');
  thinkingMsg.className = 'message bot thinking';
  thinkingMsg.innerHTML = `
    <div class="typing-indicator" aria-label="GriotBot is thinking">
      <span></span><span></span><span></span>
    </div>`;
  chat.appendChild(thinkingMsg);
  scrollToBottom();
  
  try {
    // API call to our serverless function
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 
        prompt: userInput,
        storytellerMode: isStorytellerMode
      })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error: Status ${res.status}`);
    }
    
    const data = await res.json();
    const botResponse = data.choices?.[0]?.message?.content || 
                       'I apologize, but I seem to be having trouble processing your request.';
    
    // Replace thinking with actual response
    thinkingMsg.remove();
    appendMessage('bot', botResponse);
  } catch (err) {
    console.error('API error:', err);
    
    // Replace thinking with error message
    thinkingMsg.remove();
    appendMessage('bot', `I'm sorry, I encountered an error: ${err.message}. Please try again later.`);
  } finally {
    setLoadingState(false);
    input.focus();
  }
});

    //–– 10. SUGGESTION CARDS HANDLER ––
    suggestionCards.forEach(card => {
      card.addEventListener('click', () => {
        const prompt = card.getAttribute('data-prompt');
        if (prompt) {
          input.value = prompt;
          autoExpand(input);
          input.focus();
          
          // Optional: auto-submit the form after a brief delay
          // setTimeout(() => form.dispatchEvent(new Event('submit')), 100);
        }
      });
    });

    //–– 11. NEW CHAT HANDLER ––
    newChatBtn.addEventListener('click', () => {
      // Clear chat UI
      chat.innerHTML = '';
      
      // Clear local storage history
      localStorage.removeItem('griotbot-history');
      
      // Show welcome elements
      showWelcome();
      
      // Close sidebar
      sidebar.classList.remove('visible');
      toggleBtn.setAttribute('aria-expanded', 'false');
      sidebar.setAttribute('aria-hidden', 'true');
      
      // Reset storyteller mode
      storyMode.checked = false;
      
      // Focus on input
      input.focus();
    });

    //–– 12. INITIALIZE ––
    window.addEventListener('DOMContentLoaded', () => {
      showRandomProverb();
      loadChatHistory();
      input.focus();
    });
  </script>}
    </>
  );
}
