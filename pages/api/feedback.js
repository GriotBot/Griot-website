// File: /pages/api/feedback-alt.js
// Alternative implementation using a simple log file instead of email
import fs from 'fs';
import path from 'path';

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

    // Create a feedback entry with timestamp
    const feedbackEntry = {
      timestamp: new Date().toISOString(),
      name: name || 'Anonymous',
      email: email || 'Not provided',
      feedbackType,
      rating,
      message
    };

    // Format the feedback for logging
    const logEntry = `
======== NEW FEEDBACK - ${feedbackEntry.timestamp} ========
Name: ${feedbackEntry.name}
Email: ${feedbackEntry.email}
Type: ${feedbackEntry.feedbackType}
Rating: ${feedbackEntry.rating}/5
Message:
${feedbackEntry.message}
=================================================
`;

    // Path to the logs directory and file
    const logsDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logsDir, 'feedback.log');

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Append to log file
    fs.appendFileSync(logFile, logEntry);

    console.log('Feedback saved to log file:', logFile);

    // Send success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling feedback:', error);
    return res.status(500).json({ error: 'Failed to process feedback: ' + error.message });
  }
}
