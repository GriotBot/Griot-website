// File: /pages/index.js
import { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Constants
const HISTORY_LIMIT = 50;
const MAX_TEXTAREA_HEIGHT = 120;

// Proverbs array
const PROVERBS = [
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

// Custom hooks
function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('griotbot-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
  }, [theme]);

  return { theme, toggleTheme };
}

function useChatHistory() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    try {
      const hist = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
      setMessages(hist);
    } catch (err) {
      console.error('Error loading chat history:', err);
      localStorage.removeItem('griotbot-history');
    }
  }, []);

  const saveMessages = useCallback((newMessages) => {
    const messagesToSave = newMessages.slice(-HISTORY_LIMIT);
    localStorage.setItem('griotbot-history', JSON.stringify(messagesToSave));
    setMessages(messagesToSave);
  }, []);

  const addMessage = useCallback((role, content) => {
    const newMessage = {
      role,
      content,
      time: new Date().toISOString()
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      const toSave = updated.slice(-HISTORY_LIMIT);
      localStorage.setItem('griotbot-history', JSON.stringify(toSave));
      return updated;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('griotbot-history');
  }, []);

  return { messages, addMessage, clearMessages };
}

function useProverb() {
  const [proverb, setProverb] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * PROVERBS.length);
    setProverb(PROVERBS[randomIndex]);
  }, []);

  return proverb;
}

// Components
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-indicator" aria-label="GriotBot is thinking">
      <span></span><span></span><span></span>
    </div>
  );
}

function Message({ message }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatBotMessage = (text) => {
    // Simple proverb detection and formatting
    let formattedText = text;
    
    if (text.includes('"') && text.indexOf('"') !== text.lastIndexOf('"')) {
      const segments = text.split('"');
      for (let i = 1; i < segments.length; i += 2) {
        if (segments[i].trim().length > 0) {
          segments[i] = `<div class="message-proverb">"${segments[i]}"</div>`;
        }
      }
      formattedText = segments.join('');
    }
    
    formattedText = formattedText.split('\n\n').map(para => {
      if (para.trim().length > 0) {
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
      }
      return '';
    }).join('');
    
    return formattedText;
  };

  if (message.role === 'thinking') {
    return (
      <div className="message bot thinking">
        <TypingIndicator />
      </div>
    );
  }

  return (
    <div className={`message ${message.role}`} aria-label={`${message.role === 'user' ? 'You' : 'GriotBot'}: ${message.content}`}>
      {message.role === 'bot' && (
        <div className="bot-header">
          <span className="bot-name">GriotBot</span>
        </div>
      )}
      {message.role === 'user' ? (
        <div>{message.content}</div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: formatBotMessage(message.content) }} />
      )}
      <div className="message-time">{formatTime(message.time)}</div>
    </div>
  );
}

function SuggestionCard({ category, title, prompt, onClick }) {
  return (
    <div className="suggestion-card" onClick={() => onClick(prompt)}>
      <div className="suggestion-category">{category}</div>
      <h3 className="suggestion-title">{title}</h3>
    </div>
  );
}

function Welcome({ onSuggestionClick }) {
  return (
    <div className="welcome-container">
      <div className="logo">
        <img src="/logo-light.svg" alt="GriotBot" style={{ height: '64px' }} />
      </div>
      <h1 className="welcome-title">Welcome to GriotBot</h1>
      <p className="welcome-subtitle">Your AI companion for culturally rich conversations and wisdom</p>
      
      <div className="quote" aria-label="Inspirational quote">
        "A people without the knowledge of their past history,<br/>
        origin and culture is like a tree without roots."
        <span className="quote-attribution">— Marcus Mosiah Garvey</span>
      </div>
      
      <div className="suggestion-cards">
        <SuggestionCard
          category="Storytelling"
          title="Tell me a diaspora story about resilience"
          prompt="Tell me a story about resilience from the African diaspora"
          onClick={onSuggestionClick}
        />
        <SuggestionCard
          category="Wisdom"
          title="African wisdom on community building"
          prompt="Share some wisdom about community building from African traditions"
          onClick={onSuggestionClick}
        />
        <SuggestionCard
          category="Personal Growth"
          title="Connect with my cultural heritage"
          prompt="How can I connect more with my cultural heritage?"
          onClick={onSuggestionClick}
        />
        <SuggestionCard
          category="History"
          title="The historical significance of Juneteenth"
          prompt="Explain the historical significance of Juneteenth"
          onClick={onSuggestionClick}
        />
      </div>
    </div>
  );
}

function Header({ sidebarVisible, onToggleSidebar, theme, onToggleTheme }) {
  return (
    <div className="header" role="banner">
      <button 
        className="toggle-sidebar"
        aria-label="Toggle sidebar" 
        aria-expanded={sidebarVisible}
        aria-controls="sidebar"
        onClick={onToggleSidebar}
      >
        <MenuIcon />
      </button>
      
      <div className="logo-container">
        <img src="/logo-light.svg" alt="GriotBot" className="logo-image" />
      </div>
      
      <button 
        className="theme-toggle"
        aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"} 
        onClick={onToggleTheme}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
}

function Sidebar({ visible, onClose, onNewChat }) {
  return (
    <>
      <nav className={`sidebar ${visible ? 'visible' : ''}`} aria-hidden={!visible} aria-label="Main navigation">
        <h2>
          <img src="/logo-light.svg" alt="GriotBot" className="sidebar-logo" />
        </h2>
        
        <div className="sidebar-profile">
          <span className="free-badge">Free Account</span>
          <button className="upgrade-btn">Upgrade to Premium</button>
        </div>
        
        <div className="nav-section">
          <h3>Conversations</h3>
          <button onClick={onNewChat} aria-label="Start new chat">
            <span aria-hidden="true">+</span> New Chat
          </button>
          <a href="#">Saved Conversations</a>
        </div>
        
        <div className="nav-section">
          <h3>Explore</h3>
          <a href="#">Historical Figures</a>
          <a href="#">Cultural Stories</a>
          <a href="#">Diaspora Map</a>
        </div>
        
        <div className="nav-section">
          <h3>About</h3>
          <Link href="/about">About GriotBot</Link>
          <Link href="/feedback">Share Feedback</Link>
        </div>
        
        <div className="sidebar-footer">
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>

      {visible && (
        <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}
    </>
  );
}

function ChatInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');
  const [storytellerMode, setStorytellerMode] = useState(false);
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'inherit';
      const computed = window.getComputedStyle(textarea);
      const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                   + parseInt(computed.getPropertyValue('padding-top'), 10)
                   + textarea.scrollHeight
                   + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                   + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
      
      textarea.style.height = `${Math.min(height, MAX_TEXTAREA_HEIGHT)}px`;
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    setMessage(e.target.value);
    adjustHeight();
  }, [adjustHeight]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;
    
    onSendMessage(trimmedMessage, storytellerMode);
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
    }
  }, [message, storytellerMode, disabled, onSendMessage]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setMessage(suggestion);
    adjustHeight();
    textareaRef.current?.focus();
  }, [adjustHeight]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} aria-label="Message form">
        <div className="input-wrapper">
          <textarea 
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            placeholder="Ask GriotBot about Black history, culture, or personal advice..." 
            required 
            disabled={disabled}
            aria-label="Message to send"
            rows="1"
          />
          <button type="submit" aria-label="Send message" disabled={disabled || !message.trim()}>
            <SendIcon />
          </button>
        </div>
        
        <div className="form-actions">
          <div className="form-info">Free users: 30 messages per day</div>
          
          <div className="storyteller-mode">
            <label>
              Storyteller Mode
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={storytellerMode}
                  onChange={(e) => setStorytellerMode(e.target.checked)}
                />
                <span className="slider"></span>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

function ChatArea({ messages, isLoading, onSuggestionClick }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ 
        top: chatContainerRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }, [messages]);

  const hasMessages = messages.length > 0 || isLoading;

  return (
    <main className="chat-container" ref={chatContainerRef} aria-label="Chat messages">
      {!hasMessages && <Welcome onSuggestionClick={onSuggestionClick} />}
      
      {hasMessages && (
        <div className="chat">
          {messages.map((message, index) => (
            <Message key={`${message.time}-${index}`} message={message} />
          ))}
          {isLoading && <Message message={{ role: 'thinking' }} />}
        </div>
      )}
    </main>
  );
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { messages, addMessage, clearMessages } = useChatHistory();
  const proverb = useProverb();
  
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarVisible(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarVisible(false);
  }, []);

  const handleNewChat = useCallback(() => {
    clearMessages();
    closeSidebar();
  }, [clearMessages, closeSidebar]);

  const handleSuggestionClick = useCallback((suggestion) => {
    // This could trigger sending the message or just fill the input
    // For now, we'll just close the welcome and let the user send manually
  }, []);

  const sendMessage = useCallback(async (messageText, storytellerMode) => {
    setIsLoading(true);
    addMessage('user', messageText);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          prompt: messageText,
          storytellerMode
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: Status ${res.status}`);
      }
      
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                        'I apologize, but I seem to be having trouble processing your request.';
      
      addMessage('bot', botResponse);
    } catch (err) {
      console.error('API error:', err);
      addMessage('bot', `I'm sorry, I encountered an error: ${err.message}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

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
        
        {/* Critical CSS to prevent FOUC */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --accent-color: #d7722c;
          }

          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
          }

          * {
            box-sizing: border-box;
          }

          html, body {
            margin: 0;
            padding: 0;
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            height: 100vh;
            overflow: hidden;
            transition: background-color 0.3s, color 0.3s;
          }

          .header {
            background-color: var(--header-bg);
            height: 60px;
            position: relative;
            z-index: 100;
          }
        `}} />
      </Head>
      
      <Header 
        sidebarVisible={sidebarVisible}
        onToggleSidebar={toggleSidebar}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <Sidebar 
        visible={sidebarVisible}
        onClose={closeSidebar}
        onNewChat={handleNewChat}
      />

      <ChatArea 
        messages={messages}
        isLoading={isLoading}
        onSuggestionClick={handleSuggestionClick}
      />

      <ChatInput 
        onSendMessage={sendMessage}
        disabled={isLoading}
      />

      <div className="proverb" aria-label="Random proverb">{proverb}</div>
      <div className="copyright" aria-label="Copyright information">© 2025 GriotBot. All rights reserved.</div>
    </>
  );
}
