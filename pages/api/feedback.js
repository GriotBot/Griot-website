// File: /pages/api/feedback.js

// Constants for validation
const ALLOWED_FEEDBACK_TYPES = ['bug', 'suggestion', 'compliment', 'cultural-accuracy', 'feature-request', 'other'];
const MAX_MESSAGE_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MIN_RATING = 1;
const MAX_RATING = 5;

export default async function handler(req, res) {
  // CORS headers - Environment-specific origin (consistent with chat API)
  const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://your-domain.vercel.app' // Replace with your actual domain
    : '*'; // Allow all origins in development

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Destructure with defaults
  const {
    name = 'Anonymous',
    email = 'Not provided',
    feedbackType,
    message,
    rating = null,
  } = req.body || {};

  // Enhanced validation for required fields
  if (!feedbackType || typeof feedbackType !== 'string' || !feedbackType.trim()) {
    return res
      .status(400)
      .json({ error: 'feedbackType is required and must be a non-empty string.' });
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res
      .status(400)
      .json({ error: 'message is required and must be a non-empty string.' });
  }

  // Validate feedbackType against allowed values
  const normalizedFeedbackType = String(feedbackType).trim().toLowerCase();
  if (!ALLOWED_FEEDBACK_TYPES.includes(normalizedFeedbackType)) {
    return res.status(400).json({ 
      error: `feedbackType must be one of: ${ALLOWED_FEEDBACK_TYPES.join(', ')}` 
    });
  }

  // Validate message length
  const trimmedMessage = message.trim();
  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return res
      .status(400)
      .json({ error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.` });
  }

  // Validate name length
  const processedName = String(name).trim() || 'Anonymous';
  if (processedName.length > MAX_NAME_LENGTH) {
    return res
      .status(400)
      .json({ error: `Name exceeds maximum length of ${MAX_NAME_LENGTH} characters.` });
  }

  // Enhanced email validation
  let processedEmail = 'Not provided';
  if (email && email !== 'Not provided' && String(email).trim()) {
    const emailStr = String(email).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    processedEmail = emailStr;
  }

  // Enhanced rating validation
  let processedRating = null;
  if (rating !== null && rating !== undefined) {
    const ratingStr = String(rating).trim();
    if (ratingStr !== '') {
      const numericRating = Number(ratingStr);
      if (isNaN(numericRating) || numericRating < MIN_RATING || numericRating > MAX_RATING) {
        return res.status(400).json({ 
          error: `Rating must be a number between ${MIN_RATING} and ${MAX_RATING}, or null.` 
        });
      }
      processedRating = numericRating;
    }
  }

  // Build feedback payload with validated data
  const feedbackData = {
    timestamp: new Date().toISOString(),
    name: processedName,
    email: processedEmail,
    feedbackType: normalizedFeedbackType,
    rating: processedRating,
    message: trimmedMessage,
    userAgent: req.headers['user-agent'] || 'Unknown', // For debugging/analytics
  };

  try {
    // Log in a clear, searchable way
    console.log('📬 New Feedback:', JSON.stringify(feedbackData, null, 2));
    
    // Log summary for easier monitoring
    console.log(`📊 Feedback Summary: Type=${feedbackData.feedbackType}, Rating=${feedbackData.rating}, Length=${feedbackData.message.length} chars`);
    
    // In production you might write to a database or send an email here
    // TODO: Add database persistence or email notification
    
    return res.status(200).json({
      success: true,
      feedback: {
        timestamp: feedbackData.timestamp,
        feedbackType: feedbackData.feedbackType,
        rating: feedbackData.rating,
        // Don't return sensitive data like email or user-agent in response
      },
      message: 'Feedback submitted successfully! Thank you for helping improve GriotBot.',
    });

  } catch (err) {
    console.error('Feedback API Error:', err.message, err.stack);
    
    // Return generic error message to avoid exposing internal details
    return res.status(500).json({ 
      error: 'Internal server error. Please try again later.' 
    });
  }
}
