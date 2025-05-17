// File: /components/layout/Layout.js - Updated to use Enhanced Sidebar
import { useState, useEffect } from 'react';
import Header from './Header';
import EnhancedSidebar from './EnhancedSidebar';

export default function Layout({ children }) {
  // Shared state for theme and sidebar visibility
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Apply theme from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Close sidebar
  const closeSidebar = () => {
    if (sidebarVisible) {
      setSidebarVisible(false);
    }
  };

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarVisible) {
        closeSidebar();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleEscape);
      
      // Lock body scroll when sidebar is open
      if (sidebarVisible) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      }
    };
  }, [sidebarVisible]);

  return (
    <>
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        sidebarVisible={sidebarVisible} 
        toggleSidebar={toggleSidebar} 
      />
      
      <EnhancedSidebar 
        visible={sidebarVisible} 
        closeSidebar={closeSidebar}
      />
      
      {/* Overlay to close sidebar on mobile */}
      {sidebarVisible && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            backdropFilter: 'blur(3px)',
            transition: 'opacity 0.3s',
            opacity: sidebarVisible ? 1 : 0,
          }}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Main content area that closes sidebar when clicked */}
      <main onClick={closeSidebar}>
        {children}
      </main>
      
      {/* Shared footer elements */}
      <div id="fact" aria-label="Random proverb" style={{
        position: 'fixed',
        bottom: '30px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontStyle: 'italic',
        padding: '0 1rem',
        color: 'var(--wisdom-color)',
        transition: 'color 0.3s',
        opacity: 0.8,
        fontFamily: 'Lora, serif',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 40,
      }}></div>
      
      <div id="copyright" aria-label="Copyright information" style={{
        position: 'fixed',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.6,
        transition: 'color 0.3s',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 40,
      }}>
        © 2025 GriotBot. All rights reserved.
      </div>
    </>
  );
}
