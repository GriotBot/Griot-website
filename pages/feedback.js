// File: /pages/feedback.js - DEBUG VERSION
import { useState } from 'react';
import StandardLayout from '../components/layout/StandardLayout';

export default function FeedbackDebug() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    message: '',
    rating: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setDebugInfo('Starting submission...');
    
    if (!formData.message.trim()) {
      setSubmitError('Please provide some feedback before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      setDebugInfo('Making API call to /api/feedback...');
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setDebugInfo(`API response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setDebugInfo(`API error: ${JSON.stringify(errorData)}`);
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      setDebugInfo(`API success: ${JSON.stringify(result)}`);
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        feedbackType: 'general',
        message: '',
        rating: ''
      });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
      
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitError(`Error: ${error.message}`);
      setDebugInfo(`Caught error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StandardLayout 
      pageType="standard"
      title="GriotBot Feedback - Debug"
      description="Debug version of GriotBot feedback form"
      currentPath="/feedback"
    >
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
        <h1>GriotBot Feedback (Debug Mode)</h1>
        
        {/* Debug Info Display */}
        {debugInfo && (
          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            <strong>Debug Info:</strong> {debugInfo}
          </div>
        )}

        {submitSuccess && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid #c3e6cb'
          }}>
            ✅ Feedback submitted successfully!
          </div>
        )}

        {submitError && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid #f5c6cb'
          }}>
            ❌ {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name">Name (optional):</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email">Email (optional):</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="feedbackType">Feedback Type:</label>
            <select
              id="feedbackType"
              name="feedbackType"
              value={formData.feedbackType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="suggestion">Feature Suggestion</option>
              <option value="cultural-accuracy">Cultural Accuracy</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="rating">Rating (1-5, optional):</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="">Select rating...</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="message">Your Feedback:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'vertical'
              }}
              placeholder="Please share your thoughts about GriotBot..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#6c757d' : '#d7722c',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>Current Form Data:</h3>
          <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </StandardLayout>
  );
}
