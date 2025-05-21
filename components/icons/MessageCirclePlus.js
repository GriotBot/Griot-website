// File: components/icons/MessageCirclePlus.js
import React from 'react';
import { MessageCircle } from 'react-feather';

const MessageCirclePlus = ({ size = 24, color = 'currentColor', ...props }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }} {...props}>
      <MessageCircle size={size} color={color} />
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          right: -2,
          bottom: -2,
          background: 'var(--header-bg)',
          borderRadius: '50%',
        }}
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>
  );
};

export default MessageCirclePlus;
