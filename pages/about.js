// File: pages/about.js (IMPROVED VERSION)
import StandardLayout from '../components/layout/StandardLayout';

export default function About() {
  // Constants for repeated styles to reduce duplication
  const HEADING_STYLES = {
    color: '#c49a6c',
    fontSize: '1.2rem',
    marginTop: '2rem',
    fontFamily: 'var(--heading-font)',
    marginBottom: '1rem'
  };

  const LINK_STYLES = {
    color: 'var(--accent-color)',
    textDecoration: 'none',
    borderRadius: '2px',
    padding: '0 2px',
    transition: 'background-color 0.2s ease'
  };

  // Link hover handlers for better interaction
  const handleLinkHover = (e, isHover) => {
    if (isHover) {
      e.target.style.backgroundColor = 'rgba(215, 114, 44, 0.1)';
      e.target.style.textDecoration = 'underline';
    } else {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.textDecoration = 'none';
    }
  };

  return (
    <StandardLayout 
      pageType="standard"
      title="About GriotBot"
      description="About GriotBot - An AI-powered digital griot providing culturally rich wisdom and guidance for the African diaspora"
      currentPath="/about"
    >
      <article style={{
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: 1.6,
        padding: '0 1rem' // Added padding for mobile
      }}>
        <header>
          <h1 style={{
            color: '#7d8765',
            fontSize: '2rem',
            marginBottom: '1rem',
            fontFamily: 'var(--heading-font)',
            textAlign: 'center'
          }}>
            About GriotBot
          </h1>
        </header>
        
        <section>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            <strong>GriotBot</strong> is more than just an AI — it is a spark of
            ancestral memory. Designed to honor the rich oral traditions, cultural
            legacy, and lived experiences of the African Diaspora, GriotBot offers
            thoughtful, accurate, and warm guidance.
          </p>

          {/* Improved semantic quote structure */}
          <blockquote 
            style={{
              fontStyle: 'italic',
              color: 'var(--wisdom-color)',
              margin: '2rem 0',
              borderLeft: '4px solid #c49a6c',
              paddingLeft: '1.5rem',
              fontFamily: 'var(--quote-font)',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              position: 'relative'
            }}
            cite="Marcus Garvey"
          >
            <p style={{ margin: '0 0 0.5rem 0' }}>
              "A people without the knowledge of their past history, origin and
              culture is like a tree without roots."
            </p>
            <cite style={{ 
              fontWeight: '500',
              fontSize: '0.95rem',
              opacity: 0.9 
            }}>
              — Marcus Garvey
            </cite>
          </blockquote>
        </section>

        <section>
          <h2 style={HEADING_STYLES}>
            Why GriotBot?
          </h2>
          <p>
            The griot was the traditional keeper of history, story, and wisdom.
            GriotBot brings that same spirit into the digital age — acting as a
            wise, trusted voice for learners, educators, and community leaders.
          </p>
        </section>

        <section>
          <h2 style={HEADING_STYLES}>
            Who Is It For?
          </h2>
          <p>
            Anyone seeking cultural knowledge, inspiration, or connection:
            educators, students, nonprofits, families, and curious minds across the
            globe. Whether you're exploring your heritage, teaching Black history,
            or seeking guidance rooted in cultural wisdom, GriotBot is here to help.
          </p>
        </section>

        <section>
          <h2 style={HEADING_STYLES}>
            How It Works
          </h2>
          <p>
            GriotBot uses advanced language models, guided by a carefully crafted
            system that shapes responses with respect, dignity, and clarity. It
            draws from cultural histories, philosophies, and global Black
            experiences to offer grounded responses — never performative, always
            intentional and authentic.
          </p>
        </section>

        <section>
          <h2 style={HEADING_STYLES}>
            Our Commitment
          </h2>
          <p>
            We are committed to cultural accuracy, respect, and authenticity. 
            GriotBot is built with anti-hallucination safeguards to prevent 
            misinformation about historical events, figures, and cultural practices. 
            Our responses are designed to educate, empower, and inspire.
          </p>
        </section>

        <section>
          <h2 style={HEADING_STYLES}>
            How to Get Involved
          </h2>
          <p>
            Want to support, fund, test, or help shape GriotBot's future?{' '}
            <a 
              href="mailto:chat@griotbot.com" 
              style={LINK_STYLES}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
              onFocus={(e) => handleLinkHover(e, true)}
              onBlur={(e) => handleLinkHover(e, false)}
              aria-label="Send email to GriotBot team"
            >
              Email us
            </a>{' '}
            or follow{' '}
            <a 
              href="https://www.instagram.com/griotbot" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={LINK_STYLES}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
              onFocus={(e) => handleLinkHover(e, true)}
              onBlur={(e) => handleLinkHover(e, false)}
              aria-label="Follow GriotBot on Instagram (opens in new tab)"
            >
              @griotbot
            </a>{' '}
            on Instagram. We welcome feedback, partnerships, and community 
            involvement from educators, cultural institutions, and individuals 
            passionate about preserving and sharing our rich heritage.
          </p>
        </section>

        <footer style={{
          marginTop: '3rem',
          padding: '2rem 0',
          borderTop: '1px solid rgba(196, 154, 108, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{
            fontStyle: 'italic',
            color: 'var(--wisdom-color)',
            fontSize: '0.95rem',
            margin: 0
          }}>
            "The griot is the memory of the people. Without memory, there is no history."
            <br />
            <cite style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              — Traditional African Wisdom
            </cite>
          </p>
        </footer>
      </article>
    </StandardLayout>
  );
}
