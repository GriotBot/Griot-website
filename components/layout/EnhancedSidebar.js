// File: components/layout/EnhancedSidebar.js - POLISHED FINAL VERSION
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

      {/* Sidebar - POLISHED VERSION */}
      <nav 
        style={{
          position: 'fixed',
          top: '72px', // ← FIXED: Start 72px from top (below header)
          left: 0,
          height: 'calc(100% - 72px)', // ← FIXED: Height minus header
          width: '189px',
          background: 'rgba(75, 46, 42, 0.97)', // Hardcoded brown background
          color: '#f8f5f0', // Hardcoded light text
          padding: '1rem',
          transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '4px 0 20px rgba(75, 46, 42, 0.3)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontSize: '0.85rem', // ← REDUCED: 20% smaller from 1.06rem
          boxSizing: 'border-box'
          // ← REMOVED: Red debug border
        }}
        aria-hidden={!isVisible}
        aria-label="Main navigation"
      >
        {/* Header with Close Button - SIMPLIFIED */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
          // ← REMOVED: marginBottom to eliminate space above Return to Chat
        }}>
          <button
            onClick={onToggle}
            style={{
              background: 'none',
              border: 'none',
              color: '#f8f5f0',
              cursor: 'pointer',
              padding: '0.3rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close sidebar"
          >
            <X size={18} /> {/* ← KEPT: 18px as requested */}
          </button>
        </div>

        {/* Return to Chat Button */}
        <Link href="/">
          <a
            onClick={onToggle}
            style={{
              background: '#d7722c',
              color: 'white',
              padding: '0.6rem 0.8rem', // ← REDUCED: 20% smaller
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem', // ← REDUCED: 20% smaller
              fontSize: '0.8rem', // ← REDUCED: 20% smaller
              fontWeight: '500',
              textDecoration: 'none', // ← ENSURED: No underline
              transition: 'background-color 0.2s',
              marginBottom: '0.5rem'
            }}
          >
            <Home size={18} /> {/* ← KEPT: 18px as requested */}
            Return to Chat
          </a>
        </Link>
        
        {/* Conversations Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem', // ← REDUCED: 20% smaller from 0.94rem
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.4rem', // ← REDUCED: 20% smaller
            opacity: '0.8',
            fontWeight: '600',
            color: '#f8f5f0'
          }}>
            Conversations
          </h3>
          
          <button
            onClick={() => {
              if (onNewChat) onNewChat();
              onToggle();
            }}
            style={{
              color: '#f8f5f0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem 0.6rem', // ← REDUCED: 20% smaller
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem', // ← REDUCED: 20% smaller
              width: '100%',
              textAlign: 'left',
              marginBottom: '0.3rem', // ← REDUCED: 20% smaller
              fontSize: '0.8rem', // ← REDUCED: 20% smaller
              textDecoration: 'none' // ← ENSURED: No underline
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <MessageCircle size={18} /> {/* ← KEPT: 18px as requested */}
            New Chat
          </button>
          
          <Link href="/comingsoon">
            <a
              onClick={onToggle}
              style={{
                color: '#f8f5f0',
                textDecoration: 'none', // ← ENSURED: No underline
                padding: '0.4rem 0.6rem', // ← REDUCED: 20% smaller
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem', // ← REDUCED: 20% smaller
                fontSize: '0.8rem' // ← REDUCED: 20% smaller
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <Archive size={18} /> {/* ← KEPT: 18px as requested */}
              Saved Chats
            </a>
          </Link>
        </div>
        
        {/* Explore Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem', // ← REDUCED: 20% smaller
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.4rem', // ← REDUCED: 20% smaller
            opacity: '0.8',
            fontWeight: '600',
            color: '#f8f5f0'
          }}>
            Explore
          </h3>
          
          <Link href="/comingsoon">
            <a onClick={onToggle} style={{
              color: '#f8f5f0', textDecoration: 'none', padding: '0.4rem 0.6rem', // ← REDUCED: 20% smaller
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', // ← REDUCED: 20% smaller
              marginBottom: '0.3rem', fontSize: '0.8rem' // ← REDUCED: 20% smaller
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <Users size={18} /> {/* ← KEPT: 18px as requested */}
              Historical Figures
            </a>
          </Link>
          
          <Link href="/comingsoon">
            <a onClick={onToggle} style={{
              color: '#f8f5f0', textDecoration: 'none', padding: '0.4rem 0.6rem', // ← REDUCED: 20% smaller
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', // ← REDUCED: 20% smaller
              marginBottom: '0.3rem', fontSize: '0.8rem' // ← REDUCED: 20% smaller
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <BookOpen size={18} /> {/* ← KEPT: 18px as requested */}
              Cultural Stories
            </a>
          </Link>
          
          <Link href="/comingsoon">
            <a onClick={onToggle} style={{
              color: '#f8f5f0', textDecoration: 'none', padding: '0.4rem 0.6rem', // ← REDUCED: 20% smaller
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', // ← REDUCED: 20% smaller
              fontSize: '0.8rem' // ← REDUCED: 20% smaller
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <MapPin size={18} /> {/* ← KEPT: 18px as requested */}
              Diaspora Community
            </a>
          </Link>
        </div>
        
        {/* About Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem', // ← REDUCED: 20% smaller
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.4rem', // ← REDUCED: 20% smaller
            opacity: '0.8',
            fontWeight: '600',
            color: '#f8f5f0'
          }}>
            About
          </h3>
          
          <Link href="/about">
            <a onClick={onToggle} style={{
              color: '#f8f5f0', textDecoration: 'none', padding: '0.4rem 0.6rem', // ← REDUCED: 20% smaller
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', // ← REDUCED: 20% smaller
              marginBottom: '0.3rem', fontSize: '0.8rem', // ← REDUCED: 20% smaller
              background: currentPage === '/about' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = currentPage === '/about' ? 'rgba(255,255,255,0.1)' : 'transparent'}
            >
              <Info size={18} /> {/* ← KEPT: 18px as requested */}
              About GriotBot
            </a>
          </Link>
          
          <Link href="/feedback">
            <a onClick={onToggle} style={{
              color: '#f8f5f0', textDecoration: 'none', padding: '0.4rem 0.6rem', // ← REDUCED: 20% smaller
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', // ← REDUCED: 20% smaller
              fontSize: '0.8rem', // ← REDUCED: 20% smaller
              background: currentPage === '/feedback' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = currentPage === '/feedback' ? 'rgba(255,255,255,0.1)' : 'transparent'}
            >
              <MessageSquare size={18} /> {/* ← KEPT: 18px as requested */}
              Share Feedback
            </a>
          </Link>
        </div>
        
        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          fontSize: '0.7rem', // ← REDUCED: 20% smaller from 0.875rem
          opacity: '0.7',
          textAlign: 'center',
          fontStyle: 'italic',
          fontFamily: 'Lora, serif',
          lineHeight: '1.3',
          color: '#f8f5f0'
        }}>
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>
    </>
  );
}
