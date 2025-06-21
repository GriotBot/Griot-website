// components/layout/Layout.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../Header'; // Use the main Header component
import EnhancedSidebar from '../EnhancedSidebar'; // Use the main EnhancedSidebar
import { CHAT_HISTORY_KEY } from '../../lib/constants';

export default function Layout({ children, title = 'GriotBot' }) {
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const { pathname } = router;

  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      
      // Handle Escape key to close sidebar
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setSidebarVisible(false);
        }
      };
      
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('griotbot-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('griotbot-history');
    localStorage.removeItem(CHAT_HISTORY_KEY);
    if (pathname === '/') {
      window.location.reload();
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      
      {/* Main header */}
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        toggleSidebar={() => setSidebarVisible(prev => !prev)}
        sidebarVisible={sidebarVisible}
        onNewChat={handleNewChat}
      />
