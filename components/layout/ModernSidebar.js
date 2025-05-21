import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Info,
  Book,
  Users,
  Send,
  Archive,
  HelpCircle,
  XCircle
} from 'react-feather';
import { MessageCirclePlus } from '../icons/MessageCirclePlus';
import styles from '../../styles/components/ModernSidebar.module.css';

export default function ModernSidebar({ visible, closeSidebar }) {
  const { pathname } = useRouter();
  const [hovered, setHovered] = useState({});

  const hover = (id, flag) => setHovered(h => ({ ...h, [id]: flag }));

  return (
    <nav
      className={`${styles.sidebar} ${visible ? styles.open : ''}`}
      aria-hidden={!visible}
      aria-label="Main navigation"
      onClick={e => e.target === e.currentTarget && closeSidebar()}
    >
      {!pathname.includes('/') && (
        <button
          onClick={closeSidebar}
          className={styles.closeBtn}
          onMouseEnter={() => hover('close', true)}
          onMouseLeave={() => hover('close', false)}
          aria-label="Close sidebar"
        >
          <XCircle size={24} />
        </button>
      )}

      <div className={styles.brand}>
        <Link href="/"><a className={styles.brandLink} onClick={closeSidebar}>
          <Home size={18} />
          Return to Chat
        </a></Link>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Conversations</h3>
        <Link href="/">
          <a
            className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <MessageCirclePlus size={18} />
            New Chat
          </a>
        </Link>
        <a href="#" className={styles.link}>
          <Archive size={18} /> Saved Conversations
        </a>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Explore</h3>
        <a href="#" className={styles.link}>
          <Book size={18} /> Historical Figures
        </a>
        <a href="#" className={styles.link}>
          <Send size={18} /> Cultural Stories
        </a>
        <a href="#" className={styles.link}>
          <Users size={18} /> Diaspora Community
        </a>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>About</h3>
        <Link href="/about">
          <a
            className={`${styles.link} ${pathname === '/about' ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <Info size={18} /> About GriotBot
          </a>
        </Link>
        <Link href="/feedback">
          <a
            className={`${styles.link} ${pathname === '/feedback' ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <HelpCircle size={18} /> Share Feedback
          </a>
        </Link>
      </div>

      <div className={styles.footerQuote}>
        "Preserving our stories,<br/>empowering our future."
      </div>

      <div className={styles.version}>GriotBot v1.0</div>
    </nav>
  );
}
