// File: components/chat/EnhancedChatContainer.js - Merged & Improved
import { useEffect, useRef } from 'react';
import EnhancedMessage from './EnhancedMessage';

export default function EnhancedChatContainer({ 
  messages, 
  isLoading, 
  onRegenerateMessage,
  onMessageFeedback 
}) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive or loading state changes.
  useEffect(() => {
    if (containerRef.current) {
      // Using a smooth scroll behavior for a better user experience.
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  // All helper functions are preserved.
  const handleCopyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  };

  const handleRegenerateMessage = (messageId) => {
    if (onRegenerateMessage) {
      onRegenerateMessage(messageId);
    }
  };

  const handleMessageFeedback = (messageId, feedbackType) => {
    if (onMessageFeedback) {
      onMessageFeedback(messageId, feedbackType);
    }
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('griotbot-feedback') || '[]');
      existingFeedback.push({
        messageId,
        feedbackType,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('griotbot-feedback', JSON.stringify(existingFeedback.slice(-100)));
    } catch (err) {
      console.warn('Could not save feedback:', err);
    }
  };
  
  // FIXED: Removed the faulty "early return" block. 
  // The component now has a single, unified return statement.
  return (
    <>
      <div className="chat-container" ref={containerRef}>
        <div className="messages-list">
          {/* This map function will now correctly render messages as they are added,
              even if the initial array is empty. */}
          {messages.map((message, index) => (
            <EnhancedMessage
              key={message.id || `msg-${index}`}
              message={{
                ...message,
                timestamp: message.timestamp || message.time
              }}
              onCopy={handleCopyMessage}
              onRegenerate={message.role === 'assistant' ? handleRegenerateMessage : null}
              onFeedback={message.role === 'assistant' ? handleMessageFeedback : null}
            />
          ))}
          
          {/* The loading indicator is preserved. */}
          {isLoading && (
            <div className="loading-message">
              <div className="loading-header">
                <div className="bot-avatar">
                  <img 
                    src="/images/logo-light.svg" 
                    alt="GriotBot"
                    className="bot-logo"
                    onError={(e) => { e.target.src = "/images/logo-light.png"; }}
                  />
                </div>
                <div className="bot-identity">
                  <span className="bot-name">GriotBot</span>
                  <span className="bot-role">Thinking...</span>
                </div>
              </div>
              <div className="loading-content">
                <div className="thinking-dots">
                  <span className="thinking-dot"></span>
                  <span className="thinking-dot"></span>
                  <span className="thinking-dot"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* The original styled-jsx block is preserved. */}
      <style jsx>{`
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          padding: 1rem;
          overflow-y: auto;
          scroll-behavior: smooth;
        }
        
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-height: 0;
        }
        
        .loading-message {
          margin: 1.5rem 0;
          max-width: 85%;
          align-self: flex-start;
          animation: messageSlideIn 0.4s ease-out;
        }
        
        .loading-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          gap: 0.75rem;
        }
        
        .bot-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-color, #d7722c), var(--accent-hover, #c86520));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(215, 119, 44, 0.3);
          animation: avatarPulse 2s infinite ease-in-out;
          padding: 8px;
        }
        
        .bot-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }
        
        .bot-identity {
          display: flex;
          flex-direction: column;
        }
        
        .bot-name {
          font-weight: 600;
          color: var(--text-color, #33302e);
          font-size: 0.95rem;
          font-family: var(--heading-font, 'Lora', serif);
        }
        
        .bot-role {
          font-size: 0.75rem;
          color: var(--wisdom-color, #6b4226);
          opacity: 0.8;
          font-style: italic;
        }
        
        .loading-content {
          background: linear-gradient(135deg, var(--bot-bubble-start, #7d8765), var(--bot-bubble-end, #5e6e4f));
          color: var(--bot-text, #f8f5f0);
          padding: 1.25rem 1.5rem;
          border-radius: 4px 18px 18px 18px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: center;
          min-height: 60px;
        }
        
        .thinking-dots {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        
        .thinking-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          animation: thinkingBounce 1.4s infinite ease-in-out;
        }
        
        .thinking-dot:nth-child(1) { animation-delay: 0s; }
        .thinking-dot:nth-child(2) { animation-delay: 0.2s; }
        .thinking-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(15px) translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }
        
        @keyframes avatarPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(215, 119, 44, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(215, 119, 44, 0.4);
          }
        }
        
        @keyframes thinkingBounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        .chat-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .chat-container::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        
        @media (max-width: 768px) {
          .chat-container {
            padding: 0.75rem;
          }
          .loading-message {
            max-width: 95%;
          }
        }
      `}</style>
    </>
  );
}
