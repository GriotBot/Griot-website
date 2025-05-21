// components/layout/Layout.js
import { useState, useEffect } from 'react';
import Header from '../Header';
import ModernSidebar from './ModernSidebar';
import EnhancedFooter from './EnhancedFooter';
import styles from '../../styles/components/Layout.module.css';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isHome, setIsHome] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    setIsHome(path === '/');
    if (path !== '/') setSidebarVisible(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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
  const closeSidebar = () => sidebarVisible && setSidebarVisible(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onEscape = (e) => e.key === 'Escape' && closeSidebar();
    window.addEventListener('keydown', onEscape);
    document.body.style.overflow = sidebarVisible ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [sidebarVisible]);

  return (
    <div className={styles.container} onClick={closeSidebar}>
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        sidebarVisible={sidebarVisible}
        toggleSidebar={toggleSidebar}
        isHome={isHome}
      />

      <ModernSidebar visible={sidebarVisible} closeSidebar={closeSidebar} />

      <main className={styles.main}>{children}</main>

      {!isHome && <EnhancedFooter page="other" />}
    </div>
  );
}
