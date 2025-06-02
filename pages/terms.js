// File: pages/terms.js
import { useState } from 'react';
import { FileText, Shield, Users, Book, AlertCircle, Mail, ArrowLeft } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';
import Link from 'next/link';

export default function Terms() {
  // Style constants to reduce duplication
  const CARD_STYLES = {
    backgroundColor: 'var(--card-bg)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow-color)',
    border: '1px solid var(--input-border)',
    textAlign: 'left',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    marginBottom: '2rem'
  };

  // Improved hover handlers
  const handleCtaHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  return (
    <StandardLayout 
      pageType="standard"
      title="Terms and Conditions - GriotBot"
      description="Terms and Conditions for using GriotBot - your AI-powered digital griot"
      currentPath="/terms"
    >
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: 1.7,
        padding: '0 1rem'
      }}>
        {/* Back to Chat Link */}
        <Link href="/">
          <a style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--accent-color)',
            textDecoration: 'none',
            marginBottom: '2rem',
            padding: '0.5rem 1rem',
            border: '1px solid var(--accent-color)',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--accent-color)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'var(--accent-color)';
          }}>
            <ArrowLeft size={16} />
            Back to Chat
          </a>
        </Link>

        {/* Main Heading */}
        <h1 style={{
          color: 'var(--text-color)',
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          textAlign: 'center'
        }}>
          Terms and Conditions
        </h1>

        {/* Effective Date */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '1rem',
          borderRadius: '8px',
          borderLeft: '4px solid var(--accent-color)',
          marginBottom: '2rem',
          fontStyle: 'italic'
        }}>
          <strong>Effective Date:</strong> January 1, 2025<br />
          <strong>Last Updated:</strong> January 1, 2025
        </div>

        {/* Introduction */}
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          Welcome to GriotBot! These Terms and Conditions ("Terms") govern your use of the GriotBot platform, 
          including our website, AI chat interface, and related services (collectively, the "Service"). 
          By accessing or using GriotBot, you agree to be bound by these Terms.
        </p>

        {/* Section 1: About GriotBot */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          1. About GriotBot
        </h2>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          GriotBot is an AI-powered digital griot inspired by the West African tradition of storytelling, 
          history-keeping, and guidance. Our Service provides culturally rich, emotionally intelligent 
          responses focused on African diaspora culture, history, and wisdom.
        </p>

        {/* Section 2: Acceptance of Terms */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          2. Acceptance of Terms
        </h2>
        <p style={{ marginBottom: '1rem' }}>By using GriotBot, you confirm that:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>You are at least 13 years old</li>
          <li style={{ marginBottom: '0.5rem' }}>You have the legal capacity to enter into these Terms</li>
          <li style={{ marginBottom: '0.5rem' }}>You will use the Service in compliance with all applicable laws</li>
          <li style={{ marginBottom: '0.5rem' }}>You agree to our Privacy Policy and cultural guidelines</li>
        </ul>

        {/* Section 3: Description of Service */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          3. Description of Service
        </h2>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          3.1 Core Features
        </h3>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>AI Chat Interface:</strong> Interactive conversations with our cultural AI assistant
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Storyteller Mode:</strong> Narrative responses inspired by griot traditions
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Cultural Content:</strong> Information about African diaspora history, culture, and wisdom
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Educational Resources:</strong> Learning materials and cultural insights
          </li>
        </ul>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          3.2 Service Limitations
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          GriotBot is designed for educational and cultural purposes. While we strive for accuracy, 
          our responses should not be considered:
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Professional advice (legal, medical, financial, or therapeutic)</li>
          <li style={{ marginBottom: '0.5rem' }}>Definitive historical or academic authority</li>
          <li style={{ marginBottom: '0.5rem' }}>Substitute for professional consultation or formal education</li>
        </ul>

        {/* Section 4: User Responsibilities */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          4. User Responsibilities
        </h2>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          4.1 Appropriate Use
        </h3>
        <p style={{ marginBottom: '1rem' }}>You agree to use GriotBot responsibly and respectfully. You will NOT:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Use the Service for harmful, illegal, or discriminatory purposes</li>
          <li style={{ marginBottom: '0.5rem' }}>Attempt to harm, harass, or discriminate against any individual or group</li>
          <li style={{ marginBottom: '0.5rem' }}>Share false, misleading, or culturally insensitive content</li>
          <li style={{ marginBottom: '0.5rem' }}>Attempt to reverse engineer, hack, or compromise our systems</li>
          <li style={{ marginBottom: '0.5rem' }}>Use the Service to generate content that violates intellectual property rights</li>
          <li style={{ marginBottom: '0.5rem' }}>Impersonate others or misrepresent your identity</li>
        </ul>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          4.2 Cultural Respect
        </h3>
        <p style={{ marginBottom: '1rem' }}>Given our focus on African diaspora culture, we expect all users to:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Engage respectfully with cultural content and traditions</li>
          <li style={{ marginBottom: '0.5rem' }}>Avoid perpetuating stereotypes or cultural appropriation</li>
          <li style={{ marginBottom: '0.5rem' }}>Report any culturally insensitive responses or content</li>
          <li style={{ marginBottom: '0.5rem' }}>Contribute to a welcoming environment for all users</li>
        </ul>

        {/* Section 5: Privacy and Data Protection */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          5. Privacy and Data Protection
        </h2>
        <p style={{ marginBottom: '1rem' }}>Your privacy is fundamental to our mission. We operate with a privacy-first approach:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>We do not store your conversation content</li>
          <li style={{ marginBottom: '0.5rem' }}>We use minimal analytics focused on improving cultural accuracy</li>
          <li style={{ marginBottom: '0.5rem' }}>We never share personal information with third parties for marketing</li>
          <li style={{ marginBottom: '0.5rem' }}>We comply with applicable data protection regulations</li>
        </ul>
        <p style={{ marginBottom: '1rem' }}>
          For detailed information, please review our{' '}
          <Link href="/privacy">
            <a style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Privacy Policy</a>
          </Link>.
        </p>

        {/* Section 6: Intellectual Property */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          6. Intellectual Property
        </h2>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          6.1 GriotBot Content
        </h3>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          The GriotBot platform, including our AI model, interface, and original content, 
          is protected by intellectual property laws. We respect cultural heritage and 
          traditional knowledge while creating original educational content.
        </p>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          6.2 User Content
        </h3>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          While we don't store your conversations, any feedback or content you provide 
          may be used to improve our Service. You retain ownership of your original ideas 
          and expressions.
        </p>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          6.3 Cultural Heritage
        </h3>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          We acknowledge that many stories, proverbs, and cultural knowledge shared through 
          GriotBot belong to communities and traditions. We strive to honor these sources 
          and encourage users to respect cultural origins.
        </p>

        {/* Section 7: Disclaimers and Limitations */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          7. Disclaimers and Limitations
        </h2>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          7.1 AI Limitations
        </h3>
        <p style={{ marginBottom: '1rem' }}>GriotBot uses advanced AI technology, but like all AI systems:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Responses may occasionally be inaccurate or incomplete</li>
          <li style={{ marginBottom: '0.5rem' }}>Cultural interpretations may vary across different communities</li>
          <li style={{ marginBottom: '0.5rem' }}>The AI cannot replace human cultural experts or educators</li>
          <li style={{ marginBottom: '0.5rem' }}>We continuously work to improve accuracy and cultural authenticity</li>
        </ul>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          7.2 Service Availability
        </h3>
        <p style={{ marginBottom: '1rem' }}>We strive to provide reliable service but cannot guarantee:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Uninterrupted access to the platform</li>
          <li style={{ marginBottom: '0.5rem' }}>Error-free operation at all times</li>
          <li style={{ marginBottom: '0.5rem' }}>Compatibility with all devices or browsers</li>
          <li style={{ marginBottom: '0.5rem' }}>Permanent availability of all features</li>
        </ul>

        {/* Section 8: Institutional and Educational Use */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          8. Institutional and Educational Use
        </h2>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          8.1 Educational Partnerships
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          We welcome partnerships with educational institutions, museums, and cultural organizations. 
          Special terms may apply for institutional use, including:
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Volume licensing for schools and universities</li>
          <li style={{ marginBottom: '0.5rem' }}>Custom integration for educational platforms</li>
          <li style={{ marginBottom: '0.5rem' }}>Enhanced privacy protections for student data</li>
          <li style={{ marginBottom: '0.5rem' }}>Specialized cultural content for specific curricula</li>
        </ul>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          8.2 COPPA Compliance
        </h3>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          For users under 13, we require parental consent and additional privacy protections 
          in compliance with the Children's Online Privacy Protection Act (COPPA).
        </p>

        {/* Section 9: Modifications to Service and Terms */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          9. Modifications to Service and Terms
        </h2>
        <p style={{ marginBottom: '1rem' }}>We reserve the right to:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Update these Terms with 30 days notice for material changes</li>
          <li style={{ marginBottom: '0.5rem' }}>Modify or discontinue Service features as needed</li>
          <li style={{ marginBottom: '0.5rem' }}>Improve our AI model and cultural accuracy measures</li>
          <li style={{ marginBottom: '0.5rem' }}>Add new features or capabilities</li>
        </ul>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          Continued use of GriotBot after changes constitutes acceptance of updated Terms.
        </p>

        {/* Section 10: Termination */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          10. Termination
        </h2>
        <p style={{ marginBottom: '1rem' }}>Either party may terminate this agreement:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>You</strong> may stop using GriotBot at any time
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>We</strong> may suspend access for Terms violations
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>We</strong> may discontinue the Service with reasonable notice
          </li>
        </ul>

        {/* Section 11: Limitation of Liability */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          11. Limitation of Liability
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          To the maximum extent permitted by law, GriotBot and its creators are not liable for:
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Indirect, incidental, or consequential damages</li>
          <li style={{ marginBottom: '0.5rem' }}>Decisions made based on AI-generated content</li>
          <li style={{ marginBottom: '0.5rem' }}>Cultural misunderstandings or misinterpretations</li>
          <li style={{ marginBottom: '0.5rem' }}>Technical issues or service interruptions</li>
        </ul>

        {/* Section 12: Governing Law */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          12. Governing Law
        </h2>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          These Terms are governed by the laws of the jurisdiction where GriotBot is operated, 
          without regard to conflict of law principles. Any disputes will be resolved through 
          binding arbitration or in the appropriate courts.
        </p>

        {/* Section 13: Community Guidelines */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          13. Community Guidelines
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          GriotBot is built to serve and honor the African diaspora community. We expect all 
          users to contribute to a respectful, educational environment that:
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Celebrates cultural diversity within the diaspora</li>
          <li style={{ marginBottom: '0.5rem' }}>Promotes learning and understanding</li>
          <li style={{ marginBottom: '0.5rem' }}>Respects different perspectives and experiences</li>
          <li style={{ marginBottom: '0.5rem' }}>Supports cultural preservation and education</li>
        </ul>

        {/* Section 14: Feedback and Improvements */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          14. Feedback and Improvements
        </h2>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          We actively seek community feedback to improve cultural accuracy and user experience. 
          Your input helps us better serve the diaspora community and preserve cultural authenticity.
        </p>

        {/* Contact Information */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          border: '1px solid var(--input-border)'
        }}>
          <h3 style={{
            marginTop: 0,
            color: 'var(--accent-color)',
            fontFamily: 'var(--heading-font)'
          }}>
            Contact Information
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            If you have questions about these Terms and Conditions, please contact us:
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Email:</strong>{' '}
              <a href="mailto:legal@griotbot.com" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                legal@griotbot.com
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>General Inquiries:</strong>{' '}
              <a href="mailto:chat@griotbot.com" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                chat@griotbot.com
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Instagram:</strong>{' '}
              <a href="https://www.instagram.com/griotbot" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                @griotbot
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Twitter:</strong>{' '}
              <a href="https://twitter.com/griotbot" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                @griotbot
              </a>
            </li>
          </ul>
        </div>

        {/* Closing Statement */}
        <p style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          opacity: 0.8,
          textAlign: 'center'
        }}>
          Thank you for being part of the GriotBot community. Together, we preserve and share 
          the rich cultural heritage of the African diaspora through innovative technology. 🌿
        </p>
      </div>
    </StandardLayout>
  );
}
