// File: /pages/feedback.js - FIXED VERSION
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

  // FIXED: Handle form submission with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting feedback:', formData); // Debug log

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

      console.log('Response status:', response.status); // Debug log
      console.log('Response ok:', response.ok); // Debug log

      // FIXED: Better response handling
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData); // Debug log
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Invalid response format from server');
      }

      // FIXED: Check for success in response data, not just HTTP status
      if (response.ok && responseData.success) {
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
      } else {
        // Handle API error response
        throw new Error(responseData.error || `Server error: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Feedback submission error:', error);
      
      // FIXED: More specific error messages
      let errorMessage = 'Unable to submit feedback. ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.message.includes('Invalid response')) {
        errorMessage += 'Server response error. Please try again.';
      } else {
        errorMessage += error.message || 'Please try again or contact us directly.';
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact links data
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
      title="GriotBot Feedback"
      description="Share your feedback about GriotBot - help us build a better digital griot experience"
      currentPath="/feedback"
    >
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: 1.6,
        padding: '0 1rem'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            color: 'var(--text-color)',
            fontSize: '2rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)'
          }}>
            We'd Love Your Feedback
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-color)',
            opacity: 0.8
          }}>
            GriotBot is growing, and your voice helps shape the journey. Share your thoughts on cultural authenticity, user experience, and features you'd like to see.
          </p>
        </header>

        {/* Success Message */}
        {submitSuccess && (
          <div style={{
            backgroundColor: 'var(--success-bg, #d4edda)',
            color: 'var(--success-text, #155724)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid var(--success-border, #c3e6cb)'
          }}>
            <CheckCircle size={20} />
            <span>Thank you for your feedback! Your input helps us build a better GriotBot experience.</span>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div style={{
            backgroundColor: 'var(--error-bg, #f8d7da)',
            color: 'var(--error-text, #721c24)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            border: '1px solid var(--error-border, #f5c6cb)'
          }}>
            <AlertCircle size={20} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>{submitError}</span>
          </div>
        )}

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
          {/* Contact Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <label htmlFor="name" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--text-color)'
              }}>
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
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
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--text-color)'
              }}>
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
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
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Feedback Type */}
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="feedbackType" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              Feedback Type
            </label>
            <select
              id="feedbackType"
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
              <option value="cultural-accuracy">Cultural Accuracy</option>
              <option value="bug">Bug Report</option>
              <option value="suggestion">Feature Suggestion</option>
              <option value="compliment">Compliment</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Beta Testing Questions */}
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="culturalAccuracy" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              Cultural Authenticity Rating
            </label>
            <select
              id="culturalAccuracy"
              name="culturalAccuracy"
              value={formData.culturalAccuracy}
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
              <option value="">Select rating...</option>
              <option value="excellent">Excellent - Very authentic and respectful</option>
              <option value="good">Good - Mostly accurate with minor issues</option>
              <option value="fair">Fair - Some concerns about accuracy</option>
              <option value="poor">Poor - Significant cultural issues</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="userExperience" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              Overall User Experience
            </label>
            <select
              id="userExperience"
              name="userExperience"
              value={formData.userExperience}
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
              <option value="">Select rating...</option>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>

          {/* Features Request */}
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="features" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              Features You'd Like to See
            </label>
            <textarea
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="What features would make GriotBot more useful for you?"
            />
          </div>

          {/* Main Message */}
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="message" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: 'var(--text-color)'
            }}>
              Your Feedback *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--input-border)',
                borderRadius: '8px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Please share your detailed feedback about GriotBot. What's working well? What could be improved? How authentic do the cultural responses feel to you?"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? 'var(--disabled-color, #6c757d)' : 'var(--accent-color)',
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
              margin: '0 auto',
              transition: 'background-color 0.2s'
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
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            color: 'var(--text-color)',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontFamily: 'var(--heading-font)'
          }}>
            Get in Touch
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '1rem'
          }}>
            {contactLinks.map(({ id, icon: Icon, label, value, href, ariaLabel }) => (
              <a
                key={id}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={ariaLabel}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '1.5rem 1rem',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--input-border)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'var(--text-color)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 2px 4px var(--shadow-color)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px var(--shadow-color)';
                }}
              >
                <Icon size={24} style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }} />
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{label}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{value}</span>
              </a>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </StandardLayout>
  );
}
