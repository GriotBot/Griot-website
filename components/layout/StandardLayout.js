// components/layout/StandardLayout.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Home, User, Sun, Moon } from 'react-feather';
import MessageCirclePlus from '../icons/MessageCirclePlus';
import EnhancedSidebar from './EnhancedSidebar';
import styles from '../../styles/Footer.module.css';

// Import constants - adjust path based on where this file is used
const PROVERBS = [
  "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
  "Until the lion learns to write, every story will glorify the hunter. — African Proverb",
  "We are the drums, we are the dance. — Afro-Caribbean Proverb",
  "A tree cannot stand without its roots. — Jamaican Proverb",
  "Unity is strength, division is weakness. — Swahili Proverb",
  "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
  "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
  "A bird will always use another bird's feathers to feather its nest. — Ashanti Proverb",
  "You must act as if it is impossible to fail. — Yoruba Wisdom",
  "The child who is not embraced by the village will burn it down to feel its warmth. — West African Proverb",
  "However long the night, the dawn will break. — African Proverb",
  "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
  "It takes a village to raise a child. — African Proverb",
  "The fool speaks, the wise listen. — Ethiopian Proverb",
  "When the music changes, so does the dance. — Haitian Proverb"
];

const THEME_STORAGE_KEY = 'griotbot-theme';

const CONTACT_INFO = {
  email: 'chat@griotbot.com',
  instagram: 'https://www.instagram.com/griotbot',
  twitter: 'https://twitter.com/griotbot',
  linkedin: 'https://www.linkedin.com/company/griotbot'
};

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
  const [logoError, setLogoError] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');
  const router = useRouter();

  // Initialize theme and proverb from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load saved theme
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      
      // Set random proverb
      const randomIndex = Math.floor(Math.random() * PROVERBS.length);
      setCurrentProverb(PROVERBS[randomIndex]);
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

  // New chat handler with Next.js router
  const handleNewChat = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('griotbot-history');
      if (currentPath !== '/') {
        router.push('/');
      } else {
        // For index page, reload to reset chat state
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
        
        {/* CSS Variables */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            /* Layout Variables */
            --topmenu-height: 72px;
            --sidebar-width: 189px;
            --footer-height-index: 189px;
            --footer-height-standard: 120px;
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
        `}} />
      </Head>

      <div className="layout-container">
        {/* Top Menu - Always 72px tall */}
        <header className="top-menu" role="banner">
          {/* Left Side - Menu Icon */}
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

          {/* Center - Logo */}
          <Link href="/" className="menu-center">
            {!logoError ? (
              <img 
                src="/images/GriotBot logo horiz wht.svg"
                alt="GriotBot"
                style={{ 
                  height: '32px',
                  width: 'auto'
                }}
                onError={handleLogoError}
              />
            ) : (
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌿</span>
                <span>GriotBot</span>
              </div>
            )}
          </Link>

          {/* Right Side - Action Icons */}
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
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Enhanced Sidebar */}
        <EnhancedSidebar 
          isVisible={sidebarVisible}
          onToggle={toggleSidebar}
          currentPage={currentPath}
          onNewChat={handleNewChat}
        />

        {/* Main Content Area */}
        <main 
          className="main-content"
          style={{
            flex: 1,
            marginTop: 'var(--topmenu-height)',
            marginBottom: pageType === 'index' ? 'var(--footer-height-index)' : 'var(--footer-height-standard)',
            overflowY: 'auto',
            padding: '1rem'
          }}
          role="main"
        >
          {children}
        </main>

        {/* Footer - Only for standard pages (index handles its own) */}
        {pageType === 'standard' && (
          <footer 
            className={styles.footer}
            role="contentinfo"
            aria-label="Page footer with cultural proverb and contact information"
          >
            {/* Enhanced Proverb Section */}
            <div 
              className={styles.proverbContainer}
              aria-live="polite"
              aria-label="Cultural proverb"
            >
              {currentProverb}
            </div>

            {/* Enhanced Social Links */}
            <nav 
              className={styles.socialLinks}
              aria-label="Social media links"
            >
              <Link 
                href={`mailto:${CONTACT_INFO.email}`}
                className={styles.socialLink}
                aria-label="Send email to GriotBot"
              >
                Email
              </Link>
              <Link 
                href={CONTACT_INFO.instagram}
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow GriotBot on Instagram (opens in new tab)"
              >
                Instagram
              </Link>
              <Link 
                href={CONTACT_INFO.twitter}
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow GriotBot on Twitter (opens in new tab)"
              >
                Twitter
              </Link>
            </nav>

            {/* Copyright */}
            <div className={styles.copyright}>
              © {new Date().getFullYear()} GriotBot. All rights reserved.
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
