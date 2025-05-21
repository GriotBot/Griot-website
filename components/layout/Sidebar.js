// components/layout/Sidebar.js
import Link from 'next/link';
import styles from '../../styles/components/Sidebar.module.css';
import { useRouter } from 'next/router';
import { Plus } from 'react-feather';

export default function Sidebar({ visible }) {
  const router = useRouter();
  const { pathname } = router;

  return (
    <nav
      className={`${styles.sidebar} ${visible ? styles.open : ''}`}
      aria-hidden={!visible}
      aria-label="Main navigation"
    >
      <h2 className={styles.brand}>
        <span aria-hidden="true" className={styles.brandIcon}>🌿</span>
        GriotBot
      </h2>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Conversations</h3>
        <Link href="/">
          <a
            className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
          >
            <Plus className={styles.linkIcon} /> New Chat
          </a>
        </Link>
        <a href="#" className={styles.link}>Saved Conversations</a>
        <a href="#" className={styles.link}>Saved Stories</a>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Explore</h3>
        <a href="#" className={styles.link}>Historical Figures</a>
        <a href="#" className={styles.link}>Cultural Stories</a>
        <a href="#" className={styles.link}>Diaspora Community</a>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>About</h3>
        <Link href="/about">
          <a
            className={`${styles.link} ${pathname === '/about' ? styles.active : ''}`}
          >
            About GriotBot
          </a>
        </Link>
        <Link href="/feedback">
          <a
            className={`${styles.link} ${pathname === '/feedback' ? styles.active : ''}`}
          >
            Share Feedback
          </a>
        </Link>
      </div>

      <div className={styles.footer}>
        "Preserving our stories,<br/>empowering our future."
      </div>
    </nav>
  );
}
