// File: /pages/index.js - IMPROVED VERSION with Code Review Fixes
import { useEffect, useState } from 'react';
import Head from 'next/head';
import EnhancedSidebar from '../components/EnhancedSidebar';
import ModelUsageDashboard from '../components/ModelUsageDashboard';
import { Menu, LogIn, Sun, Moon, MessageCircle, Copy, ThumbsUp, ThumbsDown, RotateCw } from 'react-feather';
import MessageCirclePlus from '../components/icons/MessageCirclePlus';

// CONSTANTS MOVED TO TOP
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

const SUGGESTION_PROMPTS = [
  {
    category: "Storytelling", 
    title: "Tell me a diaspora story about resilience",
    prompt: "Tell me a story about resilience from the African diaspora"
  },
  {
    category: "Wisdom",
    title: "African wisdom on community building", 
    prompt: "Share some wisdom about community building from African traditions"
  },
  {
    category: "Personal Growth",
    title: "Connect with my cultural heritage",
    prompt: "How can I connect more with my cultural heritage?"
  },
  {
    category: "History", 
    title: "The historical significance of Juneteenth",
    prompt: "Explain the historical significance of Juneteenth"
  }
];

// HELPER FUNCTIONS
const generateMessageId = () => Date.now() + Math.random();

const getModelDisplayName = (modelUsed) => {
  return modelUsed?.split('/').pop()?.split(':')[0] || 'Unknown';
};

const getRandomProverb = () => {
  const randomIndex = Math.floor(Math.random() * PROVERBS.length);
  return PROVERBS[randomIndex];
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// REUSABLE STYLES
const iconButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer', 
  padding: '8px',
  borderRadius: '6px',
  color: 'var(--text-color)',
  transition: 'background-color 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const headerButtonStyle = {
  ...iconButtonStyle,
  color: 'var(--header-text)',
  fontSize: '1.2rem'
};

export default function Home() {
  // STATE MANAGEMENT
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [storytellerMode, setStorytellerMode] = useState(false);
  const [currentProverb, setCurrentProverb] = useState(''); // NEW: React state for proverb
  const [logoError, setLogoError] = useState(false); // NEW: Better image error handling

  // LIFECYCLE EFFECTS
  useEffect(() => {
    setIsClient(true);
    loadChatHistory();
    loadPreferences();
    setCurrentProverb(getRandomProverb()); // NEW: Set initial proverb in React
  }, []);

  // Load chat history from localStorage
  const loadChatHistory = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedHistory = localStorage.getItem('griotbot-history');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          if (parsedHistory.length > 0) {
            setMessages(parsedHistory);
            setShowWelcome(false);
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        localStorage.removeItem('griotbot-history');
      }
    }
  };

  // Load user preferences
  const loadPreferences = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('griotbot-theme');
        const savedStorytellerMode = localStorage.getItem('griotbot-storyteller-mode');
        
        if (savedTheme) {
          setTheme(savedTheme);
          document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const initialTheme = prefersDark ? 'dark' : 'light';
          setTheme(initialTheme);
          document.documentElement.setAttribute('data-theme', initialTheme);
        }
        
        if (savedStorytellerMode) {
          setStorytellerMode(JSON.parse(savedStorytellerMode));
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  };

  // Save chat history
  const saveChatHistory = (newMessages) => {
    if (typeof window !== 'undefined') {
      try {
        const HISTORY_LIMIT = 50;
        const limitedMessages = newMessages.slice(-HISTORY_LIMIT);
        localStorage.setItem('griotbot-history', JSON.stringify(limitedMessages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  };

  // IMPROVED: Enhanced error handling with specific messages
  const handleSendMessage = async (messageText, useStorytellerMode = storytellerMode) => {
    if (!messageText.trim()) return;

    const messageId = generateMessageId(); // NEW: Proper message ID
    
    const userMessage = {
      role: 'user',
      content: messageText.trim(),
      id: messageId,
      timestamp: new Date().toISOString()
    };

    // Update UI immediately
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setShowWelcome(false);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          prompt: messageText.trim(),
          storytellerMode: useStorytellerMode
        })
      });
      
      // IMPROVED: Better error handling
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error (${res.status}): ${errorText}`);
      }
      
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                         data.choices?.[0]?.text?.trim() ||
                         'I apologize, but I seem to be having trouble processing your request.';
      
      const botMessage = {
        role: 'bot',
        content: botResponse,
        id: generateMessageId(),
        respondsTo: messageId, // NEW: Link to original user message
        timestamp: new Date().toISOString(),
        modelUsed: data.model,
        estimatedCost: data.estimated_cost
      };
      
      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
      
      // Log model usage if available
      if (typeof window !== 'undefined' && window.logModelUsage) {
        window.logModelUsage(data.model, data.estimated_cost);
      }
      
    } catch (error) {
      console.error('Chat API Error:', error);
      
      // IMPROVED: Specific error messages
      let errorMessage = "I'm having trouble responding right now. Please try again.";
      if (error.message.includes('Failed to fetch')) {
        errorMessage = "Connection issue. Please check your internet connection.";
      } else if (error.message.includes('429')) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (error.message.includes('401')) {
        errorMessage = "Authentication error. Please contact support.";
      } else if (error.message.includes('500')) {
        errorMessage = "Server error. Please try again in a few moments.";
      }
      
      const errorBotMessage = {
        role: 'bot',
        content: errorMessage,
        id: generateMessageId(),
        respondsTo: messageId,
        isError: true,
        timestamp: new Date().toISOString()
      };
      
      const finalMessages = [...newMessages, errorBotMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // IMPROVED: Better regenerate logic using message IDs
  const handleRegenerate = (botMessage) => {
    const originalUserMessage = messages.find(m => m.id === botMessage.respondsTo);
    if (originalUserMessage) {
      // Remove the bot message being regenerated
      const filteredMessages = messages.filter(m => m.id !== botMessage.id);
      setMessages(filteredMessages);
      
      // Resend the original user message
      handleSendMessage(originalUserMessage.content, storytellerMode);
    }
  };

  // NEW: Handle suggestion card clicks in React
  const handleSuggestionClick = (prompt) => {
    handleSendMessage(prompt);
  };

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('griotbot-theme', newTheme);
    }
  };

  // Storyteller mode toggle
  const toggleStorytellerMode = () => {
    const newMode = !storytellerMode;
    setStorytellerMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('griotbot-storyteller-mode', JSON.stringify(newMode));
    }
  };

  // Sidebar controls
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  // New chat
  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setSidebarVisible(false);
    setCurrentProverb(getRandomProverb()); // NEW: Get new proverb
    if (typeof window !== 'undefined') {
      localStorage.removeItem('griotbot-history');
    }
  };

  // Message actions
  const handleCopyMessage = async (content) => {
    const success = await copyToClipboard(content);
    if (success) {
      // Could add a toast notification here
      console.log('Message copied to clipboard');
    }
  };

  const handleThumbsUp = (messageId) => {
    console.log('Thumbs up for message:', messageId);
    // Could implement feedback tracking here
  };

  const handleThumbsDown = (messageId) => {
    console.log('Thumbs down for message:', messageId);
    // Could implement feedback tracking here
  };

  // Render individual message
  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    const isError = message.isError;
    
    return (
      <div
        key={message.id || index}
        style={{
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          background: isUser 
            ? 'var(--user-bubble)'
            : isError 
              ? '#d32f2f'
              : 'linear-gradient(135deg, var(--bot-bubble-start), var(--bot-bubble-end))',
          color: isUser ? 'var(--user-text)' : 'var(--bot-text)',
          padding: '1rem 1.2rem',
          margin: '0.5rem 0',
          borderRadius: '12px',
          maxWidth: '80%',
          wordWrap: 'break-word',
          boxShadow: '0 3px 6px var(--shadow-color)',
          animation: 'message-fade-in 0.3s ease-out forwards',
          lineHeight: 1.6
        }}
      >
        {!isUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.8rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>🌿</span>
            <span style={{ fontWeight: 600 }}>GriotBot</span>
            {message.modelUsed && (
              <span style={{
                fontSize: '0.75rem',
                opacity: 0.8,
                marginLeft: '0.5rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '2px 6px',
                borderRadius: '8px'
              }}>
                {getModelDisplayName(message.modelUsed)}
              </span>
            )}
          </div>
        )}
        
        <div>{message.content}</div>
        
        {message.timestamp && (
          <div style={{
            fontSize: '0.7rem',
            opacity: 0.7,
            marginTop: '0.5rem',
            textAlign: isUser ? 'right' : 'left'
          }}>
            {formatTime(message.timestamp)}
          </div>
        )}
        
        {!isUser && !isError && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.5rem',
            justifyContent: 'flex-start'
          }}>
            <button
              style={{...iconButtonStyle, fontSize: '0.9rem'}}
              onClick={() => handleCopyMessage(message.content)}
              title="Copy message"
            >
              <Copy size={14} />
            </button>
            <button
              style={{...iconButtonStyle, fontSize: '0.9rem'}}
              onClick={() => handleThumbsUp(message.id)}
              title="Good response"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              style={{...iconButtonStyle, fontSize: '0.9rem'}}
              onClick={() => handleThumbsDown(message.id)}
              title="Poor response"
            >
              <ThumbsDown size={14} />
            </button>
            <button
              style={{...iconButtonStyle, fontSize: '0.9rem'}}
              onClick={() => handleRegenerate(message)}
              title="Regenerate response"
            >
              <RotateCw size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!isClient) {
    return <div>Loading...</div>;
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
            --body-font: 'Montserrat', sans-serif;
            --heading-font: 'Lora', serif;
            --quote-font: 'Lora', serif;
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

          * { box-sizing: border-box; }

          body {
            margin: 0;
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow: hidden;
            transition: background-color 0.3s, color 0.3s;
            line-height: 1.6;
          }

          @keyframes message-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </Head>

      {/* HEADER */}
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
        fontFamily: 'var(--heading-font)',
        transition: 'background-color 0.3s'
      }}>
        <button 
          onClick={toggleSidebar}
          style={{
            ...headerButtonStyle,
            position: 'absolute',
            left: '1rem',
            transform: sidebarVisible ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.3s ease'
          }}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarVisible}
          aria-controls="sidebar"
        >
          <Menu size={24} />
        </button>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {!logoError ? (
            <img 
              src="/images/GriotBot logo horiz wht.svg"
              alt="GriotBot"
              style={{ height: '32px' }}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--heading-font)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🌿</span>
              <span>GriotBot</span>
            </div>
          )}
        </div>
        
        <div style={{
          position: 'absolute',
          right: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <button
            onClick={handleNewChat}
            style={headerButtonStyle}
            title="New Chat"
          >
            <MessageCirclePlus size={20} />
          </button>
          
          <button
            onClick={() => window.location.href = '/comingsoon'}
            style={headerButtonStyle}
            title="Log In"
          >
            <LogIn size={20} />
          </button>
          
          <button 
            onClick={toggleTheme}
            style={headerButtonStyle}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <EnhancedSidebar 
        isVisible={sidebarVisible}
        onClose={closeSidebar}
        currentPage="/"
      />

      {/* MAIN CHAT AREA */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        transition: 'background-color 0.3s'
      }}>
        <div style={{
          flex: 1,
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          paddingBottom: '140px',
          overflowY: 'auto',
          scrollBehavior: 'smooth'
        }}>
          {/* WELCOME SCREEN */}
          {showWelcome && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              margin: '1rem auto 2rem',
              transition: 'opacity 0.3s'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🌿</div>
              <h1 style={{
                fontFamily: 'var(--heading-font)',
                fontSize: '2rem',
                margin: '0.5rem 0',
                color: 'var(--text-color)'
              }}>Welcome to GriotBot</h1>
              <p style={{
                fontFamily: 'var(--body-font)',
                color: 'var(--text-color)',
                opacity: 0.8,
                marginBottom: '1.5rem'
              }}>Your AI companion for culturally rich conversations and wisdom</p>
              
              <div style={{
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: 'var(--wisdom-color)',
                textAlign: 'center',
                fontFamily: 'var(--quote-font)',
                lineHeight: 1.7,
                marginBottom: '2rem',
                position: 'relative',
                padding: '0 1.5rem'
              }}>
                "A people without the knowledge of their past history,<br/>
                origin and culture is like a tree without roots."
                <span style={{
                  fontWeight: 500,
                  display: 'block',
                  marginTop: '0.5rem'
                }}>— Marcus Mosiah Garvey</span>
              </div>
              
              {/* IMPROVED: Suggestion cards with React onClick */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                width: '100%'
              }}>
                {SUGGESTION_PROMPTS.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.prompt)}
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      padding: '1rem',
                      borderRadius: '12px',
                      width: 'calc(50% - 0.5rem)',
                      minWidth: '200px',
                      boxShadow: '0 3px 10px var(--shadow-color)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 6px 15px var(--shadow-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 3px 10px var(--shadow-color)';
                    }}
                  >
                    <div style={{
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      color: 'var(--accent-color)',
                      fontWeight: 500,
                      marginBottom: '0.5rem'
                    }}>
                      {suggestion.category}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--heading-font)',
                      fontWeight: 600,
                      margin: 0,
                      color: 'var(--text-color)'
                    }}>
                      {suggestion.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHAT MESSAGES */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {messages.map((message, index) => renderMessage(message, index))}
            
            {/* LOADING INDICATOR */}
            {isLoading && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'linear-gradient(135deg, var(--bot-bubble-start), var(--bot-bubble-end))',
                color: 'var(--bot-text)',
                padding: '1rem 1.2rem',
                margin: '0.5rem 0',
                borderRadius: '12px',
                maxWidth: '80%',
                display: 'flex',
                alignItems: 'center',
                opacity: 0.8
              }}>
                <div className="spinner"></div>
                GriotBot is thinking...
              </div>
            )}
          </div>
        </div>

        {/* CHAT INPUT */}
        <div style={{
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
          zIndex: 50
        }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const message = formData.get('message');
              if (message.trim()) {
                handleSendMessage(message);
                e.target.reset();
              }
            }}
            style={{
              width: '100%',
              maxWidth: '700px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              position: 'relative',
              display: 'flex',
              boxShadow: '0 4px 12px var(--shadow-color)',
              borderRadius: '12px',
              background: 'var(--input-bg)'
            }}>
              <textarea
                name="message"
                placeholder="Ask GriotBot about Black history, culture, or personal advice..."
                required
                disabled={isLoading}
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
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontFamily: 'var(--body-font)',
                  fontSize: '1rem',
                  lineHeight: 1.5
                }}
                onInput={(e) => {
                  e.target.style.height = 'inherit';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '55px',
                  background: 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0 12px 12px 0',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'background-color 0.3s, opacity 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'var(--accent-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--accent-color)';
                }}
              >
                ↑
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
              fontSize: '0.8rem'
            }}>
              <div style={{
                color: 'var(--text-color)',
                opacity: 0.7
              }}>
                Free users: 30 messages per day
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-color)'
                }}>
                  Storyteller Mode
                  <div style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '36px',
                    height: '20px',
                    marginLeft: '0.5rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={storytellerMode}
                      onChange={toggleStorytellerMode}
                      style={{
                        opacity: 0,
                        width: 0,
                        height: 0
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: storytellerMode ? 'var(--accent-color)' : 'rgba(0,0,0,0.25)',
                      transition: '0.3s',
                      borderRadius: '20px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '""',
                        height: '16px',
                        width: '16px',
                        left: storytellerMode ? '18px' : '2px',
                        bottom: '2px',
                        background: 'white',
                        transition: '0.3s',
                        borderRadius: '50%'
                      }}></span>
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* FOOTER PROVERB - NEW: React managed */}
      <div style={{
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
        fontFamily: 'var(--quote-font)',
        pointerEvents: 'none',
        zIndex: 40
      }}>
        {currentProverb}
      </div>
      
      {/* COPYRIGHT */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.6,
        transition: 'color 0.3s',
        pointerEvents: 'none',
        zIndex: 40
      }}>
        © 2025 GriotBot. All rights reserved.
      </div>

      {/* MODEL USAGE DASHBOARD */}
      {process.env.NODE_ENV === 'development' && <ModelUsageDashboard />}
    </>
  );
}
