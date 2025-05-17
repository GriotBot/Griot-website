// File: /components/FeedbackForm.js
import { useState } from 'react';

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
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
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        backgroundColor: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px var(--shadow-color)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          🙏🏾
        </div>
        <h2 style={{
          color: '#c49a6c',
          fontSize: '1.5rem',
          marginBottom: '1rem',
          fontFamily: 'Lora, serif',
        }}>
          Thank You For Your Feedback
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Your voice helps shape GriotBot's journey. We've received your message and will consider it carefully.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          style={{
            background: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '1rem',
            marginRight: '1rem'
          }}
        >
          Submit Another Response
        </button>
        <a 
          href="/"
          style={{
            textDecoration: 'none',
            color: 'var(--accent-color)',
            fontWeight: 500,
          }}
        >
          Return to GriotBot
        </a>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        backgroundColor: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px var(--shadow-color)'
      }}
    >
      {error && (
        <div style={{
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          color: '#dc3545',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label 
          htmlFor="name"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 500
          }}
        >
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--input-border)',
            borderRadius: '6px',
            backgroundColor: 'var(--input-bg)',
            color: 'var(--input-text)',
            fontFamily: 'inherit',
            fontSize: '1rem'
          }}
          placeholder="Enter your name (optional)"
        />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label 
          htmlFor="email"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 500
          }}
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--input-border)',
            borderRadius: '6px',
            backgroundColor: 'var(--input-bg)',
            color: 'var(--input-text)',
            fontFamily: 'inherit',
            fontSize: '1rem'
          }}
          placeholder="Enter your email (optional)"
        />
        <small style={{ opacity: 0.7, display: 'block', marginTop: '0.5rem' }}>
          We'll only use this to follow up if you request a response
        </small>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label 
          htmlFor="feedbackType"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 500
          }}
        >
          Feedback Type
        </label>
        <select
          id="feedbackType"
          name="feedbackType"
          value={formData.feedbackType}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--input-border)',
            borderRadius: '6px',
            backgroundColor: 'var(--input-bg)',
            color: 'var(--input-text)',
            fontFamily: 'inherit',
            fontSize: '1rem'
          }}
          required
        >
          <option value="general">General Feedback</option>
          <option value="content">Content Quality</option>
          <option value="cultural">Cultural Accuracy</option>
          <option value="feature">Feature Request</option>
          <option value="bug">Report an Issue</option>
        </select>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label 
          htmlFor="rating"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 500
          }}
        >
          How would you rate your experience with GriotBot?
        </label>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{ opacity: 0.7 }}>Not Helpful</span>
          <span style={{ opacity: 0.7 }}>Very Helpful</span>
        </div>
        <input
          type="range"
          id="rating"
          name="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          style={{
            width: '100%',
            accentColor: 'var(--accent-color)'
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <label 
          htmlFor="message"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 500
          }}
        >
          Your Feedback
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--input-border)',
            borderRadius: '6px',
            backgroundColor: 'var(--input-bg)',
            color: 'var(--input-text)',
            fontFamily: 'inherit',
            fontSize: '1rem',
            resize: 'vertical'
          }}
          placeholder="Share your thoughts, suggestions, or experiences with GriotBot..."
          required
        />
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <button 
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            fontSize: '1rem',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {loading ? (
            <>
              <span style={{
                display: 'inline-block',
                width: '1rem',
                height: '1rem',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
              Submitting...
            </>
          ) : 'Submit Feedback'}
        </button>
        
        <a 
          href="/"
          style={{
            textDecoration: 'none',
            color: 'var(--accent-color)',
            fontWeight: 500,
          }}
        >
          Return to GriotBot
        </a>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
