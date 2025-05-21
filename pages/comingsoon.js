// pages/comingsoon.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function ComingSoon() {
  // Ensure client-side rendering if needed by Layout
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  const wrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
  };

  const boxStyles = {
    backgroundImage: 'linear-gradient(135deg, rgba(125,135,101,0.1), rgba(196,154,108,0.1))',
    padding: '1.5rem',
    borderRadius: '12px',
    maxWidth: '500px',
    marginBottom: '2rem',
    width: '100%',
  };

  const listStyles = {
    textAlign: 'left',
    paddingLeft: '1.5rem',
    margin: 0,
  };

  return (
    <>
      <Head>
        <title>Coming Soon | GriotBot</title>
        <meta
          name="description"
          content="This feature is coming soon to GriotBot"
        />
      </Head>

      <Layout>
        <div style={wrapperStyles}>
          <img
            src="/images/logo-icon.svg"
            alt="GriotBot Icon"
            style={{ width: '120px', height: '120px', marginBottom: '1.5rem' }}
          />

          <h1
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '2.5rem',
              marginBottom: '1rem',
              color: 'var(--accent-color)',
            }}
          >
            Coming Soon
          </h1>

          <p style={{ fontSize: '1.25rem', maxWidth: '600px', lineHeight: 1.6, textAlign: 'center', marginBottom: '2rem' }}>
            We're working on bringing user accounts and personalized features to
            GriotBot. Check back soon to create your account and save your
            conversations.
          </p>

          <div style={boxStyles}>
            <h2
              style={{
                fontFamily: 'Lora, serif',
                fontSize: '1.5rem',
                marginBottom: '0.75rem',
                color: 'var(--accent-color)',
              }}
            >
              What to Expect
            </h2>
            <ul style={listStyles}>
              <li style={{ marginBottom: '0.5rem' }}>
                Save and organize your conversations
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Personalized experience based on your interests
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Share insights and stories with others
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Premium features for enhanced cultural exploration
              </li>
            </ul>
          </div>

          <Link href="/">
            <a
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--accent-color)',
                color: '#fff',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'background-color 0.2s, transform 0.2s',
                boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
              }}
            >
              ← Return to GriotBot
            </a>
          </Link>
        </div>
      </Layout>
    </>
  );
}
