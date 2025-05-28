// File: pages/comingsoon.js (IMPROVED VERSION)
import { useState } from 'react';
import { Clock, User, Upload, Settings, Mic, CheckCircle, Mail } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';

// Move static data outside component to prevent re-creation on each render
const upcomingFeatures = [
  {
    id: 'user-accounts',
    icon: User,
    title: 'User Accounts',
    description: 'Save your conversations, customize your experience, and build your personal knowledge base with secure user profiles.'
  },
  {
    id: 'file-uploads',
    icon: Upload,
    title: 'File Uploads', 
    description: 'Upload documents, images, and files for GriotBot to analyze and discuss with rich cultural context and insights.'
  },
  {
    id: 'personalization',
    icon: Settings,
    title: 'Personalization',
    description: 'Tailor GriotBot\'s responses to your specific interests, cultural background, and learning preferences.'
  },
  {
    id: 'voice-interactions',
    icon: Mic,
    title: 'Voice Interactions',
    description: 'Speak with GriotBot naturally using voice input and listen to responses with authentic cultural narration.'
  }
];

// Animation keyframes as CSS-in-JS objects
const pulseAnimation = {
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.6 }
};

const spinAnimation = {
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
};

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Style constants to reduce duplication
  const CARD_STYLES = {
    backgroundColor: 'var(--card-bg)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow-color)',
    border: '1px solid var(--input-border)',
    textAlign: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default'
  };

  const BUTTON_STYLES = {
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
    whiteSpace: 'nowrap'
  };

  // Enhanced email subscription handler with better error handling
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - in production, replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate potential error (remove in production)
      if (Math.random() > 0.9) {
        throw new Error('Subscription failed. Please try again.');
      }
      
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Improved hover handlers with better performance
  const handleCardHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 8px 20px var(--shadow-color)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
    }
  };

  const handleButtonHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
    } else {
      e.currentTarget.style.backgroundColor = 'var(--accent-color)';
    }
  };

  const handleCtaHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  return (
    <StandardLayout 
      pageType="standard"
      title="Coming Soon - GriotBot Features"
      description="Exciting new features coming to GriotBot - user accounts, file uploads, voice interactions, and personalization"
      currentPath="/comingsoon"
    >
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'center',
        lineHeight: 1.6,
        padding: '0 1rem'
      }}>
        {/* Hero Section */}
        <header style={{
          marginBottom: '3rem',
          padding: '2rem 0'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            color: 'var(--accent-color)',
            animation: 'pulse 2s infinite'
          }}>
            <Clock 
              size={80} 
              style={{
                animation: 'pulse 2s infinite'
              }} 
              aria-hidden="true"
            />
          </div>
          
          <h1 style={{
            color: 'var(--text-color)',
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)'
          }}>
            Exciting Features Coming Soon
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-color)',
            opacity: 0.8,
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            We're working hard to bring you new ways to connect with your heritage and expand your cultural knowledge through innovative AI features.
          </p>
        </header>

        {/* Feature Previews */}
        <section 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
          aria-labelledby="upcoming-features-heading"
        >
          <h2 
            id="upcoming-features-heading" 
            style={{
              gridColumn: '1 / -1',
              color: 'var(--text-color)',
              fontSize: '1.75rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}
          >
            What's Coming
          </h2>
          
          {upcomingFeatures.map((feature) => (
            <article
              key={feature.id}
              style={CARD_STYLES}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              onFocus={(e) => handleCardHover(e, true)}
              onBlur={(e) => handleCardHover(e, false)}
              tabIndex="0"
              role="article"
              aria-labelledby={`feature-${feature.id}-title`}
            >
              <div style={{
                color: 'var(--accent-color)',
                marginBottom: '1rem'
              }}>
                <feature.icon size={48} aria-hidden="true" />
              </div>
              
              <h3 
                id={`feature-${feature.id}-title`}
                style={{
                  color: 'var(--text-color)',
                  fontSize: '1.25rem',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--heading-font)'
                }}
              >
                {feature.title}
              </h3>
              
              <p style={{
                color: 'var(--text-color)',
                opacity: 0.8,
                lineHeight: 1.5,
                margin: 0
              }}>
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        {/* Email Notification Signup */}
        <section 
          style={{
            ...CARD_STYLES,
            padding: '2.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}
          aria-labelledby="signup-heading"
        >
          <h2 
            id="signup-heading"
            style={{
              color: 'var(--text-color)',
              fontSize: '1.75rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}
          >
            Be the First to Know
          </h2>
          
          <p style={{
            color: 'var(--text-color)',
            opacity: 0.8,
            marginBottom: '1.5rem'
          }}>
            Get notified when these features launch. No spam, just updates on GriotBot's journey.
          </p>

          {subscribed ? (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: 'var(--success-color, #28a745)',
                fontSize: '1.1rem',
                fontWeight: '500'
              }}
              role="status"
              aria-live="polite"
            >
              <CheckCircle size={24} aria-hidden="true" />
              <span>Thank you! We'll keep you updated on new features.</span>
            </div>
          ) : (
            <form 
              onSubmit={handleSubscribe} 
              style={{
                display: 'flex',
                gap: '0.75rem',
                maxWidth: '400px',
                margin: '0 auto',
                flexDirection: window.innerWidth <= 600 ? 'column' : 'row',
                alignItems: 'stretch'
              }}
              noValidate
            >
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label 
                  htmlFor="email-subscribe"
                  style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    margin: '-1px',
                    padding: '0',
                    overflow: 'hidden',
                    clip: 'rect(0,0,0,0)',
                    border: '0'
                  }}
                >
                  Email Address for Updates
                </label>
                <input
                  id="email-subscribe"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  aria-describedby={error ? 'email-error' : undefined}
                  aria-invalid={error ? 'true' : 'false'}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1px solid ${error ? 'var(--error-color, #dc3545)' : 'var(--input-border)'}`,
                    borderRadius: '8px',
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-color)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error ? 'var(--error-color, #dc3545)' : 'var(--input-border)';
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...BUTTON_STYLES,
                  backgroundColor: isSubmitting ? 'var(--disabled-color, #ccc)' : 'var(--accent-color)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseEnter={(e) => !isSubmitting && handleButtonHover(e, true)}
                onMouseLeave={(e) => !isSubmitting && handleButtonHover(e, false)}
                onFocus={(e) => !isSubmitting && handleButtonHover(e, true)}
                onBlur={(e) => !isSubmitting && handleButtonHover(e, false)}
                aria-describedby={error ? 'email-error' : undefined}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #fff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Mail size={16} aria-hidden="true" />
                    Notify Me
                  </>
                )}
              </button>
            </form>
          )}

          {error && (
            <div 
              id="email-error"
              style={{
                color: 'var(--error-color, #dc3545)',
                fontSize: '0.875rem',
                marginTop: '0.5rem',
                textAlign: 'center'
              }}
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}
        </section>

        {/* Current Chat CTA */}
        <section style={{
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)',
            margin: '0 0 1rem 0'
          }}>
            In the Meantime...
          </h3>
          
          <p style={{
            marginBottom: '1.5rem',
            opacity: 0.9,
            margin: '0 0 1.5rem 0'
          }}>
            GriotBot is ready to share wisdom, stories, and cultural insights with you right now! Experience the power of AI-driven cultural knowledge.
          </p>
          
          <a
            href="/"
            style={{
              display: 'inline-block',
              backgroundColor: 'white',
              color: 'var(--accent-color)',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => handleCtaHover(e, true)}
            onMouseLeave={(e) => handleCtaHover(e, false)}
            onFocus={(e) => handleCtaHover(e, true)}
            onBlur={(e) => handleCtaHover(e, false)}
            aria-label="Start chatting with GriotBot now"
          >
            Start Chatting Now
          </a>
        </section>

        {/* Contact Info */}
        <footer style={{
          textAlign: 'center',
          color: 'var(--text-color)',
          opacity: 0.7,
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: 0 }}>
            Questions about upcoming features?{' '}
            <a 
              href="mailto:chat@griotbot.com" 
              style={{ 
                color: 'var(--accent-color)', 
                textDecoration: 'none',
                borderRadius: '2px',
                padding: '0 2px'
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
              }}
              aria-label="Send email to GriotBot team"
            >
              Let us know
            </a>
          </p>
        </footer>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </StandardLayout>
  );
}
