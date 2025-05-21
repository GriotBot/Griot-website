// File: /pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  // State to ensure we can access DOM elements after mounting
  const [isClient, setIsClient] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Load saved theme
    const savedTheme = localStorage.getItem('griotbot-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }

    // Immediately run the initialization code after first render
    if (typeof window !== 'undefined') {
      // We need to wait for the DOM to be ready
      initializeChat();
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Function that initializes all chat functionality
  function initializeChat() {
    // Get DOM elements
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
    if (!form) {
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

    // 5. RANDOM PROVERB
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

    // 7. APPEND MESSAGE & AUTO‑SCROLL
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
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        // Clear chat UI
        chat.innerHTML = '';
        
        // Clear local storage history
        localStorage.removeItem('griotbot-history');
        
        // Show welcome elements
        showWelcome();
        
        // Reset storyteller mode
        storyMode.checked = false;
        
        // Focus on input
        input.focus();
      });
    }

    // Initialize input focus
    input.focus();
  }

  // SVG icons for improved UI
  const menuIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  
  const sunIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  
  const moonIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  
  const sendIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;

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

          /* Global styles - Applied to everything */
          * {
            box-sizing: border-box !important;
          }

          /* Critical body styles */
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            font-family: 'Montserrat', sans-serif !important;
            background-color: var(--bg-color) !important;
            color: var(--text-color) !important;
            height: 100vh !important;
            width: 100% !important;
            overflow: hidden !important;
            line-height: 1.6 !important;
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
            height: 60px !important; /* Fixed height for header */
            width: 100% !important;
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
            transition: transform 0.3s ease-in-out !important;
          }
          
          #sidebar.visible {
            transform: translateX(0) !important;
          }
          
          /* Chat container styles - FIX FOR SCROLLING */
          #chat-container,
          main#chat-container,
          [id="chat-container"] {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            overflow-y: auto !important; /* Enable vertical scrolling */
            height: calc(100vh - 160px) !important; /* Subtract header + input area heights */
            position: fixed !important;
            top: 60px !important; /* Position below header */
            left: 0 !important;
            right: 0 !important;
            padding: 1rem !important;
            padding-bottom: 140px !important;
            background-color: var(--bg-color) !important;
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
            width: 100% !important;
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
            width: 100% !important;
          }
          
          .quote-attribution,
          span.quote-attribution,
          [class="quote-attribution"] {
            font-weight: 500 !important;
            display: block !important;
            margin-top: 0.5rem !important;
          }
          
          /* FIX FOR BROWN BAR - Suggestion cards */
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
            border: none !important; /* Remove any borders */
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
            border: none !important; /* Remove any borders */
            transition: transform 0.2s, box-shadow 0.2s !important;
          }

          .suggestion-card:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 6px 15px var(--shadow-color) !important;
          }
          
          .suggestion-category,
          div.suggestion-category,
          [class="suggestion-category"] {
            font-size: 0.8rem !important;
            text-transform: uppercase !important;
            color: var(--accent-color) !important;
            font-weight: 500 !important;
            margin-bottom: 0.5rem !important;
          }
          
          .suggestion-title,
          h3.suggestion-title,
          [class="suggestion-title"] {
            font-family: var(--heading-font), 'Lora', serif !important;
            font-weight: 600 !important;
            margin: 0 !important;
            font-size: 1.1rem !important;
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

          /* Message styles */
          .message {
            padding: 1rem 1.2rem !important;
            margin: 0.5rem 0 !important;
            border-radius: 12px !important;
            max-width: 80% !important;
            word-wrap: break-word !important;
            box-shadow: 0 3px 6px var(--shadow-color) !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            animation: message-fade-in 0.3s ease-out forwards !important;
            opacity: 0 !important;
            line-height: 1.6 !important;
          }

          @keyframes message-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .user {
            align-self: flex-end !important;
            background-color: var(--user-bubble) !important;
            color: var(--user-text) !important;
          }

          .bot {
            align-self: flex-start !important;
            background: linear-gradient(135deg, var(--bot-bubble-start), var(--bot-bubble-end)) !important;
            color: var(--bot-text) !important;
          }

          .bot-header {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 0.8rem !important;
            padding-bottom: 0.5rem !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
          }

          .bot-name {
            font-weight: 600 !important;
            margin-left: 0.5rem !important;
          }

          .message-time {
            font-size: 0.7rem !important;
            opacity: 0.7 !important;
            margin-top: 0.5rem !important;
            text-align: right !important;
          }

          .typing-indicator {
            display: inline-flex !important;
            align-items: center !important;
          }

          .typing-indicator span {
            height: 8px !important;
            width: 8px !important;
            margin: 0 2px !important;
            background-color: var(--bot-text) !important;
            border-radius: 50% !important;
            display: inline-block !important;
            opacity: 0.7 !important;
            animation: typing-bounce 1.4s infinite ease-in-out both !important;
          }

          .typing-indicator span:nth-child(1) { animation-delay: 0s !important; }
          .typing-indicator span:nth-child(2) { animation-delay: 0.2s !important; }
          .typing-indicator span:nth-child(3) { animation-delay: 0.4s !important; }

          @keyframes typing-bounce {
            0%, 80%, 100% { transform: scale(0) !important; }
            40% { transform: scale(1) !important; }
          }

          .message-proverb {
            font-style: italic !important;
            border-left: 3px solid rgba(255, 255, 255, 0.5) !important;
            padding-left: 0.8rem !important;
            margin: 0.8rem 0 !important;
            font-family: var(--quote-font), 'Lora', serif !important;
          }
          
          /* Form container styles - FIXED position */
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
            border: 2px solid var(--input-border) !important;
            overflow: hidden !important;
          }

          .input-wrapper:focus-within {
            border-color: var(--accent-color) !important;
            box-shadow: 0 4px 16px var(--shadow-color) !important;
          }
          
          #input,
          textarea#input,
          [id="input"] {
            flex: 1 !important;
            padding: 0.9rem 1rem !important;
            border: none !important;
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
          
          #input::placeholder {
            color: var(--input-text) !important;
            opacity: 0.6 !important;
          }
          
          #send,
          button#send,
          [id="send"] {
            width: 55px !important;
            background: var(--accent-color) !important;
            color: white !important;
            border-radius: 0 10px 10px 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border: none !important;
            cursor: pointer !important;
          }

          #send:hover:not(:disabled) {
            background: var(--accent-hover) !important;
          }

          #send:disabled {
            opacity: 0.7 !important;
            cursor: not-allowed !important;
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
          
          .form-info,
          div.form-info,
          [class="form-info"] {
            color: var(--text-color) !important;
            opacity: 0.7 !important;
          }
          
          .storyteller-mode,
          div.storyteller-mode,
          [class="storyteller-mode"] {
            display: flex !important;
            align-items: center !important;
          }
          
          .storyteller-mode label {
            display: flex !important;
            align-items: center !important;
            cursor: pointer !important;
          }
          
          .toggle-switch,
          div.toggle-switch,
          [class="toggle-switch"] {
            position: relative !important;
            display: inline-block !important;
            width: 36px !important;
            height: 20px !important;
            margin-left: 0.5rem !important;
          }
          
          .toggle-switch input { 
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
          }
          
          .slider,
          span.slider,
          [class="slider"] {
            position: absolute !important;
            cursor: pointer !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background-color: rgba(0,0,0,0.25) !important;
            transition: .3s !important;
            border-radius: 20px !important;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.2) !important;
          }
          
          .slider:before {
            position: absolute !important;
            content: "" !important;
            height: 16px !important;
            width: 16px !important;
            left: 2px !important;
            bottom: 2px !important;
            background-color: white !important;
            transition: .3s !important;
            border-radius: 50% !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
          }
          
          input:checked + .slider {
            background-color: var(--accent-color) !important;
          }
          
          input:checked + .slider:before {
            transform: translateX(16px) !important;
          }
          
          /* RANDOM PROVERB & COPYRIGHT */
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
            transition: color 0.3s !important;
            opacity: 0.8 !important;
            font-family: var(--quote-font), 'Lora', serif !important;
          }

          #copyright {
            position: fixed !important;
            bottom: 10px !important;
            width: 100% !important;
            text-align: center !important;
            font-size: 0.8rem !important;
            color: var(--text-color) !important;
            opacity: 0.6 !important;
            transition: color 0.3s !important;
          }

          /* Mobile responsive adjustments */
          @media (max-width: 768px) {
            .welcome-title {
              font-size: 1.8rem !important;
            }
            
            .suggestion-cards {
              flex-direction: column !important;
              align-items: center !important;
            }
            
            .suggestion-card {
              width: 100% !important;
              max-width: 400px !important;
            }
          }

          @media (max-width: 600px) {
            #form-container { bottom: 40px !important; }
            .message { max-width: 85% !important; }
            #fact { font-size: 0.8rem !important; bottom: 25px !important; }
            #copyright { font-size: 0.7rem !important; bottom: 5px !important; }
            #sidebar { width: 85% !important; max-width: 300px !important; }
            #chat-container { padding-bottom: 110px !important; }
            
            .welcome-title {
              font-size: 1.5rem !important;
            }
            
            #quote {
              font-size: 1rem !important;
              padding: 0 1rem !important;
            }
            
            .welcome-subtitle {
              font-size: 0.9rem !important;
            }
          }

          @media (max-width: 400px) {
            .message { max-width: 90% !important; }
            #form { max-width: 95% !important; }
            
            .form-actions {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 0.5rem !important;
            }
          }
