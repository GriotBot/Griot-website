// File: /pages/index.js - Full updated version with improved API error handling
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ChatInput from '../components/ChatInput';
import FooterProverb from '../components/FooterProverb';
import FooterCopyright from '../components/FooterCopyright';

export default function Home() {
  // State to ensure we can access DOM elements after mounting
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Load chat history from localStorage
    loadChatHistory();

    // Handle suggestion cards and category tabs
    const handleClickableElements = () => {
      // Handle traditional suggestion cards
      const suggestionCards = document.querySelectorAll('.suggestion-card');
      if (suggestionCards) {
        suggestionCards.forEach(card => {
          card.addEventListener('click', () => {
            const prompt = card.getAttribute('data-prompt');
            if (prompt) {
              handleSendMessage(prompt, false);
            }
          });
        });
      }
      
      // Handle new category tabs
      const categoryTabs = document.querySelectorAll('.category-tab');
      if (categoryTabs) {
        categoryTabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const prompt = tab.getAttribute('data-prompt');
            if (prompt) {
              handleSendMessage(prompt, false);
            }
          });
        });
      }
    };

    // Initialize clickable elements
    if (typeof window !== 'undefined') {
      handleClickableElements();
    }
  }, []);

  // Load chat history from localStorage
  function loadChatHistory() {
    try {
      const hist = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
      if (hist.length > 0) {
        setMessages(hist);
        setShowWelcome(false);
      } else {
        setShowWelcome(true);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      localStorage.removeItem('griotbot-history');
    }
  }

  // Save chat history to localStorage
  function saveChatHistory(msgs) {
    const HISTORY_LIMIT = 50; // Maximum number of messages to store
    localStorage.setItem('griotbot-history', JSON.stringify(msgs.slice(-HISTORY_LIMIT)));
  }

  // Function that initializes remaining chat functionality
  function initializeChat() {
    // Get DOM elements for things not yet converted to React components
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const factElement = document.getElementById('fact');

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

    // 10. SUGGESTION CARDS & CATEGORY TABS HANDLER
    if (suggestionCards) {
      suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
          const prompt = card.getAttribute('data-prompt');
          if (prompt) {
            handleSendMessage(prompt, false);
          }
        });
      });
    }
    
    if (categoryTabs) {
      categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const prompt = tab.getAttribute('data-prompt');
          if (prompt) {
            handleSendMessage(prompt, false);
          }
        });
      });
    }
  }

  // Handle sending a message - UPDATED with better error handling
  async function handleSendMessage(text, storytellerMode) {
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
      console.log('Sending message to API:', { prompt: text, storytellerMode });
      
      // API call to our serverless function
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add explicit Accept header
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
          console.error('API error details:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
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
      saveChatHistory(finalMessages);
    } catch (err) {
      console.error('API error:', err);
      
      // Replace thinking with error message
      const finalMessages = updatedMessages.slice(0, -1).concat({
        role: 'bot',
        content: `I'm sorry, I encountered an error: ${err.message}. Please try again later.`,
        time: new Date().toISOString()
      });
      
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    }
  }

  // Handle starting a new chat
  function handleNewChat() {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem('griotbot-history');
  }

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
      </Head>

      <Layout>
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
              
              {/* Hidden legacy suggestion cards for compatibility */}
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
                    maxWidth: message.role === 'user' ? '50%' : '60%', // Different max widths
                    width: 'fit-content', // Expand based on content
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
                    <div className="typing-indicator" aria-label="GriotBot is thinking">
                      <span></span><span></span><span></span>
                    </div>
                  ) : (
                    <>
                      {message.role === 'bot' && (
                        <div className="bot-header" style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '0.8rem',
                          paddingBottom: '0.5rem',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        }}>
                          {/* Logo image instead of emoji */}
                          <img 
                            src="/images/logo-light.svg" 
                            alt="GriotBot Logo" 
                            style={{ 
                              height: '20px',
                              width: 'auto',
                              marginRight: '0.5rem'
                            }} 
                            aria-hidden="true"
                          />
                          <span className="bot-name" style={{ fontWeight: 600, marginLeft: '0.25rem' }}>GriotBot</span>
                        </div>
                      )}
                      <div>{message.content}</div>
                      {message.role === 'bot' && (
                        <div className="message-time" style={{
                          fontSize: '0.7rem',
                          opacity: 0.7,
                          marginTop: '0.5rem',
                          textAlign: 'right',
                        }}>
                          {new Date(message.time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
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
