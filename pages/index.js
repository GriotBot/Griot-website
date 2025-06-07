// File: pages/index.js - Final Refactored Version
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import StandardLayout from '../components/layout/StandardLayout';
import EnhancedChatContainer from '../components/chat/EnhancedChatContainer';
import ChatFooter from '../components/layout/ChatFooter';
import {
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

  // Handle sending messages with corrected regeneration logic
  const handleSendMessage = useCallback(async (messageText, storytellerMode = false, explicitHistory = null) => {
    if (!messageText.trim() || isLoading) return;

    setShowWelcome(false);
    setIsLoading(true);

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

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
      // Use explicit history if provided (for regeneration), otherwise use current messages
      const messagesToUse = explicitHistory || updatedMessages;
      const conversationHistory = messagesToUse
        .slice(-10) // Last 10 messages to control token usage and costs
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: messageText.trim(),
          storytellerMode: storytellerMode,
          conversationHistory: conversationHistory
        })
      });

      if (!response.ok) {
        // Try to parse a specific error message from the API, otherwise fall back
        const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
        const errorMessage = errorData.error || `Unable to process your request (Error ${response.status}).`;
        throw new Error(errorMessage);
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        accumulatedContent += decoder.decode(value, { stream: true });

        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === botMessageId
              ? { ...msg, content: accumulatedContent, isStreaming: true }
              : msg
          )
        );
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
      const errorMessageText = error.message || 'Something went wrong. Please try again.';

      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === botMessageId
            ? {
                ...msg,
                content: `I'm sorry, an error occurred: ${errorMessageText}`,
                isStreaming: false
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, saveChatHistory]);


  // Handle new chat with proper dependencies
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setCurrentProverb(getRandomProverb());
  }, []);

  // Handle message regeneration with corrected context logic
  const handleRegenerateMessage = useCallback(async (messageId) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex < 1) return; // Ensure there's a message to regenerate and a user prompt before it

    const userMessage = messages[messageIndex - 1];
    if (userMessage.role !== 'user') return; // Should be responding to a user message

    // Capture the correct historical context BEFORE removing the bot message
    const messagesForContext = messages.slice(0, messageIndex);
    
    // Update the UI to remove the old bot message
    setMessages(messagesForContext);
    
    // Regenerate response using the correct, preserved historical context
    await handleSendMessage(userMessage.content, false, messagesForContext);
  }, [messages, handleSendMessage]);

  // Handle message feedback
  const handleMessageFeedback = useCallback((messageId, feedbackType) => {
    console.log(`Feedback for message ${messageId}: ${feedbackType}`);
    // Optional: Send to an analytics API in the future
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
              
              {/* --- Suggestion Cards Section Removed As Requested --- */}

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

        /* Styles for Suggestion Cards have been removed */

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
