// components/ChatInput.js
import { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSubmit }) {
  const [message, setMessage] = useState('');
  const [storyMode, setStoryMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Focus input on component mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSubmit(message.trim(), storyMode);
    setMessage('');
    setIsExpanded(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '55px';
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Automatically expand when content grows
    const hasNewLine = e.target.value.includes('\n');
    const isOverflowing = e.target.scrollHeight > e.target.clientHeight;
    
    setIsExpanded(hasNewLine || isOverflowing);
    
    // Adjust height if needed
    if (hasNewLine || isOverflowing) {
      // Reset height to calculate proper scrollHeight
      e.target.style.height = 'inherit';
      // Set to scrollHeight to fit content
      const newHeight = Math.min(e.target.scrollHeight, 120);
      e.target.style.height = `${newHeight}px`;
    } else {
      // Reset to single line
      e.target.style.height = '55px';
    }
  };

  const handleKeyDown = (e) => {
    // If Enter is pressed without Shift, submit the form
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '50px',
      left: 0,
      width: '100%',
      background: 'var(--bg-color, #f8f5f0)',
      padding: '1rem',
      borderTop: '1px solid var(--input-border, rgba(75, 46, 42, 0.2))',
      display: 'flex',
      justifyContent: 'center',
      zIndex: 50,
    }}>
      <form 
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{
          position: 'relative',
          display: 'flex',
          boxShadow: '0 4px 12px var(--shadow-color, rgba(75, 46, 42, 0.15))',
          borderRadius: '12px',
          backgroundColor: 'var(--input-bg, #ffffff)',
        }}>
          <textarea 
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask GriotBot about..."
            style={{
              flex: 1,
              padding: '0.9rem 1rem',
              border: '1px solid var(--input-border, rgba(75, 46, 42, 0.2))',
              borderRight: 'none',
              borderRadius: '12px 0 0 12px',
              outline: 'none',
              resize: 'none',
              minHeight: '55px',
              maxHeight: '120px',
              backgroundColor: 'var(--input-bg, #ffffff)',
              color: 'var(--input-text, #33302e)',
              fontFamily: 'var(--body-font, "Montserrat", sans-serif)',
              fontSize: '1rem',
              lineHeight: 1.5,
            }}
            rows="1"
          />
          <button 
            type="submit"
            style={{
              width: '55px',
              background: 'var(--accent-color, #d7722c)',
              color: 'white',
              border: 'none',
              borderRadius: '0 12px 12px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: message.trim() ? 'pointer' : 'not-allowed',
              opacity: message.trim() ? 1 : 0.7,
            }}
            disabled={!message.trim()}
          >
            ↑
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
            color: 'var(--text-color, #33302e)',
            opacity: 0.7,
          }}>
            Free users: 30 messages per day
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
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
                  checked={storyMode}
                  onChange={() => setStoryMode(!storyMode)}
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
                  backgroundColor: storyMode ? 'var(--accent-color, #d7722c)' : 'rgba(0,0,0,0.25)',
                  borderRadius: '20px',
                  transition: '.3s',
                }}></span>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '16px',
                  width: '16px',
                  left: storyMode ? '18px' : '2px',
                  bottom: '2px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '.3s',
                }}></span>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
