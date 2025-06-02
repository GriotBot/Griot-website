// File: /pages/api/feedback.js - ENHANCED VERSION WITH RESEND
import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Constants for validation
const ALLOWED_FEEDBACK_TYPES = ['general', 'cultural-accuracy', 'bug', 'suggestion', 'compliment', 'other'];
const MAX_MESSAGE_LENGTH = 3000;
const MAX_NAME_LENGTH = 100;
const ALLOWED_RATINGS = ['1', '2', '3', '4', '5'];
const ALLOWED_CULTURAL_RATINGS = ['excellent', 'good', 'fair', 'poor'];
const ALLOWED_USAGE_FREQUENCY = ['daily', 'weekly', 'monthly', 'rarely'];
const ALLOWED_RECOMMENDATIONS = ['definitely', 'probably', 'maybe', 'no'];

export default async function handler(req, res) {
  // CORS headers
  const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://griotbot.vercel.app'
    : '*';

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
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed. Use POST.' 
    });
  }

  // Extract and validate request body
  const {
    name = 'Anonymous',
    email = '',
    feedbackType = 'general',
    culturalAccuracy = '',
    userExperience = '',
    features = [],
    usageFrequency = '',
    recommendation = '',
    improvements = [],
    message = '',
    allowFollow = false,
    timestamp,
    userAgent = '',
    source = 'feedback_form'
  } = req.body || {};

  try {
    // Enhanced validation
    const validationResult = validateFeedbackData({
      name, email, feedbackType, culturalAccuracy, userExperience,
      features, usageFrequency, recommendation, improvements, message
    });

    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        error: validationResult.error
      });
    }

    // Build comprehensive feedback data
    const feedbackData = {
      timestamp: timestamp || new Date().toISOString(),
      contact: {
        name: String(name).trim() || 'Anonymous',
        email: String(email).trim() || 'Not provided',
        allowFollow: Boolean(allowFollow)
      },
      ratings: {
        feedbackType: String(feedbackType).trim(),
        culturalAccuracy: String(culturalAccuracy).trim(),
        userExperience: String(userExperience).trim(),
        usageFrequency: String(usageFrequency).trim(),
        recommendation: String(recommendation).trim()
      },
      preferences: {
        desiredFeatures: Array.isArray(features) ? features : [],
        priorityImprovements: Array.isArray(improvements) ? improvements : []
      },
      feedback: {
        message: String(message).trim(),
        source: String(source).trim()
      },
      technical: {
        userAgent: String(userAgent).trim(),
        submissionMethod: 'enhanced_form'
      }
    };

    // Log feedback for development/analytics
    console.log('📬 Enhanced Feedback Received:', JSON.stringify({
      timestamp: feedbackData.timestamp,
      type: feedbackData.ratings.feedbackType,
      culturalRating: feedbackData.ratings.culturalAccuracy,
      experienceRating: feedbackData.ratings.userExperience,
      hasEmail: !!feedbackData.contact.email && feedbackData.contact.email !== 'Not provided',
      messageLength: feedbackData.feedback.message.length,
      featuresCount: feedbackData.preferences.desiredFeatures.length,
      improvementsCount: feedbackData.preferences.priorityImprovements.length
    }, null, 2));

    // Send email notification via Resend
    await sendFeedbackEmail(feedbackData);

    // Send auto-reply if email provided
    if (feedbackData.contact.email && feedbackData.contact.email !== 'Not provided') {
      await sendAutoReply(feedbackData);
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you for your valuable feedback! Your insights help us build a better GriotBot experience.',
      data: {
        timestamp: feedbackData.timestamp,
        feedbackType: feedbackData.ratings.feedbackType,
        hasFollowUpPermission: feedbackData.contact.allowFollow
      }
    });

  } catch (error) {
    console.error('Enhanced Feedback API Error:', error.message, error.stack);
    
    return res.status(500).json({ 
      success: false,
      error: 'Unable to process feedback. Please try again or contact us directly at chat@griotbot.com'
    });
  }
}

/**
 * Validates feedback data comprehensively
 */
function validateFeedbackData(data) {
  const { 
    name, email, feedbackType, culturalAccuracy, userExperience,
    features, usageFrequency, recommendation, improvements, message
  } = data;

  // Check if meaningful content is provided
  const hasContent = message.trim() || 
                    (features && features.length > 0) || 
                    (improvements && improvements.length > 0) ||
                    culturalAccuracy || 
                    userExperience ||
                    recommendation;

  if (!hasContent) {
    return {
      isValid: false,
      error: 'Please provide some feedback before submitting.'
    };
  }

  // Validate feedback type
  if (feedbackType && !ALLOWED_FEEDBACK_TYPES.includes(feedbackType)) {
    return {
      isValid: false,
      error: `Invalid feedback type. Must be one of: ${ALLOWED_FEEDBACK_TYPES.join(', ')}`
    };
  }

  // Validate email format if provided
  if (email && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return {
        isValid: false,
        error: 'Please enter a valid email address.'
      };
    }
  }

  // Validate name length
  if (name && name.length > MAX_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Name exceeds maximum length of ${MAX_NAME_LENGTH} characters.`
    };
  }

  // Validate message length
  if (message && message.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`
    };
  }

  // Validate rating values
  if (userExperience && !ALLOWED_RATINGS.includes(userExperience)) {
    return {
      isValid: false,
      error: 'Invalid user experience rating.'
    };
  }

  if (culturalAccuracy && !ALLOWED_CULTURAL_RATINGS.includes(culturalAccuracy)) {
    return {
      isValid: false,
      error: 'Invalid cultural accuracy rating.'
    };
  }

  if (usageFrequency && !ALLOWED_USAGE_FREQUENCY.includes(usageFrequency)) {
    return {
      isValid: false,
      error: 'Invalid usage frequency value.'
    };
  }

  if (recommendation && !ALLOWED_RECOMMENDATIONS.includes(recommendation)) {
    return {
      isValid: false,
      error: 'Invalid recommendation value.'
    };
  }

  return { isValid: true };
}

/**
 * Sends feedback notification email via Resend
 */
async function sendFeedbackEmail(feedbackData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - skipping email notification');
    return;
  }

  try {
    const emailContent = generateFeedbackEmailContent(feedbackData);
    
    const result = await resend.emails.send({
      from: 'GriotBot Feedback <feedback@griotbot.com>',
      to: ['chat@griotbot.com'], // Your feedback receiving email
      subject: `🌿 New GriotBot Feedback: ${feedbackData.ratings.feedbackType} - ${feedbackData.ratings.userExperience ? feedbackData.ratings.userExperience + '/5 stars' : 'Unrated'}`,
      html: emailContent.html,
      text: emailContent.text
    });

    console.log('📧 Feedback email sent successfully:', result.id);
    return result;
  } catch (error) {
    console.error('❌ Failed to send feedback email:', error);
    throw error;
  }
}

/**
 * Sends auto-reply email to user
 */
async function sendAutoReply(feedbackData) {
  if (!process.env.RESEND_API_KEY || 
      !feedbackData.contact.email || 
      feedbackData.contact.email === 'Not provided') {
    return;
  }

  try {
    const autoReplyContent = generateAutoReplyContent(feedbackData);
    
    const result = await resend.emails.send({
      from: 'GriotBot Team <noreply@griotbot.com>',
      to: [feedbackData.contact.email],
      subject: '🙏 Thank you for your GriotBot feedback!',
      html: autoReplyContent.html,
      text: autoReplyContent.text
    });

    console.log('📧 Auto-reply sent successfully:', result.id);
    return result;
  } catch (error) {
    console.error('❌ Failed to send auto-reply:', error);
    // Don't throw - auto-reply failure shouldn't break feedback submission
  }
}

/**
 * Generates comprehensive feedback email content
 */
function generateFeedbackEmailContent(feedbackData) {
  const { contact, ratings, preferences, feedback, technical } = feedbackData;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>GriotBot Feedback</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #d7722c, #e08e59); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; padding: 15px; border-left: 4px solid #d7722c; background: #f9f9f9; }
        .rating { display: inline-block; background: #e8f5e8; padding: 5px 10px; border-radius: 15px; margin: 2px; }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { background: #e3f2fd; padding: 8px; margin: 4px 0; border-radius: 4px; }
        .high-priority { background: #fff3cd; border-left-color: #f0ad4e; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌿 New GriotBot Feedback Received</h1>
        <p><strong>Submitted:</strong> ${new Date(feedbackData.timestamp).toLocaleString()}</p>
      </div>

      <div class="section">
        <h3>👤 Contact Information</h3>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Allow Follow-up:</strong> ${contact.allowFollow ? '✅ Yes' : '❌ No'}</p>
      </div>

      <div class="section ${ratings.userExperience === '1' || ratings.userExperience === '2' ? 'high-priority' : ''}">
        <h3>⭐ Experience Ratings</h3>
        <p><strong>Feedback Type:</strong> <span class="rating">${ratings.feedbackType}</span></p>
        ${ratings.culturalAccuracy ? `<p><strong>Cultural Authenticity:</strong> <span class="rating">${ratings.culturalAccuracy}</span></p>` : ''}
        ${ratings.userExperience ? `<p><strong>Overall Experience:</strong> <span class="rating">${ratings.userExperience}/5 stars</span></p>` : ''}
        ${ratings.usageFrequency ? `<p><strong>Usage Frequency:</strong> <span class="rating">${ratings.usageFrequency}</span></p>` : ''}
        ${ratings.recommendation ? `<p><strong>Would Recommend:</strong> <span class="rating">${ratings.recommendation}</span></p>` : ''}
      </div>

      ${preferences.desiredFeatures.length > 0 ? `
      <div class="section">
        <h3>🚀 Requested Features</h3>
        <ul class="feature-list">
          ${preferences.desiredFeatures.map(feature => `<li>✨ ${feature.replace(/_/g, ' ')}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${preferences.priorityImprovements.length > 0 ? `
      <div class="section">
        <h3>⚡ Priority Improvements</h3>
        <ul class="feature-list">
          ${preferences.priorityImprovements.map(improvement => `<li>🔧 ${improvement.replace(/_/g, ' ')}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${feedback.message ? `
      <div class="section">
        <h3>💬 Detailed Feedback</h3>
        <p style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #d7722c;">
          ${feedback.message.replace(/\n/g, '<br>')}
        </p>
      </div>
      ` : ''}

      <div class="section">
        <h3>🔧 Technical Info</h3>
        <p><strong>Source:</strong> ${feedback.source}</p>
        <p><strong>User Agent:</strong> ${technical.userAgent}</p>
        <p><strong>Submission Method:</strong> ${technical.submissionMethod}</p>
      </div>
    </body>
    </html>
  `;

  const text = `
🌿 NEW GRIOTBOT FEEDBACK RECEIVED

Submitted: ${new Date(feedbackData.timestamp).toLocaleString()}

👤 CONTACT INFORMATION
Name: ${contact.name}
Email: ${contact.email}
Allow Follow-up: ${contact.allowFollow ? 'Yes' : 'No'}

⭐ EXPERIENCE RATINGS
Feedback Type: ${ratings.feedbackType}
${ratings.culturalAccuracy ? `Cultural Authenticity: ${ratings.culturalAccuracy}` : ''}
${ratings.userExperience ? `Overall Experience: ${ratings.userExperience}/5 stars` : ''}
${ratings.usageFrequency ? `Usage Frequency: ${ratings.usageFrequency}` : ''}
${ratings.recommendation ? `Would Recommend: ${ratings.recommendation}` : ''}

${preferences.desiredFeatures.length > 0 ? `
🚀 REQUESTED FEATURES
${preferences.desiredFeatures.map(feature => `- ${feature.replace(/_/g, ' ')}`).join('\n')}
` : ''}

${preferences.priorityImprovements.length > 0 ? `
⚡ PRIORITY IMPROVEMENTS
${preferences.priorityImprovements.map(improvement => `- ${improvement.replace(/_/g, ' ')}`).join('\n')}
` : ''}

${feedback.message ? `
💬 DETAILED FEEDBACK
${feedback.message}
` : ''}

🔧 TECHNICAL INFO
Source: ${feedback.source}
User Agent: ${technical.userAgent}
Submission Method: ${technical.submissionMethod}
  `;

  return { html, text };
}

/**
 * Generates auto-reply email content for users
 */
function generateAutoReplyContent(feedbackData) {
  const { contact, ratings } = feedbackData;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank you for your GriotBot feedback!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #d7722c, #e08e59); color: white; padding: 30px; text-align: center; border-radius: 12px; margin-bottom: 30px; }
        .content { padding: 20px; }
        .highlight { background: #fff5f0; padding: 20px; border-radius: 8px; border-left: 4px solid #d7722c; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .social-links { display: flex; justify-content: center; gap: 15px; margin-top: 15px; }
        .social-links a { text-decoration: none; color: #d7722c; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🙏 Thank You, ${contact.name}!</h1>
        <p>Your feedback helps us build a better GriotBot experience for our community</p>
      </div>

      <div class="content">
        <p>Hello ${contact.name},</p>
        
        <p>Thank you for taking the time to share your feedback about GriotBot! Your insights are invaluable as we work to create the most authentic and helpful digital griot experience possible.</p>

        <div class="highlight">
          <h3>🌟 What happens next?</h3>
          <ul>
            <li><strong>Review:</strong> Our team carefully reviews every piece of feedback</li>
            <li><strong>Analysis:</strong> We analyze patterns to prioritize improvements</li>
            <li><strong>Implementation:</strong> Your suggestions directly influence our development roadmap</li>
            ${contact.allowFollow ? '<li><strong>Follow-up:</strong> We may reach out with follow-up questions to better understand your experience</li>' : ''}
          </ul>
        </div>

        <p>We're especially grateful for feedback on cultural authenticity, as maintaining respectful and accurate representation of African diaspora experiences is at the heart of what we do.</p>

        <p>Keep an eye out for new features and improvements – many of which come directly from user feedback like yours!</p>

        <div class="footer">
          <p><strong>Stay Connected</strong></p>
          <p>Follow our journey and get updates on new features:</p>
          <div class="social-links">
            <a href="https://www.instagram.com/griotbot">Instagram</a>
            <a href="https://twitter.com/griotbot">Twitter</a>
            <a href="https://www.linkedin.com/company/griotbot">LinkedIn</a>
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            Questions? Reply to this email or contact us at <a href="mailto:chat@griotbot.com">chat@griotbot.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
🙏 Thank You for Your GriotBot Feedback!

Hello ${contact.name},

Thank you for taking the time to share your feedback about GriotBot! Your insights are invaluable as we work to create the most authentic and helpful digital griot experience possible.

🌟 What happens next?
- Review: Our team carefully reviews every piece of feedback
- Analysis: We analyze patterns to prioritize improvements  
- Implementation: Your suggestions directly influence our development roadmap
${contact.allowFollow ? '- Follow-up: We may reach out with follow-up questions to better understand your experience' : ''}

We're especially grateful for feedback on cultural authenticity, as maintaining respectful and accurate representation of African diaspora experiences is at the heart of what we do.

Keep an eye out for new features and improvements – many of which come directly from user feedback like yours!

Stay Connected:
- Instagram: @griotbot
- Twitter: @griotbot  
- LinkedIn: company/griotbot

Questions? Reply to this email or contact us at chat@griotbot.com

Best regards,
The GriotBot Team
  `;

  return { html, text };
}
