// File: pages/comingsoon.js - With Formspree Integration
import { useState } from 'react';
import { Clock, User, Upload, Settings, Mic, Mail } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';

// Static data is correctly placed outside the component.
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

export default function ComingSoon() {
  // State is simplified. We only need to control the email input field.
  const [email, setEmail] = useState('');

  // Styles are kept as constants for cleaner JSX.
  const CARD_STYLES = {
    backgroundColor: 'var(--card-bg)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow-color)',
    border: '1px solid var(--input-border)',
    textAlign: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
    transition: 'background-color 0.2s ease',
  };

  // Hover handlers are simplified as we no longer manage complex state.
  const handleCardHover = (e, isHovering) => {
    e.currentTarget.style.transform = isHovering ? 'translateY(-5px)' : 'translateY(0)';
    e.currentTarget.style.boxShadow = isHovering ? '0 8px 20px var(--shadow-color)' : '0 4px 12px var(--shadow-color)';
  };

  const handleButtonHover = (e, isHovering) => {
    e.currentTarget.style.backgroundColor = isHovering ? 'var(--accent-hover)' : 'var(--accent-color)';
  };

  return (
    <StandardLayout 
      pageType="standard"
      title="Coming Soon - GriotBot Features"
      description="Exciting new features coming to GriotBot - user accounts, file uploads, voice interactions, and personalization"
      currentPath="/comingsoon"
    >
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '0 1rem 4rem 1rem' }}>
        
        {/* Hero Section */}
        <header style={{ marginBottom: '3rem', padding: '2rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
            <Clock size={80} aria-hidden="true" />
          </div>
          <h1 style={{ color: 'var(--text-color)', fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--heading-font)' }}>
            Exciting Features Coming Soon
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-color)', opacity: 0.8, maxWidth: '600px', margin: '0 auto 2rem' }}>
            We're working hard to bring you new ways to connect with your heritage and expand your cultural knowledge through innovative AI features.
          </p>
        </header>

        {/* Feature Previews */}
        <section 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}
          aria-labelledby="upcoming-features-heading"
        >
          <h2 id="upcoming-features-heading" style={{ gridColumn: '1 / -1', fontSize: '1.75rem', marginBottom: '1rem', fontFamily: 'var(--heading-font)' }}>
            What's on the Horizon
          </h2>
          {upcomingFeatures.map((feature) => (
            <article
              key={feature.id}
              style={CARD_STYLES}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              tabIndex="0"
              role="article"
              aria-labelledby={`feature-${feature.id}-title`}
            >
              <div style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                <feature.icon size={48} aria-hidden="true" />
              </div>
              <h3 id={`feature-${feature.id}-title`} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontFamily: 'var(--heading-font)' }}>
                {feature.title}
              </h3>
              <p style={{ opacity: 0.8, margin: 0 }}>
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        {/* Email Notification Signup */}
        <section 
          style={{ ...CARD_STYLES, padding: '2.5rem', marginBottom: '2rem' }}
          aria-labelledby="signup-heading"
        >
          <h2 id="signup-heading" style={{ fontSize: '1.75rem', marginBottom: '1rem', fontFamily: 'var(--heading-font)' }}>
            Be the First to Know
          </h2>
          <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
            Get notified when these features launch. No spam, just updates on GriotBot's journey.
          </p>
          
          {/* FIXED: Replaced JavaScript handler with a standard HTML form submission for reliability. */}
          <form 
            action="https://formspree.io/f/xwpbndbo" // <-- PASTE YOUR URL HERE
            method="POST"
            style={{ display: 'flex', gap: '0.75rem', maxWidth: '400px', margin: '0 auto' }}
          >
            <label htmlFor="email-subscribe" className="sr-only">Email Address</label>
            <input
              id="email-subscribe"
              type="email"
              name="Subscribe Form" // This name is used by Formspree
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              style={{
                width: '100%',
                flex: 1,
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
              style={BUTTON_STYLES}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              <Mail size={16} aria-hidden="true" />
              Notify Me
            </button>
          </form>
        </section>
      </div>

      {/* Added sr-only class for accessibility */}
      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </StandardLayout>
  );
}
