// File: /pages/about.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import EnhancedSidebar from '../components/EnhancedSidebar';

export default function About() {
  // State for theme toggle and sidebar
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
  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Handle sidebar close
  const handleSidebarClose = () => {
    setSidebarVisible(false);
  };

  // Handle new chat (redirect to home)
  const handleNewChat = () => {
    window.location.href = '/';
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

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
            line-height: 1.6;
            min-height: 100vh;
          }

          h1, h2, h3, h4, h5 {
            font-family: 'Lora', serif;
            font-weight: 600;
            margin-top: 0;
          }

          a {
            color: var(--accent-color);
            text-decoration: none;
            transition: color 0.2s;
          }

          a:hover {
            color: var(--accent-hover);
          }

          button {
            font-family: 'Montserrat', sans-serif;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 6px;
            transition: background-color 0.2s, transform 0.2s, color 0.2s;
          }

          button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }

          button:focus-visible {
            outline: 2px solid var(--accent-color);
          }

          a:focus-visible {
            outline: 2px solid var(--accent-color);
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
          onClick={handleSidebarToggle}
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
            gap: '0.5rem',
            color: 'var(--header-text)',
            textDecoration: 'none',
          }}>
            <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌿</span>
            <span>GriotBot</span>
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
      </div>

      {/* ENHANCED SIDEBAR */}
      <EnhancedSidebar 
        isVisible={sidebarVisible}
        onClose={handleSidebarClose}
        onNewChat={handleNewChat}
      />

      {/* MAIN CONTENT */}
      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        margin: 0,
        padding: '2rem',
        lineHeight: 1.6,
        minHeight: 'calc(100vh - 60px)', // Account for header height
        transition: 'background-color 0.3s, color 0.3s',
      }}>
        <div style={{
          maxWidth: '700px',
          margin: 'auto',
        }}>
          {/* Back to Chat Link */}
          <div style={{ marginBottom: '2rem' }}>
            <Link href="/">
              <a style={{ 
                color: 'var(--accent-color)', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}>
                ← Back to Chat
              </a>
            </Link>
          </div>

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

          {/* Call to Action Section */}
          <div style={{
            marginTop: '3rem',
            padding: '2rem',
            backgroundColor: 'var(--card-bg, #ffffff)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px var(--shadow-color)',
            textAlign: 'center',
          }}>
            <h2 style={{
              color: '#c49a6c',
              fontSize: '1.4rem',
              marginBottom: '1rem',
              fontFamily: 'Lora, serif',
            }}>Ready to Experience GriotBot?</h2>
            
            <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
              Join the journey of cultural exploration and wisdom sharing.
            </p>
            
            <Link href="/">
              <a style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '1.1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s, transform 0.2s',
                marginBottom: '1rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-hover)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.transform = 'translateY(0)';
              }}
              >
                <span style={{ fontSize: '1.2rem' }}>💬</span>
                Start Chatting Now
              </a>
            </Link>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1rem',
              flexWrap: 'wrap',
            }}>
              <a 
                href="mailto:chat@griotbot.com" 
                style={{
                  color: 'var(--accent-color)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--accent-color)',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--accent-color)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--accent-color)';
                }}
              >
                <span>📧</span>
                Contact Us
              </a>
              
              <a 
                href="https://www.instagram.com/griotbot" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: 'var(--accent-color)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--accent-color)',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--accent-color)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--accent-color)';
                }}
              >
                <span>📱</span>
                Follow @griotbot
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        backgroundColor: 'var(--bg-color)',
        borderTop: '1px solid var(--input-border, rgba(75, 46, 42, 0.2))',
        padding: '1.5rem 1rem',
        textAlign: 'center',
        transition: 'background-color 0.3s',
      }}>
        <div style={{
          fontSize: '1.05rem',
          fontStyle: 'italic',
          color: 'var(--wisdom-color)',
          fontFamily: 'Lora, serif',
          marginBottom: '0.5rem',
          lineHeight: '1.2',
        }}>
          It takes a village to raise a child. - African Proverb
        </div>
        
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--text-color)',
          opacity: 0.6,
        }}>
          © 2025 GriotBot. All rights reserved.
        </div>
      </div>
    </>
  );
}
