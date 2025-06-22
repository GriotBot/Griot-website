// File: pages/community.js
import StandardLayout from '../components/layout/StandardLayout';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Users, BookOpen, Heart, MessageSquare } from 'react-feather'; // Icons for cards

// Helper component for the feature cards for cleaner code
const CommunityCard = ({ title, description, Icon, ctaLabel, ctaAction }) => {
  return (
    <article className="community-card" onClick={ctaAction} tabIndex="0" onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && ctaAction()}>
      <div className="card-icon">
        <Icon size={32} />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
      <div className="card-cta">
        <button className="cta-button">
          <span>{ctaLabel}</span>
          <span>→</span>
        </button>
      </div>
    </article>
  );
};

export default function CommunityPage() {
  const router = useRouter();

  // Data for the community pillar cards
  const pillars = [
    {
      title: 'Voices from the Village',
      description: 'Read powerful testimonials and see how users are connecting with their heritage and finding inspiration with GriotBot.',
      Icon: Users,
      ctaLabel: 'See Community Stories',
      ctaAction: () => startChatWithPrompt("Show me how others are using GriotBot"),
    },
    {
      title: 'Our Institutional Partners',
      description: 'We are honored to partner with leading museums, universities, and cultural centers to preserve and share our shared history.',
      Icon: BookOpen,
      ctaLabel: 'Meet Our Partners',
      ctaAction: () => startChatWithPrompt("Tell me about GriotBot's partners"),
    },
    {
      title: 'Become a Part of the Story',
      description: 'GriotBot is shaped by its community. Whether you are an educator, a potential partner, or a user with feedback, you can help us grow.',
      Icon: Heart,
      ctaLabel: 'Provide Feedback or Partner',
      ctaAction: () => router.push('/feedback'), // Links directly to the feedback page
    },
    {
      title: 'The Digital Drum',
      description: 'The story of GriotBot is unfolding every day. Follow us on our social channels for daily proverbs, featured stories, and updates.',
      Icon: MessageSquare,
      ctaLabel: 'Follow @griotbot on Social',
      ctaAction: () => window.open('https://www.instagram.com/griotbot', '_blank'),
    }
  ];

  const startChatWithPrompt = (prompt) => {
    router.push({
      pathname: '/',
      query: { prompt: prompt },
    });
  };

  return (
    <StandardLayout
      pageType="standard"
      title="Our Community & Connection - GriotBot"
      description="GriotBot is a gathering place for users, partners, and anyone passionate about preserving the cultural heritage of the African diaspora."
      currentPath="/community"
    >
      <Head>
        {/* Additional specific head elements if needed */}
      </Head>
      <div className="community-container">
        <header className="community-header">
          <h1>We Are the Village: Our Community & Connection</h1>
          <p>
            A single voice can tell a story, but a chorus of voices can change the world. GriotBot is not just a technology; it is a gathering place—a digital fire around which our community shares its wisdom, its history, and its dreams. Our strength lies not in code, but in connection.
          </p>
          <p>
            This page is dedicated to the village that builds, sustains, and gives life to GriotBot: our users, our partners, and every individual who shares in our mission.
          </p>
        </header>

        <section className="pillars-grid">
          {pillars.map(pillar => (
            <CommunityCard 
              key={pillar.title}
              {...pillar}
            />
          ))}
        </section>

        <footer className="community-footer">
          <h2>Our Story is Written Together</h2>
          <p>Every question asked, every story shared, every voice heard—we are co-creating something greater together.</p>
          <button className="final-cta-button" onClick={() => router.push('/')}>
             Start a Conversation and Add Your Voice →
          </button>
        </footer>
      </div>

      <style jsx>{`
        .community-container {
          max-width: 900px;
          margin: 2rem auto 4rem auto;
          padding: 0 1rem;
        }

        .community-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .community-header h1 {
          font-family: var(--heading-font);
          font-size: 2.5rem;
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .community-header p {
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

        .community-card {
          background-color: var(--card-bg, #ffffff);
          border: 1px solid var(--input-border, #e0e0e0);
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .community-card:hover, .community-card:focus {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px var(--shadow-color);
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }

        .card-icon {
            color: var(--accent-color);
            padding: 1.5rem 1.5rem 0 1.5rem;
        }

        .card-content {
          padding: 0 1.5rem 1.5rem 1.5rem;
          flex-grow: 1;
        }

        .card-title {
          font-family: var(--heading-font);
          font-size: 1.25rem;
          color: var(--text-color);
          margin: 0 0 0.75rem 0;
        }

        .card-description {
          font-size: 0.95rem;
          line-height: 1.6;
          opacity: 0.9;
          margin: 0;
        }
        
        .card-cta {
          border-top: 1px solid var(--input-border);
          padding: 0.75rem 1.5rem;
          background-color: rgba(0,0,0,0.02);
          margin-top: auto;
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

        .community-footer {
          text-align: center;
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid var(--input-border);
        }

        .community-footer h2 {
          font-family: var(--heading-font);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .community-footer p {
          opacity: 0.8;
          margin-bottom: 1.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
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
