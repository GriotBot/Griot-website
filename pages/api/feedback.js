// File: pages/api/feedback.js
// This backend uses Nodemailer to send feedback to your email address.
// IMPORTANT: You must add the following to your Vercel Environment Variables:
// GMAIL_APP_USER -> Your Gmail address (e.g., your.email@gmail.com)
// GMAIL_APP_PASS -> Your Gmail App Password (NOT your regular password)

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, feedbackType, message } = req.body;

  // Basic validation
  if (!feedbackType || !message || message.trim() === '') {
    return res.status(400).json({ error: 'Missing required feedback fields.' });
  }

  // Set up the Nodemailer transporter using environment variables
  // NOTE: For services other than Gmail, you'll need to adjust the service and auth.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_APP_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  // Construct the email content
  const mailOptions = {
    from: `"GriotBot Feedback" <${process.env.GMAIL_APP_USER}>`,
    to: process.env.GMAIL_APP_USER, // Send the feedback to yourself
    replyTo: email || undefined, // Set Reply-To if the user provided their email
    subject: `New GriotBot Feedback: ${feedbackType}`,
    text: `
      New feedback received from GriotBot!

      Type: ${feedbackType}
      User Email: ${email || 'Not provided'}
      
      Message:
      ${message}
    `,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2 style="color: #6D3636;">New Feedback from GriotBot</h2>
        <hr>
        <p><strong>Feedback Type:</strong> ${feedbackType}</p>
        <p><strong>User Email:</strong> ${email || '<em>Not provided</em>'}</p>
        <h3>Message:</h3>
        <p style="white-space: pre-wrap; background-color: #f4f4f4; padding: 15px; border-radius: 8px;">${message}</p>
      </div>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Feedback sent successfully.' });
  } catch (error) {
    console.error('Nodemailer error:', error);
    return res.status(500).json({ error: 'Failed to send feedback email.' });
  }
}
