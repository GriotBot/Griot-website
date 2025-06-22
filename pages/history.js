// File: pages/history.js
import StandardLayout from '../components/layout/StandardLayout';
import { useRouter } from 'next/router';

// Helper component for the feature cards for cleaner code
const EraCard = ({ title, description, themes, visualIdea, cta, ctaAction }) => {
  return (
    <article className="era-card" onClick={ctaAction} tabIndex="0" onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && ctaAction()}>
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

export default function HistoryPage() {
  const router = useRouter();

  // Data for the history era cards, taken directly from our plan
  const eras = [
    {
      title: 'The Age of Queens and Kings',
      description: 'Journey back to the great African empires, Kush, Axum, Mali, and Songhai. Explore the foundations of philosophy, science, and art that shaped the world.',
      themes: ['Royalty', 'Innovation', 'Philosophy', 'Ancient History'],
      visualIdea: 'An abstract geometric pattern inspired by Kushite architecture or a stylized map of the major empires.',
      cta: 'Ask: "Tell me about the Kingdom of Mali."',
    },
    {
      title: 'The Great Calamity: Endurance Through the Unthinkable',
      description: 'A solemn reflection on the transatlantic slave trade, known as the Maafa. This section honors the millions of lives lost and the incredible resilience of those who survived.',
      themes: ['Resilience', 'Remembrance', 'Humanity', 'Struggle'],
      visualIdea: 'A stark, respectful image of ocean waves or a Sankofa bird symbol.',
      cta: 'Ask: "What does \'Maafa\' mean?"',
    },
    {
      title: 'The Unchained Spirit: A History of Resistance',
      description: 'From the Haitian Revolution to maroon communities and countless uprisings, discover the history of Black resistance, a testament to the unyielding fight for freedom.',
      themes: ['Freedom', 'Rebellion', 'Liberation', 'Strategy'],
      visualIdea: 'A broken chain or a stylized silhouette of a figure like Toussaint Louverture.',
      cta: 'Ask: "Tell me about the Haitian Revolution."',
    },
    {
      title: 'A False Dawn: Emancipation & Reconstruction',
      description: 'Explore the promises and betrayals of the post-emancipation era. Understand the hope of Reconstruction and the violent rise of Jim Crow that sought to crush it.',
      themes: ['Hope', 'Betrayal', 'Politics', 'Resilience'],
      visualIdea: 'A graphic of a rising sun partially obscured by clouds.',
      cta: 'Ask: "What was Reconstruction?"',
    },
     {
      title: 'The Shaping of a New World: Migration & Arts',
      description: 'Follow the journey of millions who moved from the rural South to Northern cities, sparking a cultural explosion of art, music, and literature.',
      themes: ['Culture', 'Innovation', 'Art', 'Community'],
      visualIdea: 'An art-deco-inspired design or a stylized representation of a jazz instrument.',
      cta: 'Ask: "Why was the Harlem Renaissance important?"',
    },
    {
      title: 'The March for Justice: Civil Rights & Black Power',
      description: 'Delve into the pivotal mid-20th-century struggle for equality. Learn about the key figures, legislation, and grassroots movements that changed society.',
      themes: ['Justice', 'Activism', 'Community', 'Identity'],
      visualIdea: 'A stylized graphic of a protest sign or a raised fist.',
      cta: 'Ask: "What\'s the difference between Civil Rights and Black Power?"',
    },
    {
      title: 'A Global Legacy: The Modern Diaspora',
      description: 'Explore the vibrant, modern-day impact of the African diaspora across the globe, from Afro-Latin music to Black British art to the ongoing fight for social justice.',
      themes: ['Global', 'Culture', 'Future', 'Identity'],
      visualIdea: 'A colorful, abstract world map highlighting key diaspora regions.',
      cta: 'Ask: "Tell me about Afro-futurism."',
    }
  ];

  // Function to handle the click, which will start a chat on the main page
  const startChatWithPrompt = (prompt) => {
    // We can store the prompt and redirect, so the index page can pick it up.
    localStorage.setItem('griotbot-chat-starter', prompt);
    router.push('/');
  };

  return (
    <StandardLayout
      pageType="standard"
      title="Our Journey Through Time - GriotBot History"
      description="Explore the vast, interconnected history of the African diaspora, from ancient kingdoms to contemporary movements, with GriotBot as your guide."
      currentPath="/history"
    >
      <div className="history-container">
        <header className="history-header">
          <h1>An Unbroken Thread: Our Journey Through Time</h1>
          <p>
            History is not a simple line of dates; it is a living river of stories, struggles, and triumphs that flow into the present moment. This page is not an encyclopedia but a starting point, an invitation to explore the vast, interconnected history of the African diaspora.
          </p>
          <p>
            Each era below is a door. Open one, and let GriotBot be your guide through its complex and powerful stories.
          </p>
        </header>

        <section className="eras-grid">
          {eras.map(era => (
            <EraCard 
              key={era.title}
              {...era}
              ctaAction={() => startChatWithPrompt(era.cta.replace('Ask: ', ''))}
            />
          ))}
        </section>

        <footer className="history-footer">
          <h2>Your Story is Part of This History</h2>
          <p>Every question you ask helps to weave a new thread in this tapestry. What part of our shared journey calls to you today?</p>
          <button className="final-cta-button" onClick={() => router.push('/')}>
            → Start Exploring with GriotBot
          </button>
        </footer>
      </div>

      <style jsx>{`
        .history-container {
          max-width: 900px;
          margin: 2rem auto 4rem auto;
          padding: 0 1rem;
        }

        .history-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .history-header h1 {
          font-family: var(--heading-font);
          font-size: 2.5rem;
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .history-header p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-color);
          opacity: 0.8;
          max-width: 700px;
          margin: 0 auto 1rem auto;
        }

        .eras-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .era-card {
          background-color: var(--card-bg, #ffffff);
          /* FIXED: Made border more visible */
          border: 1px solid var(--input-border, #e0e0e0);
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .era-card:hover, .era-card:focus {
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
          /* FIXED: Increased space between title and description */
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
          font-weight: 600; /* Made bolder */
          font-size: 0.9rem;
          width: 100%;
          text-align: left;
          cursor: pointer;
          padding: 0;
          /* FIXED: Styled CTA to stand out */
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: color 0.2s;
        }

        .cta-button:hover {
            color: var(--accent-hover);
        }

        .history-footer {
          text-align: center;
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid var(--input-border);
        }

        .history-footer h2 {
          font-family: var(--heading-font);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .history-footer p {
          opacity: 0.8;
          margin-bottom: 1.5rem;
        }

        .final-cta-button {
            display: inline-block;
            background-color: var(--accent-color);
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .final-cta-button:hover {
            background-color: var(--accent-hover);
            transform: translateY(-2px);
        }
      `}</style>
    </StandardLayout>
  );
}
