// File: components/chat/EnhancedMessage.js
import { useState, useCallback } from 'react';
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Clock, Share2 } from 'react-feather';

// NEW: A simple and safe function to convert basic Markdown to HTML
function parseMessageContent(content) {
  if (!content) return '';
  // This uses a series of replacements to convert Markdown to HTML.
  // It handles ### headings, **bold**, *italic*, and newlines.
  const html = content
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
  return html;
}

export default function EnhancedMessage({ message, onCopy, onShare, onRegenerate, onFeedback }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopy = useCallback(async () => {
    if (onCopy) {
      const success = await onCopy(message.content);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  }, [onCopy, message.content]);
  
  // ADDED: The handler for the new Share button
  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(message.content);
    }
  }, [onShare, message.content]);

  const handleFeedback = useCallback((type) => {
    setFeedback(type);
    if (onFeedback) {
      onFeedback(message.id, type);
    }
  }, [onFeedback, message.id]);

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
              onError={(e) => { e.target.src = "/images/logo-light.png"; }}
            />
          </div>
          <div className="bot-identity">
            <span className="bot-name">GriotBot</span>
            <span className="bot-role">Digital Griot</span>
          </div>
        </div>
        
        <div className="message-content">
          <div 
            className="message-text"
            dangerouslySetInnerHTML={{ __html: parseMessageContent(message.content) }}
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

          {/* ADDED: The Share button is now visible and functional */}
          {onShare && (
             <button
              className="action-btn"
              onClick={handleShare}
              title="Share response"
            >
              <Share2 size={16} />
            </button>
          )}

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
        
        .message-content {
          background: linear-gradient(135deg, var(--bot-bubble-start, #7d8765), var(--bot-bubble-end, #5e6e4f));
          color: var(--bot-text, #f8f5f0);
          padding: 1.25rem 1.5rem;
          border-radius: 4px 18px 18px 18px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          position: relative;
        }

        .message-text :global(h3) {
            font-size: 1.1rem;
            color: rgba(255,255,255,0.9);
            margin: 1rem 0 0.5rem 0;
            padding-bottom: 0.25rem;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .message-text :global(strong) {
            font-weight: 600;
            color: #fff;
        }

        .message-text :global(em) {
            font-style: italic;
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
          color: #22c55e;
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
      `}</style>
    </>
  );
}
