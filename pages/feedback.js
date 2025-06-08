// File: pages/feedback.js - Corrected Version
import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'react-feather';
import StandardLayout from '../components/layout/StandardLayout';
// FIXED: Corrected the import path for the CSS module.
import styles from '../styles/components/Feedback.module.css';

export default function Feedback() {
  const [formData, setFormData] = useState({
    email: '',
    feedbackType: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitStatus.error) {
      setSubmitStatus({ success: false, error: '' });
    }
  };

  const validateForm = () => {
    if (!formData.message.trim()) {
      setSubmitStatus({ success: false, error: 'Please provide some feedback in the message field.' });
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSubmitStatus({ success: false, error: 'Please enter a valid email address.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ success: false, error: '' });

    try {
      const response = await fetch('https://script.google.com/a/macros/griotbot.com/s/AKfycbzvCVIyFUbJbioFQTJ74ZQHFWZumi4HppyRJ0EloQhfCr0EaTWlBRON4a7KXMGMJkGM2A/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'An unknown error occurred.');
      }

      setSubmitStatus({ success: true, error: '' });
      setFormData({ email: '', feedbackType: 'general', message: '' });
      setTimeout(() => setSubmitStatus({ success: false, error: '' }), 8000);

    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitStatus({ success: false, error: error.message || 'Unable to submit feedback. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {submitStatus.success && (
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <CheckCircle size={20} />
            <span>Thank you! Your feedback has been sent successfully.</span>
          </div>
        )}

        {submitStatus.error && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            <AlertCircle size={20} />
            <span>{submitStatus.error}</span>
          </div>
        )}

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label htmlFor="feedbackType" className={styles.label}>
                Feedback Type
              </label>
              <select
                id="feedbackType"
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="general">General Feedback</option>
                <option value="bug">Report a Bug</option>
                <option value="suggestion">Feature Suggestion</option>
                <option value="cultural">Cultural Accuracy</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message" className={styles.label}>
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="your.email@example.com"
              />
            </div>

            <div className={styles.submitContainer}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </StandardLayout>
  );
}
