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
    
    // Handle theme toggle
    if (themeToggle) {
      const handleThemeToggle = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('griotbot-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      };
      
      themeToggle.addEventListener('click', handleThemeToggle);
      
      // Initialize theme
      const savedTheme = localStorage.getItem('griotbot-theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
      }
    }
    
    // Fix for scrolling - IMPORTANT!
    document.body.style.overflow = 'auto';
    document.getElementById('chat-container')?.style.overflow = 'auto';
    document.getElementById('about-main-content')?.style.overflow = 'auto';
    
    // Clear any height restrictions
    document.getElementById('chat-container')?.style.height = 'auto';
    
    return () => {
      // Clean up event listeners
      if (toggleBtn && sidebar) {
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
        <style jsx global>{`
          /* Override any problematic styles */
          body, html {
            height: auto !important;
            overflow: auto !important;
          }
          #chat-container {
            height: auto !important;
            overflow: auto !important;
            position: relative !important;
            padding-bottom: 20px !important;
          }
        `}</style>
      </Head>

      {/* HEADER */}
      <div id="header" role="banner">
        <button id="toggleSidebar" aria-label="Toggle sidebar" aria-expanded="false" aria-controls="sidebar">☰</button>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle" aria-label="Toggle dark/light mode">🌙</button>
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
          <Link href="/about"><a>About GriotBot</a></Link>
          <Link href="/feedback"><a>Share Feedback</a></Link>
        </div>
        
        <div className="sidebar-footer">
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>
      
      {/* MAIN CONTENT */}
      <div id="chat-container" style={{ overflow: 'auto', height: 'auto', position: 'relative' }}>
        <div id="about-main-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ 
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #7d8765, #5e6e4f)',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '40px', color: 'white' }}>🌿</span>
            </div>
            
            <h1 style={{ 
              color: '#d7722c', 
              fontSize: '2.5rem',
              marginBottom: '10px',
              fontFamily: 'var(--heading-font, "Lora", serif)'
            }}>About GriotBot</h1>
            
            <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
              A digital spark of ancestral memory and wisdom
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: 'rgba(125, 135, 101, 0.1)',
            borderLeft: '4px solid #7d8765',
            padding: '24px',
            margin: '32px 0',
            borderRadius: '0 8px 8px 0'
          }}>
            <blockquote style={{ 
              fontStyle: 'italic',
              margin: 0,
              fontSize: '1.2rem',
              color: '#6b4226',
              lineHeight: 1.7,
              fontFamily: 'var(--quote-font, "Lora", serif)'
            }}>
              "A people without the knowledge of their past history, origin and
              culture is like a tree without roots."
              <cite style={{ display: 'block', marginTop: '10px', fontStyle: 'normal' }}>— Marcus Garvey</cite>
            </blockquote>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              <strong>GriotBot</strong> is more than just an AI — it is a spark of
              ancestral memory. Designed to honor the rich oral traditions, cultural
              legacy, and lived experiences of the African Diaspora, GriotBot offers
              thoughtful, accurate, and warm guidance.
            </p>
          </div>
          
          <h2 style={{ 
            color: '#d7722c',
            fontSize: '1.5rem',
            marginTop: '30px',
            marginBottom: '15px',
            fontFamily: 'var(--heading-font, "Lora", serif)'
          }}>Why GriotBot?</h2>
          
          <p>
            The griot was the traditional keeper of history, story, and wisdom.
            GriotBot brings that same spirit into the digital age — acting as a
            wise, trusted voice for learners, educators, and community leaders.
          </p>
          
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            margin: '30px 0',
            gap: '15px'
          }}>
            <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
            <span style={{ color: '#c49a6c', fontSize: '20px' }}>✦</span>
            <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
          </div>
          
          <h2 style={{ 
            color: '#d7722c',
            fontSize: '1.5rem',
            marginTop: '30px',
            marginBottom: '15px',
            fontFamily: 'var(--heading-font, "Lora", serif)'
          }}>Who Is It For?</h2>
          
          <p>
            Anyone seeking cultural knowledge, inspiration, or connection:
            educators, students, nonprofits, families, and curious minds across the
            globe.
          </p>
          
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            margin: '30px 0',
            gap: '15px'
          }}>
            <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
            <span style={{ color: '#c49a6c', fontSize: '20px' }}>✦</span>
            <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
          </div>
          
          <h2 style={{ 
            color: '#d7722c',
            fontSize: '1.5rem',
            marginTop: '30px',
            marginBottom: '15px',
            fontFamily: 'var(--heading-font, "Lora", serif)'
          }}>How It Works</h2>
          
          <p>
            GriotBot uses advanced language models, guided by a carefully crafted
            prompt that shapes its responses with respect, dignity, and clarity. It
            draws from cultural histories, philosophies, and global Black
            experiences to offer grounded responses — never performative, always
            intentional.
          </p>
          
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            margin: '30px 0',
            gap: '15px'
          }}>
            <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
            <span style={{ color: '#c49a6c', fontSize: '20px' }}>✦</span>
            <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
          </div>
          
          <h2 style={{ 
            color: '#d7722c',
            fontSize: '1.5rem',
            marginTop: '30px',
            marginBottom: '15px',
            fontFamily: 'var(--heading-font, "Lora", serif)'
          }}>How to Get Involved</h2>
          
          <p>
            Want to support, fund, test, or help shape GriotBot's future?
            <a href="mailto:chat@griotbot.com" style={{ color: '#d7722c', margin: '0 5px' }}>Email us</a> or follow
            <a href="https://www.instagram.com/griotbot" style={{ color: '#d7722c', margin: '0 5px' }} target="_blank" rel="noopener noreferrer">@griotbot</a> on Instagram.
          </p>
          
          <div style={{ 
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '40px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(75, 46, 42, 0.15)',
            margin: '50px 0 30px'
          }}>
            <h2 style={{ 
              color: '#d7722c',
              fontSize: '1.8rem',
              marginBottom: '15px',
              fontFamily: 'var(--heading-font, "Lora", serif)'
            }}>Experience GriotBot Yourself</h2>
            
            <p style={{ marginBottom: '25px', fontSize: '1.1rem' }}>
              Return to the chat to start a conversation with your digital griot
            </p>
            
            <Link href="/">
              <a style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#d7722c',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 500
              }}>
                <span style={{ marginRight: '8px' }}>←</span>
                Return to Chat
              </a>
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <div id="fact" style={{ 
          textAlign: 'center',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          color: '#6b4226',
          fontFamily: 'var(--quote-font, "Lora", serif)',
          margin: '20px 0 5px'
        }}>
          "Knowledge is like a garden; if it is not cultivated, it cannot be harvested." — West African Proverb
        </div>
        
        <div id="copyright" style={{ 
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#33302e',
          opacity: 0.6,
          marginBottom: '20px'
        }}>
          © {new Date().getFullYear()} GriotBot. All rights reserved.
        </div>
      </div>
    </>
  );
}
