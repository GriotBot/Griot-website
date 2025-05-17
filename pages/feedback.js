import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Feedback() {
  // Basic initialization to match index.js approach
  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('griotbot-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>GriotBot Feedback</title>
        <meta name="description" content="Provide feedback for GriotBot" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div id="header" role="banner">
        <button id="toggleSidebar" aria-label="Toggle sidebar" aria-expanded="false" aria-controls="sidebar">☰</button>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle" aria-label="Toggle dark/light mode">🌙</button>
      </div>

      <main id="chat-container">
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '2rem 1rem',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '1rem',
            color: '#d7722c'
          }}>
            We'd Love Your Feedback
          </h1>
          
          <p style={{ marginBottom: '2rem' }}>
            GriotBot is growing, and your voice helps shape the journey.
          </p>

          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
            height: '80vh',
            maxHeight: '600px',
            overflow: 'hidden'
          }}>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdTfuVK9qk0lfin5xMfTQoakoZOPrcbrCQTswt3oDSTyp4i0w/viewform?embedded=true"
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="GriotBot Feedback Form"
            >
              Loading…
            </iframe>
          </div>

          <Link href="/">
            <a style={{
              display: 'inline-block',
              backgroundColor: '#d7722c',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              ← Back to GriotBot
            </a>
          </Link>
        </div>
      </main>

      <div id="fact" style={{ 
        textAlign: 'center', 
        padding: '1rem', 
        fontStyle: 'italic',
        color: '#6b4226'
      }}>
        "A bird will always use another bird's feathers to feather its nest." — Ashanti Proverb
      </div>
      
      <div id="copyright" style={{ 
        textAlign: 'center', 
        fontSize: '0.8rem',
        color: '#33302e',
        opacity: 0.6,
        padding: '0 0 1rem'
      }}>
        © {new Date().getFullYear()} GriotBot. All rights reserved.
      </div>
    </>
  );
}
