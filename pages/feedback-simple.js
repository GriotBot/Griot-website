// File: /pages/feedback-simple.js - Client-side email solution
import { useState } from 'react';
import { Mail, Send } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';

export default function SimpleFeedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    culturalAccuracy: '',
    userExperience: '',
    features: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Method 1: Open Gmail compose window
  const sendViaGmailCompose = () => {
    const subject = `GriotBot Feedback: ${formData.feedbackType}`;
    const body = createEmailBody(formData);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=chat@griotbot.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(gmailUrl, '_blank');
  };

  // Method 2: Open default email client
  const sendViaMailto = () => {
    const subject = `GriotBot Feedback: ${formData.feedbackType}`;
    const body = createEmailBody(formData);
    
    const mailtoUrl = `mailto:chat@griotbot.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoUrl;
  };

  // Method 3: Copy to clipboard
  const copyToClipboard = async () => {
    const emailContent = `To: chat@griotbot.com
Subject: GriotBot Feedback: ${formData.feedbackType}

${createEmailBody(formData)}`;

    try {
      await navigator.clipboard.writeText(emailContent);
      alert('Email content copied to clipboard! Paste it into your email client.');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = emailContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Email content copied to clipboard! Paste it into your email client.');
    }
  };

  // Create formatted email body
  const createEmailBody = (data) => {
    const timestamp = new Date().toLocaleString();
    
    return `Hi GriotBot Team,

Here's my feedback submitted on ${timestamp}:

📋 FEEDBACK DETAILS
-------------------
Name: ${data.name || 'Anonymous'}
Email: ${data.email || 'Not provided'}
Type: ${data.feedbackType}
${data.culturalAccuracy ? `Cultural Authenticity: ${data.culturalAccuracy}` : ''}
${data.userExperience ? `User Experience Rating: ${data.userExperience}/5` : ''}

💬 MESSAGE
-----------
${data.message}

${data.features ? `
💡 FEATURE REQUESTS
-------------------
${data.features}
` : ''}

Browser: ${navigator.userAgent}

Thank you for building GriotBot!`;
  };

  const hasContent = formData.message.trim() || formData.features.trim();

  return (
    <StandardLayout 
      pageType="standard"
      title="GriotBot Feedback - Simple Email"
      description="Send feedback about GriotBot directly via email"
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
            📧 Email Your Feedback
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-color)',
            opacity: 0.8
          }}>
            Fill out the form below, then choose how to send it to us!
          </p>
        </header>

        {/* Feedback Form */}
        <form style={{ marginBottom: '2rem' }}>
          {/* Basic Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
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
                placeholder="Your name"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
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
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Feedback Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
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
              <option value="cultural-accuracy">Cultural Accuracy</option>
              <option value="bug">Bug Report</option>
              <option value="suggestion">Feature Suggestion</option>
              <option value="compliment">Compliment</option>
            </select>
          </div>

          {/* Ratings */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Cultural Authenticity
              </label>
              <select
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
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                User Experience
              </label>
              <select
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
          </div>

          {/* Feature Requests */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Features You'd Like to See
            </label>
            <textarea
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Your Feedback *
            </label>
            <textarea
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
              placeholder="Please share your detailed feedback about GriotBot..."
            />
          </div>
        </form>

        {/* Send Options */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid var(--input-border)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: '1.5rem',
            color: 'var(--text-color)',
            textAlign: 'center'
          }}>
            Choose How to Send Your Feedback:
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {/* Gmail Compose */}
            <button
              type="button"
              onClick={sendViaGmailCompose}
              disabled={!hasContent}
              style={{
                padding: '1rem',
                backgroundColor: hasContent ? '#db4437' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: hasContent ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'center'
              }}
            >
              <Mail size={24} />
              <span style={{ fontWeight: '500' }}>Open in Gmail</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Opens Gmail in new tab
              </span>
            </button>

            {/* Default Email Client */}
            <button
              type="button"
              onClick={sendViaMailto}
              disabled={!hasContent}
              style={{
                padding: '1rem',
                backgroundColor: hasContent ? 'var(--accent-color)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: hasContent ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'center'
              }}
            >
              <Send size={24} />
              <span style={{ fontWeight: '500' }}>Open Email App</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Uses your default email
              </span>
            </button>

            {/* Copy to Clipboard */}
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={!hasContent}
              style={{
                padding: '1rem',
                backgroundColor: hasContent ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: hasContent ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                textAlign: 'center'
              }}
            >
              📋
              <span style={{ fontWeight: '500' }}>Copy Email</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Copy & paste manually
              </span>
            </button>
          </div>

          {!hasContent && (
            <p style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: 'var(--text-color)',
              opacity: 0.7,
              fontSize: '0.9rem'
            }}>
              Please fill out the feedback message to enable sending options.
            </p>
          )}
        </div>

        {/* Direct Contact */}
        <div style={{
          textAlign: 'center',
          padding: '1.5rem',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--input-border)'
        }}>
          <p style={{ margin: 0, color: 'var(--text-color)' }}>
            Or email us directly at:{' '}
            <a 
              href="mailto:chat@griotbot.com"
              style={{ 
                color: 'var(--accent-color)', 
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              chat@griotbot.com
            </a>
          </p>
        </div>
      </div>
    </StandardLayout>
  );
}
