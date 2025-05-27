// File: components/layout/EnhancedFooter.js
import { useState, useEffect } from 'react';

export default function EnhancedFooter({ 
  showProverbRotation = true, 
  customProverb = null,
  backgroundColor = 'var(--bg-color)',
  className = '' 
}) {
  const [currentProverb, setCurrentProverb] = useState('');
  const [proverbIndex, setProverbIndex] = useState(0);

  // Enhanced proverbs array with more cultural diversity
  const ENHANCED_PROVERBS = [
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
    "When the music changes, so does the dance. — Haitian Proverb",
    "The best way to eat an elephant in your path is to cut it up into little pieces. — African Proverb",
    "When the spider webs unite, they can tie up a lion. — Ethiopian Proverb",
    "Smooth seas do not make skillful sailors. — African Proverb"
  ];

  // Initialize proverb
  useEffect(() => {
    if (customProverb) {
      setCurrentProverb(customProverb);
    } else if (showProverbRotation) {
      const randomIndex = Math.floor(Math.random() * ENHANCED_PROVERBS.length);
      setProverbIndex(randomIndex);
      setCurrentProverb(ENHANCED_PROVERBS[randomIndex]);
    }
  }, [customProverb, showProverbRotation]);

  // Optional: Auto-rotate proverbs every 30 seconds
  useEffect(() => {
    if (showProverbRotation && !customProverb) {
      const interval = setInterval(() => {
        setProverbIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % ENHANCED_PROVERBS.length;
          setCurrentProverb(ENHANCED_PROVERBS[nextIndex]);
          return nextIndex;
        });
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [showProverbRotation, customProverb]);

  return (
    <footer 
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        background: backgroundColor,
        borderTop: '1px solid var(--input-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1.5rem 1rem',
        minHeight: '120px',
        boxSizing: 'border-box'
      }}
    >
      {/* Enhanced Proverb Section with Animation */}
      <div style={{
        fontSize: '1.1rem',
        fontStyle: 'italic',
        color: 'var(--wisdom-color)',
        textAlign: 'center',
        fontFamily: 'var(--quote-font)',
        opacity: 0.9,
        lineHeight: '1.5',
        maxWidth: '85%',
        margin: '0 auto',
        transition: 'opacity 0.3s ease-in-out',
        position: 'relative'
      }}>
        {currentProverb}
        
        {/* Optional proverb counter for enhanced version */}
        {showProverbRotation && !customProverb && (
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '0',
            fontSize: '0.7rem',
            opacity: 0.4,
            color: 'var(--text-color)'
          }}>
            {proverbIndex + 1}/{ENHANCED_PROVERBS.length}
          </div>
        )}
      </div>

      {/* Enhanced Copyright with Social Links */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {/* Social Media Links */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '0.25rem'
        }}>
          <a 
            href="mailto:chat@griotbot.com" 
            style={{
              color: 'var(--accent-color)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '1'}
            onMouseOut={(e) => e.target.style.opacity = '0.8'}
          >
            Email
          </a>
          <a 
            href="https://www.instagram.com/griotbot" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-color)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '1'}
            onMouseOut={(e) => e.target.style.opacity = '0.8'}
          >
            Instagram
          </a>
          <a 
            href="https://twitter.com/griotbot" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-color)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '1'}
            onMouseOut={(e) => e.target.style.opacity = '0.8'}
          >
            Twitter
          </a>
        </div>

        {/* Copyright */}
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--text-color)',
          opacity: 0.6,
          textAlign: 'center',
          fontFamily: 'var(--body-font)'
        }}>
          © 2025 GriotBot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
