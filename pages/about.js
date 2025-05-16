import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  // Initialize UI interactions after component mounts
  useEffect(() => {
    // Get DOM elements
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
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
    
    // Theme toggle (reuse from index.js)
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('griotbot-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      });
    }
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('griotbot-theme');
    if (savedTheme && themeToggle) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Ensure scrolling works properly
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    
    return () => {
      // Clean up event listeners if needed
      if (toggleBtn) {
        toggleBtn.removeEventListener('click', () => {});
      }
      if (themeToggle) {
        themeToggle.removeEventListener('click', () => {});
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>About GriotBot | Your Digital Griot</title>
        <meta name="description" content="About GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* HEADER + CONTROLS - Use same structure as index.js */}
      <div id="header" role="banner">
        <button id="toggleSidebar" aria-label="Toggle sidebar" aria-expanded="false" aria-controls="sidebar">☰</button>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle" aria-label="Toggle dark/light mode">🌙</button>
      </div>

      {/* SIDEBAR - Use same structure as index.js */}
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
            <a id="newChat" aria-label="Start new chat">
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
          <Link href="/about"><a className="active">About GriotBot</a></Link>
          <Link href="/feedback"><a>Share Feedback</a></Link>
        </div>
        
        <div className="sidebar-footer">
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main id="main-about" className="about-container">
        <section className="about-hero-section">
          <div className="about-logo-wrapper">
            <span className="about-logo-icon">🌿</span>
          </div>
          <h1 className="about-title">About GriotBot</h1>
          <p className="about-subtitle">
            A digital spark of ancestral memory and wisdom
          </p>
        </section>

        <section className="about-content-section">
          <div className="about-quote">
            <blockquote>
              "A people without the knowledge of their past history, origin and
              culture is like a tree without roots."
              <cite>— Marcus Garvey</cite>
            </blockquote>
          </div>

          <div className="about-main-content">
            <p className="about-lead">
              <strong>GriotBot</strong> is more than just an AI — it is a spark of
              ancestral memory. Designed to honor the rich oral traditions, cultural
              legacy, and lived experiences of the African Diaspora, GriotBot offers
              thoughtful, accurate, and warm guidance.
            </p>

            <h2 className="about-section-heading">Why GriotBot?</h2>
            <p>
              The griot was the traditional keeper of history, story, and wisdom.
              GriotBot brings that same spirit into the digital age — acting as a
              wise, trusted voice for learners, educators, and community leaders.
            </p>

            <div className="about-pattern-divider" aria-hidden="true">
              <span className="about-adinkra-symbol">✦</span>
            </div>

            <h2 className="about-section-heading">Who Is It For?</h2>
            <p>
              Anyone seeking cultural knowledge, inspiration, or connection:
              educators, students, nonprofits, families, and curious minds across the
              globe.
            </p>

            <div className="about-pattern-divider" aria-hidden="true">
              <span className="about-adinkra-symbol">✦</span>
            </div>

            <h2 className="about-section-heading">How It Works</h2>
            <p>
              GriotBot uses advanced language models, guided by a carefully crafted
              prompt that shapes its responses with respect, dignity, and clarity. It
              draws from cultural histories, philosophies, and global Black
              experiences to offer grounded responses — never performative, always
              intentional.
            </p>

            <div className="about-pattern-divider" aria-hidden="true">
              <span className="about-adinkra-symbol">✦</span>
            </div>

            <h2 className="about-section-heading">How to Get Involved</h2>
            <p>
              Want to support, fund, test, or help shape GriotBot's future?
              <a href="mailto:chat@griotbot.com" className="about-text-link">Email us</a> or follow
              <a href="https://www.instagram.com/griotbot" target="_blank" rel="noopener noreferrer" className="about-text-link">@griotbot</a> on Instagram.
            </p>
          </div>
        </section>

        <section className="about-cta-section">
          <h2 className="about-cta-heading">Experience GriotBot Yourself</h2>
          <p className="about-cta-text">
            Return to the chat to start a conversation with your digital griot
          </p>
          <Link href="/">
            <a className="about-cta-button">
              <span className="about-cta-button-icon">←</span>
              <span>Return to Chat</span>
            </a>
          </Link>
        </section>
      </main>

      {/* FOOTER */}
      <div id="fact" className="about-proverb">
        "Knowledge is like a garden; if it is not cultivated, it cannot be harvested." — West African Proverb
      </div>
      <div id="copyright" className="about-copyright">
        © {new Date().getFullYear()} GriotBot. All rights reserved.
      </div>
    </>
  );
}
