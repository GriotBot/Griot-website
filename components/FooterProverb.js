// File: /components/FooterProverb.js
import { useState, useEffect } from 'react';

export default function FooterProverb() {
  const [proverb, setProverb] = useState("Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb");

  useEffect(() => {
    // List of proverbs
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
    
    // Select a random proverb
    const randomIndex = Math.floor(Math.random() * proverbs.length);
    setProverb(proverbs[randomIndex]);
  }, []);

  return (
    <div 
      id="footer-proverb"
      className="footer-proverb-component" 
      style={{
        position: 'fixed',
        bottom: '30px',
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontStyle: 'italic',
        padding: '0 1rem',
        color: 'var(--wisdom-color, #6b4226)',
        fontFamily: 'Lora, serif',
        background: 'linear-gradient(transparent, var(--bg-color, #f8f5f0) 50%)',
        zIndex: 999, // Very high z-index to ensure visibility
        pointerEvents: 'none',
      }}
    >
      <span>{proverb}</span>
    </div>
  );
}
