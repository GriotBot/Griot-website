// components/Header.js
import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Menu, LogIn, Sun, Moon } from 'react-feather';
import { MessageCirclePlus } from './icons/MessageCirclePlus';
import styles from '../styles/components/Header.module.css';

export default function Header({ theme, toggleTheme, sidebarVisible, toggleSidebar, isHome = true }) {
  const [tooltip, setTooltip] = useState(null);

  const handleNewChat = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('griotbot-history');
    if (window.location.pathname === '/') window.location.reload();
    else Router.push('/');
  };

  return (
    <header className={styles.header} role="banner" id="header">
      <div className={styles.left}>
        {isHome && (
          <button
            onClick={toggleSidebar}
            className={styles.iconBtn}
            onMouseEnter={() => setTooltip('menu')}
            onMouseLeave={() => setTooltip(null)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarVisible}
            aria-controls="sidebar"
          >
            <Menu size={24} />
            {tooltip === 'menu' && <span className={styles.tooltip}>Menu</span>}
          </button>
        )}
      </div>

      <div className={styles.center}>
        <Link href="/">
          <a className={styles.logoLink}>
            <img src="/images/GriotBot logo horiz wht.svg" alt="GriotBot" className={styles.logo} />
          </a>
        </Link>
      </div>

      <div className={styles.right}>
        <button
          onClick={handleNewChat}
          className={styles.iconBtn}
          onMouseEnter={() => setTooltip('newChat')}
          onMouseLeave={() => setTooltip(null)}
          aria-label="Start new chat"
        >
          <MessageCirclePlus size={24} />
          {tooltip === 'newChat' && <span className={styles.tooltip}>New Chat</span>}
        </button>

        <Link href="/comingsoon">
          <a
            className={styles.iconBtn}
            onMouseEnter={() => setTooltip('login')}
            onMouseLeave={() => setTooltip(null)}
            aria-label="Log in"
          >
            <LogIn size={24} />
            {tooltip === 'login' && <span className={styles.tooltip}>Log In</span>}
          </a>
        </Link>

        <button
          onClick={toggleTheme}
          className={styles.iconBtn}
          onMouseEnter={() => setTooltip('theme')}
          onMouseLeave={() => setTooltip(null)}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          {tooltip === 'theme' && (
            <span className={styles.tooltip}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
      </div>
    </header>
}
