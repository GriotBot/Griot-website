// File: /components/layout/Layout.js - Updated to use Enhanced Sidebar
import { useState, useEffect } from 'react';
import Header from './Header';
import EnhancedSidebar from './EnhancedSidebar';
import EnhancedFooter from './EnhancedFooter';

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
      
      {/* Removed the overlay completely */}
      
      {/* Main content area that closes sidebar when clicked */}
      <main onClick={closeSidebar}>
        {children}
      </main>
      
      {/* Enhanced footer replaces the old footer elements */}
      <EnhancedFooter page={typeof window !== 'undefined' ? window.location.pathname === '/' ? 'index' : 'other' : 'other'} />
    </>
  );
}
