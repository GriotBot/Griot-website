
// components/layout/Header.js
import { useTheme } from '../../hooks/useTheme';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/components/Header.module.css';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  
  return (
    <header className={styles.header}>
      <div className={styles.leftControls}>
        <button 
          className={styles.menuButton} 
          aria-label="Toggle sidebar" 
          aria-expanded="false" 
          aria-controls="sidebar"
          id="toggleSidebar"
        >
          <span className={styles.menuIcon}></span>
        </button>
        
        {!isHomePage && (
          <Link href="/">
            <a className={styles.backButton} aria-label="Back to chat">
              <span className={styles.backIcon}></span>
              <span className={styles.backText}>Back to Chat</span>
            </a>
          </Link>
        )}
      </div>
      
      {isHomePage && (
        <div className={styles.logoContainer}>
          <svg className={styles.logoIcon} width="24" height="24" aria-hidden="true">
            {/* SVG logo path - replacing emoji */}
          </svg>
          <span className={styles.logoText}>GriotBot</span>
        </div>
      )}
      
      <button 
        className={styles.themeToggle} 
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
