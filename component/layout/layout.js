import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../styles/components/Layout.module.css';

export default function Layout({ 
  children, 
  title = 'GriotBot', 
  description = 'Your AI companion for culturally rich conversations and wisdom' 
}) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  
  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className={styles.header}>
        <div className={styles.leftControls}>
          {!isHomePage && (
            <a href="/" className={styles.backButton} aria-label="Back to chat">
              <span className={styles.backIcon}>
                <img src="/images/arrow-left.svg" alt="" />
              </span>
              <span>Back to Chat</span>
            </a>
          )}
          
          {isHomePage && (
            <button 
              className={styles.menuButton}
              aria-label="Toggle menu"
            >
              <img src="/images/menu.svg" alt="" />
            </button>
          )}
        </div>
        
        <div className={styles.logoContainer}>
          <img src="/images/logo-icon.svg" alt="" className={styles.logoIcon} />
          <span className={styles.logoText}>GriotBot</span>
        </div>
        
        <button 
          className={styles.themeToggle}
          aria-label="Toggle theme"
        >
          <img src="/images/theme-toggle.svg" alt="" />
        </button>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
      
      {isHomePage && (
        <footer className={styles.footer}>
          <div className={styles.proverb} id="proverb">
            "Unity is strength, division is weakness." — Swahili Proverb
          </div>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} GriotBot. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}
