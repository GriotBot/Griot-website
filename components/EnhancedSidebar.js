// components/EnhancedSidebar.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function EnhancedSidebar({ isVisible, onClose, onNewChat }) {
  const router = useRouter();
  const currentPath = router.pathname;

  // Handle new chat click
  const handleNewChatClick = (e) => {
    e.preventDefault();
    onNewChat();
    onClose(); // Close sidebar after clicking
  };

  // Handle link clicks that should close sidebar
  const handleLinkClick = () => {
    onClose();
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
          }}
          onClick={onClose}
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
          background: 'var(--sidebar-bg, rgba(75, 46, 42, 0.97))',
          color: 'var(--sidebar-text, #f8f5f0)',
          padding: '1.5rem',
          transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out, background 0.3s',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '4px 0 20px var(--shadow-color, rgba(75, 46, 42, 0.15))',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          overflowY: 'auto',
        }}
        id="sidebar"
        aria-hidden={!isVisible}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'Lora, serif',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}>
            <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🌿</span>
            GriotBot
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--sidebar-text, #f8f5f0)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>
        
        {/* Conversations Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            opacity: '0.8',
            margin: '0 0 0.5rem 0',
          }}>
            Conversations
          </h3>
          
          <a
            href="#"
            onClick={handleNewChatClick}
            style={{
              color: 'var(--sidebar-text, #f8f5f0)',
              textDecoration: 'none',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
              display: 'block',
              marginBottom: '0.5rem',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <span aria-hidden="true" style={{ marginRight: '0.5rem' }}>+</span> New Chat
          </a>
          
          <a href="#" style={{
            color: 'var(--sidebar-text, #f8f5f0)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
            opacity: '0.7',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Saved Conversations
          </a>
        </div>
        
        {/* Explore Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            opacity: '0.8',
            margin: '0 0 0.5rem 0',
          }}>
            Explore
          </h3>
          
          <a href="#" style={{
            color: 'var(--sidebar-text, #f8f5f0)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
            opacity: '0.7',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Historical Figures
          </a>
          
          <a href="#" style={{
            color: 'var(--sidebar-text, #f8f5f0)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            marginBottom: '0.5rem',
            opacity: '0.7',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Cultural Stories
          </a>
          
          <a href="#" style={{
            color: 'var(--sidebar-text, #f8f5f0)',
            textDecoration: 'none',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
            display: 'block',
            opacity: '0.7',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Diaspora Community
          </a>
        </div>
        
        {/* About Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            opacity: '0.8',
            margin: '0 0 0.5rem 0',
          }}>
            About
          </h3>
          
          <Link href="/about">
            <a
              onClick={handleLinkClick}
              style={{
                color: 'var(--sidebar-text, #f8f5f0)',
                textDecoration: 'none',
                padding: '0.5rem',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                display: 'block',
                marginBottom: '0.5rem',
                backgroundColor: currentPath === '/about' ? 'rgba(255,255,255,0.15)' : 'transparent',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.backgroundColor = currentPath === '/about' ? 'rgba(255,255,255,0.15)' : 'transparent'}
            >
              About GriotBot
            </a>
          </Link>
          
          <Link href="/feedback">
            <a
              onClick={handleLinkClick}
              style={{
                color: 'var(--sidebar-text, #f8f5f0)',
                textDecoration: 'none',
                padding: '0.5rem',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                display: 'block',
                backgroundColor: currentPath === '/feedback' ? 'rgba(255,255,255,0.15)' : 'transparent',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.backgroundColor = currentPath === '/feedback' ? 'rgba(255,255,255,0.15)' : 'transparent'}
            >
              Share Feedback
            </a>
          </Link>
        </div>
        
        {/* Footer Quote */}
        <div style={{
          marginTop: 'auto',
          fontSize: '0.8rem',
          opacity: '0.7',
          textAlign: 'center',
          fontStyle: 'italic',
          fontFamily: 'Lora, serif',
          lineHeight: 1.4,
          padding: '1rem 0.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          "Preserving our stories,<br/>empowering our future."
        </div>
      </nav>
    </>
  );
}
