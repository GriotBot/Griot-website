// File: /pages/index.js
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Import components that can safely render on server
import FooterProverb from '../components/FooterProverb';
import FooterCopyright from '../components/FooterCopyright';

// Dynamically import components with client-side only rendering
const Layout = dynamic(() => import('../components/layout/Layout'), { ssr: false });
const ChatInput = dynamic(() => import('../components/ChatInput'), { ssr: false });

// This ensures the page is rendered on the server without client-side code
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default function Home() {
  // State to ensure we can access DOM elements after mounting
  const [isInitialLoad, setIsInitialLoad] = useState(true);
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
    // Mark as client-side after mount and not initial load anymore
    setIsClient(true);
    setIsInitialLoad(false);

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

  // Rest of your code remains the same...
  // [Include all the existing functions and code from your current index.js]

  // Conditional rendering to ensure we only render client-side content when on the client
  if (!isClient) {
    // Simple server-side rendering placeholder
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1>GriotBot</h1>
        <p>Loading your digital griot experience...</p>
      </div>
    );
  }

  // Then continue with your actual rendering logic
  return (
    // Your existing return code...
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
          {/* Your existing code for welcome screen and messages */}
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
