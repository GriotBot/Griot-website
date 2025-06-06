// File: /components/layout/StandardLayout.js - IMPROVED VERSION
// Fixes: Code duplication, inline styles, modern Link syntax

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Home, User, Sun, Moon } from 'react-feather';
import MessageCirclePlus from '../icons/MessageCirclePlus';
import EnhancedSidebar from './EnhancedSidebar';
import ChatFooter from './ChatFooter';

// Import shared constants - eliminates code duplication
import { PROVERBS, STORAGE_KEYS, THEMES, getRandomProverb } from '../../lib/constants';

export default function StandardLayout({ 
  children, 
  pageType = 'standard',
  title = 'GriotBot - Your Digital Griot',
  description = 'An AI-powered digital griot providing culturally rich responses',
  currentPath = '/',
  onSendMessage = null,
  chatDisabled = false
}) {
  // State management
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [theme, setTheme] = useState(THEMES.LIGHT);
  const [logoError, setLogoError] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');
  const router = useRouter();

  // Initialize theme and proverb
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT;
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      
      // Use shared function for proverb selection
      setCurrentProverb(getRandomProverb());
    }
  }, []);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Sidebar toggle function
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // New chat handler
  const handleNewChat = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
      if (currentPath !== '/') {
        router.push('/');
      } else {
        router.reload();
      }
    }
  };

  // Logo error handler
  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* Enhanced CSS with Footer Classes */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            /* Layout Variables */
            --topmenu-height: 72px;
            --sidebar-width: 189px;
            --footer-height-index: 189px;
            --footer-height-standard: 95px;
            
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
            --footer-background-standard: rgb(239, 230, 223);
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
            --footer-background-standard: #3a302a;
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
            text-decoration: none;
          }
          
          .menu-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .menu-button:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
          }
          
          .menu-button.rotated {
            transform: rotate(90deg);
          }

          /* IMPROVED: Footer Styles - No More Inline Styles */
          .standard-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: var(--footer-height-standard);
            background: var(--footer-background-standard);
            border-top: 1px solid var(--input-border);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            z-index: 50;
            box-sizing: border-box;
          }

          .footer-proverb {
            font-size: 1.05rem;
            font-style: italic;
            color: var(--wisdom-color);
            text-align: center;
            font-family: var(--quote-font);
            opacity: 0.8;
            line-height: 1.4;
            max-width: 90%;
          }

          .footer-legal {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            fontSize: 0.8rem;
            color: var(--text-color);
            opacity: 0.7;
            text-align: center;
            font-family: var(--body-font);
            flex-wrap: wrap;
          }

          .footer-separator {
            opacity: 0.5;
          }

          /* IMPROVED: CSS-Only Hover Effects */
          .footer-link {
            color: var(--text-color);
            text-decoration: none;
            opacity: 0.7;
            transition: opacity 0.2s ease;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
          }

          .footer-link:hover,
          .footer-link:focus {
            opacity: 1;
            text-decoration: none;
          }

          .footer-link:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
          }

          /* Main Content Styling */
          .main-content {
            flex: 1;
            margin-top: var(--topmenu-height);
            margin-bottom: var(--footer-height-standard);
            overflow-y: auto;
            padding: 1rem;
          }

          .main-content.index-page {
            margin-bottom: var(--footer-height-index);
          }
        `}} />
      </Head>

      <div className="layout-container">
        {/* Top Menu */}
        <header className="top-menu" role="banner">
          <div className="menu-left">
            <button 
              className={`menu-button ${sidebarVisible ? 'rotated' : ''}`}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              aria-expanded={sidebarVisible}
              aria-controls="sidebar"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Modern Link Syntax - No Nested <a> Tag */}
          <Link href="/" className="menu-center">
            {!logoError ? (
              <img 
                src="/images/GriotBot logo horiz wht.svg"
                alt="GriotBot"
                style={{ height: '32px', width: 'auto' }}
                onError={handleLogoError}
              />
            ) : (
              <>
                <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌿</span>
                <span>GriotBot</span>
              </>
            )}
          </Link>

          <div className="menu-right">
            <button 
              className="menu-button"
              onClick={handleNewChat}
              aria-label="New chat"
              title="New Chat"
            >
              <MessageCirclePlus size={20} />
            </button>
            
            <Link href="/comingsoon" className="menu-button" title="Account">
              <User size={20} />
            </Link>
            
            <button 
              className="menu-button"
              onClick={toggleTheme}
              aria-label={theme === THEMES.DARK ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === THEMES.DARK ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === THEMES.DARK ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <EnhancedSidebar 
          isVisible={sidebarVisible}
          onToggle={toggleSidebar}
          currentPage={currentPath}
          onNewChat={handleNewChat}
        />

        {/* Main Content - CSS Classes Instead of Inline Styles */}
        <main 
          className={`main-content ${pageType === 'index' ? 'index-page' : ''}`}
          role="main"
        >
          {children}
        </main>

        {/* Footer - CSS Classes Instead of Inline Styles */}
        {pageType === 'index' ? (
          <ChatFooter 
            onSendMessage={onSendMessage}
            disabled={chatDisabled}
          />
        ) : (
          <footer className="standard-footer" role="contentinfo" aria-label="Page footer with cultural proverb and legal information">
            <div className="footer-proverb" aria-live="polite" aria-label="Cultural proverb">
              {currentProverb}
            </div>

            <div className="footer-legal" aria-label="Copyright and legal information">
              <span>© {new Date().getFullYear()} GriotBot. All rights reserved.</span>
              <span className="footer-separator">|</span>
              
              {/* Modern Link Syntax with CSS Classes */}
              <Link href="/terms" className="footer-link" aria-label="View Terms and Conditions">
                Terms
              </Link>
              
              <Link href="/privacy" className="footer-link" aria-label="View Privacy and Security Policy">
                Privacy
              </Link>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
