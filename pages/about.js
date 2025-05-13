// File: /pages/about.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  // State to ensure we can access DOM elements after mounting
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Initialize theme from localStorage or user preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>About GriotBot</title>
        <meta name="description" content="About GriotBot - An AI-powered digital griot" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      {/* HEADER + CONTROLS */}
      <div id="header" role="banner">
        <Link href="/" aria-label="Return to chat">
          <span style={{ position: 'absolute', left: '1rem', fontSize: '1.5rem' }}>←</span>
        </Link>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
      </div>

      <main style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        fontFamily: 'var(--body-font)',
        padding: '2rem',
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: 1.6,
        marginTop: '1rem'
      }}>
        <h1 style={{
          color: 'var(--bot-bubble-start)',
          fontFamily: 'var(--heading-font)',
          fontSize: '2rem',
          marginBottom: '0.5rem'
        }}>About GriotBot</h1>
        
        <p>
          <strong>GriotBot</strong> is more than just an AI — it is a spark of
          ancestral memory. Designed to honor the rich oral traditions, cultural
          legacy, and lived experiences of the African Diaspora, GriotBot offers
          thoughtful, accurate, and warm guidance.
        </p>

        <div style={{
          fontStyle: 'italic',
          color: 'var(--wisdom-color)',
          margin: '1rem 0',
          borderLeft: '4px solid var(--header-bg)',
          paddingLeft: '1rem',
          fontFamily: 'var(--quote-font)'
        }}>
          "A people without the knowledge of their past history, origin and
          culture is like a tree without roots." — Marcus Garvey
        </div>

        <h2 style={{
          color: 'var(--header-bg)',
          fontFamily: 'var(--heading-font)',
          fontSize: '1.2rem',
          marginTop: '2rem'
        }}>Why GriotBot?</h2>
        <p>
          The griot was the traditional keeper of history, story, and wisdom.
          GriotBot brings that same spirit into the digital age — acting as a
          wise, trusted voice for learners, educators, and community leaders.
        </p>

        <h2 style={{
          color: 'var(--header-bg)',
          fontFamily: 'var(--heading-font)',
          fontSize: '1.2rem',
          marginTop: '2rem'
        }}>Who Is It For?</h2>
        <p>
          Anyone seeking cultural knowledge, inspiration, or connection:
          educators, students, nonprofits, families, and curious minds across the
          globe.
        </p>

        <h2 style={{
          color: 'var(--header-bg)',
          fontFamily: 'var(--heading-font)',
          fontSize: '1.2rem',
          marginTop: '2rem'
        }}>How It Works</h2>
        <p>
          GriotBot uses advanced language models, guided by a carefully crafted
          prompt that shapes its responses with respect, dignity, and clarity. It
          draws from cultural histories, philosophies, and global Black
          experiences to offer grounded responses — never performative, always
          intentional.
        </p>

        <h2 style={{
          color: 'var(--header-bg)',
          fontFamily: 'var(--heading-font)',
          fontSize: '1.2rem',
          marginTop: '2rem'
        }}>How to Get Involved</h2>
        <p>
          Want to support, fund, test, or help shape GriotBot's future?{' '}
          <a href="mailto:chat@griotbot.com" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Email us</a> or follow{' '}
          <a href="https://www.instagram.com/griotbot" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>@griotbot</a> on Instagram.
        </p>
        
        <div style={{ marginTop: '2rem' }}>
          <Link href="/" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>← Back to Chat</Link>
        </div>
      </main>

      {/* FOOTER */}
      <div id="copyright" style={{ position: 'relative', marginTop: '2rem', textAlign: 'center' }}>
        © 2025 GriotBot. All rights reserved.
      </div>
    </>
  );
}
