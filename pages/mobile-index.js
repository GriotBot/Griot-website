// Mobile-Optimized GriotBot Interface
// File: pages/mobile-index.js (or updates to existing index.js)

import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { Menu, Send, RotateCcw, ThumbsUp, ThumbsDown, Copy, Sun, Moon } from 'react-feather';
import { MAX_HISTORY_LENGTH, CHAT_HISTORY_KEY } from '../lib/constants';

// Mobile-optimized constants
const MOBILE_BREAKPOINT = 768;
const MOBILE_HEADER_HEIGHT = 60;
const MOBILE_INPUT_HEIGHT = 80;
const MOBILE_SIDEBAR_WIDTH = 280;

export default function MobileGriotBot() {
  // State management
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [storytellerMode, setStorytellerMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for mobile optimization
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Mobile detection
  useEffect(() => {
@@ -37,108 +38,136 @@ export default function MobileGriotBot() {
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle message sending with conversation memory
  const handleSendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    setIsLoading(true);
    setShowWelcome(false);

    // Add user message
    // Add user message and placeholder bot message for streaming
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const botMessageId = `bot-${Date.now()}`;

    const messagesForHistory = [...messages, userMessage];
    setMessages([
      ...messagesForHistory,
      {
        id: botMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true
      }
    ]);
    setInputText('');

    // Prepare conversation history (last 10 messages)
    const conversationHistory = updatedMessages
    const conversationHistory = messagesForHistory
      .slice(-10)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText.trim(),
          storytellerMode: storytellerMode,
          conversationHistory: conversationHistory
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                         'I apologize, but I seem to be having trouble processing your request.';
      const contentType = response.headers.get('content-type');
      let accumulatedContent = '';

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        accumulatedContent = data.choices?.[0]?.message?.content ||
          'I apologize, but I seem to be having trouble processing your request.';
      } else {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          accumulatedContent += decoder.decode(value, { stream: true });
          setMessages(prev => prev.map(msg =>
            msg.id === botMessageId ? { ...msg, content: accumulatedContent, isStreaming: true } : msg
          ));
        }
      }

      const botMessage = {
        id: `bot-${Date.now()}`,
      const finalBotMessage = {
        id: botMessageId,
        role: 'assistant',
        content: botResponse,
        timestamp: new Date().toISOString()
        content: accumulatedContent,
        timestamp: new Date().toISOString(),
        isStreaming: false
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      
      // Save to localStorage
      localStorage.setItem('griotbot-history', JSON.stringify(finalMessages.slice(-50)));
      setMessages(prev => {
        const finalMessages = prev.map(msg => msg.id === botMessageId ? finalBotMessage : msg);
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(finalMessages.slice(-MAX_HISTORY_LENGTH)));
        return finalMessages;
      });
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages([...updatedMessages, errorMessage]);
      setMessages(prev => prev.map(msg =>
        msg.id === botMessageId ? {
          ...msg,
          content: 'I apologize, but I encountered an error. Please try again.',
          isStreaming: false
        } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, storytellerMode]);

  // Mobile-optimized suggestion cards
  const suggestionCards = [
    {
      category: "History",
      title: "Tell me about Juneteenth",
      prompt: "Tell me about the history and significance of Juneteenth",
      emoji: "📚"
    },
    {
      category: "Culture",
      title: "Share African wisdom",
      prompt: "Share some traditional African wisdom about community",
      emoji: "🌍"
    },
    {
      category: "Stories",
      title: "Tell me a story",
      prompt: "Tell me an inspiring story from the African diaspora",
      emoji: "✨"
    },
@@ -368,51 +397,51 @@ export default function MobileGriotBot() {
            font-size: 16px;
          }
          
          /* Hide scrollbars on mobile */
          ::-webkit-scrollbar { display: none; }
          * { scrollbar-width: none; }
        `}} />
      </Head>

      <div style={mobileStyles.container}>
        {/* Overlay for sidebar */}
        <div 
          style={mobileStyles.overlay}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile Sidebar */}
        <div style={mobileStyles.sidebar}>
          <h3>GriotBot Menu</h3>
          <div style={{ marginBottom: '2rem' }}>
            <button 
              onClick={() => {
                setMessages([]);
                setShowWelcome(true);
                setSidebarOpen(false);
                localStorage.removeItem('griotbot-history');
                localStorage.removeItem(CHAT_HISTORY_KEY);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: 'inherit',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            >
              + New Chat
            </button>
            
            <div style={mobileStyles.toggleSwitch}>
              <span>Storyteller Mode</span>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox"
                  checked={storytellerMode}
                  onChange={(e) => setStorytellerMode(e.target.checked)}
                  style={{ marginLeft: '0.5rem' }}
                />
              </label>
            </div>
