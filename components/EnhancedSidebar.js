// components/EnhancedSidebar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  MessageCircle, 
  Archive, 
  Users, 
  Book, 
  Info, 
  HelpCircle,
  X
} from 'react-feather';

export default function EnhancedSidebar({ visible, onClose }) {
  const router = useRouter();
  const { pathname } = router;
  
  // Handle clicks on sidebar links and close sidebar
  const handleLinkClick = (path) => {
    if (onClose) onClose();
    if (path === pathname) return;
    router.push(path);
  };
  
  // Handle new chat button click
  const handleNewChat = () => {
    if (onClose) onClose();
    // Clear chat history
    if (typeof window !== 'undefined') {
      localStorage.removeItem('griotbot-history');
      if (pathname === '/') {
        window.location.reload();
      } else {
        router.push('/');
      }
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
        background: 'var(--sidebar-bg, rgba(75, 46, 42, 0.97))',
        color: 'var(--sidebar-text, #f8f5f0)',
        padding: '4rem 1.5rem 1.5rem',
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '4px 0 20px var(--shadow-color, rgba(75, 46, 42, 0.15))',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
      aria-hidden={!visible}
      onClick={(e) => e.target === e.currentTarget && onClose && onClose()}
    >
      {/* Close button (X) */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          color: 'var(--sidebar-text)',
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'background-color 0.2s',
        }}
        aria-label="Close sidebar"
      >
        <X size={20} />
      </button>
      
      {/* Return to Chat button */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
      }}>
        <button
          onClick={handleNewChat}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--accent-color, #d7722c)',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        >
          <Home size={18} />
          Return to Chat
        </button>
      </div>
      
      {/* Vertical divider */}
      <div 
        style={{
          position: 'absolute',
          left: '25px',
          top: '120px',
          bottom: '25px',
          width: '1px',
          backgroundColor: 'rgba(255,255,255,0.25)',
        }}
        aria-hidden="true"
      />
      
      {/* Navigation sections */}
      <div style={{ paddingLeft: '15px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '0.8rem',
            opacity: 0.7,
            fontWeight: 600,
            paddingLeft: '0.5rem',
          }}>
            Conversations
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            <li>
              <button
                onClick={handleNewChat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6rem 0.7rem',
                  borderRadius: '6px',
                  backgroundColor: pathname === '/' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontWeight: pathname === '/' ? 500 : 'normal',
                }}
              >
                <MessageCircle size={18} />
                New Chat
              </button>
            </li>
            <li>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6rem 0.7rem',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                <Archive size={18} />
                Saved Conversations
              </button>
            </li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '0.8rem',
            opacity: 0.7,
            fontWeight: 600,
            paddingLeft: '0.5rem',
          }}>
            Explore
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            <li>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6rem 0.7rem',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                <Users size={18} />
                Historical Figures
              </button>
            </li>
            <li>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6rem 0.7rem',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                <Book size={18} />
                Cultural Stories
              </button>
            </li>
            <li>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6rem 0.7rem',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                <Users size={18} />
                Diaspora Community
              </button>
            </li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '0.8rem',
            opacity: 0.7,
            fontWeight: 600,
            paddingLeft: '0.5rem',
          }}>
            About
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            <li>
              <button
                onClick={() => handleLinkClick('/about')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6rem 0.7rem',
                  borderRadius: '6px',
                  backgroundColor: pathname === '/about' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontWeight: pathname === '/about' ? 500 : 'normal',
                }}
              >
                <Info size={18} />
                About GriotBot
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('/feedback')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6rem 0.7rem',
                  borderRadius: '6px',
                  backgroundColor: pathname === '/feedback' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontWeight: pathname === '/feedback' ? 500 : 'normal',
                }}
              >
                <HelpCircle size={18} />
                Share Feedback
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Footer area */}
      <div style={{
        marginTop: 'auto',
        textAlign: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        fontFamily: 'Lora, serif',
        fontStyle: 'italic',
        opacity: 0.8,
      }}>
        "Preserving our stories,<br/>empowering our future."
        
        <div style={{
          fontSize: '0.7rem',
          marginTop: '1rem',
          opacity: 0.6,
        }}>
          GriotBot v1.0
        </div>
      </div>
