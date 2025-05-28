// File: components/layout/EnhancedSidebar.js - DIRECT FIX
// Just replace your current EnhancedSidebar.js with this exact code

import { useEffect } from 'react';
import Link from 'next/link';
import { 
  X, Home, MessageCircle, Archive, Users, 
  BookOpen, MapPin, Info, MessageSquare 
} from 'react-feather';

export default function EnhancedSidebar({ 
  isVisible, 
  onToggle, 
  onNewChat, 
  currentPage = '/' 
}) {
  
  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isVisible) {
        onToggle();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onToggle]);

  return (
    <>
      {/* Overlay */}
      {isVisible && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar - FIXED TRANSFORM */}
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '189px',
          background: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          padding: '1rem',
          transform: isVisible ? 'translateX(0)' : 'translateX(-100%)', // ← SIMPLE LOGIC
          transition: 'transform 0.3s ease-in-out',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '4px 0 20px var(--shadow-color)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontSize: '0.85rem',
          boxSizing: 'border-box'
        }}
        aria-hidden={!isVisible}
        aria-label="Main navigation"
      >
        {/* Header with Close Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          marginBottom: '0.5rem'
        }}>
          <h2 style={{
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--heading-font)',
            fontSize: '1rem'
          }}>
            <span style={{ fontSize: '1.2rem' }} aria-hidden="true">🌿</span>
            GriotBot
          </h2>
          
          <button
            onClick={onToggle}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--sidebar-text)',
              cursor: 'pointer',
              padding: '0.3rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Return to Chat Button */}
        <Link href="/">
          <a
            onClick={onToggle} // Close sidebar when clicked
            style={{
              background: 'var(--accent-color)',
              color: 'white',
              padding: '0.6rem 0.8rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              marginBottom: '0.5rem'
            }}
          >
            <Home size={14} />
            Return to Chat
          </a>
        </Link>
        
        {/* Conversations Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.4rem',
            opacity: '0.8',
            fontWeight: '600'
          }}>
            Conversations
          </h3>
          
          <button
            onClick={() => {
              if (onNewChat) onNewChat();
              onToggle();
            }}
            style={{
              color: 'var(--sidebar-text)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem 0.6rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              width: '100%',
              textAlign: 'left',
              marginBottom: '0.3rem',
              fontSize: '0.8rem'
            }}
          >
            <MessageCircle size={14} />
            New Chat
          </button>
          
          <Link href="/comingsoon">
            <a
              onClick={onToggle}
              style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.4rem 0.6rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem'
              }}
            >
              <Archive size={14} />
              Saved Chats
            </a>
          </Link>
        </div>
        
        {/* Explore Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.4rem',
            opacity: '0.8',
            fontWeight: '600'
          }}>
            Explore
          </h3>
          
          <Link href="/comingsoon">
            <a onClick={onToggle} style={{
              color: 'var(--sidebar-text)', textDecoration: 'none', padding: '0.4rem 0.6rem',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem',
              marginBottom: '0.3rem', fontSize: '0.8rem'
            }}>
              <Users size={14} />
              Historical Figures
            </a>
          </Link>
          
          <Link href="/comingsoon">
            <a onClick={onToggle} style={{
              color: 'var(--sidebar-text)', textDecoration: 'none', padding: '0.4rem 0.6rem',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem',
              marginBottom: '0.3rem', fontSize: '0.8rem'
            }}>
              <BookOpen size={14} />
              Cultural Stories
            </a>
          </Link>
          
          <Link href="/comingsoon">
            <a onClick={onToggle} style={{
              color: 'var(--sidebar-text)', textDecoration: 'none', padding: '0.4rem 0.6rem',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.8rem'
            }}>
              <MapPin size={14} />
              Diaspora Community
            </a>
          </Link>
        </div>
        
        {/* About Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.4rem',
            opacity: '0.8',
            fontWeight: '600'
          }}>
            About
          </h3>
          
          <Link href="/about">
            <a onClick={onToggle} style={{
              color: 'var(--sidebar-text)', textDecoration: 'none', padding: '0.4rem 0.6rem',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem',
              marginBottom: '0.3rem', fontSize: '0.8rem',
              background: currentPage === '/about' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}>
              <Info size={14} />
              About GriotBot
            </a>
          </Link>
          
          <Link href="/feedback">
            <a onClick={onToggle} style={{
              color: 'var(--sidebar-text)', textDecoration: 'none', padding: '0.4rem 0.6rem',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.8rem',
              background: currentPage === '/feedback' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}>
              <MessageSquare size={14} />
              Share Feedback
            </a>
          </Link>
        </div>
        
        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          fontSize: '0.7rem',
          opacity: '0.7',
          textAlign: 'center',
          fontStyle: 'italic',
          fontFamily: 'var(--quote-font)',
          lineHeight: '1.3'
        }}>
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>
    </>
  );
}
