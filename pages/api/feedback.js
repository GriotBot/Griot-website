// File: /pages/api/feedback.js - NO RESEND VERSION (Deploy Ready)

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

    // Log comprehensive feedback for development/analytics
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
    console.log(`User Agent: ${feedbackData.technical.userAgent.substring(0, 50)}...`);
    console.log('==========================================');

    // Generate summary for quick analysis
    const summary = generateFeedbackSummary(feedbackData);
    console.log('📊 Feedback Summary:');
    console.log(JSON.stringify(summary, null, 2));

    // TODO: Once Resend is set up, uncomment these lines:
    // await sendFeedbackEmail(feedbackData);
    // if (feedbackData.contact.email && feedbackData.contact.email !== 'Not provided') {
    //   await sendAutoReply(feedbackData);
    // }

    return res.status(200).json({
      success: true,
      message: 'Thank you for your valuable feedback! Your insights help us build a better GriotBot experience.',
      data: {
        timestamp: feedbackData.timestamp,
        feedbackType: feedbackData.ratings.feedbackType,
        hasFollowUpPermission: feedbackData.contact.allowFollow,
        summary: summary
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
 * Generates a summary of feedback for quick analysis
 */
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

/**
 * Calculates a quality score for the feedback
 */
function calculateFeedbackQuality(feedbackData) {
  let score = 0;
  const { contact, ratings, preferences, feedback } = feedbackData;
  
  // Contact information (10 points max)
  if (contact.email && contact.email !== 'Not provided') score += 5;
  if (contact.allowFollow) score += 5;
  
  // Ratings (30 points max)
  if (ratings.userExperience) score += 10;
  if (ratings.culturalAccuracy) score += 10;
  if (ratings.recommendation) score += 10;
  
  // Feature requests and improvements (20 points max)
  score += Math.min(preferences.desiredFeatures.length * 2, 10);
  score += Math.min(preferences.priorityImprovements.length * 2, 10);
  
  // Detailed message (40 points max)
  if (feedback.message) {
    if (feedback.message.length > 50) score += 20;
    if (feedback.message.length > 200) score += 20;
  }
  
  return Math.min(score, 100); // Cap at 100
}

/**
 * Placeholder for future Resend email integration
 * Uncomment and modify when Resend is installed
 */
/*
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendFeedbackEmail(feedbackData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - skipping email notification');
    return;
  }

  try {
    const emailContent = generateFeedbackEmailContent(feedbackData);
    
    const result = await resend.emails.send({
      from: 'GriotBot Feedback <feedback@griotbot.com>',
      to: ['chat@griotbot.com'],
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

async function sendAutoReply(feedbackData) {
  // Auto-reply implementation
}
*/
