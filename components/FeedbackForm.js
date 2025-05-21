import { useState } from 'react';
import { Loader } from 'react-feather';
import styles from '../styles/components/FeedbackForm.module.css';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    message: '',
    rating: 3,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Submission failed');
      }
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        feedbackType: 'general',
        message: '',
        rating: 3,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.thankYou}>
        <div className={styles.emoji}>🙏🏾</div>
        <h2>Thank You For Your Feedback</h2>
        <p>
          Your voice helps shape GriotBot’s journey. We’ve received your message
          and will consider it carefully.
        </p>
        <button 
          onClick={() => setSubmitted(false)} 
          className={styles.button}
        >
          Submit Another
        </button>
        <a href="/" className={styles.link}>
          Return to GriotBot
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <label>
        Your Name
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="(optional)"
          className={styles.input}
        />
      </label>

      <label>
        Email Address
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="(optional)"
          className={styles.input}
        />
        <small className={styles.hint}>
          We'll only use this if we need to follow up
        </small>
      </label>

      <label>
        Feedback Type
        <select
          name="feedbackType"
          value={formData.feedbackType}
          onChange={handleChange}
          className={styles.select}
          required
        >
          <option value="general">General Feedback</option>
          <option value="content">Content Quality</option>
          <option value="cultural">Cultural Accuracy</option>
          <option value="feature">Feature Request</option>
          <option value="bug">Report an Issue</option>
        </select>
      </label>

      <label>
        How helpful was GriotBot?
        <div className={styles.rangeLabels}>
          <span>Not helpful</span>
          <span>Very helpful</span>
        </div>
        <input
          type="range"
          name="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          className={styles.range}
        />
      </label>

      <label>
        Your Feedback
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          placeholder="Share your thoughts..."
          className={styles.textarea}
          required
        />
      </label>

      <div className={styles.actions}>
        <button type="submit" disabled={loading} className={styles.submit}>
          {loading ? <Loader className={styles.spinner} /> : 'Submit Feedback'}
        </button>
        <a href="/" className={styles.link}>
          Return to GriotBot
        </a>
      </div>
    </form>
  );
}
