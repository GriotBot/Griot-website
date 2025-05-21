// pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';

// Force server-side rendering
export async function getServerSideProps() {
  return { props: {} };
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Load messages from localStorage on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMessages = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
        if (savedMessages.length > 0) {
          setMessages(savedMessages);
          setShowWelcome(false);
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
      }
    }
  }, []);
  
  // Save messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem('griotbot-history', JSON.stringify(messages.slice(-50)));
      } catch (err) {
        console.error('Error saving chat history:', err);
      }
    }
  }, [messages]);
  
  // Function to handle sending messages
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Hide welcome screen
    setShowWelcome(false);
    setIsLoading(true);
    
    // Add user message
    const userMessage = {
      role: 'user',
      content: text,
      time: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    try {
      // Call API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: text,
          storytellerMode: false
        })
      });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                         'I apologize, but I seem to be having trouble processing your request.';
      
      // Add bot message
      const finalMessages = [...updatedMessages, {
        role: 'bot',
        content: botResponse,
        time: new Date().toISOString()
      }];
      
      setMessages(finalMessages);
      
    } catch (err) {
      console.error('API error:', err);
      
      // Add error message
      const finalMessages = [...updatedMessages, {
        role: 'bot',
        content: `I'm sorry, I encountered an error. Please try again later.`,
        time: new Date().toISOString()
      }];
      
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
      setInputValue('');
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (prompt) => {
    handleSendMessage(prompt);
  };
  
  // Clear chat history
  const handleClearChat = () => {
    setMessages([]);
    setShowWelcome(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('griotbot-history');
    }
  };
  
  return (
    <div style={{
      fontFamily: 'Montserrat, sans-serif',
      margin: 0,
      padding: 0,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f5f0',
      color: '#33302e'
    }}>
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
      <header style={{
        backgroundColor: '#c49a6c',
        color: '#33302e',
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
        height: '60px'
      }}>
        <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌿</span>
        <span>GriotBot</span>
      </header>
      
      {/* Main content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
        paddingBottom: '6rem',
        overflow: 'auto'
      }}>
        {showWelcome ? (
          <div style={{
            maxWidth: '800px',
            textAlign: 'center',
            margin: '2rem auto'
          }}>
            <h1 style={{
              color: '#c49a6c',
              fontFamily: 'Lora, serif',
              fontSize: '2rem',
              margin: '1rem 0'
            }}>
              Welcome to GriotBot
            </h1>
            
            <p style={{
              marginBottom: '2rem'
            }}>
              Your AI companion for culturally rich conversations and wisdom
            </p>
            
            <div style={{
              fontStyle: 'italic',
              color: '#6b4226',
              margin: '1rem 0 2rem',
              fontFamily: 'Lora, serif',
              fontSize: '1.1rem',
              lineHeight: 1.5
            }}>
              "A people without the knowledge of their past history,<br/>
              origin and culture is like a tree without roots."
              <div style={{ marginTop: '0.5rem' }}>
                — Marcus Mosiah Garvey
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <button
                onClick={() => handleSuggestionClick("Tell me a story about resilience from the African diaspora")}
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  minWidth: '200px',
                  color: '#d7722c',
                  fontWeight: 'bold',
                  margin: '0.5rem'
                }}
              >
                STORYTELLING
              </button>
              
              <button
                onClick={() => handleSuggestionClick("Share some wisdom about community building from African traditions")}
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  minWidth: '200px',
                  color: '#d7722c',
                  fontWeight: 'bold',
                  margin: '0.5rem'
                }}
              >
                WISDOM
              </button>
              
              <button
                onClick={() => handleSuggestionClick("Explain the historical significance of Juneteenth")}
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  minWidth: '200px',
                  color: '#d7722c',
                  fontWeight: 'bold',
                  margin: '0.5rem'
                }}
              >
                HISTORY
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            width: '100%',
            maxWidth: '700px'
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '8px',
                  width: message.role === 'bot' ? '85%' : 'auto',
                  marginLeft: message.role === 'user' ? 'auto' : '0',
                  backgroundColor: message.role === 'user' ? '#bd8735' : '#7d8765',
                  color: 'white',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
              >
                {message.role === 'bot' && (
                  <div style={{
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                    paddingBottom: '0.5rem'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>🌿</span>
                    GriotBot
                  </div>
                )}
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  opacity: 0.7,
                  marginTop: '0.5rem',
                  textAlign: 'right'
                }}>
                  {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                width: '85%',
                backgroundColor: '#7d8765',
                color: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.3)',
                  paddingBottom: '0.5rem'
                }}>
                  <span style={{ marginRight: '0.5rem' }}>🌿</span>
                  GriotBot
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '1rem' 
                }}>
                  <div>Thinking...</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Input area */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#f8f5f0',
        padding: '1rem',
        borderTop: '1px solid rgba(75, 46, 42, 0.2)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '700px'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask GriotBot about..."
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '8px 0 0 8px',
              border: '1px solid rgba(75, 46, 42, 0.2)',
              borderRight: 'none',
              outline: 'none',
              fontSize: '1rem'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage(inputValue);
              }
            }}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            style={{
              width: '50px',
              borderRadius: '0 8px 8px 0',
              border: 'none',
              backgroundColor: '#d7722c',
              color: 'white',
              fontSize: '1.2rem',
              cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !inputValue.trim() ? 0.7 : 1
            }}
          >
            ↑
          </button>
        </div>
      </div>
      
      {/* Clear chat button */}
      {!showWelcome && (
        <button
          onClick={handleClearChat}
          style={{
            position: 'fixed',
            top: '70px',
            right: '1rem',
            backgroundColor: 'rgba(215, 114, 44, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          New Chat
        </button>
      )}
      
      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#6b4226',
        opacity: 0.7,
        fontFamily: 'Lora, serif',
        fontStyle: 'italic',
        pointerEvents: 'none'
      }}>
        It takes a village to raise a child. — African Proverb
      </div>
    </div>
  );
}
