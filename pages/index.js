// File: pages/index.js (UPDATED WITH STANDARD LAYOUT)
import { useState, useEffect, useRef } from 'react';
import StandardLayout from '../components/layout/StandardLayout';

export default function Home() {
  // Chat state management
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Refs for scrolling
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto-scroll to bottom when new messages added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load chat history from localStorage
  const loadChatHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
      if (history.length > 0) {
        setMessages(history);
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      localStorage.removeItem('griotbot-history');
    }
  };

  // Save chat history to localStorage
  const saveChatHistory = (newMessages) => {
    try {
      const historyToSave = newMessages.slice(-50); // Keep last 50 messages
      localStorage.setItem('griotbot-history', JSON.stringify(historyToSave));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Handle sending messages
  const handleSendMessage = async (messageText, storytellerMode) => {
    if (!messageText.trim() || isLoading) return;

    // Hide welcome screen
    setShowWelcome(false);
    setIsLoading(true);

    // Create user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    // Create initial bot message for streaming
    const botMessage = {
      id: Date.now() + 1,
      role: 'bot',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    };

    // Add both messages
    const newMessages = [...messages, userMessage, botMessage];
    setMessages(newMessages);

    try {
      // API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText,
          storytellerMode: storytellerMode
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is streaming or JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response (current API)
        const data = await response.json();
        const botResponse = data.choices?.[0]?.message?.content || 
                          'I apologize, but I seem to be having trouble processing your request.';
        
        // Update bot message with complete response
        const updatedMessages = newMessages.map(msg => 
          msg.id === botMessage.id 
            ? { ...msg, content: botResponse, isStreaming: false }
            : msg
        );
        
        setMessages(updatedMessages);
        saveChatHistory(updatedMessages);
      } else {
        // Handle streaming response (future implementation)
        const reader = response.body.getReader();
        let accumulatedContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                accumulatedContent += content;

                // Update streaming message
                setMessages(prevMessages => 
                  prevMessages.map(msg => 
                    msg.id === botMessage.id 
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              } catch (e) {
                // Skip malformed chunks
              }
            }
          }
        }

        // Finalize streaming
        const finalMessages = newMessages.map(msg => 
          msg.id === botMessage.id 
            ? { ...msg, content: accumulatedContent, isStreaming: false }
            : msg
        );
        
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      }

    } catch (error) {
      console.error('Chat API error:', error);
      
      // Update with error message
      const errorMessages = newMessages.map(msg => 
        msg.id === botMessage.id 
          ? { 
              ...msg, 
              content: `I'm sorry, I encountered an error: ${error.message}. Please try again later.`,
              isStreaming: false 
            }
          : msg
      );
      
      setMessages(errorMessages);
      saveChatHistory(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion card clicks
  const handleSuggestionClick = (prompt) => {
    // Get current storyteller mode from localStorage
    const storytellerMode = localStorage.getItem('griotbot-storyteller-mode') === 'true';
    handleSendMessage(prompt, storytellerMode);
  };

  // Suggestion cards data
  const suggestionCards = [
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
      title: "The significance of Juneteenth",
      prompt: "Explain the historical significance of Juneteenth"
    }
  ];

  return (
    <StandardLayout 
      pageType="index"
      currentPath="/"
      onSendMessage={handleSendMessage}
      chatDisabled={isLoading}
    >
      <div 
        ref={chatContainerRef}
        style={{
          height: '100%',
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Welcome Screen - Only show when no messages */}
        {showWelcome && messages.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '2rem auto',
            flex: 1,
            justifyContent: 'center'
          }}>
            {/* Logo */}
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              <img 
                src="/images/logo-dark.svg"
                alt="GriotBot"
                style={{ height: '120px', width: 'auto' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ 
                display: 'none',
                fontSize: '4rem'
              }}>
                🌿
              </div>
            </div>

            {/* Welcome Title */}
            <h1 style={{
              fontFamily: 'var(--heading-font)',
              fontSize: '2rem',
              margin: '0.5rem 0',
              color: 'var(--text-color)'
            }}>
              Welcome to GriotBot
            </h1>

            {/* Subtitle */}
            <p style={{
              fontFamily: 'var(--body-font)',
              color: 'var(--text-color)',
              opacity: 0.8,
              marginBottom: '1.5rem',
              fontSize: '1.1rem'
            }}>
              Your AI companion for culturally rich conversations and wisdom
            </p>

            {/* Quote */}
            <div style={{
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: 'var(--wisdom-color)',
              textAlign: 'center',
              fontFamily: 'var(--quote-font)',
              lineHeight: 1.7,
              marginBottom: '2rem',
              position: 'relative',
              padding: '0 1.5rem',
              maxWidth: '600px'
            }}>
              "A people without the knowledge of their past history, origin and culture is like a tree without roots."
              <span style={{
                fontWeight: 500,
                display: 'block',
                marginTop: '0.5rem'
              }}>
                — Marcus Mosiah Garvey
              </span>
            </div>

            {/* Suggestion Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              width: '100%',
              maxWidth: '700px',
              marginBottom: '2rem'
            }}>
              {suggestionCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(card.prompt)}
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 3px 10px var(--shadow-color)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '1px solid var(--input-border)'
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
                    marginBottom: '0.5rem',
                    letterSpacing: '0.05em'
                  }}>
                    {card.category}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--heading-font)',
                    fontWeight: 600,
                    margin: 0,
                    color: 'var(--text-color)',
                    lineHeight: 1.3
                  }}>
                    {card.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            width: '100%',
            flex: 1
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '1rem'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '1rem 1.2rem',
                    borderRadius: '12px',
                    boxShadow: '0 3px 6px var(--shadow-color)',
                    background: message.role === 'user' 
                      ? 'var(--user-bubble)' 
                      : 'linear-gradient(135deg, var(--bot-bubble-start), var(--bot-bubble-end))',
                    color: message.role === 'user' ? 'var(--user-text)' : 'var(--bot-text)',
                    wordWrap: 'break-word',
                    lineHeight: 1.6,
                    position: 'relative'
                  }}
                >
                  {/* Bot message header */}
                  {message.role === 'bot' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.8rem',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <img 
                        src="/images/logo-light.svg"
                        alt="GriotBot"
                        style={{ height: '20px', width: 'auto', marginRight: '8px' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'inline';
                        }}
                      />
                      <span style={{ display: 'none' }}>🌿</span>
                      <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>GriotBot</span>
                    </div>
                  )}

                  {/* Message content */}
                  <div>
                    {message.content || (message.isStreaming && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            height: '8px',
                            width: '8px',
                            margin: '0 2px',
                            backgroundColor: 'var(--bot-text)',
                            borderRadius: '50%',
                            display: 'inline-block',
                            opacity: 0.7,
                            animation: 'typing-bounce 1.4s infinite ease-in-out both'
                          }} />
                          <span style={{
                            height: '8px',
                            width: '8px',
                            margin: '0 2px',
                            backgroundColor: 'var(--bot-text)',
                            borderRadius: '50%',
                            display: 'inline-block',
                            opacity: 0.7,
                            animation: 'typing-bounce 1.4s infinite ease-in-out both',
                            animationDelay: '0.2s'
                          }} />
                          <span style={{
                            height: '8px',
                            width: '8px',
                            margin: '0 2px',
                            backgroundColor: 'var(--bot-text)',
                            borderRadius: '50%',
                            display: 'inline-block',
                            opacity: 0.7,
                            animation: 'typing-bounce 1.4s infinite ease-in-out both',
                            animationDelay: '0.4s'
                          }} />
                        </div>
                        {message.content && <span style={{ marginLeft: '10px' }}>{message.content}</span>}
                      </div>
                    ))}
                  </div>

                  {/* Timestamp */}
                  {message.content && (
                    <div style={{
                      fontSize: '0.7rem',
                      opacity: 0.7,
                      marginTop: '0.5rem',
                      textAlign: 'right'
                    }}>
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Typing animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}} />
    </StandardLayout>
  );
}
