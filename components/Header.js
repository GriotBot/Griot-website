// components/Header.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, LogIn, Sun, Moon } from 'react-feather';
import { MessageCirclePlus } from './icons/MessageCirclePlus';
import styles from '../styles/components/Header.module.css';

export default function Header({ theme, toggleTheme, sidebarVisible, toggleSidebar, isIndexPage = true }) {
  const [tooltip, setTooltip] = useState(null);
  const router = useRouter();

  const handleNewChat = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('griotbot-history');
      if (router.pathname === '/') {
        window.location.reload();
      } else {
        router.push('/');
      }
    }
  };

  const iconProps = { color: 'currentColor', size: 24 };

  return (
    <header className={styles.header} role="banner">
      <div className={styles.left}>
        {isIndexPage && (
          <button
            onClick={toggleSidebar}
            className={styles.iconButton}
            onMouseEnter={() => setTooltip('menu')}
            onMouseLeave={() => setTooltip(null)}
            aria-label="Toggle menu"
            aria-expanded={sidebarVisible}
          >
            <Menu {...iconProps} />
            {tooltip === 'menu' && <span className={styles.tooltip}>Menu</span>}
          </button>
        )}
      </div>

      <div className={styles.center}>
        <Link href="/">
          <a className={styles.logoLink} aria-label="GriotBot home">
            <img
              src="/images/GriotBot logo horiz wht.svg"
              alt="GriotBot"
              className={styles.logo}
            />
          </a>
        </Link>
      </div>

      <div className={styles.right}>
        <button
          onClick={handleNewChat}
          className={styles.iconButton}
          onMouseEnter={() => setTooltip('newChat')}
          onMouseLeave={() => setTooltip(null)}
          aria-label="New chat"
        >
          <MessageCirclePlus {...iconProps} />
          {tooltip === 'newChat' && <span className={styles.tooltip}>New Chat</span>}
        </button>

        <Link href="/comingsoon">
          <a
            className={styles.iconButton}
            onMouseEnter={() => setTooltip('login')}
            onMouseLeave={() => setTooltip(null)}
            aria-label="Log in"
          >
            <LogIn {...iconProps} />
            {tooltip === 'login' && <span className={styles.tooltip}>Log In</span>}
          </a>
        </Link>

        <button
          onClick={toggleTheme}
          className={styles.iconButton}
          onMouseEnter={() => setTooltip('theme')}
          onMouseLeave={() => setTooltip(null)}
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
        >
          {theme === 'dark' ? <Sun {...iconProps} /> : <Moon {...iconProps} />}
          {tooltip === 'theme' && (
            <span className={styles.tooltip}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
      </div>
    </header>
);
