// File: /pages/api/feedback.js - Gmail SMTP Version (No DNS changes needed)

import nodemailer from 'nodemailer';

// Constants for validation
const ALLOWED_FEEDBACK_TYPES = ['general', 'cultural-accuracy', 'bug', 'suggestion', 'compliment', 'other'];
const MAX_MESSAGE_LENGTH = 3000;
const MAX_NAME_LENGTH = 100;
const ALLOWED_RATINGS = ['1', '2', '3', '4', '5'];
const ALLOWED_CULTURAL_RATINGS = ['excellent', 'good', 'fair', 'poor'];
const ALLOWED_USAGE_FREQUENCY = ['daily', 'weekly', 'monthly', 'rarely'];
const ALLOWED_RECOMMENDATIONS = ['definitely', 'probably', 'maybe', 'no'];

// Create Gmail transporter
const createGmailTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Gmail credentials not configured');
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASS  // your App Password
    }
  });
};

export default async function handler(req, res) {
  // CORS headers
  const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://griot-website.vercel.app'
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
    userAgent = req.headers['user-agent'] || '',
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
        submissionMethod: 'enhanced_form',
        ipAddress: getClientIP(req)
      }
    };

    // Log comprehensive feedback
    logFeedbackData(feedbackData);

    // Generate summary
    const summary = generateFeedbackSummary(feedbackData);
    console.log('📊 Feedback Summary:', JSON.stringify(summary, null, 2));

    // Send email notifications via Gmail
    let emailResult = null;
    const transporter = createGmailTransporter();
    
    if (transporter) {
      try {
        // Send feedback to team
        emailResult = await sendFeedbackEmailViaGmail(transporter, feedbackData);
        
        // Send auto-reply to user if they provided email
        if (feedbackData.contact.email && feedbackData.contact.email !== 'Not provided') {
          await sendAutoReplyViaGmail(transporter, feedbackData);
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the whole request if email fails
      }
    } else {
      console.warn('⚠️ Gmail credentials not configured - feedback logged but no email sent');
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you for your valuable feedback! Your insights help us build a better GriotBot experience.',
      data: {
        timestamp: feedbackData.timestamp,
        feedbackType: feedbackData.ratings.feedbackType,
        hasFollowUpPermission: feedbackData.contact.allowFollow,
        summary: summary,
        emailSent: !!emailResult
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
 * Send feedback email to team via Gmail
 */
async function sendFeedbackEmailViaGmail(transporter, feedbackData) {
  try {
    const emailContent = generateFeedbackEmailContent(feedbackData);
    
    const result = await transporter.sendMail({
      from: `"GriotBot Feedback" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: generateEmailSubject(feedbackData),
      html: emailContent.html,
      text: emailContent.text
    });

    console.log('📧 Feedback email sent via Gmail:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Failed to send feedback email via Gmail:', error);
    throw error;
  }
}

/**
 * Send auto-reply via Gmail
 */
async function sendAutoReplyViaGmail(transporter, feedbackData) {
  try {
    const result = await transporter.sendMail({
      from: `"GriotBot Team" <${process.env.EMAIL_USER}>`,
      to: feedbackData.contact.email,
      subject: '🌿 Thank you for your GriotBot feedback!',
      html: generateAutoReplyHTML(feedbackData),
      text: generateAutoReplyText(feedbackData)
    });

    console.log('📧 Auto-reply sent via Gmail:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Failed to send auto-reply via Gmail:', error);
    throw error;
  }
}

/**
 * Get client IP address for analytics
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         'unknown';
}

/**
 * Structured logging for feedback data
 */
function logFeedbackData(feedbackData) {
  console.log('📬 Enhanced Feedback Received:');
  console.log('==========================================');
  console.log(`Timestamp: ${feedbackData.timestamp}`);
  console.log(`Name: ${feedbackData.contact.name}`);
  console.log(`Email: ${feedbackData.contact.email}`);
  console.log(`Allow Follow-up: ${feedbackData.contact.allowFollow}`);
  console.log('------------------------------------------');
  console.log(`Feedback Type: ${feedbackData.ratings.feedbackType}`);
  console.log(`Cultural Accuracy: ${feedbackData.ratings.culturalAccuracy}`);
  console.log(`User Experience: ${feedbackData.ratings.userExperience}/5`);
  console.log(`Usage Frequency: ${feedbackData.ratings.usageFrequency}`);
  console.log(`Recommendation: ${feedbackData.ratings.recommendation}`);
  console.log('------------------------------------------');
  
  if (feedbackData.preferences.desiredFeatures.length > 0) {
    console.log(`Desired Features (${feedbackData.preferences.desiredFeatures.length}):`);
    feedbackData.preferences.desiredFeatures.forEach(feature => {
      console.log(`  - ${feature.replace(/_/g, ' ')}`);
    });
  }
  
  if (feedbackData.preferences.priorityImprovements.length > 0) {
    console.log(`Priority Improvements (${feedbackData.preferences.priorityImprovements.length}):`);
    feedbackData.preferences.priorityImprovements.forEach(improvement => {
      console.log(`  - ${improvement.replace(/_/g, ' ')}`);
    });
  }
  
  if (feedbackData.feedback.message) {
    console.log('------------------------------------------');
    console.log('Detailed Message:');
    console.log(feedbackData.feedback.message);
  }
  
  console.log('------------------------------------------');
  console.log(`Source: ${feedbackData.feedback.source}`);
  console.log(`IP: ${feedbackData.technical.ipAddress}`);
  console.log(`User Agent: ${feedbackData.technical.userAgent.substring(0, 50)}...`);
  console.log('==========================================');
}

// ... (include all the other helper functions from the previous version)
// validateFeedbackData, generateFeedbackSummary, calculateFeedbackQuality, 
// generateEmailSubject, generateFeedbackEmailContent, generateAutoReplyHTML, generateAutoReplyText

/**
 * Validates feedback data comprehensively
 */
function validateFeedbackData(data) {
  const { 
    name, email, feedbackType, culturalAccuracy, userExperience,
    features, usageFrequency, recommendation, improvements, message
  } = data;

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

  if (feedbackType && !ALLOWED_FEEDBACK_TYPES.includes(feedbackType)) {
    return {
      isValid: false,
      error: `Invalid feedback type. Must be one of: ${ALLOWED_FEEDBACK_TYPES.join(', ')}`
    };
  }

  if (email && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return {
        isValid: false,
        error: 'Please enter a valid email address.'
      };
    }
  }

  if (name && name.length > MAX_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Name exceeds maximum length of ${MAX_NAME_LENGTH} characters.`
    };
  }

  if (message && message.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`
    };
  }

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

function generateFeedbackSummary(feedbackData) {
  const { contact, ratings, preferences, feedback } = feedbackData;
  
  return {
    hasContact: !!(contact.email && contact.email !== 'Not provided'),
    allowFollow: contact.allowFollow,
    overallRating: ratings.userExperience ? `${ratings.userExperience}/5` : 'Not rated',
    culturalRating: ratings.culturalAccuracy || 'Not rated',
    recommendation: ratings.recommendation || 'Not specified',
    usageLevel: ratings.usageFrequency || 'Not specified',
    feedbackType: ratings.feedbackType,
    topFeatureRequests: preferences.desiredFeatures.slice(0, 3),
    topImprovements: preferences.priorityImprovements.slice(0, 3),
    hasDetailedMessage: !!feedback.message,
    messageLength: feedback.message.length,
    totalFeatureRequests: preferences.desiredFeatures.length,
    totalImprovements: preferences.priorityImprovements.length,
    qualityScore: calculateFeedbackQuality(feedbackData)
  };
}

function calculateFeedbackQuality(feedbackData) {
  let score = 0;
  const { contact, ratings, preferences, feedback } = feedbackData;
  
  if (contact.email && contact.email !== 'Not provided') score += 5;
  if (contact.allowFollow) score += 5;
  if (ratings.userExperience) score += 10;
  if (ratings.culturalAccuracy) score += 10;
  if (ratings.recommendation) score += 10;
  score += Math.min(preferences.desiredFeatures.length * 2, 10);
  score += Math.min(preferences.priorityImprovements.length * 2, 10);
  
  if (feedback.message) {
    if (feedback.message.length > 50) score += 20;
    if (feedback.message.length > 200) score += 20;
  }
  
  return Math.min(score, 100);
}

function generateEmailSubject(feedbackData) {
  const { ratings } = feedbackData;
  const rating = ratings.userExperience ? `${ratings.userExperience}/5 ⭐` : 'Unrated';
  const type = ratings.feedbackType.replace('-', ' ').toUpperCase();
  
  return `🌿 New GriotBot Feedback: ${type} - ${rating}`;
}

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
        .header { background: #c49a6c; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; }
        .rating { background: #f8f5f0; padding: 10px; border-left: 4px solid #d7722c; }
        .features { background: #e8f4f8; padding: 10px; border-radius: 5px; }
        .message { background: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic; }
        .footer { color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌿 New GriotBot Feedback</h1>
        <p>Received: ${new Date(feedbackData.timestamp).toLocaleString()}</p>
      </div>
      
      <div class="content">
        <div class="section">
          <h2>Contact Information</h2>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Allow Follow-up:</strong> ${contact.allowFollow ? 'Yes' : 'No'}</p>
        </div>
        
        <div class="section rating">
          <h2>Ratings & Experience</h2>
          <p><strong>Feedback Type:</strong> ${ratings.feedbackType}</p>
          <p><strong>User Experience:</strong> ${ratings.userExperience ? `${ratings.userExperience}/5 stars` : 'Not rated'}</p>
          <p><strong>Cultural Accuracy:</strong> ${ratings.culturalAccuracy || 'Not rated'}</p>
          <p><strong>Usage Frequency:</strong> ${ratings.usageFrequency || 'Not specified'}</p>
          <p><strong>Would Recommend:</strong> ${ratings.recommendation || 'Not specified'}</p>
        </div>
        
        ${preferences.desiredFeatures.length > 0 ? `
        <div class="section features">
          <h2>Desired Features (${preferences.desiredFeatures.length})</h2>
          <ul>
            ${preferences.desiredFeatures.map(feature => `<li>${feature.replace(/_/g, ' ')}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${preferences.priorityImprovements.length > 0 ? `
        <div class="section features">
          <h2>Priority Improvements (${preferences.priorityImprovements.length})</h2>
          <ul>
            ${preferences.priorityImprovements.map(improvement => `<li>${improvement.replace(/_/g, ' ')}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        ${feedback.message ? `
        <div class="section">
          <h2>Detailed Message</h2>
          <div class="message">
            "${feedback.message}"
          </div>
        </div>
        ` : ''}
        
        <div class="section footer">
          <h3>Technical Details</h3>
          <p><strong>Source:</strong> ${feedback.source}</p>
          <p><strong>IP Address:</strong> ${technical.ipAddress}</p>
          <p><strong>Quality Score:</strong> ${calculateFeedbackQuality(feedbackData)}/100</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
GriotBot Feedback Received
==========================

Contact: ${contact.name} (${contact.email})
Type: ${ratings.feedbackType}
Rating: ${ratings.userExperience ? `${ratings.userExperience}/5` : 'Not rated'}
Cultural Accuracy: ${ratings.culturalAccuracy || 'Not rated'}

${feedback.message ? `Message: "${feedback.message}"` : ''}

${preferences.desiredFeatures.length > 0 ? `
Features Requested: ${preferences.desiredFeatures.join(', ')}` : ''}

Quality Score: ${calculateFeedbackQuality(feedbackData)}/100
  `;
  
  return { html, text };
}

function generateAutoReplyHTML(feedbackData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank you for your feedback!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #c49a6c; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; max-width: 600px; margin: 0 auto; }
        .highlight { background: #f8f5f0; padding: 15px; border-left: 4px solid #d7722c; margin: 20px 0; }
        .footer { color: #666; font-size: 14px; margin-top: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌿 Thank You for Your Feedback!</h1>
      </div>
      
      <div class="content">
        <p>Dear ${feedbackData.contact.name},</p>
        
        <p>Thank you for taking the time to share your thoughts about GriotBot! Your feedback is invaluable in helping us build a better cultural AI experience.</p>
        
        <div class="highlight">
          <h3>What happens next?</h3>
          <ul>
            <li>Your feedback has been received and logged</li>
            <li>Our team will review your suggestions carefully</li>
            ${feedbackData.contact.allowFollow ? '<li>We may reach out if we need clarification or have updates</li>' : ''}
            <li>Keep an eye out for improvements based on community feedback</li>
          </ul>
        </div>
        
        <p>Continue exploring GriotBot and discovering the rich stories and wisdom of the African diaspora.</p>
        
        <p>As the African proverb says: <em>"If you want to go fast, go alone. If you want to go far, go together."</em></p>
        
        <p>With gratitude,<br>The GriotBot Team</p>
      </div>
    </body>
    </html>
  `;
}

function generateAutoReplyText(feedbackData) {
  return `
Dear ${feedbackData.contact.name},

Thank you for your GriotBot feedback! Your input helps us build a better cultural AI experience.

What happens next?
- Your feedback has been logged
- Our team will review your suggestions
${feedbackData.contact.allowFollow ? '- We may reach out with updates' : ''}
- Watch for improvements based on community feedback

Continue exploring GriotBot and the rich wisdom of the African diaspora.

"If you want to go fast, go alone. If you want to go far, go together." - African Proverb

With gratitude,
The GriotBot Team
  `;
}
