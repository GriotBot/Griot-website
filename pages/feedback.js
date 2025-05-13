// File: /pages/feedback.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Feedback() {
  // State to ensure we can access DOM elements after mounting
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Immediately run the initialization code after first render
    if (typeof window !== 'undefined') {
      // We need to wait for the DOM to be ready
      initializePage();
    }
  }, []);

  // Function that initializes page functionality
  function initializePage() {
    // Get DOM elements
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const themeToggle = document.getElementById('themeToggle');
    const factElement = document.getElementById('fact');

    // If any element is missing, return
    if (!sidebar || !toggleBtn || !factElement) {
      console.warn('DOM elements not found, initialization delayed');
      return;
    }

    // 1. SIDEBAR TOGGLE
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

    // 2. THEME TOGGLE
    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('griotbot-theme', theme);
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', 
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    
    // Initialize theme from localStorage or user preference
    (function() {
      const savedTheme = localStorage.getItem('griotbot-theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Check for system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    })();
    
    // Handle theme toggle click
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // 3. RANDOM PROVERB
    const proverbs = [
      "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
      "Until the lion learns to write, every story will glorify the hunter. — African Proverb",
      "We are the drums, we are the dance. — Afro-Caribbean Proverb",
      "A tree cannot stand without its roots. — Jamaican Proverb",
      "Unity is strength, division is weakness. — Swahili Proverb",
      "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
      "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
      "A bird will always use another bird's feathers to feather its nest. — Ashanti Proverb",
      "You must act as if it is impossible to fail. — Yoruba Wisdom",
      "The child who is not embraced by the village will burn it down to feel its warmth. — West African Proverb",
      "However long the night, the dawn will break. — African Proverb",
      "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
      "It takes a village to raise a child. — African Proverb",
      "The fool speaks, the wise listen. — Ethiopian Proverb",
      "When the music changes, so does the dance. — Haitian Proverb"
    ];
    
    function showRandomProverb() {
      const randomIndex = Math.floor(Math.random() * proverbs.length);
      factElement.textContent = proverbs[randomIndex];
      factElement.setAttribute('aria-label', `Proverb: ${proverbs[randomIndex]}`);
    }
    
    showRandomProverb(); // Show proverb on init
  }

  return (
    <>
      <Head>
        <title>GriotBot Feedback</title>
        <meta name="description" content="Provide feedback for GriotBot" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      
      {/* HEADER + CONTROLS */}
      <div id="header" role="banner">
        <button id="toggleSidebar" aria-label="Toggle sidebar" aria-expanded="false" aria-controls="sidebar">☰</button>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle" aria-label="Toggle dark/light mode"></button>
      </div>

      {/* SIDEBAR */}
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
          <Link href="/" passHref>
            <a id="homeLink">
              <span aria-hidden="true">💬</span> Chat
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
          <Link href="/about" passHref>
            <a>About GriotBot</a>
          </Link>
          <Link href="/feedback" passHref>
            <a className="active">Share Feedback</a>
          </Link>
        </div>
        
        <div className="sidebar-footer">
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>

      {/* BACK BUTTON */}
      <div style={{
        position: 'absolute',
        top: '70px',
        left: '20px',
        zIndex: '10'
      }}>
        <Link href="/">
          <a style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--sidebar-text)',
            backgroundColor: 'var(--accent-color)',
            padding: '6px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            boxShadow: '0 2px 4px var(--shadow-color)'
          }}>
            <span style={{ marginRight: '6px' }}>←</span> Back to Chat
          </a>
        </Link>
      </div>

      <div style={{
        height: 'calc(100vh - 160px)',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        padding: '2.5rem 1.5rem 1.5rem',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--accent-color) var(--bg-color)'
      }}>
        <main style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '1.5rem',
          fontFamily: 'var(--body-font)',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: 'var(--bot-bubble-start)',
            fontFamily: 'var(--heading-font)',
            fontSize: '2rem',
            marginBottom: '1rem',
            marginTop: '1.5rem'
          }}>We'd Love Your Feedback</h1>
          
          <p style={{ 
            marginBottom: '2rem',
            fontSize: '1.1rem',
            color: 'var(--text-color)'
          }}>
            GriotBot is growing, and your voice helps shape the journey.
          </p>
          
          <div style={{ 
            background: 'var(--card-bg)',
            borderRadius: '12px',
            boxShadow: '0 3px 10px var(--shadow-color)',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdTfuVK9qk0lfin5xMfTQoakoZOPrcbrCQTswt3oDSTyp4i0w/viewform?embedded=true"
              style={{
                width: '100%',
                height: '60vh',
                border: 'none'
              }}
              loading="lazy"
              title="GriotBot Feedback Form"
            >Loading…</iframe>
          </div>
        </main>
      </div>

      {/* RANDOM PROVERB & COPYRIGHT */}
      <div id="fact" aria-label="Random proverb" style={{
        position: 'fixed',
        bottom: '30px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontStyle: 'italic',
        padding: '0 1rem',
        color: 'var(--wisdom-color)',
        transition: 'color 0.3s',
        opacity: '0.8',
        fontFamily: 'var(--quote-font)',
        pointerEvents: 'none'
      }}></div>

      <div id="copyright" style={{
        position: 'fixed',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: '0.6',
        transition: 'color 0.3s',
        pointerEvents: 'none'
      }}>© 2025 GriotBot. All rights reserved.</div>

      <style jsx>{`
        /* Custom scrollbar for Webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--bg-color);
        }
        
        ::-webkit-scrollbar-thumb {
          background-color: var(--accent-color);
          border-radius: 4px;
          border: 2px solid var(--bg-color);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background-color: var(--accent-hover);
        }
        
        /* Fix for sidebar a elements */
        #sidebar a {
          color: var(--sidebar-text);
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background-color 0.2s;
          display: block;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        #sidebar a:hover {
          background-color: rgba(255,255,255,0.1);
        }
        
        #sidebar a.active {
          background-color: rgba(255,255,255,0.15);
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
