// components/Header.js
import { useState } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { Menu, LogIn, Sun, Moon } from 'react-feather'
import { MessageCirclePlus } from './icons/MessageCirclePlus'
import styles from '../styles/components/Header.module.css'

export default function Header({ theme, toggleTheme }) {
  const [tooltip, setTooltip] = useState(null)

  const onNewChat = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('griotbot-history')
      if (window.location.pathname === '/') window.location.reload()
      else Router.push('/')
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.menuContainer}>
        <button
          onClick={() => {/* open sidebar if you have one */}}
          className={styles.iconButton}
          aria-label="Menu"
          onMouseEnter={() => setTooltip('menu')}
          onMouseLeave={() => setTooltip(null)}
        >
          <Menu color="white" size={24} />
          {tooltip === 'menu' && <span className={styles.tooltip}>Menu</span>}
        </button>
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
          onClick={onNewChat}
          className={styles.iconButton}
          aria-label="New Chat"
          onMouseEnter={() => setTooltip('new')}
          onMouseLeave={() => setTooltip(null)}
        >
          <MessageCirclePlus color="white" size={24} />
          {tooltip === 'new' && <span className={styles.tooltip}>New Chat</span>}
        </button>

        <Link href="/comingsoon">
          <a
            className={styles.iconButton}
            aria-label="Log in"
            onMouseEnter={() => setTooltip('login')}
            onMouseLeave={() => setTooltip(null)}
          >
            <LogIn color="white" size={24} />
            {tooltip === 'login' && <span className={styles.tooltip}>Log In</span>}
          </a>
        </Link>

        <button
          onClick={toggleTheme}
          className={styles.iconButton}
          aria-label="Toggle theme"
          onMouseEnter={() => setTooltip('theme')}
          onMouseLeave={() => setTooltip(null)}
        >
          {theme === 'dark' ? <Sun color="white" size={24} /> : <Moon color="white" size={24} />}
          {tooltip === 'theme' && (
            <span className={styles.tooltip}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
      </div>
    </header>
)
}
