// components/Header.js
import { useState } from 'react';
import Link from 'next/link';
import { Menu, Moon, Sun } from 'react-feather';
import { MessageCirclePlus } from './icons/MessageCirclePlus';

export default function Header({ 
  theme = 'light', 
  toggleTheme, 
  toggleSidebar, 
  sidebarVisible = false,
  onNewChat 
}) {
  const [tooltip, setTooltip] = useState(null);
  
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: 'var(--header-bg, #c49a6c)',
      color: 'var(--header-text, #33302e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      zIndex: 100,
      boxShadow: '0 2px 10px var(--shadow-color, rgba(75, 46, 42, 0.15))',
    }}>
      {/* Left section with menu button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            color: 'white',
            position: 'relative',
          }}
          aria-label="Toggle menu"
          onMouseEnter={() => setTooltip('menu')}
          onMouseLeave={() => setTooltip(null)}
        >
          <Menu size={24} />
          {tooltip === 'menu' && (
            <span style={{
              position: 'absolute',
              bottom: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 101,
            }}>
              Menu
            </span>
          )}
        </button>
      </div>
      
      {/* Center section with logo */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <Link href="/">
          <a style={{
            display: 'block',
            height: '32px',
          }}>
            <img 
              src="/images/GriotBot logo horiz wht.svg"
              alt="GriotBot"
              style={{
                height: '100%',
                width: 'auto',
              }}
            />
          </a>
        </Link>
      </div>
      
      {/* Right section with action buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        {/* New chat button */}
        <button
          onClick={onNewChat}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            color: 'white',
            position: 'relative',
          }}
          aria-label="New chat"
          onMouseEnter={() => setTooltip('new')}
          onMouseLeave={() => setTooltip(null)}
        >
          <MessageCirclePlus size={24} />
          {tooltip === 'new' && (
            <span style={{
              position: 'absolute',
              bottom: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 101,
            }}>
              New Chat
            </span>
          )}
        </button>
        
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            color: 'white',
            position: 'relative',
          }}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onMouseEnter={() => setTooltip('theme')}
          onMouseLeave={() => setTooltip(null)}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          {tooltip === 'theme' && (
            <span style={{
              position: 'absolute',
              bottom: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 101,
            }}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
