// File: /pages/api/chat.js - PRODUCTION READY WITH IMMEDIATE FIXES

// API Configuration Constants
const API_CONFIG = {
  MAX_TOKENS: {
    STANDARD: 180,      // Reduced for more focused responses
    STORYTELLER: 250    // Reduced for more concise stories
  },
  TEMPERATURE: {
    MIN: 0.3,           // Lower minimum for more controlled responses
    MAX: 0.7,           // Lower maximum to reduce drama
    BASE: 0.4           // Much lower base temperature
  },
  MODEL_PARAMS: {
    TOP_P: 0.8,         // Slightly lower for more focused responses
    FREQUENCY_PENALTY: 0.2,  // Higher to reduce repetitive formal language
    PRESENCE_PENALTY: 0.1
  }
};

export default async function handler(req, res) {
  // SECURE CORS headers - production ready
  const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? 'https://griot-website.vercel.app'  // Production domain only
    : '*';  // Allow all in development for easier testing
    
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { prompt, storytellerMode = false } = req.body || {};
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Normalize prompt once - optimization fix
    const normalizedPrompt = prompt.toLowerCase().trim();

    // STEP 1: Analyze user's emotional state
    const emotionalContext = analyzeUserEmotionalState(prompt, normalizedPrompt);
    
    // STEP 2: Handle basic queries with empathy
    const quickResponse = handleBasicQueriesEmpathetically(prompt, normalizedPrompt, emotionalContext);
    if (quickResponse) {
      return res.status(200).json({
        choices: [{ message: { content: quickResponse } }]
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // STEP 3: Create empathy-aware system message
    const systemMessage = createEmpathicSystemMessage(storytellerMode, emotionalContext);
    
    // STEP 4: Calculate empathic temperature
    const empathicTemp = calculateEmpathicTemperature(emotionalContext, storytellerMode);
    
    console.log('🌿 GriotBot Empathic Analysis:', {
      promptLength: prompt.length,
      emotionalContext: emotionalContext,
      empathicTemperature: empathicTemp,
      storytellerMode: storytellerMode,
      timestamp: new Date().toISOString()
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://griot-website.vercel.app',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo', // Configurable model
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: storytellerMode ? API_CONFIG.MAX_TOKENS.STORYTELLER : API_CONFIG.MAX_TOKENS.STANDARD,
        temperature: empathicTemp,
        top_p: API_CONFIG.MODEL_PARAMS.TOP_P,
        frequency_penalty: API_CONFIG.MODEL_PARAMS.FREQUENCY_PENALTY,
        presence_penalty: API_CONFIG.MODEL_PARAMS.PRESENCE_PENALTY
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      
      let errorMessage = 'I apologize, but I seem to be having trouble connecting right now. Please try again.';
      if (response.status === 429) {
        errorMessage = 'I need a moment to gather my thoughts. Please try again shortly.';
      }
      
      return res.status(502).json({ error: errorMessage });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || 
                  'I apologize, but I seem to be having trouble processing your request right now.';

    // STEP 5: Post-process for cultural empathy
    content = enhanceWithCulturalEmpathy(content, emotionalContext);

    console.log('✅ GriotBot Empathic Response:', {
      responseLength: content.length,
      emotionalApproach: emotionalContext,
      tokensUsed: data.usage?.total_tokens || 'unknown'
    });

    return res.status(200).json({
      choices: [{ message: { content } }]
    });

  } catch (error) {
    console.error('GriotBot Empathic API error:', error.message);
    return res.status(500).json({ 
      error: 'I apologize, but something went wrong. Please try again.' 
    });
  }
}

/**
 * STEP 1: Analyze user's emotional state using cultural context
 * Updated to accept pre-normalized prompt for efficiency
 */
function analyzeUserEmotionalState(originalPrompt, lowerPrompt) {
  const emotionalIndicators = {
    // Struggle and challenge
    frustration: ['tired', 'exhausted', 'frustrated', 'why me', 'unfair', 'hard', 'difficult'],
    pain: ['hurt', 'pain', 'sad', 'crying', 'broken', 'lost'],
    anxiety: ['worried', 'scared', 'nervous', 'anxious', 'afraid'],
    
    // Cultural identity challenges
    cultural_disconnection: ['don\'t understand my culture', 'lost my heritage', 'not black enough', 'don\'t fit in'],
    identity_crisis: ['who am i', 'where do i belong', 'confused about identity'],
    discrimination: ['racism', 'discriminated', 'treated unfairly', 'bias', 'prejudice'],
    
    // Growth and hope
    hope: ['trying', 'hoping', 'maybe', 'possible', 'want to learn', 'help me grow'],
    empowerment_seeking: ['how can i', 'want to be stronger', 'need guidance', 'inspire me'],
    celebration: ['proud', 'happy', 'excited', 'celebrating', 'achieved', 'success'],
    
    // Learning and connection
    curiosity: ['tell me about', 'want to know', 'learn more', 'explain'],
    connection_seeking: ['connect with', 'find my people', 'community', 'belong']
  };
  
  const detectedEmotions = [];
  Object.keys(emotionalIndicators).forEach(emotion => {
    if (emotionalIndicators[emotion].some(indicator => lowerPrompt.includes(indicator))) {
      detectedEmotions.push(emotion);
    }
  });
  
  return detectedEmotions.length > 0 ? detectedEmotions : ['neutral'];
}

/**
 * STEP 2: Handle basic queries with empathetic cultural context
 * Updated with enhanced weather regex and efficiency improvements
 */
function handleBasicQueriesEmpathetically(originalPrompt, lowerPrompt, emotionalContext) {
  // Time queries with cultural warmth
  if (lowerPrompt.match(/what time|current time|time is it/)) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    
    const responses = [
      `The current time is ${timeString}. Whatever brought you here today, I'm glad you're taking a moment to connect.`,
      `It's ${timeString} right now. Time has a way of teaching us patience - how can I help you make this moment meaningful?`,
      `The time is ${timeString}. As our elders say, "Every moment is a chance to start anew." What's on your heart today?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Weather with cultural wisdom - enhanced regex
  if (lowerPrompt.match(/weather|forecast|temperature|how hot|is it cold|climate|rain|snow|sunny/)) {
    const responses = [
      `I can't check the current weather, but I recommend checking your local forecast. You know, there's wisdom in weather - as Maya Angelou said, "Try to be a rainbow in someone's cloud." What storms are you weathering that I might help with?`,
      `I don't have access to weather data, but our ancestors knew that "after every storm, the sun shines again." Is there something else weighing on your mind that I can help you navigate?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  return null; // Continue with AI processing
}

/**
 * STEP 3: Create empathy-aware system message
 * FIXED: Much more natural and conversational
 */
function createEmpathicSystemMessage(storytellerMode, emotionalContext) {
  const currentDate = new Date().toDateString();
  
  if (storytellerMode) {
    return `You are GriotBot, a friendly AI assistant who tells stories from African, Caribbean, and African American traditions.

When telling stories:
- Keep it conversational and warm, like talking to a friend
- Tell engaging 2-3 paragraph stories that relate to their question
- End with a simple lesson or insight
- Use natural, everyday language
- Don't be overly formal or dramatic

User's current mood: ${emotionalContext.join(', ')}
Current date: ${currentDate}`;
  }
  
  return `You are GriotBot, a helpful AI assistant focused on African diaspora culture and empowerment.

Be conversational and natural:
- Talk like a knowledgeable friend, not a formal lecturer
- Give helpful answers in 1-2 paragraphs
- Include cultural context when relevant
- Be warm and supportive without being overly dramatic
- Never use formal greetings like "Greetings" or "Dear seeker"
- Just answer the question naturally

User's current mood: ${emotionalContext.join(', ')}
Current date: ${currentDate}`;
}

/**
 * STEP 4: Calculate empathic temperature based on emotional state
 * UPDATED: Much lower temperatures to reduce dramatic responses
 */
function calculateEmpathicTemperature(emotionalContext, storytellerMode) {
  let baseTemp = API_CONFIG.TEMPERATURE.BASE; // Now 0.4 instead of 0.6
  
  // Adjust for emotional intensity - keeping it lower
  if (emotionalContext.includes('pain') || emotionalContext.includes('anxiety')) {
    baseTemp = 0.3; // Very controlled for sensitive topics
  } else if (emotionalContext.includes('celebration') || emotionalContext.includes('hope')) {
    baseTemp = 0.5; // Slightly more expressive but still controlled
  } else if (emotionalContext.includes('curiosity') || emotionalContext.includes('connection_seeking')) {
    baseTemp = 0.45; // Slightly more creative for learning
  }
  
  // Storyteller mode adjustment - much smaller increase
  if (storytellerMode) {
    baseTemp += 0.05; // Only slight increase for storytelling
  }
  
  return Math.min(Math.max(baseTemp, API_CONFIG.TEMPERATURE.MIN), API_CONFIG.TEMPERATURE.MAX);
}

/**
 * STEP 5: Post-process response for cultural empathy
 * ENHANCED: Remove dramatic and overly formal language
 */
function enhanceWithCulturalEmpathy(content, emotionalContext) {
  // Remove problematic formal openings and patterns
  let cleaned = content
    .replace(/^my child,?\s*/i, '')
    .replace(/^dear child,?\s*/i, '')
    .replace(/^young one,?\s*/i, '')
    .replace(/^greetings,?\s*/i, '')
    .replace(/^ah,?\s*dear\s*/i, '')
    .replace(/^dear seeker,?\s*/i, '')
    .replace(/^esteemed\s+\w+,?\s*/i, '')
    .replace(/^traveler of the digital realm,?\s*/i, '')
    .replace(/^on this day,?\s*/i, '')
    .replace(/^in the year \d+,?\s*/i, '')
    .replace(/digital realm/gi, 'online')
    .replace(/wellspring of wisdom/gi, 'great source of knowledge')
    .replace(/journey through/gi, 'time on')
    .trim();
  
  // Ensure proper capitalization
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  // Add empathetic closing based on emotional context - keep it natural
  if (emotionalContext.includes('pain') && !cleaned.includes('here for you') && !cleaned.includes('not alone')) {
    const painClosings = [
      ' You\'re not alone in this.',
      ' That sounds really tough.',
      ' I understand why that would be difficult.'
    ];
    cleaned += painClosings[Math.floor(Math.random() * painClosings.length)];
  } else if (emotionalContext.includes('hope') && !cleaned.includes('proud') && !cleaned.includes('believe')) {
    const hopeClosings = [
      ' You\'ve got this!',
      ' That sounds like a great direction.',
      ' I believe in you.'
    ];
    cleaned += hopeClosings[Math.floor(Math.random() * hopeClosings.length)];
  }
  
  return cleaned;
}
