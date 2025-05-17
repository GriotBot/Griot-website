// File: /components/layout/Header.js
import Link from 'next/link';

export default function Header({ theme, toggleTheme, sidebarVisible, toggleSidebar }) {
  return (
    <div style={{
      position: 'relative',
      backgroundColor: 'var(--header-bg)',
      color: 'var(--header-text)',
      padding: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      boxShadow: '0 2px 10px var(--shadow-color)',
      zIndex: 100,
      fontFamily: 'Lora, serif',
      transition: 'background-color 0.3s',
    }} id="header" role="banner">
      <button 
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          left: '1rem',
          fontSize: '1.5rem',
          color: 'var(--header-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: '6px',
          transition: 'transform 0.3s ease',
          transform: sidebarVisible ? 'rotate(45deg)' : 'none',
        }}
        id="toggleSidebar"
        aria-label="Toggle sidebar"
        aria-expanded={sidebarVisible}
        aria-controls="sidebar"
      >
        ☰
      </button>
      
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
            style={{
              height: '32px',
              width: 'auto',
            }}
          />
        </a>
      </Link>
      
      <button 
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          right: '1rem',
          fontSize: '1.5rem',
          color: 'var(--header-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: '6px',
        }}
        id="themeToggle"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      
      {/* Sign in button in top-right corner */}
      <a href="/signin" style={{
        position: 'absolute',
        right: '4rem',
        color: 'var(--header-text)',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: '500',
        padding: '0.4rem 0.8rem',
        border: '1px solid var(--header-text)',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
      }}>
        Sign in
      </a>
    </div>
  );
}
