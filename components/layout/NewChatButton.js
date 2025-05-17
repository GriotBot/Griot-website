// File: /components/layout/NewChatButton.js
import React from 'react';
import { useRouter } from 'next/router';

export default function NewChatButton() {
  const router = useRouter();
  const isIndexPage = router.pathname === '/';
  
  const handleNewChat = () => {
    // If we're on the index page, clear local storage and reload
    if (isIndexPage) {
      localStorage.removeItem('griotbot-history');
      window.location.reload();
    } else {
      // If on another page, navigate to home with reset parameter
      router.push('/?reset=true');
    }
  };

  return (
    <button
      onClick={handleNewChat}
      aria-label="Start new chat"
      title="Start new chat"
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        marginRight: '0.5rem',
        borderRadius: '50%',
        color: 'var(--header-text)',
        transition: 'background-color 0.2s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* Chat icon SVG */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <line x1="12" y1="7" x2="12" y2="13"></line>
        <line x1="9" y1="10" x2="15" y2="10"></line>
      </svg>
    </button>
  );
}
