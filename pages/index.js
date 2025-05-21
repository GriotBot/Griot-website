// pages/index.js
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [storytellerMode, setStorytellerMode] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('griotbot-history');
      if (savedMessages && JSON.parse(savedMessages).length > 0) {
        setMessages(JSON.parse(savedMessages));
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      localStorage.removeItem('griotbot-history');
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('griotbot-history', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [messages]);

  // Handle text input change
  const handleTextChange = (e) => {
    setText(e.target.value);
    
    // Auto-adjust height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = 
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;
    
    // Hide welcome and add user message
    setShowWelcome(false);
    
    const userMessage = {
      role: 'user',
      content: trimmedText,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setText('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '55px';
    }
    
    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: trimmedText,
          storytellerMode
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const botContent = data.choices?.[0]?.message?.content || 
                       'I apologize, but I seem to be having trouble processing your request.';
      
      // Add bot response
      const botMessage = {
        role: 'bot',
        content: botContent,
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      
      // Add error message
      const errorMessage = {
        role: 'bot',
        content: `I'm sorry, I encountered an error: ${error.message}. Please try again later.`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion card click
  const handleSuggestion = (prompt) => {
    setText(prompt);
    
    // Use setTimeout to ensure setText has completed
    setTimeout(() => {
      const form = document.getElementById('chat-form');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
    }, 10);
  };

  // Handle new chat
  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem('griotbot-history');
  };

  // Format message content (helper function)
  const formatMessageContent = (content) => {
    if (!content) return '';
    
    // Replace newlines with <br>
    let formatted = content.replace(/\n/g, '<br>');
    
    // Format quotes
    const quoteRegex = /"([^"]+)"/g;
    formatted = formatted.replace(quoteRegex, 
      '<div style="font-style: italic; border-left: 3px solid rgba(255, 255, 255, 0.5); padding-left: 0.8rem; margin: 0.8rem 0; font-family: var(--quote-font, \'Lora\', serif);">"$1"</div>'
    );
    
    return formatted;
  };

  // Format timestamp (helper function)
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--header-bg, #c49a6c)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1rem',
        zIndex: 100,
        boxShadow: '0 2px 10px var(--shadow-color, rgba(75, 46, 42, 0.15))'
      }}>
        <button
          onClick={toggleSidebar}
          style={{
            position: 'absolute',
            left: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--header-text, #33302e)',
          }}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img 
            src="/images/GriotBot logo horiz wht.svg" 
            alt="GriotBot" 
            style={{
              height: '32px',
              width: 'auto',
            }}
          />
        </div>
        
        <button
          onClick={handleNewChat}
          style={{
            position: 'absolute',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--header-text, #33302e)',
          }}
          aria-label="New chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
      </header>
      
      {/* Sidebar */}
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '280px',
          background: 'var(--sidebar-bg, rgba(75, 46, 42, 0.97))',
          color: 'var(--sidebar-text, #f8f5f0)',
          padding: '1.5rem',
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out, background 0.3s',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '4px 0 20px var(--shadow-color, rgba(75, 46, 42, 0.15))',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          paddingTop: '60px',
        }}
        aria-hidden={!sidebarVisible}
        aria-label="Main navigation"
      >
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
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNewChat();
              setSidebarVisible(false);
            }}
            style={{
              color: 'var(--sidebar-text, #f8f5f0)',
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
              display: 'block',
              marginBottom: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <span aria-hidden="true" style={{ marginRight: '0.5rem' }}>+</span> New Chat
          </a>
          <a href="#" style={{
            color: 'var(--sidebar-text, #f8f5f0)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            Saved Conversations
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
            color: 'var(--sidebar-text, #f8f5f0)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            Historical Figures
          </a>
          <a href="#" style={{
            color: 'var(--sidebar-text, #f8f5f0)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            Cultural Stories
          </a>
          <a href="#" style={{
            color: 'var(--sidebar-text, #f8f5f0)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
          }}>
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
          <a href="/about" style={{
            color: 'var(--sidebar-text, #f8f5f0)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            About GriotBot
          </a>
          <a href="/feedback" style={{
            color: 'var(--sidebar-text, #f8f5f0)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
          }}>
            Share Feedback
          </a>
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

      {/* Main Content */}
      <main 
        style={{ 
          paddingTop: '60px',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={() => sidebarVisible && setSidebarVisible(false)}
      >
        {showWelcome ? (
          <div
            className="welcome-container"
            style={{
              height: 'calc(100vh - 160px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            <div className="logo-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
            <h1 style={{ 
              fontFamily: 'var(--heading-font, "Lora", serif)', 
              color: 'var(--header-bg, #c49a6c)', 
              fontSize: '2.5rem',
              margin: '0.5rem 0'
            }}>
              Welcome to GriotBot
            </h1>
            <p style={{ 
              maxWidth: '600px', 
              margin: '1rem 0',
              color: 'var(--text-color)',
              fontSize: '1.1rem'
            }}>
              Your AI companion for culturally rich conversations and wisdom
            </p>
            <blockquote
              style={{ 
                fontStyle: 'italic', 
                maxWidth: '800px', 
                margin: '1.5rem 0',
                padding: '0 1.5rem',
                position: 'relative',
                color: 'var(--wisdom-color, #6b4226)',
                fontFamily: 'var(--quote-font, "Lora", serif)',
                lineHeight: 1.7
              }}
            >
              "A people without the knowledge of their past history, origin and culture
              is like a tree without roots."
              <cite style={{ 
                display: 'block', 
                marginTop: '.5rem',
                fontWeight: 500 
              }}>
                — Marcus Garvey
              </cite>
            </blockquote>

            {/* Suggestion cards */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '2rem',
              width: '100%',
              maxWidth: '700px'
            }}>
              {[
                {
                  category: 'STORYTELLING',
                  title: 'Tell me a diaspora story about resilience',
                  prompt: 'Tell me a story about resilience from the African diaspora'
                },
                {
                  category: 'WISDOM',
                  title: 'African wisdom on community building',
                  prompt: 'Share some wisdom about community building from African traditions'
                },
                {
                  category: 'PERSONAL',
                  title: 'Connect with my cultural heritage',
                  prompt: 'How can I connect more with my cultural heritage?'
                },
                {
                  category: 'HISTORY',
                  title: 'The significance of Juneteenth',
                  prompt: 'Explain the historical significance of Juneteenth'
                }
              ].map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestion(card.prompt)}
                  style={{
                    backgroundColor: 'var(--card-bg, #ffffff)',
                    padding: '1rem',
                    borderRadius: '12px',
                    width: 'calc(50% - 0.5rem)',
                    minWidth: '200px',
                    boxShadow: '0 3px 10px var(--shadow-color, rgba(75, 46, 42, 0.15))',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    flex: '1 1 40%',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 15px var(--shadow-color, rgba(75, 46, 42, 0.15))';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 3px 10px var(--shadow-color, rgba(75, 46, 42, 0.15))';
                  }}
                >
                  <div style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    color: 'var(--accent-color, #d7722c)',
                    fontWeight: 500,
                    marginBottom: '0.5rem'
                  }}>
                    {card.category}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--heading-font, "Lora", serif)',
                    fontWeight: 600,
                    margin: 0,
                    fontSize: '1.1rem'
                  }}>
                    {card.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div 
            style={{ 
              padding: '1rem', 
              height: 'calc(100vh - 140px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: '700px',
              margin: '0 auto',
              paddingBottom: '80px',
            }}
          >
            {/* Message list */}
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role}`}
                style={{
                  padding: '1rem 1.2rem',
                  margin: '0.5rem 0',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                  boxShadow: '0 3px 6px var(--shadow-color, rgba(75, 46, 42, 0.15))',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: message.role === 'user' 
                    ? 'var(--user-bubble, #bd8735)' 
                    : message.isError
                      ? '#d65353'
                      : 'var(--bot-bubble-start, #7d8765)',
                  backgroundImage: message.role === 'bot' && !message.isError
                    ? 'linear-gradient(135deg, var(--bot-bubble-start, #7d8765), var(--bot-bubble-end, #5e6e4f))'
                    : 'none',
                  color: message.role === 'user' 
                    ? 'var(--user-text, #f8f5f0)' 
                    : 'var(--bot-text, #f8f5f0)',
                  animation: 'message-fade-in 0.3s ease-out forwards',
                  lineHeight: 1.6,
                }}
              >
                {message.role === 'bot' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.8rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                  }}>
                    <span style={{ fontSize: '1.2rem' }} aria-hidden="true">🌿</span>
                    <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>GriotBot</span>
                  </div>
                )}
                <div 
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ 
                    __html: formatMessageContent(message.content) 
                  }} 
                />
                {message.role === 'bot' && (
                  <div style={{
                    fontSize: '0.7rem',
                    opacity: 0.7,
                    marginTop: '0.5rem',
                    textAlign: 'right',
                  }}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div 
                className="message bot thinking"
                style={{
                  padding: '1rem 1.2rem',
                  margin: '0.5rem 0',
                  borderRadius: '12px',
                  alignSelf: 'flex-start',
                  backgroundColor: 'var(--bot-bubble-start, #7d8765)',
                  backgroundImage: 'linear-gradient(135deg, var(--bot-bubble-start, #7d8765), var(--bot-bubble-end, #5e6e4f))',
                  color: 'var(--bot-text, #f8f5f0)',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 0.8,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.8rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <span style={{ fontSize: '1.2rem' }} aria-hidden="true">🌿</span>
                  <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>GriotBot</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '0.5rem' }}>
                  <div className="typing-dot" style={{
                    height: '8px',
                    width: '8px',
                    margin: '0 2px',
                    backgroundColor: 'var(--bot-text, #f8f5f0)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    opacity: 0.7,
                  }}></div>
                  <div className="typing-dot" style={{
                    height: '8px',
                    width: '8px',
                    margin: '0 2px',
                    backgroundColor: 'var(--bot-text, #f8f5f0)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    opacity: 0.7,
                  }}></div>
                  <div className="typing-dot" style={{
                    height: '8px',
                    width: '8px',
                    margin: '0 2px',
                    backgroundColor: 'var(--bot-text, #f8f5f0)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    opacity: 0.7,
                  }}></div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={chatEndRef} />
          </div>
        )}
        
        {/* Chat form */}
        <form
          id="chat-form"
          onSubmit={handleSubmit}
          style={{
            position: 'fixed',
            bottom: '50px',
            left: 0,
            width: '100%',
            backgroundColor: 'var(--bg-color, #f8f5f0)',
            padding: '1rem',
            borderTop: '1px solid var(--input-border, rgba(75, 46, 42, 0.2))',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div style={{
            width: '100%',
            maxWidth: '700px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex',
              boxShadow: '0 4px 12px var(--shadow-color, rgba(75, 46, 42, 0.15))',
              borderRadius: '12px',
              backgroundColor: 'var(--input-bg, #ffffff)',
            }}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                placeholder="Ask GriotBot about Black history, culture, or personal advice..."
                style={{
                  flex: 1,
                  padding: '0.9rem 1rem',
                  border: '1px solid var(--input-border, rgba(75, 46, 42, 0.2))',
                  borderRight: 'none',
                  borderRadius: '12px 0 0 12px',
                  outline: 'none',
                  resize: 'none',
                  height: '55px',
                  maxHeight: '120px',
                  backgroundColor: 'var(--input-bg, #ffffff)',
                  color: 'var(--input-text, #33302e)',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  lineHeight: 1.5,
                }}
                disabled={isLoading}
              ></textarea>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '55px',
                  backgroundColor: 'var(--accent-color, #d7722c)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0 12px 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
                aria-label="Send message"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
              fontSize: '0.8rem',
            }}>
              <div style={{
                color: 'var(--text-color, #33302e)',
                opacity: 0.7,
              }}>
                Free users: 30 messages per day
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
              }}>
                <label
                  htmlFor="storytellerMode"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  Storyteller Mode
                  <div style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '36px',
                    height: '20px',
                    marginLeft: '0.5rem',
                  }}>
                    <input
                      type="checkbox"
                      id="storytellerMode"
                      checked={storytellerMode}
                      onChange={() => setStorytellerMode(!storytellerMode)}
                      style={{
                        opacity: 0,
                        width: 0,
                        height: 0,
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: storytellerMode 
                        ? 'var(--accent-color, #d7722c)' 
                        : 'rgba(0,0,0,0.25)',
                      transition: '.3s',
                      borderRadius: '20px',
                    }}>
                      <div style={{
                        position: 'absolute',
                        height: '16px',
                        width: '16px',
                        left: storytellerMode ? '18px' : '2px',
                        bottom: '2px',
                        backgroundColor: 'white',
                        transition: '.3s',
                        borderRadius: '50%',
                      }}></div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </form>
        
        {/* Random Proverb & Copyright */}
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            width: '100%',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            padding: '0 1rem',
            color: 'var(--wisdom-color, #6b4226)',
            transition: 'color 0.3s',
            opacity: 0.8,
            fontFamily: 'Lora, serif',
            pointerEvents: 'none',
            zIndex: 40,
          }}
          aria-label="Random proverb"
        >
          It takes a village to raise a child. - African Proverb
        </div>
        
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            width: '100%',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-color, #33302e)',
            opacity: 0.6,
            transition: 'color 0.3s',
            pointerEvents: 'none',
            zIndex: 40,
          }}
          aria-label="Copyright information"
        >
          © 2025 GriotBot. All rights reserved.
        </div>
      </main>

      {/* Animations */}
      <style jsx global>{`
        @keyframes message-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .typing-dot:nth-child(1) {
          animation: typing-bounce 1.4s infinite ease-in-out both;
          animation-delay: 0s;
        }
        
        .typing-dot:nth-child(2) {
          animation: typing-bounce 1.4s infinite ease-in-out both;
          animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
          animation: typing-bounce 1.4s infinite ease-in-out both;
          animation-delay: 0.4s;
        }
        
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  );
