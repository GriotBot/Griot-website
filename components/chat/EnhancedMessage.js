// File: components/chat/EnhancedMessage.js
import { useState } from 'react';
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Clock } from 'react-feather';

export default function EnhancedMessage({ message, onCopy, onRegenerate, onFeedback }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopy = async () => {
    if (onCopy) {
      await onCopy(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    if (onFeedback) {
      onFeedback(message.id, type);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const parseMessageContent = (content) => {
    let parsed = content;
    
    // Detect and enhance proverbs (text in quotes)
    parsed = parsed.replace(
      /"([^"]+)"/g, 
      '<div class="message-proverb">$1</div>'
    );
    
    // Detect lists (lines starting with - or *)
    parsed = parsed.replace(
      /^[\-\*]\s+(.+)$/gm,
      '<li class="message-list-item">$1</li>'
    );
    
    // Wrap consecutive list items
    parsed = parsed.replace(
      /(<li class="message-list-item">.*?<\/li>)(\s*<li class="message-list-item">.*?<\/li>)*/gs,
      '<ul class="message-list">$&</ul>'
    );
    
    // Enhance emphasis (*text* or **text**)
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong class="message-emphasis">$1</strong>');
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em class="message-emphasis-light">$1</em>');
    
    // Split into paragraphs
    const paragraphs = parsed.split('\n\n').filter(p => p.trim());
    return paragraphs.map(p => p.trim()).join('</p><p class="message-paragraph">');
  };

  if (message.role === 'user') {
    return (
      <>
        <div className="message user-message">
          <div className="message-content">
            <p className="message-paragraph">{message.content}</p>
          </div>
          <div className="message-meta">
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
        </div>
        
        <style jsx>{`
          .message {
            margin: 1rem 0;
            max-width: 80%;
            animation: messageSlideIn 0.3s ease-out;
            align-self: flex-end;
            margin-left: auto;
          }
          
          .message-content {
            background: linear-gradient(135deg, var(--user-bubble, #bd8735), #a67429);
            color: var(--user-text, #f8f5f0);
            padding: 1rem 1.2rem;
            border-radius: 18px 18px 4px 18px;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
            position: relative;
          }
          
          .message-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            border-radius: 18px 18px 0 0;
          }
          
          .message-paragraph {
            margin: 0;
            line-height: 1.6;
            font-family: var(--body-font, 'Montserrat', sans-serif);
          }
          
          .message-meta {
            display: flex;
            justify-content: flex-end;
            margin-top: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .message-time {
            font-size: 0.75rem;
            color: var(--text-color, #33302e);
            opacity: 0.6;
          }
          
          @keyframes messageSlideIn {
            from {
              opacity: 0;
              transform: translateY(10px) translateX(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0) translateX(0);
            }
          }
          
          @media (max-width: 768px) {
            .message {
              max-width: 90%;
            }
          }
        `}</style>
      </>
    );
  }

  // Bot message
  return (
    <>
      <div className="message bot-message">
        <div className="message-header">
          <div className="bot-avatar">
            <img 
              src="/images/logo-light.svg" 
              alt="GriotBot"
              className="bot-logo"
              onError={(e) => {
                // Fallback to PNG if SVG fails
                e.target.src = "/images/logo-light.png";
              }}
            />
          </div>
          <div className="bot-identity">
            <span className="bot-name">GriotBot</span>
            <span className="bot-role">Digital Griot</span>
          </div>
          {message.isStreaming && (
            <div className="streaming-indicator">
              <span className="streaming-dot"></span>
              <span className="streaming-dot"></span>
              <span className="streaming-dot"></span>
            </div>
          )}
        </div>
        
        <div className="message-content">
          <div 
            className="message-text"
            dangerouslySetInnerHTML={{ 
              __html: `<p class="message-paragraph">${parseMessageContent(message.content)}</p>` 
            }}
          />
        </div>
        
        <div className="message-actions">
          <button 
            className={`action-btn ${copied ? 'success' : ''}`}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy message'}
          >
            <Copy size={16} />
          </button>
          
          <button
            className={`action-btn ${feedback === 'up' ? 'active-positive' : ''}`}
            onClick={() => handleFeedback('up')}
            title="Helpful response"
          >
            <ThumbsUp size={16} />
          </button>
          
          <button
            className={`action-btn ${feedback === 'down' ? 'active-negative' : ''}`}
            onClick={() => handleFeedback('down')}
            title="Not helpful"
          >
            <ThumbsDown size={16} />
          </button>
          
          {onRegenerate && (
            <button
              className="action-btn"
              onClick={() => onRegenerate(message.id)}
              title="Regenerate response"
            >
              <RotateCcw size={16} />
            </button>
          )}
          
          <span className="message-time">
            <Clock size={12} />
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
      
      <style jsx>{`
        .message {
          margin: 1.5rem 0;
          max-width: 85%;
          animation: messageSlideIn 0.4s ease-out;
          align-self: flex-start;
        }
        
        .message-header {
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
          position: relative;
          padding: 8px;
        }
        
        .bot-avatar::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: linear-gradient(135deg, transparent, rgba(255,255,255,0.2), transparent);
          z-index: -1;
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
        
        .streaming-indicator {
          margin-left: auto;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        
        .streaming-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-color, #d7722c);
          animation: streamingPulse 1.4s infinite ease-in-out;
        }
        
        .streaming-dot:nth-child(1) { animation-delay: 0s; }
        .streaming-dot:nth-child(2) { animation-delay: 0.2s; }
        .streaming-dot:nth-child(3) { animation-delay: 0.4s; }
        
        .message-content {
          background: linear-gradient(135deg, var(--bot-bubble-start, #7d8765), var(--bot-bubble-end, #5e6e4f));
          color: var(--bot-text, #f8f5f0);
          padding: 1.25rem 1.5rem;
          border-radius: 4px 18px 18px 18px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          position: relative;
          backdrop-filter: blur(1px);
        }
        
        .message-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1));
        }
        
        .message-content::after {
          content: '';
          position: absolute;
          left: 8px;
          right: 8px;
          bottom: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
        }
        
        .message-text :global(.message-paragraph) {
          margin: 0 0 1rem 0;
          line-height: 1.7;
          font-family: var(--body-font, 'Montserrat', sans-serif);
        }
        
        .message-text :global(.message-paragraph:last-child) {
          margin-bottom: 0;
        }
        
        .message-text :global(.message-proverb) {
          background: rgba(0, 0, 0, 0.15);
          border-left: 3px solid rgba(255, 255, 255, 0.4);
          padding: 0.75rem 1rem;
          margin: 1rem 0;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          font-family: var(--quote-font, 'Lora', serif);
          position: relative;
        }
        
        .message-text :global(.message-proverb::before) {
          content: '';
          position: absolute;
          left: -3px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: var(--accent-color, #d7722c);
          border-radius: 50%;
        }
        
        .message-text :global(.message-list) {
          margin: 1rem 0;
          padding-left: 0;
          list-style: none;
        }
        
        .message-text :global(.message-list-item) {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        
        .message-text :global(.message-list-item::before) {
          content: '▸';
          position: absolute;
          left: 0;
          color: var(--accent-color, #d7722c);
          font-weight: bold;
        }
        
        .message-text :global(.message-emphasis) {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 600;
        }
        
        .message-text :global(.message-emphasis-light) {
          color: rgba(255, 255, 255, 0.9);
        }
        
        .message-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.75rem;
          padding-left: 0.5rem;
        }
        
        .action-btn {
          background: none;
          border: none;
          color: var(--text-color, #33302e);
          opacity: 0.6;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .action-btn:hover {
          opacity: 1;
          background: rgba(0, 0, 0, 0.05);
        }
        
        .action-btn.success {
          opacity: 1;
          color: var(--accent-color, #d7722c);
        }
        
        .action-btn.active-positive {
          opacity: 1;
          color: #22c55e;
        }
        
        .action-btn.active-negative {
          opacity: 1;
          color: #ef4444;
        }
        
        .message-time {
          margin-left: auto;
          font-size: 0.75rem;
          color: var(--text-color, #33302e);
          opacity: 0.5;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
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
        
        @keyframes streamingPulse {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .message {
            max-width: 95%;
          }
          
          .message-content {
            padding: 1rem 1.25rem;
          }
          
          .message-actions {
            gap: 0.5rem;
          }
          
          .action-btn {
            padding: 0.4rem;
          }
        }
      `}</style>
    </>
  );
}
