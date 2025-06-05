// File: /pages/api/chat.js - ENHANCED VERSION

export default async function handler(req, res) {
  // ... existing CORS and validation code ...
  
  try {
    const { prompt, storytellerMode = false } = req.body || {};
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Handle basic queries directly
    const quickResponse = handleBasicQueries(prompt);
    if (quickResponse) {
      return res.status(200).json({
        choices: [{ message: { content: quickResponse } }]
      });
    }

    // Continue with AI processing for complex queries...
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const systemMessage = createEnhancedSystemMessage(storytellerMode);
    
    // ... rest of your existing API code ...
  } catch (error) {
    // ... existing error handling ...
  }
}

function handleBasicQueries(prompt) {
  const lowerPrompt = prompt.toLowerCase().trim();
  
  // Time queries
  if (lowerPrompt.match(/what time|current time|time is it/)) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    return `The current time is ${timeString}. How can I help you with cultural wisdom or guidance today?`;
  }
  
  // Date queries
  if (lowerPrompt.match(/what date|what day|today/)) {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    return `Today is ${dateString}. What cultural topics or guidance can I help you explore?`;
  }
  
  // Weather queries
  if (lowerPrompt.match(/weather|temperature|forecast/)) {
    return `I can't check current weather conditions, but I recommend checking your local weather app. As the African proverb says: "After the rain, the sun will reappear." Is there anything about cultural traditions or personal guidance I can help you with?`;
  }
  
  // Location queries
  if (lowerPrompt.match(/where am i|my location|where/)) {
    return `I don't have access to your location information for privacy reasons. Is there something about cultural heritage, history, or personal growth I can help you explore instead?`;
  }
  
  return null; // No basic query detected, proceed with AI
}

function createEnhancedSystemMessage(storytellerMode) {
  const currentDate = new Date().toDateString();
  
  const baseInstructions = `You are GriotBot, a helpful AI assistant rooted in African diaspora culture. 

Be helpful and direct with practical questions, then add cultural context when relevant. Don't deflect basic questions - answer them first, then offer cultural wisdom if appropriate.

Current date: ${currentDate}`;
  
  if (storytellerMode) {
    return baseInstructions + `

STORYTELLER MODE: Frame responses as brief stories (2-3 paragraphs) using African, Caribbean, or African American traditions. Include cultural wisdom and end with a lesson.`;
  }
  
  return baseInstructions + `

Provide warm, culturally informed responses in 1-2 paragraphs. Be conversational and supportive.`;
}
