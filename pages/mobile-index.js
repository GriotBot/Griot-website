// File: pages/mobile-index.js - Fully Optimized Version
import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { Menu, Send, RotateCcw, X } from 'react-feather';
import { MAX_HISTORY_LENGTH, CHAT_HISTORY_KEY } from '../lib/constants';
import styles from '../styles/MobileGriotBot.module.css'; // Using CSS Modules

// --- Helper Components ---
const Message = ({ msg, onRegenerate }) => {
  const isUser = msg.role === 'user';
  const content = (msg.content || '').replace(/\n/g, '<br />');

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.user : styles.assistant}`}>
      <div className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {(!isUser && !msg.isStreaming && onRegenerate) && (
        <div className={styles.messageActions}>
          <button onClick={() => onRegenerate(msg.id)} title="Regenerate" className={styles.actionButton}>
            <RotateCcw size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Mobile Component ---
export default function MobileGriotBot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storytellerMode, setStorytellerMode] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // --- Effects ---

  // FIXED: Handles the unreliable 'vh' unit on mobile browsers.
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  // FIXED: Handles the keyboard appearing on mobile.
  useEffect(() => {
    const inputElement = inputRef.current;
    const handleFocus = () => {
      // When the user focuses the input, scroll it into view above the keyboard.
      setTimeout(() => {
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    };
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
      }
    };
  }, []);


  // Load chat history on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setShowWelcome(false);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Handlers ---
  const handleSendMessage = useCallback(async (text) => {
    const messageText = text.trim();
    if (!messageText || isLoading) return;

    setIsLoading(true);
    if (showWelcome) setShowWelcome(false);
    setInputText('');

    const userMessage = { id: `user-${Date.now()}`, role: 'user', content: messageText, timestamp: new Date().toISOString() };
    const botMessageId = `bot-${Date.now()}`;
    setMessages(prev => [...prev, userMessage, { id: botMessageId, role: 'assistant', content: '', isStreaming: true, timestamp: new Date().toISOString() }]);

    const conversationHistory = [...messages, userMessage].slice(-10).map(msg => ({ role: msg.role, content: msg.content }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: messageText, storytellerMode, conversationHistory }),
      });

      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      
      let accumulatedContent = '';
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const data = await response.json();
        accumulatedContent = data.choices?.[0]?.message?.content || 'Sorry, an error occurred.';
      } else {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          accumulatedContent += decoder.decode(value, { stream: true });
          setMessages(prev => prev.map(msg =>
            msg.id === botMessageId ? { ...msg, content: accumulatedContent } : msg
          ));
        }
      }

      setMessages(prev => {
        const finalMessages = prev.map(msg =>
          msg.id === botMessageId ? { ...msg, content: accumulatedContent, isStreaming: false } : msg
        );
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(finalMessages.slice(-MAX_HISTORY_LENGTH)));
        return finalMessages;
      });

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? { ...msg, content: `I apologize, an error occurred.`, isStreaming: false } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, storytellerMode]);
  
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setShowWelcome(true);
    setSidebarOpen(false);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  }, []);

  const suggestionCards = [
    { title: "The story of Anansi", prompt: "Tell me a story about Anansi the spider" },
    { title: "Wisdom on resilience", prompt: "Share some wisdom about resilience" },
    { title: "The history of Jazz", prompt: "Tell me about the origins of Jazz music" },
  ];

  return (
    <>
      <Head>
        <title>GriotBot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.iconButton} onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
          <div className={styles.headerTitle}>GriotBot</div>
          <div style={{ width: 44 }}></div> {/* Spacer */}
        </header>

        <div className={`${styles.sidebarContainer} ${sidebarOpen ? styles.open : ''}`}>
          <div className={styles.sidebarHeader}>
            <h3>Menu</h3>
            <button className={styles.iconButton} onClick={() => setSidebarOpen(false)} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          <div className={styles.sidebarContent}>
            <button className={styles.sidebarButton} onClick={handleNewChat}>
              + New Chat
            </button>
            <div className={styles.sidebarToggle}>
              <span>Storyteller Mode</span>
              <label className={styles.switch}>
                <input type="checkbox" checked={storytellerMode} onChange={(e) => setStorytellerMode(e.target.checked)} />
                <span className={`${styles.slider} ${styles.round}`}></span>
              </label>
            </div>
          </div>
        </div>
        <div className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.open : ''}`} onClick={() => setSidebarOpen(false)} />

        <main className={styles.chatArea}>
          {showWelcome ? (
            <div className={styles.welcomeScreen}>
              <img src="/images/logo-light.svg" alt="GriotBot Logo" className={styles.welcomeLogo} />
              <h2>Welcome to GriotBot</h2>
              <div className={styles.suggestionGrid}>
                {suggestionCards.map(card => (
                  <button key={card.title} className={styles.suggestionCard} onClick={() => handleSendMessage(card.prompt)}>
                    {card.title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => <Message key={msg.id} msg={msg} onRegenerate={() => {}} />)
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className={styles.inputFooter}>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} className={styles.inputForm}>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything..."
              rows="1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
            />
            <button type="submit" className={styles.sendButton} disabled={isLoading || !inputText.trim()}>
              {isLoading ? <div className={styles.spinner} /> : <Send size={20} />}
            </button>
          </form>
        </footer>
      </div>
    </>
  );
}
