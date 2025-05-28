// File: /components/EnhancedSidebar.js
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  X, 
  Home, 
  Plus, 
  MessageSquare, 
  BookOpen, 
  Users, 
  Archive, 
  Globe, 
  Info, 
  MessageCircle,
  Menu
} from 'react-feather';

export default function EnhancedSidebar({ isVisible, onClose, onNewChat }) {
  const sidebarRef = useRef(null);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isVisible) {
        onClose();
      }
    };

    // Handle escape key to close sidebar
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onClose]);

  // Handle new chat and close sidebar
  const handleNewChatClick = () => {
    onNewChat();
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <nav 
        ref={sidebarRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '280px',
          background: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          padding: 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out, background 0.3s',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '4px 0 20px var(--shadow-color)',
          zIndex: 1002,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        aria-hidden={!isVisible}
        aria-label="Main navigation"
      >
        {/* Sidebar Header - Menu Icon pointing down */}
        <div style={{
          padding: '1.5rem 1.5rem 1rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Menu icon pointing down */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--sidebar-text)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: '0.8',
            }}
            aria-label="Close sidebar"
            title="Close sidebar"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.opacity = '0.8';
            }}
          >
            <Menu 
              size={24} 
              style={{
                transform: 'rotate(90deg)', // Points down
              }}
              color="currentColor"
            />
          </button>
          
          {/* Close X Button */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--sidebar-text)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: '0.8',
            }}
            aria-label="Close sidebar"
            title="Close sidebar"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.opacity = '0.8';
            }}
          >
            <X size={20} color="currentColor" />
          </button>
        </div>

        {/* Return to Chat Section */}
        <div style={{
          padding: '1.5rem 1.5rem 0 1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Link href="/">
            <a 
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                padding: '0.7rem 1.2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s, transform 0.2s',
                border: 'none',
              }}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-hover)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--accent-color)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Home size={18} color="white" />
              Return to chat
            </a>
          </Link>
        </div>

        {/* Vertical line divider */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '25px',
            top: '120px', // Adjusted for new header
            bottom: '25px',
            width: '1px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            zIndex: 1,
          }}
        />

        {/* Scrollable content area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem 0 1rem 0',
          position: 'relative',
        }}>
          {/* Conversations Section */}
          <div style={{ 
            marginBottom: '1.5rem',
            paddingLeft: '3rem',
            paddingRight: '1.5rem',
          }}>
            <h3 style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              marginBottom: '0.8rem',
              opacity: '0.9',
              fontWeight: '600',
              color: 'var(--sidebar-text)',
            }}>
              Conversations
            </h3>
            
            <button 
              onClick={handleNewChatClick}
              style={{
                color: 'var(--sidebar-text)',
                background: 'none',
                border: 'none',
                padding: '0.6rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s, padding-left 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                width: '100%',
                textAlign: 'left',
                marginBottom: '0.3rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
              title="Start a new conversation"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.paddingLeft = '0';
              }}
            >
              <Plus size={18} color="currentColor" />
              New Chat
            </button>
            
            <Link href="#saved-chats">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.6rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s, padding-left 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                marginBottom: '0.3rem',
                fontSize: '0.95rem',
              }}
              title="View saved conversations"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.paddingLeft = '0';
              }}>
                <MessageSquare size={18} color="currentColor" />
                Saved Chats
              </a>
            </Link>
            
            <Link href="#saved-stories">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.6rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s, padding-left 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                fontSize: '0.95rem',
              }}
              title="Browse saved stories"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.paddingLeft = '0';
              }}>
                <Archive size={18} color="currentColor" />
                Saved Stories
              </a>
            </Link>
          </div>
          
          {/* Explore Section */}
          <div style={{ 
            marginBottom: '1.5rem',
            paddingLeft: '3rem',
            paddingRight: '1.5rem',
          }}>
            <h3 style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              marginBottom: '0.8rem',
              opacity: '0.9',
              fontWeight: '600',
              color: 'var(--sidebar-text)',
            }}>
              Explore
            </h3>
            
            <Link href="#historical-figures">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.6rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s, padding-left 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                marginBottom: '0.3rem',
                fontSize: '0.95rem',
              }}
              title="Learn about historical figures"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.paddingLeft = '0';
              }}>
                <Users size={18} color="currentColor" />
                Historical Figures
              </a>
            </Link>
            
            <Link href="#cultural-stories">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.6rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s, padding-left 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                marginBottom: '0.3rem',
                fontSize: '0.95rem',
              }}
              title="Explore cultural stories and traditions"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.paddingLeft = '0';
              }}>
                <BookOpen size={18} color="currentColor" />
                Cultural Stories
              </a>
            </Link>
            
            <Link href="#diaspora-community">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.6rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s, padding-left 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                fontSize: '0.95rem',
              }}
              title="Connect with the global diaspora community"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.paddingLeft = '0';
              }}>
                <Globe size={18} color="currentColor" />
                Diaspora Community
              </a>
            </Link>
          </div>
          
          {/* About Section */}
          <div style={{ 
            marginBottom: '1.5rem',
            paddingLeft: '3rem',
            paddingRight: '1.5rem',
          }}>
            <h3 style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              marginBottom: '0.8rem',
              opacity: '0.9',
              fontWeight: '600',
              color: 'var(--sidebar-text)',
            }}>
              About
            </h3>
            
            <Link href="/about">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.6rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s, padding-left 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                marginBottom: '0.3rem',
                fontSize: '0.95rem',
              }}
              onClick={onClose}
              title="Learn more about GriotBot"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.paddingLeft = '0';
              }}>
                <Info size={18} color="currentColor" />
                About GriotBot
              </a>
            </Link>
            
            <Link href="/feedback">
              <a style={{
                color: 'var(--sidebar-text)',
                textDecoration: 'none',
                padding: '0.6rem 0',
                borderRadius: '6px',
                transition: 'background-color 0.2s, padding-left 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                fontSize: '0.95rem',
              }}
              onClick={onClose}
              title="Share your feedback with us"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.paddingLeft = '0.5rem';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.paddingLeft = '0';
              }}>
                <MessageCircle size={18} color="currentColor" />
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
          opacity: '0.8',
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
