// File: pages/mobile-index.js - Corrected and Merged Version
import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { Menu, Send, RotateCcw, X } from 'react-feather';
import { MAX_HISTORY_LENGTH, CHAT_HISTORY_KEY } from '../lib/constants';

// --- Helper Components ---

// Renders a single message bubble
const Message = ({ msg, onRegenerate }) => {
  const isUser = msg.role === 'user';
  // Safely handle content that might be undefined
  const content = (msg.content || '').replace(/\n/g, '<br />');

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'assistant'}`}>
      <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {(!isUser && !msg.isStreaming && onRegenerate) && (
        <div className="message-actions">
          <button onClick={() => onRegenerate(msg.id)} title="Regenerate">
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

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    
    const botMessageId = `bot-${Date.now()}`;
    // Add both user message and bot placeholder in one state update
    setMessages(prev => [...prev, userMessage, {
      id: botMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
      timestamp: new Date().toISOString(),
    }]);

    const conversationHistory = [...messages, userMessage] // Use the most up-to-date message list
      .slice(-10)
      .map(msg => ({ role: msg.role, content: msg.content }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText,
          storytellerMode,
          conversationHistory,
        }),
      });

      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      
      let accumulatedContent = '';
      const contentType = response.headers.get('content-type');

      // Correctly handle both streaming and non-streaming responses
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        accumulatedContent = data.choices?.[0]?.message?.content || 'Sorry, I could not get a response.';
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

      // Finalize the bot's message in the state
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
        msg.id === botMessageId ? { ...msg, content: `I apologize, an error occurred. ${error.message}`, isStreaming: false } : msg
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

      <div className="mobile-container">
        {/* --- Header --- */}
        <header className="mobile-header">
          <button className="icon-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
          <div className="header-title">GriotBot</div>
          <div style={{ width: 40 }}></div> {/* Spacer */}
        </header>

        {/* --- Sidebar --- */}
        <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Menu</h3>
            <button className="icon-button" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          <div className="sidebar-content">
            <button className="sidebar-button" onClick={handleNewChat}>
              + New Chat
            </button>
            <div className="sidebar-toggle">
              <span>Storyteller Mode</span>
              <label className="switch">
                <input type="checkbox" checked={storytellerMode} onChange={(e) => setStorytellerMode(e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />


        {/* --- Chat Area --- */}
        <main className="chat-area">
          {showWelcome ? (
            <div className="welcome-screen">
              <img src="/images/logo-light.svg" alt="GriotBot Logo" className="welcome-logo" />
              <h2>Welcome to GriotBot</h2>
              <div className="suggestion-grid">
                {suggestionCards.map(card => (
                  <button key={card.title} className="suggestion-card" onClick={() => handleSendMessage(card.prompt)}>
                    {card.title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(msg => <Message key={msg.id} msg={msg} onRegenerate={() => { /* Implement regenerate logic */ }} />)
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* --- Input Footer --- */}
        <footer className="input-footer">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} className="input-form">
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
            <button type="submit" className="send-button" disabled={isLoading || !inputText.trim()}>
              {isLoading ? <div className="spinner" /> : <Send size={20} />}
            </button>
          </form>
        </footer>
      </div>

      <style jsx global>{`
        /* --- Base Styles & Resets --- */
        html, body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f0f2f5;
          overscroll-behavior-y: contain; /* Prevents pull-to-refresh */
        }
        .mobile-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          position: relative;
        }

        /* --- Header --- */
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          height: 60px;
          background-color: #fff;
          border-bottom: 1px solid #ddd;
          flex-shrink: 0;
        }
        .header-title {
          font-weight: 600;
          font-size: 1.2rem;
        }
        .icon-button {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* --- Sidebar --- */
        .sidebar-container {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 280px;
          background-color: #2c3e50;
          color: white;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          z-index: 1001;
          display: flex;
          flex-direction: column;
        }
        .sidebar-container.open {
          transform: translateX(0);
        }
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
          z-index: 1000;
        }
        .sidebar-overlay.open {
          opacity: 1;
          visibility: visible;
        }
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .sidebar-header h3 {
          margin: 0;
          font-size: 1.2rem;
        }
        .sidebar-content {
          padding: 1rem;
        }
        .sidebar-button {
          width: 100%;
          padding: 0.75rem;
          background-color: transparent;
          color: inherit;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 1rem;
          text-align: left;
        }
        .sidebar-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }

        /* --- Chat Area --- */
        .chat-area {
          flex-grow: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        .welcome-screen {
          text-align: center;
          padding-top: 4rem;
        }
        .welcome-logo {
          width: 80px;
          height: 80px;
          margin-bottom: 1rem;
        }
        .suggestion-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: 2rem;
        }
        .suggestion-card {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 1rem;
          font-size: 0.9rem;
          cursor: pointer;
        }

        /* --- Messages --- */
        .message-wrapper {
          display: flex;
          margin-bottom: 0.75rem;
          max-width: 85%;
        }
        .message-wrapper.user {
          justify-content: flex-end;
          margin-left: auto;
        }
        .message-wrapper.assistant {
          justify-content: flex-start;
        }
        .message-bubble {
          padding: 0.75rem 1rem;
          border-radius: 18px;
          line-height: 1.5;
        }
        .message-bubble.user {
          background-color: #007aff;
          color: white;
          border-bottom-right-radius: 4px;
        }
        .message-bubble.assistant {
          background-color: #e5e5ea;
          color: black;
          border-bottom-left-radius: 4px;
        }
        .message-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-left: 8px; /* For assistant messages */
        }
        .message-actions button {
            background: none; border: none; padding: 4px; cursor: pointer; color: #8e8e93;
        }

        /* --- Input Footer --- */
        .input-footer {
          padding: 0.5rem 1rem 1rem 1rem; /* Padding for home indicator on iOS */
          background-color: #fff;
          border-top: 1px solid #ddd;
          flex-shrink: 0;
        }
        .input-form {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .input-form textarea {
          flex-grow: 1;
          border: 1px solid #ccc;
          border-radius: 18px;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          resize: none;
          max-height: 100px;
          overflow-y: auto;
        }
        .send-button {
          background-color: #007aff;
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .send-button:disabled {
          background-color: #ccc;
        }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.5);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* --- Toggle Switch --- */
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 2px; bottom: 2px; background-color: white; transition: .4s; }
        input:checked + .slider { background-color: #007aff; }
        input:checked + .slider:before { transform: translateX(20px); }
        .slider.round { border-radius: 24px; }
        .slider.round:before { border-radius: 50%; }

      `}</style>
    </>
  );
}
