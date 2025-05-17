// File: /pages/api/feedback.js
import { createTransport } from 'nodemailer';

// Configure email transporter (using environment variables for security)
const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

    // Option 1: Send feedback via email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.FEEDBACK_EMAIL_TO,
      subject: `GriotBot Feedback: ${feedbackType}`,
      text: `
Rating: ${rating}/5
Type: ${feedbackType}
From: ${name || 'Anonymous'} ${email ? `(${email})` : ''}

Feedback:
${message}
      `,
      html: `
<h2>GriotBot Feedback Received</h2>
<p><strong>Rating:</strong> ${rating}/5</p>
<p><strong>Type:</strong> ${feedbackType}</p>
<p><strong>From:</strong> ${name || 'Anonymous'} ${email ? `(${email})` : ''}</p>
<p><strong>Feedback:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Option 2: Store in database (commented out, implement if needed)
    // In a real implementation, you would connect to your database and store the feedback
    // Example with MongoDB:
    // 
    // import { MongoClient } from 'mongodb';
    // const client = new MongoClient(process.env.MONGODB_URI);
    // await client.connect();
    // const db = client.db('griotbot');
    // const feedbackCollection = db.collection('feedback');
    // await feedbackCollection.insertOne({
    //   name,
    //   email,
    //   feedbackType,
    //   message,
    //   rating,
    //   createdAt: new Date(),
    // });
    // client.close();

    // Send success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling feedback:', error);
    return res.status(500).json({ error: 'Failed to process feedback' });
  }
}
