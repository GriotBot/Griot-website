// pages/index.js
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Import components that don't rely on browser APIs
import Layout from '../components/layout/Layout';
const ChatInput = dynamic(() => import('../components/ChatInput'), { ssr: false });
const FooterProverb = dynamic(() => import('../components/FooterProverb'), { ssr: false });
const FooterCopyright = dynamic(() => import('../components/FooterCopyright'), { ssr: false });

// Force server-side rendering
export async function getServerSideProps() {
  return { props: {} };
}

export default function Home({ isClient }) {
  // State variables
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [thinkingPhraseIndex, setThinkingPhraseIndex] = useState(0);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  
  // Refs
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  
  // Thinking phrases
  const thinkingPhrases = [
    "Seeking ancestral wisdom...",
    "Consulting the elders...",
    "Weaving a response...",
    "Gathering knowledge...",
    "Remembering the traditions..."
  ];

  useEffect(() => {
    // Only run this in the browser
    if (typeof window === 'undefined') return;
    
    // Try to load chat history from localStorage
    try {
      const hist = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
      if (hist && hist.length > 0) {
        setMessages(hist);
        setShowWelcome(false);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      localStorage.removeItem('griotbot-history');
    }
    
    // Add event listeners to suggestion cards and category tabs
    const attachClickHandlers = () => {
      document.querySelectorAll('.suggestion-card, .category-tab').forEach(element => {
        element.addEventListener('click', () => {
          const prompt = element.getAttribute('data-prompt');
          if (prompt) handleSendMessage(prompt, false);
        });
      });
    };
    
    // Delay this slightly to ensure DOM is ready
    setTimeout(attachClickHandlers, 500);
    
    // Clean up function to remove event listeners
    return () => {
      document.querySelectorAll('.suggestion-card, .category-tab').forEach(element => {
        element.removeEventListener('click', () => {});
      });
    };
  }, []);
  
  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Effect for thinking phrases animation
  useEffect(() => {
    if (!messages.some(m => m.thinking)) return;
    
    const interval = setInterval(() => {
      setThinkingPhraseIndex(prev => (prev + 1) % thinkingPhrases.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [messages, thinkingPhrases.length]);

  // Function to handle sending messages
  const handleSendMessage = async (text, storytellerMode) => {
    // Don't do anything if no text
    if (!text || !text.trim()) return;
    
    // Hide welcome screen
    setShowWelcome(false);
    
    // Add user message to state
    const userMessage = {
      role: 'user',
      content: text,
      time: new Date().toISOString()
    };
    
    // Add thinking indicator
    const thinkingMessage = {
      role: 'bot',
      content: '...',
      time: new Date().toISOString(),
      thinking: true
    };
    
    const updatedMessages = [...messages, userMessage, thinkingMessage];
    setMessages(updatedMessages);
    
    try {
      // Make API call to chat endpoint
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: text,
          storytellerMode: storytellerMode || false
        })
      });
      
      if (!res.ok) {
        let errorMessage = `Error: Status ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Ignore parsing errors
        }
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                        'I apologize, but I seem to be having trouble processing your request.';
      
      // Replace thinking with actual response
      const finalMessages = updatedMessages.slice(0, -1).concat({
        role: 'bot',
        content: botResponse,
        time: new Date().toISOString()
      });
      
      setMessages(finalMessages);
      
      // Save to localStorage
      try {
        localStorage.setItem('griotbot-history', JSON.stringify(finalMessages.slice(-50)));
      } catch (err) {
        console.error('Error saving chat history:', err);
      }
    } catch (err) {
      console.error('API error:', err);
      
      // Replace thinking with error message
      const finalMessages = updatedMessages.slice(0, -1).concat({
        role: 'bot',
        content: `I'm sorry, I encountered an error: ${err.message}. Please try again later.`,
        time: new Date().toISOString()
      });
      
      setMessages(finalMessages);
      
      // Save to localStorage
      try {
        localStorage.setItem('griotbot-history', JSON.stringify(finalMessages.slice(-50)));
      } catch (err) {
        console.error('Error saving chat history:', err);
      }
    }
  };
  
  // Function to copy message content to clipboard
  const copyToClipboard = (text) => {
    if (typeof navigator === 'undefined') return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedMessageId(text.substring(0, 20));
        setTimeout(() => setCopiedMessageId(null), 2000);
      })
      .catch(err => console.error('Failed to copy:', err));
  };
  
  // Function to handle user feedback
  const handleFeedback = (messageId, isPositive) => {
    setFeedbackGiven(prev => ({
      ...prev,
      [messageId]: isPositive ? 'positive' : 'negative'
    }));
    
    // You could send this feedback to your server here
  };
  
  // Function to regenerate a response
  const regenerateResponse = async (promptText) => {
    if (!promptText) return;
    
    // Find the user message and bot response
    let userMessageIndex = -1;
    let botResponseIndex = -1;
    
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user' && messages[i].content === promptText) {
        userMessageIndex = i;
        if (i + 1 < messages.length && messages[i + 1].role === 'bot') {
          botResponseIndex = i + 1;
        }
        break;
      }
    }
    
    if (userMessageIndex === -1) return;
    
    // Create updated messages array
    let updatedMessages;
    if (botResponseIndex !== -1) {
      updatedMessages = [
        ...messages.slice(0, botResponseIndex),
        {
          role: 'bot',
          content: '...',
          time: new Date().toISOString(),
          thinking: true
        }
      ];
    } else {
      updatedMessages = [
        ...messages,
        {
          role: 'bot',
          content: '...',
          time: new Date().toISOString(),
          thinking: true
        }
      ];
    }
    
    setMessages(updatedMessages);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: promptText,
          storytellerMode: false,
          isRegeneration: true
        })
      });
      
      if (!res.ok) {
        throw new Error(`Error: Status ${res.status}`);
      }
      
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                         'I apologize, but I seem to be having trouble generating a new response.';
      
      const finalMessages = updatedMessages.slice(0, -1).concat({
        role: 'bot',
        content: botResponse,
        time: new Date().toISOString()
      });
      
      setMessages(finalMessages);
      
      // Save to localStorage
      try {
        localStorage.setItem('griotbot-history', JSON.stringify(finalMessages.slice(-50)));
      } catch (err) {
        console.error('Error saving chat history:', err);
      }
    } catch (err) {
      console.error('Error regenerating response:', err);
      
      const finalMessages = updatedMessages.slice(0, -1).concat({
        role: 'bot',
        content: `I'm sorry, I encountered an error: ${err.message}. Please try again later.`,
        time: new Date().toISOString()
      });
      
      setMessages(finalMessages);
      
      // Save to localStorage
      try {
        localStorage.setItem('griotbot-history', JSON.stringify(finalMessages.slice(-50)));
      } catch (err) {
        console.error('Error saving chat history:', err);
      }
    }
  };

  // Function to handle clearing the chat
  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    try {
      localStorage.removeItem('griotbot-history');
    } catch (err) {
      console.error('Error clearing chat history:', err);
    }
  };

  // If not client-side yet, show minimal loading view
  if (!isClient) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1>GriotBot</h1>
        <p>Loading your digital griot experience...</p>
      </div>
    );
  }

  // Main rendering (client-side only)
  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        
        {/* Add animations for thinking indicator */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes typingBounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          
          @keyframes pulse {
            0% { opacity: 0.6; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.6; transform: scale(0.95); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}} />
      </Head>

      <Layout>
        {/* MAIN CHAT AREA */}
        <main 
          id="chat-container" 
          ref={chatContainerRef}
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
        >
          {showWelcome ? (
            <div className="welcome-container" id="welcome" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '100%',
              margin: '1rem auto 2rem',
              width: '100%',
              padding: '0 1rem',
            }}>
              {/* Welcome Header */}
              <h1 style={{
                color: '#c49a6c',
                fontSize: '2.5rem',
                fontFamily: 'Lora, serif',
                margin: '2rem 0 0.5rem',
                fontWeight: 'normal',
                textAlign: 'center',
                width: '100%',
              }}>
                Welcome to GriotBot
              </h1>
              
              {/* Subtitle */}
              <p style={{
                color: 'var(--text-color)',
                fontSize: '1.1rem',
                opacity: 0.85,
                marginBottom: '2rem',
                textAlign: 'center',
                maxWidth: '600px',
              }}>
                Your AI companion for culturally rich conversations and wisdom
              </p>
              
              {/* Marcus Garvey Quote */}
              <div style={{
                fontStyle: 'italic',
                color: '#6b4226',
                margin: '1rem 0 3rem',
                maxWidth: '800px',
                textAlign: 'center',
                fontSize: '1.2rem',
                lineHeight: 1.5,
              }}>
                "A people without the knowledge of their past history,<br/>
                origin and culture is like a tree without roots."
                <div style={{
                  marginTop: '0.75rem',
                  fontStyle: 'normal',
                  fontSize: '1rem',
                }}>
                  — Marcus Mosiah Garvey
                </div>
              </div>
              
              {/* Tabs/Category Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto 2rem',
              }}>
                <div 
                  className="category-tab" 
                  data-prompt="Tell me a story about resilience from the African diaspora"
                  style={{
                    backgroundColor: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#d7722c',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    fontSize: '1rem',
                    minWidth: '180px',
                  }}
                >
                  STORYTELLING
                </div>
                
                <div 
                  className="category-tab" 
                  data-prompt="Share some wisdom about community building from African traditions"
                  style={{
                    backgroundColor: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#d7722c',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    fontSize: '1rem',
                    minWidth: '180px',
                  }}
                >
                  WISDOM
                </div>
                
                <div 
                  className="category-tab" 
                  data-prompt="Explain the historical significance of Juneteenth"
                  style={{
                    backgroundColor: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#d7722c',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    fontSize: '1rem',
                    minWidth: '180px',
                  }}
                >
                  HISTORY
                </div>
              </div>
              
              {/* Legacy cards (hidden) */}
              <div className="suggestion-cards" style={{ display: 'none' }}>
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
          ) : (
            <div id="chat" aria-live="polite" style={{ 
              width: '100%', 
              maxWidth: '700px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.role} ${message.thinking ? 'thinking' : ''}`}
                  style={{
                    padding: '1rem 1.2rem',
                    margin: '0.5rem 0',
                    borderRadius: '12px',
                    maxWidth: message.role === 'user' ? '50%' : '85%',
                    width: message.role === 'bot' ? '85%' : 'fit-content',
                    wordWrap: 'break-word',
                    boxShadow: '0 3px 6px var(--shadow-color)',
                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: message.role === 'user' 
                      ? 'var(--user-bubble)' 
                      : 'var(--bot-bubble-start)',
                    color: message.role === 'user' 
                      ? 'var(--user-text)' 
                      : 'var(--bot-text)',
                    display: 'block',
                    marginLeft: message.role === 'user' ? 'auto' : '0',
                    marginRight: message.role === 'bot' ? 'auto' : '0',
                  }}
                >
                  {message.thinking ? (
                    // Thinking indicator content
                    <div className="thinking-state" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem 0.5rem',
                      gap: '0.75rem',
                      width: '100%'
                    }}>
                      <div className="bot-header" style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.8rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100%'
                      }}>
                        <span style={{ 
                          fontSize: '1.5rem' 
                        }} aria-hidden="true">🌿</span>
                        <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>GriotBot</span>
                      </div>
                      
                      <div style={{
                        fontStyle: 'italic',
                        marginBottom: '0.5rem',
                        color: 'rgba(255,255,255,0.9)',
                        animation: 'fadeIn 0.5s ease-in'
                      }}>
                        {thinkingPhrases[thinkingPhraseIndex]}
                      </div>
                      
                      <div className="typing-animation" style={{
                        display: 'flex',
                        gap: '0.4rem',
                        justifyContent: 'center'
                      }}>
                        {[0, 1, 2].map((i) => (
                          <span key={i} style={{
                            height: '8px',
                            width: '8px',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'typingBounce 1.4s infinite ease-in-out both',
                            animationDelay: `${i * 0.2}s`
                          }}></span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.role === 'bot' && (
                        <>
                          <div className="bot-header" style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '0.8rem',
                            paddingBottom: '0.5rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                          }}>
                            <span style={{ 
                              fontSize: '1.5rem' 
                            }} aria-hidden="true">🌿</span>
                            <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>GriotBot</span>
                          </div>
                          
                          <div>{message.content}</div>
                          
                          {/* Message actions */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '0.8rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            paddingTop: '0.5rem',
                          }}>
                            <div className="message-time" style={{
                              fontSize: '0.7rem',
                              opacity: 0.7,
                            }}>
                              {new Date(message.time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                            
                            <div style={{
                              display: 'flex',
                              gap: '0.75rem',
                            }}>
                              {/* Action buttons */}
                              <button 
                                onClick={() => copyToClipboard(message.content)} 
                                aria-label="Copy response"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  opacity: 0.8,
                                }}
                              >
                                {copiedMessageId === message.content.substring(0, 20) ? (
                                  "✓"
                                ) : (
                                  "📋"
                                )}
                              </button>
                              
                              <button 
                                onClick={() => handleFeedback(index, true)} 
                                aria-label="Helpful response"
                                disabled={feedbackGiven[index]}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: feedbackGiven[index] === 'positive' ? 'rgba(121, 214, 152, 1)' : 'rgba(255, 255, 255, 0.7)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '4px',
                                  cursor: feedbackGiven[index] ? 'default' : 'pointer',
                                  opacity: feedbackGiven[index] ? 1 : 0.8,
                                }}
                              >
                                👍
                              </button>
                              
                              <button 
                                onClick={() => handleFeedback(index, false)} 
                                aria-label="Unhelpful response"
                                disabled={feedbackGiven[index]}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: feedbackGiven[index] === 'negative' ? 'rgba(239, 83, 80, 1)' : 'rgba(255, 255, 255, 0.7)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '4px',
                                  cursor: feedbackGiven[index] ? 'default' : 'pointer',
                                  opacity: feedbackGiven[index] ? 1 : 0.8,
                                }}
                              >
                                👎
                              </button>
                                  <button 
                                onClick={() => {
                                  const userMessageIndex = index - 1;
                                  if (userMessageIndex >= 0 && messages[userMessageIndex].role === 'user') {
                                    regenerateResponse(messages[userMessageIndex].content);
                                  }
                                }} 
                                aria-label="Regenerate response"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  opacity: 0.8,
                                }}
                              >
                                🔄
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {message.role === 'user' && (
                        <div>{message.content}</div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {/* Invisible element to scroll to */}
              <div ref={chatEndRef} style={{ height: '1px', opacity: 0 }} />
            </div>
          )}
        </main>

        {/* Input component */}
        <ChatInput onSubmit={handleSendMessage} />

        {/* Direct footer components */}
        <FooterProverb />
        <FooterCopyright />
      </Layout>
    </>
  );
}
                              
                              <button 
                                onClick={() => {
                                  const userMessageIndex = index - 1;
                                  if (userMessageIndex >= 0 && messages[userMessageIndex].role === 'user') {
