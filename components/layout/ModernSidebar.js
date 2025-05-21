// File: components/layout/ModernSidebar.js
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Home, XCircle, MessageSquare, BookOpen, Users, Info, Send, Bookmark, Award } from 'react-feather';

const ModernSidebar = ({ visible, onClose, activePage }) => {
  // Only run on client side
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && visible) {
        onClose();
      }
    };

    // Close sidebar when clicking outside
    const handleClickOutside = (e) => {
      const sidebar = document.getElementById('sidebar');
      if (visible && sidebar && !sidebar.contains(e.target) && !e.target.closest('button[aria-controls="sidebar"]')) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  // Safe path checking function that works server-side
  const isActive = (path) => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === path;
    }
    return activePage === path;
  };

  const styles = {
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: '280px',
      background: 'var(--sidebar-bg)',
      color: 'var(--sidebar-text)',
      padding: '1.5rem 1rem 1.5rem 1.5rem',
      transform: visible ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out, background 0.3s',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '4px 0 20px var(--shadow-color)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      overflowY: 'auto'
    },
    // Other styles remain the same
    // ...
  };

  return (
    <nav
      id="sidebar"
      style={styles.sidebar}
      aria-hidden={!visible}
      aria-label="Main navigation"
    >
      {/* Rest of the component remains the same */}
      {/* ... */}
    </nav>
  );
};

export default ModernSidebar;
