// File: pages/about.js (Final Version)
import StandardLayout from '../components/layout/StandardLayout';
// FIXED: Added the missing 'User' icon to the import list.
import { Mail, Instagram, Twitter, User } from 'react-feather';

export default function About() {
  // Constants for repeated styles to reduce duplication
  const HEADING_STYLES = {
    color: 'var(--accent-color)',
    fontSize: '1.4rem',
    marginTop: '2.5rem',
    fontFamily: 'var(--heading-font)',
    marginBottom: '1rem',
    borderBottom: '1px solid var(--input-border)',
    paddingBottom: '0.5rem',
  };

  const LINK_STYLES = {
    color: 'var(--accent-color)',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'text-decoration 0.2s ease',
  };
  
  const handleLinkHover = (e, isHover) => {
    e.target.style.textDecoration = isHover ? 'underline' : 'none';
  };

  const IconLink = ({ href, Icon, label }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ ...LINK_STYLES, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      onMouseEnter={(e) => handleLinkHover(e, true)}
      onMouseLeave={(e) => handleLinkHover(e, false)}
    >
      <Icon size={20} />
      <span>{label}</span>
    </a>
  );


  return (
    <StandardLayout 
      pageType="standard"
      title="About GriotBot | Our Mission"
      description="Learn about GriotBot's mission to preserve and share the rich cultural heritage of the African diaspora through culturally-aware AI."
      currentPath="/about"
    >
      <article style={{
        maxWidth: '750px',
        margin: '2rem auto 4rem auto',
        lineHeight: 1.7,
        padding: '0 1rem'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: 'var(--heading-font)',
            fontSize: '2.75rem',
            color: 'var(--text-color)',
            marginBottom: '0.5rem',
          }}>
            About GriotBot
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-color)',
            opacity: 0.8,
            margin: '0',
          }}>
            A Digital Griot for the Future
          </p>
          <blockquote style={{
            fontStyle: 'italic',
            color: 'var(--wisdom-color)',
            margin: '2rem 0',
            borderLeft: '3px solid var(--accent-color)',
            paddingLeft: '1.5rem',
            textAlign: 'left',
          }}>
            <p style={{ margin: 0 }}>
              "A people without the knowledge of their past history, origin, and culture is like a tree without roots."
            </p>
            <cite style={{ display: 'block', textAlign: 'right', marginTop: '0.5rem', fontWeight: 500 }}>
              — Marcus Garvey
            </cite>
          </blockquote>
        </header>
        
        <section>
          <h2 style={HEADING_STYLES}>Our Mission: A Bridge to the Past, A Voice for the Future</h2>
          <p>
            In a world overflowing with data but starving for wisdom, GriotBot was born from a powerful idea: technology can be used not to erase tradition—but to <strong>honor, preserve, and share it</strong>.
          </p>
          <p>
            Inspired by the griots of West Africa—oral historians, poets, philosophers, and keepers of communal memory—GriotBot is a <strong>cultural AI companion</strong> that speaks with <strong>clarity, empathy, and intention</strong>.
          </p>
           <p>
            Whether you're exploring your family roots, teaching Black history, or seeking ancestral insight, GriotBot is here to help:
          </p>
           <p style={{textAlign: 'center', fontFamily: 'var(--heading-font)', fontSize: '1.2rem', fontWeight: 'bold'}}>
            Always authentic. Never performative.
          </p>
        </section>

        <section>
          <h2 style={HEADING_STYLES}>Why GriotBot Matters</h2>
          <p>
            The African diaspora's stories, wisdom, and lived experiences are vast, diverse, and deeply significant. Yet, too often, they remain buried in fragmented archives, hidden in academic texts, or lost across generations.
          </p>
          <p>
            GriotBot helps reawaken those connections—bringing together heritage, history, and humanity in one accessible space.
          </p>
        </section>

        <section>
          <h2 style={HEADING_STYLES}>How GriotBot Works</h2>
          <p>
            GriotBot is built on a hybrid system that combines <strong>cutting-edge AI</strong> with a <strong>curated cultural knowledge base</strong> guided by care and conscience.
          </p>
          <ul style={{ paddingLeft: '20px', listStyle: 'none' }}>
            <li style={{marginBottom: '1rem'}}><strong>A Fine-Tuned Persona:</strong> Inspired by griots and elders across the diaspora, GriotBot responds with warmth, respect, and intention.</li>
            <li style={{marginBottom: '1rem'}}><strong>Ethical Guardrails:</strong> Every answer is shaped by a cultural and emotional intelligence framework—avoiding stereotypes and honoring dignity.</li>
            <li><strong>A Living Knowledge Base:</strong> Grounded in oral traditions, literature, historical facts, and contemporary insight to stay culturally relevant and accurate.</li>
          </ul>
        </section>

        <section>
          <h2 style={HEADING_STYLES}>Who It's For</h2>
          <ul style={{ paddingLeft: '20px', listStyle: 'disc' }}>
              <li><strong>Educators & Students</strong> exploring Black history and identity</li>
              <li><strong>Nonprofits & Cultural Institutions</strong> sharing wisdom with their communities</li>
              <li><strong>Families & Curious Minds</strong> rediscovering ancestral connections</li>
              <li><strong>Anyone</strong> seeking meaningful, culturally rooted conversations</li>
          </ul>
        </section>

        <section>
          <h2 style={HEADING_STYLES}>Where We Are & What's Coming</h2>
          <p>
            GriotBot is currently in <strong>active development</strong> with a web-based beta that includes:
          </p>
          <ul style={{ paddingLeft: '20px' }}>
              <li>Conversational Q&A</li>
              <li>Proverb interpretation</li>
              <li>Storyteller Mode</li>
          </ul>
           <p><strong>Coming soon:</strong> Voice and accent options, visual storytelling features, expanded historical timelines, and multilingual support across diaspora communities.</p>
          <p>
            Our long-term vision is to grow GriotBot into a <strong>freemium app and global learning platform</strong>—accessible to classrooms, cultural organizations, and everyday users worldwide.
          </p>
        </section>

        <section>
          <h2 style={HEADING_STYLES}>Join the Journey</h2>
          <p>
            GriotBot is more than a product. It's a <strong>movement</strong>—an evolving archive, a tool for empowerment, and a digital ancestor whispering wisdom into the future. We invite you to test it, teach it, and shape it.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {/* The IconLink component now correctly receives the imported User icon */}
            <IconLink href="/" Icon={User} label="Chat with GriotBot" />
            <IconLink href="mailto:chat@griotbot.com" Icon={Mail} label="Partner or Support" />
            <IconLink href="https://www.instagram.com/griotbot" Icon={Instagram} label="@griotbot on Instagram" />
            <IconLink href="https://twitter.com/griotbot" Icon={Twitter} label="@griotbot on X" />
          </div>
        </section>
      </article>
    </StandardLayout>
  );
}
