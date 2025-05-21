// File: components/layout/Layout.js
import { useState, useEffect } from 'react'
import Header from '../Header'
import ModernSidebar from './ModernSidebar'
import EnhancedFooter from './EnhancedFooter'

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light')
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [isIndexPage, setIsIndexPage] = useState(true)

  // Determine current path & default sidebar visibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      setIsIndexPage(path === '/')
      if (path !== '/') setSidebarVisible(true)
    }
  }, [])

  // Load saved theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('griotbot-theme') || 'light'
      setTheme(saved)
      document.documentElement.setAttribute('data-theme', saved)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('griotbot-theme', next)
  }

  const toggleSidebar = () => setSidebarVisible(v => !v)
  const closeSidebar = () => setSidebarVisible(false)

  // Layout constants
  const HEADER_HEIGHT = 60
  const SIDEBAR_WIDTH = 280

  return (
    <>
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        sidebarVisible={sidebarVisible}
        toggleSidebar={toggleSidebar}
        isIndexPage={isIndexPage}
      />

      <ModernSidebar visible={sidebarVisible} closeSidebar={closeSidebar} />

      <main
        onClick={closeSidebar}
        style={{
          paddingTop: HEADER_HEIGHT,                     // push content below header
          marginLeft: isIndexPage ? 0 : SIDEBAR_WIDTH,   // leave space for sidebar
          transition: 'margin-left 0.3s ease',
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <div
          className="pageContent"
          style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: '1rem',
          }}
        >
          {children}
        </div>
      </main>

      {/* Only show footer on non-index pages */}
      {!isIndexPage && <EnhancedFooter page="other" />}
    </>
  )
}
