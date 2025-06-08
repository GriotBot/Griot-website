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
                <>
                  <div className="animated-greeting">
                    <h1 className="typewriter">{GREETINGS[greetingIndex].text}</h1>
                    <p className="greeting-origin">A greeting from {GREETINGS[greetingIndex].origin}</p>
                  </div>
                  <p className="welcome-subtitle">
                    Welcome to GriotBot, your AI companion for culturally rich conversations.
                  </p>
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
            justify-content: center;
            text-align: center;
            padding: 1rem;
            max-width: 800px;
            margin: 0 auto;
        }
        .animated-greeting {
          margin-bottom: 1.5rem;
        }
        .typewriter {
          font-family: 'Lora', serif;
          font-size: 3rem;
          font-weight: 600;
          color: var(--text-color);
          display: inline-block;
          overflow: hidden;
          border-right: .12em solid var(--accent-color);
          white-space: nowrap;
          letter-spacing: .1em; 
          animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
          animation-iteration-count: 1; /* Run typing animation once */
        }
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: var(--accent-color); }
        }
        .greeting-origin {
            margin-top: 0.5rem;
            color: var(--wisdom-color);
            font-style: italic;
            opacity: 0;
            animation: fadeIn 1s ease 3.5s forwards;
        }
        @keyframes fadeIn {
            to { opacity: 1; }
        }
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
        .welcome-subtitle {
          font-size: 1.1rem;
          opacity: 0.8;
          line-height: 1.6;
          max-width: 500px;
        }
        .quote-container {
          font-size: 1.2rem;
          font-style: italic;
          color: var(--wisdom-color, #6b4226);
          line-height: 1.7;
          max-width: 600px;
          border: none;
        }
        @media (max-width: 600px) {
            .typewriter {
                font-size: 2rem;
            }
        }
      `}</style>
    </>
  );
}
