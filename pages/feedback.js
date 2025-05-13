// File: /pages/feedback.js
import Head from 'next/head';
import Link from 'next/link';

export default function Feedback() {
  return (
    <>
      <Head>
        <title>GriotBot Feedback</title>
        <meta name="description" content="Provide feedback for GriotBot" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div style={{
        backgroundColor: '#f6f1ec',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        color: '#4b2e2a',
        margin: 0,
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1>We'd Love Your Feedback</h1>
        <p>GriotBot is growing, and your voice helps shape the journey.</p>

        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdTfuVK9qk0lfin5xMfTQoakoZOPrcbrCQTswt3oDSTyp4i0w/viewform?embedded=true"
          style={{
            width: '100%',
            height: '90vh',
            border: 'none'
          }}
          loading="lazy"
          title="GriotBot Feedback Form"
        >Loading…</iframe>

        <Link href="/" style={{
          color: '#c49a6c',
          display: 'inline-block',
          marginTop: '1rem',
          textDecoration: 'none'
        }}>← Back to GriotBot</Link>
      </div>
    </>
  );
}
