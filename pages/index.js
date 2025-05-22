// File: /pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  // State to ensure we can access DOM elements after mounting
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Immediately run the initialization code after first render
    if (typeof window !== 'undefined') {
      // We need to wait for the DOM to be ready
      initializeChat();
    }
  }, []);

  // Function that initializes all chat functionality
  function initializeChat() {
    // Get DOM elements
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const themeToggle = document.getElementById('themeToggle');
    const chatContainer = document.getElementById('chat-container');
    const welcomeDiv = document.getElementById('welcome');
    const chat = document.getElementById('chat');
    const emptyState = document.getElementById('empty-state');
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const sendBtn = document.getElementById('send');
    const sendIcon = document.getElementById('send-icon');
    const sendLoading = document.getElementById('send-loading');
    const factElement = document.getElementById('fact');
    const newChatBtn = document.getElementById('newChat');
    const storyMode = document.getElementById('storytellerMode');
    const suggestionCards = document.querySelectorAll('.suggestion-card');

    // If any element is missing, return (may happen during initial mounting)
    if (!sidebar || !toggleBtn || !form) {
      console.warn('DOM elements not found, initialization delayed');
      return;
    }

    // 1. SANITIZER TO PREVENT XSS
    function sanitize(text) {
      const d = document.createElement('div');
      d.textContent = text;
      return d.innerHTML;
    }

    // 2. AUTO-EXPAND TEXTAREA
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

    // 3. SIDEBAR TOGGLE
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

    // 4. THEME TOGGLE
    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('griotbot-theme', theme);
      themeToggle.textContent = theme === 'dark' ? 'â˜€ï¸' : 'ðŸŒ™';
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

    // 5. RANDOM PROVERB
    const proverbs = [
      "Wisdom is like a baobab tree; no one individual can embrace it. â€” African Proverb",
      "Until the lion learns to write, every story will glorify the hunter. â€” African Proverb",
      "We are the drums, we are the dance. â€” Afro-Caribbean Proverb",
      "A tree cannot stand without its roots. â€” Jamaican Proverb",
      "Unity is strength, division is weakness. â€” Swahili Proverb",
      "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. â€” West African Proverb",
      "Truth is like a drum, it can be heard from afar. â€” Kenyan Proverb",
      "A bird will always use another bird's feathers to feather its nest. â€” Ashanti Proverb",
      "You must act as if it is impossible to fail. â€” Yoruba Wisdom",
      "The child who is not embraced by the village will burn it down to feel its warmth. â€” West African Proverb",
      "However long the night, the dawn will break. â€” African Proverb",
      "If you want to go fast, go alone. If you want to go far, go together. â€” African Proverb",
      "It takes a village to raise a child. â€” African Proverb",
      "The fool speaks, the wise listen. â€” Ethiopian Proverb",
      "When the music changes, so does the dance. â€” Haitian Proverb"
    ];
    
    function showRandomProverb() {
      const randomIndex = Math.floor(Math.random() * proverbs.length);
      factElement.textContent = proverbs[randomIndex];
      factElement.setAttribute('aria-label', `Proverb: ${proverbs[randomIndex]}`);
    }
    
    showRandomProverb(); // Show proverb on init

    // 6. CHAT HISTORY (localStorage)
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
    
    loadChatHistory(); // Load history on init

    // 7. APPEND MESSAGE & AUTOâ€‘SCROLL
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
            <span class="logo-icon" aria-hidden="true">ðŸŒ¿</span>
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

    // 8. UI STATE MANAGEMENT
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

    // 9. SEND MESSAGE HANDLER
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

    // 10. SUGGESTION CARDS HANDLER
    suggestionCards.forEach(card => {
      card.addEventListener('click', () => {
        const prompt = card.getAttribute('data-prompt');
        if (prompt) {
          input.value = prompt;
          autoExpand(input);
          input.focus();
        }
      });
    });

    // 11. NEW CHAT HANDLER
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

    // Initialize input focus
    input.focus();
  }

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
        
        {/* CRITICAL INLINE STYLES - to ensure core styling is applied regardless of CSS loading */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Define critical CSS variables */
          :root {
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --header-text: #33302e;
            --sidebar-bg: rgba(75, 46, 42, 0.97);
            --sidebar-text: #f8f5f0;
            --user-bubble: #bd8735;
            --user-text: #f8f5f0;
            --bot-bubble-start: #7d8765;
            --bot-bubble-end: #5e6e4f;
            --bot-text: #f8f5f0;
            --accent-color: #d7722c;
            --accent-hover: #c86520;
            --wisdom-color: #6b4226;
            --input-bg: #ffffff;
            --input-border: rgba(75, 46, 42, 0.2);
            --input-text: #33302e;
            --shadow-color: rgba(75, 46, 42, 0.15);
            --card-bg: #ffffff;
          }
          
          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
            --header-text: #f0ece4;
            --sidebar-bg: rgba(40, 30, 25, 0.97);
            --sidebar-text: #f0ece4;
            --user-bubble: #bb7e41;
            --user-text: #f0ece4;
            --bot-bubble-start: #5e6e4f;
            --bot-bubble-end: #3e4a38;
            --bot-text: #f0ece4;
            --accent-color: #d7722c;
            --accent-hover: #e8833d;
            --wisdom-color: #e0c08f;
            --input-bg: #352e29;
            --input-border: rgba(240, 236, 228, 0.2);
            --input-text: #f0ece4;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --card-bg: #352e29;
          }

          /* Critical body styles */
          body {
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
            line-height: 1.6;
          }

          /* Header styles */
          #header, 
          div#header,
          [id="header"] {
            position: relative !important;
            background-color: var(--header-bg) !important;
            color: var(--header-text) !important;
            padding: 1rem !important;
            text-align: center !important;
            font-weight: bold !important;
            font-size: 1.2rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1rem !important;
            box-shadow: 0 2px 10px var(--shadow-color) !important;
            z-index: 100 !important;
            font-family: 'Lora', serif !important;
          }
          
          .logo-container,
          div.logo-container,
          [class="logo-container"] {
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .logo-icon,
          span.logo-icon,
          [class="logo-icon"] {
            font-size: 1.5rem !important;
          }
          
          #toggleSidebar,
          button#toggleSidebar,
          [id="toggleSidebar"] {
            position: absolute !important;
            left: 1rem !important;
            font-size: 1.5rem !important;
            color: var(--header-text) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: none !important;
            border: none !important;
            cursor: pointer !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
          }
          
          #themeToggle,
          button#themeToggle,
          [id="themeToggle"] {
            position: absolute !important;
            right: 1rem !important;
            font-size: 1.5rem !important;
            color: var(--header-text) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: none !important;
            border: none !important;
            cursor: pointer !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
          }

          /* Sidebar styles */
          #sidebar,
          nav#sidebar,
          [id="sidebar"] {
            position: fixed !important;
            top: 0 !important; 
            left: 0 !important;
            height: 100% !important;
            width: 280px !important;
            background: var(--sidebar-bg) !important;
            color: var(--sidebar-text) !important;
            padding: 1.5rem !important;
            transform: translateX(-100%) !important;
            z-index: 1000 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
          
          #sidebar.visible {
            transform: translateX(0) !important;
          }
          
          /* Chat container styles */
          #chat-container,
          main#chat-container,
          [id="chat-container"] {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            overflow-y: auto !important;
            padding: 1rem !important;
            padding-bottom: 140px !important;
          }
          
          .welcome-container,
          div.welcome-container,
          [class="welcome-container"],
          #welcome,
          [id="welcome"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            max-width: 700px !important;
            margin: 1rem auto 2rem !important;
          }
          
          #logo,
          div#logo,
          [id="logo"] {
            font-size: 4rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .welcome-title,
          h1.welcome-title,
          [class="welcome-title"] {
            font-family: 'Lora', serif !important;
            font-size: 2rem !important;
            margin: 0.5rem 0 !important;
          }
          
          .welcome-subtitle,
          p.welcome-subtitle,
          [class="welcome-subtitle"] {
            font-family: 'Montserrat', sans-serif !important;
            color: var(--text-color) !important;
            opacity: 0.8 !important;
            margin-bottom: 1.5rem !important;
          }
          
          #quote,
          div#quote,
          [id="quote"] {
            font-size: 1.1rem !important;
            font-style: italic !important;
            color: var(--wisdom-color) !important;
            text-align: center !important;
            font-family: 'Lora', serif !important;
            line-height: 1.7 !important;
            margin-bottom: 2rem !important;
            position: relative !important;
            padding: 0 1.5rem !important;
          }
          
          .quote-attribution,
          span.quote-attribution,
          [class="quote-attribution"] {
            font-weight: 500 !important;
            display: block !important;
            margin-top: 0.5rem !important;
          }
          
          .suggestion-cards,
          div.suggestion-cards,
          [class="suggestion-cards"] {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 1rem !important;
            margin-bottom: 2rem !important;
            width: 100% !important;
            max-width: 700px !important;
          }
          
          .suggestion-card,
          div.suggestion-card,
          [class="suggestion-card"] {
            background-color: var(--card-bg) !important;
            padding: 1rem !important;
            border-radius: 12px !important;
            width: calc(50% - 0.5rem) !important;
            min-width: 200px !important;
            box-shadow: 0 3px 10px var(--shadow-color) !important;
            cursor: pointer !important;
          }
          
          /* Chat styles */
          #chat,
          div#chat,
          [id="chat"] {
            width: 100% !important;
            max-width: 700px !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          /* Form container styles */
          #form-container,
          div#form-container,
          [id="form-container"] {
            position: fixed !important;
            bottom: 50px !important;
            left: 0 !important;
            width: 100% !important;
            background: var(--bg-color) !important;
            padding: 1rem !important;
            border-top: 1px solid var(--input-border) !important;
            display: flex !important;
            justify-content: center !important;
            z-index: 50 !important;
          }
          
          #form,
          form#form,
          [id="form"] {
            width: 100% !important;
            max-width: 700px !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .input-wrapper,
          div.input-wrapper,
          [class="input-wrapper"] {
            position: relative !important;
            display: flex !important;
            box-shadow: 0 4px 12px var(--shadow-color) !important;
            border-radius: 12px !important;
            background-color: var(--input-bg) !important;
          }
          
          #input,
          textarea#input,
          [id="input"] {
            flex: 1 !important;
            padding: 0.9rem 1rem !important;
            border: 1px solid var(--input-border) !important;
            border-right: none !important;
            border-radius: 12px 0 0 12px !important;
            outline: none !important;
            resize: none !important;
            min-height: 55px !important;
            max-height: 120px !important;
            background-color: var(--input-bg) !important;
            color: var(--input-text) !important;
            font-family: 'Montserrat', sans-serif !important;
            font-size: 1rem !important;
            line-height: 1.5 !important;
          }
          
          #send,
          button#send,
          [id="send"] {
            width: 55px !important;
            background: var(--accent-color) !important;
            color: white !important;
            border-radius: 0 12px 12px 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border: none !important;
            cursor: pointer !important;
          }
          
          .form-actions,
          div.form-actions,
          [class="form-actions"] {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-top: 0.5rem !important;
            font-size: 0.8rem !important;
          }
          
          /* Footer elements */
          #fact,
          div#fact,
          [id="fact"] {
            position: fixed !important;
            bottom: 30px !important;
            width: 100% !important;
            text-align: center !important;
            font-size: 0.9rem !important;
            font-style: italic !important;
            padding: 0 1rem !important;
            color: var(--wisdom-color) !important;
            opacity: 0.8 !important;
            font-family: 'Lora', serif !important;
          }
          
          #copyright,
          div#copyright,
          [id="copyright"] {
            position: fixed !important;
            bottom: 10px !important;
            width: 100% !important;
            text-align: center !important;
            font-size: 0.8rem !important;
            color: var(--text-color) !important;
            opacity: 0.6 !important;
          }
          
          /* Mobile responsive adjustments */
          @media (max-width: 600px) {
            .suggestion-card, 
            div.suggestion-card,
            [class="suggestion-card"] {
              width: 100% !important;
              max-width: 100% !important;
            }
          }
        `}} />
      </Head>
      
      {/* HEADER + CONTROLS */}
      <div id="header" role="banner">
        <button id="toggleSidebar" aria-label="Toggle sidebar" aria-expanded="false" aria-controls="sidebar">â˜°</button>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">ðŸŒ¿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle" aria-label="Toggle dark/light mode"></button>
      </div>

      {/* SIDEBAR */}
      <nav id="sidebar" aria-hidden="true" aria-label="Main navigation">
        <h2>
          <span className="logo-icon" aria-hidden="true">ðŸŒ¿</span>
          GriotBot
        </h2>
        
        <div className="sidebar-profile">
          <span className="free-badge">Free Account</span>
          <button className="upgrade-btn">Upgrade to Premium</button>
        </div>
        
        <div className="nav-section">
          <h3>Conversations</h3>
          <button id="newChat" aria-label="Start new chat">
            <span aria-hidden="true">+</span> New Chat
          </button>
          <a href="#" id="savedChats">Saved Conversations</a>
        </div>
        
        <div className="nav-section">
          <h3>Explore</h3>
          <a href="#" id="historicalFigures">Historical Figures</a>
          <a href="#" id="culturalStories">Cultural Stories</a>
          <a href="#" id="diasporaMap">Diaspora Map</a>
        </div>
        
        <div className="nav-section">
          <h3>About</h3>
          <a href="about">About GriotBot</a>
          <a href="feedback">Share Feedback</a>
        </div>
        
        <div className="sidebar-footer">
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>

      {/* MAIN CHAT AREA */}
      <main id="chat-container" aria-label="Chat messages">
        <div className="welcome-container" id="welcome">
          <div id="logo" aria-hidden="true">ðŸŒ¿</div>
          <h1 className="welcome-title">Welcome to GriotBot</h1>
          <p className="welcome-subtitle">Your AI companion for culturally rich conversations and wisdom</p>
          
          <div id="quote" aria-label="Inspirational quote">
            "A people without the knowledge of their past history,<br/>
            origin and culture is like a tree without roots."
            <span className="quote-attribution">â€” Marcus Mosiah Garvey</span>
          </div>
          
          <div className="suggestion-cards">
            <div className="suggestion-card" data-prompt="Tell me a story about resilience from the African diaspora">
              <div className="suggestion-category">Storytelling</div>
              <h3 className="suggestion-title">Tell me a diaspora story about resilience</h3>
            </div>
            
            <div className="suggestion-card" data-prompt="Share some wisdom about community building from African traditions">
              <div className="suggestion-category">Wisdom</div>
              <h3 className="suggestion-title">African wisdom on community building</h3>
            </div>
            
            <div className="suggestion-card" data-prompt="How can I connect more with my cultural heritage?">
              <div className="suggestion-category">Personal Growth</div>
              <h3 className="suggestion-title">Connect with my cultural heritage</h3>
            </div>
            
            <div className="suggestion-card" data-prompt="Explain the historical significance of Juneteenth">
              <div className="suggestion-category">History</div>
              <h3 className="suggestion-title">The historical significance of Juneteenth</h3>
            </div>
          </div>
        </div>
        
        <div id="chat" aria-live="polite"></div>
        <div id="empty-state">
          <p>Start a conversation with GriotBot</p>
        </div>
      </main>

      {/* MESSAGE INPUT */}
      <div id="form-container">
        <form id="form" aria-label="Message form">
          <div className="input-wrapper">
            <textarea 
              id="input" 
              placeholder="Ask GriotBot about Black history, culture, or personal advice..." 
              required 
              aria-label="Message to send"
              rows="1"
            ></textarea>
            <button id="send" type="submit" aria-label="Send message">
              <div id="send-icon">â†‘</div>
              <div id="send-loading" className="spinner" style={{display: 'none'}}></div>
            </button>
          </div>
          
          <div className="form-actions">
            <div className="form-info">Free users: 30 messages per day</div>
            
            <div className="storyteller-mode">
              <label htmlFor="storytellerMode">
                Storyteller Mode
                <div className="toggle-switch">
                  <input type="checkbox" id="storytellerMode" />
                  <span className="slider"></span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* RANDOM PROVERB & COPYRIGHT */}
      <div id="fact" aria-label="Random proverb"></div>
      <div id="copyright" aria-label="Copyright information">Â© 2025 GriotBot. All rights reserved.</div>
    </>
  );
}
