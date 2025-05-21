// pages/index.js
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ChatInput from '../components/ChatInput';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('griotbot-history');
      if (savedMessages && JSON.parse(savedMessages).length > 0) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // If there's an error, clear the potentially corrupted history
      localStorage.removeItem('griotbot-history');
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('griotbot-history', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [messages]);

  // Handle sending user message and getting bot response
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Hide welcome screen if visible
    setShowWelcome(false);
    
    // Add user message to chat
    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    try {
      // Call API to get bot response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: text,
          storytellerMode: document.getElementById('storytellerMode')?.checked || false
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const botContent = data.choices?.[0]?.message?.content || 
                         'I apologize, but I seem to be having trouble processing your request.';
      
      // Add bot response to chat
      const botMessage = {
        role: 'bot',
        content: botContent,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      
      // Add error message to chat
      const errorMessage = {
        role: 'bot',
        content: `I'm sorry, I encountered an error: ${error.message}. Please try again later.`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle starting a new chat
  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem('griotbot-history');
  };

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout onNewChat={handleNewChat}>
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

            {/* Suggestion cards grid */}
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
                  onClick={() => handleSendMessage(card.prompt)}
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
            ref={chatContainerRef}
            style={{ 
              padding: '1rem', 
              minHeight: 'calc(100vh - 180px)', 
              maxHeight: 'calc(100vh - 180px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: '700px',
              margin: '0 auto',
              paddingBottom: '140px', // Make room for the input box
            }}
          >
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

            {/* Loading indicator when waiting for bot response */}
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
                  <span style={{
                    height: '8px',
                    width: '8px',
                    margin: '0 2px',
                    backgroundColor: 'var(--bot-text, #f8f5f0)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    opacity: 0.7,
                    animation: 'typing-bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0s',
                  }}></span>
                  <span style={{
                    height: '8px',
                    width: '8px',
                    margin: '0 2px',
                    backgroundColor: 'var(--bot-text, #f8f5f0)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    opacity: 0.7,
                    animation: 'typing-bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.2s',
                  }}></span>
                  <span style={{
                    height: '8px',
                    width: '8px',
                    margin: '0 2px',
                    backgroundColor: 'var(--bot-text, #f8f5f0)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    opacity: 0.7,
                    animation: 'typing-bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.4s',
                  }}></span>
                </div>
              </div>
            )}

            {/* Ref element for auto-scrolling */}
            <div ref={chatEndRef} />
          </div>
        )}
        
        {/* Chat input component */}
        <ChatInput 
          onSubmit={handleSendMessage}
          disabled={isLoading}
          showStorytellerMode={true}
        />
      </Layout>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes message-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}

// Helper function to format message content
function formatMessageContent(content) {
  if (!content) return '';
  
  // Replace newlines with <br>
  let formatted = content.replace(/\n/g, '<br>');
  
  // Detect and format quoted text/proverbs with a special style
  // This is a simple implementation - for production, use a more robust approach
  const quoteRegex = /"([^"]+)"/g;
  formatted = formatted.replace(quoteRegex, '<div style="font-style: italic; border-left: 3px solid rgba(255, 255, 255, 0.5); padding-left: 0.8rem; margin: 0.8rem 0; font-family: var(--quote-font, \'Lora\', serif);">"$1"</div>');
  
  return formatted;
}

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
