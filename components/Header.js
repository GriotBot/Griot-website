// components/Header.js
import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Menu, LogIn, Sun, Moon } from 'react-feather';
import { MessageCirclePlus } from './icons/MessageCirclePlus';
import styles from '../styles/components/Header.module.css';

export default function Header({ theme, toggleTheme, sidebarVisible, toggleSidebar }) {
  const [tooltipVisible, setTooltipVisible] = useState(null);
  
  const handleNewChat = () => {
    // Clear chat history
    if (typeof window !== 'undefined') {
      localStorage.removeItem('griotbot-history');
      
      // If already on homepage, reload the page
      if (window.location.pathname === '/') {
        window.location.reload();
      } else {
        // Otherwise navigate to homepage
        Router.push('/');
      }
    }
  };
  
  return (
    <header className={styles.header} role="banner" id="header">
      {/* Left side - Menu icon */}
      <div className={styles.menuContainer}>
        <button 
          onClick={toggleSidebar}
          className={styles.iconButton}
          onMouseEnter={() => setTooltipVisible('menu')}
          onMouseLeave={() => setTooltipVisible(null)}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarVisible}
          aria-controls="sidebar"
          id="toggleSidebar"
        >
          <Menu color="white" size={24} />
          {tooltipVisible === 'menu' && (
            <span className={styles.tooltip}>Menu</span>
          )}
        </button>
      </div>
      
      {/* Center - Logo */}
      <div className={styles.logoContainer}>
        <Link href="/">
          <a style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--header-text)',
            textDecoration: 'none',
          }}>
            <img 
              src="/images/GriotBot logo horiz wht.svg" 
              alt="GriotBot" 
              className={styles.logoIcon}
            />
          </a>
        </Link>
      </div>
      
      {/* Right side - Action icons */}
      <div className={styles.actionIcons}>
        <button 
          onClick={handleNewChat}
          className={styles.iconButton}
          onMouseEnter={() => setTooltipVisible('newChat')}
          onMouseLeave={() => setTooltipVisible(null)}
          aria-label="Start new chat"
        >
          <MessageCirclePlus color="white" size={24} />
          {tooltipVisible === 'newChat' && (
            <span className={styles.tooltip}>New Chat</span>
          )}
        </button>
        
        <Link href="/comingsoon">
          <a
            className={styles.iconButton}
            onMouseEnter={() => setTooltipVisible('login')}
            onMouseLeave={() => setTooltipVisible(null)}
            aria-label="Log in"
          >
            <LogIn color="white" size={24} />
            {tooltipVisible === 'login' && (
              <span className={styles.tooltip}>Log In</span>
            )}
          </a>
        </Link>
        
        <button 
          onClick={toggleTheme}
          className={styles.iconButton}
          onMouseEnter={() => setTooltipVisible('theme')}
          onMouseLeave={() => setTooltipVisible(null)}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          id="themeToggle"
        >
          {theme === 'dark' ? (
            <Sun color="white" size={24} />
          ) : (
            <Moon color="white" size={24} />
          )}
          {tooltipVisible === 'theme' && (
            <span className={styles.tooltip}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
