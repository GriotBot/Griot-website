// File: pages/index.js - With SEO & Accessibility Enhancements
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import StandardLayout from '../components/layout/StandardLayout';
import EnhancedChatContainer from '../components/chat/EnhancedChatContainer';
import ChatFooter from '../components/layout/ChatFooter';
import {
  PROVERBS,
  MAX_HISTORY_LENGTH,
  CHAT_HISTORY_KEY,
  getRandomProverb,
  GREETINGS
} from '../lib/constants';

const HAS_VISITED_KEY = 'griotbot-has-visited';

// Helper component to display the proverb with the author on a new line
const ProverbDisplay = ({ proverb }) => {
  if (!proverb) return null;

  const parts = proverb.split('—');
  const quote = parts[0].trim();
  const author = parts.length > 1 ? parts[1].trim() : null;

  return (
    <>
      <p>{`"${quote}"`}</p>
      {author && <cite className="quote-attribution">— {author}</cite>}
    </>
  );
};


export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentProverb, setCurrentProverb] = useState('');
  
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [hasVisited, setHasVisited] = useState(true);

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
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setMessages(parsedHistory);
          setShowWelcome(false);
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
    setMessages(prev => [...prev, {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    }]);

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
      
      const contentType = response.headers.get('content-type');
      let accumulatedContent = '';

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        accumulatedContent = data.choices?.[0]?.message?.content || "Sorry, I received an unexpected response.";
      } else {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          accumulatedContent += decoder.decode(value, { stream: true });
          setMessages(prev => prev.map(msg => 
              msg.id === botMessageId ? { ...msg, content: accumulatedContent, isStreaming: true } : msg
          ));
        }
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
    setShowWelcome(true);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setCurrentProverb(getProverbOfTheDay());
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
        {/* SEO: Updated Title and Description for better search ranking */}
        <title>GriotBot | AI Storyteller for African Diaspora & Black Culture</title>
        <meta name="description" content="Engage with GriotBot, your personal AI griot. Explore African diaspora history, proverbs, and stories with our culturally-aware, empathetic chatbot." />
        
        {/* Standard favicon and font links */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />

        {/* SEO: Added Open Graph and Twitter Card meta tags for rich social sharing */}
        <meta property="og:title" content="GriotBot | AI Storyteller & Cultural Wisdom" />
        <meta property="og:description" content="Explore African diaspora history, proverbs, and stories with a culturally-aware, empathetic AI." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.griotbot.com/" />
        {/* IMPORTANT: Replace with the actual URL to your social sharing image */}
        <meta property="og:image" content="https://www.griotbot.com/images/griotbot-social-card.png" /> 
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.griotbot.com/" />
        <meta name="twitter:title" content="GriotBot | AI Storyteller & Cultural Wisdom" />
        <meta name="twitter:description" content="Explore African diaspora history, proverbs, and stories with a culturally-aware, empathetic AI." />
        {/* IMPORTANT: Use the same image URL for Twitter */}
        <meta property="twitter:image" content="https://www.griotbot.com/images/griotbot-social-card.png" />
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
                  <h2 className="wisdom-title">GriotBot's Wisdom of the Day</h2>
                  <blockquote className="quote-container">
                    <ProverbDisplay proverb={currentProverb} />
                  </blockquote>
                </div>
              ) : (
                <div className="first-visit-welcome">
                   <div className="animated-greeting" aria-live="polite" aria-atomic="true">
                    <img src="/images/Adinkra_SiamCroc.svg" alt="The Adinkra symbol for adaptability, the Siamese crocodile" className="adinkra-symbol" />
                    {/* SEO: Changed rotating greeting to an h2 for better semantic structure */}
                    <h2 className="greeting-text" key={greetingIndex}>
                      {GREETINGS[greetingIndex].text}
                    </h2>
                  </div>
                  {/* SEO: Changed main welcome to an h1 for SEO priority */}
                  <h1 className="welcome-subtitle">Welcome to GriotBot</h1>
                  <blockquote className="quote-container welcome-quote">
                    <p>
                      A people without the knowledge of their past history,
                      origin and culture is like a tree without roots.
                    </p>
                    <cite className="quote-attribution">— Marcus Mosiah Garvey</cite>
                  </blockquote>
                </div>
              )}
            </div>
          )}

          {!showWelcome && (
            <EnhancedChatContainer
              messages={messages}
              isLoading={isLoading}
              onRegenerateMessage={handleRegenerateMessage}
            />
          )}
        </div>
      </StandardLayout>

      <style jsx>{`
        /* --- Core Layout Styles --- */
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

        /* --- First Visit Welcome Screen Styles --- */
        .first-visit-welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .animated-greeting {
          display: flex;
          flex-direction: column; 
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .adinkra-symbol {
          width: 50px;
          height: 50px;
          margin-bottom: 1rem;
          animation: fadeIn 1s ease forwards;
        }
        .greeting-text {
          font-family: 'Great Vibes', cursive;
          font-size: 2.7rem;
          font-weight: 400;
          color: #5D2E2E; /* ACCESSIBILITY: Darkened color for better contrast */
          margin: 0;
          animation: fadeInOut 4s ease-in-out infinite;
        }
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            25%, 75% { opacity: 1; }
        }
        .welcome-subtitle {
          font-family: 'Lora', serif;
          font-size: 1.5rem;
          font-weight: 600; /* Made slightly bolder as it is now an h1 */
          margin: 0.5rem 0 2rem 0;
          animation: fadeIn 1s ease 1s forwards;
        }
        .welcome-quote {
            animation: fadeIn 1s ease 1.5s forwards;
        }

        /* --- "New Chat" Screen for Returning Visitors --- */
        .quote-only-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center; 
          text-align: center;
          flex-grow: 1;
          height: 100%; 
        }
        .wisdom-title {
          font-family: var(--body-font, 'Montserrat', sans-serif);
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-color);
          opacity: 0.7;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid var(--input-border);
          border-radius: 20px;
          background-color: rgba(0,0,0,0.02);
        }
        .quote-container {
          font-size: 1.2rem;
          font-style: italic;
          color: var(--wisdom-color, #6b4226);
          line-height: 1.7;
          max-width: 600px;
          border: none;
          background: transparent;
          margin: 0;
        }
        .quote-container p {
            margin-bottom: 1rem;
        }
        .quote-attribution {
          display: block;
          font-size: 1rem;
          margin-top: 1rem;
          opacity: 0.8;
        }
        
        /* --- General Animations & Responsive Styles --- */
        @keyframes fadeIn {
            0% { opacity: 0; }
            to { opacity: 1; }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .adinkra-symbol,
          .greeting-text,
          .welcome-subtitle,
          .welcome-quote {
            animation: fadeIn 1s ease forwards;
          }
        }

        @media (max-width: 600px) {
            .greeting-text {
                font-size: 2.2rem;
            }
            .adinkra-symbol {
              width: 40px;
              height: 40px;
            }
            .welcome-subtitle {
              font-size: 1.2rem;
            }
        }
      `}</style>
    </>
  );
}
