// pages/comingsoon.js
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>Coming Soon | GriotBot</title>
        <meta name="description" content="This feature is coming soon to GriotBot" />
      </Head>

      <Layout>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1rem',
          textAlign: 'center',
          minHeight: 'calc(100vh - 60px)',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
        }}>
          <img 
            src="/images/logo-icon.svg" 
            alt="GriotBot Icon" 
            style={{
              width: '120px',
              height: '120px',
              marginBottom: '2rem',
              filter: 'var(--text-color) === #f0ece4' ? 'invert(1)' : 'none',
            }} 
          />
          
          <h1 style={{
            fontFamily: 'Lora, serif',
            fontSize: '2.5rem',
            marginBottom: '1rem',
            color: 'var(--accent-color)',
          }}>
            Coming Soon
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            maxWidth: '600px',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}>
            We're working on bringing user accounts and personalized features to GriotBot. 
            Check back soon to create your account and save your conversations.
          </p>
          
          <div style={{
            backgroundImage: 'linear-gradient(135deg, rgba(125, 135, 101, 0.1), rgba(196, 154, 108, 0.1))',
            padding: '1.5rem',
            borderRadius: '12px',
            maxWidth: '500px',
            marginBottom: '2rem',
          }}>
            <h2 style={{
              fontFamily: 'Lora, serif',
              fontSize: '1.5rem',
              marginBottom: '0.75rem',
              color: 'var(--accent-color)',
            }}>
              What to expect
            </h2>
            
            <ul style={{
              textAlign: 'left',
              paddingLeft: '1.5rem',
              marginBottom: '0',
            }}>
              <li style={{ marginBottom: '0.5rem' }}>Save and organize your conversations</li>
              <li style={{ marginBottom: '0.5rem' }}>Personalized experience based on your interests</li>
              <li style={{ marginBottom: '0.5rem' }}>Share insights and stories with others</li>
              <li style={{ marginBottom: '0.5rem' }}>Premium features for enhanced cultural exploration</li>
            </ul>
          </div>
          
          <Link href="/">
            <a style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s, transform 0.2s',
              boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            }}>
              ← Return to GriotBot
            </a>
          </Link>
        </div>
      </Layout>
    </>
  );
}
