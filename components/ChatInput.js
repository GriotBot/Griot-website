// components/ChatInput.js
import { useState, useRef } from 'react'
import { ArrowUpCircle } from 'react-feather'

export default function ChatInput({ onSubmit }) {
  const [text, setText] = useState('')
  const areaRef = useRef(null)

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text.trim())
    setText('')
    areaRef.current.style.height = '55px'
  }

  const onChange = (e) => {
    setText(e.target.value)
    areaRef.current.style.height = 'auto'
    areaRef.current.style.height = Math.min(areaRef.current.scrollHeight, 120) + 'px'
  }

  return (
    <form
      onSubmit={send}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-color)',
        padding: '1rem',
        borderTop: '1px solid var(--input-border)',
      }}
    >
      <div style={{ display: 'flex', maxWidth: 700, margin: '0 auto' }}>
        <textarea
          ref={areaRef}
          value={text}
          onChange={onChange}
          rows={1}
          placeholder="Ask GriotBot about Black history, culture, or personal advice…"
          style={{
            flex: 1,
            height: 55,
            resize: 'none',
            border: '1px solid var(--input-border)',
            borderRadius: '8px 0 0 8px',
            padding: '0.75rem',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          style={{
            width: 55,
            background: 'var(--accent-color)',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowUpCircle size={24} color="white" />
        </button>
      </div>
    </form>
  )
}
