// File: /pages/feedback.js - QUICK WINS APPLIED
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import EnhancedSidebar from '../components/EnhancedSidebar';
import { Menu, LogIn, Sun, Moon, ArrowLeft, Mail, Instagram, Twitter, Linkedin } from 'react-feather';

export default function Feedback() {
  // State management
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '',
    likes: '',
    improvements: '',
    authenticity: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({}); // NEW: Form validation errors

  // Proverbs array
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
    "However long the night, the dawn will break. — African Proverb",
    "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
    "It takes a village to raise a child. — African Proverb",
    "The fool speaks, the wise listen. — Ethiopian Proverb",
    "When the music changes, so does the dance. — Haitian Proverb"
  ];

  // Initialize client-side functionality
  useEffect(() => {
    setIsClient(true);
    loadPreferences();
    showRandomProverb();
  }, []);

  // Load theme preference
  const loadPreferences = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  };

  // Show random proverb
  const showRandomProverb = () => {
    const randomIndex = Math.floor(Math.random() * PROVERBS.length);
    setCurrentProverb(PROVERBS[randomIndex]);
  };

  // Toggle theme
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // NEW: Basic form validation
  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!formData.rating) {
      errors.rating = 'Please select a rating';
    }
    
    if (!formData.authenticity) {
      errors.authenticity = 'Please rate the cultural authenticity';
    }
    
    // Email format validation (if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // NEW: Validate form before submission
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setFormErrors({}); // Clear any previous errors
    
    try {
      // Simulate API call (replace with actual endpoint later)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        rating: '',
        likes: '',
        improvements: '',
        authenticity: ''
      });
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Could set an error state here for user feedback
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      <Head>
        <title>GriotBot Feedback</title>
        <meta name="description" content="Share your feedback to help improve GriotBot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* CSS Variables and Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --header-text: #33302e;
            --sidebar-bg: rgba(75, 46, 42, 0.97);
            --sidebar-text: #f8f5f0;
            --accent-color: #d7722c;
            --accent-hover: #c86520;
            --wisdom-color: #6b4226;
            --input-bg: #ffffff;
            --input-border: rgba(75, 46, 42, 0.2);
            --input-text: #33302e;
            --shadow-color: rgba(75, 46, 42, 0.15);
            --card-bg: #ffffff;
            --error-color: #dc3545;
            --success-color: #28a745;
          }
          
          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
            --header-text: #f0ece4;
            --sidebar-bg: rgba(40, 30, 25, 0.97);
            --sidebar-text: #f0ece4;
            --accent-color: #d7722c;
            --accent-hover: #e8833d;
            --wisdom-color: #e0c08f;
            --input-bg: #352e29;
            --input-border: rgba(240, 236, 228, 0.2);
            --input-text: #f0ece4;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --card-bg: #352e29;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            transition: background-color 0.3s, color 0.3s;
          }

          /* IMPROVED: CSS hover effects instead of JavaScript */
          .contact-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            background-color: var(--card-bg);
            border: 2px solid var(--input-border);
            border-radius: 8px;
            color: var(--text-color);
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          }

          .contact-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px var(--shadow-color);
            border-color: var(--accent-color);
          }

          .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 1rem;
            margin-bottom: 2rem;
          }

          @media (max-width: 768px) {
            .contact-grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 480px) {
            .contact-grid {
              grid-template-columns: 1fr;
            }
          }

          /* Form styling */
          .form-group {
            margin-bottom: 1rem;
          }

          .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-color);
          }

          .form-input, .form-textarea, .form-select {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid var(--input-border);
            border-radius: 8px;
            background-color: var(--input-bg);
            color: var(--input-text);
            font-family: 'Montserrat', sans-serif;
            font-size: 1rem;
            transition: border-color 0.3s, box-shadow 0.3s;
          }

          .form-input:focus, .form-textarea:focus, .form-select:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(215, 114, 44, 0.1);
          }

          .form-textarea {
            resize: vertical;
            min-height: 100px;
          }

          /* NEW: Error styling */
          .form-input.error, .form-textarea.error, .form-select.error {
            border-color: var(--error-color);
          }

          .error-message {
            color: var(--error-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }

          .submit-button {
            background-color: var(--accent-color);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .submit-button:hover:not(:disabled) {
            background-color: var(--accent-hover);
            transform: translateY(-1px);
          }

          .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
          }
        `}} />
      </Head>

      {/* HEADER */}
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--header-bg)',
        color: 'var(--header-text)',
        padding: '1rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 10px var(--shadow-color)',
        zIndex: 100,
        transition: 'background-color 0.3s',
      }}>
        {/* LEFT - Menu */}
        <button 
          onClick={toggleSidebar}
          style={{
            position: 'absolute',
            left: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            color: 'var(--header-text)',
            transition: 'transform 0.3s ease',
            transform: sidebarVisible ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
          aria-label="Toggle sidebar"
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
          <Link href="/">
            <a style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--header-text)',
              textDecoration: 'none',
              fontFamily: 'Lora, serif',
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}>
              {!logoError ? (
                <img 
                  src="/images/GriotBot logo horiz wht.svg"
                  alt="GriotBot"
                  style={{ height: '32px' }}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <>
                  <span style={{ fontSize: '1.5rem' }}>🌿</span>
                  <span>GriotBot</span>
                </>
              )}
            </a>
          </Link>
        </div>

        {/* RIGHT - Theme Toggle */}
        <button 
          onClick={handleThemeToggle}
          style={{
            position: 'absolute',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            color: 'var(--header-text)',
          }}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <EnhancedSidebar 
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        currentPath="/feedback"
      />

      {/* MAIN CONTENT */}
      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        minHeight: 'calc(100vh - 70px)',
        padding: '2rem',
        paddingBottom: '120px',
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
        }}>
          {/* Back Link */}
          <Link href="/">
            <a style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--accent-color)',
              textDecoration: 'none',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              transition: 'color 0.2s',
            }}>
              <ArrowLeft size={16} />
              Back to GriotBot
            </a>
          </Link>

          {/* Beta Badge */}
          <div style={{
            display: 'inline-block',
            backgroundColor: 'var(--accent-color)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            BETA • Help Us Improve
          </div>

          {formSubmitted ? (
            // Success Message
            <div style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              backgroundColor: 'var(--card-bg)',
              borderRadius: '12px',
              boxShadow: '0 4px 15px var(--shadow-color)',
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                color: 'var(--success-color)',
              }}>
                ✓
              </div>
              <h2 style={{
                color: 'var(--accent-color)',
                marginBottom: '1rem',
                fontFamily: 'Lora, serif',
              }}>
                Thank You for Your Feedback!
              </h2>
              <p style={{ marginBottom: '2rem' }}>
                Your insights help us make GriotBot better for everyone. 
                We truly appreciate you taking the time to share your experience.
              </p>
              <Link href="/">
                <a style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--accent-color)',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'background-color 0.3s',
                }}>
                  Back to GriotBot
                </a>
              </Link>
            </div>
          ) : (
            // Feedback Form
            <>
              <h1 style={{
                color: 'var(--accent-color)',
                fontSize: '2rem',
                marginBottom: '1rem',
                fontFamily: 'Lora, serif',
              }}>
                Share Your Feedback
              </h1>
              
              <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
                Help us improve GriotBot by sharing your experience. Your feedback directly influences our development.
              </p>

              <form onSubmit={handleSubmit} style={{
                backgroundColor: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 15px var(--shadow-color)',
                marginBottom: '2rem',
              }}>
                {/* Name Field */}
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name <span style={{ opacity: 0.6 }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email <span style={{ opacity: 0.6 }}>(optional)</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                    placeholder="your.email@example.com"
                  />
                  {formErrors.email && (
                    <div className="error-message">{formErrors.email}</div>
                  )}
                </div>

                {/* Rating Field */}
                <div className="form-group">
                  <label htmlFor="rating" className="form-label">
                    Overall Experience <span style={{ color: 'var(--error-color)' }}>*</span>
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className={`form-select ${formErrors.rating ? 'error' : ''}`}
                    required
                  >
                    <option value="">Select your rating</option>
                    <option value="excellent">Excellent - Exceeded expectations</option>
                    <option value="good">Good - Met expectations</option>
                    <option value="average">Average - Some room for improvement</option>
                    <option value="poor">Poor - Needs significant improvement</option>
                  </select>
                  {formErrors.rating && (
                    <div className="error-message">{formErrors.rating}</div>
                  )}
                </div>

                {/* Likes Field */}
                <div className="form-group">
                  <label htmlFor="likes" className="form-label">
                    What did you like most about GriotBot?
                  </label>
                  <textarea
                    id="likes"
                    name="likes"
                    value={formData.likes}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Tell us what you enjoyed..."
                  />
                </div>

                {/* Improvements Field */}
                <div className="form-group">
                  <label htmlFor="improvements" className="form-label">
                    What could we improve?
                  </label>
                  <textarea
                    id="improvements"
                    name="improvements"
                    value={formData.improvements}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Share your suggestions..."
                  />
                </div>

                {/* Cultural Authenticity Field */}
                <div className="form-group">
                  <label htmlFor="authenticity" className="form-label">
                    Cultural Authenticity <span style={{ color: 'var(--error-color)' }}>*</span>
                  </label>
                  <select
                    id="authenticity"
                    name="authenticity"
                    value={formData.authenticity}
                    onChange={handleInputChange}
                    className={`form-select ${formErrors.authenticity ? 'error' : ''}`}
                    required
                  >
                    <option value="">Rate the cultural accuracy</option>
                    <option value="very-authentic">Very Authentic - Resonates deeply</option>
                    <option value="mostly-authentic">Mostly Authentic - Generally accurate</option>
                    <option value="somewhat-authentic">Somewhat Authentic - Room for improvement</option>
                    <option value="not-authentic">Not Authentic - Misses the mark</option>
                  </select>
                  {formErrors.authenticity && (
                    <div className="error-message">{formErrors.authenticity}</div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Sending...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </form>

              {/* Contact Information */}
              <div style={{ marginTop: '3rem' }}>
                <h2 style={{
                  color: 'var(--accent-color)',
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  fontFamily: 'Lora, serif',
                }}>
                  Other Ways to Connect
                </h2>
                
                <div className="contact-grid">
                  <a href="mailto:chat@griotbot.com" className="contact-link">
                    <Mail size={20} style={{ color: 'var(--accent-color)' }} />
                    <span>Email Us</span>
                  </a>
                  
                  <a href="https://www.instagram.com/griotbot" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <Instagram size={20} style={{ color: 'var(--accent-color)' }} />
                    <span>@griotbot</span>
                  </a>
                  
                  <a href="https://twitter.com/griotbot" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <Twitter size={20} style={{ color: 'var(--accent-color)' }} />
                    <span>@griotbot</span>
                  </a>
                  
                  <a href="https://linkedin.com/company/griotbot" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <Linkedin size={20} style={{ color: 'var(--accent-color)' }} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        left: '0',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontStyle: 'italic',
        padding: '0 1rem',
        color: 'var(--wisdom-color)',
        opacity: 0.8,
        fontFamily: 'Lora, serif',
        pointerEvents: 'none',
      }}>
        {currentProverb}
      </div>
      
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '0',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.6,
        pointerEvents: 'none',
      }}>
        © {new Date().getFullYear()} GriotBot. All rights reserved.
      </div>
    </>
  );
}
