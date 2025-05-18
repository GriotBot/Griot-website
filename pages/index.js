// File: /pages/index.js - Updated with expanded response area and streamlined UI
import { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ChatInput from '../components/ChatInput';
import FooterProverb from '../components/FooterProverb';
import FooterCopyright from '../components/FooterCopyright';

export default function Home() {
  // State to ensure we can access DOM elements after mounting
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // State for thinking phrases rotation
  const [thinkingPhraseIndex, setThinkingPhraseIndex] = useState(0);
  const thinkingPhrases = [
    "Seeking ancestral wisdom...",
    "Consulting the elders...",
    "Weaving a response...",
    "Gathering knowledge...",
    "Remembering the traditions..."
  ];
  
  // State for UI controls
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  
  // Create a reference to the chat container
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Load chat history from localStorage
    loadChatHistory();

    // Handle suggestion cards and category tabs
    const handleClickableElements = () => {
      // Handle traditional suggestion cards
      const suggestionCards = document.querySelectorAll('.suggestion-card');
      if (suggestionCards) {
        suggestionCards.forEach(card => {
          card.addEventListener('click', () => {
            const prompt = card.getAttribute('data-prompt');
            if (prompt) {
              handleSendMessage(prompt, false);
            }
          });
        });
      }
      
      // Handle new category tabs
      const categoryTabs = document.querySelectorAll('.category-tab');
      if (categoryTabs) {
        categoryTabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const prompt = tab.getAttribute('data-prompt');
            if (prompt) {
              handleSendMessage(prompt, false);
            }
          });
        });
      }
    };

    // Initialize clickable elements
    if (typeof window !== 'undefined') {
      handleClickableElements();
    }
  }, []);

  // Add effect to scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add effect to rotate thinking phrases when a message is in thinking state
  useEffect(() => {
    if (messages.some(m => m.thinking)) {
      const interval = setInterval(() => {
        setThinkingPhraseIndex(prev => (prev + 1) % thinkingPhrases.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [messages, thinkingPhrases.length]);

  // Smooth scroll to bottom function
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      // Smooth scroll to bottom
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    
    // Alternative approach using scrollIntoView for the end element
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to copy message content to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show a temporary "Copied!" message
        setCopiedMessageId(text.substring(0, 20)); // Use part of the text as an ID
        setTimeout(() => setCopiedMessageId(null), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  // Function to handle user feedback on responses
  const handleFeedback = (messageId, isPositive) => {
    console.log(`Feedback for message ${messageId}: ${isPositive ? 'positive' : 'negative'}`);
    // Here you would typically send this feedback to your server
    setFeedbackGiven(prevState => ({
      ...prevState,
      [messageId]: isPositive ? 'positive' : 'negative'
    }));
  };

  // Improved regenerateResponse function
  const regenerateResponse = async (promptText) => {
    if (!promptText) {
      console.error('Cannot regenerate: no prompt text provided');
      return;
    }

    // Find the most recent user message with this prompt and the bot response that follows it
    let userMessageIndex = -1;
    let botResponseIndex = -1;
    
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user' && messages[i].content === promptText) {
        userMessageIndex = i;
        // Check if there's a bot response after this user message
        if (i + 1 < messages.length && messages[i + 1].role === 'bot') {
          botResponseIndex = i + 1;
        }
        break;
      }
    }

    if (userMessageIndex === -1) {
      console.error('Cannot regenerate: original user message not found');
      return;
    }

    // Create a new array of messages, removing the bot response if it exists
    let updatedMessages;
    if (botResponseIndex !== -1) {
      updatedMessages = [
        ...messages.slice(0, botResponseIndex),
        {
          role: 'bot',
          content: '...',
          time: new Date().toISOString(),
          thinking: true
        }
      ];
    } else {
      // If no bot response was found, add a thinking indicator after the user message
      updatedMessages = [
        ...messages,
        {
          role: 'bot',
          content: '...',
          time: new Date().toISOString(),
          thinking: true
        }
      ];
    }
    
    // Update the UI with the thinking indicator
    setMessages(updatedMessages);
    
    // Reset any feedback that might have been given
    setFeedbackGiven(prevState => {
      const newState = {...prevState};
      if (botResponseIndex !== -1) {
        delete newState[botResponseIndex];
      }
      return newState;
    });
    
    try {
      console.log('Regenerating response for prompt:', promptText);
      
      // Make the API call to regenerate the response
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: promptText,
          storytellerMode: false,
          isRegeneration: true  // Flag to indicate this is a regeneration
        })
      });
      
      if (!res.ok) {
        let errorMessage = `Error: Status ${res.status}`;
        
        try {
          const errorData = await res.json();
          if (errorData && errorData.error) {
            errorMessage = typeof errorData.error === 'string' 
              ? errorData.error 
              : JSON.stringify(errorData.error);
          }
        } catch (parseError) {
          // If JSON parsing fails, try to get the text response
          const errorText = await res.text().catch(() => 'Unknown error');
          errorMessage = `Error: ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      // Process the successful response
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                        'I apologize, but I seem to be having trouble generating a new response.';
      
      // Replace the thinking indicator with the new response
      const finalMessages = updatedMessages.slice(0, -1).concat({
        role: 'bot',
        content: botResponse,
        time: new Date().toISOString()
      });
      
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
      
    } catch (error) {
      console.error('Error regenerating response:', error);
      
      // Replace thinking indicator with error message
      const finalMessages = updatedMessages.slice(0, -1).concat({
        role: 'bot',
        content: `I'm sorry, I encountered an error while trying to generate a new response: ${error.message}. Please try again later.`,
        time: new Date().toISOString()
      });
      
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    }
  };

  // Load chat history from localStorage
  function loadChatHistory() {
    try {
      const hist = JSON.parse(localStorage.getItem('griotbot-history') || '[]');
      if (hist.length > 0) {
        setMessages(hist);
        setShowWelcome(false);
      } else {
        setShowWelcome(true);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      localStorage.removeItem('griotbot-history');
    }
  }

  // Save chat history to localStorage
  function saveChatHistory(msgs) {
    const HISTORY_LIMIT = 50; // Maximum number of messages to store
    localStorage.setItem('griotbot-history', JSON.stringify(msgs.slice(-HISTORY_LIMIT)));
  }

  // Function that initializes remaining chat functionality
  function initializeChat() {
    // Get DOM elements for things not yet converted to React components
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const factElement = document.getElementById('fact');

    // 5. RANDOM PROVERB
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
      if (factElement) {
        const randomIndex = Math.floor(Math.random() * proverbs.length);
        factElement.textContent = proverbs[randomIndex];
        factElement.setAttribute('aria-label', `Proverb: ${proverbs[randomIndex]}`);
      }
    }
    
    showRandomProverb(); // Show proverb on init

    // 10. SUGGESTION CARDS & CATEGORY TABS HANDLER
    if (suggestionCards) {
      suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
          const prompt = card.getAttribute('data-prompt');
          if (prompt) {
            handleSendMessage(prompt, false);
          }
        });
      });
    }
    
    if (categoryTabs) {
      categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const prompt = tab.getAttribute('data-prompt');
          if (prompt) {
            handleSendMessage(prompt, false);
          }
        });
      });
    }
  }

  // Handle sending a message
  async function handleSendMessage(text, storytellerMode) {
    // Hide welcome screen
    setShowWelcome(false);
    
    // Add user message to state
    const userMessage = {
      role: 'user',
      content: text,
      time: new Date().toISOString()
    };
    
    // Add thinking indicator
    const thinkingMessage = {
      role: 'bot',
      content: '...',
      time: new Date().toISOString(),
      thinking: true
    };
    
    const updatedMessages = [...messages, userMessage, thinkingMessage];
    setMessages(updatedMessages);
    
    try {
      console.log('Sending message to API:', { 
        prompt: text, 
        promptLength: text.length,
        storytellerMode
      });
      
      // API call to our serverless function
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: text,
          storytellerMode: storytellerMode || false
        })
      });
      
      if (!res.ok) {
        let errorMessage = `Error: Status ${res.status}`;
        try {
          const errorData = await res.json();
          if (errorData && errorData.error) {
            // Extract the error message string
            errorMessage = typeof errorData.error === 'string' 
              ? errorData.error 
              : JSON.stringify(errorData.error);
          }
          console.error('API error details:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
          // Try to get the text response if JSON parsing fails
          const errorText = await res.text().catch(() => 'Unknown error');
          errorMessage = `Error: ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || 
                         'I apologize, but I seem to be having trouble processing your request.';
      
      // Replace thinking with actual response
      const finalMessages = updatedMessages.slice(0, -1).concat({
        role: 'bot',
        content: botResponse,
        time: new Date().toISOString()
      });
      
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (err) {
      console.error('API error:', err);
      
      // Replace thinking with error message
      const finalMessages = updatedMessages.slice(0, -1).concat({
        role: 'bot',
        content: `I'm sorry, I encountered an error: ${err.message}. Please try again later.`,
        time: new Date().toISOString()
      });
      
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    }
  }

  // Handle starting a new chat
  function handleNewChat() {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem('griotbot-history');
  }

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        
        {/* Add animations for thinking indicator */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes typingBounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          
          @keyframes pulse {
            0% { opacity: 0.6; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.6; transform: scale(0.95); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}} />
      </Head>

      <Layout>
        {/* MAIN CHAT AREA - now with ref for scrolling */}
        <main 
          id="chat-container" 
          ref={chatContainerRef}
          aria-label="Chat messages" 
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflowY: 'auto',
            padding: '1rem',
            paddingBottom: '140px',
            scrollBehavior: 'smooth',
            scrollPaddingBottom: '140px',
            transition: 'background-color 0.3s',
            height: 'calc(100vh - 160px)',
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-color)',
          }}
        >
          {showWelcome ? (
            <div className="welcome-container" id="welcome" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '100%',
              margin: '1rem auto 2rem',
              width: '100%',
              padding: '0 1rem',
            }}>
              {/* Welcome Header */}
              <h1 style={{
                color: '#c49a6c',
                fontSize: '2.5rem',
                fontFamily: 'Lora, serif',
                margin: '2rem 0 0.5rem',
                fontWeight: 'normal',
                textAlign: 'center',
                width: '100%',
              }}>
                Welcome to GriotBot
              </h1>
              
              {/* Subtitle */}
              <p style={{
                color: 'var(--text-color)',
                fontSize: '1.1rem',
                opacity: 0.85,
                marginBottom: '2rem',
                textAlign: 'center',
                maxWidth: '600px',
              }}>
                Your AI companion for culturally rich conversations and wisdom
              </p>
              
              {/* Marcus Garvey Quote */}
              <div style={{
                fontStyle: 'italic',
                color: '#6b4226',
                margin: '1rem 0 3rem',
                maxWidth: '800px',
                textAlign: 'center',
                fontSize: '1.2rem',
                lineHeight: 1.5,
              }}>
                "A people without the knowledge of their past history,<br/>
                origin and culture is like a tree without roots."
                <div style={{
                  marginTop: '0.75rem',
                  fontStyle: 'normal',
                  fontSize: '1rem',
                }}>
                  — Marcus Mosiah Garvey
                </div>
              </div>
              
              {/* Tabs/Category Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto 2rem',
              }}>
                <div 
                  className="category-tab" 
                  data-prompt="Tell me a story about resilience from the African diaspora"
                  style={{
                    backgroundColor: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#d7722c',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    fontSize: '1rem',
                    minWidth: '180px',
                  }}
                >
                  STORYTELLING
                </div>
                
                <div 
                  className="category-tab" 
                  data-prompt="Share some wisdom about community building from African traditions"
                  style={{
                    backgroundColor: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#d7722c',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    fontSize: '1rem',
                    minWidth: '180px',
                  }}
                >
                  WISDOM
                </div>
                
                <div 
                  className="category-tab" 
                  data-prompt="Explain the historical significance of Juneteenth"
                  style={{
                    backgroundColor: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#d7722c',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    fontSize: '1rem',
                    minWidth: '180px',
                  }}
                >
                  HISTORY
                </div>
              </div>
              
              {/* Hidden legacy suggestion cards for compatibility */}
              <div className="suggestion-cards" style={{ display: 'none' }}>
                <div className="suggestion-card" data-prompt="Tell me a story about resilience from the African diaspora">
                  <div className="suggestion-category">Storytelling</div>
                  <h3 className="suggestion-title">Tell me a diaspora story about resilience</h3>
                </div>
                
                <div className="suggestion-card" data-prompt="Share some wisdom about community building from African traditions">
                  <div className="suggestion-category">Wisdom</div>
                  <h3 className="suggestion-title">African wisdom on community building</h3>
                </div>
                
                <div className="suggestion-card" data-prompt="How can I connect more with my cultural heritage?">
                  <div className="suggestion-category">Personal Growth</div>
                  <h3 className="suggestion-title">Connect with my cultural heritage</h3>
                </div>
                
                <div className="suggestion-card" data-prompt="Explain the historical significance of Juneteenth">
                  <div className="suggestion-category">History</div>
                  <h3 className="suggestion-title">The historical significance of Juneteenth</h3>
                </div>
              </div>
            </div>
          ) : (
            <div id="chat" aria-live="polite" style={{ 
              width: '100%', 
              maxWidth: '700px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.role} ${message.thinking ? 'thinking' : ''}`}
                  style={{
                    padding: '1rem 1.2rem',
                    margin: '0.5rem 0',
                    borderRadius: '12px',
                    maxWidth: message.role === 'user' ? '50%' : '85%', // Increased bot message width to 85%
                    width: message.role === 'bot' ? '85%' : 'fit-content', // Fixed width for bot messages
                    wordWrap: 'break-word',
                    boxShadow: '0 3px 6px var(--shadow-color)',
                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: message.role === 'user' 
                      ? 'var(--user-bubble)' 
                      : 'var(--bot-bubble-start)',
                    color: message.role === 'user' 
                      ? 'var(--user-text)' 
                      : 'var(--bot-text)',
                    display: 'block',
                    marginLeft: message.role === 'user' ? 'auto' : '0',
                    marginRight: message.role === 'bot' ? 'auto' : '0',
                  }}
                >
                  {message.thinking ? (
                    // Enhanced thinking indicator with cultural relevance
                    <div className="thinking-state" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem 0.5rem',
                      gap: '0.75rem',
                      width: '100%'
                    }}>
                      <div className="bot-header" style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.8rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100%'
                      }}>
                        <img 
                          src="/images/logo-light.svg" 
                          alt="GriotBot Logo" 
                          style={{ 
                            height: '20px',
                            width: 'auto',
                            animation: 'pulse 2s infinite ease-in-out'
                          }} 
                          aria-hidden="true"
                        />
                        {/* Removed the GriotBot text */}
                      </div>
                      
                      <div style={{
                        fontStyle: 'italic',
                        marginBottom: '0.5rem',
                        color: 'rgba(255,255,255,0.9)',
                        animation: 'fadeIn 0.5s ease-in'
                      }}>
                        {thinkingPhrases[thinkingPhraseIndex]}
                      </div>
                      
                      <div className="typing-animation" style={{
                        display: 'flex',
                        gap: '0.4rem',
                        justifyContent: 'center'
                      }}>
                        {[0, 1, 2].map((i) => (
                          <span key={i} style={{
                            height: '8px',
                            width: '8px',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'typingBounce 1.4s infinite ease-in-out both',
                            animationDelay: `${i * 0.2}s`
                          }}></span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.role === 'bot' && (
                        <>
                          <div className="bot-header" style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '0.8rem',
                            paddingBottom: '0.5rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                          }}>
                            {/* Logo image only - no text */}
                            <img 
                              src="/images/logo-light.svg" 
                              alt="GriotBot" 
                              style={{ 
                                height: '20px',
                                width: 'auto'
                              }} 
                              aria-hidden="true"
                            />
                          </div>
                          
                          <div>{message.content}</div>
                          
                          {/* Action buttons row with modern SVG icons */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '0.8rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            paddingTop: '0.5rem',
                          }}>
                            <div className="message-time" style={{
                              fontSize: '0.7rem',
                              opacity: 0.7,
                            }}>
                              {new Date(message.time).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                            
                            <div style={{
                              display: 'flex',
                              gap: '0.75rem',
                            }}>
                              {/* Copy button with SVG icon */}
                              <button 
                                onClick={() => copyToClipboard(message.content)} 
                                aria-label="Copy response"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  opacity: 0.8,
                                  transition: 'all 0.2s',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                onMouseOut={(e) => e.currentTarget.style.opacity = 0.8}
                              >
                                {copiedMessageId === message.content.substring(0, 20) ? (
                                  // Checkmark SVG for "copied" state
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                ) : (
                                  // Copy SVG icon
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                )}
                              </button>
                              
                              {/* Thumbs up button with SVG icon */}
                              <button 
                                onClick={() => handleFeedback(index, true)} 
                                aria-label="Helpful response"
                                disabled={feedbackGiven[index]}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: feedbackGiven[index] === 'positive' ? 'rgba(121, 214, 152, 1)' : 'rgba(255, 255, 255, 0.7)',
                                  display: '
                                    display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '4px',
                                  cursor: feedbackGiven[index] ? 'default' : 'pointer',
                                  opacity: feedbackGiven[index] ? 1 : 0.8,
                                  transition: 'all 0.2s',
                                }}
                                onMouseOver={(e) => {
                                  if (!feedbackGiven[index]) e.currentTarget.style.opacity = 1;
                                }}
                                onMouseOut={(e) => {
                                  if (!feedbackGiven[index]) e.currentTarget.style.opacity = 0.8;
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                </svg>
                              </button>
                              
                              {/* Thumbs down button with SVG icon */}
                              <button 
                                onClick={() => handleFeedback(index, false)} 
                                aria-label="Unhelpful response"
                                disabled={feedbackGiven[index]}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: feedbackGiven[index] === 'negative' ? 'rgba(239, 83, 80, 1)' : 'rgba(255, 255, 255, 0.7)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '4px',
                                  cursor: feedbackGiven[index] ? 'default' : 'pointer',
                                  opacity: feedbackGiven[index] ? 1 : 0.8,
                                  transition: 'all 0.2s',
                                }}
                                onMouseOver={(e) => {
                                  if (!feedbackGiven[index]) e.currentTarget.style.opacity = 1;
                                }}
                                onMouseOut={(e) => {
                                  if (!feedbackGiven[index]) e.currentTarget.style.opacity = 0.8;
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm10-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
                                </svg>
                              </button>
                              
                              {/* Regenerate button with SVG icon */}
                              <button 
                                onClick={() => {
                                  // Find the user message that prompted this response
                                  const userMessageIndex = index - 1;
                                  if (userMessageIndex >= 0 && messages[userMessageIndex].role === 'user') {
                                    regenerateResponse(messages[userMessageIndex].content);
                                  }
                                }} 
                                aria-label="Regenerate response"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  opacity: 0.8,
                                  transition: 'all 0.2s',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                onMouseOut={(e) => e.currentTarget.style.opacity = 0.8}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M23 4v6h-6"></path>
                                  <path d="M1 20v-6h6"></path>
                                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {message.role === 'user' && (
                        <div>{message.content}</div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {/* Invisible element to scroll to */}
              <div ref={chatEndRef} style={{ height: '1px', opacity: 0 }} />
            </div>
          )}
        </main>

        {/* Input component */}
        <ChatInput onSubmit={handleSendMessage} />

        {/* Direct footer components */}
        <FooterProverb />
        <FooterCopyright />
      </Layout>
    </>
  );
}
