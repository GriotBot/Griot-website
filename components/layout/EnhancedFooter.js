// File: /components/layout/EnhancedFooter.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EnhancedFooter({ page = 'index' }) {
  // State for the current proverb
  const [proverb, setProverb] = useState('');
  
  // Collection of proverbs
  const proverbs = [
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

  // Get a random proverb on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * proverbs.length);
    setProverb(proverbs[randomIndex]);
  }, []);

  // Different styles based on the page
  const footerStyle = {
    index: {
      container: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: '1rem', // Space at the bottom
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(transparent, var(--bg-color) 30%)', // Gradient background for better text visibility
        marginTop: 'auto',
        zIndex: 40, // Under the chat form
        pointerEvents: 'none', // Allow clicking through to elements beneath
      },
      proverbContainer: {
        maxWidth: '700px',
        width: '100%',
        textAlign: 'center',
        marginBottom: '0.5rem',
        paddingBottom: '0.5rem',
        position: 'relative',
      },
      proverbText: {
        fontFamily: 'Lora, serif',
        fontSize: '0.9rem',
        fontStyle: 'italic',
        color: 'var(--wisdom-color)',
        opacity: 0.9,
        margin: 0,
        padding: '0 1.5rem',
        display: 'inline-block',
        position: 'relative',
      },
      bottomBar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.5rem 1rem',
      },
      copyright: {
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.7,
        textAlign: 'center',
      },
    },
    other: {
      // Styles for non-index pages - more opaque background
      container: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: '0.5rem',
        background: 'var(--bg-color)', // Fully opaque background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 40,
        pointerEvents: 'none',
        borderTop: '1px solid var(--input-border)',
      },
      proverbContainer: {
        width: '100%',
        textAlign: 'center',
        marginBottom: '0.25rem',
        backgroundColor: 'var(--bg-color)', // Ensure opacity
      },
      proverbText: {
        fontFamily: 'Lora, serif',
        fontSize: '0.85rem',
        fontStyle: 'italic',
        color: 'var(--wisdom-color)',
        opacity: 0.85,
        padding: '0 1rem',
      },
      bottomBar: {
        width: '100%',
        textAlign: 'center',
        backgroundColor: 'var(--bg-color)', // Ensure opacity
      },
      copyright: {
        fontSize: '0.75rem',
        color: 'var(--text-color)',
        opacity: 0.7,
      },
    }
  };

  // Select the appropriate style based on the page
  const style = footerStyle[page === 'index' ? 'index' : 'other'];

  return (
    <footer style={style.container}>
      {/* Proverb Section */}
      <div style={style.proverbContainer}>
        <p style={style.proverbText} aria-label="Wisdom proverb">
          {proverb}
        </p>
      </div>

      {/* Bottom Bar */}
      <div style={style.bottomBar}>
        <p style={style.copyright}>
          © 2025 GriotBot. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
