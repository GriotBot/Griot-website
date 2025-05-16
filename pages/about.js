import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/About.module.css';

export default function About() {
  // Ensure page is scrollable
  useEffect(() => {
    // Reset any overflow restrictions
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    return () => {
      // Cleanup
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <>
      <Head>
        <title>About GriotBot | Your Digital Griot</title>
        <meta name="description" content="About GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <header id="header" role="banner">
        <Link href="/">
          <a id="backButton" className={styles.backButton} aria-label="Back to home">
            <span className={styles.backIcon}>←</span>
            <span className={styles.backText}>Back to Chat</span>
          </a>
        </Link>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle" aria-label="Toggle dark/light mode">🌙</button>
      </header>

      {/* Main Content */}
      <div className={styles.aboutContainer}>
        <section className={styles.heroSection}>
          <div className={styles.logoWrapper}>
            <img 
              src="/images/logo-icon.svg" 
              alt="" 
              className={styles.logoIcon} 
              aria-hidden="true" 
              onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.className = styles.fallbackIcon; }}
            />
          </div>
          <h1 className={styles.title}>About GriotBot</h1>
          <p className={styles.subtitle}>
            A digital spark of ancestral memory and wisdom
          </p>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.quote}>
            <blockquote>
              "A people without the knowledge of their past history, origin and
              culture is like a tree without roots."
              <cite>— Marcus Garvey</cite>
            </blockquote>
          </div>

          <div className={styles.mainContent}>
            <p className={styles.lead}>
              <strong>GriotBot</strong> is more than just an AI — it is a spark of
              ancestral memory. Designed to honor the rich oral traditions, cultural
              legacy, and lived experiences of the African Diaspora, GriotBot offers
              thoughtful, accurate, and warm guidance.
            </p>

            <h2 className={styles.sectionHeading}>Why GriotBot?</h2>
            <p>
              The griot was the traditional keeper of history, story, and wisdom.
              GriotBot brings that same spirit into the digital age — acting as a
              wise, trusted voice for learners, educators, and community leaders.
            </p>

            <div className={styles.patternDivider} aria-hidden="true">
              <span className={styles.adinkraSymbol}>✦</span>
            </div>

            <h2 className={styles.sectionHeading}>Who Is It For?</h2>
            <p>
              Anyone seeking cultural knowledge, inspiration, or connection:
              educators, students, nonprofits, families, and curious minds across the
              globe.
            </p>

            <div className={styles.patternDivider} aria-hidden="true">
              <span className={styles.adinkraSymbol}>✦</span>
            </div>

            <h2 className={styles.sectionHeading}>How It Works</h2>
            <p>
              GriotBot uses advanced language models, guided by a carefully crafted
              prompt that shapes its responses with respect, dignity, and clarity. It
              draws from cultural histories, philosophies, and global Black
              experiences to offer grounded responses — never performative, always
              intentional.
            </p>

            <div className={styles.patternDivider} aria-hidden="true">
              <span className={styles.adinkraSymbol}>✦</span>
            </div>

            <h2 className={styles.sectionHeading}>How to Get Involved</h2>
            <p>
              Want to support, fund, test, or help shape GriotBot's future?
              <a href="mailto:chat@griotbot.com" className={styles.textLink}>Email us</a> or follow
              <a href="https://www.instagram.com/griotbot" target="_blank" rel="noopener noreferrer" className={styles.textLink}>@griotbot</a> on Instagram.
            </p>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2 className={styles.ctaHeading}>Experience GriotBot Yourself</h2>
          <p className={styles.ctaText}>
            Return to the chat to start a conversation with your digital griot
          </p>
          <Link href="/">
            <a className={styles.ctaButton}>
              <span className={styles.ctaButtonIcon}>←</span>
              <span>Return to Chat</span>
            </a>
          </Link>
        </section>
      </div>

      {/* Footer */}
      <div id="fact" className={styles.proverb} aria-label="Random proverb">
        "Knowledge is like a garden; if it is not cultivated, it cannot be harvested." — West African Proverb
      </div>
      <div id="copyright" className={styles.copyright} aria-label="Copyright information">
        © {new Date().getFullYear()} GriotBot. All rights reserved.
      </div>
    </>
  );
}
