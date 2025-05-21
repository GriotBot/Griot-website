// components/layout/EnhancedFooter.js
import { useState, useEffect } from 'react';
import styles from '../../styles/components/EnhancedFooter.module.css';

export default function EnhancedFooter({ page = 'index' }) {
  const [proverb, setProverb] = useState('');
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

  useEffect(() => {
    setProverb(proverbs[Math.floor(Math.random() * proverbs.length)]);
  }, []);

  const variant = page === 'index' ? 'index' : 'other';

  return (
    <footer className={styles[`${variant}Container`]}>
      <div className={styles[`${variant}ProverbContainer`]}>  
        <p className={styles[`${variant}ProverbText`]} aria-label="Wisdom proverb">
          {proverb}
        </p>
      </div>
      <div className={styles[`${variant}BottomBar`]}>  
        <p className={styles[`${variant}Copyright`]}>© 2025 GriotBot. All rights reserved.</p>
      </div>
    </footer>
  );
}
