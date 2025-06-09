// File: pages/index.js - With Proverb of the Day
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import StandardLayout from '../components/layout/StandardLayout';
import EnhancedChatContainer from '../components/chat/EnhancedChatContainer';
import ChatFooter from '../components/layout/ChatFooter';
import {
  PROVERBS, // Import the full proverb list
  MAX_HISTORY_LENGTH,
  CHAT_HISTORY_KEY,
  getRandomProverb,
  GREETINGS
} from '../lib/constants';

const HAS_VISITED_KEY = 'griotbot-has-visited';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentProverb, setCurrentProverb] = useState('');
  
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [hasVisited, setHasVisited] = useState(true);

  // Function to get a consistent proverb based on the day of the year
  const getProverbOfTheDay = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const proverbIndex = dayOfYear % PROVERBS.length;
    return PROVERBS[proverbIndex];
  };

  useEffect(() => {
    // On initial load, still show a random proverb for a unique first impression
    setCurrentProverb(getRandomProverb());
    loadChatHistory();
    const visited = localStorage.getItem(HAS_VISITED_KEY) === 'true';
    setHasVisited(visited);
  }, []);
  
  useEffect(() => {
    if (showWelcome && !hasVisited) {
      const interval = setInterval(() => {
        setGreetingIndex(prevIndex => (prevIndex + 1) % GREETINGS.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [showWelcome, hasVisited]);

  const loadChatHistory = useCallback(() => {
    // ... implementation ...
  }, []);

  const saveChatHistory = useCallback((messagesToSave) => {
    // ... implementation ...
  }, []);

  const handleSendMessage = useCallback(async (messageText, storytellerMode = false, explicitHistory = null) => {
    // ... implementation ...
  }, [messages, isLoading, saveChatHistory, hasVisited]);

  // UPDATED: handleNewChat now uses the "Proverb of the Day"
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    // Set the consistent proverb for the day
    setCurrentProverb(getProverbOfTheDay());
  }, []);

  const handleRegenerateMessage = useCallback(async (messageId) => {
    // ... implementation ...
  }, [messages, handleSendMessage]);

  return (
    <>
      <Head>
        {/* ... head content ... */}
      </Head>

      <StandardLayout 
        onNewChat={handleNewChat} 
        pageType="index"
        onSendMessage={handleSendMessage}
        chatDisabled={isLoading}
      >
        <div className="main-content">
          {showWelcome && (
            <div className="welcome-container" role="main">
              {hasVisited ? (
                <div className="quote-only-view">
                  <h2 className="quote-only-title">A New Story Awaits</h2>
                  <blockquote className="quote-container">
                    {/* This will now show the Proverb of the Day */}
                    <p>{currentProverb}</p>
                  </blockquote>
                </div>
              ) : (
                <div className="first-visit-welcome">
                  {/* ... first visit JSX ... */}
                </div>
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
      </StandardLayout>

      <style jsx>{`
        /* ... existing styles ... */
      `}</style>
    </>
  );
}
