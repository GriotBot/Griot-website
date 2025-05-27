// File: components/layout/ChatFooter.js
import { useState, useEffect } from 'react';
import { ArrowUpCircle } from 'react-feather';

export default function ChatFooter({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState('');
  const [storytellerMode, setStorytellerMode] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');
  const [inputHeight, setInputHeight] = useState(55); // Track input height for footer expansion

  // Proverbs array
  const PROVERBS = [
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

  // Initialize proverb and storyteller mode
  useEffect(() => {
    // Set random proverb
    const randomIndex = Math.floor(Math.random() * PROVERBS.length);
    setCurrentProverb(PROVERBS[randomIndex]);

    // Load storyteller mode from localStorage
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('griotbot-storyteller-mode');
      setStorytellerMode(savedMode === 'true');
    }
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    if (onSendMessage) {
      onSendMessage(message.trim(), storytellerMode);
    }
    
    setMessage('');
    setInputHeight(55); // Reset to single line height
    
    // Also reset the textarea height in the DOM
    const textarea = e.target.querySelector('textarea');
    if (textarea) {
      textarea.style.height = '55px';
    }
  };

  // Handle storyteller mode toggle
  const handleStorytellerToggle = () => {
    const newMode = !storytellerMode;
    setStorytellerMode(newMode);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('griotbot-storyteller-mode', newMode.toString());
    }
  };

  // Auto-expand textarea and adjust footer height
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Reset height to recalculate
    e.target.style.height = '55px'; // Always reset to single line first
    
    // Calculate new height based on scroll height
    const scrollHeight = e.target.scrollHeight;
    const maxHeight = 77; // Further reduced to show exactly 3 lines (was 85px)
    const minHeight = 55;  // 1 line min
    
    // Only expand if content requires it
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    e.target.style.height = newHeight + 'px';
    setInputHeight(newHeight);
  };

  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: `${Math.max(189, 189 + (inputHeight - 55))}px`, // Proper footer expansion calculation
      background: 'var(--bg-color)',
      borderTop: '1px solid var(--input-border)',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end', // Push content to bottom, expand upward
      gap: '0.5rem',
      zIndex: 50,
      transition: 'background-color 0.3s, height 0.2s ease'
    }}>
      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        alignItems: 'flex-end',
        maxWidth: '55%', // Additional 15% reduction (from 70% to 55%)
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ 
          flex: 1, 
          position: 'relative',
          display: 'flex',
          boxShadow: '0 2px 4px var(--shadow-color)',
          borderRadius: '12px',
          backgroundColor: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          overflow: 'hidden',
          height: `${inputHeight}px`, // Set explicit height based on input
          alignItems: 'stretch' // Make button stretch to match input height
        }}>
          <textarea
            value={message}
            onChange={handleInputChange}
            placeholder="Ask GriotBot about Black history, culture, or personal advice..."
            disabled={disabled}
            rows={1} // Start with exactly 1 row
            style={{
              flex: 1,
              padding: '16px 1rem', // Adjusted padding for better 1-line alignment
              border: 'none',
              outline: 'none',
              resize: 'none',
              minHeight: '55px',
              maxHeight: '77px', // Reduced to exactly 3 lines (was 85px)
              backgroundColor: 'transparent',
              color: 'var(--input-text)',
              fontFamily: 'var(--body-font)',
              fontSize: '1rem',
              lineHeight: '1.375', // Better line height for single line
              overflow: 'hidden' // Hide scrollbar during expansion
            }}
            onFocus={(e) => {
              e.target.parentElement.style.borderColor = 'var(--accent-color)';
              e.target.parentElement.style.boxShadow = '0 0 0 1px var(--accent-color)';
            }}
            onBlur={(e) => {
              e.target.parentElement.style.borderColor = 'var(--input-border)';
              e.target.parentElement.style.boxShadow = '0 2px 4px var(--shadow-color)';
            }}
          />
          
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            style={{
              width: '55px',
              height: '100%', // Fill the container height (which is set to inputHeight)
              background: disabled || !message.trim() ? '#ccc' : 'var(--accent-color)',
              color: 'white',
              border: 'none',
              cursor: disabled || !message.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s, transform 0.2s',
              borderRadius: '0 11px 11px 0', // Slightly smaller radius to fit perfectly
              margin: '0', // Remove any default margins
              padding: '0' // Remove any default padding
            }}
            onMouseEnter={(e) => {
              if (!disabled && message.trim()) {
                e.target.style.backgroundColor = 'var(--accent-hover)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled && message.trim()) {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {disabled ? (
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #fff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <ArrowUpCircle size={24} />
            )}
          </button>
        </div>
      </form>

      {/* Form Actions - Aligned with text field edges */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.7,
        maxWidth: '55%', // Match the form width
        margin: '0 auto',
        width: '100%'
      }}>
        <span>Free users: 30 messages per day</span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ marginRight: '0.5rem' }}>Storyteller Mode</span>
            <div style={{
              position: 'relative',
              width: '36px',
              height: '20px',
              backgroundColor: storytellerMode ? 'var(--accent-color)' : 'rgba(0,0,0,0.25)',
              borderRadius: '20px',
              transition: 'background-color 0.3s',
              cursor: 'pointer'
            }}
            onClick={handleStorytellerToggle}
            >
              <div style={{
                position: 'absolute',
                top: '2px',
                left: storytellerMode ? '18px' : '2px',
                width: '16px',
                height: '16px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: 'left 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </div>
          </label>
        </div>
      </div>

      {/* Proverb */}
      <div style={{
        fontSize: '0.9rem',
        fontStyle: 'italic',
        color: 'var(--wisdom-color)',
        textAlign: 'center',
        fontFamily: 'var(--quote-font)',
        opacity: 0.8,
        marginTop: 'auto'
      }}>
        {currentProverb}
      </div>

      {/* Copyright */}
      <div style={{
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.6,
        textAlign: 'center'
      }}>
        © 2025 GriotBot. All rights reserved.
      </div>

      {/* Spinning keyframes and responsive styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          form[style*="maxWidth: '55%'"], div[style*="maxWidth: '55%'"] {
            max-width: 75% !important;
          }
        }
        
        @media (max-width: 480px) {
          form[style*="maxWidth: '55%'"], div[style*="maxWidth: '55%'"] {
            max-width: 85% !important;
          }
        }
      `}} />
    </footer>
  );
}
