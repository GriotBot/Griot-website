// components/ChatInput.js - Updated
import { useState, useRef, useEffect } from 'react';
import { ArrowUpCircle } from 'react-feather';

export default function ChatInput({ onSubmit }) {
  const [message, setMessage] = useState('');
  const [storyMode, setStoryMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  // Function to handle input changes
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Automatically expand only when text exceeds the single line
    // or contains a newline character
    const hasNewLine = e.target.value.includes('\n');
    const isOverflowing = e.target.scrollHeight > e.target.clientHeight;
    
    setIsExpanded(hasNewLine || isOverflowing);
    
    // Adjust height only if needed
    if (hasNewLine || isOverflowing) {
      adjustHeight();
    } else {
      // Reset to single line
      e.target.style.height = '55px';
    }
  };

  // Function to adjust height based on content
  const adjustHeight = () => {
    if (!textareaRef.current) return;
    
    // Reset height to auto to get the correct scrollHeight
    textareaRef.current.style.height = 'auto';
    
    // Calculate new height (with max height limit)
    const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
    
    // Set the new height
    textareaRef.current.style.height = `${newHeight}px`;
  };

  // Handle key press events (specifically for Enter)
  const handleKeyDown = (e) => {
    // Handle Enter key (expand textarea)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSubmit(e);
      }
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Allow Shift+Enter for new lines
      setIsExpanded(true);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message, storyMode);
      setMessage('');
      // Reset to single line after submission
      if (textareaRef.current) {
        textareaRef.current.style.height = '55px';
      }
      setIsExpanded(false);
    }
  };

  return (
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
      <form 
        id="form" 
        aria-label="Message form" 
        style={{
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
        }}
        onSubmit={handleSubmit}
      >
        <div className="input-wrapper" style={{
          position: 'relative',
          display: 'flex',
          boxShadow: '0 4px 12px var(--shadow-color)',
          borderRadius: '12px',
          backgroundColor: 'var(--input-bg)',
        }}>
          <textarea 
            ref={textareaRef}
            id="input" 
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask GriotBot about..." 
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
              height: '55px', // Fixed initial height
              maxHeight: '120px',
              backgroundColor: 'var(--input-bg)',
              color: 'var(--input-text)',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '1rem',
              lineHeight: 1.5,
              transition: 'height 0.1s ease',
            }}
          ></textarea>
          <button 
            id="send" 
            type="submit" 
            aria-label="Send message" 
            style={{
              width: '55px',
              background: 'var(--accent-color)',
              color: 'white',
              borderRadius: '0 12px 12px 0',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <ArrowUpCircle size={24} /> {/* Feathericon arrow-up-circle */}
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
                <input 
                  type="checkbox" 
                  id="storytellerMode" 
                  checked={storyMode}
                  onChange={() => setStoryMode(!storyMode)}
                  style={{
                    opacity: 0,
                    width: 0,
                    height: 0,
                  }} 
                />
                <span className="slider" style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: storyMode ? 'var(--accent-color)' : 'rgba(0,0,0,0.25)', // Orange when active
                  transition: '.3s',
                  borderRadius: '20px',
                }}>
                  {/* White toggle circle */}
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '16px',
                    width: '16px',
                    left: storyMode ? '18px' : '2px', // Move based on checked state
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
  );
}
