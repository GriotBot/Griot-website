// File: components/layout/StandardLayout.js - Updated to use the Header component
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Import the new Header component
import Header from '../Header';
import EnhancedSidebar from './EnhancedSidebar';
import ChatFooter from './ChatFooter';

// Import shared constants and utility functions
// FIXED: Corrected the import path to go up two directories
import { getRandomProverb } from '../../lib/constants';

// Constants for localStorage keys
const THEME_STORAGE_KEY = 'griotbot-theme';

export default function StandardLayout({
  children,
  pageType = 'standard', // 'index' or 'standard'
  title = 'GriotBot - Your Digital Griot',
  description = 'An AI-powered digital griot providing culturally rich responses',
  currentPath = '/',
  // Pass down the onNewChat handler from the index page
  // FIXED: Provide a default empty function to prevent runtime errors on pages that don't pass this prop.
  onNewChat = () => {},
  // Chat-specific props for index page
  onSendMessage = null,
  chatDisabled = false
}) {
  // State management
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [theme, setTheme] = useState('light');
  const [currentProverb, setCurrentProverb] = useState('');

  // Initialize theme and proverb
  useEffect(() => {
    // This check ensures code only runs on the client-side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      
      // Use the centralized utility function for consistency
      setCurrentProverb(getRandomProverb());
    }
  }, []); // Empty dependency array means this runs once on mount

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
        
        {/* Global CSS Variables */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            /* Layout Variables */
            --topmenu-height: 72px;
            --sidebar-width: 250px;
            --footer-height-index: 150px;
            --footer-height-standard: 75px;
            
            /* Color Variables - Light Theme */
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --header-text: #33302e; /* Text color on header */
            --sidebar-bg: rgba(75, 46, 42, 0.97);
            --sidebar-text: #f8f5f0;
            --accent-color: #d7722c;
            --accent-hover: #c86520;
            --wisdom-color: #6b4226;
            --input-bg: #ffffff;
            --input-border: rgba(75, 46, 42, 0.2);
            --shadow-color: rgba(75, 46, 42, 0.15);
            --card-bg: #ffffff;
            --footer-background-standard: rgb(239, 230, 223);
            
            /* Fonts */
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
            --accent-color: #e8833d;
            --accent-hover: #d7722c;
            --wisdom-color: #e0c08f;
            --input-bg: #352e29;
            --input-border: rgba(240, 236, 228, 0.2);
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

          .layout-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            position: relative;
          }
        `}} />
      </Head>

      <div className="layout-container">
        
        {/* USE THE NEW HEADER COMPONENT */}
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          sidebarVisible={sidebarVisible}
          toggleSidebar={toggleSidebar}
          onNewChat={onNewChat}
          isHome={pageType === 'index'}
        />

        {/* Enhanced Sidebar (remains the same) */}
        <EnhancedSidebar
          isVisible={sidebarVisible}
          onToggle={toggleSidebar}
          currentPage={currentPath}
          onNewChat={onNewChat}
        />

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            paddingTop: 'var(--topmenu-height)', // Use paddingTop to account for fixed header
            paddingBottom: pageType === 'index' ? 'var(--footer-height-index)' : 'var(--footer-height-standard)',
            overflowY: 'auto'
          }}
          role="main"
        >
          {children}
        </main>

        {/* Footer - Conditional based on page type */}
        {pageType === 'index' ? (
          <ChatFooter
            onSendMessage={onSendMessage}
            disabled={chatDisabled}
          />
        ) : (
          <footer
            role="contentinfo"
            aria-label="Page footer with cultural proverb"
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: 'var(--footer-height-standard)',
              background: 'var(--footer-background-standard)',
              borderTop: '1px solid var(--input-border)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
              zIndex: 50,
            }}
          >
            <div style={{ fontStyle: 'italic', color: 'var(--wisdom-color)', textAlign: 'center' }}>
              {currentProverb}
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
