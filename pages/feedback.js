// pages/feedback.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import FeedbackForm from '../components/FeedbackForm';

export default function Feedback() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;

  const containerStyles = {
    backgroundColor: 'var(--bg-color)',
    fontFamily: 'Montserrat, sans-serif',
    color: 'var(--text-color)',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    display: 'flex',
    justifyContent: 'center',
  };

  const contentStyles = {
    maxWidth: '700px',
    width: '100%',
    padding: '0 1rem',
    textAlign: 'center',
  };

  const headingStyles = {
    color: '#7d8765',
    fontSize: '2rem',
    marginBottom: '1rem',
    fontFamily: 'Lora, serif',
  };

  const paragraphStyles = {
    marginBottom: '2rem',
  };

  return (
    <>
      <Head>
        <title>Share Your Feedback | GriotBot</title>
        <meta
          name="description"
          content="Help shape GriotBot by sharing your experience and suggestions"
        />
      </Head>

      <Layout>
        <div style={containerStyles}>
          <div style={contentStyles}>
            <h1 style={headingStyles}>We’d Love Your Feedback</h1>
            <p style={paragraphStyles}>
              Your insights help GriotBot grow and better serve our community.
            </p>
            <FeedbackForm />
          </div>
        </div>
      </Layout>
    </>
  );
}
