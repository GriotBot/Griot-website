// File: components/layout/EnhancedSidebar.js
import Link from 'next/link';
import { 
  Home, 
  X, 
  Plus, 
  MessageCircle, 
  Bookmark, 
  Users, 
  Book, 
  MapPin, 
  Info, 
  MessageSquare 
} from 'react-feather';

export default function EnhancedSidebar({ 
  visible = false, 
  onClose, 
  currentPath = '/',
  onNewChat 
}) {
  
  // Navigation sections data
  const conversationLinks = [
    { href: '/', label: 'New Chat', icon: Plus, action: onNewChat },
    { href: '/comingsoon', label: 'Saved Conversations', icon: MessageCircle },
    { href: '/comingsoon', label: 'Saved Stories', icon: Bookmark }
  ];

  const exploreLinks = [
    { href: '/comingsoon', label: 'Historical Figures', icon: Users },
    { href: '/comingsoon', label: 'Cultural Stories', icon: Book },
    { href: '/comingsoon', label: 'Diaspora Community', icon: MapPin }
  ];

  const aboutLinks = [
    { href: '/about', label: 'About GriotBot', icon: Info },
    { href: '/feedback', label: 'Share Feedback', icon: MessageSquare }
  ];

  const NavLink = ({ href, label, icon: Icon, isActive, action }) => {
    // Only highlight if it's an exact match (not just a partial match)
    const shouldHighlight = isActive && href !== '/comingsoon';
    
    const linkClasses = `
      flex items-center gap-3 p-3 rounded-lg transition-all duration-200
      ${shouldHighlight 
        ? 'bg-white bg-opacity-20 text-white font-medium' 
        : 'text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
      }
    `;

    if (action) {
      return (
        <button
          onClick={action}
          className={linkClasses}
          style={{
            background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
            color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
            border: 'none',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit'
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'rgba(255,255,255,0.8)';
            }
          }}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      );
    }

    return (
      <Link href={href}>
        <a
          className={linkClasses}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '8px',
            transition: 'all 0.2s',
            background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
            color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
            textDecoration: 'none',
            fontWeight: isActive ? '500' : '400'
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'rgba(255,255,255,0.8)';
            }
          }}
        >
          <Icon size={18} />
          <span>{label}</span>
        </a>
      </Link>
    );
  };

  const SectionTitle = ({ children }) => (
    <h3 style={{
      fontSize: '0.8rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: 'rgba(255,255,255,0.6)',
      marginBottom: '8px',
      marginTop: '24px'
    }}>
      {children}
    </h3>
  );

  return (
    <aside
      style={{
        position: 'fixed',
        top: '72px', // Start below top menu
        left: '0',
        height: 'calc(100vh - 72px)',
        width: '189px',
        background: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '4px 0 20px var(--shadow-color)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        overflowY: 'auto'
      }}
      aria-hidden={!visible}
      aria-label="Main navigation"
    >
      {/* Header with Return to Chat and Close */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Link href="/">
          <a style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--accent-color)',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '0.9rem',
            padding: '6px 12px',
            borderRadius: '6px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(215, 114, 44, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
          >
            <Home size={16} />
            <span>Return to Chat</span>
          </a>
        </Link>
        
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'color 0.2s, background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'white';
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'rgba(255,255,255,0.6)';
            e.target.style.backgroundColor = 'transparent';
          }}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Sections */}
      <nav style={{ flex: 1 }}>
        {/* Conversations Section */}
        <div>
          <SectionTitle>Conversations</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {conversationLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                icon={link.icon}
                isActive={currentPath === link.href}
                action={link.action}
              />
            ))}
          </div>
        </div>

        {/* Explore Section */}
        <div>
          <SectionTitle>Explore</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {exploreLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                icon={link.icon}
                isActive={currentPath === link.href && link.href !== '/comingsoon'}
              />
            ))}
          </div>
        </div>

        {/* About Section */}
        <div>
          <SectionTitle>About</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {aboutLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                icon={link.icon}
                isActive={currentPath === link.href && link.href !== '/comingsoon'}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer Quote */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '1.5rem',
        fontSize: '0.75rem',
        opacity: '0.7',
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: 'var(--quote-font)',
        lineHeight: '1.4',
        color: 'rgba(255,255,255,0.6)'
      }}>
        "Preserving our stories,<br/>empowering our future."
      </div>
    </aside>
  );
}
