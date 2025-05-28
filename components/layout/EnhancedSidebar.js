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
          fontSize: '0.94rem', // ← INCREASED: from 0.85rem to 0.94rem
          boxSizing: 'border-box'
          // ← REMOVED: Red debug border
        }}
        aria-hidden={!isVisible}
        aria-label="Main navigation"
      >
        {/* Header with X button next to Return to Chat */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem', // Appropriate spacing instead of header line
          marginTop: '0.5rem' // Small top margin for breathing room
        }}>
          {/* Return to Chat Button */}
          <Link href="/">
            <a
              onClick={onToggle}
              style={{
                background: '#d7722c',
                color: 'white',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem', // ← INCREASED: 0.8rem → 0.9rem
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
                flex: 1, // Takes most of the space
                marginRight: '0.5rem' // Small gap between button and X
              }}
            >
              <Home size={18} />
              Return to Chat
            </a>
          </Link>

          {/* X Close Button - Now next to Return to Chat */}
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
            <X size={18} />
          </button>
        </div>
        
        {/* Conversations Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.4rem',
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
              padding: '0.4rem 0.6rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              width: '100%',
              textAlign: 'left',
              marginBottom: '0.3rem',
              fontSize: '1rem', // ← INCREASED: from 0.8rem to 1rem
              textDecoration: 'none'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline on hover
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline
            }}
          >
            <MessageCircle size={18} />
            New Chat
          </button>
          
          <Link href="/comingsoon">
            <a
              onClick={onToggle}
              style={{
                color: '#f8f5f0',
                textDecoration: 'none',
                padding: '0.4rem 0.6rem',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '1rem' // ← INCREASED: from 0.8rem to 1rem
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.target.style.textDecoration = 'none'; // ← ENSURE: No underline on hover
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.textDecoration = 'none'; // ← ENSURE: No underline
              }}
            >
              <Archive size={18} />
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
            fontWeight: '600',
            color: '#f8f5f0'
          }}>
            Explore
          </h3>
          
          <Link href="/comingsoon">
            <a onClick={onToggle} style={{
              color: '#f8f5f0', textDecoration: 'none', padding: '0.4rem 0.6rem',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem',
              marginBottom: '0.3rem', fontSize: '1rem' // ← INCREASED: from 0.8rem to 1rem
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline on hover
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline
            }}
            >
              <Users size={18} />
              Historical Figures
            </a>
          </Link>
          
          <Link href="/comingsoon">
            <a onClick={onToggle} style={{
              color: '#f8f5f0', textDecoration: 'none', padding: '0.4rem 0.6rem',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem',
              marginBottom: '0.3rem', fontSize: '1rem' // ← INCREASED: from 0.8rem to 1rem
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline on hover
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline
            }}
            >
              <BookOpen size={18} />
              Cultural Stories
            </a>
          </Link>
          
          <Link href="/comingsoon">
            <a onClick={onToggle} style={{
              color: '#f8f5f0', textDecoration: 'none', padding: '0.4rem 0.6rem',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '1rem' // ← INCREASED: from 0.8rem to 1rem
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline on hover
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline
            }}
            >
              <MapPin size={18} />
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
            fontWeight: '600',
            color: '#f8f5f0'
          }}>
            About
          </h3>
          
          <Link href="/about">
            <a onClick={onToggle} style={{
              color: '#f8f5f0', textDecoration: 'none', padding: '0.4rem 0.6rem',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem',
              marginBottom: '0.3rem', fontSize: '1rem', // ← INCREASED: from 0.8rem to 1rem
              background: currentPage === '/about' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline on hover
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = currentPage === '/about' ? 'rgba(255,255,255,0.1)' : 'transparent';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline
            }}
            >
              <Info size={18} />
              About GriotBot
            </a>
          </Link>
          
          <Link href="/feedback">
            <a onClick={onToggle} style={{
              color: '#f8f5f0', textDecoration: 'none', padding: '0.4rem 0.6rem',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '1rem', // ← INCREASED: from 0.8rem to 1rem
              background: currentPage === '/feedback' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline on hover
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = currentPage === '/feedback' ? 'rgba(255,255,255,0.1)' : 'transparent';
              e.target.style.textDecoration = 'none'; // ← ENSURE: No underline
            }}
            >
              <MessageSquare size={18} />
              Share Feedback
            </a>
          </Link>
        </div>
        
        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          fontSize: '0.875rem', // ← INCREASED: from 0.7rem to 0.875rem
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
