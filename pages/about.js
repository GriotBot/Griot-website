// pages/about.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function About() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  const pageStyles = {
    fontFamily: 'Montserrat, sans-serif',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    padding: '2rem 1rem',
    transition: 'background-color 0.3s, color 0.3s',
  };

  const contentStyles = {
    maxWidth: '700px',
    margin: 'auto',
    lineHeight: 1.6,
  };

  const sectionHeading = {
    color: 'var(--accent-color)',
    fontSize: '1.5rem',
    marginTop: '2rem',
    fontFamily: 'Lora, serif',
  };

  return (
    <>
      <Head>
        <title>About GriotBot</title>
        <meta
          name="description"
          content="About GriotBot - An AI-powered digital griot"
        />
      </Head>

      <Layout>
        <div style={pageStyles}>
          <div style={contentStyles}>
            <h1
              style={{
                fontFamily: 'Lora, serif',
                fontSize: '2rem',
                color: 'var(--accent-color)',
                marginBottom: '1rem',
              }}
            >
              About GriotBot
            </h1>

            <p>
              <strong>GriotBot</strong> is more than just an AI — it is a spark of
              ancestral memory. Designed to honor the rich oral traditions,
              cultural legacy, and lived experiences of the African Diaspora,
              GriotBot offers thoughtful, accurate, and warm guidance.
            </p>

            <blockquote
              style={{
                fontStyle: 'italic',
                color: 'var(--wisdom-color)',
                margin: '1rem 0',
                borderLeft: '4px solid var(--accent-color)',
                paddingLeft: '1rem',
                fontFamily: 'Lora, serif',
              }}
            >
              "A people without the knowledge of their past history, origin and
              culture is like a tree without roots." — Marcus Garvey
            </blockquote>

            <h2 style={sectionHeading}>Why GriotBot?</h2>
            <p>
              The griot was the traditional keeper of history, story, and wisdom.
              GriotBot brings that same spirit into the digital age — acting as a
              wise, trusted voice for learners, educators, and community leaders.
            </p>

            <h2 style={sectionHeading}>Who Is It For?</h2>
            <p>
              Anyone seeking cultural knowledge, inspiration, or connection:
              educators, students, nonprofits, families, and curious minds across
              the globe.
            </p>

            <h2 style={sectionHeading}>How It Works</h2>
            <p>
              GriotBot uses advanced language models, guided by a carefully crafted
              prompt that shapes its responses with respect, dignity, and clarity.
              It draws from cultural histories, philosophies, and global Black
              experiences to offer grounded responses — never performative,
              always intentional.
            </p>

            <h2 style={sectionHeading}>How to Get Involved</h2>
            <p>
              Want to support, fund, test, or help shape GriotBot’s future?{' '}
              <a
                href="mailto:chat@griotbot.com"
                style={{ color: 'var(--accent-color)', textDecoration: 'none' }}
              >
                Email us
              </a>{' '}
              or follow{' '}
              <a
                href="https://www.instagram.com/griotbot"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-color)', textDecoration: 'none' }}
              >
                @griotbot
              </a>{' '}
              on Instagram.
            </p>

            <div style={{ marginTop: '2rem' }}>
              <a
                href="/"
                style={{
                  color: 'var(--accent-color)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                ← Back to Chat
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
