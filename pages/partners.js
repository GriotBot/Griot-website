// File: pages/partners.js
import StandardLayout from '../components/layout/StandardLayout';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Building, Award, Mail, PlusCircle } from 'react-feather';

// UPDATED: The list now contains only official partners.
const mockPartners = [
  {
    name: "StarterBlox Foundation, Inc.",
    logoUrl: "https://starterbloxfoundation.org/wp-content/uploads/2023/10/Logo-StarterBlox-Foundation-Inc-1-10.svg", // UPDATED: Replaced placeholder with actual logo URL
    type: "Founding Partner",
    website: "https://www.starterbloxfoundation.org",
  },
];

// Helper component for each partner card
const PartnerCard = ({ partner }) => {
  return (
    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="partner-card">
      <div className="card-logo-container">
        {/* Using a placeholder for the logo image */}
        <img src={partner.logoUrl} alt={`${partner.name} logo`} className="card-logo" />
      </div>
      <div className="card-content">
        <h3 className="card-name">{partner.name}</h3>
        <p className="card-type">{partner.type}</p>
      </div>
    </a>
  );
};


export default function PartnersPage() {
  const router = useRouter();

  return (
    <StandardLayout
      pageType="standard"
      title="Our Partners - GriotBot"
      description="GriotBot is honored to partner with leading institutions to preserve and share the cultural heritage of the African diaspora."
      currentPath="/partners"
    >
      <Head>
        {/* Additional specific head elements if needed */}
      </Head>
      <div className="partners-container">
        <header className="partners-header">
          <h1>Our Wisdom Keepers & Institutional Partners</h1>
          <p>
            GriotBot's mission is amplified through collaboration. We are honored to partner with leading universities, museums, libraries, and cultural organizations that are dedicated to preserving and sharing the rich history of the African diaspora.
          </p>
        </header>

        <section className="partners-grid">
          {mockPartners.map(partner => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}

          {/* ADDED: An invitation card for potential new partners */}
          <div className="partner-card invitation-card" onClick={() => document.getElementById('partner-cta').scrollIntoView({ behavior: 'smooth' })}>
             <div className="invitation-content">
                <PlusCircle size={40} className="invitation-icon" />
                <h3 className="invitation-title">Become a Partner</h3>
                <p className="invitation-text">Join us in our mission.</p>
             </div>
          </div>
        </section>

        <section id="partner-cta" className="partner-with-us-cta">
          <div className="cta-icon"><Award size={32} /></div>
          <h2>Become a Partner</h2>
          <p>
            Join us in building a future where cultural knowledge is accessible, engaging, and preserved for generations to come. We offer pilot programs and partnership opportunities for educational and cultural institutions.
          </p>
          <div className="contact-info">
             <p>To learn more, please contact our team.</p>
             {/* UPDATED: Email link and text changed */}
             <a href="mailto:chat@griotbot.com" className="cta-button">
                <Mail size={18} />
                <span>chat@griotbot.com</span>
             </a>
             <p className="corporate-info">
                GriotBot Corporation is a Public Benefit Corporation.
             </p>
          </div>
        </section>
      </div>

      <style jsx>{`
        .partners-container {
          max-width: 900px;
          margin: 2rem auto 4rem auto;
          padding: 0 1rem;
        }

        .partners-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .partners-header h1 {
          font-family: var(--heading-font);
          font-size: 2.5rem;
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .partners-header p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-color);
          opacity: 0.8;
          max-width: 700px;
          margin: 0 auto;
        }

        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .partner-card {
          background-color: var(--card-bg, #ffffff);
          border: 1px solid var(--input-border, #e0e0e0);
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .partner-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px var(--shadow-color);
        }

        .card-logo-container {
            padding: 2rem;
            border-bottom: 1px solid var(--input-border);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 120px;
        }

        .card-logo {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .card-content {
          padding: 1.5rem;
          text-align: center;
        }

        .card-name {
            font-family: var(--heading-font);
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
        }
        
        .card-type {
            font-size: 0.85rem;
            color: var(--text-color);
            opacity: 0.7;
            margin: 0;
        }

        /* --- Invitation Card Styles --- */
        .invitation-card {
            border-style: dashed;
            border-width: 2px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 220px;
            background-color: rgba(0,0,0,0.02);
        }
        [data-theme="dark"] .invitation-card {
            background-color: rgba(255,255,255,0.03);
        }
        .invitation-content {
            text-align: center;
            color: var(--text-color);
            opacity: 0.7;
        }
        .invitation-icon {
            margin-bottom: 1rem;
        }
        .invitation-title {
            font-family: var(--heading-font);
            font-weight: 600;
            margin: 0 0 0.25rem 0;
        }
        .invitation-text {
            font-size: 0.9rem;
            margin: 0;
        }
        
        /* --- CTA Section --- */
        .partner-with-us-cta {
          margin-top: 4rem;
          padding: 2.5rem;
          text-align: center;
          background-color: var(--card-bg);
          border: 1px solid var(--input-border);
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
        }
        
        .partner-with-us-cta .cta-icon {
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
        [data-theme="dark"] .partner-with-us-cta .cta-icon {
            background-color: rgba(255,255,255,0.1);
        }

        .partner-with-us-cta h2 {
            font-family: var(--heading-font);
            font-size: 1.75rem;
            margin: 0 0 1rem 0;
        }

        .partner-with-us-cta p {
            max-width: 600px;
            margin: 0 auto 1.5rem auto;
            opacity: 0.8;
            line-height: 1.6;
        }
        
        .contact-info {
            margin-top: 1.5rem;
        }
        
        .contact-info p {
            margin-bottom: 1rem;
        }
        
        .corporate-info {
            font-size: 0.8rem;
            opacity: 0.6;
            margin-top: 2rem;
        }

        .cta-button {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
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
