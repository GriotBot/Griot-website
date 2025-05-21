// components/ChatInput.js
import { useState, useRef } from 'react';
import { ArrowUpCircle } from 'react-feather';
import styles from '../styles/components/ChatInput.module.css';

export default function ChatInput({ onSubmit }) {
  const [message, setMessage] = useState('');
  const [storyMode, setStoryMode] = useState(false);
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  const submitMessage = () => {
    if (!message.trim()) return;
    onSubmit(message, storyMode);
    setMessage('');
    if (textareaRef.current) textareaRef.current.style.height = '55px';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMessage();
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} aria-label="Message form">
        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask GriotBot about..."
            rows={1}
            required
          />
          <button type="submit" className={styles.sendButton} aria-label="Send message">
            <ArrowUpCircle size={24} />
          </button>
        </div>
        <div className={styles.actions}>
          <div className={styles.info}>Free users: 30 messages per day</div>
          <label className={styles.toggleLabel}>
            Storyteller Mode
            <input
              type="checkbox"
              checked={storyMode}
              onChange={() => setStoryMode(!storyMode)}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>
      </form>
    </div>
  );
}
