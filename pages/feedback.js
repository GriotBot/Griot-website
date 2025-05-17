import Head from 'next/head';
import Link from 'next/link';

export default function Feedback() {
  return (
    <>
      <Head>
        <title>GriotBot Feedback</title>
        <meta name="description" content="Provide feedback for GriotBot - Help us improve your AI griot experience" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <div id="header" role="banner">
        <Link href="/">
          <a style={{
            position: 'absolute',
            left: '1rem',
            color: '#33302e',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Chat
          </a>
        </Link>
        <div className="logo-container">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <span>GriotBot</span>
        </div>
        <button id="themeToggle" aria-label="Toggle dark/light mode">🌙</button>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
        color: '#33302e',
        textAlign: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #7d8765, #5e6e4f)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '2.5rem', color: 'white' }}>📝</span>
          </div>
          
          <h1 style={{
            color: '#d7722c',
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            fontFamily: 'var(--heading-font, "Lora", serif)'
          }}>We'd Love Your Feedback</h1>
          
          <p style={{
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: 1.6
          }}>
            GriotBot is growing, and your voice helps shape the journey. Your feedback ensures this digital griot continues to serve the community with wisdom, respect, and cultural authenticity.
          </p>
        </div>

        {/* Feedback Form Container */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(75, 46, 42, 0.15)',
          marginBottom: '2rem'
        }}>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdTfuVK9qk0lfin5xMfTQoakoZOPrcbrCQTswt3oDSTyp4i0w/viewform?embedded=true"
            style={{
              width: '100%',
              height: '600px',
              border: 'none',
              overflow: 'hidden'
            }}
            loading="lazy"
            title="GriotBot Feedback Form"
          >Loading…</iframe>
        </div>

        {/* CTA Button */}
        <Link href="/">
          <a style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#d7722c',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 500,
            marginTop: '1rem'
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Return to Chat
          </a>
        </Link>

        {/* Privacy Note */}
        <p style={{
          fontSize: '0.9rem',
          opacity: 0.7,
          maxWidth: '600px',
          margin: '2rem auto 0',
          fontStyle: 'italic'
        }}>
          Your feedback is anonymous unless you choose to share your contact information. We value your privacy and use this information solely to improve GriotBot.
        </p>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '1rem',
        borderTop: '1px solid rgba(75, 46, 42, 0.1)'
      }}>
        <div style={{
          fontSize: '0.9rem',
          fontStyle: 'italic',
          marginBottom: '0.5rem',
          color: '#6b4226',
          fontFamily: 'var(--quote-font, "Lora", serif)'
        }}>
          "When the music changes, so does the dance." — Haitian Proverb
        </div>
        <div style={{
          fontSize: '0.8rem',
          opacity: 0.6
        }}>
          © {new Date().getFullYear()} GriotBot. All rights reserved.
        </div>
      </div>
    </>
  );
}
