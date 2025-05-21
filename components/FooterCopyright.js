// components/FooterCopyright.js
export default function FooterCopyright() {
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color, #33302e)',
        opacity: 0.6,
        zIndex: 40,
        pointerEvents: 'none',
      }}
      aria-label="Copyright information"
    >
      © 2025 GriotBot. All rights reserved.
    </div>
  );
}
