// components/layout/NewChatButton.js
import { useRouter } from 'next/router';
import { MessageCirclePlus } from '../components/icons/MessageCirclePlus';
import styles from '../../styles/components/NewChatButton.module.css';

export default function NewChatButton() {
  const router = useRouter();
  const isHome = router.pathname === '/';

  const handleNewChat = () => {
    if (typeof window === 'undefined') return;
    if (isHome) {
      localStorage.removeItem('griotbot-history');
      window.location.reload();
    } else {
      router.push('/?reset=true');
    }
  };

  return (
    <button
      onClick={handleNewChat}
      aria-label="Start new chat"
      title="Start new chat"
      className={styles.button}
    >
      <MessageCirclePlus className={styles.icon} />
    </button>
  );
}
