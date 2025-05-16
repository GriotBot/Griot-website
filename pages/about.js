import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Ensure proper scrolling
  useEffect(() => {
    document.body.style.overflow = sidebarVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarVisible]);

  return (
    <div className="about-wrapper">
      <Head>
        <title>About GriotBot | Your Digital Griot</title>
        <meta name="description" content="About GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header id="header" role="banner">
        <button id="toggleSidebar" onClick={toggleSidebar} aria-label="Toggle sidebar" aria-expanded={sidebarVisible}>
          ☰
        </button>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle" aria-label="Toggle dark/light mode">🌙</button>
      </header>

      {/* Sidebar */}
      <div id="sidebar" className={sidebarVisible ? 'visible' : ''} aria-hidden={!sidebarVisible}>
        <h2>
          <span className="logo-icon" aria-hidden="true">🌿</span>
          GriotBot
        </h2>
        
        <div className="nav-section">
          <h3>Conversations</h3>
          <Link href="/">
            <a><span aria-hidden="true">+</span> New Chat</a>
          </Link>
          <a href="#">Saved Conversations</a>
        </div>
        
        <div className="nav-section">
          <h3>Explore</h3>
          <a href="#">Historical Figures</a>
          <a href="#">Cultural Stories</a>
          <a href="#">Diaspora Map</a>
        </div>
        
        <div className="nav-section">
          <h3>About</h3>
          <Link href="/about"><a className="active">About GriotBot</a></Link>
          <Link href="/feedback"><a>Share Feedback</a></Link>
        </div>
        
        <div className="sidebar-footer">
          "Preserving our stories,<br/>empowering our future."
        </div>
      </div>

      <main id="about-container">
        <section className="hero-section">
          <div className="logo-wrapper">
            <span className="hero-logo">🌿</span>
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

          <div className="main-content">
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

            <div className="pattern-divider" aria-hidden="true">
              <span className="adinkra-symbol">✦</span>
            </div>

            <h2 className="section-heading">Who Is It For?</h2>
            <p>
              Anyone seeking cultural knowledge, inspiration, or connection:
              educators, students, nonprofits, families, and curious minds across the
              globe.
            </p>

            <div className="pattern-divider" aria-hidden="true">
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

            <div className="pattern-divider" aria-hidden="true">
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
      </main>

      <footer id="footer">
        <div id="fact" className="proverb">
          "Knowledge is like a garden; if it is not cultivated, it cannot be harvested." — West African Proverb
        </div>
        <div id="copyright" className="copyright">
          © {new Date().getFullYear()} GriotBot. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
