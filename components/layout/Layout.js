// components/layout/Layout.js - Updated to use new Header
import { useState, useEffect } from 'react';
import Header from '../Header';
import ModernSidebar from './ModernSidebar';
import EnhancedFooter from './EnhancedFooter';

export default function Layout({ children }) {
  // Shared state for theme and sidebar visibility
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isIndexPage, setIsIndexPage] = useState(true);

  // Detect current page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIndexPage(window.location.pathname === '/');
    }
  }, []);

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

  // Handle escape key to close sidebar on index page
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarVisible && isIndexPage) {
        closeSidebar();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleEscape);
      
      // Lock body scroll when sidebar is open on index page
      if (sidebarVisible && isIndexPage) {
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
  }, [sidebarVisible, isIndexPage]);

  return (
    <>
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        sidebarVisible={sidebarVisible} 
        toggleSidebar={toggleSidebar} 
        isIndexPage={isIndexPage}
      />
      
      <ModernSidebar 
        visible={sidebarVisible} 
        closeSidebar={closeSidebar}
      />
      
      {/* Main content area that closes sidebar when clicked on index page */}
      <main onClick={isIndexPage ? closeSidebar : undefined} style={{
        marginLeft: isIndexPage ? 0 : '280px',
        transition: 'margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {children}
      </main>
      
      {/* Only include EnhancedFooter on non-index pages */}
      {typeof window !== 'undefined' && window.location.pathname !== '/' && (
        <EnhancedFooter page="other" />
      )}
    </>
  );
}
