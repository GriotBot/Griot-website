// File: components/layout/StandardLayout.js
// Updated to conditionally show StandardFooter (exclude index page)

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EnhancedSidebar from './EnhancedSidebar';
import StandardFooter from './StandardFooter';

export default function StandardLayout({ 
  children, 
  showWelcome, 
  currentProverb, 
  onNewChat 
}) {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [theme, setTheme] = useState('light');

  // Check if current page is index (home page)
  const isIndexPage = router.pathname === '/';

  // Theme management
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <>
      {/* HEADER */}
      <div className="header">
        <button onClick={toggleSidebar} className="menu-button">
          ☰
        </button>
        
        <div className="logo-container">
          <img 
            src="/images/GriotBot logo horiz wht.svg" 
            alt="GriotBot"
            className="header-logo"
            onError={(e) => {
              e.target.src = "/images/GriotBot logo horiz wht.png";
            }}
          />
        </div>
        
        <button onClick={toggleTheme} className="theme-button">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* SIDEBAR */}
      <EnhancedSidebar 
        isVisible={sidebarVisible}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        currentPage={router.pathname}
        onNewChat={onNewChat}
      />

      {/* OVERLAY */}
      {sidebarVisible && (
        <div className="overlay" onClick={closeSidebar} />
      )}

      {/* MAIN CONTENT */}
      <div className="layout">
        {children}
      </div>

      {/* CONDITIONAL FOOTER: Only show StandardFooter on non-index pages */}
      {!isIndexPage && (
        <StandardFooter currentProverb={currentProverb} />
      )}

      <style jsx>{`
        .header {
          position: relative;
          background-color: var(--header-bg, #c49a6c);
          color: var(--header-text, #33302e);
          padding: 1rem;
          text-align: center;
          font-weight: bold;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          box-shadow: 0 2px 10px var(--shadow-color, rgba(75, 46, 42, 0.15));
          z-index: 100;
          font-family: var(--heading-font, 'Lora', serif);
          height: 70px;
        }

        .menu-button, .theme-button {
          position: absolute;
          font-size: 1.5rem;
          color: var(--header-text, #33302e);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .menu-button {
          left: 1rem;
        }

        .theme-button {
          right: 1rem;
        }

        .menu-button:hover, .theme-button:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .logo-container {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-logo {
          height: 40px;
          width: auto;
          object-fit: contain;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .layout {
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - 70px);
          background-color: var(--bg-color, #f8f5f0);
        }

        @media (max-width: 768px) {
          .header {
            padding: 0.75rem;
          }
          
          .header-logo {
            height: 35px;
          }
        }
      `}</style>
    </>
  );
}
