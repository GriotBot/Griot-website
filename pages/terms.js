// File: /pages/terms.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Menu, Home, User, Sun, Moon, ArrowLeft } from 'react-feather';
import MessageCirclePlus from '../components/icons/MessageCirclePlus';

export default function Terms() {
  // State for theme toggle and sidebar
  const [theme, setTheme] = useState('light');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Apply theme from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('griotbot-theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('griotbot-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // New chat handler
  const handleNewChat = () => {
    window.location.href = '/';
  };

  // Logo error handler
  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <>
      <Head>
        <title>Terms and Conditions - GriotBot</title>
        <meta name="description" content="Terms and Conditions for GriotBot - An AI-powered digital griot" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* CSS Variables */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg-color: #f8f5f0;
            --text-color: #33302e;
            --header-bg: #c49a6c;
            --header-text: #33302e;
            --sidebar-bg: rgba(75, 46, 42, 0.97);
            --sidebar-text: #f8f5f0;
            --accent-color: #d7722c;
            --accent-hover: #c86520;
            --wisdom-color: #6b4226;
            --shadow-color: rgba(75, 46, 42, 0.15);
            --card-bg: #ffffff;
            --input-border: rgba(75, 46, 42, 0.2);
            --body-font: 'Montserrat', sans-serif;
            --heading-font: 'Lora', serif;
          }
          
          [data-theme="dark"] {
            --bg-color: #292420;
            --text-color: #f0ece4;
            --header-bg: #50392d;
            --header-text: #f0ece4;
            --sidebar-bg: rgba(40, 30, 25, 0.97);
            --sidebar-text: #f0ece4;
            --accent-color: #d7722c;
            --accent-hover: #e8833d;
            --wisdom-color: #e0c08f;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --card-bg: #352e29;
          }

          * { box-sizing: border-box; }
          
          body {
            margin: 0;
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
            line-height: 1.6;
          }

          .page-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }

          .header {
            height: 72px;
            background-color: var(--header-bg);
            color: var(--header-text);
            display: flex;
            align-items: center;
            padding: 0 1rem;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            box-shadow: 0 2px 10px var(--shadow-color);
            transition: background-color 0.3s;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .header-center {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: var(--heading-font);
            font-weight: bold;
            font-size: 1.2rem;
            text-decoration: none;
            color: var(--header-text);
          }

          .header-right {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .header-button {
            background: none;
            border: none;
            color: var(--header-text);
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            transition: background-color 0.2s, transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
          }

          .header-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }

          .header-button.rotated {
            transform: rotate(90deg);
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 280px;
            background: var(--sidebar-bg);
            color: var(--sidebar-text);
            padding: 1.5rem;
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out, background 0.3s;
            backdrop-filter: blur(12px);
            box-shadow: 4px 0 20px var(--shadow-color);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .sidebar.visible {
            transform: translateX(0);
          }

          .sidebar h2 {
            margin: 0 0 1rem 0;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: var(--heading-font);
          }

          .sidebar a {
            color: var(--sidebar-text);
            text-decoration: none;
            padding: 0.5rem;
            border-radius: 6px;
            transition: background-color 0.2s;
            display: block;
            margin-bottom: 0.5rem;
          }

          .sidebar a:hover {
            background-color: rgba(255,255,255,0.1);
          }

          .main-content {
            flex: 1;
            margin-top: 72px;
            padding: 2rem;
            background-color: var(--bg-color);
          }

          .content-container {
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.7;
          }

          .content-container h1 {
            color: var(--text-color);
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-family: var(--heading-font);
            text-align: center;
          }

          .content-container h2 {
            color: var(--accent-color);
            font-size: 1.5rem;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            font-family: var(--heading-font);
            border-bottom: 2px solid var(--accent-color);
            padding-bottom: 0.5rem;
          }

          .content-container h3 {
            color: var(--wisdom-color);
            font-size: 1.2rem;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-family: var(--heading-font);
          }

          .content-container p {
            margin-bottom: 1rem;
            text-align: justify;
          }

          .content-container ul, .content-container ol {
            margin: 1rem 0;
            padding-left: 2rem;
          }

          .content-container li {
            margin-bottom: 0.5rem;
          }

          .content-container strong {
            color: var(--accent-color);
            font-weight: 600;
          }

          .back-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--accent-color);
            text-decoration: none;
            margin-bottom: 2rem;
            padding: 0.5rem 1rem;
            border: 1px solid var(--accent-color);
            border-radius: 6px;
            transition: background-color 0.2s;
          }

          .back-link:hover {
            background-color: var(--accent-color);
            color: white;
          }

          .effective-date {
            background-color: var(--card-bg);
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid var(--accent-color);
            margin-bottom: 2rem;
            font-style: italic;
          }

          .contact-info {
            background-color: var(--card-bg);
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 2rem;
            border: 1px solid var(--input-border);
          }

          .contact-info h3 {
            margin-top: 0;
            color: var(--accent-color);
          }

          .contact-info a {
            color: var(--accent-color);
            text-decoration: none;
          }

          .contact-info a:hover {
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .main-content {
              padding: 1rem;
            }

            .content-container h1 {
              font-size: 2rem;
            }

            .content-container h2 {
              font-size: 1.3rem;
            }
          }
        `}} />
      </Head>

      <div className="page-container">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button 
              className={`header-button ${sidebarVisible ? 'rotated' : ''}`}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
          </div>

          <Link href="/" className="header-center">
            {!logoError ? (
              <img 
                src="/images/GriotBot logo horiz wht.svg"
                alt="GriotBot"
                style={{ height: '32px', width: 'auto' }}
                onError={handleLogoError}
              />
            ) : (
              <>
                <span style={{ fontSize: '1.5rem' }}>🌿</span>
                <span>GriotBot</span>
              </>
            )}
          </Link>

          <div className="header-right">
            <button 
              className="header-button"
              onClick={handleNewChat}
              aria-label="New chat"
            >
              <MessageCirclePlus size={20} />
            </button>
            
            <Link href="/comingsoon" className="header-button">
              <User size={20} />
            </Link>
            
            <button 
              className="header-button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Sidebar */}
        <nav className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
          <h2>
            <span style={{ fontSize: '1.5rem' }}>🌿</span>
            GriotBot
          </h2>
          
          <div>
            <Link href="/">
              <a>
                <span style={{ marginRight: '0.5rem' }}>+</span> New Chat
              </a>
            </Link>
            <a href="#">Saved Conversations</a>
            <a href="#">Saved Stories</a>
          </div>
          
          <div>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', opacity: '0.8' }}>
              Explore
            </h3>
            <a href="#">Historical Figures</a>
            <a href="#">Cultural Stories</a>
            <a href="#">Diaspora Community</a>
          </div>
          
          <div>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', opacity: '0.8' }}>
              About
            </h3>
            <Link href="/about"><a>About GriotBot</a></Link>
            <Link href="/feedback"><a>Share Feedback</a></Link>
            <Link href="/terms"><a style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>Terms & Conditions</a></Link>
            <Link href="/privacy"><a>Privacy & Security</a></Link>
          </div>
          
          <div style={{ marginTop: 'auto', fontSize: '0.8rem', opacity: '0.7', textAlign: 'center', fontStyle: 'italic' }}>
            "Preserving our stories,<br/>empowering our future."
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-container">
            <Link href="/" className="back-link">
              <ArrowLeft size={16} />
              Back to Chat
            </Link>

            <h1>Terms and Conditions</h1>

            <div className="effective-date">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> January 1, 2025
            </div>

            <p>
              Welcome to GriotBot! These Terms and Conditions ("Terms") govern your use of the GriotBot platform, 
              including our website, AI chat interface, and related services (collectively, the "Service"). 
              By accessing or using GriotBot, you agree to be bound by these Terms.
            </p>

            <h2>1. About GriotBot</h2>
            <p>
              GriotBot is an AI-powered digital griot inspired by the West African tradition of storytelling, 
              history-keeping, and guidance. Our Service provides culturally rich, emotionally intelligent 
              responses focused on African diaspora culture, history, and wisdom.
            </p>

            <h2>2. Acceptance of Terms</h2>
            <p>
              By using GriotBot, you confirm that:
            </p>
            <ul>
              <li>You are at least 13 years old</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>You will use the Service in compliance with all applicable laws</li>
              <li>You agree to our Privacy Policy and cultural guidelines</li>
            </ul>

            <h2>3. Description of Service</h2>
            <h3>3.1 Core Features</h3>
            <ul>
              <li><strong>AI Chat Interface:</strong> Interactive conversations with our cultural AI assistant</li>
              <li><strong>Storyteller Mode:</strong> Narrative responses inspired by griot traditions</li>
              <li><strong>Cultural Content:</strong> Information about African diaspora history, culture, and wisdom</li>
              <li><strong>Educational Resources:</strong> Learning materials and cultural insights</li>
            </ul>

            <h3>3.2 Service Limitations</h3>
            <p>
              GriotBot is designed for educational and cultural purposes. While we strive for accuracy, 
              our responses should not be considered:
            </p>
            <ul>
              <li>Professional advice (legal, medical, financial, or therapeutic)</li>
              <li>Definitive historical or academic authority</li>
              <li>Substitute for professional consultation or formal education</li>
            </ul>

            <h2>4. User Responsibilities</h2>
            <h3>4.1 Appropriate Use</h3>
            <p>You agree to use GriotBot responsibly and respectfully. You will NOT:</p>
            <ul>
              <li>Use the Service for harmful, illegal, or discriminatory purposes</li>
              <li>Attempt to harm, harass, or discriminate against any individual or group</li>
              <li>Share false, misleading, or culturally insensitive content</li>
              <li>Attempt to reverse engineer, hack, or compromise our systems</li>
              <li>Use the Service to generate content that violates intellectual property rights</li>
              <li>Impersonate others or misrepresent your identity</li>
            </ul>

            <h3>4.2 Cultural Respect</h3>
            <p>
              Given our focus on African diaspora culture, we expect all users to:
            </p>
            <ul>
              <li>Engage respectfully with cultural content and traditions</li>
              <li>Avoid perpetuating stereotypes or cultural appropriation</li>
              <li>Report any culturally insensitive responses or content</li>
              <li>Contribute to a welcoming environment for all users</li>
            </ul>

            <h2>5. Privacy and Data Protection</h2>
            <p>
              Your privacy is fundamental to our mission. We operate with a privacy-first approach:
            </p>
            <ul>
              <li>We do not store your conversation content</li>
              <li>We use minimal analytics focused on improving cultural accuracy</li>
              <li>We never share personal information with third parties for marketing</li>
              <li>We comply with applicable data protection regulations</li>
            </ul>
            <p>
              For detailed information, please review our <Link href="/privacy"><a>Privacy Policy</a></Link>.
            </p>

            <h2>6. Intellectual Property</h2>
            <h3>6.1 GriotBot Content</h3>
            <p>
              The GriotBot platform, including our AI model, interface, and original content, 
              is protected by intellectual property laws. We respect cultural heritage and 
              traditional knowledge while creating original educational content.
            </p>

            <h3>6.2 User Content</h3>
            <p>
              While we don't store your conversations, any feedback or content you provide 
              may be used to improve our Service. You retain ownership of your original ideas 
              and expressions.
            </p>

            <h3>6.3 Cultural Heritage</h3>
            <p>
              We acknowledge that many stories, proverbs, and cultural knowledge shared through 
              GriotBot belong to communities and traditions. We strive to honor these sources 
              and encourage users to respect cultural origins.
            </p>

            <h2>7. Disclaimers and Limitations</h2>
            <h3>7.1 AI Limitations</h3>
            <p>
              GriotBot uses advanced AI technology, but like all AI systems:
            </p>
            <ul>
              <li>Responses may occasionally be inaccurate or incomplete</li>
              <li>Cultural interpretations may vary across different communities</li>
              <li>The AI cannot replace human cultural experts or educators</li>
              <li>We continuously work to improve accuracy and cultural authenticity</li>
            </ul>

            <h3>7.2 Service Availability</h3>
            <p>
              We strive to provide reliable service but cannot guarantee:
            </p>
            <ul>
              <li>Uninterrupted access to the platform</li>
              <li>Error-free operation at all times</li>
              <li>Compatibility with all devices or browsers</li>
              <li>Permanent availability of all features</li>
            </ul>

            <h2>8. Institutional and Educational Use</h2>
            <h3>8.1 Educational Partnerships</h3>
            <p>
              We welcome partnerships with educational institutions, museums, and cultural organizations. 
              Special terms may apply for institutional use, including:
            </p>
            <ul>
              <li>Volume licensing for schools and universities</li>
              <li>Custom integration for educational platforms</li>
              <li>Enhanced privacy protections for student data</li>
              <li>Specialized cultural content for specific curricula</li>
            </ul>

            <h3>8.2 COPPA Compliance</h3>
            <p>
              For users under 13, we require parental consent and additional privacy protections 
              in compliance with the Children's Online Privacy Protection Act (COPPA).
            </p>

            <h2>9. Modifications to Service and Terms</h2>
            <p>
              We reserve the right to:
            </p>
            <ul>
              <li>Update these Terms with 30 days notice for material changes</li>
              <li>Modify or discontinue Service features as needed</li>
              <li>Improve our AI model and cultural accuracy measures</li>
              <li>Add new features or capabilities</li>
            </ul>
            <p>
              Continued use of GriotBot after changes constitutes acceptance of updated Terms.
            </p>

            <h2>10. Termination</h2>
            <p>
              Either party may terminate this agreement:
            </p>
            <ul>
              <li><strong>You</strong> may stop using GriotBot at any time</li>
              <li><strong>We</strong> may suspend access for Terms violations</li>
              <li><strong>We</strong> may discontinue the Service with reasonable notice</li>
            </ul>

            <h2>11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, GriotBot and its creators are not liable for:
            </p>
            <ul>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Decisions made based on AI-generated content</li>
              <li>Cultural misunderstandings or misinterpretations</li>
              <li>Technical issues or service interruptions</li>
            </ul>

            <h2>12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the jurisdiction where GriotBot is operated, 
              without regard to conflict of law principles. Any disputes will be resolved through 
              binding arbitration or in the appropriate courts.
            </p>

            <h2>13. Community Guidelines</h2>
            <p>
              GriotBot is built to serve and honor the African diaspora community. We expect all 
              users to contribute to a respectful, educational environment that:
            </p>
            <ul>
              <li>Celebrates cultural diversity within the diaspora</li>
              <li>Promotes learning and understanding</li>
              <li>Respects different perspectives and experiences</li>
              <li>Supports cultural preservation and education</li>
            </ul>

            <h2>14. Feedback and Improvements</h2>
            <p>
              We actively seek community feedback to improve cultural accuracy and user experience. 
              Your input helps us better serve the diaspora community and preserve cultural authenticity.
            </p>

            <div className="contact-info">
              <h3>Contact Information</h3>
              <p>
                If you have questions about these Terms and Conditions, please contact us:
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><strong>Email:</strong> <a href="mailto:legal@griotbot.com">legal@griotbot.com</a></li>
                <li><strong>General Inquiries:</strong> <a href="mailto:chat@griotbot.com">chat@griotbot.com</a></li>
                <li><strong>Instagram:</strong> <a href="https://www.instagram.com/griotbot" target="_blank" rel="noopener noreferrer">@griotbot</a></li>
                <li><strong>Twitter:</strong> <a href="https://twitter.com/griotbot" target="_blank" rel="noopener noreferrer">@griotbot</a></li>
              </ul>
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.9rem', fontStyle: 'italic', opacity: '0.8' }}>
              Thank you for being part of the GriotBot community. Together, we preserve and share 
              the rich cultural heritage of the African diaspora through innovative technology. 🌿
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
