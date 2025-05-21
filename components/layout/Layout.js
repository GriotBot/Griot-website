// components/layout/Layout.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light');
  
  // Initialize theme from localStorage when component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
      transition: 'background-color 0.3s, color 0.3s',
    }}>
      <header style={{
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
        fontFamily: 'var(--heading-font)',
        height: '60px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
      </header>
      
      <main style={{
        flex: 1,
        paddingTop: '60px', // Account for header
      }}>
        {children}
      </main>
    </div>
  );
}
