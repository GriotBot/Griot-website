// File: pages/index.js - Updated with Enhanced Message Display
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import StandardLayout from '../components/layout/StandardLayout';
import EnhancedChatContainer from '../components/chat/EnhancedChatContainer';
import ChatFooter from '../components/layout/ChatFooter';

export default function Home() {
  // State management
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentProverb, setCurrentProverb] = useState('');

  // African proverbs for rotation
  const PROVERBS = [
    "Wisdom is like a baobab tree; no one individual can embrace it. — African Proverb",
    "Until the lion learns to write, every story will glorify the hunter. — African Proverb", 
    "We are the drums, we are the dance. — Afro-Caribbean Proverb",
    "A tree cannot stand without its roots. — Jamaican Proverb",
    "Unity is strength, division is weakness. — Swahili Proverb",
    "Knowledge is like a garden; if it is not cultivated, it cannot be harvested. — West African Proverb",
    "Truth is like a drum, it can be heard from afar. — Kenyan Proverb",
    "However long the night, the dawn will break. — African Proverb",
    "If you want to go fast, go alone. If you want to go far, go together. — African Proverb",
    "It takes a village to raise a child. — African Proverb"
  ];

  // Welcome screen suggestion cards
  const SUGGESTION_CARDS = [
    {
      category: "Storytelling",
      title: "Tell me a diaspora story about resilience",
      prompt: "Tell me a story about resilience from the African diaspora"
    },
    {
      category: "Wisdom", 
      title: "African wisdom on community building",
      prompt: "Share some wisdom about community building from African traditions"
    },
    {
      category: "Personal Growth",
      title: "Connect with my cultural heritage", 
      prompt: "How can I connect more with my cultural heritage?"
    },
    {
      category: "History",
      title: "The historical significance of Juneteenth",
      prompt: "Explain the historical significance of Juneteenth"
    }
  ];

  // Initialize component
  useEffect(() => {
    // Set random proverb
    const randomIndex = Math.floor(Math.random() * PROVERBS.length);
    setCurrentProverb(PROVERBS[randomIndex]);
    
    // Load chat history from localStorage
    loadChatHistory();
  }, []);

  // Load chat history from localStorage
  const loadChatHistory = useCallback(() => {
    try {
      const savedHistory = localStorage.getItem('griotbot-history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (parsedHistory.length > 0) {
          // Convert old format to new format if needed
          const formattedMessages = parsedHistory.map((msg, index) => ({
            id: msg.id || `msg-${Date.now()}-${index}`,
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
            timestamp: msg.timestamp || msg.time || new Date().toISOString()
          }));
          
          setMessages(formattedMessages);
          setShowWelcome(false);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      localStorage.removeItem('griotbot-history');
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = useCallback((messagesToSave) => {
    try {
      // Keep only the last 50 messages to prevent localStorage bloat
      const recentMessages = messagesToSave.slice(-50);
      localStorage.setItem('griotbot-history', JSON.stringify(recentMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, []);

  // Handle sending messages
  const handleSendMessage = async (messageText, storytellerMode = false) => {
    if (!messageText.trim() || isLoading) return;

    // Hide welcome screen
    setShowWelcome(false);
    setIsLoading(true);

    // Create user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message to state
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Create initial bot message (for streaming)
    const botMessageId = `bot-${Date.now()}`;
    const initialBotMessage = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    };

    setMessages(prev => [...prev, initialBotMessage]);

    try {
      // Make API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: messageText.trim(),
          storytellerMode: storytellerMode
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is streaming or JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('text/plain')) {
        // Handle streaming response
        const reader = response.body.getReader();
        let accumulatedContent = '';

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            accumulatedContent += chunk;

            // Update the streaming message
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === botMessageId 
                  ? { ...msg, content: accumulatedContent }
                  : msg
              )
            );
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        // Handle JSON response (fallback)
        const data = await response.json();
        const botResponse = data.choices?.[0]?.message?.content || 
                          data.choices?.[0]?.text || 
                          'I apologize, but I seem to be having trouble processing your request.';
        
        accumulatedContent = botResponse;
      }

      // Finalize the bot message
      const finalBotMessage = {
        id: botMessageId,
        role: 'assistant', 
        content: accumulatedContent,
        timestamp: new Date().toISOString(),
        isStreaming: false
      };

      const finalMessages = [...updatedMessages, finalBotMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, content: `I'm sorry, I encountered an error: ${error.message}. Please try again.`, isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion card clicks
  const handleSuggestionClick = (prompt) => {
    handleSendMessage(prompt);
  };

  // Handle new chat
  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    localStorage.removeItem('griotbot-history');
    
    // Set new random proverb
    const randomIndex = Math.floor(Math.random() * PROVERBS.length);
    setCurrentProverb(PROVERBS[randomIndex]);
  };

  // Handle message regeneration
  const handleRegenerateMessage = async (messageId) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    // Find the user message that prompted this response
    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.role !== 'user') return;

    // Remove the bot message and regenerate
    const messagesBeforeBot = messages.slice(0, messageIndex);
    setMessages(messagesBeforeBot);
    
    // Regenerate response
    await handleSendMessage(userMessage.content, false);
  };

  // Handle message feedback
  const handleMessageFeedback = (messageId, feedbackType) => {
    console.log(`Feedback for message ${messageId}: ${feedbackType}`);
    // In a real app, you'd send this to analytics or a feedback API
  };

  return (
    <>
      <Head>
        <title>GriotBot - Your Digital Griot</title>
        <meta name="description" content="GriotBot - An AI-powered digital griot providing culturally grounded wisdom and knowledge for the African diaspora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <StandardLayout
        showWelcome={showWelcome}
        currentProverb={currentProverb}
        onNewChat={handleNewChat}
      >
        <div className="main-content">
          {showWelcome && (
            <div className="welcome-container">
              <div className="logo-display">🌿</div>
              <h1 className="welcome-title">Welcome to GriotBot</h1>
              <p className="welcome-subtitle">
                Your AI companion for culturally rich conversations and wisdom
              </p>
              
              <div className="quote-container">
                "A people without the knowledge of their past history,<br/>
                origin and culture is like a tree without roots."
                <span className="quote-attribution">— Marcus Mosiah Garvey</span>
              </div>
              
              <div className="suggestion-cards">
                {SUGGESTION_CARDS.map((card, index) => (
                  <div 
                    key={index}
                    className="suggestion-card"
                    onClick={() => handleSuggestionClick(card.prompt)}
                  >
                    <div className="suggestion-category">{card.category}</div>
                    <h3 className="suggestion-title">{card.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          <EnhancedChatContainer
            messages={messages}
            isLoading={isLoading}
            onRegenerateMessage={handleRegenerateMessage}
            onMessageFeedback={handleMessageFeedback}
          />
        </div>

        <ChatFooter 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </StandardLayout>

      <style jsx>{`
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .welcome-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 700px;
          margin: 2rem auto;
          padding: 1rem;
        }

        .logo-display {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .welcome-title {
          font-family: var(--heading-font, 'Lora', serif);
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--text-color, #33302e);
          margin: 0 0 1rem 0;
        }

        .welcome-subtitle {
          font-size: 1.1rem;
          color: var(--text-color, #33302e);
          opacity: 0.8;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .quote-container {
          font-size: 1.2rem;
          font-style: italic;
          color: var(--wisdom-color, #6b4226);
          text-align: center;
          font-family: var(--quote-font, 'Lora', serif);
          line-height: 1.7;
          margin-bottom: 2.5rem;
          position: relative;
          padding: 0 2rem;
          max-width: 600px;
        }

        .quote-container::before,
        .quote-container::after {
          content: '"';
          font-size: 3rem;
          line-height: 0;
          position: absolute;
          color: var(--accent-color, #d7722c);
          opacity: 0.6;
        }

        .quote-container::before {
          left: 0;
          top: 1rem;
        }

        .quote-container::after {
          content: '"';
          right: 0;
          bottom: 0;
          transform: translateY(-50%);
        }

        .quote-attribution {
          display: block;
          font-weight: 500;
          margin-top: 1rem;
          font-size: 1rem;
        }

        .suggestion-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          width: 100%;
          max-width: 700px;
        }

        .suggestion-card {
          background: var(--card-bg, #ffffff);
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px var(--shadow-color, rgba(75, 46, 42, 0.15));
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid var(--input-border, rgba(75, 46, 42, 0.2));
        }

        .suggestion-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px var(--shadow-color, rgba(75, 46, 42, 0.2));
        }

        .suggestion-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent-color, #d7722c);
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .suggestion-title {
          font-family: var(--heading-font, 'Lora', serif);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color, #33302e);
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .welcome-container {
            margin: 1rem auto;
            padding: 0.75rem;
          }

          .welcome-title {
            font-size: 2rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .quote-container {
            font-size: 1.1rem;
            padding: 0 1.5rem;
          }

          .suggestion-cards {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .suggestion-card {
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .logo-display {
            font-size: 3rem;
          }

          .welcome-title {
            font-size: 1.75rem;
          }

          .quote-container {
            font-size: 1rem;
            padding: 0 1rem;
          }
        }
      `}</style>
    </>
  );
}
