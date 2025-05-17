// File: /pages/about.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function About() {
  // State for theme toggle
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

  return (
    <>
      <Head>
        <title>About GriotBot</title>
        <meta name="description" content="About GriotBot - An AI-powered digital griot" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
            --accent-color: #d7722c;
            --accent-hover: #c86520;
            --wisdom-color: #6b4226;
            --shadow-color: rgba(75, 46, 42, 0.15);
          }
          
          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
            --header-text: #f0ece4;
            --sidebar-bg: rgba(40, 30, 25, 0.97);
            --sidebar-text: #f0ece4;
            --accent-color: #d7722c;
            --accent-hover: #e8833d;
            --wisdom-color: #e0c08f;
            --shadow-color: rgba(0, 0, 0, 0.3);
          }
        `}} />
      </Head>

      {/* HEADER + CONTROLS */}
      <div style={{
        position: 'relative',
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
        fontFamily: 'Lora, serif',
        transition: 'background-color 0.3s',
      }}>
        <button 
          onClick={toggleSidebar}
          style={{
            position: 'absolute',
            left: '1rem',
            fontSize: '1.5rem',
            color: 'var(--header-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
            transition: 'transform 0.3s ease',
            transform: sidebarVisible ? 'rotate(45deg)' : 'none',
          }}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarVisible}
          aria-controls="sidebar"
        >
          ☰
        </button>
        
        <Link href="/">
          <a style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--header-text)',
            textDecoration: 'none',
          }}>
            <img 
              src="/images/GriotBot logo horiz wht.svg" 
              alt="GriotBot" 
              style={{
                height: '32px',
                width: 'auto',
              }}
            />
          </a>
        </Link>
        
        <button 
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            right: '1rem',
            fontSize: '1.5rem',
            color: 'var(--header-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
          }}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        {/* Sign in button in top-right corner */}
        <a href="/signin" style={{
          position: 'absolute',
          right: '4rem',
          color: 'var(--header-text)',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: '500',
          padding: '0.4rem 0.8rem',
          border: '1px solid var(--header-text)',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
        }}>
          Sign in
        </a>
      </div>

      {/* SIDEBAR */}
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '280px',
          background: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          padding: '1.5rem',
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out, background 0.3s',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '4px 0 20px var(--shadow-color)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
        id="sidebar"
        aria-hidden={!sidebarVisible}
        aria-label="Main navigation"
      >
        <h2 style={{
          margin: '0 0 1rem 0',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'Lora, serif',
        }}>
          <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌿</span>
          GriotBot
        </h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            opacity: '0.8',
          }}>
            Conversations
          </h3>
          <Link href="/">
            <a style={{
              color: 'var(--sidebar-text)',
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
              display: 'block',
              marginBottom: '0.5rem',
            }}>
              <span aria-hidden="true" style={{ marginRight: '0.5rem' }}>+</span> New Chat
            </a>
          </Link>
          <a href="#" style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            Saved Conversations
          </a>
          <a href="#" style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
          }}>
            Saved Stories
          </a>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            opacity: '0.8',
          }}>
            Explore
          </h3>
          <a href="#" style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            Historical Figures
          </a>
          <a href="#" style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
          }}>
            Cultural Stories
          </a>
          <a href="#" style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
          }}>
            Diaspora Community
          </a>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            opacity: '0.8',
          }}>
            About
          </h3>
          <Link href="/about">
            <a style={{
              color: 'var(--sidebar-text)',
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
              display: 'block',
              marginBottom: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.1)', // Highlight current page
            }}>
              About GriotBot
            </a>
          </Link>
          <Link href="/feedback">
            <a style={{
              color: 'var(--sidebar-text)',
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
              display: 'block',
            }}>
              Share Feedback
            </a>
          </Link>
        </div>
        
        <div style={{
          marginTop: 'auto',
          fontSize: '0.8rem',
          opacity: '0.7',
          textAlign: 'center',
          fontStyle: 'italic',
          fontFamily: 'Lora, serif',
        }}>
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div 
        style={{
          fontFamily: 'Montserrat, sans-serif',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
          margin: 0,
          padding: '2rem',
          lineHeight: 1.6,
          minHeight: 'calc(100vh - 60px)', // Account for header height
          transition: 'background-color 0.3s, color 0.3s',
        }}
        onClick={() => {
          if (sidebarVisible) setSidebarVisible(false);
        }}
      >
        <div style={{
          maxWidth: '700px',
          margin: 'auto',
        }}>
          <h1 style={{
            color: '#7d8765',
            fontSize: '2rem',
            marginBottom: '0.5rem',
            fontFamily: 'Lora, serif',
          }}>About GriotBot</h1>
          
          <p>
            <strong>GriotBot</strong> is more than just an AI — it is a spark of
            ancestral memory. Designed to honor the rich oral traditions, cultural
            legacy, and lived experiences of the African Diaspora, GriotBot offers
            thoughtful, accurate, and warm guidance.
          </p>

          <div style={{
            fontStyle: 'italic',
            color: 'var(--wisdom-color)',
            margin: '1rem 0',
            borderLeft: '4px solid #c49a6c',
            paddingLeft: '1rem',
            fontFamily: 'Lora, serif',
          }}>
            "A people without the knowledge of their past history, origin and
            culture is like a tree without roots." — Marcus Garvey
          </div>

          <h2 style={{
            color: '#c49a6c',
            fontSize: '1.2rem',
            marginTop: '2rem',
            fontFamily: 'Lora, serif',
          }}>Why GriotBot?</h2>
          <p>
            The griot was the traditional keeper of history, story, and wisdom.
            GriotBot brings that same spirit into the digital age — acting as a
            wise, trusted voice for learners, educators, and community leaders.
          </p>

          <h2 style={{
            color: '#c49a6c',
            fontSize: '1.2rem',
            marginTop: '2rem',
            fontFamily: 'Lora, serif',
          }}>Who Is It For?</h2>
          <p>
            Anyone seeking cultural knowledge, inspiration, or connection:
            educators, students, nonprofits, families, and curious minds across the
            globe.
          </p>

          <h2 style={{
            color: '#c49a6c',
            fontSize: '1.2rem',
            marginTop: '2rem',
            fontFamily: 'Lora, serif',
          }}>How It Works</h2>
          <p>
            GriotBot uses advanced language models, guided by a carefully crafted
            prompt that shapes its responses with respect, dignity, and clarity. It
            draws from cultural histories, philosophies, and global Black
            experiences to offer grounded responses — never performative, always
            intentional.
          </p>

          <h2 style={{
            color: '#c49a6c',
            fontSize: '1.2rem',
            marginTop: '2rem',
            fontFamily: 'Lora, serif',
          }}>How to Get Involved</h2>
          <p>
            Want to support, fund, test, or help shape GriotBot's future?{' '}
            <a href="mailto:chat@griotbot.com" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Email us</a> or follow{' '}
            <a href="https://www.instagram.com/griotbot" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>@griotbot</a> on Instagram.
          </p>

          <div style={{ marginTop: '2rem' }}>
            <Link href="/">
              <a style={{ 
                color: 'var(--accent-color)', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center', 
              }}>
                ← Back to Chat
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* RANDOM PROVERB & COPYRIGHT */}
      <div style={{
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
      }} aria-label="Random proverb">
        It takes a village to raise a child. - African Proverb
      </div>
      
      <div style={{
        position: 'fixed',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.6,
        transition: 'color 0.3s',
      }} aria-label="Copyright information">
        © 2025 GriotBot. All rights reserved.
      </div>
    </>
  );
}
