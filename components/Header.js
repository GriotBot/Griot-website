import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Menu, LogIn, Sun, Moon } from 'react-feather';
import { MessageCirclePlus } from './icons/MessageCirclePlus';
import styles from '../styles/components/Header.module.css';

export default function Header({
  theme,
  toggleTheme,
  sidebarVisible,
  toggleSidebar,
  isIndexPage = true
}) {
  const [tooltipVisible, setTooltipVisible] = useState(null);

  const handleNewChat = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('griotbot-history');
      if (window.location.pathname === '/') window.location.reload();
      else Router.push('/');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.menuContainer}>
        {isIndexPage && (
          <button
            onClick={toggleSidebar}
            className={styles.iconButton}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarVisible}
            onMouseEnter={() => setTooltipVisible('menu')}
            onMouseLeave={() => setTooltipVisible(null)}
          >
            <Menu color="white" size={24} />
            {tooltipVisible === 'menu' && <span className={styles.tooltip}>Menu</span>}
          </button>
        )}
      </div>

      <div className={styles.logoContainer}>
        <Link href="/">
          <a>
            <img
              src="/images/GriotBot logo horiz wht.svg"
              alt="GriotBot"
              className={styles.logoIcon}
            />
          </a>
        </Link>
      </div>

      <div className={styles.actionIcons}>
        <button
          onClick={handleNewChat}
          className={styles.iconButton}
          aria-label="Start new chat"
          onMouseEnter={() => setTooltipVisible('newChat')}
          onMouseLeave={() => setTooltipVisible(null)}
        >
          <MessageCirclePlus color="white" size={24} />
          {tooltipVisible === 'newChat' && <span className={styles.tooltip}>New Chat</span>}
        </button>

        <Link href="/comingsoon">
          <a
            className={styles.iconButton}
            aria-label="Log in"
            onMouseEnter={() => setTooltipVisible('login')}
            onMouseLeave={() => setTooltipVisible(null)}
          >
            <LogIn color="white" size={24} />
            {tooltipVisible === 'login' && <span className={styles.tooltip}>Log In</span>}
          </a>
        </Link>

        <button
          onClick={toggleTheme}
          className={styles.iconButton}
          aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          onMouseEnter={() => setTooltipVisible('theme')}
          onMouseLeave={() => setTooltipVisible(null)}
        >
          {theme === 'dark' ? <Sun color="white" size={24} /> : <Moon color="white" size={24} />}
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
