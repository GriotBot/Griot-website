// components/layout/ModernSidebar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Info, MessageSquare, Book, Users, Send, Archive, HelpCircle, XCircle } from 'react-feather';

export default function ModernSidebar({ visible, closeSidebar }) {
  const router = useRouter();
  const currentPath = router.pathname;
  const isIndexPage = currentPath === '/';
  
  // Track hover states for interactive feedback
  const [hoveredItems, setHoveredItems] = useState({});
  
  // Handle item hover
  const handleHover = (id, isHovered) => {
    setHoveredItems(prev => ({
      ...prev,
      [id]: isHovered
    }));
  };

  // Handle click on the sidebar background (empty area)
  const handleBackgroundClick = (e) => {
    // Only close if clicking directly on the nav element (background)
    // and not on any of its children
    if (e.target === e.currentTarget && isIndexPage) {
      closeSidebar();
    }
  };

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
        padding: '2rem 1.5rem 1.5rem',
        transform: visible ? 'translateX(0)' : (isIndexPage ? 'translateX(-100%)' : 'translateX(0)'),
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '4px 0 20px var(--shadow-color)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflowY: 'auto'
      }}
      id="sidebar"
      aria-hidden={!visible && isIndexPage}
      aria-label="Main navigation"
      onClick={handleBackgroundClick}
    >
      {/* Close button (X) for non-index pages */}
      {!isIndexPage && (
        <button
          onClick={closeSidebar}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--sidebar-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            borderRadius: '50%',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={() => handleHover('close-btn', true)}
          onMouseLeave={() => handleHover('close-btn', false)}
          aria-label="Close sidebar"
        >
          <XCircle size={24} />
        </button>
      )}
      {/* Return to chat button - centered and modernized */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <Link href="/">
          <a
            id="return-to-chat"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'var(--accent-color)',
              color: 'white',
              padding: '0.7rem 1.2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              width: '100%',
              maxWidth: '200px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
            onClick={closeSidebar}
          >
            <Home size={18} />
            Return to Chat
          </a>
        </Link>
      </div>

      {/* Divider line */}
      <div 
        style={{
          width: '100%',
          height: '1px',
          background: 'rgba(255,255,255,0.1)',
          margin: '0.5rem 0 1.5rem'
        }}
      />

      {/* Menu groups with modern styling */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Conversations section */}
        <div>
          <h3 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '1rem',
            opacity: '0.6',
            paddingLeft: '0.5rem',
            fontWeight: '600'
          }}>
            Conversations
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Link href="/">
              <a 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'var(--sidebar-text)',
                  backgroundColor: currentPath === '/' ? 'rgba(255,255,255,0.12)' : 'transparent',
                  transition: 'background-color 0.2s',
                  fontWeight: currentPath === '/' ? '500' : 'normal',
                }}
                onMouseEnter={() => handleHover('new-chat', true)}
                onMouseLeave={() => handleHover('new-chat', false)}
                onClick={closeSidebar}
              >
                <MessageSquare size={18} style={{ opacity: 0.9 }} />
                <span>New Chat</span>
              </a>
            </Link>
            
            <a 
              href="#" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--sidebar-text)',
                transition: 'background-color 0.2s',
                opacity: 0.8
              }}
              onMouseEnter={() => handleHover('saved', true)}
              onMouseLeave={() => handleHover('saved', false)}
            >
              <Archive size={18} style={{ opacity: 0.9 }} />
              <span>Saved Conversations</span>
            </a>
          </div>
        </div>
        
        {/* Explore section */}
        <div>
          <h3 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '1rem',
            opacity: '0.6',
            paddingLeft: '0.5rem',
            fontWeight: '600'
          }}>
            Explore
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <a 
              href="#" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--sidebar-text)',
                transition: 'background-color 0.2s',
                opacity: 0.8
              }}
              onMouseEnter={() => handleHover('historical', true)}
              onMouseLeave={() => handleHover('historical', false)}
            >
              <Book size={18} style={{ opacity: 0.9 }} />
              <span>Historical Figures</span>
            </a>
            
            <a 
              href="#" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--sidebar-text)',
                transition: 'background-color 0.2s',
                opacity: 0.8
              }}
              onMouseEnter={() => handleHover('stories', true)}
              onMouseLeave={() => handleHover('stories', false)}
            >
              <Send size={18} style={{ opacity: 0.9 }} />
              <span>Cultural Stories</span>
            </a>
            
            <a 
              href="#" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'var(--sidebar-text)',
                transition: 'background-color 0.2s',
                opacity: 0.8
              }}
              onMouseEnter={() => handleHover('diaspora', true)}
              onMouseLeave={() => handleHover('diaspora', false)}
            >
              <Users size={18} style={{ opacity: 0.9 }} />
              <span>Diaspora Community</span>
            </a>
          </div>
        </div>
        
        {/* About section */}
        <div>
          <h3 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '1rem',
            opacity: '0.6',
            paddingLeft: '0.5rem',
            fontWeight: '600'
          }}>
            About
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Link href="/about">
              <a 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'var(--sidebar-text)',
                  backgroundColor: currentPath === '/about' ? 'rgba(255,255,255,0.12)' : 'transparent',
                  transition: 'background-color 0.2s',
                  fontWeight: currentPath === '/about' ? '500' : 'normal',
                }}
                onMouseEnter={() => handleHover('about', true)}
                onMouseLeave={() => handleHover('about', false)}
                onClick={closeSidebar}
              >
                <Info size={18} style={{ opacity: 0.9 }} />
                <span>About GriotBot</span>
              </a>
            </Link>
            
            <Link href="/feedback">
              <a 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'var(--sidebar-text)',
                  backgroundColor: currentPath === '/feedback' ? 'rgba(255,255,255,0.12)' : 'transparent',
                  transition: 'background-color 0.2s',
                  fontWeight: currentPath === '/feedback' ? '500' : 'normal',
                }}
                onMouseEnter={() => handleHover('feedback', true)}
                onMouseLeave={() => handleHover('feedback', false)}
                onClick={closeSidebar}
              >
                <HelpCircle size={18} style={{ opacity: 0.9 }} />
                <span>Share Feedback</span>
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Inspirational quote */}
      <div style={{
        marginTop: 'auto',
        fontFamily: 'Lora, serif',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: '1rem',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.9rem',
        lineHeight: 1.5,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '2rem',
        paddingTop: '1.5rem',
      }}>
        "Preserving our stories,<br/>empowering our future."
      </div>
      
      {/* Version tag */}
      <div style={{
        fontSize: '0.7rem',
        opacity: '0.5',
        textAlign: 'center',
        padding: '0.5rem',
      }}>
        GriotBot v1.0
      </div>
    </nav>
  );
}
