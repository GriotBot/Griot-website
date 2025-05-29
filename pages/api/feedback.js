// File: /pages/api/feedback.js - DEBUG VERSION

export default async function handler(req, res) {
  console.log('🔍 FEEDBACK DEBUG: Request received');
  console.log('🔍 FEEDBACK DEBUG: Method:', req.method);
  console.log('🔍 FEEDBACK DEBUG: Headers:', req.headers);
  console.log('🔍 FEEDBACK DEBUG: Body:', req.body);

  // CORS headers
  const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || '*'
    : '*';

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('🔍 FEEDBACK DEBUG: Handling OPTIONS request');
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    console.log('🔍 FEEDBACK DEBUG: Method not allowed:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    console.log('🔍 FEEDBACK DEBUG: Processing POST request');

    // Destructure with defaults
    const {
      name = 'Anonymous',
      email = 'Not provided',
      feedbackType = 'general',
      message = '',
      rating = null,
    } = req.body || {};

    console.log('🔍 FEEDBACK DEBUG: Parsed data:', {
      name,
      email,
      feedbackType,
      messageLength: message.length,
      rating
    });

    // Basic validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      console.log('🔍 FEEDBACK DEBUG: Validation failed - no message');
      return res.status(400).json({ 
        error: 'Message is required and must be a non-empty string.' 
      });
    }

    // Validate message length
    const MAX_MESSAGE_LENGTH = 2000;
    const trimmedMessage = message.trim();
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      console.log('🔍 FEEDBACK DEBUG: Validation failed - message too long');
      return res.status(400).json({ 
        error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.` 
      });
    }

    // Build feedback payload
    const feedbackData = {
      timestamp: new Date().toISOString(),
      name: String(name).trim() || 'Anonymous',
      email: String(email).trim() || 'Not provided',
      feedbackType: String(feedbackType).trim().toLowerCase(),
      rating: rating ? Number(rating) : null,
      message: trimmedMessage,
      userAgent: req.headers['user-agent'] || 'Unknown',
    };

    console.log('🔍 FEEDBACK DEBUG: Final feedback data:', feedbackData);

    // Log feedback (in production, you'd save to database)
    console.log('📬 New Feedback Received:', JSON.stringify(feedbackData, null, 2));
    
    console.log('🔍 FEEDBACK DEBUG: Sending success response');
    
    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for helping improve GriotBot.',
      feedback: {
        timestamp: feedbackData.timestamp,
        feedbackType: feedbackData.feedbackType,
        rating: feedbackData.rating,
      }
    });

  } catch (error) {
    console.error('🔍 FEEDBACK DEBUG: Error caught:', error);
    console.error('🔍 FEEDBACK DEBUG: Error stack:', error.stack);
    
    return res.status(500).json({ 
      error: 'Internal server error. Please try again later.',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
