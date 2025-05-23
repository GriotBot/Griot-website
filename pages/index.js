// pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setIsClient(true);
    
    // Load saved theme
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
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('griotbot-theme', newTheme);
    }
  };

  // Don't render until client-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      
      {/* Header */}
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--header-bg, #c49a6c)',
        color: 'var(--header-text, #33302e)',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        boxShadow: '0 2px 10px rgba(75, 46, 42, 0.15)',
        zIndex: 100,
        fontFamily: 'Lora, serif',
        height: '60px',
        width: '100%',
      }}>
        <button 
          onClick={() => setSidebarVisible(!sidebarVisible)}
          style={{
            position: 'absolute',
            left: '1rem',
            fontSize: '1.5rem',
            color: 'var(--header-text, #33302e)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
          }}
        >
          ☰
        </button>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <span>GriotBot</span>
        </div>
        
        <button 
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            right: '1rem',
            fontSize: '1.5rem',
            color: 'var(--header-text, #33302e)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Main Content */}
      <main style={{
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: 'var(--bg-color, #f8f5f0)',
        color: 'var(--text-color, #33302e)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'Montserrat, sans-serif',
        transition: 'background-color 0.3s, color 0.3s',
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '700px',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
          
          <h1 style={{
            fontFamily: 'Lora, serif',
            fontSize: '2rem',
            marginBottom: '1rem',
          }}>
            Welcome to GriotBot
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '2rem',
            opacity: 0.8,
          }}>
            Your AI companion for culturally rich conversations and wisdom
          </p>
          
          <div style={{
            fontSize: '1.1rem',
            fontStyle: 'italic',
            color: 'var(--wisdom-color, #6b4226)',
            marginBottom: '2rem',
            fontFamily: 'Lora, serif',
          }}>
            "A people without the knowledge of their past history,<br/>
            origin and culture is like a tree without roots."
            <div style={{ marginTop: '0.5rem', fontWeight: '500' }}>
              — Marcus Mosiah Garvey
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            <div style={{
              backgroundColor: 'var(--card-bg, #ffffff)',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 3px 10px rgba(75, 46, 42, 0.15)',
              cursor: 'pointer',
            }}>
              <div style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                color: 'var(--accent-color, #d7722c)',
                fontWeight: '500',
                marginBottom: '0.5rem',
              }}>
                Storytelling
              </div>
              <h3 style={{ margin: 0, fontFamily: 'Lora, serif' }}>
                Tell me a diaspora story about resilience
              </h3>
            </div>

            <div style={{
              backgroundColor: 'var(--card-bg, #ffffff)',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 3px 10px rgba(75, 46, 42, 0.15)',
              cursor: 'pointer',
            }}>
              <div style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                color: 'var(--accent-color, #d7722c)',
                fontWeight: '500',
                marginBottom: '0.5rem',
              }}>
                Wisdom
              </div>
              <h3 style={{ margin: 0, fontFamily: 'Lora, serif' }}>
                African wisdom on community building
              </h3>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontStyle: 'italic',
        color: 'var(--wisdom-color, #6b4226)',
        opacity: 0.8,
        fontFamily: 'Lora, serif',
      }}>
        It takes a village to raise a child. - African Proverb
      </div>
      
      <div style={{
        position: 'fixed',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color, #33302e)',
        opacity: 0.6,
      }}>
        © 2025 GriotBot. All rights reserved.
      </div>
    </>
  );
}
