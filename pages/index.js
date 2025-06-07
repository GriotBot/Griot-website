// File: pages/index.js - Updated with Conversation Memory Support & Shared Constants
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import StandardLayout from '../components/layout/StandardLayout';
import EnhancedChatContainer from '../components/chat/EnhancedChatContainer';
import ChatFooter from '../components/layout/ChatFooter';
import { 
  PROVERBS, 
  SUGGESTION_CARDS, 
  MAX_HISTORY_LENGTH, 
  CHAT_HISTORY_KEY,
  getRandomProverb 
} from '../lib/constants';

export default function Home() {
  // State management
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentProverb, setCurrentProverb] = useState('');

  // Initialize component
  useEffect(() => {
    // Set random proverb using utility function
    setCurrentProverb(getRandomProverb());
    
    // Load chat history from localStorage
    loadChatHistory();
  }, []);

  // Load chat history from localStorage
  const loadChatHistory = useCallback(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          // Convert old format to new format if needed
          const formattedMessages = parsedHistory.map((msg, index) => ({
            id: msg.id || `msg-${Date.now()}-${index}`,
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content || '',
            timestamp: msg.timestamp || msg.time || new Date().toISOString()
          }));
          
          setMessages(formattedMessages);
          setShowWelcome(false);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      localStorage.removeItem(CHAT_HISTORY_KEY);
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = useCallback((messagesToSave) => {
    try {
      // Keep only the most recent messages to prevent localStorage bloat
      const recentMessages = messagesToSave.slice(-MAX_HISTORY_LENGTH);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(recentMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, []);

  // Handle sending messages with proper dependencies
  const handleSendMessage = useCallback(async (messageText, storytellerMode = false, explicitHistory = null) => {
    if (!messageText.trim() || isLoading) return;

    // Hide welcome screen
    setShowWelcome(false);
    setIsLoading(true);

    // Create user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message to state
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Create initial bot message (for streaming)
    const botMessageId = `bot-${Date.now()}`;
    const initialBotMessage = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    };

    setMessages(prev => [...prev, initialBotMessage]);

    try {  
      // Prepare conversation history for API call (CONVERSATION MEMORY FIX)
      // Use explicit history if provided (for regeneration), otherwise use current messages
      const messagesToUse = explicitHistory || updatedMessages;
      const conversationHistory = messagesToUse
        .slice(-10) // Last 10 messages to control costs
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      // Make API call with conversation history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: messageText.trim(),
          storytellerMode: storytellerMode,
          conversationHistory: conversationHistory // ADDED: Conversation memory support
        })
      });

      if (!response.ok) {
        const errorMessage = response.status === 429 
          ? 'Too many requests. Please wait a moment and try again.'
          : response.status === 500 
          ? 'Service temporarily unavailable. Please try again.'
          : `Unable to process your request (Error ${response.status}).`;
        throw new Error(errorMessage);
      }

      // Check if response is streaming or JSON
      const contentType = response.headers.get('content-type');
      let accumulatedContent = '';
      
      if (contentType && contentType.includes('text/plain')) {
        // Handle streaming response
        const reader = response.body.getReader();

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            accumulatedContent += chunk;

            // Update the streaming message
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === botMessageId 
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        // Handle JSON response (fallback)
        const data = await response.json();
        accumulatedContent = data.choices?.[0]?.message?.content || 
                          data.choices?.[0]?.text || 
                          'I apologize, but I seem to be having trouble processing your request.';
      }

      // Finalize the bot message
      const finalBotMessage = {
        id: botMessageId,
        role: 'assistant', 
        content: accumulatedContent,
        timestamp: new Date().toISOString(),
        isStreaming: false
      };

      const finalMessages = [...updatedMessages, finalBotMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show user-friendly error message
      const errorMessage = error.message.includes('fetch') 
        ? 'Unable to connect. Please check your internet connection and try again.'
        : error.message || 'Something went wrong. Please try again.';
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === botMessageId 
            ? { 
                ...msg, 
                content: `I'm sorry, ${errorMessage}`, 
                isStreaming: false 
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, saveChatHistory]);

  // Handle suggestion card clicks
  const handleSuggestionClick = useCallback((prompt) => {
    handleSendMessage(prompt);
  }, [handleSendMessage]);

  // Handle new chat with proper dependencies
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    
    // Set new random proverb using utility function
    setCurrentProverb(getRandomProverb());
  }, []);

  // Handle message regeneration with proper dependencies
  const handleRegenerateMessage = useCallback(async (messageId) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    // Find the user message that prompted this response
    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.role !== 'user') return;

    // Capture the correct historical context BEFORE removing the bot message
    const messagesForContext = messages.slice(0, messageIndex);
    
    // Remove the bot message and regenerate
    setMessages(messagesForContext);
    
    // Regenerate response using the correct historical context
    await handleSendMessage(userMessage.content, false, messagesForContext);
  }, [messages, handleSendMessage]);

  // Handle message feedback
  const handleMessageFeedback = useCallback((messageId, feedbackType) => {
    console.log(`Feedback for message ${messageId}: ${feedbackType}`);
    
    // Optional: Send to analytics API in the future
    // You could add an API call here to track user feedback
    /*
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        messageId, 
        feedbackType, 
        timestamp: new Date().toISOString(),
        sessionId: sessionStorage.getItem('session-id') // If you implement sessions
      })
    });
    */
  }, []);

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="griot, African culture, AI assistant, cultural wisdom, storytelling" />
        <meta property="og:title" content="GriotBot - Your Digital Griot" />
        <meta property="og:description" content="AI-powered digital griot providing culturally grounded wisdom and knowledge" />
        <meta property="og:type" content="website" />
      </Head>

      <StandardLayout
        showWelcome={showWelcome}
        currentProverb={currentProverb}
        onNewChat={handleNewChat}
      >
        <div className="main-content">
          {showWelcome && (
            <div className="welcome-container" role="main" aria-labelledby="welcome-title">
              <h1 id="welcome-title" className="welcome-title">Welcome to GriotBot</h1>
              <p className="welcome-subtitle">
                Your AI companion for culturally rich conversations and wisdom
              </p>
              
              <blockquote className="quote-container" cite="Marcus Garvey">
                <p>
                  A people without the knowledge of their past history,<br/>
                  origin and culture is like a tree without roots.
                </p>
                <cite className="quote-attribution">— Marcus Mosiah Garvey</cite>
              </blockquote>
              
              <div 
                className="suggestion-cards"
                role="region"
                aria-label="Conversation starters"
              >
                {SUGGESTION_CARDS.map((card, index) => (
                  <button 
                    key={`suggestion-${index}`}
                    className="suggestion-card"
                    onClick={() => handleSuggestionClick(card.prompt)}
                    aria-label={`Start conversation about: ${card.title}`}
                  >
                    <div className="suggestion-category" aria-hidden="true">
                      {card.category}
                    </div>
                    <h3 className="suggestion-title">{card.title}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          <EnhancedChatContainer
            messages={messages}
            isLoading={isLoading}
            onRegenerateMessage={handleRegenerateMessage}
            onMessageFeedback={handleMessageFeedback}
          />
        </div>

        <ChatFooter 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </StandardLayout>

      <style jsx>{`
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .welcome-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 700px;
          margin: 2rem auto;
          padding: 1rem;
        }

        .welcome-title {
          font-family: var(--heading-font, 'Lora', serif);
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--text-color, #33302e);
          margin: 0 0 1rem 0;
        }

        .welcome-subtitle {
          font-size: 1.1rem;
          color: var(--text-color, #33302e);
          opacity: 0.8;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .quote-container {
          font-size: 1.2rem;
          font-style: italic;
          color: var(--wisdom-color, #6b4226);
          text-align: center;
          font-family: var(--quote-font, 'Lora', serif);
          line-height: 1.7;
          margin-bottom: 2.5rem;
          max-width: 600px;
          padding: 0 1rem;
          border: none;
          background: transparent;
        }

        .quote-container p {
          margin: 0 0 1rem 0;
        }

        .quote-attribution {
          display: block;
          font-weight: 500;
          font-size: 1rem;
          opacity: 0.9;
        }

        .suggestion-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          width: 100%;
          max-width: 700px;
        }

        .suggestion-card {
          background: var(--card-bg, #ffffff);
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px var(--shadow-color, rgba(75, 46, 42, 0.15));
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid var(--input-border, rgba(75, 46, 42, 0.2));
          text-align: left;
          width: 100%;
          font-family: inherit;
        }

        .suggestion-card:hover,
        .suggestion-card:focus {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px var(--shadow-color, rgba(75, 46, 42, 0.2));
          outline: 2px solid var(--accent-color, #d7722c);
          outline-offset: 2px;
        }

        .suggestion-card:focus {
          outline-style: solid;
        }

        .suggestion-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent-color, #d7722c);
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .suggestion-title {
          font-family: var(--heading-font, 'Lora', serif);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color, #33302e);
          margin: 0;
          line-height: 1.4;
        }

        /* FIXED: Remove border-top from form container and adjust spacing */
        :global(#form-container) {
          border-top: none !important;
          padding-top: 0.5rem !important;
          padding-bottom: 1rem !important;
        }

        /* FIXED: Ensure storyteller mode toggle is properly positioned */
        :global(.form-actions) {
          margin-top: 0.75rem !important;
          padding: 0 0.25rem !important;
        }

        /* FIXED: Ensure toggle switch is fully visible */
        :global(.storyteller-mode) {
          margin-right: 0.5rem !important;
        }

        :global(.toggle-switch) {
          margin-left: 0.5rem !important;
          position: relative !important;
          z-index: 10 !important;
        }

        @media (max-width: 768px) {
          .welcome-container {
            margin: 1rem auto;
            padding: 0.75rem;
          }

          .welcome-title {
            font-size: 2rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .quote-container {
            font-size: 1.1rem;
            padding: 0 0.5rem;
          }

          .suggestion-cards {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .suggestion-card {
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .welcome-title {
            font-size: 1.75rem;
          }

          .quote-container {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}
