import { useState, useEffect } from 'react';
import Header from '../Header';
import ModernSidebar from './ModernSidebar';
import EnhancedFooter from './EnhancedFooter';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isIndexPage, setIsIndexPage] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      setIsIndexPage(p === '/');
      if (p !== '/') setSidebarVisible(true);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('griotbot-theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('griotbot-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const toggleSidebar = () => setSidebarVisible(v => !v);
  const closeSidebar = () => setSidebarVisible(false);

  // close on Escape
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && closeSidebar();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        sidebarVisible={sidebarVisible}
        toggleSidebar={toggleSidebar}
        isIndexPage={isIndexPage}
      />

      <ModernSidebar visible={sidebarVisible} closeSidebar={closeSidebar} />

      <main onClick={closeSidebar} style={{ marginTop: '60px' }}>
        {children}
      </main>

      <EnhancedFooter page={isIndexPage ? 'index' : 'other'} />
    </>
  );
}
