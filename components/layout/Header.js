// File: components/Header.js - Updated & Refactored
import Link from 'next/link';
import { Menu, LogIn, Sun, Moon } from 'react-feather';
import MessageCirclePlus from './icons/MessageCirclePlus';
import styles from '../styles/components/Header.module.css';

export default function Header({
  theme,
  toggleTheme,
  sidebarVisible,
  toggleSidebar,
  onNewChat,
  isHome = true
}) {
  return (
    <header className={styles.header} role="banner" id="header">
      <div className={styles.left}>
        {/* The menu button is only shown on the home page where the sidebar is relevant */}
        {isHome && (
          <button
            onClick={toggleSidebar}
            className={styles.iconBtn}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarVisible}
            aria-controls="sidebar"
            data-tooltip="Menu"
          >
            <Menu size={24} className={styles.icon} />
          </button>
        )}
      </div>

      <div className={styles.center}>
        <Link href="/" className={styles.logoLink}>
          <img src="/images/GriotBot logo horiz wht.svg" alt="GriotBot" className={styles.logo} />
        </Link>
      </div>

      <div className={styles.right}>
        <button
          onClick={onNewChat}
          className={styles.iconBtn}
          aria-label="Start new chat"
          data-tooltip="New Chat"
        >
          <MessageCirclePlus size={24} className={styles.icon} />
        </button>

        <Link
          href="/comingsoon"
          className={styles.iconBtn}
          aria-label="Log in"
          data-tooltip="Log In"
        >
          <LogIn size={24} className={styles.icon} />
        </Link>

        <button
          onClick={toggleTheme}
          className={styles.iconBtn}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          data-tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun size={24} className={styles.icon} />
          ) : (
            <Moon size={24} className={styles.icon} />
          )}
        </button>
      </div>
    </header>
  );
}
