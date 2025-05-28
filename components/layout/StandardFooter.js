// File: components/layout/StandardFooter.js
import { useState, useEffect } from 'react';

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
      aria-label="Page footer with cultural proverb and copyright information"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--footer-height-standard)',
        background: 'var(--footer-background-standard, rgb(239, 230, 223))', // CSS variable with fallback
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
          fontSize: '1.05rem', // Slightly larger as requested
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

      {/* Copyright */}
      <div 
        style={{
          fontSize: '0.8rem',
          color: 'var(--text-color)',
          opacity: 0.6,
          textAlign: 'center',
          fontFamily: 'var(--body-font)'
        }}
        aria-label="Copyright information"
      >
        © {currentYear} GriotBot. All rights reserved.
      </div>
    </footer>
  );
}
