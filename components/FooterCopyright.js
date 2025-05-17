// File: /components/FooterCopyright.js
import React from 'react';

export default function FooterCopyright() {
  return (
    <div 
      id="footer-copyright"
      className="footer-copyright-component"
      style={{
        position: 'fixed',
        bottom: '10px',
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color, #33302e)',
        opacity: 0.6,
        zIndex: 998, // High but below proverb
        pointerEvents: 'none',
      }}
    >
      © 2025 GriotBot. All rights reserved.
    </div>
  );
}
