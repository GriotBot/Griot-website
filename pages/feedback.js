// File: /pages/feedback.js - Updated with Component
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import FeedbackForm from '../components/FeedbackForm';

export default function Feedback() {
  return (
    <>
      <Head>
        <title>Share Your Feedback | GriotBot</title>
        <meta name="description" content="Help shape GriotBot by sharing your experience and suggestions" />
      </Head>

      <Layout>
        <div style={{
          backgroundColor: 'var(--bg-color)',
          fontFamily: 'Montserrat, sans-serif',
          color: 'var(--text-color)',
          margin: 0,
          padding: '2rem',
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
              textAlign: 'center'
            }}>We'd Love Your Feedback</h1>
            
            <p style={{
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Your insights help GriotBot grow and better serve our community.
            </p>

            <FeedbackForm />
          </div>
        </div>
      </Layout>
    </>
  );
}
