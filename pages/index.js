// File: /pages/index.js - Updated
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function Home() {
  // State to ensure we can access DOM elements after mounting
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Initialize the chat functionality
    if (typeof window !== 'undefined') {
      // We need to wait for the DOM to be ready
      initializeChat();
    }
  }, []);

  // Function that initializes all chat functionality
  function initializeChat() {
    // Get DOM elements
    const chatContainer = document.getElementById('chat-container');
    const welcomeDiv = document.getElementById('welcome');
    const chat = document.getElementById('chat');
    const emptyState = document.getElementById('empty-state');
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const sendBtn = document.getElementById('send');
    const sendIcon = document.getElementById('send-icon');
    const sendLoading = document.getElementById('send-loading');
    const factElement = document.getElementById('fact');
    const newChatBtn = document.getElementById('newChat');
    const storyMode = document.getElementById('storytellerMode');
    const suggestionCards = document.querySelectorAll('.suggestion-card');

    // If any element is missing, return (may happen during initial mounting)
    if (!form || !input) {
      console.warn('DOM elements not found, initialization delayed');
      return;
    }

    // Initialize the rest of the chat functionality as in the original code
    // ...

    // 1. SANITIZER TO PREVENT XSS
    function sanitize(text) {
      const d = document.createElement('div');
      d.textContent = text;
      return d.innerHTML;
    }

    // 2. AUTO-EXPAND TEXTAREA
    function autoExpand(field) {
      // Reset field height
      field.style.height = 'inherit';
    
      // Calculate the height
      const computed = window.getComputedStyle(field);
      const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                   + parseInt(computed.getPropertyValue('padding-top'), 10)
                   + field.scrollHeight
                   + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                   + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    
      field.style.height = `${Math.min(height, 120)}px`;
    }
    
    // Apply auto-expand to input field
    input.addEventListener('input', () => {
      autoExpand(input);
    });

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

    // Continue with the rest of the chat functionality
    // ...

    // 6. CHAT HISTORY (localStorage)
    // 7. APPEND MESSAGE & AUTO‑SCROLL
    // 8. UI STATE MANAGEMENT
    // 9. SEND MESSAGE HANDLER
    // 10. SUGGESTION CARDS HANDLER
    // 11. NEW CHAT HANDLER

    // Initialize input focus
    if (input) input.focus();
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
          <div className="welcome-container" id="welcome">
            <div id="logo" aria-hidden="true">🌿</div>
            <h1 className="welcome-title">Welcome to GriotBot</h1>
            <p className="welcome-subtitle">Your AI companion for culturally rich conversations and wisdom</p>
            
            <div id="quote" aria-label="Inspirational quote">
              "A people without the knowledge of their past history,<br/>
              origin and culture is like a tree without roots."
              <span className="quote-attribution">— Marcus Mosiah Garvey</span>
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
          
          <div id="chat" aria-live="polite"></div>
          <div id="empty-state">
            <p>Start a conversation with GriotBot</p>
          </div>
        </main>

        {/* MESSAGE INPUT */}
        <div id="form-container" style={{
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
          zIndex: 50,
        }}>
          <form id="form" aria-label="Message form" style={{
            width: '100%',
            maxWidth: '700px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div className="input-wrapper" style={{
              position: 'relative',
              display: 'flex',
              boxShadow: '0 4px 12px var(--shadow-color)',
              borderRadius: '12px',
              backgroundColor: 'var(--input-bg)',
            }}>
              <textarea 
                id="input" 
                placeholder="Ask GriotBot about Black history, culture, or personal advice..." 
                required 
                aria-label="Message to send"
                rows="1"
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
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1rem',
                  lineHeight: 1.5,
                }}
              ></textarea>
              <button id="send" type="submit" aria-label="Send message" style={{
                width: '55px',
                background: 'var(--accent-color)',
                color: 'white',
                borderRadius: '0 12px 12px 0',
                transition: 'background-color 0.3s, transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
              }}>
                <div id="send-icon">↑</div>
                <div id="send-loading" className="spinner" style={{display: 'none'}}></div>
              </button>
            </div>
            
            <div className="form-actions" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
              fontSize: '0.8rem',
            }}>
              <div className="form-info" style={{
                color: 'var(--text-color)',
                opacity: 0.7,
              }}>Free users: 30 messages per day</div>
              
              <div className="storyteller-mode" style={{
                display: 'flex',
                alignItems: 'center',
              }}>
                <label htmlFor="storytellerMode" style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}>
                  Storyteller Mode
                  <div className="toggle-switch" style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '36px',
                    height: '20px',
                    marginLeft: '0.5rem',
                  }}>
                    <input type="checkbox" id="storytellerMode" style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }} />
                    <span className="slider" style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      transition: '.3s',
                      borderRadius: '20px',
                    }}></span>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
