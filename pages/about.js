// File: /pages/about.js - UPDATED WITH CONSISTENT TEMPLATE
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import EnhancedSidebar from '../components/EnhancedSidebar';
import MessageCirclePlus from '../components/icons/MessageCirclePlus';
import { 
  Menu, 
  LogIn, 
  Sun, 
  Moon,
  ArrowLeft
} from 'react-feather';

// PROVERBS ARRAY (same as index)
const PROVERBS = [
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

export default function About() {
  // State management (same as index)
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadPreferences();
    showRandomProverb();
  }, []);

  // Load user preferences
  function loadPreferences() {
    try {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  }

  // Random proverb using React state
  const showRandomProverb = () => {
    const randomIndex = Math.floor(Math.random() * PROVERBS.length);
    setCurrentProverb(PROVERBS[randomIndex]);
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Handle sidebar close
  const handleSidebarClose = () => {
    setSidebarVisible(false);
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>About GriotBot - Your Digital Griot</title>
        <meta name="description" content="Learn about GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon setup */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#c49a6c" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* CRITICAL INLINE STYLES - Same as index */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --header-text: #33302e;
            --sidebar-bg: rgba(75, 46, 42, 0.97);
            --sidebar-text: #f8f5f0;
            --user-bubble: #bd8735;
            --user-text: #f8f5f0;
            --bot-bubble-start: #7d8765;
            --bot-bubble-end: #5e6e4f;
            --bot-text: #f8f5f0;
            --accent-color: #d7722c;
            --accent-hover: #c86520;
            --wisdom-color: #6b4226;
            --input-bg: #ffffff;
            --input-border: rgba(75, 46, 42, 0.2);
            --input-text: #33302e;
            --shadow-color: rgba(75, 46, 42, 0.15);
            --card-bg: #ffffff;
          }
          
          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
            --header-text: #f0ece4;
            --sidebar-bg: rgba(40, 30, 25, 0.97);
            --sidebar-text: #f0ece4;
            --user-bubble: #bb7e41;
            --user-text: #f0ece4;
            --bot-bubble-start: #5e6e4f;
            --bot-bubble-end: #3e4a38;
            --bot-text: #f0ece4;
            --accent-color: #d7722c;
            --accent-hover: #e8833d;
            --wisdom-color: #e0c08f;
            --input-bg: #352e29;
            --input-border: rgba(240, 236, 228, 0.2);
            --input-text: #f0ece4;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --card-bg: #352e29;
          }

          * { box-sizing: border-box; }

          body {
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            height: 100vh;
            transition: background-color 0.3s, color 0.3s;
            line-height: 1.6;
          }

          @keyframes message-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />
      </Head>
      
      {/* HEADER - Same as index */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--header-bg)',
        color: 'var(--header-text)',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 2px 10px var(--shadow-color)',
        zIndex: 1001,
        transition: 'background-color 0.3s',
        fontFamily: 'Lora, serif',
        height: '70px',
      }}>
        {/* LEFT SIDE - Menu */}
        <button 
          onClick={sidebarVisible ? handleSidebarClose : handleSidebarToggle}
          style={{
            fontSize: '1.5rem',
            color: 'var(--header-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
            transition: 'background-color 0.2s, transform 0.3s ease',
            position: 'relative',
            transform: sidebarVisible ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
          aria-label={sidebarVisible ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarVisible}
          aria-controls="sidebar"
          title="Menu"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <Menu size={24} />
        </button>
        
        {/* CENTER - Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
          {!logoError ? (
            <img 
              src="/images/GriotBot logo horiz wht.svg" 
              alt="GriotBot" 
              style={{
                height: '40px',
                width: 'auto',
              }}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}>
              🌿 GriotBot
            </div>
          )}
        </div>
        
        {/* RIGHT SIDE - Action Icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          {/* Back to Chat */}
          <Link href="/">
            <a style={{
              color: 'var(--header-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
              textDecoration: 'none',
            }}
            title="Back to Chat"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}>
              <ArrowLeft size={24} />
            </a>
          </Link>
          
          {/* Account */}
          <button 
            onClick={() => window.location.href = '/comingsoon'}
            style={{
              color: 'var(--header-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
            }}
            aria-label="Account"
            title="Account"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <LogIn size={24} />
          </button>
          
          {/* Theme Toggle */}
          <button 
            onClick={handleThemeToggle}
            style={{
              color: 'var(--header-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
            }}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>

      {/* ENHANCED SIDEBAR */}
      <EnhancedSidebar 
        isVisible={sidebarVisible}
        onClose={handleSidebarClose}
        currentPage="/about"
      />

      {/* MAIN CONTENT */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'auto',
        padding: '1rem',
        paddingTop: '90px', // Account for fixed header
        paddingBottom: '120px', // Account for footer
        transition: 'background-color 0.3s',
        marginTop: 0,
      }}>
        <div style={{
          width: '100%',
          maxWidth: '700px',
          animation: 'message-fade-in 0.5s ease-out forwards',
        }}>
          <h1 style={{
            color: 'var(--accent-color)',
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontFamily: 'Lora, serif',
            textAlign: 'center',
          }}>About GriotBot</h1>
          
          <div style={{
            backgroundColor: 'var(--card-bg)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px var(--shadow-color)',
            marginBottom: '2rem',
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              <strong>GriotBot</strong> is more than just an AI — it is a spark of
              ancestral memory. Designed to honor the rich oral traditions, cultural
              legacy, and lived experiences of the African Diaspora, GriotBot offers
              thoughtful, accurate, and warm guidance.
            </p>

            <div style={{
              fontStyle: 'italic',
              color: 'var(--wisdom-color)',
              margin: '2rem 0',
              borderLeft: '4px solid var(--accent-color)',
              paddingLeft: '1rem',
              fontFamily: 'Lora, serif',
              fontSize: '1.1rem',
            }}>
              "A people without the knowledge of their past history, origin and
              culture is like a tree without roots." — Marcus Garvey
            </div>

            <h2 style={{
              color: 'var(--accent-color)',
              fontSize: '1.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontFamily: 'Lora, serif',
            }}>Why GriotBot?</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              The griot was the traditional keeper of history, story, and wisdom.
              GriotBot brings that same spirit into the digital age — acting as a
              wise, trusted voice for learners, educators, and community leaders.
            </p>

            <h2 style={{
              color: 'var(--accent-color)',
              fontSize: '1.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontFamily: 'Lora, serif',
            }}>Who Is It For?</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Anyone seeking cultural knowledge, inspiration, or connection:
              educators, students, nonprofits, families, and curious minds across the
              globe.
            </p>

            <h2 style={{
              color: 'var(--accent-color)',
              fontSize: '1.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontFamily: 'Lora, serif',
            }}>How It Works</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              GriotBot uses advanced language models, guided by a carefully crafted
              prompt that shapes its responses with respect, dignity, and clarity. It
              draws from cultural histories, philosophies, and global Black
              experiences to offer grounded responses — never performative, always
              intentional.
            </p>

            <h2 style={{
              color: 'var(--accent-color)',
              fontSize: '1.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontFamily: 'Lora, serif',
            }}>Beta Testing</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We're currently in beta and actively improving GriotBot based on user feedback. 
              Your input helps us create a more culturally authentic and helpful experience 
              for the entire community.
            </p>

            <h2 style={{
              color: 'var(--accent-color)',
              fontSize: '1.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontFamily: 'Lora, serif',
            }}>Get Involved</h2>
            <p style={{ marginBottom: '1rem' }}>
              Want to support, fund, test, or help shape GriotBot's future?
            </p>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginTop: '1.5rem',
            }}>
              <a 
                href="mailto:chat@griotbot.com" 
                style={{ 
                  color: 'white',
                  backgroundColor: 'var(--accent-color)',
                  textDecoration: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--accent-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--accent-color)';
                }}
              >
                Email Us
              </a>
              
              <a 
                href="https://www.instagram.com/griotbot" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  color: 'var(--accent-color)',
                  backgroundColor: 'transparent',
                  textDecoration: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: '2px solid var(--accent-color)',
                  transition: 'all 0.2s',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--accent-color)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--accent-color)';
                }}
              >
                Follow @griotbot
              </a>
              
              <Link href="/feedback">
                <a style={{ 
                  color: 'var(--accent-color)',
                  backgroundColor: 'transparent',
                  textDecoration: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: '2px solid var(--accent-color)',
                  transition: 'all 0.2s',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--accent-color)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--accent-color)';
                }}>
                  Share Feedback
                </a>
              </Link>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px var(--shadow-color)',
            textAlign: 'center',
          }}>
            <h3 style={{
              color: 'var(--accent-color)',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontFamily: 'Lora, serif',
            }}>Ready to Experience GriotBot?</h3>
            <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
              Join the journey of cultural exploration and wisdom sharing.
            </p>
            <Link href="/">
              <a style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                textDecoration: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px var(--shadow-color)',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-hover)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.transform = 'translateY(0)';
              }}>
                <MessageCirclePlus size={20} />
                Start Chatting Now
              </a>
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER - Consistent with index */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        background: 'var(--bg-color)',
        borderTop: '1px solid var(--input-border)',
        transition: 'background-color 0.3s',
        zIndex: 100,
        boxShadow: '0 -4px 20px var(--shadow-color)',
        padding: 0,
      }}>
        {/* PROVERB */}
        <div 
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            padding: '1rem 1rem 0.5rem 1rem',
            color: 'var(--wisdom-color)',
            transition: 'color 0.3s',
            opacity: 0.9,
            fontFamily: 'Lora, serif',
          }}
          aria-label={`Proverb: ${currentProverb}`}
        >
          {currentProverb}
        </div>
        
        {/* COPYRIGHT */}
        <div style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-color)',
          opacity: 0.7,
          transition: 'color 0.3s',
          padding: '0 1rem 1rem 1rem',
        }}>
          © 2025 GriotBot. All rights reserved.
        </div>
      </div>
    </>
  );
}
