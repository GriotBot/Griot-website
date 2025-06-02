// File: /pages/feedback.js - ENHANCED VERSION WITH RESEND
import { useState } from 'react';
import { Mail, Instagram, Twitter, Linkedin, Send, CheckCircle, AlertCircle, Heart } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    culturalAccuracy: '',
    userExperience: '',
    features: [],
    usageFrequency: '',
    recommendation: '',
    improvements: [],
    message: '',
    allowFollow: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'features' || name === 'improvements') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear any previous error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
  };

  // Enhanced form validation
  const validateForm = () => {
    // Check if at least one meaningful field is filled
    const hasContent = formData.message.trim() || 
                      formData.features.length > 0 || 
                      formData.improvements.length > 0 ||
                      formData.culturalAccuracy || 
                      formData.userExperience ||
                      formData.recommendation;
    
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

  // Handle form submission with Resend integration
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
          userAgent: navigator.userAgent,
          source: 'enhanced_feedback_form'
        }),
      });

      console.log('Response status:', response.status);

      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Invalid response format from server');
      }

      if (response.ok && responseData.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          feedbackType: 'general',
          culturalAccuracy: '',
          userExperience: '',
          features: [],
          usageFrequency: '',
          recommendation: '',
          improvements: [],
          message: '',
          allowFollow: false
        });
        
        // Auto-hide success message after 8 seconds
        setTimeout(() => setSubmitSuccess(false), 8000);
      } else {
        throw new Error(responseData.error || `Server error: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Feedback submission error:', error);
      
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

  // Feature options for checkboxes
  const featureOptions = [
    { id: 'voice', label: 'Voice interaction (speak with GriotBot)' },
    { id: 'mobile', label: 'Mobile app' },
    { id: 'history', label: 'Save conversation history' },
    { id: 'sharing', label: 'Share stories with community' },
    { id: 'personalization', label: 'Remember my preferences' },
    { id: 'offline', label: 'Offline access to stories' },
    { id: 'multimedia', label: 'Images and videos in responses' },
    { id: 'languages', label: 'Multiple languages support' }
  ];

  const improvementOptions = [
    { id: 'response_speed', label: 'Faster response times' },
    { id: 'cultural_depth', label: 'More detailed cultural context' },
    { id: 'modern_topics', label: 'More contemporary cultural topics' },
    { id: 'storytelling', label: 'Better storytelling capabilities' },
    { id: 'accuracy', label: 'Improved historical accuracy' },
    { id: 'interface', label: 'Better user interface' },
    { id: 'search', label: 'Ability to search past conversations' },
    { id: 'community', label: 'Connect with other users' }
  ];

  return (
    <StandardLayout 
      pageType="standard"
      title="GriotBot Beta Feedback"
      description="Help shape the future of GriotBot - share your beta testing feedback"
      currentPath="/feedback"
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: 1.6,
        padding: '0 1rem'
      }}>
        {/* Hero Section */}
        <header style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          background: 'linear-gradient(135deg, var(--accent-color), #e08e59)',
          color: 'white',
          padding: '3rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(215, 114, 44, 0.3)'
        }}>
          <Heart size={48} style={{ marginBottom: '1rem' }} />
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)',
            fontWeight: '700'
          }}>
            Help Us Build Something Amazing
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.95,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            You're part of GriotBot's beta journey! Your feedback shapes how we preserve and share African diaspora culture through AI. Every insight helps us build a more authentic, meaningful experience.
          </p>
        </header>

        {/* Success Message */}
        {submitSuccess && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            border: '1px solid #c3e6cb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CheckCircle size={24} />
            <div>
              <strong>Thank you for your valuable feedback!</strong>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8 }}>
                Your insights help us build a better GriotBot experience for the entire community.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            border: '1px solid #f5c6cb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <AlertCircle size={24} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>{submitError}</span>
          </div>
        )}

        {/* Main Feedback Form */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 8px 32px var(--shadow-color)',
          border: '1px solid var(--input-border)',
          marginBottom: '3rem'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Contact Information Section */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={{
                color: 'var(--accent-color)',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                fontFamily: 'var(--heading-font)',
                borderBottom: '2px solid var(--accent-color)',
                paddingBottom: '0.5rem'
              }}>
                📝 Your Information (Optional)
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                <div>
                  <label htmlFor="name" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: 'var(--text-color)'
                  }}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid var(--input-border)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--input-text)',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="Your name"
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
                  />
                </div>

                <div>
                  <label htmlFor="email" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: 'var(--text-color)'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid var(--input-border)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--input-bg)',
                      color: 'var(--input-text)',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="your.email@example.com"
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
                  />
                </div>
              </div>
            </section>

            {/* Experience Rating Section */}
            <section style={{
              marginBottom: '3rem',
              backgroundColor: '#fff5f0',
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #ffe5d4'
            }}>
              <h2 style={{
                color: 'var(--accent-color)',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                fontFamily: 'var(--heading-font)'
              }}>
                🌟 Your GriotBot Experience
              </h2>

              {/* Cultural Authenticity */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-color)',
                  fontSize: '1.1rem'
                }}>
                  How authentic do GriotBot's cultural responses feel to you?
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { value: 'excellent', label: '🔥 Excellent - Very authentic and respectful' },
                    { value: 'good', label: '👍 Good - Mostly accurate with minor issues' },
                    { value: 'fair', label: '🤔 Fair - Some concerns about accuracy' },
                    { value: 'poor', label: '😕 Poor - Significant cultural issues' }
                  ].map(option => (
                    <label key={option.value} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: formData.culturalAccuracy === option.value ? '#e8f5e8' : 'white',
                      border: formData.culturalAccuracy === option.value ? '2px solid var(--accent-color)' : '2px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                      <input
                        type="radio"
                        name="culturalAccuracy"
                        value={option.value}
                        checked={formData.culturalAccuracy === option.value}
                        onChange={handleChange}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <span style={{ fontSize: '1rem' }}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Overall Experience */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-color)',
                  fontSize: '1.1rem'
                }}>
                  Overall, how would you rate your experience with GriotBot?
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { value: '5', label: '⭐⭐⭐⭐⭐ Amazing - Exceeded expectations' },
                    { value: '4', label: '⭐⭐⭐⭐ Very Good - Impressed overall' },
                    { value: '3', label: '⭐⭐⭐ Good - Solid experience' },
                    { value: '2', label: '⭐⭐ Fair - Some issues to work out' },
                    { value: '1', label: '⭐ Poor - Needs significant improvement' }
                  ].map(option => (
                    <label key={option.value} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: formData.userExperience === option.value ? '#e8f5e8' : 'white',
                      border: formData.userExperience === option.value ? '2px solid var(--accent-color)' : '2px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                      <input
                        type="radio"
                        name="userExperience"
                        value={option.value}
                        checked={formData.userExperience === option.value}
                        onChange={handleChange}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <span style={{ fontSize: '1rem' }}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Usage Frequency */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-color)',
                  fontSize: '1.1rem'
                }}>
                  How often do you use GriotBot?
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { value: 'daily', label: '📅 Daily - It\'s part of my routine' },
                    { value: 'weekly', label: '🗓️ Weekly - Regular check-ins' },
                    { value: 'monthly', label: '📆 Monthly - Occasional use' },
                    { value: 'rarely', label: '🤷 Rarely - Just trying it out' }
                  ].map(option => (
                    <label key={option.value} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: formData.usageFrequency === option.value ? '#e8f5e8' : 'white',
                      border: formData.usageFrequency === option.value ? '2px solid var(--accent-color)' : '2px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                      <input
                        type="radio"
                        name="usageFrequency"
                        value={option.value}
                        checked={formData.usageFrequency === option.value}
                        onChange={handleChange}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <span style={{ fontSize: '1rem' }}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-color)',
                  fontSize: '1.1rem'
                }}>
                  Would you recommend GriotBot to others in your community?
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { value: 'definitely', label: '💯 Definitely - Already telling people about it!' },
                    { value: 'probably', label: '👍 Probably - Once some improvements are made' },
                    { value: 'maybe', label: '🤷 Maybe - Depends on who\'s asking' },
                    { value: 'no', label: '👎 No - Not in its current state' }
                  ].map(option => (
                    <label key={option.value} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: formData.recommendation === option.value ? '#e8f5e8' : 'white',
                      border: formData.recommendation === option.value ? '2px solid var(--accent-color)' : '2px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                      <input
                        type="radio"
                        name="recommendation"
                        value={option.value}
                        checked={formData.recommendation === option.value}
                        onChange={handleChange}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <span style={{ fontSize: '1rem' }}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section style={{
              marginBottom: '3rem',
              backgroundColor: '#f0f9ff',
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #bfdbfe'
            }}>
              <h2 style={{
                color: 'var(--accent-color)',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                fontFamily: 'var(--heading-font)'
              }}>
                🚀 Features You'd Love to See
              </h2>
              
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-color)', opacity: 0.8 }}>
                Check all the features that would make GriotBot more valuable for you:
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {featureOptions.map(option => (
                  <label key={option.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: formData.features.includes(option.id) ? '#dbeafe' : 'white',
                    border: formData.features.includes(option.id) ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="checkbox"
                      name="features"
                      value={option.id}
                      checked={formData.features.includes(option.id)}
                      onChange={handleChange}
                      style={{ 
                        marginRight: '0.75rem',
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--accent-color)'
                      }}
                    />
                    <span style={{ fontSize: '0.95rem' }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Improvements Section */}
            <section style={{
              marginBottom: '3rem',
              backgroundColor: '#fefce8',
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #fef08a'
            }}>
              <h2 style={{
                color: 'var(--accent-color)',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                fontFamily: 'var(--heading-font)'
              }}>
                ⚡ Priority Improvements
              </h2>
              
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-color)', opacity: 0.8 }}>
                What should we focus on improving first? Select your top priorities:
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {improvementOptions.map(option => (
                  <label key={option.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: formData.improvements.includes(option.id) ? '#fef3c7' : 'white',
                    border: formData.improvements.includes(option.id) ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="checkbox"
                      name="improvements"
                      value={option.id}
                      checked={formData.improvements.includes(option.id)}
                      onChange={handleChange}
                      style={{ 
                        marginRight: '0.75rem',
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--accent-color)'
                      }}
                    />
                    <span style={{ fontSize: '0.95rem' }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Detailed Feedback */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={{
                color: 'var(--accent-color)',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                fontFamily: 'var(--heading-font)',
                borderBottom: '2px solid var(--accent-color)',
                paddingBottom: '0.5rem'
              }}>
                💬 Tell Us More
              </h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <label htmlFor="message" style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--text-color)',
                  fontSize: '1.1rem'
                }}>
                  Share your detailed thoughts, experiences, or suggestions
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid var(--input-border)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit'
                  }}
                  placeholder="What's working well? What needs improvement? How do the cultural responses feel to you? Any specific examples or stories to share? The more detail, the better we can serve our community!"
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
                />
              </div>

              {/* Follow-up Permission */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  name="allowFollow"
                  checked={formData.allowFollow}
                  onChange={handleChange}
                  style={{ 
                    marginRight: '0.75rem',
                    width: '18px',
                    height: '18px',
                    accentColor: 'var(--accent-color)'
                  }}
                />
                <span style={{ fontSize: '0.95rem' }}>
                  I'm open to follow-up questions about my feedback to help improve GriotBot
                </span>
              </label>
            </section>

            {/* Submit Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? '#9ca3af' : 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 3rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  margin: '0 auto',
                  transition: 'all 0.2s',
                  transform: isSubmitting ? 'scale(0.98)' : 'scale(1)',
                  boxShadow: isSubmitting ? '0 4px 12px rgba(0,0,0,0.1)' : '0 8px 24px rgba(215, 114, 44, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 12px 32px rgba(215, 114, 44, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 8px 24px rgba(215, 114, 44, 0.3)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #fff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Sending Your Feedback...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Share Your Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <section style={{ 
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: 'var(--text-color)',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)'
          }}>
            💬 Other Ways to Connect
          </h2>
          
          <p style={{
            marginBottom: '2rem',
            color: 'var(--text-color)',
            opacity: 0.8,
            fontSize: '1.1rem'
          }}>
            Join our community and stay updated on GriotBot's journey
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto'
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
                  border: '2px solid var(--input-border)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'var(--text-color)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px var(--shadow-color)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px var(--shadow-color)';
                  e.currentTarget.style.borderColor = 'var(--accent-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
                  e.currentTarget.style.borderColor = 'var(--input-border)';
                }}
              >
                <Icon size={28} style={{ color: 'var(--accent-color)', marginBottom: '0.75rem' }} />
                <span style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>{label}</span>
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>{value}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Thank You Section */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f5f0, #fff)',
          padding: '2.5rem',
          borderRadius: '16px',
          textAlign: 'center',
          border: '2px solid var(--accent-color)',
          boxShadow: '0 8px 32px rgba(215, 114, 44, 0.1)'
        }}>
          <h3 style={{
            color: 'var(--accent-color)',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)'
          }}>
            🙏 Thank You for Being Part of Our Journey
          </h3>
          <p style={{
            color: 'var(--text-color)',
            opacity: 0.9,
            fontSize: '1.1rem',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Every piece of feedback helps us build a more authentic, meaningful AI experience 
            for the African diaspora community. Together, we're preserving culture and 
            empowering voices through technology.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr !important;
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
