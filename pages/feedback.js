// File: pages/feedback.js (UPDATED WITH STANDARD LAYOUT)
import { useState } from 'react';
import { Mail, Instagram, Twitter, Linkedin, Send, CheckCircle } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    culturalAccuracy: '',
    userExperience: '',
    features: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
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
      // In a real implementation, this would send to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        feedbackType: 'general',
        culturalAccuracy: '',
        userExperience: '',
        features: '',
        message: ''
      });
    } catch (error) {
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact links data
  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: 'chat@griotbot.com',
      href: 'mailto:chat@griotbot.com'
    },
    {
      icon: Instagram,
      label: 'Instagram', 
      value: '@griotbot',
      href: 'https://www.instagram.com/griotbot'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      value: '@griotbot', 
      href: 'https://twitter.com/griotbot'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'griotbot',
      href: 'https://www.linkedin.com/company/griotbot'
    }
  ];

  return (
    <StandardLayout 
      pageType="standard"
      title="GriotBot Feedback"
      description="Share your feedback and help improve GriotBot"
      currentPath="/feedback"
    >
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: 1.6
      }}>
        <h1 style={{
          color: 'var(--text-color)',
          fontSize: '2rem',
          marginBottom: '0.5rem',
          fontFamily: 'var(--heading-font)',
          textAlign: 'center'
        }}>
          We'd Love Your Feedback
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: '1.1rem',
          color: 'var(--text-color)',
          opacity: 0.8,
          marginBottom: '2rem'
        }}>
          GriotBot is growing, and your voice helps shape the journey.
        </p>

        {/* Success Message */}
        {submitSuccess && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid #c3e6cb'
          }}>
            <CheckCircle size={20} />
            <span>Thank you! Your feedback has been submitted successfully.</span>
          </div>
        )}

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'var(--card-bg)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px var(--shadow-color)',
          marginBottom: '2rem',
          border: '1px solid var(--input-border)'
        }}>
          {/* Basic Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--text-color)'
              }}>
                Name (Optional)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--text-color)'
              }}>
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          {/* Feedback Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              Feedback Type
            </label>
            <select
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                fontSize: '1rem'
              }}
            >
              <option value="general">General Feedback</option>
              <option value="cultural">Cultural Accuracy</option>
              <option value="technical">Technical Issues</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Bug Report</option>
            </select>
          </div>

          {/* Cultural Accuracy Assessment */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              How would you rate GriotBot's cultural authenticity?
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['Excellent', 'Good', 'Fair', 'Needs Improvement'].map(rating => (
                <label key={rating} style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="culturalAccuracy"
                    value={rating}
                    checked={formData.culturalAccuracy === rating}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ color: 'var(--text-color)' }}>{rating}</span>
                </label>
              ))}
            </div>
          </div>

          {/* User Experience */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              How easy was GriotBot to use?
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['Very Easy', 'Easy', 'Moderate', 'Difficult'].map(rating => (
                <label key={rating} style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="userExperience"
                    value={rating}
                    checked={formData.userExperience === rating}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ color: 'var(--text-color)' }}>{rating}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Feature Suggestions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              What features would you like to see added?
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              rows="3"
              placeholder="Voice interactions, file uploads, community features, etc."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Additional Comments */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              Additional Comments
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Share any other thoughts, suggestions, or experiences..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#ccc' : 'var(--accent-color)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s',
              margin: '0 auto'
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
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Feedback
              </>
            )}
          </button>
        </form>

        {/* Contact Information */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px var(--shadow-color)',
          border: '1px solid var(--input-border)'
        }}>
          <h2 style={{
            color: 'var(--text-color)',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)',
            textAlign: 'center'
          }}>
            Get in Touch
          </h2>
          
          <p style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            color: 'var(--text-color)',
            opacity: 0.8
          }}>
            Have questions or want to connect? Reach out through any of these channels:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '1rem'
          }}>
            {contactLinks.map((contact, index) => (
              <a
                key={index}
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : '_self'}
                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : ''}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-color)',
                  border: '2px solid var(--input-border)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'var(--text-color)',
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px var(--shadow-color)';
                  e.target.style.borderColor = 'var(--accent-color)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'var(--input-border)';
                }}
              >
                <contact.icon size={24} style={{ 
                  color: 'var(--accent-color)', 
                  marginBottom: '0.5rem' 
                }} />
                <span style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  {contact.label}
                </span>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  {contact.value}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Spinning keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .contact-grid, div[style*="grid-template-columns: 1fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        
        @media (max-width: 480px) {
          .contact-grid, div[style*="grid-template-columns: 1fr 1fr 1fr 1fr"],
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </StandardLayout>
  );
}
