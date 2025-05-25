// File: /components/EnhancedSidebar.js - UPDATED WITH NEW FEATURES
import Link from 'next/link';
import { 
  Home, 
  Plus, 
  MessageSquare, 
  Bookmark, 
  Users, 
  BookOpen, 
  Globe, 
  Info, 
  MessageCircle,
  X
} from 'react-feather';

export default function EnhancedSidebar({ 
  isVisible, 
  onClose, 
  onNewChat, 
  currentPage = "/" 
}) {
  
  // Handle click outside to close sidebar
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close sidebar
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            transition: 'opacity 0.3s ease',
          }}
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        />
      )}

      {/* Sidebar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '280px',
          background: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          padding: '0',
          transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out, background 0.3s',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '4px 0 20px var(--shadow-color)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        aria-hidden={!isVisible}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🌿</span>
            <h2 style={{
              margin: 0,
              fontSize: '1.2rem',
              fontFamily: 'Lora, serif',
              fontWeight: '600',
            }}>
              GriotBot
            </h2>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--sidebar-text)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close sidebar"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Return to Chat Button */}
        <div style={{
          padding: '1.5rem 1.5rem 1rem 1.5rem',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <Link href="/">
            <a
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-hover)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Home size={16} />
              Return to Chat
            </a>
          </Link>
        </div>

        {/* Vertical Line Divider */}
        <div
          style={{
            position: 'absolute',
            left: '25px',
            top: '160px',
            bottom: '25px',
            width: '1px',
            backgroundColor: 'rgba(255,255,255,0.25)',
          }}
          aria-hidden="true"
        />

        {/* Navigation Content */}
        <div style={{
          flex: 1,
          padding: '0 1.5rem',
          paddingLeft: '3rem', // Account for divider line
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          
          {/* Conversations Section */}
          <div>
            <h3 style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1rem',
              opacity: '0.8',
              fontWeight: '500',
              color: 'var(--sidebar-text)',
            }}>
              Conversations
            </h3>
            
            {/* FIXED: New Chat button with proper onNewChat handler */}
            <button
              onClick={onNewChat}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'var(--sidebar-text)',
                padding: '0.75rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                textAlign: 'left',
                marginBottom: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <Plus size={18} />
              New Chat
            </button>

            {/* FIXED: All other conversation links go to /comingsoon */}
            <Link href="/comingsoon">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.75rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}>
                <MessageSquare size={18} />
                Saved Conversations
              </a>
            </Link>

            <Link href="/comingsoon">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.75rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}>
                <Bookmark size={18} />
                Saved Stories
              </a>
            </Link>
          </div>
          
          {/* Explore Section */}
          <div>
            <h3 style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1rem',
              opacity: '0.8',
              fontWeight: '500',
              color: 'var(--sidebar-text)',
            }}>
              Explore
            </h3>
            
            {/* FIXED: All explore links go to /comingsoon */}
            <Link href="/comingsoon">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.75rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}>
                <Users size={18} />
                Historical Figures
              </a>
            </Link>

            <Link href="/comingsoon">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.75rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}>
                <BookOpen size={18} />
                Cultural Stories
              </a>
            </Link>

            <Link href="/comingsoon">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.75rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}>
                <Globe size={18} />
                Diaspora Community
              </a>
            </Link>
          </div>
          
          {/* About Section */}
          <div>
            <h3 style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1rem',
              opacity: '0.8',
              fontWeight: '500',
              color: 'var(--sidebar-text)',
            }}>
              About
            </h3>
            
            <Link href="/about">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.75rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                // Highlight if current page
                backgroundColor: currentPage === '/about' ? 'rgba(255,255,255,0.15)' : 'transparent',
                fontWeight: currentPage === '/about' ? '500' : 'normal',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== '/about') {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== '/about') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}>
                <Info size={18} />
                About GriotBot
              </a>
            </Link>

            <Link href="/feedback">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.75rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                // Highlight if current page
                backgroundColor: currentPage === '/feedback' ? 'rgba(255,255,255,0.15)' : 'transparent',
                fontWeight: currentPage === '/feedback' ? '500' : 'normal',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== '/feedback') {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== '/feedback') {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}>
                <MessageCircle size={18} />
                Share Feedback
              </a>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.8rem',
          opacity: '0.7',
          textAlign: 'center',
          fontStyle: 'italic',
          fontFamily: 'Lora, serif',
          lineHeight: '1.4',
        }}>
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>
    </>
  );
}
