// pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import ChatFooter from '../components/ChatFooter';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [theme, setTheme] = useState('light');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // Load saved theme
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      
      // Load chat history
      loadChatHistory();
    }
  }, []);

  // Load chat history from localStorage
  const loadChatHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
      if (history.length > 0) {
        setMessages(history);
        setShowWelcome(false);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      localStorage.removeItem('griotbot-history');
    }
  };

  // Save chat history to localStorage
  const saveChatHistory = (newMessages) => {
    try {
      // Keep only the last 50 messages
      const messagesToSave = newMessages.slice(-50);
      localStorage.setItem('griotbot-history', JSON.stringify(messagesToSave));
    } catch (err) {
      console.error('Error saving chat history:', err);
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('griotbot-theme', newTheme);
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem('griotbot-history');
  };

  // Handle sending message
  const handleSendMessage = async (messageText, storytellerMode) => {
    if (!messageText.trim()) return;

    setIsLoading(true);
    setShowWelcome(false);

    // Add user message
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      // Call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: messageText,
          storytellerMode: storytellerMode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: Status ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                         'I apologize, but I seem to be having trouble processing your request.';

      // Add bot message
      const botMessage = {
        role: 'bot',
        content: botResponse,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (error) {
      console.error('API error:', error);
      
      // Add error message
      const errorMessage = {
        role: 'bot',
        content: `I'm sorry, I encountered an error: ${error.message}. Please try again later.`,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion card clicks
  const handleSuggestionClick = (prompt) => {
    handleSendMessage(prompt, false);
  };

  // Don't render until client-side
  if (!isClient) {
    return null;
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
      </Head>
      
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--header-bg, #c49a6c)',
        color: 'var(--header-text, #33302e)',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        boxShadow: '0 2px 10px rgba(75, 46, 42, 0.15)',
        zIndex: 100,
        fontFamily: 'Lora, serif',
        height: '60px',
      }}>
        <button 
          onClick={() => setSidebarVisible(!sidebarVisible)}
          style={{
            position: 'absolute',
            left: '1rem',
            fontSize: '1.5rem',
            color: 'var(--header-text, #33302e)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
          }}
        >
          ☰
        </button>
        
        <button 
          onClick={handleNewChat}
          style={{
            position: 'absolute',
            left: '4rem',
            fontSize: '1.2rem',
            color: 'var(--header-text, #33302e)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
          }}
          title="New Chat"
        >
          + New
        </button>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <span>GriotBot</span>
        </div>
        
        <button 
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            right: '1rem',
            fontSize: '1.5rem',
            color: 'var(--header-text, #33302e)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Main Content */}
      <main style={{
        paddingTop: '60px',
        paddingBottom: '200px', // Space for chat footer
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color, #f8f5f0)',
        color: 'var(--text-color, #33302e)',
        fontFamily: 'Montserrat, sans-serif',
        transition: 'background-color 0.3s, color 0.3s',
      }}>
        {/* Welcome Screen */}
        {showWelcome && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '2rem auto',
            padding: '2rem',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
            
            <h1 style={{
              fontFamily: 'Lora, serif',
              fontSize: '2rem',
              marginBottom: '1rem',
            }}>
              Welcome to GriotBot
            </h1>
            
            <p style={{
              fontSize: '1.1rem',
              marginBottom: '2rem',
              opacity: 0.8,
            }}>
              Your AI companion for culturally rich conversations and wisdom
            </p>
            
            <div style={{
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: 'var(--wisdom-color, #6b4226)',
              marginBottom: '2rem',
              fontFamily: 'Lora, serif',
            }}>
              "A people without the knowledge of their past history,<br/>
              origin and culture is like a tree without roots."
              <div style={{ marginTop: '0.5rem', fontWeight: '500' }}>
                — Marcus Mosiah Garvey
              </div>
            </div>

            {/* Suggestion Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              width: '100%',
              maxWidth: '600px',
            }}>
              {[
                { category: 'Storytelling', title: 'Tell me a diaspora story about resilience', prompt: 'Tell me a story about resilience from the African diaspora' },
                { category: 'Wisdom', title: 'African wisdom on community building', prompt: 'Share some wisdom about community building from African traditions' },
                { category: 'History', title: 'The significance of Juneteenth', prompt: 'Explain the historical significance of Juneteenth' },
                { category: 'Personal Growth', title: 'Connect with my cultural heritage', prompt: 'How can I connect more with my cultural heritage?' },
              ].map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                  style={{
                    backgroundColor: 'var(--card-bg, #ffffff)',
                    padding: '1rem',
                    borderRadius: '12px',
                    boxShadow: '0 3px 10px rgba(75, 46, 42, 0.15)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 6px 15px rgba(75, 46, 42, 0.25)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 10px rgba(75, 46, 42, 0.15)';
                  }}
                >
                  <div style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    color: 'var(--accent-color, #d7722c)',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}>
                    {suggestion.category}
                  </div>
                  <h3 style={{ margin: 0, fontFamily: 'Lora, serif', fontSize: '1rem' }}>
                    {suggestion.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {!showWelcome && (
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: '1rem',
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '1rem',
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '1rem 1.2rem',
                  borderRadius: '12px',
                  backgroundColor: message.role === 'user' 
                    ? 'var(--accent-color, #d7722c)' 
                    : 'var(--card-bg, #ffffff)',
                  color: message.role === 'user' 
                    ? 'white' 
                    : 'var(--text-color, #33302e)',
                  boxShadow: '0 3px 6px rgba(75, 46, 42, 0.15)',
                  lineHeight: 1.6,
                }}>
                  {message.role === 'bot' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid rgba(0,0,0,0.1)',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}>
                      <span style={{ marginRight: '0.5rem' }}>🌿</span>
                      GriotBot
                    </div>
                  )}
                  {message.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '1rem',
              }}>
                <div style={{
                  padding: '1rem 1.2rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--card-bg, #ffffff)',
                  boxShadow: '0 3px 6px rgba(75, 46, 42, 0.15)',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>🌿</span>
                    GriotBot
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Thinking</span>
                    <div style={{
                      display: 'inline-flex',
                      marginLeft: '0.5rem',
                    }}>
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          style={{
                            height: '8px',
                            width: '8px',
                            margin: '0 2px',
                            backgroundColor: 'var(--accent-color, #d7722c)',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: `bounce 1.4s infinite ease-in-out both`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Chat Footer */}
      <ChatFooter 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />

      {/* Animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0); 
          }
          40% { 
            transform: scale(1); 
          }
        }
      `}</style>
    </>
  );
}
