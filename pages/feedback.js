// File: /pages/feedback.js - UPDATED WITH CONSISTENT TEMPLATE
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import EnhancedSidebar from '../components/EnhancedSidebar';
import { 
  Menu, 
  LogIn, 
  Sun, 
  Moon,
  ArrowLeft,
  MessageSquare
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

export default function Feedback() {
  // State management (same as index)
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
        <title>Share Feedback - GriotBot</title>
        <meta name="description" content="Share your feedback and help improve GriotBot - Your digital griot companion" />
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
        currentPage="/feedback"
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
          maxWidth: '800px',
          animation: 'message-fade-in 0.5s ease-out forwards',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            <h1 style={{
              color: 'var(--accent-color)',
              fontSize: '2.5rem',
              marginBottom: '0.5rem',
              fontFamily: 'Lora, serif',
            }}>We'd Love Your Feedback</h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.8,
              marginBottom: '0.5rem',
            }}>
              GriotBot is growing, and your voice helps shape the journey.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}>
              <span>BETA</span>
              <span>•</span>
              <span>Help Us Improve</span>
            </div>
          </div>

          {!formSubmitted ? (
            <div style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px var(--shadow-color)',
              overflow: 'hidden',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))',
                color: 'white',
                padding: '1.5rem',
                textAlign: 'center',
              }}>
                <MessageSquare size={32} style={{ marginBottom: '0.5rem' }} />
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>
                  Beta Feedback Form
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>
                  Your insights help us build a better GriotBot for the community
                </p>
              </div>

              <div style={{ padding: '2rem' }}>
                <form 
                  action="https://formspree.io/f/your-form-id"
                  method="POST"
                  onSubmit={() => setFormSubmitted(true)}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: 'var(--text-color)',
                    }}>
                      How would you rate your overall experience with GriotBot?
                    </label>
                    <select 
                      name="rating"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--input-border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontSize: '1rem',
                      }}
                    >
                      <option value="">Select a rating</option>
                      <option value="excellent">Excellent - Exceeded expectations</option>
                      <option value="good">Good - Met expectations</option>
                      <option value="fair">Fair - Somewhat helpful</option>
                      <option value="poor">Poor - Needs significant improvement</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: 'var(--text-color)',
                    }}>
                      What did you like most about GriotBot?
                    </label>
                    <textarea
                      name="likes"
                      rows="3"
                      placeholder="Tell us what resonated with you..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--input-border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontSize: '1rem',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: 'var(--text-color)',
                    }}>
                      What could we improve?
                    </label>
                    <textarea
                      name="improvements"
                      rows="3"
                      placeholder="Share your suggestions for making GriotBot better..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--input-border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontSize: '1rem',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: 'var(--text-color)',
                    }}>
                      How culturally authentic did GriotBot's responses feel?
                    </label>
                    <select 
                      name="authenticity"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--input-border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontSize: '1rem',
                      }}
                    >
                      <option value="">Select authenticity level</option>
                      <option value="very-authentic">Very authentic - Felt genuinely griot-like</option>
                      <option value="mostly-authentic">Mostly authentic - Good cultural awareness</option>
                      <option value="somewhat-authentic">Somewhat authentic - Room for improvement</option>
                      <option value="not-authentic">Not authentic - Needs work</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: 'var(--text-color)',
                    }}>
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--input-border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontSize: '1rem',
                      }}
                    />
                    <small style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                      Only if you'd like us to follow up with you
                    </small>
                  </div>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'var(--accent-color)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '8px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      alignSelf: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--accent-hover)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--accent-color)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Submit Feedback
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'var(--card-bg)',
              padding: '3rem 2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px var(--shadow-color)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
              }}>🙏</div>
              <h3 style={{
                color: 'var(--accent-color)',
                fontSize: '1.5rem',
                marginBottom: '1rem',
                fontFamily: 'Lora, serif',
              }}>
                Asante Sana - Thank You!
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>
                Your feedback helps us honor the griot tradition while building
                better technology for our community.
              </p>
              <Link href="/">
                <a style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--accent-color)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--accent-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--accent-color)';
                }}>
                  <ArrowLeft size={16} />
                  Back to GriotBot
                </a>
              </Link>
            </div>
          )}

          {/* Additional Info */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px var(--shadow-color)',
            marginTop: '2rem',
            textAlign: 'center',
          }}>
            <h4 style={{
              color: 'var(--accent-color)',
              marginBottom: '1rem',
              fontFamily: 'Lora, serif',
            }}>
              Other Ways to Connect
            </h4>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <a 
                href="mailto:chat@griotbot.com"
                style={{
                  color: 'var(--accent-color)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  border: '2px solid var(--accent-color)',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
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
                Email Us
              </a>
              <a 
                href="https://www.instagram.com/griotbot"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--accent-color)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  border: '2px solid var(--accent-color)',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
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
                @griotbot
              </a>
            </div>
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
