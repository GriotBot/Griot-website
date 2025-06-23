// File: components/layout/ChatFooter.js - Updated
import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send } from 'react-feather';
// FIXED: Corrected the import path to the stylesheet.
import styles from '../../styles/components/ChatFooter.module.css';

// FIXED: Added 'isLoading' to the props to handle the button's loading state.
export default function ChatFooter({ onSendMessage, disabled = false, isLoading = false }) {
  const [message, setMessage] = useState('');
  const [storytellerMode, setStorytellerMode] = useState(false);
  const textareaRef = useRef(null);

  // Load storyteller mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('griotbot-storyteller-mode') === 'true';
    setStorytellerMode(savedMode);
  }, []);

  const handleStorytellerToggle = useCallback(() => {
    const newMode = !storytellerMode;
    setStorytellerMode(newMode);
    localStorage.setItem('griotbot-storyteller-mode', newMode);
  }, [storytellerMode]);

  // Auto-resize the textarea as the user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    if (onSendMessage) {
      onSendMessage(message.trim(), storytellerMode);
    }
    
    setMessage('');
  };

  return (
    <footer className={styles.chatFooter}>
      <div className={styles.footerContent}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask GriotBot anything..."
            rows="1"
            disabled={disabled}
            className={styles.chatTextarea}
            aria-label="Chat input"
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={disabled || !message.trim()}
            aria-label="Send message"
          >
            {isLoading ? <div className={styles.spinner} /> : <Send size={20} />}
          </button>
        </form>

        <div className={styles.footerActions}>
            <div className={styles.storytellerToggle}>
                <label>
                    <span>Storyteller Mode</span>
                    <div className={styles.switch}>
                        <input type="checkbox" checked={storytellerMode} onChange={handleStorytellerToggle} />
                        <span className={styles.slider}></span>
                    </div>
                </label>
            </div>
            <div className={styles.legalLinks}>
                <span>© {new Date().getFullYear()} GriotBot Corp.</span>
                <span className={styles.separator}>|</span>
                <Link href="/terms" legacyBehavior><a className={styles.link}>Terms</a></Link>
                <span className={styles.separator}>|</span>
                <Link href="/privacy" legacyBehavior><a className={styles.link}>Privacy</a></Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
