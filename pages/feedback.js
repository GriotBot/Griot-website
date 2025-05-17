import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Feedback() {
  // Simple theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('griotbot-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  return (
    <>
      <Head>
        <title>GriotBot Feedback</title>
        <meta name="description" content="Provide feedback for GriotBot" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Simple header */}
      <header style={{
        backgroundColor: '#c49a6c',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <Link href="/">
          <a style={{
            position: 'absolute',
            left: '1rem',
            color: '#33302e',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
            ← Back
          </a>
        </Link>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <span>GriotBot</span>
        </div>
      </header>

      {/* Content area */}
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
        color: '#33302e',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: '#d7722c', 
          fontSize: '2rem', 
          marginBottom: '1rem' 
        }}>
          We'd Love Your Feedback
        </h1>
        
        <p style={{ 
          marginBottom: '2rem',
          fontSize: '1.1rem' 
        }}>
          GriotBot is growing, and your voice helps shape the journey.
        </p>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          height: '600px',
          overflow: 'hidden'
        }}>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdTfuVK9qk0lfin5xMfTQoakoZOPrcbrCQTswt3oDSTyp4i0w/viewform?embedded=true"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 'none' }}
            title="GriotBot Feedback Form"
          >
            Loading…
          </iframe>
        </div>

        <Link href="/">
          <a style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#d7722c',
            color: 'white',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 500
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Return to Chat
          </a>
        </Link>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        marginTop: '2rem',
        borderTop: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontStyle: 'italic', 
          marginBottom: '0.5rem', 
          color: '#6b4226' 
        }}>
          "A bird will always use another bird's feathers to feather its nest." — Ashanti Proverb
        </div>
        <div style={{ 
          fontSize: '0.8rem', 
          opacity: 0.6 
        }}>
          © {new Date().getFullYear()} GriotBot. All rights reserved.
        </div>
      </footer>
    </>
  );
}
