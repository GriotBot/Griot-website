// File: /pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  // State to ensure we can access DOM elements after mounting
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Get theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Initialize the chat functionality
    if (typeof window !== 'undefined') {
      // We need to wait for the DOM to be ready
      initializeChat();
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
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
    if (!form || !input) {
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

    // 4. THEME TOGGLE
    function setTheme(themeValue) {
      document.documentElement.setAttribute('data-theme', themeValue);
      localStorage.setItem('griotbot-theme', themeValue);
    }

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
      if (factElement) {
        const randomIndex = Math.floor(Math.random() * proverbs.length);
        factElement.textContent = proverbs[randomIndex];
        factElement.setAttribute('aria-label', `Proverb: ${proverbs[randomIndex]}`);
      }
    }
    
    showRandomProverb(); // Show proverb on init

    // 6. CHAT HISTORY (localStorage)
    const HISTORY_LIMIT = 50; // Maximum number of messages to store
    
    function loadChatHistory() {
      try {
        const hist = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
        if (hist.length > 0 && welcomeDiv && chat) {
          hideWelcome();
          hist.forEach(m => appendMessage(m.role, m.content, m.time, false));
        } else if (welcomeDiv) {
          showWelcome();
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
        localStorage.removeItem('griotbot-history');
      }
    }
    
    function saveChatHistory() {
      if (!chat) return;
      
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
      if (!chat) return;
      
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
      if (chatContainer) {
        chatContainer.scrollTo({ 
          top: chatContainer.scrollHeight, 
          behavior: 'smooth' 
        });
      }
    }

    // 8. UI STATE MANAGEMENT
    function hideWelcome() {
      if (welcomeDiv) welcomeDiv.style.display = 'none';
      if (emptyState) emptyState.style.display = 'none';
    }
    
    function showWelcome() {
      if (welcomeDiv) welcomeDiv.style.display = 'flex';
      if (chat && emptyState && chat.childElementCount === 0) {
        emptyState.style.display = 'none';
      }
    }
    
    function setLoadingState(isLoading) {
      if (input && sendBtn && sendIcon && sendLoading) {
        input.disabled = isLoading;
        sendBtn.disabled = isLoading;
        sendIcon.style.display = isLoading ? 'none' : 'inline-block';
        sendLoading.style.display = isLoading ? 'inline-block' : 'none';
      }
    }

    // 9. SEND MESSAGE HANDLER
    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const userInput = input.value.trim();
        if (!userInput) return;
        
        // Set UI to loading state
        setLoadingState(true);
        hideWelcome();
        
        // Get storyteller mode state
        const isStorytellerMode = storyMode ? storyMode.checked : false;
        
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
          if (input) input.focus();
        }
      });
    }

    // 10. SUGGESTION CARDS HANDLER
    if (suggestionCards) {
      suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
          const prompt = card.getAttribute('data-prompt');
          if (prompt && input) {
            input.value = prompt;
            autoExpand(input);
            input.focus();
          }
        });
      });
    }

    // 11. NEW CHAT HANDLER
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        // Clear chat UI
        if (chat) chat.innerHTML = '';
        
        // Clear local storage history
        localStorage.removeItem('griotbot-history');
        
        // Show welcome elements
        showWelcome();
        
        // Reset storyteller mode
        if (storyMode) storyMode.checked = false;
        
        // Focus on input
        if (input) input.focus();
      });
    }

    // Initialize input focus
    if (input) input.focus();
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
        
        {/* Add inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
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
        `}} />
      </Head>
      
      {/* HEADER + CONTROLS */}
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--header-bg)',
        color: 'var(--header-text)',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        boxShadow: '0 2px 10px var(--shadow-color)',
        zIndex: 100,
        fontFamily: 'Lora, serif',
        transition: 'background-color 0.3s',
      }} id="header" role="banner">
        <button 
          onClick={toggleSidebar}
          style={{
            position: 'absolute',
            left: '1rem',
            fontSize: '1.5rem',
            color: 'var(--header-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
            transition: 'transform 0.3s ease',
            transform: sidebarVisible ? 'rotate(45deg)' : 'none',
          }}
          id="toggleSidebar"
          aria-label="Toggle sidebar"
          aria-expanded={sidebarVisible}
          aria-controls="sidebar"
        >
          ☰
        </button>
        
        <Link href="/">
          <a style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--header-text)',
            textDecoration: 'none',
          }}>
            <img 
              src="/images/GriotBot logo horiz wht.svg" 
              alt="GriotBot" 
              style={{
                height: '32px',
                width: 'auto',
              }}
            />
          </a>
        </Link>
        
        <button 
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            right: '1rem',
            fontSize: '1.5rem',
            color: 'var(--header-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
          }}
          id="themeToggle"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        {/* Sign in button in top-right corner */}
        <a href="/signin" style={{
          position: 'absolute',
          right: '4rem',
          color: 'var(--header-text)',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: '500',
          padding: '0.4rem 0.8rem',
          border: '1px solid var(--header-text)',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
        }}>
          Sign in
        </a>
      </div>

      {/* SIDEBAR */}
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '280px',
          background: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          padding: '1.5rem',
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out, background 0.3s',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '4px 0 20px var(--shadow-color)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
        id="sidebar"
        aria-hidden={!sidebarVisible}
        aria-label="Main navigation"
      >
        <h2 style={{
          margin: '0 0 1rem 0',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'Lora, serif',
        }}>
          <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌿</span>
          GriotBot
        </h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            opacity: '0.8',
          }}>
            Conversations
          </h3>
          <button 
            id="newChat"
            style={{
              color: 'var(--sidebar-text)',
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
              display: 'flex',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              marginBottom: '0.5rem',
              fontSize: 'inherit',
              fontFamily: 'inherit',
            }}
          >
            <span aria-hidden="true" style={{ marginRight: '0.5rem' }}>+</span> New Chat
          </button>
          <a href="#" style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            Saved Conversations
          </a>
          <a href="#" style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
          }}>
            Saved Stories
          </a>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            opacity: '0.8',
          }}>
            Explore
          </h3>
          <a href="#" style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
          }} id="historicalFigures">
            Historical Figures
          </a>
          <a href="#" style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
          }} id="culturalStories">
            Cultural Stories
          </a>
          <a href="#" style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
          }} id="diasporaMap">
            Diaspora Community
          </a>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            opacity: '0.8',
          }}>
            About
          </h3>
          <Link href="/about">
            <a style={{
              color: 'var(--sidebar-text)',
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
              display: 'block',
              marginBottom: '0.5rem',
            }}>
              About GriotBot
            </a>
          </Link>
          <Link href="/feedback">
            <a style={{
              color: 'var(--sidebar-text)',
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
              display: 'block',
            }}>
              Share Feedback
            </a>
          </Link>
        </div>
        
        <div style={{
          marginTop: 'auto',
          fontSize: '0.8rem',
          opacity: '0.7',
          textAlign: 'center',
          fontStyle: 'italic',
          fontFamily: 'Lora, serif',
        }}>
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>

      {/* MAIN CHAT AREA */}
      <main 
        id="chat-container" 
        aria-label="Chat messages" 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflowY: 'auto',
          padding: '1rem',
          paddingBottom: '140px',
          scrollBehavior: 'smooth',
          scrollPaddingBottom: '140px',
          transition: 'background-color 0.3s',
          height: 'calc(100vh - 160px)',
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-color)',
        }}
        onClick={() => {
          if (sidebarVisible) setSidebarVisible(false);
        }}
      >
        <div className="welcome-container" id="welcome">
          <div id="logo" aria-hidden="true">🌿</div>
          <h1 className="welcome-title">Welcome to GriotBot</h1>
          <p className="welcome-subtitle">Your AI companion for culturally rich conversations and wisdom</p>
          
          <div id="quote" aria-label="Inspirational quote">
            "A people without the knowledge of their past history,<br/>
            origin and culture is like a tree without roots."
            <span className="quote-attribution">— Marcus Mosiah Garvey</span>
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
      <div id="form-container" style={{
        position: 'fixed',
        bottom: '50px',
        left: 0,
        width: '100%',
        background: 'var(--bg-color)',
        padding: '1rem',
        borderTop: '1px solid var(--input-border)',
        transition: 'background-color 0.3s',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
      }}>
        <form id="form" aria-label="Message form" style={{
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div className="input-wrapper" style={{
            position: 'relative',
            display: 'flex',
            boxShadow: '0 4px 12px var(--shadow-color)',
            borderRadius: '12px',
            backgroundColor: 'var(--input-bg)',
          }}>
            <textarea 
              id="input" 
              placeholder="Ask GriotBot about Black history, culture, or personal advice..." 
              required 
              aria-label="Message to send"
              rows="1"
              style={{
                flex: 1,
                padding: '0.9rem 1rem',
                border: '1px solid var(--input-border)',
                borderRight: 'none',
                borderRadius: '12px 0 0 12px',
                outline: 'none',
                resize: 'none',
                minHeight: '55px',
                maxHeight: '120px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1rem',
                lineHeight: 1.5,
              }}
            ></textarea>
            <button id="send" type="submit" aria-label="Send message" style={{
              width: '55px',
              background: 'var(--accent-color)',
              color: 'white',
              borderRadius: '0 12px 12px 0',
              transition: 'background-color 0.3s, transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
            }}>
              <div id="send-icon">↑</div>
              <div id="send-loading" className="spinner" style={{display: 'none'}}></div>
            </button>
          </div>
          
          <div className="form-actions" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem',
            fontSize: '0.8rem',
          }}>
            <div className="form-info" style={{
              color: 'var(--text-color)',
              opacity: 0.7,
            }}>Free users: 30 messages per day</div>
            
            <div className="storyteller-mode" style={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <label htmlFor="storytellerMode" style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}>
                Storyteller Mode
                <div className="toggle-switch" style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '36px',
                  height: '20px',
                  marginLeft: '0.5rem',
                }}>
                  <input type="checkbox" id="storytellerMode" style={{
                    opacity: 0,
                    width: 0,
                    height: 0,
                  }} />
                  <span className="slider" style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    transition: '.3s',
                    borderRadius: '20px',
                  }}></span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* RANDOM PROVERB & COPYRIGHT */}
      <div id="fact" aria-label="Random proverb" style={{
        position: 'fixed',
        bottom: '30px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontStyle: 'italic',
        padding: '0 1rem',
        color: 'var(--wisdom-color)',
        transition: 'color 0.3s',
        opacity: 0.8,
        fontFamily: 'Lora, serif',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 40,
      }}></div>
      
      <div id="copyright" aria-label="Copyright information" style={{
        position: 'fixed',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.6,
        transition: 'color 0.3s',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 40,
      }}>
        © 2025 GriotBot. All rights reserved.
      </div>
    </>
  );
}
