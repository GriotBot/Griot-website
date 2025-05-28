// File: pages/feedback.js (IMPROVED VERSION)
import { useState } from 'react';
import { Mail, Instagram, Twitter, Linkedin, Send, CheckCircle, AlertCircle } from 'react-feather';
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
  const [submitError, setSubmitError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any previous error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
  };

  // Enhanced form validation
  const validateForm = () => {
    // Check if at least one meaningful field is filled
    const hasContent = formData.message.trim() || 
                      formData.features.trim() || 
                      formData.culturalAccuracy || 
                      formData.userExperience;
    
    if (!hasContent) {
      setSubmitError('Please provide some feedback before submitting.');
      return false;
    }

    // Validate email format if provided
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setSubmitError('Please enter a valid email address.');
        return false;
      }
    }

    return true;
  };

  // Handle form submission with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }
      
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
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
      
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitError('Unable to submit feedback. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact links data with more stable keys
  const contactLinks = [
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      value: 'chat@griotbot.com',
      href: 'mailto:chat@griotbot.com',
      ariaLabel: 'Send email to GriotBot team'
    },
    {
      id: 'instagram',
      icon: Instagram,
      label: 'Instagram', 
      value: '@griotbot',
      href: 'https://www.instagram.com/griotbot',
      ariaLabel: 'Follow GriotBot on Instagram'
    },
    {
      id: 'twitter',
      icon: Twitter,
      label: 'Twitter',
      value: '@griotbot', 
      href: 'https://twitter.com/griotbot',
      ariaLabel: 'Follow GriotBot on Twitter'
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'griotbot',
      href: 'https://www.linkedin.com/company/griotbot',
      ariaLabel: 'Connect with GriotBot on LinkedIn'
    }
  ];

  return (
    <StandardLayout 
      pageType="standard"
      title="GriotBot Feedback - Help Us Improve"
      description="Share your feedback about GriotBot's cultural accuracy, features, and user experience to help us improve"
      currentPath="/feedback"
    >
      <article style={{
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: 1.6,
        padding: '0 1rem'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            color: 'var(--text-color)',
            fontSize: '2rem',
            marginBottom: '0.5rem',
            fontFamily: 'var(--heading-font)',
            margin: '0 0 0.5rem 0'
          }}>
            We'd Love Your Feedback
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-color)',
            opacity: 0.8,
            margin: '0 0 2rem 0'
          }}>
            GriotBot is growing, and your voice helps shape the journey.
          </p>
        </header>

        {/* Success Message */}
        {submitSuccess && (
          <div 
            style={{
              backgroundColor: 'var(--success-bg, #d4edda)',
              color: 'var(--success-text, #155724)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid var(--success-border, #c3e6cb)'
            }}
            role="status"
            aria-live="polite"
          >
            <CheckCircle size={20} aria-hidden="true" />
            <span>Thank you! Your feedback has been submitted successfully.</span>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div 
            style={{
              backgroundColor: 'var(--error-bg, #f8d7da)',
              color: 'var(--error-text, #721c24)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid var(--error-border, #f5c6cb)'
            }}
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle size={20} aria-hidden="true" />
            <span>{submitError}</span>
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
          <div className="form-row" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label 
                htmlFor="feedback-name"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: 'var(--text-color)'
                }}
              >
                Name (Optional)
              </label>
              <input
                id="feedback-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength="100"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
              />
            </div>
            
            <div>
              <label 
                htmlFor="feedback-email"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: 'var(--text-color)'
                }}
              >
                Email (Optional)
              </label>
              <input
                id="feedback-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength="255"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--input-border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
              />
            </div>
          </div>

          {/* Feedback Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="feedback-type"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--text-color)'
              }}
            >
              Feedback Type
            </label>
            <select
              id="feedback-type"
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
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="general">General Feedback</option>
              <option value="cultural-accuracy">Cultural Accuracy</option>
              <option value="technical">Technical Issues</option>
              <option value="feature-request">Feature Request</option>
              <option value="bug">Bug Report</option>
              <option value="compliment">Positive Feedback</option>
            </select>
          </div>

          {/* Cultural Accuracy Assessment */}
          <fieldset style={{ 
            marginBottom: '1.5rem', 
            border: 'none', 
            padding: '0',
            margin: '0 0 1.5rem 0'
          }}>
            <legend style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)',
              fontSize: '1rem'
            }}>
              How would you rate GriotBot's cultural authenticity?
            </legend>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['Excellent', 'Good', 'Fair', 'Needs Improvement'].map(rating => (
                <label key={rating} style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '0.25rem'
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
          </fieldset>

          {/* User Experience */}
          <fieldset style={{ 
            marginBottom: '1.5rem', 
            border: 'none', 
            padding: '0',
            margin: '0 0 1.5rem 0'
          }}>
            <legend style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)',
              fontSize: '1rem'
            }}>
              How easy was GriotBot to use?
            </legend>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['Very Easy', 'Easy', 'Moderate', 'Difficult'].map(rating => (
                <label key={rating} style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '0.25rem'
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
          </fieldset>

          {/* Feature Suggestions */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="feedback-features"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--text-color)'
              }}
            >
              What features would you like to see added?
            </label>
            <textarea
              id="feedback-features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              rows="3"
              maxLength="1000"
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
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
            />
          </div>

          {/* Additional Comments */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="feedback-message"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--text-color)'
              }}
            >
              Additional Comments
            </label>
            <textarea
              id="feedback-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              maxLength="2000"
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
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? 'var(--disabled-color, #ccc)' : 'var(--accent-color)',
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
              transition: 'background-color 0.2s ease, transform 0.2s ease',
              margin: '0 auto',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = 'var(--accent-hover)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
            aria-describedby={submitError ? 'form-error' : undefined}
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
                <Send size={16} aria-hidden="true" />
                Submit Feedback
              </>
            )}
          </button>
        </form>

        {/* Contact Information */}
        <section style={{
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
            textAlign: 'center',
            margin: '0 0 1rem 0'
          }}>
            Get in Touch
          </h2>
          
          <p style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            color: 'var(--text-color)',
            opacity: 0.8,
            margin: '0 0 1.5rem 0'
          }}>
            Have questions or want to connect? Reach out through any of these channels:
          </p>

          <div 
            className="contact-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '1rem'
            }}
          >
            {contactLinks.map((contact) => (
              <a
                key={contact.id}
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : '_self'}
                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : ''}
                aria-label={contact.ariaLabel}
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
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
                  e.currentTarget.style.borderColor = 'var(--accent-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--input-border)';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
                  e.currentTarget.style.borderColor = 'var(--accent-color)';
                  e.currentTarget.style.outline = '2px solid var(--accent-color)';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--input-border)';
                  e.currentTarget.style.outline = 'none';
                }}
              >
                <contact.icon 
                  size={24} 
                  style={{ 
                    color: 'var(--accent-color)', 
                    marginBottom: '0.5rem' 
                  }} 
                  aria-hidden="true"
                />
                <span style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  {contact.label}
                </span>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  {contact.value}
                </span>
              </a>
            ))}
          </div>
        </section>
      </article>

      {/* CSS Animations and Responsive Design */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 1rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 480px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </StandardLayout>
  );
}
