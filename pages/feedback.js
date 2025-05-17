// File: /pages/feedback.js - Updated
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function Feedback() {
  return (
    <>
      <Head>
        <title>GriotBot Feedback</title>
        <meta name="description" content="Provide feedback for GriotBot" />
      </Head>

      <Layout>
        <div style={{
          backgroundColor: 'var(--bg-color)',
          fontFamily: 'Montserrat, sans-serif',
          color: 'var(--text-color)',
          margin: 0,
          padding: '2rem',
          textAlign: 'center',
          minHeight: 'calc(100vh - 60px)', // Account for header height
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
          <div style={{
            maxWidth: '700px',
            margin: 'auto',
            width: '100%'
          }}>
            <h1 style={{
              color: '#7d8765',
              fontSize: '2rem',
              marginBottom: '1rem',
              fontFamily: 'Lora, serif',
            }}>We'd Love Your Feedback</h1>
            
            <p style={{
              marginBottom: '2rem'
            }}>
              GriotBot is growing, and your voice helps shape the journey.
            </p>

            <div style={{
              width: '100%',
              height: '70vh',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px var(--shadow-color)',
              backgroundColor: 'var(--card-bg)',
            }}>
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSdTfuVK9qk0lfin5xMfTQoakoZOPrcbrCQTswt3oDSTyp4i0w/viewform?embedded=true"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                loading="lazy"
                title="GriotBot Feedback Form"
              >Loading…</iframe>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <a href="/" style={{ 
                color: 'var(--accent-color)', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}>
                ← Back to GriotBot
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
