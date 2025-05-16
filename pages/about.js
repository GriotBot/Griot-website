import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Ensure page is properly configured for scrolling
  useEffect(() => {
    // Reset any overflow restrictions on mount
    document.body.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="about-page-wrapper">
      <Head>
        <title>About GriotBot | Your Digital Griot</title>
        <meta name="description" content="About GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style jsx global>{`
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Montserrat', sans-serif;
            background-color: #f8f5f0;
            color: #33302e;
            line-height: 1.6;
            overflow-x: hidden;
            overflow-y: auto;
          }
        `}</style>
      </Head>

      {/* Header */}
      <header className="header">
        <button 
          className="menu-toggle" 
          onClick={toggleSidebar} 
          aria-label="Toggle menu"
          aria-expanded={sidebarVisible}
        >
          ☰
        </button>
        <div className="logo-container">
          <span className="logo-icon">🌿</span>
          <span className="logo-text">GriotBot</span>
        </div>
        <button className="theme-toggle" aria-label="Toggle dark/light mode">
          🌙
        </button>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
        <div className="sidebar-header">
          <span className="logo-icon">🌿</span>
          <span>GriotBot</span>
          <button className="close-sidebar" onClick={toggleSidebar}>✕</button>
        </div>
        
        <div className="sidebar-section">
          <h3>Conversations</h3>
          <a href="/" className="sidebar-link">
            <span>+</span> New Chat
          </a>
          <a href="#" className="sidebar-link">Saved Conversations</a>
        </div>
        
        <div className="sidebar-section">
          <h3>Explore</h3>
          <a href="#" className="sidebar-link">Historical Figures</a>
          <a href="#" className="sidebar-link">Cultural Stories</a>
          <a href="#" className="sidebar-link">Diaspora Map</a>
        </div>
        
        <div className="sidebar-section">
          <h3>About</h3>
          <a href="/about" className="sidebar-link active">About GriotBot</a>
          <a href="/feedback" className="sidebar-link">Share Feedback</a>
        </div>
        
        <div className="sidebar-footer">
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <div className="about-container">
          <section className="hero-section">
            <div className="logo-wrapper">
              <span className="logo-icon logo-large">🌿</span>
            </div>
            <h1 className="title">About GriotBot</h1>
            <p className="subtitle">
              A digital spark of ancestral memory and wisdom
            </p>
          </section>

          <section className="content-section">
            <div className="quote">
              <blockquote>
                "A people without the knowledge of their past history, origin and
                culture is like a tree without roots."
                <cite>— Marcus Garvey</cite>
              </blockquote>
            </div>

            <div className="main-content-text">
              <p className="lead">
                <strong>GriotBot</strong> is more than just an AI — it is a spark of
                ancestral memory. Designed to honor the rich oral traditions, cultural
                legacy, and lived experiences of the African Diaspora, GriotBot offers
                thoughtful, accurate, and warm guidance.
              </p>

              <h2 className="section-heading">Why GriotBot?</h2>
              <p>
                The griot was the traditional keeper of history, story, and wisdom.
                GriotBot brings that same spirit into the digital age — acting as a
                wise, trusted voice for learners, educators, and community leaders.
              </p>

              <div className="pattern-divider">
                <span className="adinkra-symbol">✦</span>
              </div>

              <h2 className="section-heading">Who Is It For?</h2>
              <p>
                Anyone seeking cultural knowledge, inspiration, or connection:
                educators, students, nonprofits, families, and curious minds across the
                globe.
              </p>

              <div className="pattern-divider">
                <span className="adinkra-symbol">✦</span>
              </div>

              <h2 className="section-heading">How It Works</h2>
              <p>
                GriotBot uses advanced language models, guided by a carefully crafted
                prompt that shapes its responses with respect, dignity, and clarity. It
                draws from cultural histories, philosophies, and global Black
                experiences to offer grounded responses — never performative, always
                intentional.
              </p>

              <div className="pattern-divider">
                <span className="adinkra-symbol">✦</span>
              </div>

              <h2 className="section-heading">How to Get Involved</h2>
              <p>
                Want to support, fund, test, or help shape GriotBot's future?
                <a href="mailto:chat@griotbot.com" className="text-link">Email us</a> or follow
                <a href="https://www.instagram.com/griotbot" target="_blank" rel="noopener noreferrer" className="text-link">@griotbot</a> on Instagram.
              </p>
            </div>
          </section>

          <section className="cta-section">
            <h2 className="cta-heading">Experience GriotBot Yourself</h2>
            <p className="cta-text">
              Return to the chat to start a conversation with your digital griot
            </p>
            <Link href="/">
              <a className="cta-button">
                <span className="cta-button-icon">←</span>
                <span>Return to Chat</span>
              </a>
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="proverb">
          "Knowledge is like a garden; if it is not cultivated, it cannot be harvested." — West African Proverb
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} GriotBot. All rights reserved.
        </div>
      </footer>

      {/* Inline styles to ensure everything works */}
      <style jsx>{`
        .about-page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        /* Header styles */
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: #c49a6c;
          color: #33302e;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          box-shadow: 0 2px 10px rgba(75, 46, 42, 0.15);
        }

        .menu-toggle, .theme-toggle {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          color: #33302e;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: bold;
          font-size: 1.2rem;
          font-family: 'Lora', serif;
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        /* Sidebar styles */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 280px;
          background: rgba(75, 46, 42, 0.97);
          color: #f8f5f0;
          padding: 1.5rem;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 4px 0 20px rgba(75, 46, 42, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow-y: auto;
        }

        .sidebar.visible {
          transform: translateX(0);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          font-weight: bold;
          font-size: 1.2rem;
        }

        .close-sidebar {
          margin-left: auto;
          background: none;
          border: none;
          color: #f8f5f0;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .sidebar-section {
          margin-bottom: 1.5rem;
        }

        .sidebar-section h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }

        .sidebar-link {
          color: #f8f5f0;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 6px;
          display: block;
          margin-bottom: 0.5rem;
          transition: background-color 0.2s;
        }

        .sidebar-link:hover, .sidebar-link.active {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .sidebar-footer {
          margin-top: auto;
          font-size: 0.8rem;
          opacity: 0.7;
          text-align: center;
          font-style: italic;
        }

        /* Main content styles */
        .main-content {
          flex: 1;
          width: 100%;
          overflow-y: auto;
          background-color: #f8f5f0;
        }

        .about-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          color: #33302e;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .logo-wrapper {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #7d8765, #5e6e4f);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .logo-large {
          font-size: 2.5rem;
          color: white;
        }

        .title {
          color: #d7722c;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-family: 'Lora', serif;
        }

        .subtitle {
          font-size: 1.2rem;
          opacity: 0.8;
          margin-top: 0;
        }

        .content-section {
          margin-bottom: 3rem;
        }

        .quote {
          background-color: rgba(125, 135, 101, 0.1);
          border-left: 4px solid #7d8765;
          padding: 1.5rem;
          margin: 2rem 0;
          border-radius: 0 8px 8px 0;
        }

        .quote blockquote {
          font-style: italic;
          margin: 0;
          font-size: 1.2rem;
          color: #6b4226;
          line-height: 1.7;
          font-family: 'Lora', serif;
        }

        .quote cite {
          display: block;
          margin-top: 0.5rem;
          font-style: normal;
          font-weight: 500;
        }

        .main-content-text {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .lead {
          font-size: 1.1rem;
          line-height: 1.7;
        }

        .section-heading {
          color: #d7722c;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
          font-weight: 600;
          font-family: 'Lora', serif;
        }

        .pattern-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 1.5rem 0;
          height: 20px;
          position: relative;
        }

        .pattern-divider::before, 
        .pattern-divider::after {
          content: "";
          height: 1px;
          background-color: rgba(196, 154, 108, 0.3);
          flex-grow: 1;
        }

        .adinkra-symbol {
          margin: 0 15px;
          color: #c49a6c;
          font-size: 1.2rem;
        }

        .text-link {
          color: #d7722c;
          text-decoration: none;
          margin: 0 0.3rem;
          position: relative;
          transition: color 0.2s;
        }

        .text-link:hover {
          color: #c86520;
          text-decoration: underline;
        }

        .cta-section {
          text-align: center;
          background-color: #ffffff;
          padding: 2.5rem 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(75, 46, 42, 0.15);
          margin-top: 3rem;
        }

        .cta-heading {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #d7722c;
          font-family: 'Lora', serif;
        }

        .cta-text {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #d7722c;
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.2s, transform 0.2s;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .cta-button:hover {
          background-color: #c86520;
          transform: translateY(-2px);
        }

        .cta-button-icon {
          margin-right: 8px;
        }

        /* Footer styles */
        .footer {
          padding: 1.5rem;
          text-align: center;
          background-color: #f8f5f0;
          border-top: 1px solid rgba(75, 46, 42, 0.1);
        }

        .proverb {
          font-size: 0.9rem;
          font-style: italic;
          margin-bottom: 0.5rem;
          color: #6b4226;
          font-family: 'Lora', serif;
        }

        .copyright {
          font-size: 0.8rem;
          color: #33302e;
          opacity: 0.6;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .sidebar {
            width: 85%;
          }
          
          .about-container {
            padding: 1.5rem 1rem;
          }
          
          .title {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 1rem;
          }
          
          .quote blockquote {
            font-size: 1rem;
          }
          
          .cta-section {
            padding: 2rem 1.5rem;
          }
          
          .cta-heading {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
