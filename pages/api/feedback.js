// File: /pages/api/feedback.js (Minimal Version)
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract form data from request body
    const { name, email, feedbackType, message, rating } = req.body;
    
    // Basic validation
    if (!feedbackType || !message) {
      return res.status(400).json({ error: 'Feedback type and message are required' });
    }

    // Format the feedback data for logging
    const feedbackData = {
      timestamp: new Date().toISOString(),
      name: name || 'Anonymous',
      email: email || 'Not provided',
      feedbackType,
      rating,
      message
    };

    // Log the feedback to console (works in all environments)
    console.log('======== NEW FEEDBACK RECEIVED ========');
    console.log(JSON.stringify(feedbackData, null, 2));
    console.log('=======================================');

    // Send success response
    return res.status(200).json({ 
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error handling feedback:', error);
    return res.status(500).json({ 
      error: 'Failed to process feedback',
      message: error.message
    });
  }
}
