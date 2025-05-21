// File: /pages/api/feedback.js
export default async function handler(req, res) {
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

  // Validate required fields
  if (!feedbackType || typeof message !== 'string' || !message.trim()) {
    return res
      .status(400)
      .json({ error: 'feedbackType and non-empty message are required.' });
  }

  // Build feedback payload
  const feedbackData = {
    timestamp: new Date().toISOString(),
    name: String(name),
    email: String(email),
    feedbackType: String(feedbackType),
    rating: rating !== null ? Number(rating) : null,
    message: message.trim(),
  };

  try {
    // Log in a clear, searchable way
    console.log('📬 New Feedback:', JSON.stringify(feedbackData, null, 2));

    // In production you might write to a database or send an email here

    return res.status(200).json({
      success: true,
      feedback: feedbackData,
      message: 'Feedback submitted successfully',
    });
  } catch (err) {
    console.error('Feedback API Error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
