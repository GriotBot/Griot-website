// =====================================================================================
// OPTION 1: UPDATE STANDARDLAYOUT COMPONENT FOOTER (RECOMMENDED)
// This will automatically update all pages that use StandardLayout
// =====================================================================================

// File: components/layout/StandardLayout.js
// Find the footer section and replace with this updated version:

{/* Enhanced Footer with Legal Links */}
<StandardFooter />

// =====================================================================================
// OPTION 2: UPDATED STANDARDFOOTER COMPONENT
// File: components/layout/StandardFooter.js
// =====================================================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StandardFooter() {
  const [currentProverb, setCurrentProverb] = useState('');

  // Proverbs array with cultural diversity
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
    "The child who is not embraced by the village will burn it down to feel its warmth. — West African Proverb",
    "However long the night, the dawn will break. — African Proverb",
    "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
    "It takes a village to raise a child. — African Proverb",
    "The fool speaks, the wise listen. — Ethiopian Proverb",
    "When the music changes, so does the dance. — Haitian Proverb"
  ];

  // Initialize with random proverb
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * PROVERBS.length);
    setCurrentProverb(PROVERBS[randomIndex]);
  }, []);

  // Get current year for dynamic copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      role="contentinfo"
      aria-label="Page footer with cultural proverb and legal information"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--footer-height-standard, 95px)',
        background: 'var(--footer-background-standard, var(--bg-color))',
        borderTop: '1px solid var(--input-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem',
        zIndex: 50,
        boxSizing: 'border-box'
      }}
    >
      {/* Proverb */}
      <div 
        style={{
          fontSize: '1.05rem',
          fontStyle: 'italic',
          color: 'var(--wisdom-color)',
          textAlign: 'center',
          fontFamily: 'var(--quote-font)',
          opacity: 0.8,
          lineHeight: '1.4',
          maxWidth: '90%'
        }}
        aria-live="polite"
        aria-label="Cultural proverb"
      >
        {currentProverb}
      </div>

      {/* UPDATED: Copyright with Legal Links */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-color)',
          opacity: 0.7,
          textAlign: 'center',
          fontFamily: 'var(--body-font)',
          flexWrap: 'wrap'
        }}
        aria-label="Copyright and legal information"
      >
        {/* Copyright */}
        <span>© {currentYear} GriotBot. All rights reserved.</span>
        
        {/* Separator */}
        <span style={{ opacity: 0.5 }}>|</span>
        
        {/* Terms Link */}
        <Link href="/terms">
          <a 
            style={{
              color: 'var(--text-color)',
              textDecoration: 'none',
              opacity: 0.7,
              transition: 'opacity 0.2s ease',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.7'}
            onFocus={(e) => e.target.style.opacity = '1'}
            onBlur={(e) => e.target.style.opacity = '0.7'}
            aria-label="View Terms and Conditions"
          >
            Terms
          </a>
        </Link>
        
        {/* Privacy Link */}
        <Link href="/privacy">
          <a 
            style={{
              color: 'var(--text-color)',
              textDecoration: 'none',
              opacity: 0.7,
              transition: 'opacity 0.2s ease',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.7'}
            onFocus={(e) => e.target.style.opacity = '1'}
            onBlur={(e) => e.target.style.opacity = '0.7'}
            aria-label="View Privacy and Security Policy"
          >
            Privacy
          </a>
        </Link>
      </div>
    </footer>
  );
}

// =====================================================================================
// OPTION 3: ALTERNATIVE - UPDATE INDIVIDUAL PAGE FOOTERS
// If you prefer to update pages individually instead of StandardLayout
// =====================================================================================

// For pages like index.js that might have custom footer implementations:

{/* Updated Footer Elements for Index Page */}
<div 
  style={{
    position: 'fixed',
    bottom: '30px',
    width: '100%',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    padding: '0 1rem',
    color: 'var(--wisdom-color)',
    transition: 'color 0.3s',
    opacity: 0.8,
    fontFamily: 'var(--quote-font)',
  }}
  aria-live="polite"
  aria-label="Cultural proverb"
>
  {currentProverb}
</div>

<div 
  style={{
    position: 'fixed',
    bottom: '10px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    fontSize: '0.8rem',
    color: 'var(--text-color)',
    opacity: 0.6,
    transition: 'color 0.3s',
    flexWrap: 'wrap',
    padding: '0 1rem'
  }}
  aria-label="Copyright and legal information"
>
  {/* Copyright */}
  <span>© {new Date().getFullYear()} GriotBot. All rights reserved.</span>
  
  {/* Separator */}
  <span style={{ opacity: 0.5 }}>|</span>
  
  {/* Terms Link */}
  <Link href="/terms">
    <a 
      style={{
        color: 'var(--text-color)',
        textDecoration: 'none',
        opacity: 0.6,
        transition: 'opacity 0.2s ease',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px'
      }}
      onMouseEnter={(e) => e.target.style.opacity = '1'}
      onMouseLeave={(e) => e.target.style.opacity = '0.6'}
      aria-label="View Terms and Conditions"
    >
      Terms
    </a>
  </Link>
  
  {/* Privacy Link */}
  <Link href="/privacy">
    <a 
      style={{
        color: 'var(--text-color)',
        textDecoration: 'none',
        opacity: 0.6,
        transition: 'opacity 0.2s ease',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px'
      }}
      onMouseEnter={(e) => e.target.style.opacity = '1'}
      onMouseLeave={(e) => e.target.style.opacity = '0.6'}
      aria-label="View Privacy and Security Policy"
    >
      Privacy
    </a>
    </Link>
</div>

// =====================================================================================
// OPTION 4: ENHANCED FOOTER COMPONENT WITH ADDITIONAL FEATURES
// If you want a more comprehensive footer update
// =====================================================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EnhancedStandardFooter({ 
  showProverbRotation = true, 
  customProverb = null,
  backgroundColor = 'var(--bg-color)',
  className = '',
  showSocialLinks = false 
}) {
  const [currentProverb, setCurrentProverb] = useState('');
  const [proverbIndex, setProverbIndex] = useState(0);

  // Enhanced proverbs array
  const PROVERBS = [
    "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
    "Until the lion learns to write, every story will glorify the hunter. — African Proverb",
    "We are the drums, we are the dance. — Afro-Caribbean Proverb",
    "A tree cannot stand without its roots. — Jamaican Proverb",
    "Unity is strength, division is weakness. — Swahili Proverb",
    "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
    "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
    "However long the night, the dawn will break. — African Proverb",
    "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
    "It takes a village to raise a child. — African Proverb"
  ];

  // Initialize proverb
  useEffect(() => {
    if (customProverb) {
      setCurrentProverb(customProverb);
    } else if (showProverbRotation) {
      const randomIndex = Math.floor(Math.random() * PROVERBS.length);
      setProverbIndex(randomIndex);
      setCurrentProverb(PROVERBS[randomIndex]);
    }
  }, [customProverb, showProverbRotation]);

  return (
    <footer 
      className={className}
      role="contentinfo"
      aria-label="Page footer with proverb and legal information"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: backgroundColor,
        borderTop: '1px solid var(--input-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem',
        minHeight: '95px',
        boxSizing: 'border-box',
        zIndex: 50
      }}
    >
      {/* Proverb Section */}
      <div 
        style={{
          fontSize: '1.05rem',
          fontStyle: 'italic',
          color: 'var(--wisdom-color)',
          textAlign: 'center',
          fontFamily: 'var(--quote-font)',
          opacity: 0.8,
          lineHeight: '1.4',
          maxWidth: '90%'
        }}
        aria-live="polite"
        aria-label="Cultural proverb"
      >
        {currentProverb}
      </div>

      {/* Legal and Copyright Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {/* Social Media Links (Optional) */}
        {showSocialLinks && (
          <nav 
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '0.25rem'
            }}
            aria-label="Social media links"
          >
            <a 
              href="mailto:chat@griotbot.com" 
              style={{
                color: 'var(--accent-color)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                opacity: 0.8,
                transition: 'opacity 0.2s',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}
              aria-label="Send email to GriotBot"
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.8'}
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
                transition: 'opacity 0.2s',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}
              aria-label="Follow GriotBot on Instagram"
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.8'}
            >
              Instagram
            </a>
          </nav>
        )}

        {/* Copyright with Legal Links */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-color)',
            opacity: 0.7,
            textAlign: 'center',
            fontFamily: 'var(--body-font)',
            flexWrap: 'wrap'
          }}
        >
          {/* Copyright */}
          <span>© {new Date().getFullYear()} GriotBot. All rights reserved.</span>
          
          {/* Separator */}
          <span style={{ opacity: 0.5 }}>|</span>
          
          {/* Terms Link */}
          <Link href="/terms">
            <a 
              style={{
                color: 'var(--text-color)',
                textDecoration: 'none',
                opacity: 0.7,
                transition: 'opacity 0.2s ease',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              aria-label="View Terms and Conditions"
            >
              Terms
            </a>
          </Link>
          
          {/* Privacy Link */}
          <Link href="/privacy">
            <a 
              style={{
                color: 'var(--text-color)',
                textDecoration: 'none',
                opacity: 0.7,
                transition: 'opacity 0.2s ease',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              aria-label="View Privacy and Security Policy"
            >
              Privacy
            </a>
          </Link>
        </div>
      </div>
    </footer>
  );
}

// =====================================================================================
// USAGE EXAMPLES
// =====================================================================================

// In StandardLayout.js:
import StandardFooter from './StandardFooter';

// In the return statement:
{pageType === 'index' ? (
  <ChatFooter 
    onSendMessage={onSendMessage}
    disabled={chatDisabled}
  />
) : (
  <StandardFooter />
)}

// For enhanced version with options:
<EnhancedStandardFooter 
  showSocialLinks={true}
  showProverbRotation={true}
/>

// =====================================================================================
// MOBILE RESPONSIVE CSS (Add to globals.css if needed)
// =====================================================================================

/* 
@media (max-width: 600px) {
  .footer-legal-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .footer-legal-links span {
    display: none; // Hide separators on mobile
  }
}
*/
