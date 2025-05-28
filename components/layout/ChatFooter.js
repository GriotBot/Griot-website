// File: components/layout/ChatFooter.js
import { useState, useEffect } from 'react';
import { ArrowUpCircle } from 'react-feather';

export default function ChatFooter({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');
  const [storyMode, setStoryMode] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');

  // African proverbs for rotation
  const PROVERBS = [
    "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
    "Until the lion learns to write, every story will glorify the hunter. — African Proverb", 
    "We are the drums, we are the dance. — Afro-Caribbean Proverb",
    "A tree cannot stand without its roots. — Jamaican Proverb",
    "Unity is strength, division is weakness. — Swahili Proverb",
    "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
    "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
    "However long the night, the dawn will break. — African Proverb",
    "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
    "It takes a village to raise a child. — African Proverb"
  ];

  // Set random proverb on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * PROVERBS.length);
    setCurrentProverb(PROVERBS[randomIndex]);
    
    // Load storyteller mode preference
    const savedStoryMode = localStorage.getItem('griotbot-storyteller-mode');
    if (savedStoryMode !== null) {
      setStoryMode(JSON.parse(savedStoryMode));
    }
  }, []);

  // Save storyteller mode preference
  useEffect(() => {
    localStorage.setItem('griotbot-storyteller-mode', JSON.stringify(storyMode));
  }, [storyMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled && onSendMessage) {
      onSendMessage(message.trim(), storyMode);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustHeight = () => {
    const textarea = document.getElementById('chat-input');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  return (
    <>
      {/* PROVERB SECTION - No border above */}
      <div className="proverb-section">
        <div className="proverb-text">{currentProverb}</div>
      </div>

      {/* FORM SECTION - No border above */}
      <div className="form-section">
        <form onSubmit={handleSubmit} className="chat-form">
          <div className="input-wrapper">
            <textarea
              id="chat-input"
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask GriotBot about Black history, culture, or personal advice..."
              disabled={disabled}
              rows={1}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={disabled || !message.trim()}
              className="send-button"
            >
              <ArrowUpCircle size={24} />
            </button>
          </div>

          <div className="form-actions">
            <div className="form-info">
              Free users: 30 messages per day
            </div>
            
            <div className="storyteller-toggle">
              <label className="toggle-label">
                Storyteller Mode
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={storyMode}
                    onChange={(e) => setStoryMode(e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* COPYRIGHT SECTION */}
      <div className="copyright-section">
        © 2025 GriotBot. All rights reserved.
      </div>

      <style jsx>{`
        /* PROVERB SECTION - No border */
        .proverb-section {
          width: 100%;
          text-align: center;
          padding: 1rem;
          background: var(--bg-color, #f8f5f0);
        }

        .proverb-text {
          font-size: 0.9rem;
          font-style: italic;
          color: var(--wisdom-color, #6b4226);
          font-family: var(--quote-font, 'Lora', serif);
          opacity: 0.8;
          line-height: 1.4;
        }

        /* FORM SECTION - No border */
        .form-section {
          width: 100%;
          background: var(--bg-color, #f8f5f0);
          padding: 0 1rem 1rem 1rem;
        }

        .chat-form {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .input-wrapper {
          display: flex;
          background: var(--input-bg, #ffffff);
          border-radius: 12px;
          box-shadow: 0 4px 12px var(--shadow-color, rgba(75, 46, 42, 0.15));
          overflow: hidden;
        }

        .chat-input {
          flex: 1;
          padding: 0.9rem 1rem;
          border: none;
          outline: none;
          resize: none;
          min-height: 55px;
          max-height: 120px;
          font-family: var(--body-font, 'Montserrat', sans-serif);
          font-size: 1rem;
          line-height: 1.5;
          background: transparent;
          color: var(--input-text, #33302e);
        }

        .chat-input::placeholder {
          color: var(--text-color, #33302e);
          opacity: 0.5;
        }

        .chat-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .send-button {
          width: 55px;
          background: var(--accent-color, #d7722c);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .send-button:hover:not(:disabled) {
          background: var(--accent-hover, #c86520);
        }

        .send-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* FORM ACTIONS - Better spacing and positioning */
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
          padding: 0 0.25rem;
          font-size: 0.8rem;
        }

        .form-info {
          color: var(--text-color, #33302e);
          opacity: 0.7;
        }

        /* STORYTELLER TOGGLE - Fixed positioning */
        .storyteller-toggle {
          display: flex;
          align-items: center;
          margin-left: auto;
          padding-left: 1rem;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: var(--text-color, #33302e);
          font-size: 0.8rem;
          gap: 0.5rem;
        }

        .toggle-switch {
          position: relative;
          width: 36px;
          height: 20px;
          flex-shrink: 0;
        }

        .toggle-input {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.25);
          transition: 0.3s;
          border-radius: 20px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .toggle-input:checked + .toggle-slider {
          background-color: var(--accent-color, #d7722c);
        }

        .toggle-input:checked + .toggle-slider:before {
          transform: translateX(16px);
        }

        /* COPYRIGHT SECTION */
        .copyright-section {
          width: 100%;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-color, #33302e);
          opacity: 0.6;
          padding: 0.5rem;
          background: var(--bg-color, #f8f5f0);
        }

        /* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .form-section {
            padding: 0 0.75rem 0.75rem 0.75rem;
          }

          .form-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .storyteller-toggle {
            margin-left: 0;
            padding-left: 0;
          }

          .proverb-text {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .chat-input {
            padding: 0.75rem;
            font-size: 0.9rem;
          }

          .send-button {
            width: 45px;
          }

          .proverb-text {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
