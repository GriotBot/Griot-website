// File: /pages/index.js - Updated with New Components
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

    // Handle suggestion cards
    const handleSuggestionCards = () => {
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
    };

    // Initialize suggestion cards
    if (typeof window !== 'undefined') {
      handleSuggestionCards();
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
    const factElement = document.getElementById('fact');

    // 5. RANDOM PROVERB
    const proverbs = [
      "Wisdom is like a baobab tree; no one individual can embrace it. â€” African Proverb",
      "Until the lion learns to write, every story will glorify the hunter. â€” African Proverb",
      "We are the drums, we are the dance. â€” Afro-Caribbean Proverb",
      "A tree cannot stand without its roots. â€” Jamaican Proverb",
      "Unity is strength, division is weakness. â€” Swahili Proverb",
      "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. â€” West African Proverb",
      "Truth is like a drum, it can be heard from afar. â€” Kenyan Proverb",
      "A bird will always use another bird's feathers to feather its nest. â€” Ashanti Proverb",
      "You must act as if it is impossible to fail. â€” Yoruba Wisdom",
      "The child who is not embraced by the village will burn it down to feel its warmth. â€” West African Proverb",
      "However long the night, the dawn will break. â€” African Proverb",
      "If you want to go fast, go alone. If you want to go far, go together. â€” African Proverb",
      "It takes a village to raise a child. â€” African Proverb",
      "The fool speaks, the wise listen. â€” Ethiopian Proverb",
      "When the music changes, so does the dance. â€” Haitian Proverb"
    ];
    
    function showRandomProverb() {
      if (factElement) {
        const randomIndex = Math.floor(Math.random() * proverbs.length);
        factElement.textContent = proverbs[randomIndex];
        factElement.setAttribute('aria-label', `Proverb: ${proverbs[randomIndex]}`);
      }
    }
    
    showRandomProverb(); // Show proverb on init

    // 10. SUGGESTION CARDS HANDLER
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
  }

  // Handle sending a message
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
      // API call to our serverless function
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          prompt: text,
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
            <div className="welcome-container" id="welcome">
              <div id="logo" aria-hidden="true">ðŸŒ¿</div>
              <h1 className="welcome-title">Welcome to GriotBot</h1>
              <p className="welcome-subtitle">Your AI companion for culturally rich conversations and wisdom</p>
              
              <div id="quote" aria-label="Inspirational quote">
                "A people without the knowledge of their past history,<br/>
                origin and culture is like a tree without roots."
                <span className="quote-attribution">â€” Marcus Mosiah Garvey</span>
              </div>
              
              <div className="suggestion-cards">
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
            <div id="chat" aria-live="polite" style={{ width: '100%', maxWidth: '700px' }}>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.role} ${message.thinking ? 'thinking' : ''}`}
                  style={{
                    padding: '1rem 1.2rem',
                    margin: '0.5rem 0',
                    borderRadius: '12px',
                    maxWidth: '80%',
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
                          <span className="logo-icon" aria-hidden="true" style={{ fontSize: '1.2rem' }}>ðŸŒ¿</span>
                          <span className="bot-name" style={{ fontWeight: 600, marginLeft: '0.5rem' }}>GriotBot</span>
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
