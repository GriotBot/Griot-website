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
  MessageSquare,
  Send,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  Heart,
  CheckCircle
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '',
    likes: '',
    improvements: '',
    authenticity: '',
    additionalFeedback: ''
  });

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        rating: '',
        likes: '',
        improvements: '',
        authenticity: '',
        additionalFeedback: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
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

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
        
        {/* CENTER - Logo (Absolutely centered on screen) */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
        onNewChat={() => window.location.href = '/'}
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
              marginBottom: '2rem',
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
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: 'var(--text-color)',
                    }}>
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--input-border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                      }}
                      placeholder="Your name"
                    />
                  </div>

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
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--input-border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
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
                      value={formData.likes}
                      onChange={handleInputChange}
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
                      value={formData.improvements}
                      onChange={handleInputChange}
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
                      value={formData.authenticity}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--input-border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
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
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid var(--input-border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                      }}
                    />
                    <small style={{ opacity: 0.7, fontSize: '0.9rem', display: 'block', marginTop: '0.25rem' }}>
                      Only if you'd like us to follow up with you
                    </small>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: isSubmitting ? '#ccc' : 'var(--accent-color)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '8px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      alignSelf: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.target.style.backgroundColor = 'var(--accent-hover)';
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.target.style.backgroundColor = 'var(--accent-color)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Feedback
                      </>
                    )}
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
              marginBottom: '2rem',
            }}>
              <CheckCircle size={48} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
              <h3 style={{
                color: 'var(--accent-color)',
                fontSize: '1.5rem',
                marginBottom: '1rem',
                fontFamily: 'Lora, serif',
              }}>
                Asante Sana - Thank You!
              </h3>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
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

          {/* Contact Information Section */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px var(--shadow-color)',
            overflow: 'hidden',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--bot-bubble-start), var(--bot-bubble-end))',
              color: 'white',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <Heart size={32} style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>
                Other Ways to Connect
              </h3>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Prefer to reach out directly? We're here to listen.
              </p>
            </div>

            <div style={{ padding: '2rem' }}>
              {/* Mobile responsive styles */}
              <style dangerouslySetInnerHTML={{ __html: `
                .contact-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr 1fr 1fr;
                  gap: 1rem;
                }
                @media (max-width: 768px) {
                  .contact-grid {
                    grid-template-columns: 1fr 1fr !important;
                    gap: 0.75rem !important;
                  }
                }
                @media (max-width: 480px) {
                  .contact-grid {
                    grid-template-columns: 1fr !important;
                  }
                }
              `}} />
              
              <div className="contact-grid">
                {/* Email */}
                <a 
                  href="mailto:chat@griotbot.com" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-color)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'var(--text-color)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '2px solid var(--input-border)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Mail size={20} color="var(--accent-color)" />
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Email</div>
                    <div style={{ fontSize: '0.8rem', opacity: '0.7' }}>chat@griotbot.com</div>
                  </div>
                </a>

                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/griotbot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-color)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'var(--text-color)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '2px solid var(--input-border)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Instagram size={20} color="var(--accent-color)" />
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Instagram</div>
                    <div style={{ fontSize: '0.8rem', opacity: '0.7' }}>@griotbot</div>
                  </div>
                </a>

                {/* Twitter/X */}
                <a 
                  href="https://twitter.com/griotbot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-color)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'var(--text-color)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '2px solid var(--input-border)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Twitter size={20} color="var(--accent-color)" />
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Twitter</div>
                    <div style={{ fontSize: '0.8rem', opacity: '0.7' }}>@griotbot</div>
                  </div>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/company/griotbot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-color)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'var(--text-color)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '2px solid var(--input-border)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Linkedin size={20} color="var(--accent-color)" />
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>LinkedIn</div>
                    <div style={{ fontSize: '0.8rem', opacity: '0.7' }}>griotbot</div>
                  </div>
                </a>
              </div>
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
