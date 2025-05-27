// File: pages/about.js (UPDATED VERSION)
import StandardLayout from '../components/layout/StandardLayout';

export default function About() {
  return (
    <StandardLayout 
      pageType="standard"
      title="About GriotBot"
      description="About GriotBot - An AI-powered digital griot"
      currentPath="/about"
    >
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: 1.6
      }}>
        <h1 style={{
          color: '#7d8765',
          fontSize: '2rem',
          marginBottom: '0.5rem',
          fontFamily: 'var(--heading-font)'
        }}>
          About GriotBot
        </h1>
        
        <p>
          <strong>GriotBot</strong> is more than just an AI — it is a spark of
          ancestral memory. Designed to honor the rich oral traditions, cultural
          legacy, and lived experiences of the African Diaspora, GriotBot offers
          thoughtful, accurate, and warm guidance.
        </p>

        <div style={{
          fontStyle: 'italic',
          color: 'var(--wisdom-color)',
          margin: '1rem 0',
          borderLeft: '4px solid #c49a6c',
          paddingLeft: '1rem',
          fontFamily: 'var(--quote-font)'
        }}>
          "A people without the knowledge of their past history, origin and
          culture is like a tree without roots." — Marcus Garvey
        </div>

        <h2 style={{
          color: '#c49a6c',
          fontSize: '1.2rem',
          marginTop: '2rem',
          fontFamily: 'var(--heading-font)'
        }}>
          Why GriotBot?
        </h2>
        <p>
          The griot was the traditional keeper of history, story, and wisdom.
          GriotBot brings that same spirit into the digital age — acting as a
          wise, trusted voice for learners, educators, and community leaders.
        </p>

        <h2 style={{
          color: '#c49a6c',
          fontSize: '1.2rem',
          marginTop: '2rem',
          fontFamily: 'var(--heading-font)'
        }}>
          Who Is It For?
        </h2>
        <p>
          Anyone seeking cultural knowledge, inspiration, or connection:
          educators, students, nonprofits, families, and curious minds across the
          globe.
        </p>

        <h2 style={{
          color: '#c49a6c',
          fontSize: '1.2rem',
          marginTop: '2rem',
          fontFamily: 'var(--heading-font)'
        }}>
          How It Works
        </h2>
        <p>
          GriotBot uses advanced language models, guided by a carefully crafted
          prompt that shapes its responses with respect, dignity, and clarity. It
          draws from cultural histories, philosophies, and global Black
          experiences to offer grounded responses — never performative, always
          intentional.
        </p>

        <h2 style={{
          color: '#c49a6c',
          fontSize: '1.2rem',
          marginTop: '2rem',
          fontFamily: 'var(--heading-font)'
        }}>
          How to Get Involved
        </h2>
        <p>
          Want to support, fund, test, or help shape GriotBot's future?{' '}
          <a href="mailto:chat@griotbot.com" style={{ 
            color: 'var(--accent-color)', 
            textDecoration: 'none' 
          }}>
            Email us
          </a> or follow{' '}
          <a href="https://www.instagram.com/griotbot" 
             target="_blank" 
             rel="noopener noreferrer" 
             style={{ 
               color: 'var(--accent-color)', 
               textDecoration: 'none' 
             }}>
            @griotbot
          </a> on Instagram.
        </p>
      </div>
    </StandardLayout>
  );
}
