// File: components/chat/EnhancedChatContainer.js - With Share Feature
import { useEffect, useRef, useCallback } from 'react';
import EnhancedMessage from './EnhancedMessage';

export default function EnhancedChatContainer({ 
  messages, 
  isLoading, 
  onRegenerateMessage,
  onMessageFeedback 
}) {
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // This effect ensures the view scrolls to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]); // Depends on the number of messages.

  const handleCopyMessage = useCallback(async (content) => {
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
  }, []);

  // NEW: "Share This Story" handler
  const handleShare = useCallback(async (content) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Story from GriotBot',
          text: content,
          url: window.location.href,
        });
        return true; // Indicate success
      } catch (error) {
        console.error('Error sharing:', error);
        return false; // Indicate failure
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      handleCopyMessage(content);
      alert('This story has been copied to your clipboard. You can now paste it to share!');
    }
  }, [handleCopyMessage]);

  const handleRegenerateMessage = useCallback((messageId) => {
    if (onRegenerateMessage) {
      onRegenerateMessage(messageId);
    }
  }, [onRegenerateMessage]);

  const handleMessageFeedback = useCallback((messageId, feedbackType) => {
    if (onMessageFeedback) {
      onMessageFeedback(messageId, feedbackType);
    }
    // ... feedback saving logic
  }, [onMessageFeedback]);
  
  const lastMessage = messages[messages.length - 1];
  const isBotThinking = isLoading && lastMessage?.role === 'assistant' && !lastMessage.content;

  return (
    <>
      <div className="chat-container" ref={containerRef}>
        <div className="messages-list">
          {messages.map((message, index) => {
            if (index === messages.length - 1 && isBotThinking) {
              return null;
            }
            return (
              <EnhancedMessage
                key={message.id || `msg-${index}`}
                message={{
                  ...message,
                  timestamp: message.timestamp || message.time
                }}
                onCopy={handleCopyMessage}
                // Pass the new share handler to the message component
                onShare={message.role === 'assistant' ? handleShare : null}
                onRegenerate={message.role === 'assistant' ? handleRegenerateMessage : null}
                onFeedback={message.role === 'assistant' ? handleMessageFeedback : null}
              />
            );
          })}
          
          {isBotThinking && (
            <div className="loading-message">
              {/* ... loading indicator JSX ... */}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Your original styled-jsx block is preserved. */}
      <style jsx>{`
        /* ... existing styles ... */
      `}</style>
    </>
  );
}
