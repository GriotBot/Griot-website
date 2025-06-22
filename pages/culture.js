// File: pages/culture.js
import StandardLayout from '../components/layout/StandardLayout';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Helper component for the feature cards for cleaner code
const CultureCard = ({ title, description, themes, cta, ctaAction }) => {
  return (
    <article className="culture-card" onClick={ctaAction} tabIndex="0" onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && ctaAction()}>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-themes">
          {themes.map(theme => <span key={theme} className="theme-tag">{theme}</span>)}
        </div>
      </div>
      <div className="card-cta">
        <button className="cta-button">
          <span>{cta.replace('Ask: ', '')}</span>
          <span>→</span>
        </button>
      </div>
    </article>
  );
};

export default function CulturePage() {
  const router = useRouter();

  // Data for the culture pillar cards, taken directly from our plan
  const pillars = [
    {
      title: 'The Rhythm of Resilience: Music & the Movement',
      description: 'From the spirituals born in the fields to the birth of Blues, Jazz, Reggae, and Hip-Hop, explore how our music has been the world\'s soundtrack of struggle, joy, and liberation.',
      themes: ['Music', 'History', 'Innovation', 'Resilience', 'Joy'],
      cta: 'Ask: "Tell me about the birth of Hip-Hop"',
    },
    {
      title: 'Soul on a Plate: Food & Fellowship',
      description: 'Discover the history of "soul food," the spice trade\'s impact on Caribbean cuisine, and the sacred role of food in African traditions. Learn how our recipes carry the story of our journey.',
      themes: ['Food', 'Community', 'Tradition', 'History', 'Nourishment'],
      cta: 'Ask: "What is the origin of jerk seasoning?"',
    },
    {
      title: 'The Language of Liberation: Our Words, Our Worlds',
      description: 'Explore the power of diaspora literature, from the Harlem Renaissance to post-colonial writers. Delve into the nuances of creoles, patois, and AAVE.',
      themes: ['Language', 'Literature', 'Identity', 'Resistance'],
      cta: 'Ask: "Who was Zora Neale Hurston?"',
    },
    {
      title: 'Visual Storytelling: Seeing Our Soul',
      description: 'From the intricate patterns of Kente cloth and the sculpture of Benin to the vibrant canvases of modern artists, see how our visual arts have documented our history and imagined our future.',
      themes: ['Art', 'Visuals', 'Storytelling', 'Tradition', 'Afrofuturism'],
      cta: 'Ask: "Tell me about the Benin Bronzes"',
    },
    {
      title: 'The Sacred & The Spirit: Faith, Ritual & Spirituality',
      description: 'Journey through the diverse spiritual landscape of the diaspora, from traditional African religions like Yoruba and Vodun to the central role of the Black Church in the fight for civil rights.',
      themes: ['Spirituality', 'Faith', 'Community', 'Ritual', 'History'],
      cta: 'Ask: "What are the core beliefs of the Yoruba religion?"',
    }
  ];

  // Function to handle the click, which will start a chat on the main page
  const startChatWithPrompt = (prompt) => {
    router.push({
      pathname: '/',
      query: { prompt: prompt },
    });
  };

  return (
    <StandardLayout
      pageType="standard"
      title="Our Cultural Tapestry - GriotBot"
      description="Explore the pillars of African diaspora culture, from music and food to art and spirituality, with GriotBot as your guide."
      currentPath="/culture"
    >
      <Head>
        {/* Additional specific head elements if needed */}
      </Head>
      <div className="culture-container">
        <header className="culture-header">
          <h1>The Soul of a People: Our Cultural Tapestry</h1>
          <p>
            Culture is the rhythm that moves us, the flavors that nourish us, and the colors that express our soul. It is the language of our shared experience, passed down not only in museums, but at the dinner table, in the beat of a drum, and in the heart of a spiritual gathering.
          </p>
          <p>
            This page is an invitation to explore the pillars of our diaspora's culture. Each section is a gateway to a deeper conversation. Let GriotBot share the stories behind the art, the history within the rhythm, and the wisdom in the traditions.
          </p>
        </header>

        <section className="pillars-grid">
          {pillars.map(pillar => (
            <CultureCard 
              key={pillar.title}
              {...pillar}
              ctaAction={() => startChatWithPrompt(pillar.cta.replace('Ask: ', ''))}
            />
          ))}
        </section>

        <footer className="culture-footer">
          <h2>Our Culture is a Conversation</h2>
          <p>These pillars are not separate, they are woven together. The history of our food is in our music, and the soul of our art is in our language. You can explore a card, or simply ask GriotBot: "Tell me something about our art and food traditions.”</p>
          <button className="final-cta-button" onClick={() => router.push('/')}>
            What part of our culture is calling to you today? Let GriotBot guide you on the journey. → Start a Conversation
          </button>
        </footer>
      </div>

      <style jsx>{`
        .culture-container {
          max-width: 900px;
          margin: 2rem auto 4rem auto;
          padding: 0 1rem;
        }

        .culture-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .culture-header h1 {
          font-family: var(--heading-font);
          font-size: 2.5rem;
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .culture-header p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-color);
          opacity: 0.8;
          max-width: 700px;
          margin: 0 auto 1rem auto;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .culture-card {
          background-color: var(--card-bg, #ffffff);
          border: 1px solid var(--input-border, #e0e0e0);
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .culture-card:hover, .culture-card:focus {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px var(--shadow-color);
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }

        .card-content {
          padding: 1.5rem;
          flex-grow: 1;
        }

        .card-title {
          font-family: var(--heading-font);
          font-size: 1.25rem;
          color: var(--accent-color);
          margin: 0 0 1.25rem 0;
        }

        .card-description {
          font-size: 0.95rem;
          line-height: 1.6;
          opacity: 0.9;
          margin: 0 0 1rem 0;
        }

        .card-themes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: auto;
        }

        .theme-tag {
          background-color: rgba(0,0,0,0.05);
          color: var(--text-color);
          opacity: 0.8;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
        }

        [data-theme="dark"] .theme-tag {
           background-color: rgba(255,255,255,0.1);
        }

        .card-cta {
          border-top: 1px solid var(--input-border);
          padding: 0.75rem 1.5rem;
          background-color: rgba(0,0,0,0.02);
          margin-top: 1rem;
        }
        
        [data-theme="dark"] .card-cta {
           background-color: rgba(255,255,255,0.05);
        }

        .cta-button {
          background: none;
          border: none;
          color: var(--accent-color);
          font-weight: 600; 
          font-size: 0.9rem;
          width: 100%;
          text-align: left;
          cursor: pointer;
          padding: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: color 0.2s;
        }

        .cta-button:hover {
            color: var(--accent-hover);
        }

        .culture-footer {
          text-align: center;
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid var(--input-border);
        }

        .culture-footer h2 {
          font-family: var(--heading-font);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .culture-footer p {
          opacity: 0.8;
          margin-bottom: 1.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .final-cta-button {
            display: inline-block;
            background: none;
            color: var(--accent-color);
            padding: 0.75rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            border: 1px solid var(--accent-color);
            cursor: pointer;
            transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
        }

        .final-cta-button:hover {
            background-color: var(--accent-color);
            color: white;
            transform: translateY(-2px);
        }
      `}</style>
    </StandardLayout>
  );
}
