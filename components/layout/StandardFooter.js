// File: components/layout/StandardFooter.js
import Link from 'next/link';

export default function StandardFooter() {
  
  const LINK_STYLES = {
    color: 'var(--text-color)',
    opacity: 0.7,
    textDecoration: 'none',
    transition: 'opacity 0.2s',
  };
  
  const handleHover = (e, isHovering) => {
    e.target.style.opacity = isHovering ? '1' : '0.7';
    e.target.style.textDecoration = isHovering ? 'underline' : 'none';
  }

  return (
    <footer 
      role="contentinfo"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--footer-height-standard)',
        background: 'var(--footer-background-standard, rgb(239, 230, 223))',
        borderTop: '1px solid var(--input-border)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        zIndex: 50,
      }}
    >
      <div 
        style={{
          display: 'flex',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: 'var(--text-color)',
          opacity: 0.7,
          textAlign: 'center',
          fontFamily: 'var(--body-font)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <span>© {new Date().getFullYear()} GriotBot Corporation. All rights reserved.</span>
        <span className="footer-separator" style={{ opacity: 0.5 }}>|</span>
        <Link href="/terms" legacyBehavior>
            <a 
              style={LINK_STYLES}
              onMouseEnter={(e) => handleHover(e, true)}
              onMouseLeave={(e) => handleHover(e, false)}
            >
              Terms
            </a>
        </Link>
        <span className="footer-separator" style={{ opacity: 0.5 }}>|</span>
        <Link href="/privacy" legacyBehavior>
             <a 
              style={LINK_STYLES}
              onMouseEnter={(e) => handleHover(e, true)}
              onMouseLeave={(e) => handleHover(e, false)}
            >
              Privacy
            </a>
        </Link>
      </div>
    </footer>
  );
}
