// File: /pages/api/chat.js - PRODUCTION READY WITH IMMEDIATE FIXES

// API Configuration Constants
const API_CONFIG = {
  MAX_TOKENS: {
    STANDARD: 200,
    STORYTELLER: 280
  },
  TEMPERATURE: {
    MIN: 0.4,
    MAX: 0.8,
    BASE: 0.6
  },
  MODEL_PARAMS: {
    TOP_P: 0.85,
    FREQUENCY_PENALTY: 0.1,
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
 */
function createEmpathicSystemMessage(storytellerMode, emotionalContext) {
  const currentDate = new Date().toDateString();
  
  let basePrompt = `You are GriotBot, a digital griot with deep emotional intelligence and cultural wisdom.

EMOTIONAL INTELLIGENCE FRAMEWORK:
- Cognitive Empathy: Understand the user's cultural and emotional frame of reference
- Affective Empathy: Respond with appropriate emotional tone and cultural sensitivity  
- Somatic Empathy: Use language that conveys genuine warmth and understanding

USER EMOTIONAL CONTEXT: ${emotionalContext.join(', ')}

CULTURAL EMPATHY GUIDELINES:
- Acknowledge struggles without being patronizing
- Validate experiences within diaspora cultural context
- Provide hope grounded in historical resilience and strength
- Use appropriate African diaspora wisdom traditions
- Never assume all Black experiences are the same
- Be warm but not overly familiar`;

  // Adjust based on emotional context
  if (emotionalContext.includes('pain') || emotionalContext.includes('discrimination')) {
    basePrompt += `

SENSITIVE RESPONSE MODE:
- Acknowledge the reality and validity of their experience
- Use gentle, measured language
- Include historical context of resilience without minimizing current pain
- Offer practical wisdom alongside emotional support`;
  }

  if (emotionalContext.includes('celebration') || emotionalContext.includes('hope')) {
    basePrompt += `

CELEBRATORY RESPONSE MODE:
- Match their positive energy appropriately
- Celebrate achievements within cultural context
- Reference the joy and strength of our communities
- Encourage continued growth and connection`;
  }

  if (storytellerMode) {
    basePrompt += `

STORYTELLER MODE WITH EMPATHY:
- Craft narratives that emotionally resonate with their current state
- Include characters who faced similar emotional challenges
- End with wisdom that addresses their emotional needs
- Use the rhythm and warmth of oral tradition
- Keep stories concise but meaningful (2-3 paragraphs)`;
  }

  return basePrompt + `\n\nCurrent date: ${currentDate}`;
}

/**
 * STEP 4: Calculate empathic temperature based on emotional state
 * Updated to use constants for consistency
 */
function calculateEmpathicTemperature(emotionalContext, storytellerMode) {
  let baseTemp = API_CONFIG.TEMPERATURE.BASE;
  
  // Adjust for emotional intensity
  if (emotionalContext.includes('pain') || emotionalContext.includes('anxiety')) {
    baseTemp = 0.5; // More careful, measured responses
  } else if (emotionalContext.includes('celebration') || emotionalContext.includes('hope')) {
    baseTemp = 0.7; // More expressive, warm responses
  } else if (emotionalContext.includes('curiosity') || emotionalContext.includes('connection_seeking')) {
    baseTemp = 0.65; // Slightly more creative for learning
  }
  
  // Storyteller mode adjustment
  if (storytellerMode) {
    baseTemp += 0.1; // More creative for storytelling
  }
  
  return Math.min(Math.max(baseTemp, API_CONFIG.TEMPERATURE.MIN), API_CONFIG.TEMPERATURE.MAX);
}

/**
 * STEP 5: Post-process response for cultural empathy
 * Enhanced with multiple closing variations to reduce repetition
 */
function enhanceWithCulturalEmpathy(content, emotionalContext) {
  // Remove problematic patterns
  let cleaned = content
    .replace(/^my child,?\s*/i, '')
    .replace(/^dear child,?\s*/i, '')
    .replace(/^young one,?\s*/i, '')
    .trim();
  
  // Ensure proper capitalization
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  // Add empathetic closing based on emotional context - multiple variations
  if (emotionalContext.includes('pain') && !cleaned.includes('here for you')) {
    const painClosings = [
      ' Remember, you are not alone in this journey.',
      ' Your feelings are valid, and healing takes time.',
      ' The community stands with you through this.'
    ];
    cleaned += painClosings[Math.floor(Math.random() * painClosings.length)];
  } else if (emotionalContext.includes('hope') && !cleaned.includes('proud')) {
    const hopeClosings = [
      ' I believe in your strength and potential.',
      ' Your determination inspires me.',
      ' Keep moving forward - you\'re on the right path.'
    ];
    cleaned += hopeClosings[Math.floor(Math.random() * hopeClosings.length)];
  }
  
  return cleaned;
}
