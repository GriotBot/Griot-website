// File: components/Header.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, LogIn } from 'react-feather';
import MessageCirclePlus from './icons/MessageCirclePlus';
import styles from '../styles/components/Header.module.css';

const Header = ({ toggleSidebar, sidebarVisible }) => {
  const [theme, setTheme] = useState('light');
  const [tooltipVisible, setTooltipVisible] = useState({
    newChat: false,
    login: false,
    theme: false
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Only toggle theme on the client side
  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const clearChatHistory = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('griotbot-history');
    // Reload the page
    window.location.href = '/';
  };

  const showTooltip = (key) => {
    setTooltipVisible({
      ...tooltipVisible,
      [key]: true
    });
  };

  const hideTooltip = (key) => {
    setTooltipVisible({
      ...tooltipVisible,
      [key]: false
    });
  };

  // Return simple header during SSR
  if (!mounted) {
    return (
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🌿</span>
          <span className={styles.logoText}>GriotBot</span>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <button 
        onClick={toggleSidebar}
        className={`${styles.menuButton} ${sidebarVisible ? styles.active : ''}`}
        aria-label="Toggle sidebar"
        aria-expanded={sidebarVisible}
        aria-controls="sidebar"
      >
        <span className={styles.menuIcon}>{sidebarVisible ? '×' : '☰'}</span>
      </button>
      
      <Link href="/">
        <a className={styles.logo}>
          <span className={styles.logoIcon}>🌿</span>
          <span className={styles.logoText}>GriotBot</span>
        </a>
      </Link>
      
      <div className={styles.actions}>
        <div className={styles.tooltipContainer}>
          <button 
            onClick={clearChatHistory}
            className={styles.actionButton}
            aria-label="Start new chat"
            onMouseEnter={() => showTooltip('newChat')}
            onMouseLeave={() => hideTooltip('newChat')}
          >
            <MessageCirclePlus size={24} />
          </button>
          {tooltipVisible.newChat && (
            <div className={styles.tooltip}>New Chat</div>
          )}
        </div>

        <div className={styles.tooltipContainer}>
          <Link href="/comingsoon">
            <a 
              className={styles.actionButton}
              aria-label="Log in"
              onMouseEnter={() => showTooltip('login')}
              onMouseLeave={() => hideTooltip('login')}
            >
              <LogIn size={24} />
            </a>
          </Link>
          {tooltipVisible.login && (
            <div className={styles.tooltip}>Log In</div>
          )}
        </div>

        <div className={styles.tooltipContainer}>
          <button 
            onClick={toggleTheme}
            className={styles.actionButton}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onMouseEnter={() => showTooltip('theme')}
            onMouseLeave={() => hideTooltip('theme')}
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          {tooltipVisible.theme && (
            <div className={styles.tooltip}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
