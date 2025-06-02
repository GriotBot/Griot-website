// File: pages/privacy.js
import { useState } from 'react';
import { Shield, Lock, Eye, Database, Globe, Mail, ArrowLeft } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';
import Link from 'next/link';

export default function Privacy() {
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
      title="Privacy & Security - GriotBot"
      description="Privacy Policy and Security practices for GriotBot - your AI-powered digital griot"
      currentPath="/privacy"
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
          Privacy & Security
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
          At GriotBot, your privacy and the sovereignty of cultural data are fundamental to our mission. 
          This Privacy Policy explains how we collect, use, protect, and respect your information when you 
          use our AI-powered digital griot service. We are committed to maintaining the highest standards 
          of privacy protection for the African diaspora community.
        </p>

        {/* Privacy Commitment Highlight */}
        <div style={{
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.3rem',
            fontFamily: 'var(--heading-font)'
          }}>
            Our Privacy Commitment
          </h3>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            <strong>We do not store your conversations.</strong> Your cultural discussions and personal 
            interactions with GriotBot remain private and are not retained in our systems.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          1. Information We Collect
        </h2>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          1.1 What We DON'T Collect
        </h3>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Conversation Content:</strong> We do not store the text of your conversations with GriotBot
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Personal Stories:</strong> Cultural stories and personal experiences you share are not retained
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Identity Information:</strong> We don't require or store real names, addresses, or detailed demographics
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Biometric Data:</strong> No voice recordings, images, or other biometric information
          </li>
        </ul>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          1.2 Minimal Data We Do Collect
        </h3>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Usage Analytics:</strong> Number of conversations, feature usage, and general patterns to improve cultural accuracy
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Technical Information:</strong> Browser type, device type, and IP address for security and performance
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Preference Settings:</strong> Your theme choice, storyteller mode preference, and accessibility settings
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Feedback (Optional):</strong> Only if you voluntarily provide feedback through our feedback form
          </li>
        </ul>

        {/* Section 2: Cultural Data Sovereignty */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          2. Cultural Data Sovereignty
        </h2>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          We recognize the historical exploitation of cultural data from African diaspora communities. 
          Our approach prioritizes cultural data sovereignty and community control:
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Community Ownership:</strong> Cultural knowledge shared through GriotBot belongs to the broader African diaspora community
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>No Cultural Mining:</strong> We don't extract or commercialize traditional knowledge shared in conversations
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Community Input:</strong> Cultural content development involves community members and cultural experts
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Respect for Origins:</strong> We acknowledge and respect the sources of cultural knowledge and traditions
          </li>
        </ul>

        {/* Section 3: How We Use Information */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          3. How We Use Information
        </h2>
        <p style={{ marginBottom: '1rem' }}>The minimal information we collect is used exclusively to:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Improve cultural accuracy and authenticity of responses</li>
          <li style={{ marginBottom: '0.5rem' }}>Enhance the user experience and accessibility features</li>
          <li style={{ marginBottom: '0.5rem' }}>Prevent abuse and maintain platform security</li>
          <li style={{ marginBottom: '0.5rem' }}>Understand usage patterns to guide feature development</li>
          <li style={{ marginBottom: '0.5rem' }}>Comply with legal requirements and safety measures</li>
        </ul>

        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          <strong>We never use your information for:</strong> Marketing to third parties, building advertising profiles, 
          selling data, or any commercial purpose unrelated to improving GriotBot's cultural service.
        </p>

        {/* Section 4: Information Sharing */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          4. Information Sharing and Disclosure
        </h2>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          4.1 We Do NOT Share
        </h3>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Personal information with advertisers or marketing companies</li>
          <li style={{ marginBottom: '0.5rem' }}>Conversation content with any third parties</li>
          <li style={{ marginBottom: '0.5rem' }}>Cultural stories or personal experiences shared with GriotBot</li>
          <li style={{ marginBottom: '0.5rem' }}>User data for profit or commercial exploitation</li>
        </ul>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          4.2 Limited Sharing (Only When Required)
        </h3>
        <p style={{ marginBottom: '1rem' }}>We may share minimal information only in these specific circumstances:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Service Providers:</strong> Technical partners who help operate the platform (with strict data protection agreements)
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Legal Compliance:</strong> When required by law, court order, or to protect safety
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Business Transfer:</strong> In the unlikely event of a merger or acquisition (with community notification)
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Cultural Experts:</strong> Anonymous usage patterns shared with cultural advisors for accuracy improvement
          </li>
        </ul>

        {/* Section 5: Third-Party Services */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          5. Third-Party Services and Privacy
        </h2>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          5.1 AI Model Providers
        </h3>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          GriotBot uses OpenRouter as our AI service provider, which connects us to leading AI models 
          like Anthropic Claude and OpenAI GPT. <strong>Important:</strong>
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>We configure our AI providers with <strong>"data collection: deny"</strong> settings</li>
          <li style={{ marginBottom: '0.5rem' }}>Your conversations are not used to train AI models</li>
          <li style={{ marginBottom: '0.5rem' }}>We select providers with strong privacy commitments</li>
          <li style={{ marginBottom: '0.5rem' }}>Conversation data is processed but not stored by our AI providers</li>
        </ul>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          5.2 Hosting and Technical Services
        </h3>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Vercel:</strong> Website hosting with privacy-focused configuration
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Cloudflare:</strong> Security and performance optimization
          </li>
          <li style={{ marginBottom: '0.5rem' }}>All technical partners are bound by strict data protection agreements</li>
          <li style={{ marginBottom: '0.5rem' }}>We choose providers with strong privacy reputations and practices</li>
        </ul>

        {/* Section 6: Data Security */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          6. Data Security Measures
        </h2>
        <p style={{ marginBottom: '1rem' }}>We implement multiple layers of security to protect your privacy:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Encryption:</strong> All data transmission uses industry-standard SSL/TLS encryption
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>No Persistent Storage:</strong> Conversations are processed in memory and immediately discarded
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Access Controls:</strong> Strict employee access controls and monitoring
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Regular Audits:</strong> Privacy and security practices reviewed by independent experts
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Incident Response:</strong> Prepared response plan for any potential security issues
          </li>
        </ul>

        {/* Section 7: Educational Privacy */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          7. Educational Privacy (FERPA & COPPA)
        </h2>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          7.1 Student Privacy (FERPA Compliance)
        </h3>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          For educational institutions using GriotBot:
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>We comply with the Family Educational Rights and Privacy Act (FERPA)</li>
          <li style={{ marginBottom: '0.5rem' }}>Student conversations are not considered educational records</li>
          <li style={{ marginBottom: '0.5rem' }}>Institutional administrators can configure additional privacy protections</li>
          <li style={{ marginBottom: '0.5rem' }}>We provide usage reports without individual student identification</li>
        </ul>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          7.2 Children's Privacy (COPPA Compliance)
        </h3>
        <p style={{ marginBottom: '1rem' }}>For users under 13 years old:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Parental consent required before using GriotBot</li>
          <li style={{ marginBottom: '0.5rem' }}>Additional privacy protections automatically applied</li>
          <li style={{ marginBottom: '0.5rem' }}>Limited data collection with enhanced security measures</li>
          <li style={{ marginBottom: '0.5rem' }}>Parents can request account deletion at any time</li>
        </ul>

        {/* Section 8: International Privacy */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          8. International Privacy Rights
        </h2>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          8.1 GDPR (European Union)
        </h3>
        <p style={{ marginBottom: '1rem' }}>For users in the European Union, you have the right to:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Access any personal data we hold about you</li>
          <li style={{ marginBottom: '0.5rem' }}>Correct inaccurate information</li>
          <li style={{ marginBottom: '0.5rem' }}>Request deletion of your data</li>
          <li style={{ marginBottom: '0.5rem' }}>Object to processing of your data</li>
          <li style={{ marginBottom: '0.5rem' }}>Data portability (receive your data in a usable format)</li>
        </ul>

        <h3 style={{
          color: 'var(--wisdom-color)',
          fontSize: '1.2rem',
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          fontFamily: 'var(--heading-font)'
        }}>
          8.2 CCPA (California)
        </h3>
        <p style={{ marginBottom: '1rem' }}>California residents have the right to:</p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Know what personal information we collect</li>
          <li style={{ marginBottom: '0.5rem' }}>Delete personal information we have collected</li>
          <li style={{ marginBottom: '0.5rem' }}>Opt-out of sale of personal information (we don't sell data)</li>
          <li style={{ marginBottom: '0.5rem' }}>Non-discrimination for exercising privacy rights</li>
        </ul>

        {/* Section 9: Your Privacy Choices */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          9. Your Privacy Choices and Controls
        </h2>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Browser Settings:</strong> Control cookies and local storage through your browser
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Theme Preferences:</strong> Choose light or dark mode (stored locally on your device)
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Feedback Opt-out:</strong> You can always choose not to provide feedback
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Access Requests:</strong> Contact us to exercise your privacy rights
          </li>
        </ul>

        {/* Section 10: Retention and Deletion */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          10. Data Retention and Deletion
        </h2>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Conversations:</strong> Never stored - processed and immediately discarded
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Usage Analytics:</strong> Aggregated data retained for 24 months for service improvement
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Technical Logs:</strong> Security logs retained for 90 days for safety purposes
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Feedback:</strong> Retained until you request deletion or service discontinuation
          </li>
        </ul>

        {/* Section 11: Changes to Privacy Policy */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          11. Changes to This Privacy Policy
        </h2>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
          We will notify users of material changes through:
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Prominent notice on the GriotBot platform</li>
          <li style={{ marginBottom: '0.5rem' }}>Email notification for institutional partners</li>
          <li style={{ marginBottom: '0.5rem' }}>30-day advance notice for significant privacy changes</li>
          <li style={{ marginBottom: '0.5rem' }}>Updated "Last Modified" date at the top of this policy</li>
        </ul>

        {/* Section 12: Community Accountability */}
        <h2 style={{
          color: 'var(--accent-color)',
          fontSize: '1.5rem',
          marginTop: '2.5rem',
          marginBottom: '1rem',
          fontFamily: 'var(--heading-font)',
          borderBottom: '2px solid var(--accent-color)',
          paddingBottom: '0.5rem'
        }}>
          12. Community Accountability and Transparency
        </h2>
        <p style={{ marginBottom: '1rem', textAlign: 'justify' }}>
          As a service built for the African diaspora community, we commit to transparency and accountability:
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Annual privacy practices review by community representatives</li>
          <li style={{ marginBottom: '0.5rem' }}>Open feedback process for privacy concerns and suggestions</li>
          <li style={{ marginBottom: '0.5rem' }}>Regular community updates on privacy and security improvements</li>
          <li style={{ marginBottom: '0.5rem' }}>Commitment to culturally responsive privacy practices</li>
        </ul>

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
            Privacy Contact Information
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            For privacy questions, concerns, or to exercise your privacy rights, please contact us:
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Privacy Officer:</strong>{' '}
              <a href="mailto:privacy@griotbot.com" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                privacy@griotbot.com
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>General Inquiries:</strong>{' '}
              <a href="mailto:chat@griotbot.com" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                chat@griotbot.com
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Data Protection Requests:</strong>{' '}
              <a href="mailto:privacy@griotbot.com?subject=Data%20Protection%20Request" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                privacy@griotbot.com
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
          
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(215, 114, 44, 0.1)',
            borderRadius: '6px',
            borderLeft: '3px solid var(--accent-color)'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              <strong>Response Time:</strong> We aim to respond to privacy inquiries within 72 hours 
              and complete data requests within 30 days as required by applicable privacy laws.
            </p>
          </div>
        </div>

        {/* Privacy Rights Summary */}
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
            Quick Reference: Your Privacy Rights
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(125, 135, 101, 0.1)',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <Shield size={24} style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-color)' }}>Access</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Know what data we have</p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(125, 135, 101, 0.1)',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <Lock size={24} style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-color)' }}>Delete</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Remove your information</p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(125, 135, 101, 0.1)',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <Eye size={24} style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-color)' }}>Control</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Manage privacy settings</p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(125, 135, 101, 0.1)',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <Globe size={24} style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-color)' }}>Portability</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Export your data</p>
            </div>
          </div>
        </div>

        {/* Final Privacy Commitment */}
        <div style={{
          backgroundColor: 'var(--wisdom-color)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.4rem',
            fontFamily: 'var(--heading-font)'
          }}>
            Our Commitment to the Community
          </h3>
          <p style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1.1rem',
            lineHeight: 1.6 
          }}>
            GriotBot exists to serve and empower the African diaspora community. Your privacy 
            and the protection of our shared cultural heritage are not just legal obligations—they 
            are fundamental to our mission and values.
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '1rem',
            fontStyle: 'italic',
            opacity: 0.9 
          }}>
            "Privacy is not about hiding something. It's about protecting everything that makes us who we are."
          </p>
        </div>

        {/* Closing Statement */}
        <p style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          opacity: 0.8,
          textAlign: 'center'
        }}>
          Thank you for trusting GriotBot with your cultural journey. We are honored to be part of 
          preserving and sharing the rich heritage of the African diaspora while protecting your privacy. 🌿
        </p>

        {/* Terms Reference */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(215, 114, 44, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(215, 114, 44, 0.2)'
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            This Privacy Policy works together with our{' '}
            <Link href="/terms">
              <a style={{ 
                color: 'var(--accent-color)', 
                textDecoration: 'none',
                fontWeight: 500
              }}>
                Terms and Conditions
              </a>
            </Link>{' '}
            to govern your use of GriotBot.
          </p>
        </div>
      </div>
    </StandardLayout>
  );
}
