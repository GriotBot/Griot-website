// pages/index.js
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ChatInput from '../components/ChatInput';
import FooterProverb from '../components/FooterProverb';
import FooterCopyright from '../components/FooterCopyright';

export default function Home() {
  // Client render guard
  const [isClient, setIsClient] = useState(false);
  // Chat state
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [thinkingPhraseIndex, setThinkingPhraseIndex] = useState(0);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});

  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  const thinkingPhrases = [
    'Seeking ancestral wisdom...',
    'Consulting the elders...',
    'Weaving a response...',
    'Gathering knowledge...',
    'Remembering the traditions...',
  ];

  // Helper: load history
  function loadChatHistory() {
    try {
      const hist = JSON.parse(
        localStorage.getItem('griotbot-history') || '[]'
      );
      if (hist.length) {
        setMessages(hist);
        setShowWelcome(false);
      }
    } catch {
      localStorage.removeItem('griotbot-history');
    }
  }

  // Helper: save history
  function saveChatHistory(msgs) {
    localStorage.setItem(
      'griotbot-history',
      JSON.stringify(msgs.slice(-50))
    );
  }

  // Scroll
  function scrollToBottom() {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ bottom: 0, behavior: 'smooth' });
    }
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Toggle welcome/new chat
  function handleNewChat() {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem('griotbot-history');
  }

  // Copy
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(text.slice(0, 20));
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  }

  // Feedback
  function handleFeedback(id, positive) {
    setFeedbackGiven(prev => ({ ...prev, [id]: positive ? 'positive' : 'negative' }));
  }

  // Regenerate
  async function regenerateResponse(promptText) {
    if (!promptText) return;
    // find last user message index
    const userIdx = messages.map(m => m.content).lastIndexOf(promptText);
    if (userIdx < 0) return;
    // remove old bot or add thinking
    const newMsgs = [...messages.slice(0, userIdx + 1), { role: 'bot', content: '...', thinking: true }];
    setMessages(newMsgs);
    setFeedbackGiven({});
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, isRegeneration: true }),
      });
      const data = await res.json();
      const botContent = data.choices?.[0]?.message?.content || '';
      const final = [...newMsgs.slice(0, -1), { role: 'bot', content: botContent }];
      setMessages(final);
      saveChatHistory(final);
    } catch (e) {
      const final = [...newMsgs.slice(0, -1), { role: 'bot', content: `Error: ${e.message}` }];
      setMessages(final);
      saveChatHistory(final);
    }
  }

  // Send
  async function handleSendMessage(text) {
    setShowWelcome(false);
    const userMsg = { role: 'user', content: text };
    const think = { role: 'bot', content: '...', thinking: true };
    const updated = [...messages, userMsg, think];
    setMessages(updated);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      const botContent = data.choices?.[0]?.message?.content || '';
      const final = [...updated.slice(0, -1), { role: 'bot', content: botContent }];
      setMessages(final);
      saveChatHistory(final);
    } catch (e) {
      const final = [...updated.slice(0, -1), { role: 'bot', content: `Error: ${e.message}` }];
      setMessages(final);
      saveChatHistory(final);
    }
  }

  // Effects
  useEffect(() => {
    setIsClient(true);
    if (window) loadChatHistory();
  }, []);

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    if (messages.some(m => m.thinking)) {
      const iv = setInterval(() => {
        setThinkingPhraseIndex(i => (i + 1) % thinkingPhrases.length);
      }, 3000);
      return () => clearInterval(iv);
    }
  }, [messages]);

  if (!isClient) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>GriotBot</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>GriotBot</title>
        <meta name="description" content="..." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes typingBounce {0%,80%,100%{transform:scale(0);}40%{transform:scale(1);}}
          @keyframes pulse {0%{opacity:.6;transform:scale(.95);}50%{opacity:1;transform:scale(1.05);}100%{opacity:.6;transform:scale(.95);}}
          @keyframes fadeIn {from{opacity:0;}to{opacity:1;}}
        `}} />
      </Head>

      <Layout>
        {showWelcome ? (
          <main style={{ padding: '1rem', paddingBottom: '140px' }}>
            <h1>Welcome to GriotBot</h1>
            <p>Your AI companion for culturally rich conversations.</p>
            <blockquote>"A people without the knowledge..." &mdash; Marcus Garvey</blockquote>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['STORYTELLING', 'WISDOM', 'HISTORY'].map(label => (
                <button
                  key={label}
                  onClick={() => handleSendMessage(
                    label === 'STORYTELLING'
                      ? 'Tell me a story about resilience from the African diaspora'
                      : label === 'WISDOM'
                      ? 'Share some wisdom about community building from African traditions'
                      : 'Explain the historical significance of Juneteenth'
                  )}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </main>
        ) : (
          <main
            ref={chatContainerRef}
            style={{ position: 'fixed', top: '60px', bottom: '140px', width: '100%', overflowY: 'auto', padding: '1rem' }}
          >
            {messages.map((msg, i) => (
              <div key={i} style={{ margin: '0.5rem 0' }}>
                <strong>{msg.role === 'user' ? 'You:' : 'Bot:'}</strong>
                <p>{msg.content}</p>
                {!msg.thinking && msg.role === 'bot' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => copyToClipboard(msg.content)}>Copy</button>
                    <button onClick={() => handleFeedback(i, true)}>👍</button>
                    <button onClick={() => handleFeedback(i, false)}>👎</button>
                    <button onClick={() => regenerateResponse(messages[i-1]?.content)}>🔄</button>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </main>
        )}

        <ChatInput onSubmit={handleSendMessage} />
        <FooterProverb />
        <FooterCopyright />
      </Layout>
    </>
  );
}
