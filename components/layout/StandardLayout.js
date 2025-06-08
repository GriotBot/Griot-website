// File: components/layout/StandardLayout.js - UX/UI ENHANCED VERSION
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, User, Sun, Moon } from 'react-feather';
import MessageCirclePlus from '../icons/MessageCirclePlus';
import EnhancedSidebar from './EnhancedSidebar';
import ChatFooter from './ChatFooter';
import StandardFooter from './StandardFooter';

// Constants for localStorage keys
const THEME_STORAGE_KEY = 'griotbot-theme';

export default function StandardLayout({ 
  children, 
  pageType = 'standard', // 'index' or 'standard'
  title = 'GriotBot - Your Digital Griot',
  description = 'An AI-powered digital griot providing culturally rich responses',
  currentPath = '/',
  // This prop should be passed from the parent page (e.g., pages/index.js)
  // for a smoother, no-reload experience.
  onNewChat = () => { 
    if (typeof window !== 'undefined') {
      localStorage.removeItem('griotbot-history');
      window.location.href = '/';
    }
  },
  onSendMessage = null,
  chatDisabled = false
}) {
  // State management
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [theme, setTheme] = useState('light');
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  // State for header visibility on scroll
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Effect to handle scroll events for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      // Show header if scrolling up or at the very top
      setHeaderVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);


  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Sidebar toggle function
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Logo error handler
  const handleLogoError = () => {
    setLogoError(true);
  };

  // Dynamic margin for main content
  const mainContentStyle = {
    flex: 1,
    marginTop: 'var(--topmenu-height)',
    marginBottom: pageType === 'index' ? 'var(--footer-height-index)' : 'var(--footer-height-standard)',
    overflowY: 'auto',
    padding: '1rem'
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
        
        {/* CSS Variables & Global Styles */}
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
            --accent-color: #d7722c;
            --wisdom-color: #6b4226;
            --input-bg: #ffffff;
            --input-border: rgba(75, 46, 42, 0.2);
            --shadow-color: rgba(75, 46, 42, 0.15);
            --body-font: 'Montserrat', sans-serif;
            --heading-font: 'Lora', serif;
          }
          
          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
            --header-text: #f0ece4;
            --sidebar-bg: rgba(40, 30, 25, 0.97);
            --sidebar-text: #f0ece4;
            --wisdom-color: #e0c08f;
            --input-bg: #352e29;
            --input-border: rgba(240, 236, 228, 0.2);
            --shadow-color: rgba(0, 0, 0, 0.3);
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

          .layout-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            position: relative;
          }
          
          /* --- IMPROVED HEADER STYLES --- */
          .top-menu {
            height: var(--topmenu-height);
            background-color: var(--header-bg);
            display: flex;
            align-items: center;
            justify-content: space-between; /* Use flexbox for robust centering */
            padding: 0 1rem;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            box-shadow: 0 2px 10px var(--shadow-color);
            transition: background-color 0.3s, transform 0.4s ease-in-out;
            transform: translateY(0);
          }

          .top-menu.hidden {
            transform: translateY(-100%);
          }
          
          .menu-left, .menu-right {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1; /* Assign flex space */
          }
          
          .menu-left {
            justify-content: flex-start;
          }

          .menu-center {
            flex: 2; /* Allow logo to take more space */
            display: flex;
            justify-content: center;
            text-decoration: none;
            color: var(--header-text);
          }
          
          .menu-right {
            justify-content: flex-end;
          }
          
          .menu-button {
            background: none;
            border: none;
            color: #D8C7BA;
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            transition: background-color 0.2s, color 0.2s, transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            position: relative;
          }
          
          .menu-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: #FFFFFF;
          }

          /* Active page indicator */
          .menu-button.active {
            background-color: rgba(0, 0, 0, 0.1);
          }

          /* ADDED: Class for rotating the menu icon */
          .menu-button.rotated {
            transform: rotate(90deg);
          }
          
          /* Theme toggle icon animation */
          .theme-icon-container {
            position: relative;
            width: 20px;
            height: 20px;
          }
          .theme-icon {
            position: absolute;
            transition: opacity 0.3s, transform 0.3s;
          }
          .theme-icon.sun {
            opacity: ${theme === 'dark' ? 1 : 0};
            transform: ${theme === 'dark' ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-90deg)'};
          }
          .theme-icon.moon {
            opacity: ${theme === 'light' ? 1 : 0};
            transform: ${theme === 'light' ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(90deg)'};
          }

          /* Mobile responsiveness for header */
          @media (max-width: 500px) {
            .menu-button.mobile-hide {
              display: none;
            }
            .menu-center {
              flex: 3; /* Give logo more space on mobile */
            }
          }
        `}} />
      </Head>

      <div className="layout-container">
        <header className={`top-menu ${headerVisible ? '' : 'hidden'}`} role="banner">
          <div className="menu-left">
            <button 
              className={`menu-button ${sidebarVisible ? 'rotated' : ''}`}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
          </div>

          <Link href="/" className="menu-center">
            {!logoError ? (
              <img 
                src="/images/GriotBot logo horiz wht.svg"
                alt="GriotBot"
                style={{ height: '32px', width: 'auto' }}
                onError={handleLogoError}
              />
            ) : (
              <span>GriotBot</span>
            )}
          </Link>

          <div className="menu-right">
            <button 
              className="menu-button"
              onClick={onNewChat} /* Use prop for smoother experience */
              aria-label="New chat"
              title="New Chat"
            >
              <MessageCirclePlus size={20} />
            </button>
            
            <Link 
              href="/comingsoon" 
              className={`menu-button mobile-hide ${currentPath === '/comingsoon' ? 'active' : ''}`} 
              title="Account"
            >
              <User size={20} />
            </Link>
            
            <button 
              className="menu-button mobile-hide"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              <div className="theme-icon-container">
                <Sun size={20} className="theme-icon sun" />
                <Moon size={20} className="theme-icon moon" />
              </div>
            </button>
          </div>
        </header>

        <EnhancedSidebar 
          isVisible={sidebarVisible}
          onToggle={toggleSidebar}
          currentPage={currentPath}
          onNewChat={onNewChat}
        />

        <main 
          style={mainContentStyle}
          role="main"
        >
          {children}
        </main>

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
