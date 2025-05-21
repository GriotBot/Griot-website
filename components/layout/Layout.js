// File: components/layout/Layout.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../Header';
import ModernSidebar from './ModernSidebar';

export default function Layout({ 
  children, 
  title = 'GriotBot - Your Digital Griot', 
  description = 'An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora' 
}) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activePage, setActivePage] = useState('/');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This only runs on client-side
    setIsClient(true);
    
    // Set active page based on current path
    if (typeof window !== 'undefined') {
      setActivePage(window.location.pathname);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* Add inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --header-text: #33302e;
            --sidebar-bg: rgba(75, 46, 42, 0.97);
            --sidebar-text: #f8f5f0;
            --user-bubble: #bd8735;
            --user-text: #f8f5f0;
            --bot-bubble-start: #7d8765;
            --bot-bubble-end: #5e6e4f;
            --bot-text: #f8f5f0;
            --accent-color: #d7722c;
            --accent-hover: #c86520;
            --wisdom-color: #6b4226;
            --input-bg: #ffffff;
            --input-border: rgba(75, 46, 42, 0.2);
            --input-text: #33302e;
            --shadow-color: rgba(75, 46, 42, 0.15);
            --card-bg: #ffffff;
            
            /* Typography */
            --body-font: 'Montserrat', sans-serif;
            --heading-font: 'Lora', serif;
            --quote-font: 'Lora', serif;
          }
          
          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
            --header-text: #f0ece4;
            --sidebar-bg: rgba(40, 30, 25, 0.97);
            --sidebar-text: #f0ece4;
            --user-bubble: #bb7e41;
            --user-text: #f0ece4;
            --bot-bubble-start: #5e6e4f;
            --bot-bubble-end: #3e4a38;
            --bot-text: #f0ece4;
            --accent-color: #d7722c;
            --accent-hover: #e8833d;
            --wisdom-color: #e0c08f;
            --input-bg: #352e29;
            --input-border: rgba(240, 236, 228, 0.2);
            --input-text: #f0ece4;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --card-bg: #352e29;
          }
          
          * { box-sizing: border-box; }
          
          body {
            margin: 0;
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--text-color);
            min-height: 100vh;
            transition: background-color 0.3s, color 0.3s;
            line-height: 1.6;
          }
          
          /* keyframes for spinner */
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </Head>

      {/* Only render client-side components when on the client */}
      {isClient ? (
        <>
          <Header 
            toggleSidebar={toggleSidebar} 
            sidebarVisible={sidebarVisible} 
          />
          
          <ModernSidebar 
            visible={sidebarVisible} 
            onClose={closeSidebar} 
            activePage={activePage}
          />
        </>
      ) : (
        /* Simple server-side rendered header as placeholder */
        <header style={{
          backgroundColor: '#c49a6c',
          color: '#33302e',
          padding: '1rem',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ marginRight: '0.5rem' }}>🌿</span>
          GriotBot
        </header>
      )}

      <main style={{
        paddingTop: '60px', // Account for fixed header
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: 'var(--bg-color)',
        transition: 'background-color 0.3s',
      }}>
        {children}
      </main>
    </>
  );
}
