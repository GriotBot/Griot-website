// components/ChatInput.js
import { useState, useRef, useEffect } from 'react';
import { Send } from 'react-feather';

export default function ChatInput({ onSubmit, disabled = false }) {
  const [text, setText] = useState('');
  const [storytellerMode, setStorytellerMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  // Load storyteller mode from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('storyteller-mode');
      if (savedMode === 'true') {
        setStorytellerMode(true);
      }
    }
  }, []);

  // Save storyteller mode to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('storyteller-mode', storytellerMode);
    }
  }, [storytellerMode]);

  // Adjust textarea height as needed
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setText(e.target.value);
    
    // Check if text has newlines or will overflow the single line height
    const hasNewLine = e.target.value.includes('\n');
    const isOverflowing = e.target.scrollHeight > e.target.clientHeight;
    
    setIsExpanded(hasNewLine || isOverflowing);
    
    // Only adjust height if expanded
    if (hasNewLine || isOverflowing) {
      adjustHeight();
    } else {
      // Reset to single line
      e.target.style.height = '55px';
    }
  };

  // Handle key press events
  const handleKeyDown = (e) => {
    // If Enter is pressed without Shift, submit the form
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    
    // If Enter is pressed with Shift, insert a newline and expand
    if (e.key === 'Enter' && e.shiftKey) {
      setIsExpanded(true);
      // Let the newline be added naturally
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedText = text.trim();
    if (!trimmedText || disabled) return;
    
    onSubmit(trimmedText, storytellerMode);
    setText('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '55px';
    }
    setIsExpanded(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-color)',
        padding: '1rem',
        borderTop: '1px solid var(--input-border)',
        zIndex: 50,
      }}
    >
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex',
          boxShadow: '0 4px 12px var(--shadow-color)',
          borderRadius: '12px',
          backgroundColor: 'var(--input-bg)',
          overflow: 'hidden',
        }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask GriotBot about Black history, culture, or personal advice..."
            disabled={disabled}
            style={{
              flex: 1,
              padding: '0.9rem 1rem',
              border: '1px solid var(--input-border)',
              borderRight: 'none',
              borderRadius: '12px 0 0 12px',
              outline: 'none',
              resize: 'none',
              height: isExpanded ? 'auto' : '55px',
              minHeight: '55px',
              maxHeight: '120px',
              backgroundColor: 'var(--input-bg)',
              color: 'var(--input-text)',
              fontFamily: 'inherit',
              fontSize: '1rem',
              lineHeight: 1.5,
              transition: 'height 0.2s',
            }}
          />
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            style={{
              width: '55px',
              backgroundColor: disabled || !text.trim() 
                ? 'var(--color-earth-300)' 
                : 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0 12px 12px 0',
              cursor: disabled || !text.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              opacity: disabled ? 0.7 : 1,
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
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        
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
                  id="storytellerMode"
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
                    ? 'var(--accent-color)' 
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
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
