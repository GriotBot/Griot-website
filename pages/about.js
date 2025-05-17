// File: /pages/about.js - Updated
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function About() {
  return (
    <>
      <Head>
        <title>About GriotBot</title>
        <meta name="description" content="About GriotBot - An AI-powered digital griot" />
      </Head>

      <Layout>
        <div style={{
          fontFamily: 'Montserrat, sans-serif',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
          margin: 0,
          padding: '2rem',
          lineHeight: 1.6,
          minHeight: 'calc(100vh - 60px)', // Account for header height
          transition: 'background-color 0.3s, color 0.3s',
        }}>
          <div style={{
            maxWidth: '700px',
            margin: 'auto',
          }}>
            <h1 style={{
              color: '#7d8765',
              fontSize: '2rem',
              marginBottom: '0.5rem',
              fontFamily: 'Lora, serif',
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
              borderLeft: '4px solid #c49a6c',
              paddingLeft: '1rem',
              fontFamily: 'Lora, serif',
            }}>
              "A people without the knowledge of their past history, origin and
              culture is like a tree without roots." — Marcus Garvey
            </div>

            <h2 style={{
              color: '#c49a6c',
              fontSize: '1.2rem',
              marginTop: '2rem',
              fontFamily: 'Lora, serif',
            }}>Why GriotBot?</h2>
            <p>
              The griot was the traditional keeper of history, story, and wisdom.
              GriotBot brings that same spirit into the digital age — acting as a
              wise, trusted voice for learners, educators, and community leaders.
            </p>

            <h2 style={{
              color: '#c49a6c',
              fontSize: '1.2rem',
              marginTop: '2rem',
              fontFamily: 'Lora, serif',
            }}>Who Is It For?</h2>
            <p>
              Anyone seeking cultural knowledge, inspiration, or connection:
              educators, students, nonprofits, families, and curious minds across the
              globe.
            </p>

            <h2 style={{
              color: '#c49a6c',
              fontSize: '1.2rem',
              marginTop: '2rem',
              fontFamily: 'Lora, serif',
            }}>How It Works</h2>
            <p>
              GriotBot uses advanced language models, guided by a carefully crafted
              prompt that shapes its responses with respect, dignity, and clarity. It
              draws from cultural histories, philosophies, and global Black
              experiences to offer grounded responses — never performative, always
              intentional.
            </p>

            <h2 style={{
              color: '#c49a6c',
              fontSize: '1.2rem',
              marginTop: '2rem',
              fontFamily: 'Lora, serif',
            }}>How to Get Involved</h2>
            <p>
              Want to support, fund, test, or help shape GriotBot's future?{' '}
              <a href="mailto:chat@griotbot.com" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Email us</a> or follow{' '}
              <a href="https://www.instagram.com/griotbot" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>@griotbot</a> on Instagram.
            </p>

            <div style={{ marginTop: '2rem' }}>
              <a href="/" style={{ 
                color: 'var(--accent-color)', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center', 
              }}>
                ← Back to Chat
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
