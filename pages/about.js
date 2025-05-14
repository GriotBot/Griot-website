// pages/about.js
import Layout from '../components/layout/Layout';
import AboutContent from '../components/features/about/AboutContent';
import { SEO } from '../components/shared/SEO';

export default function AboutPage() {
  return (
    <Layout>
      <SEO 
        title="About GriotBot" 
        description="Learn about GriotBot - an AI-powered digital griot providing culturally grounded wisdom"
      />
      <AboutContent />
    </Layout>
  );
}
