// pages/index.js
import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Layout from '../components/layout/Layout'
import ChatInput from '../components/ChatInput'

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [messages, setMessages] = useState([])
  const chatEndRef = useRef(null)

  useEffect(() => {
    // load history…
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (text) => {
    setShowWelcome(false)
    // push user msg & call API…
  }

  return (
    <>
      <Head>
        <title>GriotBot</title>
        <meta name="description" content="Your AI Digital Griot" />
      </Head>

      <Layout>
        {showWelcome ? (
          <div
            style={{
              height: 'calc(100vh - 60px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1rem',
            }}
          >
            <h1 style={{ fontFamily: 'Lora, serif', color: '#c49a6c', fontSize: '2.5rem' }}>
              Welcome to GriotBot
            </h1>
            <p style={{ maxWidth: 600, margin: '1rem 0' }}>
              Your AI companion for culturally rich conversations.
            </p>
            <blockquote
              style={{ fontStyle: 'italic', maxWidth: 800, margin: '1.5rem 0' }}
            >
              “A people without the knowledge of their past history, origin and culture
              is like a tree without roots.”<br />
              <cite style={{ display: 'block', marginTop: '.5rem' }}>— Marcus Garvey</cite>
            </blockquote>
          </div>
        ) : (
          <div style={{ padding: '1rem', minHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <div key={i} className={m.role}>
                {m.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        <ChatInput onSubmit={send} />
      </Layout>
    </>
  )
}
