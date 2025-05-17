import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Feedback() {
  // Initialize sidebar and theme toggle functionality
  useEffect(() => {
    // Get DOM elements
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const themeToggle = document.getElementById('themeToggle');
    
    // Handle sidebar toggle
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        const visible = sidebar.classList.toggle('visible');
        toggleBtn.setAttribute('aria-expanded', visible);
        sidebar.setAttribute('aria-hidden', !visible);
      });
      
      // Close sidebar when clicking outside
      document.addEventListener('click', (event) => {
        if (sidebar.classList.contains('visible') && 
            !sidebar.contains(event.target) && 
            !toggleBtn.contains(event.target)) {
          sidebar.classList.remove('visible');
          toggleBtn.setAttribute('aria-expanded', 'false');
          sidebar.setAttribute('aria-hidden', 'true');
        }
      });
    }
    
    // Initialize theme from localStorage
    if (themeToggle) {
      const savedTheme = localStorage.getItem('griotbot-theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
      }
      
      // Handle theme toggle click
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('griotbot-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>GriotBot Feedback</title>
        <meta name="description" content="Provide feedback for GriotBot" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* HEADER + CONTROLS - Use same class structure as index.js */}
      <div id="header" role="banner">
        <button id="toggleSidebar" aria-label="Toggle sidebar" aria-expanded="false" aria-controls="sidebar">☰</button>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle" aria-label="Toggle dark/light mode">🌙</button>
      </div>

      {/* SIDEBAR - Use same class structure as index.js */}
      <nav id="sidebar" aria-hidden="true" aria-label="Main navigation">
        <h2>
          <span className="logo-icon" aria-hidden="true">🌿</span>
          GriotBot
        </h2>
        
        <div className="sidebar-profile">
          <span className="free-badge">Free Account</span>
          <button className="upgrade-btn">Upgrade to Premium</button>
        </div>
        
        <div className="nav-section">
          <h3>Conversations</h3>
          <Link href="/">
            <a id="newChat">
              <span aria-hidden="true">+</span> New Chat
            </a>
          </Link>
          <a href="#" id="savedChats">Saved Conversations</a>
        </div>
        
        <div className="nav-section">
          <h3>Explore</h3>
          <a href="#" id="historicalFigures">Historical Figures</a>
          <a href="#" id="culturalStories">Cultural Stories</a>
          <a href="#" id="diasporaMap">Diaspora Map</a>
        </div>
        
        <div className="nav-section">
          <h3>About</h3>
          <Link href="/about"><a>About GriotBot</a></Link>
          <Link href="/feedback"><a className="active">Share Feedback</a></Link>
        </div>
        
        <div className="sidebar-footer">
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>

      {/* CHAT CONTAINER - Using the same structure as index.js */}
      <main id="chat-container" aria-label="Feedback form">
        <div className="feedback-wrapper" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem', textAlign: 'center' }}>
          <h1 className="welcome-title">We'd Love Your Feedback</h1>
          <p className="welcome-subtitle">GriotBot is growing, and your voice helps shape the journey.</p>

          <div className="message bot" style={{ alignSelf: 'center', margin: '2rem 0', textAlign: 'left' }}>
            <div className="bot-header">
              <span className="logo-icon" aria-hidden="true">🌿</span>
              <span className="bot-name">GriotBot</span>
            </div>
            <p>
              Your thoughts and suggestions are invaluable in helping us improve GriotBot.
              We're committed to creating an AI assistant that truly honors the griot tradition
              and serves the community with wisdom, respect, and cultural authenticity.
            </p>
            <p>
              Thank you for taking the time to share your experience with us!
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'var(--card-bg, white)', 
            borderRadius: 'var(--radius-lg, 12px)', 
            boxShadow: 'var(--shadow-color, rgba(0,0,0,0.1)) 0 4px 12px',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdTfuVK9qk0lfin5xMfTQoakoZOPrcbrCQTswt3oDSTyp4i0w/viewform?embedded=true"
              style={{
                width: '100%',
                height: '600px',
                border: 'none',
              }}
              loading="lazy"
              title="GriotBot Feedback Form"
            >Loading…</iframe>
          </div>

          <Link href="/">
            <a className="suggestion-card" style={{ 
              display: 'inline-block', 
              maxWidth: '300px',
              textAlign: 'center'
            }}>
              <div className="suggestion-category">Return to</div>
              <h3 className="suggestion-title">Chat with GriotBot</h3>
            </a>
          </Link>
        </div>
      </main>

      {/* PROVERB & COPYRIGHT */}
      <div id="fact" aria-label="Random proverb">
        "A bird will always use another bird's feathers to feather its nest." — Ashanti Proverb
      </div>
      <div id="copyright" aria-label="Copyright information">
        © {new Date().getFullYear()} GriotBot. All rights reserved.
      </div>
    </>
  );
}
