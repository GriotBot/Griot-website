// File: /components/layout/Layout.js
import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

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

  return (
    <>
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        sidebarVisible={sidebarVisible} 
        toggleSidebar={toggleSidebar} 
      />
      
      <Sidebar 
        visible={sidebarVisible} 
        currentPath={typeof window !== 'undefined' ? window.location.pathname : '/'}
      />
      
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
