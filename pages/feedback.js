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
    const newChatBtn = document.getElementById('newChat');

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
    
    // Handle new chat button if it exists
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        window.location.href = '/';
      });
    }
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
      
      {/* HEADER WITH HAMBURGER AND BACK BUTTON ON LEFT SIDE */}
      <div id="header" role="banner">
        <div className="left-controls">
          <button id="toggleSidebar" aria-label="Toggle sidebar" aria-expanded="false" aria-controls="sidebar">☰</button>
          
          <div className="backButton">
            <Link href="/">
              <a aria-label="Back to chat">
                <span className="backCircle">
                  <span className="backIcon">&lt;</span>
                </span>
                <span className="hoverText">Back to Chat</span>
              </a>
            </Link>
          </div>
        </div>
        
        <button id="themeToggle" aria-label="Toggle dark/light mode"></button>
      </div>

      {/* SIDEBAR - Identical to index.js */}
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
          <button id="newChat" aria-label="Start new chat">
            <span aria-hidden="true">+</span> New Chat
          </button>
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

      <div className="content-container">
        <main className="content-wrapper">
          <h1 className="page-title">We'd Love Your Feedback</h1>
          
          <p className="page-subtitle">
            GriotBot is growing, and your voice helps shape the journey.
          </p>
          
          <div className="form-container">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdTfuVK9qk0lfin5xMfTQoakoZOPrcbrCQTswt3oDSTyp4i0w/viewform?embedded=true"
              loading="lazy"
              title="GriotBot Feedback Form"
            >Loading…</iframe>
          </div>
        </main>
      </div>

      {/* RANDOM PROVERB & COPYRIGHT */}
      <div id="fact" aria-label="Random proverb"></div>
      <div id="copyright">© 2025 GriotBot. All rights reserved.</div>

      <style jsx>{`
        /* CONTENT AREA STYLES */
        .content-container {
          height: calc(100vh - 160px);
          overflow-y: auto;
          background-color: var(--bg-color);
          color: var(--text-color);
          padding: 1.5rem;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-color) var(--bg-color);
        }
        
        .content-wrapper {
          max-width: 800px;
          margin: 0 auto;
          padding: 1.5rem;
          font-family: var(--body-font);
          text-align: center;
        }
        
        .page-title {
          color: var(--text-color);
          font-family: var(--heading-font);
          font-size: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .page-subtitle {
          margin-bottom: 2rem;
          font-size: 1.1rem;
          color: var(--text-color);
          opacity: 0.9;
        }
        
        .form-container {
          background: var(--card-bg);
          border-radius: 12px;
          box-shadow: 0 4px 15px var(--shadow-color);
          overflow: hidden;
          margin-bottom: 2rem;
          border: 1px solid var(--input-border);
        }
        
        .form-container iframe {
          width: 100%;
          height: 60vh;
          border: none;
          background-color: #f8f5f0;
        }
        
        /* HEADER STYLES */
        #header {
          position: relative;
          background-color: var(--header-bg);
          color: var(--header-text);
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between; /* Changed to space-between */
          box-shadow: 0 2px 10px var(--shadow-color);
          z-index: 100;
          transition: background-color 0.3s;
          font-family: var(--heading-font);
        }
        
        .left-controls {
          display: flex;
          align-items: center;
          gap: 1.5rem; /* Increased spacing between hamburger and back button */
          padding-left: 0.5rem; /* Add some padding on the left */
        }
        
        #toggleSidebar {
          font-size: 1.5rem;
          color: var(--header-text);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          min-width: 40px; /* Ensure minimum width */
          border-radius: 6px;
          transition: transform 0.3s ease;
        }
        
        #toggleSidebar[aria-expanded="true"] {
          transform: rotate(45deg);
        }
        
        #themeToggle {
          font-size: 1.5rem;
          color: var(--header-text);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
        }
        
        /* BACK BUTTON STYLES */
        .backButton {
          display: flex;
          align-items: center;
          position: relative; /* Ensure proper positioning */
          min-width: 40px; /* Ensure minimum width */
        }
        
        .backButton a {
          color: var(--header-text);
          display: flex;
          align-items: center;
          text-decoration: none;
          position: relative;
        }
        
        .backCircle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          transition: background-color 0.2s ease;
        }
        
        .backIcon {
          font-size: 1rem;
          font-weight: bold;
        }
        
        .backButton a:hover .backCircle {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .backButton .hoverText {
          position: absolute;
          left: 35px;
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.2s, transform 0.2s;
          font-size: 0.9rem;
          white-space: nowrap;
        }
        
        .backButton a:hover .hoverText {
          opacity: 1;
          transform: translateX(0);
        }
        
        /* SIDEBAR STYLES - IDENTICAL TO INDEX.JS */
        #sidebar {
          position: fixed;
          top: 0; left: 0;
          height: 100%;
          width: 280px;
          background: var(--sidebar-bg);
          color: var(--sidebar-text);
          padding: 1.5rem;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out, background 0.3s;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 4px 0 20px var(--shadow-color);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        #sidebar.visible {
          transform: translateX(0);
        }
        
        #sidebar h2 {
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--heading-font);
        }
        
        .nav-section {
          margin-bottom: 1rem;
        }
        
        .nav-section h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }
        
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
        
        #sidebar button {
          color: var(--sidebar-text);
          display: flex;
          width: 100%;
          text-align: left;
          margin-bottom: 0.5rem;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background-color 0.2s;
        }
        
        #sidebar button:hover {
          background-color: rgba(255,255,255,0.1);
        }
        
        .sidebar-footer {
          margin-top: auto;
          font-size: 0.8rem;
          opacity: 0.7;
          text-align: center;
          font-style: italic;
          font-family: var(--quote-font);
        }
        
        .sidebar-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .free-badge {
          background-color: var(--accent-color);
          color: white;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          margin-top: 0.5rem;
        }
        
        .upgrade-btn {
          background-color: var(--accent-color);
          color: white;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          margin-top: 1rem;
          text-align: center;
          font-weight: 500;
          width: 100%;
          transition: background-color 0.2s;
        }
        
        .upgrade-btn:hover {
          background-color: var(--accent-hover);
        }
        
        /* FOOTER STYLES */
        #fact {
          position: fixed;
          bottom: 30px;
          width: 100%;
          text-align: center;
          font-size: 0.9rem;
          font-style: italic;
          padding: 0 1rem;
          color: var(--wisdom-color);
          transition: color 0.3s;
          opacity: 0.9;
          font-family: var(--quote-font);
          pointer-events: none;
        }
        
        #copyright {
          position: fixed;
          bottom: 10px;
          width: 100%;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-color);
          opacity: 0.6;
          transition: color 0.3s;
          pointer-events: none;
        }
        
        /* CUSTOM SCROLLBAR */
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
        
        /* DARK MODE TEXT CONTRAST FIX */
        [data-theme="dark"] .page-title,
        [data-theme="dark"] .page-subtitle {
          color: var(--sidebar-text);
        }
        
        /* MOBILE RESPONSIVENESS */
        @media (max-width: 600px) {
          .page-title {
            font-size: 1.8rem;
          }
          
          .form-container iframe {
            height: 50vh;
          }
          
          .backButton .hoverText {
            display: none;
          }
          
          .left-controls {
            gap: 1rem; /* Slightly reduce gap on mobile */
          }
        }
      `}</style>
    </>
  );
}
