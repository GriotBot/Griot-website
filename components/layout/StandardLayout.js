// File: components/layout/StandardLayout.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Menu, Home, Plus, User, Sun, Moon } from 'react-feather';
import EnhancedSidebar from './EnhancedSidebar';
import ChatFooter from './ChatFooter';
import StandardFooter from './StandardFooter';

export default function StandardLayout({ 
  children, 
  pageType = 'standard', // 'index' or 'standard'
  title = 'GriotBot - Your Digital Griot',
  description = 'An AI-powered digital griot providing culturally rich responses',
  currentPath = '/',
  // Chat-specific props for index page
  onSendMessage = null,
  chatDisabled = false
}) {
  // State management
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [theme, setTheme] = useState('light');

  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Sidebar toggle
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Close sidebar when clicking outside
  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  // New chat handler
  const handleNewChat = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('griotbot-history');
      if (currentPath !== '/') {
        window.location.href = '/';
      } else {
        // Trigger new chat reset on index page
        window.location.reload();
      }
    }
  };

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
        
        {/* CSS Variables */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            /* Layout Variables */
            --topmenu-height: 72px;
            --sidebar-width: 189px;
            --footer-height-index: 189px;
            --footer-height-standard: 95px;
            --sidebar-right-width: 189px;
            
            /* Color Variables */
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --header-text: #33302e;
            --sidebar-bg: rgba(75, 46, 42, 0.97);
            --sidebar-text: #f8f5f0;
            --user-bubble: #bd8735;
            --user-text: #f8f5f0;
            --bot-bubble-start: #7d8765;
            --bot-bubble-end: #5e6e4f;
            --bot-text: #f8f5f0;
            --accent-color: #d7722c;
            --accent-hover: #c86520;
            --wisdom-color: #6b4226;
            --input-bg: #ffffff;
            --input-border: rgba(75, 46, 42, 0.2);
            --input-text: #33302e;
            --shadow-color: rgba(75, 46, 42, 0.15);
            --card-bg: #ffffff;
            --body-font: 'Montserrat', sans-serif;
            --heading-font: 'Lora', serif;
            --quote-font: 'Lora', serif;
          }
          
          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
            --header-text: #f0ece4;
            --sidebar-bg: rgba(40, 30, 25, 0.97);
            --sidebar-text: #f0ece4;
            --user-bubble: #bb7e41;
            --user-text: #f0ece4;
            --bot-bubble-start: #5e6e4f;
            --bot-bubble-end: #3e4a38;
            --bot-text: #f0ece4;
            --accent-color: #d7722c;
            --accent-hover: #e8833d;
            --wisdom-color: #e0c08f;
            --input-bg: #352e29;
            --input-border: rgba(240, 236, 228, 0.2);
            --input-text: #f0ece4;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --card-bg: #352e29;
          }

          /* Global Styles */
          * { box-sizing: border-box; }
          
          body {
            margin: 0;
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
            line-height: 1.6;
          }

          /* Layout Structure */
          .layout-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            position: relative;
          }
          
          .top-menu {
            height: var(--topmenu-height);
            background-color: var(--header-bg);
            color: var(--header-text);
            display: flex;
            align-items: center;
            padding: 0 1rem;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            box-shadow: 0 2px 10px var(--shadow-color);
            transition: background-color 0.3s;
          }
          
          .menu-left {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          
          .menu-center {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: var(--heading-font);
            font-weight: bold;
            font-size: 1.2rem;
            text-decoration: none;
            color: var(--header-text);
          }
          
          .menu-right {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .menu-button {
            background: none;
            border: none;
            color: var(--header-text);
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            transition: background-color 0.2s, transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .menu-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .menu-button.rotated {
            transform: rotate(90deg);
          }
          
          .main-content {
            flex: 1;
            margin-top: var(--topmenu-height);
            margin-bottom: ${pageType === 'index' ? 'var(--footer-height-index)' : 'var(--footer-height-standard)'};
            overflow-y: auto;
            padding: 1rem;
          }
          
          /* Overlay for sidebar */
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: ${sidebarVisible ? '1' : '0'};
            visibility: ${sidebarVisible ? 'visible' : 'hidden'};
            transition: opacity 0.3s, visibility 0.3s;
          }
        `}} />
      </Head>

      <div className="layout-container">
        {/* Top Menu - Always 72px tall */}
        <header className="top-menu">
          {/* Left Side - Menu Icon */}
          <div className="menu-left">
            <button 
              className={`menu-button ${sidebarVisible ? 'rotated' : ''}`}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              aria-expanded={sidebarVisible}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Center - Logo */}
          <a href="/" className="menu-center">
            <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌿</span>
            <span>GriotBot</span>
          </a>

          {/* Right Side - Action Icons */}
          <div className="menu-right">
            <button 
              className="menu-button"
              onClick={handleNewChat}
              aria-label="New chat"
              title="New Chat"
            >
              <Plus size={20} />
            </button>
            
            <button 
              className="menu-button"
              onClick={() => window.location.href = '/comingsoon'}
              aria-label="Account"
              title="Account"
            >
              <User size={20} />
            </button>
            
            <button 
              className="menu-button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Sidebar Overlay */}
        <div className="sidebar-overlay" onClick={closeSidebar} />

        {/* Enhanced Sidebar */}
        <EnhancedSidebar 
          visible={sidebarVisible}
          onClose={closeSidebar}
          currentPath={currentPath}
          onNewChat={handleNewChat}
        />

        {/* Main Content Area */}
        <main className="main-content">
          {children}
        </main>

        {/* Footer - Conditional based on page type */}
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
