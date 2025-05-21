// components/layout/EnhancedFooter.js
import { useState, useEffect } from 'react'

export default function EnhancedFooter() {
  const [proverb, setProverb] = useState('')

  // Full proverb list
  const list = [
    "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
    "Until the lion learns to write, every story will glorify the hunter. — African Proverb",
    "We are the drums, we are the dance. — Afro-Caribbean Proverb",
    "A tree cannot stand without its roots. — Jamaican Proverb",
    "Unity is strength, division is weakness. — Swahili Proverb",
    "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
    "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
    "A bird will always use another bird's feathers to feather its nest. — Ashanti Proverb",
    "You must act as if it is impossible to fail. — Yoruba Wisdom",
    "The child who is not embraced by the village will burn it down to feel its warmth. — West African Proverb",
    "However long the night, the dawn will break. — African Proverb",
    "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
    "It takes a village to raise a child. — African Proverb",
    "The fool speaks, the wise listen. — Ethiopian Proverb",
    "When the music changes, so does the dance. — Haitian Proverb"
  ]

  useEffect(() => {
    const rotate = () => {
      setProverb(list[Math.floor(Math.random() * list.length)])
    }
    rotate()
    const id = setInterval(rotate, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-color)',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        fontStyle: 'italic',
        fontFamily: 'Lora, serif',
        fontSize: '0.9rem',
      }}
    >
      {proverb}
      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>
        © 2025 GriotBot. All rights reserved.
      </div>
    </footer>
  )
}
