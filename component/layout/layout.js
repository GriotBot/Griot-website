// components/layout/Layout.js
import { useState, useEffect } from 'react'
import Header from '../Header'
import EnhancedFooter from './EnhancedFooter'

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('griotbot-theme') || 'light'
      setTheme(t)
      document.documentElement.setAttribute('data-theme', t)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('griotbot-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main style={{ paddingTop: '60px' }}>{children}</main>
      <EnhancedFooter />
    </>
  )
}
