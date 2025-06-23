// File: pages/privacy.js (Final Version)
import StandardLayout from '../components/layout/StandardLayout';
import Link from 'next/link';
import Head from 'next/head';

export default function PrivacyPage() {
  
  // Reusable component for consistent section styling
  const Section = ({ title, children }) => (
    <section className="legal-section">
      <h2 className="section-heading">{title}</h2>
      <div className="section-content">{children}</div>
    </section>
  );

  return (
    <StandardLayout
      pageType="standard"
      title="Privacy Policy - GriotBot"
      description="Learn how GriotBot collects, uses, and protects your information. We are committed to privacy and cultural data sovereignty."
      currentPath="/privacy"
    >
      <Head>
        {/* Additional specific head elements if needed */}
      </Head>
      <article className="legal-container">
        <header className="legal-header">
          <h1>Privacy Policy</h1>
          <p>Last Updated: June 22, 2025</p>
        </header>
        
        <p className="intro">
          GriotBot Corporation ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services (collectively, the "Service").
        </p>

        <Section title="1. Information We Collect">
            <p>We collect information to provide and improve our Service.</p>
            <ul className="styled-list">
                <li><strong>Data Controller:</strong> GriotBot Corporation is the data controller of your information. We operate in the United States, and by using our Service, you consent to the processing of your data in the United States and other locations where our partners operate.</li>
                <li><strong>Conversation Data:</strong> To improve our service and maintain context, we may temporarily process the last few turns of your conversation. This data is not stored long-term.</li>
                <li><strong>Feedback and Correspondence:</strong> When you provide feedback or contact us, we collect the information you provide, such as your email address and the content of your message. We use Formspree, a third-party service, to manage our forms; their privacy policy may also apply.</li>
                <li><strong>Usage Data (Analytics):</strong> We use Vercel Analytics to collect anonymous information about how our Service is used. This data is aggregated and does not personally identify you.</li>
                <li><strong>Cookies and Similar Technologies:</strong> While we do not use cookies for advertising, our analytics and third-party services may use them to help us understand website traffic and usage patterns.</li>
                <li><strong>Local Storage:</strong> We use your browser's `localStorage` to remember preferences like your theme choice and conversation history for your current session. This data is stored only on your device.</li>
            </ul>
        </Section>
        
        <Section title="2. How We Use Your Information">
             <p>We use the information we collect for the following purposes:</p>
             <ul className="styled-list">
                <li>To provide and maintain the Service.</li>
                <li>To improve the quality and cultural accuracy of our AI's responses.</li>
                <li>To communicate with you in response to your feedback and inquiries.</li>
            </ul>
        </Section>

        <Section title="3. How We Share Your Information">
             <p>We do not sell your personal information. We may share information under these limited circumstances:</p>
             <ul className="styled-list">
                <li><strong>With Service Providers & AI Models:</strong> We use OpenRouter to process your prompts. Your prompts and outputs may be processed by OpenRouter or its underlying model providers. We encourage you to review their privacy policies.</li>
                <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law or to protect the rights and safety of our community.</li>
            </ul>
        </Section>

        <Section title="4. Data Retention">
            <p>We retain conversation data temporarily to improve service functionality, typically for no longer than 30 days unless flagged for quality review. Feedback and email correspondence are stored securely for the duration necessary to resolve your inquiry.</p>
        </Section>

        <Section title="5. Data Security">
            <p>We are committed to protecting your information. However, no electronic transmission or storage is 100% secure. We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
        </Section>
        
        <Section title="6. Your Rights and Choices">
            <ul className="styled-list">
                <li><strong>Clearing Your Data:</strong> You can clear your conversation history by clearing your browser's `localStorage` for our site. Starting a new chat clears the in-memory context sent to the model.</li>
                <li><strong>Email Subscriptions:</strong> You can unsubscribe from any notifications by following the instructions in the emails we send.</li>
                <li><strong>Access, Correction, and Deletion Requests:</strong> To request access to, correction of, or deletion of your personal information, please email us at <strong>chat@griotbot.com</strong>. We will respond in accordance with applicable data protection laws.</li>
            </ul>
        </Section>

        <Section title="7. Children’s Privacy">
            <p>GriotBot is not intended for children under the age of 13. We do not knowingly collect personal information from anyone under 13. If we become aware that such information has been collected, we will take steps to delete it promptly.</p>
        </Section>

        <Section title="8. Changes to This Privacy Policy">
             <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.</p>
        </Section>

        <Section title="9. Contact Us">
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:chat@griotbot.com" className="inline-link">chat@griotbot.com</a>.</p>
        </Section>

      </article>

      <style jsx>{`
        .legal-container {
          max-width: 800px;
          margin: 2rem auto 4rem auto;
          padding: 0 1rem;
          line-height: 1.8;
          font-size: 1rem;
        }
        .legal-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--input-border);
        }
        .legal-header h1 {
          font-family: var(--heading-font);
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .legal-header p, .intro {
          color: var(--text-color);
          opacity: 0.8;
        }
        .intro {
            margin-bottom: 2rem;
            text-align: center;
            font-style: italic;
        }
        .legal-section {
          margin-bottom: 2.5rem;
        }
        .section-heading {
          font-family: var(--heading-font);
          font-size: 1.5rem;
          color: var(--accent-color);
          margin-bottom: 1rem;
        }
        .section-content {
          padding-left: 1rem;
          border-left: 3px solid var(--input-border);
        }
        .styled-list {
          padding-left: 20px;
          list-style: none;
        }
        .styled-list li {
          position: relative;
          padding-left: 25px;
          margin-bottom: 1rem;
        }
        .styled-list li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: var(--accent-color);
          font-weight: bold;
        }
        .inline-link {
            color: var(--accent-color);
            font-weight: 500;
            text-decoration: none;
        }
        .inline-link:hover {
            text-decoration: underline;
        }
      `}</style>
    </StandardLayout>
  );
}
