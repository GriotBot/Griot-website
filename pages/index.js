// File: pages/index.js - With Enhanced Welcome Experience
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import StandardLayout from '../components/layout/StandardLayout';
import EnhancedChatContainer from '../components/chat/EnhancedChatContainer';
import ChatFooter from '../components/layout/ChatFooter';
import {
  MAX_HISTORY_LENGTH,
  CHAT_HISTORY_KEY,
  getRandomProverb,
  GREETINGS
} from '../lib/constants';

const HAS_VISITED_KEY = 'griotbot-has-visited';

export default function Home() {
  // State management
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentProverb, setCurrentProverb] = useState('');
  
  // State for new welcome experience
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [hasVisited, setHasVisited] = useState(true); // Default to true to prevent flash of full welcome

  // Initialize component: load history and check visitor status
  useEffect(() => {
    setCurrentProverb(getRandomProverb());
    loadChatHistory();
    
    // Check if the user has visited before from localStorage
    const visited = localStorage.getItem(HAS_VISITED_KEY) === 'true';
    setHasVisited(visited);
  }, []);
  
  // Effect for rotating greetings animation
  useEffect(() => {
    // Only animate greetings if it's the user's first visit
    if (showWelcome && !hasVisited) {
      const interval = setInterval(() => {
        setGreetingIndex(prevIndex => (prevIndex + 1) % GREETINGS.length);
      }, 4000); // Change greeting every 4 seconds
      return () => clearInterval(interval);
    }
  }, [showWelcome, hasVisited]);

  const loadChatHistory = useCallback(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setMessages(parsedHistory);
          setShowWelcome(false); // If history exists, don't show welcome screen
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      localStorage.removeItem(CHAT_HISTORY_KEY);
    }
  }, []);

  const saveChatHistory = useCallback((messagesToSave) => {
    try {
      const recentMessages = messagesToSave.slice(-MAX_HISTORY_LENGTH);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(recentMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, []);

  const handleSendMessage = useCallback(async (messageText, storytellerMode = false, explicitHistory = null) => {
    if (!messageText.trim() || isLoading) return;

    // Mark that user has visited after their first interaction
    if (!hasVisited) {
        localStorage.setItem(HAS_VISITED_KEY, 'true');
        setHasVisited(true);
    }

    setShowWelcome(false);
    setIsLoading(true);

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...(explicitHistory || messages), userMessage];
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
      const messagesToUse = explicitHistory || updatedMessages;
      const conversationHistory = messagesToUse.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText.trim(),
          storytellerMode,
          conversationHistory
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulatedContent += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, content: accumulatedContent, isStreaming: true } : msg
        ));
      }

      const finalBotMessage = {
        id: botMessageId,
        role: 'assistant',
        content: accumulatedContent,
        timestamp: new Date().toISOString(),
        isStreaming: false
      };

      setMessages(prev => {
        const finalMessages = prev.map(msg => msg.id === botMessageId ? finalBotMessage : msg);
        saveChatHistory(finalMessages);
        return finalMessages;
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.map(msg => msg.id === botMessageId ? {
        ...msg, content: `I'm sorry, an error occurred: ${error.message}`, isStreaming: false
      } : msg));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, saveChatHistory, hasVisited]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setShowWelcome(true); // Show the welcome screen again
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setCurrentProverb(getRandomProverb());
  }, []);

  const handleRegenerateMessage = useCallback(async (messageId) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex < 1) return;
    const userMessage = messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;
    const messagesForContext = messages.slice(0, messageIndex);
    setMessages(messagesForContext);
    await handleSendMessage(userMessage.content, false, messagesForContext);
  }, [messages, handleSendMessage]);

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot is a culturally-aware AI companion." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
      </Head>

      <StandardLayout onNewChat={handleNewChat} pageType="index">
        <div className="main-content">
          {showWelcome && (
            <div className="welcome-container" role="main">
              {hasVisited ? (
                <div className="quote-only-view">
                  <h2 className="quote-only-title">A New Story Awaits</h2>
                  <blockquote className="quote-container">
                    <p>{currentProverb}</p>
                  </blockquote>
                </div>
              ) : (
                <div className="first-visit-welcome">
                  <div className="animated-greeting">
                    <img src="/images/Adinkra_SiamCroc.svg" alt="Adinkra Symbol" className="adinkra-symbol" />
                    <h1 className="greeting-text" key={greetingIndex}>
                      {GREETINGS[greetingIndex].text}
                    </h1>
                  </div>
                  <h2 className="welcome-subtitle">Welcome to GriotBot</h2>
                  <blockquote className="quote-container welcome-quote">
                    <p>
                      A people without the knowledge of their past history,
                      origin and culture is like a tree without roots.
                    </p>
                    <cite className="quote-attribution">— Marcus Mosiah Garvey</cite>
                  </blockquote>
                </>
              )}
            </div>
          )}

          {!showWelcome && messages.length > 0 && (
            <EnhancedChatContainer
              messages={messages}
              isLoading={isLoading}
              onRegenerateMessage={handleRegenerateMessage}
            />
          )}
        </div>

        <ChatFooter onSendMessage={handleSendMessage} disabled={isLoading} />
      </StandardLayout>

      <style jsx>{`
        .main-content, .welcome-container {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          width: 100%;
          height: 100%;
        }
        .welcome-container {
          align-items: center;
          justify-content: center; /* Vertically center the content */
          text-align: center;
          padding: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        /* --- Styles for New Welcome Screen --- */

        .first-visit-welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .animated-greeting {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .adinkra-symbol {
          width: 60px;
          height: 60px;
          opacity: 0;
          animation: fadeIn 1s ease 0.5s forwards;
        }

        .greeting-text {
          font-family: 'Great Vibes', cursive;
          font-size: 4.5rem;
          font-weight: 400;
          color: var(--text-color);
          margin: 0;
          opacity: 0;
          transform: translateY(20px);
          animation: traceIn 1.5s ease-out forwards;
        }
        
        @keyframes traceIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .welcome-subtitle {
          font-family: 'Lora', serif;
          font-size: 1.5rem;
          font-weight: 500;
          margin: 0.5rem 0 2rem 0;
          opacity: 0;
          animation: fadeIn 1s ease 1s forwards;
        }
        
        .welcome-quote {
            opacity: 0;
            animation: fadeIn 1s ease 1.5s forwards;
        }
        
        /* --- Styles for Returning Visitor "New Chat" screen --- */

        .quote-only-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          flex-grow: 1;
        }
        .quote-only-title {
          font-family: var(--heading-font, 'Lora', serif);
          font-weight: 500;
          color: var(--text-color);
          opacity: 0.8;
          margin-bottom: 2rem;
        }
        .quote-container {
          font-size: 1.2rem;
          font-style: italic;
          color: var(--wisdom-color, #6b4226);
          line-height: 1.7;
          max-width: 600px;
          border: none;
          background: transparent;
        }
        .quote-attribution {
          display: block;
          font-size: 1rem;
          margin-top: 1rem;
          opacity: 0.8;
        }
        
        /* General Fade-In Animation */
        @keyframes fadeIn {
            to { opacity: 1; }
        }

        /* --- Media Queries for Responsiveness --- */
        @media (max-width: 600px) {
            .greeting-text {
                font-size: 3rem;
            }
            .adinkra-symbol {
              width: 45px;
              height: 45px;
            }
            .welcome-subtitle {
              font-size: 1.2rem;
            }
        }
      `}</style>
    </>
  );
}
