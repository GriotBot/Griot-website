// File: /pages/index.js - ENHANCED WITH SMART ROUTING MONITORING + TWEAKS
import { useEffect, useState } from 'react';
import Head from 'next/head';
import EnhancedSidebar from '../components/EnhancedSidebar';
import MessageCirclePlus from '../components/icons/MessageCirclePlus';
import ModelUsageDashboard from '../components/ModelUsageDashboard';
import { 
  Menu, 
  LogIn, 
  Sun, 
  Moon,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  ArrowUpCircle  // NEW: Import arrow-up-circle icon
} from 'react-feather';

export default function Home() {
  // State to ensure we can access DOM elements after mounting
  const [isClient, setIsClient] = useState(false);
  
  // State management
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [storytellerMode, setStorytellerMode] = useState(false);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Load chat history and preferences
    loadChatHistory();
    loadPreferences();

    // Initialize chat functionality
    if (typeof window !== 'undefined') {
      initializeChat();
    }
  }, []);

  // Load chat history from localStorage
  function loadChatHistory() {
    try {
      const hist = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
      if (hist.length > 0) {
        setShowWelcome(false);
        setMessages(hist);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      localStorage.removeItem('griotbot-history');
    }
  }

  // Load user preferences
  function loadPreferences() {
    try {
      const savedStorytellerMode = localStorage.getItem('griotbot-storyteller-mode');
      if (savedStorytellerMode !== null) {
        setStorytellerMode(JSON.parse(savedStorytellerMode));
      }
      
      // Load theme preference
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  }

  // Save chat history to localStorage
  function saveChatHistory(newMessages) {
    try {
      const historyToSave = newMessages.slice(-50); // Keep only the most recent 50 messages
      localStorage.setItem('griotbot-history', JSON.stringify(historyToSave));
    } catch (err) {
      console.error('Error saving chat history:', err);
    }
  }

  // Function that initializes remaining chat functionality
  function initializeChat() {
    const factElement = document.getElementById('fact');
    const suggestionCards = document.querySelectorAll('.suggestion-card');

    // If any element is missing, return (may happen during initial mounting)
    if (!factElement) {
      console.warn('Some DOM elements not found, initialization delayed');
      return;
    }

    // RANDOM PROVERB - FIXED CHARACTER ENCODING
    const proverbs = [
      "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
      "Until the lion learns to write, every story will glorify the hunter. — African Proverb",
      "We are the drums, we are the dance. — Afro-Caribbean Proverb",
      "A tree cannot stand without its roots. — Jamaican Proverb",
      "Unity is strength, division is weakness. — Swahili Proverb",
      "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
      "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
      "A bird will always use another bird's feathers to feather its nest. — Ashanti Proverb",
      "You must act as if it is impossible to fail. — Yoruba Wisdom",
      "The child who is not embraced by the village will burn it down to feel its warmth. — West African Proverb",
      "However long the night, the dawn will break. — African Proverb",
      "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
      "It takes a village to raise a child. — African Proverb",
      "The fool speaks, the wise listen. — Ethiopian Proverb",
      "When the music changes, so does the dance. — Haitian Proverb"
    ];
    
    function showRandomProverb() {
      const randomIndex = Math.floor(Math.random() * proverbs.length);
      factElement.textContent = proverbs[randomIndex];
      factElement.setAttribute('aria-label', `Proverb: ${proverbs[randomIndex]}`);
    }
    
    showRandomProverb(); // Show proverb on init

    // SUGGESTION CARDS HANDLER
    suggestionCards.forEach(card => {
      card.addEventListener('click', () => {
        const prompt = card.getAttribute('data-prompt');
        if (prompt) {
          handleSuggestionClick(prompt);
        }
      });
    });

    console.log('✅ GriotBot chat initialized with enhanced features');
  }

  // Handle suggestion card clicks
  const handleSuggestionClick = (prompt) => {
    // Hide welcome screen and send the suggested prompt
    setShowWelcome(false);
    handleSendMessage(prompt);
  };

  // Handle new chat - clear everything
  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setSidebarVisible(false);
    localStorage.removeItem('griotbot-history');
    setStorytellerMode(false);
    localStorage.removeItem('griotbot-storyteller-mode');
    console.log('🔄 New chat started - history cleared');
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Handle sidebar close
  const handleSidebarClose = () => {
    setSidebarVisible(false);
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Handle storyteller mode change
  const handleStorytellerModeChange = (newMode) => {
    setStorytellerMode(newMode);
    localStorage.setItem('griotbot-storyteller-mode', JSON.stringify(newMode));
  };

  // 🎯 ENHANCED SEND MESSAGE HANDLER WITH SMART ROUTING MONITORING
  const handleSendMessage = async (messageText, customStorytellerMode = null) => {
    const useStorytellerMode = customStorytellerMode !== null ? customStorytellerMode : storytellerMode;
    
    if (!messageText || typeof messageText !== 'string' || !messageText.trim()) {
      return;
    }

    const userMessage = {
      role: 'user',
      content: messageText.trim(),
      time: new Date().toISOString()
    };

    // Add user message to state
    const newMessagesWithUser = [...messages, userMessage];
    setMessages(newMessagesWithUser);
    setIsLoading(true);
    setShowWelcome(false);

    try {
      // 🚀 API call to our SMART ROUTING serverless function
      console.log('🚀 Sending request to smart routing API...');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          prompt: messageText.trim(),
          storytellerMode: useStorytellerMode
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: Status ${res.status}`);
      }
      
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                        'I apologize, but I seem to be having trouble processing your request.';
      
      // 🎯 NEW: LOG MODEL USAGE FOR COST MONITORING
      if (window.logModelUsage && data.model_used) {
        console.log(`📊 Logging model usage: ${data.model_used}, Cost: $${data.estimated_cost || 0}, Free: ${data.is_free || false}`);
        window.logModelUsage(
          data.model_used, 
          data.estimated_cost || 0, 
          data.usage || {}
        );
      }
      
      // Log the smart routing results
      console.log(`✅ Model used: ${data.model_used || 'Unknown'}`);
      console.log(`💰 Estimated cost: $${data.estimated_cost || 0}`);
      console.log(`🆓 Free model used: ${data.is_free ? 'YES' : 'NO'}`);
      if (data.usage) {
        console.log(`📊 Token usage: ${data.usage.total_tokens || 0} tokens`);
      }
      
      const botMessage = {
        role: 'bot',
        content: botResponse,
        time: new Date().toISOString(),
        // 🆕 Store model info for potential future use
        modelUsed: data.model_used,
        estimatedCost: data.estimated_cost,
        isFree: data.is_free,
        isStreaming: true  // NEW: This will only animate if it's the latest message
      };

      // Add bot response to messages (will animate in renderMessage)
      const finalMessages = [...newMessagesWithUser, botMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
      
    } catch (err) {
      console.error('API error:', err);
      
      const errorMessage = {
        role: 'bot',
        content: `I'm sorry, I encountered an error: ${err.message}. Please try again later.`,
        time: new Date().toISOString()
      };

      const finalMessages = [...newMessagesWithUser, errorMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // Format time for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // NEW: Animated text component for streaming effect
  const AnimatedText = ({ text, delay = 30 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, delay);

        return () => clearTimeout(timer);
      }
    }, [currentIndex, text, delay]);

    useEffect(() => {
      // Reset when text changes
      setDisplayedText('');
      setCurrentIndex(0);
    }, [text]);

    return <span>{displayedText}</span>;
  };

  // Render message with appropriate styling
  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    const isLatestBotMessage = !isUser && index === messages.length - 1 && !isLoading;
    
    return (
      <div
        key={index}
        style={{
          padding: '1rem 1.2rem',
          margin: '0.5rem 0',
          borderRadius: '12px',
          maxWidth: '80%',
          wordWrap: 'break-word',
          boxShadow: '0 3px 6px var(--shadow-color)',
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          backgroundColor: isUser ? 'var(--user-bubble)' : 'var(--bot-bubble-start)',
          background: isUser ? 'var(--user-bubble)' : 'linear-gradient(135deg, var(--bot-bubble-start), var(--bot-bubble-end))',
          color: isUser ? 'var(--user-text)' : 'var(--bot-text)',
          animation: 'message-fade-in 0.3s ease-out forwards',
          lineHeight: 1.6
        }}
      >
        {!isUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.8rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* NEW: Always use white logo for bot messages */}
            <img 
              src="/images/GriotBot logo horiz wht.svg"
              alt="GriotBot" 
              style={{
                height: '20px',
                width: 'auto',
                marginRight: '0.5rem',
              }}
              onError={(e) => {
                // Fallback if logo doesn't exist
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline';
              }}
            />
            <span style={{ 
              display: 'none',
              fontSize: '1.2rem', 
              marginRight: '0.5rem' 
            }}>🌿</span>
            <span style={{ fontWeight: '600' }}>GriotBot</span>
            
            {/* 🆕 Show model info in development mode */}
            {process.env.NODE_ENV === 'development' && message.modelUsed && (
              <span style={{
                fontSize: '0.7rem',
                opacity: '0.6',
                marginLeft: '0.5rem',
                background: message.isFree ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 193, 7, 0.3)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                {message.isFree ? '🆓' : '💰'} {message.modelUsed?.split('/').pop()?.split(':')[0] || 'Unknown'}
              </span>
            )}
          </div>
        )}
        
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {/* NEW: Only animate the most recent bot message */}
          {!isUser && message.isStreaming && isLatestBotMessage ? (
            <AnimatedText text={message.content} delay={25} />
          ) : (
            message.content
          )}
        </div>
        
        <div style={{
          fontSize: '0.7rem',
          opacity: '0.7',
          marginTop: '0.5rem',
          textAlign: 'right'
        }}>
          {formatTime(message.time)}
        </div>

        {/* Action buttons for bot messages */}
        {!isUser && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.8rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            justifyContent: 'flex-start',
          }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(message.content);
                // Could add a toast notification here
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--bot-text)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                opacity: '0.7',
                transition: 'opacity 0.2s, background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Copy message"
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.7';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <Copy size={16} />
            </button>
            
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--bot-text)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                opacity: '0.7',
                transition: 'opacity 0.2s, background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Good response"
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.7';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <ThumbsUp size={16} />
            </button>
            
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--bot-text)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                opacity: '0.7',
                transition: 'opacity 0.2s, background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Poor response"
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.7';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <ThumbsDown size={16} />
            </button>
            
            <button
              onClick={() => {
                // Re-send the original user message to get a new response
                const userMessages = messages.filter(m => m.role === 'user');
                const correspondingUserMessage = userMessages[Math.floor(index / 2)];
                if (correspondingUserMessage) {
                  handleSendMessage(correspondingUserMessage.content);
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--bot-text)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                opacity: '0.7',
                transition: 'opacity 0.2s, background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Regenerate response"
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.7';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <RotateCw size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Replace the single favicon line with this */}
<link rel="icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#c49a6c" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* CRITICAL INLINE STYLES */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --header-text: #33302e;
            --sidebar-bg: rgba(75, 46, 42, 0.97);
            --sidebar-text: #f8f5f0;
            --user-bubble: #bd8735;
            --user-text: #f8f5f0;
            --bot-bubble-start: #7d8765;
            --bot-bubble-end: #5e6e4f;
            --bot-text: #f8f5f0;
            --accent-color: #d7722c;
            --accent-hover: #c86520;
            --wisdom-color: #6b4226;
            --input-bg: #ffffff;
            --input-border: rgba(75, 46, 42, 0.2);
            --input-text: #33302e;
            --shadow-color: rgba(75, 46, 42, 0.15);
            --card-bg: #ffffff;
          }
          
          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
            --header-text: #f0ece4;
            --sidebar-bg: rgba(40, 30, 25, 0.97);
            --sidebar-text: #f0ece4;
            --user-bubble: #bb7e41;
            --user-text: #f0ece4;
            --bot-bubble-start: #5e6e4f;
            --bot-bubble-end: #3e4a38;
            --bot-text: #f0ece4;
            --accent-color: #d7722c;
            --accent-hover: #e8833d;
            --wisdom-color: #e0c08f;
            --input-bg: #352e29;
            --input-border: rgba(240, 236, 228, 0.2);
            --input-text: #f0ece4;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --card-bg: #352e29;
          }

          * { box-sizing: border-box; }

          body {
            margin: 0;
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow-x: hidden;
            transition: background-color 0.3s, color 0.3s;
            line-height: 1.6;
          }

          @keyframes message-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @keyframes typing-bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          
          .suggestion-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px var(--shadow-color);
          }
        `}} />
      </Head>
      
      {/* HEADER + CONTROLS */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--header-bg)',
        color: 'var(--header-text)',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 2px 10px var(--shadow-color)',
        zIndex: 1001,
        transition: 'background-color 0.3s',
        fontFamily: 'Lora, serif',
        height: '70px',
      }}>
        {/* LEFT SIDE - Menu */}
        <button 
          onClick={sidebarVisible ? handleSidebarClose : handleSidebarToggle}
          style={{
            fontSize: '1.5rem',
            color: 'var(--header-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
            transition: 'background-color 0.2s, transform 0.3s ease',
            position: 'relative',
            transform: sidebarVisible ? 'rotate(90deg)' : 'rotate(0deg)', // Rotate when sidebar is open
          }}
          aria-label={sidebarVisible ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarVisible}
          aria-controls="sidebar"
          title="Menu"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <Menu size={24} />
        </button>
        
        {/* CENTER - Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
          <img 
            src="/images/GriotBot logo horiz wht.svg" 
            alt="GriotBot" 
            style={{
              height: '40px',
              width: 'auto',
            }}
            onError={(e) => {
              // Fallback if logo doesn't exist
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback text logo */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}>
            🌿 GriotBot
          </div>
        </div>
        
        {/* RIGHT SIDE - Action Icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          {/* New Chat */}
          <button 
            onClick={handleNewChat}
            style={{
              color: 'var(--header-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
            }}
            aria-label="New Chat"
            title="New Chat"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <MessageCirclePlus size={24} />
          </button>
          
          {/* Account */}
          <button 
            onClick={() => window.location.href = '/comingsoon'}
            style={{
              color: 'var(--header-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
            }}
            aria-label="Account"
            title="Account"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <LogIn size={24} />
          </button>
          
          {/* Theme Toggle */}
          <button 
            onClick={handleThemeToggle}
            style={{
              color: 'var(--header-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
            }}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>

      {/* ENHANCED SIDEBAR */}
      <EnhancedSidebar 
        isVisible={sidebarVisible}
        onClose={handleSidebarClose}
        onNewChat={handleNewChat}
      />

      {/* 🎯 SMART ROUTING MONITORING DASHBOARD */}
      <ModelUsageDashboard />

      {/* MAIN CHAT AREA */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        padding: '1rem',
        paddingTop: '90px', // Account for fixed header
        paddingBottom: '220px', // Account for unified footer height
        transition: 'background-color 0.3s',
        marginTop: 0,
      }}>
        {showWelcome && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '875px',
            margin: '1rem auto 2rem',
            transition: 'opacity 0.3s',
          }}>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img 
                src={theme === 'dark' ? '/images/logo-light.svg' : '/images/logo-dark.svg'}
                alt="GriotBot Logo" 
                style={{
                  height: '80px',
                  width: 'auto',
                }}
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span style={{ 
                display: 'none',
                fontSize: '4rem',
              }}>🌿</span>
            </div>
            
            <h1 style={{ 
              fontFamily: 'Lora, serif',
              fontSize: '2rem',
              margin: '0.5rem 0',
            }}>Welcome to GriotBot</h1>
            <p style={{ 
              fontFamily: 'Montserrat, sans-serif',
              color: 'var(--text-color)',
              opacity: 0.8,
              marginBottom: '1.5rem',
            }}>Your AI companion for culturally rich conversations and wisdom</p>
            
            <div style={{
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: 'var(--wisdom-color)',
              textAlign: 'center',
              fontFamily: 'Lora, serif',
              lineHeight: 1.7,
              marginBottom: '2rem',
              position: 'relative',
              padding: '0 1.5rem',
            }}>
              "A people without the knowledge of their past history,<br/>
              origin and culture is like a tree without roots."
              <span style={{
                fontWeight: 500,
                display: 'block',
                marginTop: '0.5rem',
              }}>— Marcus Mosiah Garvey</span>
            </div>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              width: '100%',
              maxWidth: '875px',
            }}>
              <div 
                className="suggestion-card" 
                data-prompt="Tell me a story about resilience from the African diaspora"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  padding: '1rem',
                  borderRadius: '12px',
                  width: 'calc(50% - 0.5rem)',
                  minWidth: '200px',
                  boxShadow: '0 3px 10px var(--shadow-color)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent-color)',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}>Storytelling</div>
                <h3 style={{
                  fontFamily: 'Lora, serif',
                  fontWeight: 600,
                  margin: 0,
                }}>Tell me a diaspora story about resilience</h3>
              </div>
              
              <div 
                className="suggestion-card" 
                data-prompt="Share some wisdom about community building from African traditions"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  padding: '1rem',
                  borderRadius: '12px',
                  width: 'calc(50% - 0.5rem)',
                  minWidth: '200px',
                  boxShadow: '0 3px 10px var(--shadow-color)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent-color)',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}>Wisdom</div>
                <h3 style={{
                  fontFamily: 'Lora, serif',
                  fontWeight: 600,
                  margin: 0,
                }}>African wisdom on community building</h3>
              </div>
              
              <div 
                className="suggestion-card" 
                data-prompt="How can I connect more with my cultural heritage?"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  padding: '1rem',
                  borderRadius: '12px',
                  width: 'calc(50% - 0.5rem)',
                  minWidth: '200px',
                  boxShadow: '0 3px 10px var(--shadow-color)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent-color)',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}>Personal Growth</div>
                <h3 style={{
                  fontFamily: 'Lora, serif',
                  fontWeight: 600,
                  margin: 0,
                }}>Connect with my cultural heritage</h3>
              </div>
              
              <div 
                className="suggestion-card" 
                data-prompt="Explain the historical significance of Juneteenth"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  padding: '1rem',
                  borderRadius: '12px',
                  width: 'calc(50% - 0.5rem)',
                  minWidth: '200px',
                  boxShadow: '0 3px 10px var(--shadow-color)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  color: 'var(--accent-color)',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}>History</div>
                <h3 style={{
                  fontFamily: 'Lora, serif',
                  fontWeight: 600,
                  margin: 0,
                }}>The historical significance of Juneteenth</h3>
              </div>
            </div>
          </div>
        )}
        
        <div style={{
          width: '100%',
          maxWidth: '875px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflowY: 'auto',
          height: 'calc(100vh - 350px)', // Account for fixed header and input area
          scrollBehavior: 'smooth',
        }}>
          {messages.map((message, index) => renderMessage(message, index))}
          
          {isLoading && (
            <div style={{
              padding: '1rem 1.2rem',
              margin: '0.5rem 0',
              borderRadius: '12px',
              maxWidth: '80%',
              alignSelf: 'flex-start',
              background: 'linear-gradient(135deg, var(--bot-bubble-start), var(--bot-bubble-end))',
              color: 'var(--bot-text)',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.8,
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
              }}>
                <span style={{
                  height: '8px',
                  width: '8px',
                  margin: '0 2px',
                  backgroundColor: 'var(--bot-text)',
                  borderRadius: '50%',
                  display: 'inline-block',
                  opacity: 0.7,
                  animation: 'typing-bounce 1.4s infinite ease-in-out both',
                }}></span>
                <span style={{
                  height: '8px',
                  width: '8px',
                  margin: '0 2px',
                  backgroundColor: 'var(--bot-text)',
                  borderRadius: '50%',
                  display: 'inline-block',
                  opacity: 0.7,
                  animation: 'typing-bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.2s',
                }}></span>
                <span style={{
                  height: '8px',
                  width: '8px',
                  margin: '0 2px',
                  backgroundColor: 'var(--bot-text)',
                  borderRadius: '50%',
                  display: 'inline-block',
                  opacity: 0.7,
                  animation: 'typing-bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.4s',
                }}></span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* UNIFIED FOOTER: INPUT + PROVERB + COPYRIGHT */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        background: 'var(--bg-color)',
        borderTop: '1px solid var(--input-border)',
        transition: 'background-color 0.3s',
        zIndex: 100,
        boxShadow: '0 -4px 20px var(--shadow-color)',
        padding: 0,
      }}>
        {/* INPUT AREA */}
        <div style={{
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '875px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const message = formData.get('message');
                if (message && message.trim()) {
                  handleSendMessage(message, storytellerMode);
                  e.target.reset();
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{
                position: 'relative',
                display: 'flex',
                boxShadow: '0 4px 12px var(--shadow-color)',
                borderRadius: '12px',
                backgroundColor: 'var(--input-bg)',
              }}>
                <textarea 
                  name="message"
                  placeholder="Ask GriotBot about Black history, culture, or personal advice..." 
                  required 
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '0.9rem 1rem',
                    border: '1px solid var(--input-border)',
                    borderRight: 'none',
                    borderRadius: '12px 0 0 12px',
                    outline: 'none',
                    resize: 'none',
                    minHeight: '55px',
                    maxHeight: '120px',
                    transition: 'border 0.3s, box-shadow 0.3s, background-color 0.3s',
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '1rem',
                    lineHeight: 1.5,
                  }}
                  rows="1"
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '55px',
                    background: 'var(--accent-color)',
                    color: 'white',
                    borderRadius: '0 12px 12px 0',
                    transition: 'background-color 0.3s, transform 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    // NEW: Use ArrowUpCircle icon instead of text arrow
                    <ArrowUpCircle size={24} />
                  )}
                </button>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem',
                fontSize: '0.8rem',
              }}>
                <div style={{
                  color: 'var(--text-color)',
                  opacity: 0.7,
                }}>
                  Free users: 30 messages per day
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                    Storyteller Mode
                    <div style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '36px',
                      height: '20px',
                      marginLeft: '0.5rem',
                    }}>
                      <input 
                        type="checkbox" 
                        checked={storytellerMode}
                        onChange={(e) => handleStorytellerModeChange(e.target.checked)}
                        style={{
                          opacity: 0,
                          width: 0,
                          height: 0,
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: storytellerMode ? 'var(--accent-color)' : 'rgba(0,0,0,0.25)',
                        transition: '.3s',
                        borderRadius: '20px',
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '16px',
                          width: '16px',
                          left: storytellerMode ? '18px' : '2px',
                          bottom: '2px',
                          backgroundColor: 'white',
                          transition: '.3s',
                          borderRadius: '50%',
                        }}></span>
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* PROVERB */}
        <div 
          id="fact" 
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            padding: '0.8rem 1rem 0.5rem 1rem',
            color: 'var(--wisdom-color)',
            transition: 'color 0.3s',
            opacity: 0.9,
            fontFamily: 'Lora, serif',
          }}
          aria-label="Random proverb"
        >
          Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb
        </div>
        
        {/* COPYRIGHT */}
        <div style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-color)',
          opacity: 0.7,
          transition: 'color 0.3s',
          padding: '0 1rem 0.8rem 1rem',
        }}>
          © 2025 GriotBot. All rights reserved.
        </div>
      </div>
    </>
  );
}
