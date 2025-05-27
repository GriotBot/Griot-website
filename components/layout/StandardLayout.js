// File: /components/layout/StandardLayout.js - UPDATED with Chat Integration

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Menu, MessageCircle, Plus, LogIn, Sun, Moon } from 'react-feather';

// Import sub-components
import EnhancedSidebar from './EnhancedSidebar';
import ChatFooter from './ChatFooter';
import StandardFooter from './StandardFooter';

export default function StandardLayout({ 
  children, 
  pageType = 'standard', // 'index' or 'standard'
  title = 'GriotBot',
  description = 'Your AI companion for culturally rich conversations and wisdom',
  currentPath = '/',
  // NEW: Chat-specific props for index page
  onSendMessage,
  chatDisabled = false
}) {
  // Global state
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Initialize client-side functionality
  useEffect(() => {
    setIsClient(true);
    loadThemePreference();
  }, []);

  // Load theme preference
  const loadThemePreference = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  };

  // Toggle theme
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Toggle sidebar with animation
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Handle new chat (for index page)
  const handleNewChat = () => {
    if (currentPath === '/') {
      // Clear chat history and reset state
      localStorage.removeItem('griotbot-history');
      window.location.reload();
    } else {
      // Navigate to homepage
      window.location.href = '/';
    }
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* Global CSS Variables and Styles - SAME AS BEFORE */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            /* Color System */
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --header-text: #33302e;
            --sidebar-bg: rgba(75, 46, 42, 0.97);
            --sidebar-text: #f8f5f0;
            --accent-color: #d7722c;
            --accent-hover: #c86520;
            --wisdom-color: #6b4226;
            --input-bg: #ffffff;
            --input-border: rgba(75, 46, 42, 0.2);
            --input-text: #33302e;
            --shadow-color: rgba(75, 46, 42, 0.15);
            --card-bg: #ffffff;
            --footer-bg: rgba(248, 245, 240, 0.98);
            
            /* Layout Constants */
            --topmenu-height: 72px;
            --sidebar-width: 189px;
            --footer-height-index: 189px;
            --footer-height-standard: 95px;
            --sidebar-right-width: 189px; /* Future use */
          }
          
          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
            --header-text: #f0ece4;
            --sidebar-bg: rgba(40, 30, 25, 0.97);
            --sidebar-text: #f0ece4;
            --accent-color: #d7722c;
            --accent-hover: #e8833d;
            --wisdom-color: #e0c08f;
            --input-bg: #352e29;
            --input-border: rgba(240, 236, 228, 0.2);
            --input-text: #f0ece4;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --card-bg: #352e29;
            --footer-bg: rgba(41, 36, 32, 0.98);
          }

          /* Global Reset */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            transition: background-color 0.3s, color 0.3s;
            overflow-x: hidden;
          }

          /* Layout Structure */
          .layout-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            position: relative;
          }

          /* Top Menu Styles */
          .topmenu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: var(--topmenu-height);
            background-color: var(--header-bg);
            color: var(--header-text);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1rem;
            box-shadow: 0 2px 10px var(--shadow-color);
            z-index: 1000;
            transition: background-color 0.3s;
          }

          .topmenu-left {
            display: flex;
            align-items: center;
            width: 200px; /* Fixed width for consistent spacing */
          }

          .topmenu-center {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .topmenu-right {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 200px; /* Fixed width for consistent spacing */
            justify-content: flex-end;
          }

          .menu-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 12px;
            border-radius: 8px;
            color: var(--header-text);
            transition: transform 0.3s ease, background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .menu-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }

          .menu-button.active {
            transform: rotate(90deg);
          }

          .logo-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--header-text);
            font-family: 'Lora', serif;
            font-size: 1.2rem;
            font-weight: bold;
          }

          .logo-image {
            height: 40px;
            width: auto;
          }

          .logo-fallback {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .icon-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            color: var(--header-text);
            transition: background-color 0.2s, transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .icon-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
            transform: translateY(-1px);
          }

          /* New Chat Icon - Special styling */
          .new-chat-icon {
            position: relative;
          }

          .new-chat-icon::after {
            content: '+';
            position: absolute;
            top: -2px;
            right: -2px;
            background-color: var(--accent-color);
            color: white;
            font-size: 10px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }

          /* Main Content Area */
          .main-content {
            margin-top: var(--topmenu-height);
            min-height: calc(100vh - var(--topmenu-height));
            transition: margin-left 0.3s ease;
          }

          .main-content.index-page {
            margin-bottom: var(--footer-height-index);
          }

          .main-content.standard-page {
            margin-bottom: var(--footer-height-standard);
          }

          /* Content wrapper for proper spacing */
          .content-wrapper {
            padding: 2rem;
            max-width: 100%;
            margin: 0 auto;
          }

          .content-wrapper.with-sidebar {
            margin-left: var(--sidebar-width);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .topmenu-left, .topmenu-right {
              width: auto;
            }

            .topmenu-right {
              gap: 0.25rem;
            }

            .content-wrapper.with-sidebar {
              margin-left: 0;
            }

            .icon-button {
              padding: 6px;
            }
          }

          @media (max-width: 480px) {
            .topmenu {
              padding: 0 0.5rem;
            }

            .logo-image {
              height: 32px;
            }

            .content-wrapper {
              padding: 1rem;
            }
          }
        `}} />
      </Head>

      <div className="layout-container">
        {/* TOP MENU - SAME AS BEFORE */}
        <header className="topmenu">
          {/* Left Section - Menu Icon */}
          <div className="topmenu-left">
            <button 
              onClick={toggleSidebar}
              className={`menu-button ${sidebarVisible ? 'active' : ''}`}
              aria-label="Toggle sidebar"
              aria-expanded={sidebarVisible}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Center Section - Logo */}
          <div className="topmenu-center">
            <Link href="/">
              <a className="logo-link">
                {!logoError ? (
                  <img 
                    src="/images/GriotBot logo horiz wht.svg"
                    alt="GriotBot"
                    className="logo-image"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="logo-fallback">
                    <span style={{ fontSize: '1.5rem' }}>🌿</span>
                    <span>GriotBot</span>
                  </div>
                )}
              </a>
            </Link>
          </div>

          {/* Right Section - Action Icons */}
          <div className="topmenu-right">
            {/* New Chat Icon */}
            <button 
              onClick={handleNewChat}
              className="icon-button"
              aria-label="New chat"
              title="New Chat"
            >
              <div className="new-chat-icon">
                <MessageCircle size={20} />
              </div>
            </button>

            {/* Login Icon */}
            <Link href="/comingsoon">
              <a className="icon-button" aria-label="Login" title="Log In">
                <LogIn size={20} />
              </a>
            </Link>

            {/* Theme Toggle */}
            <button 
              onClick={handleThemeToggle}
              className="icon-button"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* ENHANCED SIDEBAR - SAME AS BEFORE */}
        <EnhancedSidebar 
          isVisible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          currentPath={currentPath}
        />

        {/* MAIN CONTENT AREA */}
        <main className={`main-content ${pageType}-page`}>
          <div className={`content-wrapper ${sidebarVisible ? 'with-sidebar' : ''}`}>
            {children}
          </div>
        </main>

        {/* FOOTER - UPDATED to pass chat props */}
        {pageType === 'index' ? (
          <ChatFooter 
            onSendMessage={onSendMessage}
            disabled={chatDisabled}
          />
        ) : (
          <StandardFooter />
        )}
      </div>
    </>
  );
}

//=============================================================================
// File: /pages/index.js - UPDATED to use StandardLayout with chat integration
//=============================================================================

import { useState, useEffect } from 'react';
import StandardLayout from '../components/layout/StandardLayout';

export default function Home() {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Initialize chat history
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Load chat history from localStorage
  const loadChatHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
      if (history.length > 0) {
        setMessages(history);
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Save chat history to localStorage
  const saveChatHistory = (newMessages) => {
    try {
      localStorage.setItem('griotbot-history', JSON.stringify(newMessages.slice(-50)));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Handle sending messages - THIS IS THE KEY INTEGRATION
  const handleSendMessage = async (messageText, storytellerMode) => {
    if (!messageText.trim()) return;

    setIsLoading(true);
    setShowWelcome(false);

    // Add user message
    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText,
          storytellerMode: storytellerMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                         'I apologize, but I seem to be having trouble processing your request.';

      // Add bot message
      const botMessage = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        content: botResponse,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: `error_${Date.now()}`,
        role: 'bot',
        content: 'I apologize, but I encountered an error. Please try again later.',
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (prompt) => {
    handleSendMessage(prompt, false);
  };

  return (
    <StandardLayout 
      pageType="index"
      title="GriotBot - Your Digital Griot"
      description="An AI-powered digital griot providing culturally rich conversations and wisdom"
      currentPath="/"
      onSendMessage={handleSendMessage}  // ← KEY: Pass handler to layout
      chatDisabled={isLoading}           // ← KEY: Pass loading state
    >
      {/* Chat Messages Area - SAME CONTENT AS BEFORE */}
      <div style={{
        minHeight: 'calc(100vh - var(--topmenu-height) - var(--footer-height-index) - 4rem)',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '700px',
        margin: '0 auto',
        width: '100%',
      }}>
        
        {/* Welcome Screen */}
        {showWelcome && (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            color: 'var(--text-color)',
            opacity: 0.7,
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid var(--accent-color)',
              borderTop: '2px solid transparent',  
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            GriotBot is thinking...
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </StandardLayout>
  );
}

// Helper components (WelcomeScreen, ChatMessage) would be the same as before...
