// components/ChatFooter.js
import { useState, useEffect, useRef } from 'react';

export default function ChatFooter({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState('');
  const [storytellerMode, setStorytellerMode] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');
  const textareaRef = useRef(null);

  // Proverbs array
  const proverbs = [
    "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
    "Until the lion learns to write, every story will glorify the hunter. — African Proverb",
    "We are the drums, we are the dance. — Afro-Caribbean Proverb",
    "A tree cannot stand without its roots. — Jamaican Proverb",
    "Unity is strength, division is weakness. — Swahili Proverb",
    "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
    "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
    "However long the night, the dawn will break. — African Proverb",
    "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
    "It takes a village to raise a child. — African Proverb",
    "The fool speaks, the wise listen. — Ethiopian Proverb",
    "When the music changes, so does the dance. — Haitian Proverb"
  ];

  // Set random proverb on load
  useEffect(() => {
    const randomProverb = proverbs[Math.floor(Math.random() * proverbs.length)];
    setCurrentProverb(randomProverb);
  }, []);

  // Load storyteller mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('storyteller-mode');
      if (saved === 'true') {
        setStorytellerMode(true);
      }
    }
  }, []);

  // Save storyteller mode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('storyteller-mode', storytellerMode);
    }
  }, [storytellerMode]);

  // Auto-resize textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    // Send message to parent component
    onSendMessage(trimmedMessage, storytellerMode);
    
    // Clear input and reset height
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '55px';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--bg-color)',
      borderTop: '1px solid var(--input-border, rgba(75, 46, 42, 0.2))',
      zIndex: 50,
    }}>
      {/* Chat Input Area */}
      <div style={{
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <form onSubmit={handleSubmit} style={{
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Input Box */}
          <div style={{
            display: 'flex',
            boxShadow: '0 4px 12px var(--shadow-color, rgba(75, 46, 42, 0.15))',
            borderRadius: '12px',
            backgroundColor: 'var(--card-bg, #ffffff)',
            border: '2px solid var(--input-border, rgba(75, 46, 42, 0.2))',
            overflow: 'hidden',
          }}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask GriotBot about Black history, culture, or personal advice..."
              disabled={disabled}
              style={{
                flex: 1,
                padding: '0.9rem 1rem',
                border: 'none',
                outline: 'none',
                resize: 'none',
                minHeight: '55px',
                maxHeight: '120px',
                backgroundColor: 'transparent',
                color: 'var(--text-color)',
                fontFamily: 'inherit',
                fontSize: '1rem',
                lineHeight: 1.5,
              }}
            />
            <button
              type="submit"
              disabled={disabled || !message.trim()}
              style={{
                width: '55px',
                backgroundColor: disabled || !message.trim() 
                  ? 'var(--shadow-color, #ccc)' 
                  : 'var(--accent-color, #d7722c)',
                color: 'white',
                border: 'none',
                cursor: disabled || !message.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'background-color 0.2s',
              }}
            >
              {disabled ? (
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  borderTopColor: '#fff',
                  animation: 'spin 1s ease-in-out infinite',
                }}></div>
              ) : '↑'}
            </button>
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem',
            fontSize: '0.8rem',
          }}>
            <div style={{
              color: 'var(--text-color)',
              opacity: 0.7,
            }}>
              Free users: 30 messages per day
            </div>
            
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.7 : 1,
              }}>
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
                    checked={storytellerMode}
                    onChange={() => !disabled && setStorytellerMode(!storytellerMode)}
                    disabled={disabled}
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }}
                  />
                  <span style={{
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
                    <span style={{
                      position: 'absolute',
                      height: '16px',
                      width: '16px',
                      left: storytellerMode ? '18px' : '2px',
                      bottom: '2px',
                      backgroundColor: 'white',
                      transition: '.3s',
                      borderRadius: '50%',
                    }}></span>
                  </span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Proverb */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.9rem',
        fontStyle: 'italic',
        padding: '0 1rem 0.5rem',
        color: 'var(--wisdom-color, #6b4226)',
        opacity: 0.8,
        fontFamily: 'Lora, serif',
      }}>
        {currentProverb}
      </div>
      
      {/* Copyright */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.6,
        paddingBottom: '0.5rem',
      }}>
        © 2025 GriotBot. All rights reserved.
      </div>

      {/* Spinning animation */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
