// components/layout/EnhancedSidebar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/components/EnhancedSidebar.module.css';

export default function EnhancedSidebar({ visible, closeSidebar }) {
  const { pathname } = useRouter();
  const [hovered, setHovered] = useState({});

  useEffect(() => {
    if (visible) {
      document.querySelector('#return-to-chat')?.focus();
    }
  }, [visible]);

  const onHover = (key, flag) =>
    setHovered(prev => ({ ...prev, [key]: flag }));

  return (
    <nav
      id="sidebar"
      className={`${styles.sidebar} ${visible ? styles.visible : ''}`}
      aria-label="Main navigation"
      aria-hidden={!visible}
    >
      <div className={styles.returnWrapper}>
        <Link href="/">
          <a
            id="return-to-chat"
            className={`
              ${styles.returnBtn}
              ${hovered['return']} ? ${styles.hovered} : ''
            `}
            onClick={closeSidebar}
            onMouseEnter={() => onHover('return', true)}
            onMouseLeave={() => onHover('return', false)}
          >
            Return to chat
          </a>
        </Link>
      </div>

      <div className={styles.tagline}>
        Preserving our stories,<br />
        empowering our future.
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <ul className={styles.navList}>
        <li>
          <Link href="/about">
            <a
              className={`${styles.link} ${
                pathname === '/about' ? styles.active : ''
              }`}
            >
              About GriotBot
            </a>
          </Link>
        </li>
        <li>
          <Link href="/feedback">
            <a
              className={`${styles.link} ${
                pathname === '/feedback' ? styles.active : ''
              }`}
            >
              Feedback
            </a>
          </Link>
        </li>
        <li className={styles.section}>
          <span className={styles.sectionTitle}>Conversations</span>
          <ul>
            <li>
              <Link href="/">
                <a
                  className={`${styles.sublink} ${
                    pathname === '/' ? styles.active : ''
                  }`}
                >
                  + New Chat
                </a>
              </Link>
            </li>
            <li>
              <a className={styles.sublink}>Saved Chats</a>
            </li>
            <li>
              <a className={styles.sublink}>Saved Stories</a>
            </li>
          </ul>
        </li>
        <li className={styles.section}>
          <span className={styles.sectionTitle}>Explore</span>
          <ul>
            <li><a className={styles.sublink}>Historical Figures</a></li>
            <li><a className={styles.sublink}>Cultural Stories</a></li>
            <li><a className={styles.sublink}>Diaspora Community</a></li>
          </ul>
        </li>
      </ul>

      <div className={styles.version}>GriotBot v1.0</div>
    </nav>
  );
}
