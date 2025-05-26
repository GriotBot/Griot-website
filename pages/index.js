// File: /pages/index.js - UPDATED WITH CENTERED LOGO
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import EnhancedSidebar from '../components/EnhancedSidebar';
import { 
  Menu, 
  MessageCirclePlus, 
  LogIn, 
  Sun, 
  Moon,
  ArrowUpCircle,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from 'react-feather';

// PROVERBS ARRAY
const PROVERBS = [
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

export default function Home() {
  // State management
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentProverb, setCurrentProverb] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [message, setMessage] = useState('');
  const [storyMode, setStoryMode] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadPreferences();
    showRandomProverb();
    loadChatHistory();
  }, []);

  // Load user preferences
  function loadPreferences() {
    try {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      const savedStoryMode = localStorage.getItem('griotbot-storyteller') === 'true';
      setTheme(savedTheme);
      setStoryMode(savedStoryMode);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  }

  // Random proverb using React state
  const showRandomProverb = () => {
    const randomIndex = Math.floor(Math.random() * PROVERBS.length);
    setCurrentProverb(PROVERBS[randomIndex]);
  };

  // Load chat history
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

  // Save chat history
  function saveChatHistory(msgs) {
    try {
      const historyToSave = msgs.slice(-50); // Keep only last 50 messages
      localStorage.setItem('griotbot-history', JSON.stringify(historyToSave));
    } catch (err) {
      console.error('Error saving chat history:', err);
    }
  }

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

  // Handle new chat
  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem('griotbot-history');
    setSidebarVisible(false);
  };

  // Handle storyteller mode toggle
  const handleStoryModeToggle = () => {
    const newMode = !storyMode;
    setStoryMode(newMode);
    localStorage.setItem('griotbot-storyteller', newMode.toString());
  };

  // Handle suggestion click
  const handleSuggestionClick = (prompt) => {
    setMessage(prompt);
    // Auto-submit the suggestion
    handleSendMessage(prompt);
  };

  // Handle send message with streaming support
  const handleSendMessage = async (messageText = message, storytellerMode = storyMode) => {
    if (!messageText.trim()) return;

    setIsLoading(true);
    setShowWelcome(false);

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setMessage('');

    // Create initial bot message for streaming
    const botMessageId = Date.now() + 1;
    const initialBotMessage = {
      id: botMessageId,
      role: 'bot',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    };

    setMessages([...newMessages, initialBotMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText,
          storytellerMode: storytellerMode
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is streaming or JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response (fallback)
        const data = await response.json();
        const botResponse = data.choices?.[0]?.message?.content || 
                          data.choices?.[0]?.text?.trim() || 
                          'I apologize, but I seem to be having trouble processing your request.';

        const finalBotMessage = {
          id: botMessageId,
          role: 'bot',
          content: botResponse,
          timestamp: new Date().toISOString(),
          isStreaming: false
        };

        const finalMessages = [...newMessages, finalBotMessage];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      } else {
        // Handle streaming response
        const reader = response.body.getReader();
        let accumulatedContent = '';

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || 
                              parsed.choices?.[0]?.text || '';
                
                if (content) {
                  accumulatedContent += content;
                  
                  // Update the bot message with accumulated content
                  setMessages(prevMessages => 
                    prevMessages.map(msg => 
                      msg.id === botMessageId 
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }

        // Finalize the streaming message
        const finalMessages = newMessages.concat([{
          id: botMessageId,
          role: 'bot',
          content: accumulatedContent || 'I apologize, but I seem to be having trouble processing your request.',
          timestamp: new Date().toISOString(),
          isStreaming: false
        }]);

        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: botMessageId,
        role: 'bot',
        content: `I'm sorry, I encountered an error: ${error.message}. Please try again later.`,
        timestamp: new Date().toISOString(),
        isStreaming: false
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
      
      // Auto-scroll to bottom with delay
      setTimeout(() => {
        const chatContainer = document.querySelector('#chat-container');
        if (chatContainer) {
          chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon setup */}
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
            transition: background-color 0.3s, color 0.3s;
            line-height: 1.6;
          }

          @keyframes message-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .message {
            animation: message-fade-in 0.3s ease-out forwards;
          }

          .blinking-cursor::after {
            content: '|';
            animation: blink 1s infinite;
          }

          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}} />
      </Head>
      
      {/* HEADER */}
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
            transform: sidebarVisible ? 'rotate(90deg)' : 'rotate(0deg)',
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
        
        {/* CENTER - Logo (Absolutely centered on screen) */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {!logoError ? (
            <img 
              src="/images/GriotBot logo horiz wht.svg" 
              alt="GriotBot" 
              style={{
                height: '40px',
                width: 'auto',
              }}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}>
              🌿 GriotBot
            </div>
          )}
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
        currentPage="/"
      />

      {/* MAIN CHAT AREA */}
      <main id="chat-container" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'auto',
        padding: '1rem',
        paddingTop: '90px',
        paddingBottom: '140px',
        transition: 'background-color 0.3s',
        marginTop: 0,
      }}>
        {showWelcome && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '1rem auto 2rem',
            transition: 'opacity 0.3s',
            width: '100%',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem', transition: 'opacity 0.3s' }}>
              {!logoError ? (
                <img 
                  src={theme === 'dark' ? "/images/logo-light.svg" : "/images/logo-dark.svg"}
                  alt="GriotBot Logo" 
                  style={{
                    height: '120px',
                    width: 'auto',
                  }}
                  onError={() => <div>🌿</div>}
                />
              ) : (
                <div>🌿</div>
              )}
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
              transition: 'opacity 0.3s, color 0.3s',
              position: 'relative',
              padding: '0 1.5rem',
              width: '100%',
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
              maxWidth: '700px',
            }}>
              <div 
                onClick={() => handleSuggestionClick("Tell me a story about resilience from the African diaspora")}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 15px var(--shadow-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 10px var(--shadow-color)';
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
                onClick={() => handleSuggestionClick("Share some wisdom about community building from African traditions")}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 15px var(--shadow-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 10px var(--shadow-color)';
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
                onClick={() => handleSuggestionClick("How can I connect more with my cultural heritage?")}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 15px var(--shadow-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 10px var(--shadow-color)';
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
                onClick={() => handleSuggestionClick("Explain the historical significance of Juneteenth")}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 15px var(--shadow-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 10px var(--shadow-color)';
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
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.role}`}
              style={{
                padding: '1rem 1.2rem',
                margin: '0.5rem 0',
                borderRadius: '12px',
                maxWidth: '80%',
                wordWrap: 'break-word',
                boxShadow: '0 3px 6px var(--shadow-color)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                lineHeight: 1.6,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? 'var(--user-bubble)' : undefined,
                background: msg.role === 'bot' ? 'linear-gradient(135deg, var(--bot-bubble-start), var(--bot-bubble-end))' : undefined,
                color: msg.role === 'user' ? 'var(--user-text)' : 'var(--bot-text)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 10px var(--shadow-color)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 3px 6px var(--shadow-color)';
              }}
            >
              {msg.role === 'bot' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.8rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  {!logoError ? (
                    <img 
                      src="/images/GriotBot logo horiz wht.svg" 
                      alt="GriotBot" 
                      style={{
                        height: '20px',
                        width: 'auto',
                      }}
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <span style={{ fontSize: '1rem' }}>🌿 GriotBot</span>
                  )}
                </div>
              )}
              
              <div className={msg.isStreaming ? 'blinking-cursor' : ''}>
                {msg.content}
              </div>
              
              {msg.role === 'bot' && !msg.isStreaming && (
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.8rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s',
                    }}
                    title="Copy message"
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s',
                    }}
                    title="Good response"
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s',
                    }}
                    title="Poor response"
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <ThumbsDown size={14} />
                  </button>
                  <button
                    onClick={() => handleSendMessage(messages[messages.findIndex(m => m.id === msg.id) - 1]?.content || '')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s',
                    }}
                    title="Regenerate response"
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* MESSAGE INPUT FORM */}
      <div style={{
        position: 'fixed',
        bottom: 50,
        left: 0,
        width: '100%',
        background: 'var(--bg-color)',
        padding: '1rem',
        borderTop: '1px solid var(--input-border)',
        transition: 'background-color 0.3s',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
      }}>
        <form onSubmit={handleSubmit} style={{
          width: '100%',
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            boxShadow: '0 4px 12px var(--shadow-color)',
            borderRadius: '12px',
            backgroundColor: 'var(--input-bg)',
          }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask GriotBot about Black history, culture, or personal advice..."
              required
              rows="1"
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
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
                cursor: isLoading || !message.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !message.trim() ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && message.trim()) {
                  e.target.style.background = 'var(--accent-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && message.trim()) {
                  e.target.style.background = 'var(--accent-color)';
                }
              }}
            >
              <ArrowUpCircle size={24} />
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
                    checked={storyMode}
                    onChange={handleStoryModeToggle}
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
                    backgroundColor: storyMode ? 'var(--accent-color)' : 'rgba(0,0,0,0.25)',
                    transition: '.3s',
                    borderRadius: '20px',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '16px',
                      width: '16px',
                      left: storyMode ? '18px' : '2px',
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

      {/* FOOTER - PROVERB & COPYRIGHT */}
      <div 
        style={{
          position: 'fixed',
          bottom: '30px',
          width: '100%',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          padding: '0 1rem',
          color: 'var(--wisdom-color)',
          transition: 'color 0.3s',
          opacity: 0.8,
          fontFamily: 'Lora, serif',
          zIndex: 40,
        }}
        aria-label={`Proverb: ${currentProverb}`}
      >
        {currentProverb}
      </div>
      
      <div style={{
        position: 'fixed',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-color)',
        opacity: 0.6,
        transition: 'color 0.3s',
        zIndex: 40,
      }}>
        © 2025 GriotBot. All rights reserved.
      </div>
    </>
  );
}
