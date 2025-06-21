// Mobile-Optimized GriotBot Interface
// File: pages/mobile-index.js (or updates to existing index.js)

import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { Menu, Send, RotateCcw, ThumbsUp, ThumbsDown, Copy, Sun, Moon } from 'react-feather';

// Mobile-optimized constants
const MOBILE_BREAKPOINT = 768;
const MOBILE_HEADER_HEIGHT = 60;
const MOBILE_INPUT_HEIGHT = 80;
const MOBILE_SIDEBAR_WIDTH = 280;

export default function MobileGriotBot() {
  // State management
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [storytellerMode, setStorytellerMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for mobile optimization
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle message sending with conversation memory
  const handleSendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    setIsLoading(true);
    setShowWelcome(false);

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');

    // Prepare conversation history (last 10 messages)
    const conversationHistory = updatedMessages
      .slice(-10)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText.trim(),
          storytellerMode: storytellerMode,
          conversationHistory: conversationHistory
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                         'I apologize, but I seem to be having trouble processing your request.';

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botResponse,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      
      // Save to localStorage
      localStorage.setItem('griotbot-history', JSON.stringify(finalMessages.slice(-50)));
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, storytellerMode]);

  // Mobile-optimized suggestion cards
  const suggestionCards = [
    {
      category: "History",
      title: "Tell me about Juneteenth",
      prompt: "Tell me about the history and significance of Juneteenth",
      emoji: "ðŸ“š"
    },
    {
      category: "Culture",
      title: "Share African wisdom",
      prompt: "Share some traditional African wisdom about community",
      emoji: "ðŸŒ"
    },
    {
      category: "Stories",
      title: "Tell me a story",
      prompt: "Tell me an inspiring story from the African diaspora",
      emoji: "âœ¨"
    },
    {
      category: "Identity",
      title: "Cultural connection",
      prompt: "How can I connect more with my cultural heritage?",
      emoji: "ðŸ”—"
    }
  ];

  // Mobile styles
  const mobileStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-color, #f8f5f0)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    },
    
    header: {
      height: `${MOBILE_HEADER_HEIGHT}px`,
      backgroundColor: 'var(--header-bg, #c49a6c)',
      color: 'var(--header-text, #33302e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative',
      zIndex: 1000
    },
    
    logo: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    
    chatContainer: {
      flex: 1,
      overflow: 'auto',
      padding: '1rem',
      paddingBottom: `${MOBILE_INPUT_HEIGHT + 20}px`,
      WebkitOverflowScrolling: 'touch',
      height: `calc(100vh - ${MOBILE_HEADER_HEIGHT + MOBILE_INPUT_HEIGHT}px)`,
      display: 'flex',
      flexDirection: 'column'
    },
    
    welcomeScreen: {
      textAlign: 'center',
      padding: '2rem 1rem',
      maxWidth: '100%'
    },
    
    welcomeTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: 'var(--text-color, #33302e)'
    },
    
    welcomeSubtitle: {
      fontSize: '1rem',
      opacity: 0.8,
      marginBottom: '2rem',
      color: 'var(--text-color, #33302e)'
    },
    
    suggestionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '1rem',
      marginTop: '1.5rem',
      padding: '0 0.5rem'
    },
    
    suggestionCard: {
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'transform 0.2s, box-shadow 0.2s',
      border: 'none',
      fontSize: '0.9rem'
    },
    
    message: {
      margin: '0.75rem 0',
      padding: '0.75rem 1rem',
      borderRadius: '16px',
      maxWidth: '85%',
      wordWrap: 'break-word',
      fontSize: '1rem',
      lineHeight: '1.4'
    },
    
    userMessage: {
      backgroundColor: 'var(--user-bubble, #bd8735)',
      color: 'white',
      alignSelf: 'flex-end',
      marginLeft: 'auto'
    },
    
    botMessage: {
      backgroundColor: 'var(--bot-bubble-start, #7d8765)',
      color: 'white',
      alignSelf: 'flex-start',
      marginRight: 'auto'
    },
    
    inputContainer: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: `${MOBILE_INPUT_HEIGHT}px`,
      backgroundColor: 'white',
      borderTop: '1px solid #e0e0e0',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      zIndex: 1000
    },
    
    input: {
      flex: 1,
      padding: '0.75rem 1rem',
      borderRadius: '24px',
      border: '1px solid #e0e0e0',
      fontSize: '1rem',
      outline: 'none',
      backgroundColor: '#f5f5f5'
    },
    
    sendButton: {
      width: '48px',
      height: '48px',
      borderRadius: '24px',
      backgroundColor: 'var(--accent-color, #d7722c)',
      color: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      disabled: isLoading
    },
    
    sidebar: {
      position: 'fixed',
      top: 0,
      left: sidebarOpen ? '0' : `-${MOBILE_SIDEBAR_WIDTH}px`,
      width: `${MOBILE_SIDEBAR_WIDTH}px`,
      height: '100vh',
      backgroundColor: 'var(--sidebar-bg, rgba(75, 46, 42, 0.97))',
      color: 'var(--sidebar-text, #f8f5f0)',
      zIndex: 2000,
      transition: 'left 0.3s ease',
      padding: '1rem',
      overflow: 'auto'
    },
    
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1500,
      display: sidebarOpen ? 'block' : 'none'
    },
    
    toggleSwitch: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.9rem',
      color: 'var(--text-color, #666)'
    }
  };

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --header-text: #33302e;
            --sidebar-bg: rgba(75, 46, 42, 0.97);
            --sidebar-text: #f8f5f0;
            --user-bubble: #bd8735;
            --bot-bubble-start: #7d8765;
            --accent-color: #d7722c;
          }
          
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; overflow: hidden; }
          
          /* iOS Safari specific fixes */
          body { 
            position: fixed; 
            width: 100%; 
            height: 100%; 
            -webkit-overflow-scrolling: touch;
          }
          
          /* Prevent zoom on input focus */
          input, textarea, select {
            font-size: 16px;
          }
          
          /* Hide scrollbars on mobile */
          ::-webkit-scrollbar { display: none; }
          * { scrollbar-width: none; }
        `}} />
      </Head>

      <div style={mobileStyles.container}>
        {/* Overlay for sidebar */}
        <div 
          style={mobileStyles.overlay}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile Sidebar */}
        <div style={mobileStyles.sidebar}>
          <h3>GriotBot Menu</h3>
          <div style={{ marginBottom: '2rem' }}>
            <button 
              onClick={() => {
                setMessages([]);
                setShowWelcome(true);
                setSidebarOpen(false);
                localStorage.removeItem('griotbot-history');
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: 'inherit',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            >
              + New Chat
            </button>
            
            <div style={mobileStyles.toggleSwitch}>
              <span>Storyteller Mode</span>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox"
                  checked={storytellerMode}
                  onChange={(e) => setStorytellerMode(e.target.checked)}
                  style={{ marginLeft: '0.5rem' }}
                />
              </label>
            </div>
          </div>
          
          <div>
            <h4>Quick Actions</h4>
            <a href="/about" style={{ color: 'inherit', textDecoration: 'none', display: 'block', padding: '0.5rem 0' }}>
              About GriotBot
            </a>
            <a href="/feedback" style={{ color: 'inherit', textDecoration: 'none', display: 'block', padding: '0.5rem 0' }}>
              Share Feedback
            </a>
          </div>
        </div>

        {/* Header */}
        <header style={mobileStyles.header}>
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: 'inherit', padding: '0.5rem' }}
          >
            <Menu size={24} />
          </button>
          
          <div style={mobileStyles.logo}>
            <span>ðŸŒ¿</span>
            <span>GriotBot</span>
          </div>
          
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ background: 'none', border: 'none', color: 'inherit', padding: '0.5rem' }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        {/* Chat Container */}
        <div ref={chatContainerRef} style={mobileStyles.chatContainer}>
          {showWelcome && (
            <div style={mobileStyles.welcomeScreen}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>ðŸŒ¿</div>
              <h1 style={mobileStyles.welcomeTitle}>Welcome to GriotBot</h1>
              <p style={mobileStyles.welcomeSubtitle}>
                Your AI companion for culturally rich conversations
              </p>
              
              <div style={mobileStyles.suggestionGrid}>
                {suggestionCards.map((card, index) => (
                  <button
                    key={index}
                    style={mobileStyles.suggestionCard}
                    onClick={() => handleSendMessage(card.prompt)}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                      {card.emoji}
                    </div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.8rem', textTransform: 'uppercase', color: '#666' }}>
                      {card.category}
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                      {card.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                ...mobileStyles.message,
                ...(message.role === 'user' ? mobileStyles.userMessage : mobileStyles.botMessage)
              }}
            >
              {message.content}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div style={{ ...mobileStyles.message, ...mobileStyles.botMessage, opacity: 0.7 }}>
              <span>Thinking</span>
              <span style={{ animation: 'pulse 1.5s infinite' }}>...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div style={mobileStyles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputText);
              }
            }}
            placeholder="Ask GriotBot anything..."
            style={mobileStyles.input}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            style={mobileStyles.sendButton}
            disabled={isLoading || !inputText.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
