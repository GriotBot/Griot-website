// File: /components/layout/EnhancedSidebar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function EnhancedSidebar({ visible, closeSidebar }) {
  const router = useRouter();
  const currentPath = router.pathname;
  
  // Track hover states for interactive feedback
  const [hoveredItems, setHoveredItems] = useState({});
  
  // Handle item hover
  const handleHover = (id, isHovered) => {
    setHoveredItems(prev => ({
      ...prev,
      [id]: isHovered
    }));
  };
  
  // For accessibility - trap focus inside sidebar when visible
  useEffect(() => {
    if (visible) {
      // Focus the first interactive element when opened
      const firstButton = document.querySelector('#return-to-chat');
      if (firstButton) firstButton.focus();
    }
  }, [visible]);

  // Shared styles
  const linkStyle = (isActive = false, isSubItem = false) => ({
    color: 'var(--sidebar-text)',
    textDecoration: 'none',
    padding: '0.4rem 0.5rem',
    borderRadius: '6px',
    transition: 'background-color 0.2s, transform 0.1s',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
    marginBottom: isSubItem ? '0.25rem' : '0.4rem',
    marginLeft: isSubItem ? '1.25rem' : '0', 
    fontSize: isSubItem ? '0.9rem' : '1rem',
    position: 'relative',
    transform: hoveredItems[`${isSubItem ? 'sub-' : ''}${isActive ? 'active-' : ''}link`] ? 'translateX(3px)' : 'none'
  });

  const sectionHeadingStyle = {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.4rem',
    opacity: '0.8',
    fontWeight: '500',
    paddingLeft: '0.5rem'
  };

  return (
    <nav 
      id="sidebar"
      role="navigation" 
      aria-label="Main navigation"
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '280px',
        background: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        padding: '1.5rem 1.25rem 1.5rem 1.5rem',
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
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
    >
      {/* Return to chat button at top with more space - increased by 25% */}
      <div style={{ marginTop: '3rem' }}>
        <Link href="/">
          <a
            id="return-to-chat"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent-color)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background-color 0.2s, transform 0.1s',
              transform: hoveredItems['return-button'] ? 'translateY(-2px)' : 'none',
              boxShadow: hoveredItems['return-button'] ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
            }}
            onClick={closeSidebar}
            onMouseEnter={() => handleHover('return-button', true)}
            onMouseLeave={() => handleHover('return-button', false)}
            aria-label="Return to chat"
          >
            Return to chat
          </a>
        </Link>
      </div>

      {/* Tagline with increased spacing */}
      <div 
        style={{
          fontStyle: 'italic',
          fontSize: '0.95rem',
          opacity: '0.9',
          fontFamily: 'Lora, serif',
          marginTop: '2.5rem',
          marginBottom: '2.5rem',
          borderLeft: '2px solid var(--accent-color)',
          paddingLeft: '0.75rem',
        }}
      >
        Preserving our stories,<br/>empowering our future.
      </div>

      {/* Vertical line divider - adjusted for more space at top */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '25px',
          top: '250px', /* Moved down to account for more space at top */
          bottom: '25px',
          width: '1px',
          backgroundColor: 'rgba(255,255,255,0.25)'
        }}
      ></div>

      {/* Main navigation sections - with more compact spacing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginLeft: '10px' }}>
        {/* About section */}
        <Link href="/about">
          <a 
            style={linkStyle(currentPath === '/about')}
            onMouseEnter={() => handleHover(currentPath === '/about' ? 'active-link' : 'link', true)}
            onMouseLeave={() => handleHover(currentPath === '/about' ? 'active-link' : 'link', false)}
            aria-current={currentPath === '/about' ? 'page' : undefined}
          >
            About GriotBot
          </a>
        </Link>

        {/* Feedback section */}
        <Link href="/feedback">
          <a 
            style={linkStyle(currentPath === '/feedback')}
            onMouseEnter={() => handleHover(currentPath === '/feedback' ? 'active-link' : 'link', true)}
            onMouseLeave={() => handleHover(currentPath === '/feedback' ? 'active-link' : 'link', false)}
            aria-current={currentPath === '/feedback' ? 'page' : undefined}
          >
            Feedback
          </a>
        </Link>

        {/* Conversations section */}
        <div>
          <h3 style={sectionHeadingStyle}>
            Conversations
          </h3>
          
          <Link href="/">
            <a 
              style={linkStyle(currentPath === '/', true)} 
              onMouseEnter={() => handleHover(currentPath === '/' ? 'active-sub-link' : 'sub-link', true)}
              onMouseLeave={() => handleHover(currentPath === '/' ? 'active-sub-link' : 'sub-link', false)}
              aria-current={currentPath === '/' ? 'page' : undefined}
            >
              <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>+</span> New Chat
            </a>
          </Link>
          
          <a 
            href="#" 
            style={linkStyle(false, true)}
            onMouseEnter={() => handleHover('sub-link-saved', true)}
            onMouseLeave={() => handleHover('sub-link-saved', false)}
          >
            Saved Chats
          </a>
          
          <a 
            href="#" 
            style={linkStyle(false, true)}
            onMouseEnter={() => handleHover('sub-link-stories', true)}
            onMouseLeave={() => handleHover('sub-link-stories', false)}
          >
            Saved Stories
          </a>
        </div>
        
        {/* Explore section */}
        <div>
          <h3 style={sectionHeadingStyle}>
            Explore
          </h3>
          
          <a 
            href="#" 
            style={linkStyle(false, true)}
            onMouseEnter={() => handleHover('sub-link-historical', true)}
            onMouseLeave={() => handleHover('sub-link-historical', false)}
          >
            Historical Figures
          </a>
          
          <a 
            href="#" 
            style={linkStyle(false, true)}
            onMouseEnter={() => handleHover('sub-link-cultural', true)}
            onMouseLeave={() => handleHover('sub-link-cultural', false)}
          >
            Cultural Stories
          </a>
          
          <a 
            href="#" 
            style={linkStyle(false, true)}
            onMouseEnter={() => handleHover('sub-link-diaspora', true)}
            onMouseLeave={() => handleHover('sub-link-diaspora', false)}
          >
            Diaspora Community
          </a>
        </div>
      </div>

      {/* Version tag at bottom */}
      <div style={{
        marginTop: 'auto',
        fontSize: '0.7rem',
        opacity: '0.6',
        textAlign: 'center',
        padding: '0.5rem',
      }}>
        GriotBot v1.0
      </div>
    </nav>
  );
}
