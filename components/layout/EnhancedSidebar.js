// File: components/layout/EnhancedSidebar.js - Updated with requested changes
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Menu, X, Home, MessageCircle, Archive, Users, 
  BookOpen, MapPin, Info, MessageSquare 
} from 'react-feather';

export default function EnhancedSidebar({ 
  isVisible, 
  onToggle, 
  onNewChat, 
  currentPage = '/' 
}) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  // Handle exit animation when navigating to different pages
  const handleNavigation = (href) => {
    if (href !== router.pathname) {
      setIsExiting(true);
      // Small delay for exit animation, then navigate
      setTimeout(() => {
        router.push(href);
        setIsExiting(false);
        onToggle(); // Close sidebar after navigation
      }, 200);
    } else {
      onToggle(); // Just close if same page
    }
  };

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
            zIndex: 999,
            opacity: isExiting ? 0 : 1,
            transition: 'opacity 0.2s ease-out'
          }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '189px', // Fixed width as specified
          background: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          padding: '1rem',
          transform: isVisible ? 
            (isExiting ? 'translateX(-100%)' : 'translateX(0)') : 
            'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '4px 0 20px var(--shadow-color)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontSize: '0.85rem', // Smaller text for better fit
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
            fontSize: '1rem' // Smaller header text
          }}>
            <span style={{ fontSize: '1.2rem' }} aria-hidden="true">ðŸŒ¿</span>
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
              justifyContent: 'center',
              fontSize: '0.8rem'
            }}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Return to Chat Button */}
        <button
          onClick={() => handleNavigation('/')}
          style={{
            background: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            padding: '0.6rem 0.8rem',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            marginBottom: '0.5rem'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent-color)'}
        >
          <Home size={14} />
          Return to Chat
        </button>
        
        {/* Conversations Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem', // Smaller section headers
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
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <MessageCircle size={14} />
            New Chat
          </button>
          
          <button
            onClick={() => handleNavigation('/comingsoon')}
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
              fontSize: '0.8rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <Archive size={14} />
            Saved Chats
          </button>
        </div>
        
        {/* Explore Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem', // Smaller section headers
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.4rem',
            opacity: '0.8',
            fontWeight: '600'
          }}>
            Explore
          </h3>
          
          <button
            onClick={() => handleNavigation('/comingsoon')}
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
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <Users size={14} />
            Historical Figures
          </button>
          
          <button
            onClick={() => handleNavigation('/comingsoon')}
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
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <BookOpen size={14} />
            Cultural Stories
          </button>
          
          <button
            onClick={() => handleNavigation('/comingsoon')}
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
              fontSize: '0.8rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <MapPin size={14} />
            Diaspora Community
          </button>
        </div>
        
        {/* About Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.75rem', // Smaller section headers
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.4rem',
            opacity: '0.8',
            fontWeight: '600'
          }}>
            About
          </h3>
          
          <button
            onClick={() => handleNavigation('/about')}
            style={{
              color: 'var(--sidebar-text)',
              background: currentPage === '/about' ? 'rgba(255,255,255,0.1)' : 'none',
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
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = currentPage === '/about' ? 'rgba(255,255,255,0.1)' : 'transparent'}
          >
            <Info size={14} />
            About GriotBot
          </button>
          
          <button
            onClick={() => handleNavigation('/feedback')}
            style={{
              color: 'var(--sidebar-text)',
              background: currentPage === '/feedback' ? 'rgba(255,255,255,0.1)' : 'none',
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
              fontSize: '0.8rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = currentPage === '/feedback' ? 'rgba(255,255,255,0.1)' : 'transparent'}
          >
            <MessageSquare size={14} />
            Share Feedback
          </button>
        </div>
        
        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          fontSize: '0.7rem', // Smaller footer text
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
