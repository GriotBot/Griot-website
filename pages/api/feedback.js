// File: /pages/api/feedback.js
import { createTransport } from 'nodemailer';

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

    // Check if environment variables are properly set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email configuration in environment variables');
      return res.status(500).json({ error: 'Server email configuration is incomplete' });
    }

    // Configure Gmail transporter
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Format the feedback message
    const emailBody = `
Rating: ${rating}/5
Type: ${feedbackType}
From: ${name || 'Anonymous'} ${email ? `(${email})` : ''}

Feedback:
${message}
    `;

    const htmlBody = `
<h2>GriotBot Feedback Received</h2>
<p><strong>Rating:</strong> ${rating}/5</p>
<p><strong>Type:</strong> ${feedbackType}</p>
<p><strong>From:</strong> ${name || 'Anonymous'} ${email ? `(${email})` : ''}</p>
<p><strong>Feedback:</strong></p>
<p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
    `;

    // Determine the recipient email
    const recipientEmail = process.env.FEEDBACK_EMAIL_TO || process.env.EMAIL_USER;

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `GriotBot Feedback: ${feedbackType}`,
      text: emailBody,
      html: htmlBody,
    };

    console.log('Sending feedback email to:', recipientEmail);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

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
