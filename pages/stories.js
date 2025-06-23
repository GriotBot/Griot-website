// File: pages/stories.js
import StandardLayout from '../components/layout/StandardLayout';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Book, Edit, MessageCircle } from 'react-feather';

// UPDATED: Replaced specific testimonials with clearly labeled samples.
const sampleStories = [
  {
    id: 1,
    title: "Sample Story: A Personal Discovery",
    author: "User from the Community",
    isSample: true,
    snippet: "This is a sample of how a user story about personal discovery could look. Here, a user might share how GriotBot helped them connect with a piece of their family's history or understand a cultural tradition more deeply.",
    tags: ["Sample", "Identity", "Wisdom"],
    date: "June 22, 2025",
  },
  {
    id: 2,
    title: "Sample Story: An Educational Insight",
    author: "Educator Showcase",
    isSample: true,
    snippet: "This space can feature how an educator used GriotBot in their classroom. For example, a teacher might describe how a story about the Harlem Renaissance engaged their students in a new and exciting way.",
    tags: ["Sample", "Education", "History"],
    date: "June 22, 2025",
  },
];

// Helper component for each story card
const StoryCard = ({ story }) => {
  const router = useRouter();
  return (
    <article className="story-card">
      <div className="card-header">
        <div className="card-icon"><Book size={24} /></div>
        <div className="card-header-text">
            <h3 className="card-title">{story.title}</h3>
            <p className="card-author">by {story.author} on {story.date}</p>
        </div>
      </div>
      <div className="card-content">
        <p className="card-snippet">"{story.snippet}"</p>
      </div>
      <div className="card-footer">
        <div className="card-tags">
          {story.tags.map(tag => <span key={tag} className={`tag ${story.isSample ? 'sample-tag' : ''}`}>{tag}</span>)}
        </div>
        <button className="read-more-btn" onClick={() => alert('Full story and comment features coming soon!')}>
          Read More & Comment →
        </button>
      </div>
    </article>
  );
};


export default function StoriesPage() {
  const router = useRouter();

  return (
    <StandardLayout
      pageType="standard"
      title="Community Stories - GriotBot"
      description="Read stories and testimonials from the GriotBot community as we explore our shared heritage together."
      currentPath="/stories"
    >
      <Head>
        {/* Additional specific head elements if needed */}
      </Head>
      <div className="stories-container">
        <header className="stories-header">
          <h1>Voices from the Village</h1>
          <p>
            Here, we share the stories, insights, and experiences of the GriotBot community. Each entry is a testament to a journey of discovery and a connection to our shared cultural tapestry.
          </p>
        </header>

        <section className="stories-list">
          {sampleStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </section>

        <section className="share-your-story-cta">
          <div className="cta-icon"><Edit size={32} /></div>
          <h2>Share Your Own Story</h2>
          <p>The ability for registered users to post stories and comments is coming soon. This will be a space for us to learn from each other and build our collective memory. Sign up to be notified when this feature is live.</p>
          <button className="cta-button" onClick={() => router.push('/comingsoon')}>
            Get Notified
          </button>
        </section>
      </div>

      <style jsx>{`
        .stories-container {
          max-width: 800px;
          margin: 2rem auto 4rem auto;
          padding: 0 1rem;
        }

        .stories-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .stories-header h1 {
          font-family: var(--heading-font);
          font-size: 2.5rem;
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .stories-header p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-color);
          opacity: 0.8;
          max-width: 600px;
          margin: 0 auto;
        }

        .stories-list {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .story-card {
          background-color: var(--card-bg, #ffffff);
          border: 1px solid var(--input-border, #e0e0e0);
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
        }

        .card-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem;
            border-bottom: 1px solid var(--input-border);
        }
        
        .card-icon {
            color: var(--accent-color);
            background-color: rgba(0,0,0,0.03);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        [data-theme="dark"] .card-icon {
            background-color: rgba(255,255,255,0.1);
        }

        .card-title {
            font-family: var(--heading-font);
            font-size: 1.25rem;
            color: var(--text-color);
            margin: 0 0 0.25rem 0;
        }
        
        .card-author {
            font-size: 0.85rem;
            color: var(--text-color);
            opacity: 0.7;
            margin: 0;
        }

        .card-content {
            padding: 1.5rem;
        }

        .card-snippet {
            font-style: italic;
            color: var(--text-color);
            opacity: 0.9;
            line-height: 1.7;
            margin: 0;
            border-left: 3px solid var(--accent-color);
            padding-left: 1rem;
        }
        
        .card-footer {
            padding: 1rem 1.5rem;
            border-top: 1px solid var(--input-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(0,0,0,0.02);
        }

        [data-theme="dark"] .card-footer {
           background-color: rgba(255,255,255,0.03);
        }
        
        .card-tags {
            display: flex;
            gap: 0.5rem;
        }

        .tag {
            font-size: 0.75rem;
            background-color: rgba(0,0,0,0.08);
            padding: 0.25rem 0.6rem;
            border-radius: 12px;
            opacity: 0.8;
        }
        [data-theme="dark"] .tag {
            background-color: rgba(255,255,255,0.15);
        }
        
        .sample-tag {
            background-color: var(--accent-color) !important;
            color: white !important;
            opacity: 1;
            font-weight: 500;
        }

        .read-more-btn {
            background: none;
            border: none;
            color: var(--accent-color);
            font-weight: 600;
            cursor: pointer;
            font-size: 0.9rem;
        }

        .share-your-story-cta {
          margin-top: 4rem;
          padding: 2rem;
          text-align: center;
          background-color: var(--card-bg);
          border: 1px solid var(--input-border);
          border-radius: 16px;
        }
        
        .share-your-story-cta .cta-icon {
            color: var(--accent-color);
            background-color: rgba(0,0,0,0.03);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
        }
        [data-theme="dark"] .share-your-story-cta .cta-icon {
            background-color: rgba(255,255,255,0.1);
        }

        .share-your-story-cta h2 {
            font-family: var(--heading-font);
            font-size: 1.5rem;
            margin: 0 0 1rem 0;
        }

        .share-your-story-cta p {
            max-width: 500px;
            margin: 0 auto 1.5rem auto;
            opacity: 0.8;
            line-height: 1.6;
        }

        .cta-button {
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

        .cta-button:hover {
            background-color: var(--accent-hover);
            transform: translateY(-2px);
        }
      `}</style>
    </StandardLayout>
  );
}
