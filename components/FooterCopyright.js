// components/FooterCopyright.js
import styles from '../styles/components/FooterCopyright.module.css';

export default function FooterCopyright() {
  return (
    <div className={styles.copyright} aria-label="Copyright information">
      © {new Date().getFullYear()} GriotBot. All rights reserved.
    </div>
  );
}
