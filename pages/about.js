import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  // Theme and sidebar initialization
  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('griotbot-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      
      // Update theme toggle button if needed
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
      }
    }
    
    // Setup sidebar toggle close functionality
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('visible') && 
          !sidebar.contains(event.target) && 
          !event.target.closest('button[aria-label="Toggle menu"]')) {
        sidebar.classList.remove('visible');
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Header component
  const Header = () => (
    <header style={{
      backgroundColor: 'var(--header-bg)',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <button 
        onClick={() => {
          const sidebar = document.getElementById('sidebar');
          if (sidebar) sidebar.classList.toggle('visible');
        }}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: 'var(--header-text)'
        }}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: 'bold',
        fontSize: '1.2rem'
      }}>
        <span style={{ fontSize: '1.5rem' }}>🌿</span>
        <span>GriotBot</span>
      </div>
      
      <button 
        id="themeToggle"
        onClick={() => {
          const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('griotbot-theme', newTheme);
          
          // Update button text
          const themeToggle = document.getElementById('themeToggle');
          if (themeToggle) {
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
          }
        }}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: 'var(--header-text)'
        }}
        aria-label="Toggle theme"
      >
        🌙
      </button>
    </header>
  );

  // Sidebar component
  const Sidebar = () => (
    <nav id="sidebar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: '280px',
      backgroundColor: 'rgba(75, 46, 42, 0.97)',
      color: '#f8f5f0',
      padding: '1.5rem',
      transform: 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out',
      boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      overflowY: 'auto'
    }}>
      <style jsx>{`
        #sidebar.visible {
          transform: translateX(0);
        }
      `}</style>
      
      <h2 style={{
        margin: '0 0 1rem 0',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'Lora, serif'
      }}>
        <span style={{ fontSize: '1.5rem' }}>🌿</span>
        GriotBot
      </h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <span style={{
          backgroundColor: '#d7722c',
          color: 'white',
          padding: '3px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          marginTop: '0.5rem'
        }}>
          Free Account
        </span>
        <button style={{
          backgroundColor: '#d7722c',
          color: 'white',
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          marginTop: '1rem',
          textAlign: 'center',
          fontWeight: 500,
          width: '100%',
          border: 'none',
          cursor: 'pointer'
        }}>
          Upgrade to Premium
        </button>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.5rem',
          opacity: 0.8
        }}>
          Conversations
        </h3>
        <Link href="/">
          <a style={{
            color: '#f8f5f0',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>+</span> 
            New Chat
          </a>
        </Link>
        <a href="#" style={{
          color: '#f8f5f0',
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '6px',
          display: 'block',
          marginBottom: '0.5rem'
        }}>
          Saved Conversations
        </a>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.5rem',
          opacity: 0.8
        }}>
          Explore
        </h3>
        <a href="#" style={{
          color: '#f8f5f0',
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '6px',
          display: 'block',
          marginBottom: '0.5rem'
        }}>
          Historical Figures
        </a>
        <a href="#" style={{
          color: '#f8f5f0',
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '6px',
          display: 'block',
          marginBottom: '0.5rem'
        }}>
          Cultural Stories
        </a>
        <a href="#" style={{
          color: '#f8f5f0',
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '6px',
          display: 'block',
          marginBottom: '0.5rem'
        }}>
          Diaspora Map
        </a>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.5rem',
          opacity: 0.8
        }}>
          About
        </h3>
        <Link href="/about">
          <a style={{
            color: '#f8f5f0',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            display: 'block',
            marginBottom: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}>
            About GriotBot
          </a>
        </Link>
        <Link href="/feedback">
          <a style={{
            color: '#f8f5f0',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Share Feedback
          </a>
        </Link>
      </div>
      
      <div style={{
        marginTop: 'auto',
        fontSize: '0.8rem',
        opacity: 0.7,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: 'Lora, serif'
      }}>
        "Preserving our stories,<br/>empowering our future."
      </div>
    </nav>
  );

  // Footer component
  const Footer = () => {
    // Array of proverbs to randomly select from
    const proverbs = [
      "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
      "Until the lion learns to write, every story will glorify the hunter. — African Proverb",
      "A tree cannot stand without its roots. — Jamaican Proverb",
      "Unity is strength, division is weakness. — Swahili Proverb",
      "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
      "A bird will always use another bird's feathers to feather its nest. — Ashanti Proverb"
    ];
    
    // Randomly select a proverb (or use a specific one if you prefer)
    const randomProverb = proverbs[Math.floor(Math.random() * proverbs.length)];
    
    return (
      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        marginTop: '2rem',
        borderTop: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontStyle: 'italic', 
          marginBottom: '0.5rem', 
          color: 'var(--wisdom-color)' 
        }}>
          {randomProverb}
        </div>
        <div style={{ 
          fontSize: '0.8rem', 
          opacity: 0.6 
        }}>
          © {new Date().getFullYear()} GriotBot. All rights reserved.
        </div>
      </footer>
    );
  };

  return (
    <>
      <Head>
        <title>About GriotBot</title>
        <meta name="description" content="About GriotBot - An AI-powered digital griot" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />
      <Sidebar />

      {/* Content area */}
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem 4rem',
        color: 'var(--text-color)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #7d8765, #5e6e4f)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '2.5rem', color: 'white' }}>🌿</span>
          </div>
          <h1 style={{
            color: 'var(--accent-color)',
            fontSize: '2rem',
            marginBottom: '0.5rem'
          }}>About GriotBot</h1>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: 0.8 
          }}>
            A digital spark of ancestral memory and wisdom
          </p>
        </div>

        <blockquote style={{
          fontStyle: 'italic',
          borderLeft: '4px solid #7d8765',
          padding: '1.5rem',
          backgroundColor: 'rgba(125, 135, 101, 0.1)',
          borderRadius: '0 8px 8px 0',
          margin: '2rem 0'
        }}>
          "A people without the knowledge of their past history, origin and
          culture is like a tree without roots."
          <cite style={{ display: 'block', marginTop: '0.5rem' }}>— Marcus Garvey</cite>
        </blockquote>

        <p style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
          <strong>GriotBot</strong> is more than just an AI — it is a spark of
          ancestral memory. Designed to honor the rich oral traditions, cultural
          legacy, and lived experiences of the African Diaspora, GriotBot offers
          thoughtful, accurate, and warm guidance.
        </p>

        <h2 style={{ 
          color: 'var(--accent-color)', 
          fontSize: '1.5rem',
          marginTop: '2rem',
          marginBottom: '1rem' 
        }}>Why GriotBot?</h2>
        <p style={{ lineHeight: 1.6 }}>
          The griot was the traditional keeper of history, story, and wisdom.
          GriotBot brings that same spirit into the digital age — acting as a
          wise, trusted voice for learners, educators, and community leaders.
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '1.5rem 0',
          gap: '15px' 
        }}>
          <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
          <span style={{ color: '#c49a6c' }}>✦</span>
          <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
        </div>

        <h2 style={{ 
          color: 'var(--accent-color)', 
          fontSize: '1.5rem',
          marginTop: '1.5rem',
          marginBottom: '1rem' 
        }}>Who Is It For?</h2>
        <p style={{ lineHeight: 1.6 }}>
          Anyone seeking cultural knowledge, inspiration, or connection:
          educators, students, nonprofits, families, and curious minds across the
          globe.
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '1.5rem 0',
          gap: '15px' 
        }}>
          <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
          <span style={{ color: '#c49a6c' }}>✦</span>
          <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
        </div>

        <h2 style={{ 
          color: 'var(--accent-color)', 
          fontSize: '1.5rem',
          marginTop: '1.5rem',
          marginBottom: '1rem' 
        }}>How It Works</h2>
        <p style={{ lineHeight: 1.6 }}>
          GriotBot uses advanced language models, guided by a carefully crafted
          prompt that shapes its responses with respect, dignity, and clarity. It
          draws from cultural histories, philosophies, and global Black
          experiences to offer grounded responses — never performative, always
          intentional.
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '1.5rem 0',
          gap: '15px' 
        }}>
          <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
          <span style={{ color: '#c49a6c' }}>✦</span>
          <div style={{ height: '1px', background: 'rgba(196, 154, 108, 0.3)', flexGrow: 1 }}></div>
        </div>

        <h2 style={{ 
          color: 'var(--accent-color)', 
          fontSize: '1.5rem',
          marginTop: '1.5rem',
          marginBottom: '1rem' 
        }}>How to Get Involved</h2>
        <p style={{ lineHeight: 1.6 }}>
          Want to support, fund, test, or help shape GriotBot's future?
          <a href="mailto:chat@griotbot.com" style={{ color: 'var(--accent-color)', margin: '0 5px' }}>Email us</a> or follow
          <a href="https://www.instagram.com/griotbot" style={{ color: 'var(--accent-color)', margin: '0 5px' }} target="_blank" rel="noopener noreferrer">@griotbot</a> on Instagram.
        </p>

        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          margin: '3rem 0'
        }}>
          <h2 style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginBottom: '1rem' }}>Experience GriotBot Yourself</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Return to the chat to start a conversation with your digital griot
          </p>
          
          <Link href="/">
            <a style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 500
            }}>
              <span style={{ marginRight: '8px' }}>←</span>
              Return to Chat
            </a>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
