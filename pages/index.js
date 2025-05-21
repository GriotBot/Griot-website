import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ChatInput from '../components/ChatInput';
import FooterProverb from '../components/FooterProverb';
import FooterCopyright from '../components/FooterCopyright';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  // thinking phrases omitted for brevity…

  useEffect(() => {
    setIsClient(true);
    // load history, init click handlers…
  }, []);

  useEffect(() => {
    // scroll to bottom
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // handleSendMessage, regenerateResponse, load/save history, etc.

  return (
    <>
      <Head>
        <title>GriotBot – Your Digital Griot</title>
        <meta name="description" content="..." />
      </Head>

      <Layout>
        {showWelcome ? (
          <div
            className="welcome-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              height: 'calc(100vh - 60px)',
              padding: '1rem'
            }}
          >
            <h1 style={{ color: '#c49a6c', fontSize: '2.5rem', fontFamily: 'Lora, serif' }}>
              Welcome to GriotBot
            </h1>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px' }}>
              Your AI companion for culturally rich conversations.
            </p>
            <div style={{ fontStyle: 'italic', margin: '1rem 0', maxWidth: '800px' }}>
              "A people without the knowledge of their past history, origin and culture is like a tree without roots."
              <div style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
                — Marcus Mosiah Garvey
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div className="category-tab" data-prompt="Tell me a story about resilience…">STORYTELLING</div>
              <div className="category-tab" data-prompt="Share some wisdom about community…">WISDOM</div>
              <div className="category-tab" data-prompt="Explain the historical significance…">HISTORY</div>
            </div>
            <FooterProverb />
            <FooterCopyright />
          </div>
        ) : (
          <>
            <div
              id="chat-container"
              ref={chatContainerRef}
              style={{
                padding: '1rem',
                overflowY: 'auto',
                height: 'calc(100vh - 170px)'
              }}
            >
              {messages.map((m,i) => (
                <div key={i} className={`message ${m.role}`}>
                  {/* render message bubble… */}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <ChatInput onSubmit={handleSendMessage} />
            <FooterProverb />
            <FooterCopyright />
          </>
        )}
      </Layout>
    </>
  );
}
