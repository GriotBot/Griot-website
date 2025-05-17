// File: /pages/api/feedback.js - Updated for Gmail
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

    // Configure Gmail transporter with correct settings
    const transporter = createTransport({
      service: 'gmail',  // Use the service name instead of manual host/port
      auth: {
        user: chart@griotbot.com,
        pass: mzbc fryp gtgt gqnx, // This must be an App Password
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
<p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Send the email
    const mailOptions = {
      from: chat@griotbot.com, // Use the same email as the auth user
      to: process.env.FEEDBACK_EMAIL_TO || process.env.EMAIL_USER, // Default to sending to yourself
      subject: `GriotBot Feedback: ${feedbackType}`,
      text: emailBody,
      html: htmlBody,
    };

    console.log('Attempting to send email with options:', { 
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    // Send success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling feedback:', error);
    return res.status(500).json({ error: 'Failed to process feedback: ' + error.message });
  }
}
