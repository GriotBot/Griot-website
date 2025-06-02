// File: pages/terms.js
import { useState } from 'react';
import { FileText, Shield, Users, Book, AlertCircle, Mail } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';

// Move static data outside component to prevent re-creation on each render
const termsSection = [
  {
    id: 'acceptance',
    icon: FileText,
    title: 'Acceptance of Terms',
    description: 'By accessing and using GriotBot, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.'
  },
  {
    id: 'cultural-respect',
    icon: Users,
    title: 'Cultural Respect & Responsibility',
    description: 'Users must engage respectfully with cultural content, acknowledge the diverse experiences within the African diaspora, and use information responsibly for educational and personal growth.'
  },
  {
    id: 'educational-use',
    icon: Book,
    title: 'Educational Purpose',
    description: 'GriotBot is designed for educational, cultural, and informational purposes. While we strive for accuracy, users should verify important information through additional sources.'
  },
  {
    id: 'privacy-protection',
    icon: Shield,
    title: 'Privacy & Data Protection',
    description: 'We are committed to protecting your privacy and cultural data sovereignty. We do not store your conversations and implement privacy-first practices throughout our platform.'
  }
];

export default function Terms() {
  const [expandedSection, setExpandedSection] = useState(null);

  // Style constants to reduce duplication
  const CARD_STYLES = {
    backgroundColor: 'var(--card-bg)',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow-color)',
    border: '1px solid var(--input-border)',
    textAlign: 'left',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer'
  };

  const BUTTON_STYLES = {
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
    whiteSpace: 'nowrap'
  };

  // Improved hover handlers with better performance
  const handleCardHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 8px 20px var(--shadow-color)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-color)';
    }
  };

  const handleButtonHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
    } else {
      e.currentTarget.style.backgroundColor = 'var(--accent-color)';
    }
  };

  const handleCtaHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <StandardLayout 
      pageType="standard"
      title="Terms and Conditions - GriotBot"
      description="Terms and Conditions for using GriotBot - your AI-powered digital griot"
      currentPath="/terms"
    >
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'center',
        lineHeight: 1.6,
        padding: '0 1rem'
      }}>
        {/* Hero Section */}
        <header style={{
          marginBottom: '3rem',
          padding: '2rem 0'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            color: 'var(--accent-color)'
          }}>
            <FileText 
              size={80} 
              aria-hidden="true"
            />
          </div>
          
          <h1 style={{
            color: 'var(--text-color)',
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)'
          }}>
            Terms and Conditions
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-color)',
            opacity: 0.8,
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Understanding your rights and responsibilities when using GriotBot, your AI-powered digital griot for cultural education and storytelling.
          </p>

          <div style={{
            backgroundColor: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--input-border)',
            marginBottom: '2rem'
          }}>
            <p style={{
              margin: 0,
              fontStyle: 'italic',
              color: 'var(--wisdom-color)'
            }}>
              <strong>Last Updated:</strong> January 2025
            </p>
          </div>
        </header>

        {/* Key Terms Overview */}
        <section 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
          aria-labelledby="key-terms-heading"
        >
          <h2 
            id="key-terms-heading" 
            style={{
              gridColumn: '1 / -1',
              color: 'var(--text-color)',
              fontSize: '1.75rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}
          >
            Key Terms Overview
          </h2>
          
          {termsSection.map((section) => (
            <article
              key={section.id}
              style={CARD_STYLES}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              onFocus={(e) => handleCardHover(e, true)}
              onBlur={(e) => handleCardHover(e, false)}
              tabIndex="0"
              role="article"
              aria-labelledby={`section-${section.id}-title`}
              onClick={() => toggleSection(section.id)}
            >
              <div style={{
                color: 'var(--accent-color)',
                marginBottom: '1rem'
              }}>
                <section.icon size={48} aria-hidden="true" />
              </div>
              
              <h3 
                id={`section-${section.id}-title`}
                style={{
                  color: 'var(--text-color)',
                  fontSize: '1.25rem',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--heading-font)'
                }}
              >
                {section.title}
              </h3>
              
              <p style={{
                color: 'var(--text-color)',
                opacity: 0.8,
                lineHeight: 1.5,
                margin: 0
              }}>
                {section.description}
              </p>
            </article>
          ))}
        </section>

        {/* Detailed Terms Sections */}
        <section 
          style={{
            ...CARD_STYLES,
            padding: '2.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}
          aria-labelledby="detailed-terms-heading"
        >
          <h2 
            id="detailed-terms-heading"
            style={{
              color: 'var(--text-color)',
              fontSize: '1.75rem',
              marginBottom: '2rem',
              fontFamily: 'var(--heading-font)',
              textAlign: 'center'
            }}
          >
            Detailed Terms and Conditions
          </h2>

          {/* 1. Service Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: 'var(--accent-color)',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}>
              1. Service Description
            </h3>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
              GriotBot is an AI-powered digital assistant inspired by the West African griot tradition. Our service provides:
            </p>
            <ul style={{ marginLeft: '1.5rem', lineHeight: 1.6 }}>
              <li>Culturally rich conversations about African diaspora history and culture</li>
              <li>Educational content and storytelling experiences</li>
              <li>Personal guidance rooted in cultural wisdom and traditions</li>
              <li>Interactive learning tools for individuals and educational institutions</li>
            </ul>
          </div>

          {/* 2. User Responsibilities */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: 'var(--accent-color)',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}>
              2. User Responsibilities
            </h3>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
              As a user of GriotBot, you agree to:
            </p>
            <ul style={{ marginLeft: '1.5rem', lineHeight: 1.6 }}>
              <li>Use the service respectfully and in accordance with its educational purpose</li>
              <li>Respect the cultural heritage and traditions represented in our content</li>
              <li>Not use the service for harmful, discriminatory, or illegal activities</li>
              <li>Acknowledge that AI responses are generated content, not professional advice</li>
              <li>Verify important information through additional authoritative sources</li>
            </ul>
          </div>

          {/* 3. Cultural Data Sovereignty */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: 'var(--accent-color)',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}>
              3. Cultural Data Sovereignty
            </h3>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
              We recognize the importance of cultural data sovereignty and commit to:
            </p>
            <ul style={{ marginLeft: '1.5rem', lineHeight: 1.6 }}>
              <li>Protecting the cultural knowledge and traditions shared through our platform</li>
              <li>Not storing your personal conversations or cultural discussions</li>
              <li>Respecting the intellectual property rights of cultural communities</li>
              <li>Involving community members in content development and accuracy verification</li>
            </ul>
          </div>

          {/* 4. Educational Institution Use */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: 'var(--accent-color)',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}>
              4. Educational Institution Use
            </h3>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
              For educational institutions using GriotBot:
            </p>
            <ul style={{ marginLeft: '1.5rem', lineHeight: 1.6 }}>
              <li>Institutional administrators are responsible for ensuring appropriate use by students and faculty</li>
              <li>COPPA compliance: Users under 13 require parental or school consent</li>
              <li>FERPA compliance: Educational records and interactions follow applicable privacy laws</li>
              <li>Institutions may establish additional usage guidelines for their community</li>
            </ul>
          </div>

          {/* 5. Limitation of Liability */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: 'var(--accent-color)',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}>
              5. Limitation of Liability
            </h3>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
              GriotBot is provided "as is" for educational and informational purposes. We:
            </p>
            <ul style={{ marginLeft: '1.5rem', lineHeight: 1.6 }}>
              <li>Do not guarantee the accuracy or completeness of all generated content</li>
              <li>Are not liable for decisions made based on AI-generated responses</li>
              <li>Recommend verifying important information through multiple sources</li>
              <li>Cannot replace professional advice (legal, medical, financial, etc.)</li>
            </ul>
          </div>

          {/* 6. Intellectual Property */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: 'var(--accent-color)',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}>
              6. Intellectual Property
            </h3>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
              Regarding intellectual property rights:
            </p>
            <ul style={{ marginLeft: '1.5rem', lineHeight: 1.6 }}>
              <li>GriotBot's technology and platform are proprietary to our company</li>
              <li>Cultural knowledge shared belongs to the broader African diaspora community</li>
              <li>Users retain rights to their input and questions</li>
              <li>Generated responses are not copyrightable but should be attributed when shared publicly</li>
            </ul>
          </div>

          {/* 7. Termination */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: 'var(--accent-color)',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}>
              7. Termination
            </h3>
            <p style={{ lineHeight: 1.6 }}>
              Either party may terminate access to GriotBot at any time. We reserve the right to suspend or terminate access for violations of these terms, while providing reasonable notice when possible.
            </p>
          </div>

          {/* 8. Governing Law */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: 'var(--accent-color)',
              fontSize: '1.3rem',
              marginBottom: '1rem',
              fontFamily: 'var(--heading-font)'
            }}>
              8. Changes to Terms
            </h3>
            <p style={{ lineHeight: 1.6 }}>
              We may update these terms periodically to reflect service improvements or legal requirements. Users will be notified of significant changes, and continued use constitutes acceptance of updated terms.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section style={{
          backgroundColor: 'var(--accent-color)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)',
            margin: '0 0 1rem 0'
          }}>
            Questions About These Terms?
          </h3>
          
          <p style={{
            marginBottom: '1.5rem',
            opacity: 0.9,
            margin: '0 0 1.5rem 0'
          }}>
            We believe in transparency and open communication. If you have questions about these terms or need clarification, we're here to help.
          </p>
          
          <a
            href="mailto:legal@griotbot.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'white',
              color: 'var(--accent-color)',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => handleCtaHover(e, true)}
            onMouseLeave={(e) => handleCtaHover(e, false)}
            onFocus={(e) => handleCtaHover(e, true)}
            onBlur={(e) => handleCtaHover(e, false)}
            aria-label="Contact us about terms and conditions"
          >
            <Mail size={20} aria-hidden="true" />
            Contact Legal Team
          </a>
        </section>

        {/* Return to Chat CTA */}
        <section style={{
          backgroundColor: 'var(--card-bg)',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid var(--input-border)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)',
            margin: '0 0 1rem 0',
            color: 'var(--text-color)'
          }}>
            Ready to Explore Your Heritage?
          </h3>
          
          <p style={{
            marginBottom: '1.5rem',
            margin: '0 0 1.5rem 0',
            color: 'var(--text-color)',
            opacity: 0.8
          }}>
            Now that you understand our terms, start your journey of cultural discovery and wisdom with GriotBot.
          </p>
          
          <a
            href="/"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => handleCtaHover(e, true)}
            onMouseLeave={(e) => handleCtaHover(e, false)}
            onFocus={(e) => handleCtaHover(e, true)}
            onBlur={(e) => handleCtaHover(e, false)}
            aria-label="Start chatting with GriotBot now"
          >
            Start Chatting with GriotBot
          </a>
        </section>

        {/* Footer Info */}
        <footer style={{
          textAlign: 'center',
          color: 'var(--text-color)',
          opacity: 0.7,
          fontSize: '0.9rem'
        }}>
          <p style={{ margin: 0 }}>
            These terms are designed to protect both our community and our mission of cultural preservation and education.
          </p>
        </footer>
      </div>
    </StandardLayout>
  );
}
