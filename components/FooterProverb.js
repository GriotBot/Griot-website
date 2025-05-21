// components/FooterProverb.js
import { useAppContext } from '../context/AppContext';
import styles from '../styles/components/FooterProverb.module.css';

export default function FooterProverb() {
  const { currentProverb } = useAppContext();

  return (
    <div
      className={styles.proverb}
      aria-label={`Proverb: ${currentProverb}`}
    >
      {currentProverb}
    </div>
  );
}
