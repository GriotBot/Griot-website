import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About GriotBot | Your Digital Griot</title>
        <meta name="description" content="About GriotBot - An AI-powered digital griot" />
      </Head>
      
      <header style={{
        backgroundColor: '#c49a6c',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
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
          fontWeight: 'bold'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <span>GriotBot</span>
        </div>
      </header>
      
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
        lineHeight: 1.6
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #7d8765, #5e6e4f)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '2.5rem', color: 'white' }}>🌿</span>
          </div>
          
          <h1 style={{
            color: '#d7722c',
            fontSize: '2rem',
            marginBottom: '0.5rem'
          }}>About GriotBot</h1>
          
          <p style={{ opacity: 0.8 }}>
            A digital spark of ancestral memory and wisdom
          </p>
        </div>
        
        <blockquote style={{
          fontStyle: 'italic',
          borderLeft: '4px solid #7d8765',
          padding: '1rem',
          backgroundColor: 'rgba(125, 135, 101, 0.1)',
          margin: '2rem 0'
        }}>
          "A people without the knowledge of their past history, origin and
          culture is like a tree without roots."
          <cite style={{ display: 'block', marginTop: '0.5rem' }}>— Marcus Garvey</cite>
        </blockquote>
        
        <p style={{ fontSize: '1.1rem' }}>
          <strong>GriotBot</strong> is more than just an AI — it is a spark of
          ancestral memory. Designed to honor the rich oral traditions, cultural
          legacy, and lived experiences of the African Diaspora, GriotBot offers
          thoughtful, accurate, and warm guidance.
        </p>
        
        <h2 style={{ color: '#d7722c', marginTop: '2rem' }}>Why GriotBot?</h2>
        <p>
          The griot was the traditional keeper of history, story, and wisdom.
          GriotBot brings that same spirit into the digital age — acting as a
          wise, trusted voice for learners, educators, and community leaders.
        </p>
        
        <h2 style={{ color: '#d7722c', marginTop: '2rem' }}>Who Is It For?</h2>
        <p>
          Anyone seeking cultural knowledge, inspiration, or connection:
          educators, students, nonprofits, families, and curious minds across the
          globe.
        </p>
        
        <h2 style={{ color: '#d7722c', marginTop: '2rem' }}>How It Works</h2>
        <p>
          GriotBot uses advanced language models, guided by a carefully crafted
          prompt that shapes its responses with respect, dignity, and clarity. It
          draws from cultural histories, philosophies, and global Black
          experiences to offer grounded responses — never performative, always
          intentional.
        </p>
        
        <h2 style={{ color: '#d7722c', marginTop: '2rem' }}>How to Get Involved</h2>
        <p>
          Want to support, fund, test, or help shape GriotBot's future?
          <a href="mailto:chat@griotbot.com" style={{ color: '#d7722c', margin: '0 0.3rem' }}>Email us</a> or follow
          <a href="https://www.instagram.com/griotbot" style={{ color: '#d7722c', margin: '0 0.3rem' }} target="_blank" rel="noopener noreferrer">@griotbot</a> on Instagram.
        </p>
        
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          margin: '3rem 0'
        }}>
          <h2 style={{ color: '#d7722c' }}>Experience GriotBot Yourself</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Return to the chat to start a conversation with your digital griot
          </p>
          
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
        </div>
      </main>
      
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontStyle: 'italic', marginBottom: '0.5rem', color: '#6b4226' }}>
          "Knowledge is like a garden; if it is not cultivated, it cannot be harvested." — West African Proverb
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
          © {new Date().getFullYear()} GriotBot. All rights reserved.
        </div>
      </footer>
    </>
  );
}
