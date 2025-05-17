// File: /components/layout/Sidebar.js
import Link from 'next/link';

export default function Sidebar({ visible, currentPath }) {
  return (
    <nav 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '280px',
        background: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        padding: '1.5rem',
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out, background 0.3s',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '4px 0 20px var(--shadow-color)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
      id="sidebar"
      aria-hidden={!visible}
      aria-label="Main navigation"
    >
      <h2 style={{
        margin: '0 0 1rem 0',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'Lora, serif',
      }}>
        <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌿</span>
        GriotBot
      </h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.5rem',
          opacity: '0.8',
        }}>
          Conversations
        </h3>
        <Link href="/">
          <a style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem',
            backgroundColor: currentPath === '/' ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}>
            <span aria-hidden="true" style={{ marginRight: '0.5rem' }}>+</span> New Chat
          </a>
        </Link>
        <a href="#" style={{
          color: 'var(--sidebar-text)',
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '6px',
          transition: 'background-color 0.2s',
          display: 'block',
          marginBottom: '0.5rem',
        }}>
          Saved Conversations
        </a>
        <a href="#" style={{
          color: 'var(--sidebar-text)',
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '6px',
          transition: 'background-color 0.2s',
          display: 'block',
        }}>
          Saved Stories
        </a>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.5rem',
          opacity: '0.8',
        }}>
          Explore
        </h3>
        <a href="#" style={{
          color: 'var(--sidebar-text)',
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '6px',
          transition: 'background-color 0.2s',
          display: 'block',
          marginBottom: '0.5rem',
        }} id="historicalFigures">
          Historical Figures
        </a>
        <a href="#" style={{
          color: 'var(--sidebar-text)',
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '6px',
          transition: 'background-color 0.2s',
          display: 'block',
          marginBottom: '0.5rem',
        }} id="culturalStories">
          Cultural Stories
        </a>
        <a href="#" style={{
          color: 'var(--sidebar-text)',
          textDecoration: 'none',
          padding: '0.5rem',
          borderRadius: '6px',
          transition: 'background-color 0.2s',
          display: 'block',
        }} id="diasporaMap">
          Diaspora Community
        </a>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '0.5rem',
          opacity: '0.8',
        }}>
          About
        </h3>
        <Link href="/about">
          <a style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
            backgroundColor: currentPath === '/about' ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}>
            About GriotBot
          </a>
        </Link>
        <Link href="/feedback">
          <a style={{
            color: 'var(--sidebar-text)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            backgroundColor: currentPath === '/feedback' ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}>
            Share Feedback
          </a>
        </Link>
      </div>
      
      <div style={{
        marginTop: 'auto',
        fontSize: '0.8rem',
        opacity: '0.7',
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: 'Lora, serif',
      }}>
        "Preserving our stories,<br/>empowering our future."
      </div>
    </nav>
  );
}
