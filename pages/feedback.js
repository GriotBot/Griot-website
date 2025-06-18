// File: pages/feedback.js - Final Reliable Version
import { useState } from 'react';
import { Send } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';
import styles from '../styles/components/Feedback.module.css';

export default function Feedback() {
  // State is simplified as we only need to control the input fields.
  const [feedbackType, setFeedbackType] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  return (
    <StandardLayout
      pageType="standard"
      title="Feedback - GriotBot"
      description="Share your feedback to help shape the future of GriotBot."
      currentPath="/feedback"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Share Your Feedback</h1>
          <p className={styles.subtitle}>
            Your insights are vital to our journey. Help us build a more authentic and meaningful experience.
          </p>
        </header>

        <div className={styles.formContainer}>
          {/* This form now posts directly to a form backend service.
            This method is simpler, more reliable, and avoids all CORS issues.
            Replace 'YOUR_FORMSPREE_ENDPOINT_URL' with the URL you get from Formspree.
          */}
          <form 
            action="https://formspree.io/f/myzjpjyv" // <-- PASTE YOUR URL HERE
            method="POST"
          >
            <div className={styles.inputGroup}>
              <label htmlFor="feedbackType" className={styles.label}>
                Feedback Type
              </label>
              <select
                id="feedbackType"
                name="GriotBot Feedback Type" // This name will be the subject in the email you receive
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className={styles.select}
              >
                <option value="General Feedback">General Feedback</option>
                <option value="Bug Report">Report a Bug</option>
                <option value="Feature Suggestion">Feature Suggestion</option>
                <option value="Cultural Accuracy">Cultural Accuracy</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message" className={styles.label}>
                Your Message
              </label>
              <textarea
                id="message"
                name="Message" // The name attribute is used by the backend service
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.textarea}
                placeholder="What's on your mind? The more detail, the better!"
                rows={7}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Your Email (Optional)
              </label>
              <p className={styles.labelDescription}>
                Provide your email if you're open to follow-up questions.
              </p>
              <input
                type="email"
                id="email"
                name="Email" // The name attribute is used by the backend service
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="your.email@example.com"
              />
            </div>

            <div className={styles.submitContainer}>
              <button
                type="submit"
                className={styles.submitButton}
                // The button is disabled only if there is no message content
                disabled={!message.trim()}
              >
                <Send size={18} />
                Send Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </StandardLayout>
  );
}

