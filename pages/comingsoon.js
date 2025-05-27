// File: pages/comingsoon.js (UPDATED WITH STANDARD LAYOUT)
import { useState } from 'react';
import { Clock, User, Upload, Settings, Mic, CheckCircle, Mail } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle email subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubscribed(true);
    setEmail('');
    setIsSubmitting(false);
  };

  // Feature previews data
  const upcomingFeatures = [
    {
      icon: User,
      title: 'User Accounts',
      description: 'Save your conversations, customize your experience, and build your personal knowledge base.'
    },
    {
      icon: Upload,
      title: 'File Uploads', 
      description: 'Upload documents, images, and files for GriotBot to analyze and discuss with cultural context.'
    },
    {
      icon: Settings,
      title: 'Personalization',
      description: 'Tailor GriotBot\'s responses to your specific interests, background, and learning preferences.'
    },
    {
      icon: Mic,
      title: 'Voice Interactions',
      description: 'Speak with GriotBot naturally using voice input and listen to responses with authentic narration.'
    }
  ];

  return (
    <StandardLayout 
      pageType="standard"
      title="Coming Soon - GriotBot"
      description="Exciting new features coming to GriotBot"
      currentPath="/comingsoon"
    >
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'center',
        lineHeight: 1.6
      }}>
        {/* Hero Section */}
        <div style={{
          marginBottom: '3rem',
          padding: '2rem 0'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            color: 'var(--accent-color)'
          }}>
            <Clock size={80} style={{ animation: 'pulse 2s infinite' }} />
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
            We're working hard to bring you new ways to connect with your heritage and expand your cultural knowledge.
          </p>
        </div>

        {/* Feature Previews */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {upcomingFeatures.map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px var(--shadow-color)',
                border: '1px solid var(--input-border)',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 8px 20px var(--shadow-color)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px var(--shadow-color)';
              }}
            >
              <div style={{
                color: 'var(--accent-color)',
                marginBottom: '1rem'
              }}>
                <feature.icon size={48} />
              </div>
              
              <h3 style={{
                color: 'var(--text-color)',
                fontSize: '1.25rem',
                marginBottom: '0.75rem',
                fontFamily: 'var(--heading-font)'
              }}>
                {feature.title}
              </h3>
              
              <p style={{
                color: 'var(--text-color)',
                opacity: 0.8,
                lineHeight: 1.5
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Email Notification Signup */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '2.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px var(--shadow-color)',
          border: '1px solid var(--input-border)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: 'var(--text-color)',
            fontSize: '1.75rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)'
          }}>
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: '#28a745',
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>
              <CheckCircle size={24} />
              <span>Thank you! We'll keep you updated.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{
              display: 'flex',
              gap: '0.75rem',
              maxWidth: '400px',
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontSize: '1rem'
                }}
              />
              
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? '#ccc' : 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = 'var(--accent-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = 'var(--accent-color)';
                  }
                }}
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
                    <Mail size={16} />
                    Notify Me
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Current Chat CTA */}
        <div style={{
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)'
          }}>
            In the Meantime...
          </h3>
          
          <p style={{
            marginBottom: '1.5rem',
            opacity: 0.9
          }}>
            GriotBot is ready to share wisdom, stories, and cultural insights with you right now!
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
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Start Chatting Now
          </a>
        </div>

        {/* Contact Info */}
        <div style={{
          textAlign: 'center',
          color: 'var(--text-color)',
          opacity: 0.7
        }}>
          <p>
            Questions about upcoming features?{' '}
            <a 
              href="mailto:chat@griotbot.com" 
              style={{ 
                color: 'var(--accent-color)', 
                textDecoration: 'none' 
              }}
            >
              Let us know
            </a>
          </p>
        </div>
      </div>

      {/* Animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 600px) {
          form[style*="display: flex"] {
            flex-direction: column !important;
          }
          
          input[type="email"] {
            min-width: auto !important;
          }
        }
      `}} />
    </StandardLayout>
  );
}
