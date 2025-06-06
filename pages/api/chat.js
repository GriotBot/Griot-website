// pages/api/chat.js
import { 
  API_CONFIG, 
  EMOTIONAL_INDICATORS, 
  DEFAULT_MESSAGES 
} from '../../lib/constants';

// Production CORS configuration
const getAllowedOrigin = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.FRONTEND_URL || 'https://griot-website.vercel.app';
  }
  return '*'; // Allow all origins in development
};

/**
 * Enhanced empathetic AI chat endpoint with shared constants
 * Provides culturally grounded responses with emotional intelligence
 */
export default async function handler(req, res) {
  // CORS headers - Environment-specific origin
  const allowedOrigin = getAllowedOrigin();
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    console.warn(`Method not allowed: ${req.method}`);
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method not allowed: ${req.method}` });
  }

  // Extract and validate request body
  const { prompt, storytellerMode = false } = req.body || {};

  // Enhanced input validation
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ 
      error: 'prompt is required and must be a non-empty string' 
    });
  }

  // Check prompt length limit
  if (prompt.length > 5000) {
    return res.status(400).json({ 
      error: 'prompt exceeds maximum length of 5000 characters' 
    });
  }

  // Validate API key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    console.error('Missing or empty OPENROUTER_API_KEY');
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Get model from environment or use default
  const model = process.env.OPENROUTER_MODEL || API_CONFIG.DEFAULT_MODEL;

  try {
    // Detect emotional context and adjust response
    const emotionalContext = detectEmotionalContext(prompt);
    const empathicTemperature = calculateEmpathicTemperature(emotionalContext, storytellerMode);
    const systemInstruction = createEmpathicSystemInstruction(emotionalContext, storytellerMode);

    // Determine max tokens based on mode
    const maxTokens = storytellerMode 
      ? API_CONFIG.MAX_TOKENS.STORYTELLER 
      : API_CONFIG.MAX_TOKENS.STANDARD;

    // Log request details for monitoring
    console.log(`📡 Empathetic Request → model: ${model}, emotional: [${emotionalContext.join(', ')}], storyteller: ${storytellerMode}, temp: ${empathicTemperature}`);

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt },
        ],
        temperature: empathicTemperature,
        max_tokens: maxTokens,
      }),
    });

    // Handle OpenRouter API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, response.statusText, errorText);
      
      const errorMessage = response.status === 429 
        ? 'Rate limit exceeded. Please try again later.'
        : response.status === 401
        ? 'Authentication failed'
        : `OpenRouter error: ${response.status}`;
        
      return res.status(502).json({ error: errorMessage });
    }

    // Parse and validate response
    const data = await response.json();
    let messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      console.warn('No message content in OpenRouter response:', data);
      return res.status(502).json({ 
        error: 'No response content received from AI service' 
      });
    }

    // Enhanced response cleaning to remove formal/dramatic language
    messageContent = cleanResponseContent(messageContent);

    // Log successful response
    console.log(`✅ Empathetic Response → length: ${messageContent.length} chars, emotions: [${emotionalContext.join(', ')}]`);

    // Return response in expected format
    return res.status(200).json({
      choices: [{ message: { content: messageContent } }],
      emotional_context: emotionalContext,
      temperature_used: empathicTemperature
    });

  } catch (err) {
    console.error('Network/fetch error:', err.message, err.stack);
    
    return res.status(502).json({ 
      error: 'Network error communicating with AI service' 
    });
  }
}

/**
 * Detects emotional context from user input using shared constants
 */
function detectEmotionalContext(text) {
  const normalizedText = text.toLowerCase();
  const detectedEmotions = [];

  // Check each emotional category using shared constants
  Object.entries(EMOTIONAL_INDICATORS).forEach(([emotion, indicators]) => {
    if (indicators.some(indicator => normalizedText.includes(indicator))) {
      detectedEmotions.push(emotion);
    }
  });

  return detectedEmotions;
}

/**
 * Calculates appropriate temperature based on emotional context
 */
function calculateEmpathicTemperature(emotionalContext, storytellerMode) {
  let baseTemp = API_CONFIG.TEMPERATURE.STANDARD;

  // Adjust based on emotional state
  if (emotionalContext.includes('pain') || emotionalContext.includes('cultural_disconnection')) {
    baseTemp = API_CONFIG.TEMPERATURE.EMPATHETIC;
  } else if (emotionalContext.includes('celebration')) {
    baseTemp = API_CONFIG.TEMPERATURE.CELEBRATORY;
  }

  // Slight adjustment for storyteller mode
  if (storytellerMode) {
    baseTemp = API_CONFIG.TEMPERATURE.STORYTELLER;
  }

  return Math.min(Math.max(baseTemp, 0.1), 1.0); // Clamp between 0.1 and 1.0
}

/**
 * Creates empathic system instruction based on emotional context
 */
function createEmpathicSystemInstruction(emotionalContext, storytellerMode) {
  const currentDate = new Date().toDateString();
  
  let baseInstruction = `You are GriotBot, an AI assistant inspired by the West African griot tradition. Provide culturally rich, empathetic responses with respect and clarity. Break text into clear paragraphs. Current date: ${currentDate}`;

  // Add emotional context awareness
  if (emotionalContext.length > 0) {
    if (emotionalContext.includes('pain') || emotionalContext.includes('cultural_disconnection')) {
      baseInstruction += '\n\nEMPATHETIC MODE: The user seems to be experiencing difficulty. Respond with gentle validation, understanding, and supportive guidance. Acknowledge their feelings and provide hope.';
    } else if (emotionalContext.includes('celebration')) {
      baseInstruction += '\n\nCELEBRATORY MODE: The user seems happy or excited. Share in their joy with warm congratulations and cultural pride. Connect their achievement to broader cultural context.';
    } else if (emotionalContext.includes('frustration')) {
      baseInstruction += '\n\nSUPPORTIVE MODE: The user seems frustrated. Provide practical advice with patience and understanding. Offer perspective from cultural wisdom.';
    }
  }

  // Add storyteller mode instructions if enabled
  if (storytellerMode) {
    baseInstruction += '\n\nSTORYTELLER MODE: Frame your response as a narrative from African diaspora traditions. Use vivid imagery, cultural references, and end with a reflective insight. Draw from oral storytelling techniques while maintaining authenticity.';
  }

  baseInstruction += '\n\nIMPORTANT: Respond in a natural, conversational tone. Avoid overly formal greetings or dramatic language. Be warm but professional.';

  return baseInstruction;
}

/**
 * Cleans response content to ensure natural, conversational tone
 */
function cleanResponseContent(content) {
  if (!content || typeof content !== 'string') {
    return DEFAULT_MESSAGES.NO_RESPONSE;
  }

  let cleaned = content.trim();

  // Remove overly formal greetings and dramatic openings
  const dramaticOpenings = [
    /^Ah,?\s+(dear|esteemed|beloved)\s+/i,
    /^Greetings,?\s+(dear|esteemed|beloved)\s+/i,
    /^My\s+(dear|esteemed|beloved)\s+/i,
    /^Welcome,?\s+(dear|esteemed|beloved)\s+/i,
    /digital realm/gi,
    /wellspring of wisdom/gi,
    /tapped into.*wisdom/gi
  ];

  dramaticOpenings.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  // Remove excessive formality
  cleaned = cleaned.replace(/\*[^*]*\*/g, ''); // Remove *action descriptions*
  cleaned = cleaned.replace(/\b(Indeed|Verily|Truly|Certainly),?\s+/gi, '');
  
  // Clean up any double spaces or awkward transitions
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  cleaned = cleaned.replace(/^\s*,\s*/, ''); // Remove leading commas
  cleaned = cleaned.trim();

  // Ensure we have content after cleaning
  if (!cleaned || cleaned.length < 10) {
    return DEFAULT_MESSAGES.NO_RESPONSE;
  }

  return cleaned;
}

/**
 * Handles basic queries (time, date, weather) with cultural warmth
 */
function handleBasicQuery(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('time') || lowerPrompt.includes('what time')) {
    const currentTime = new Date().toLocaleTimeString();
    return `It's currently ${currentTime}. Time for some wisdom or maybe a good story?`;
  }
  
  if (lowerPrompt.includes('date') || lowerPrompt.includes('what day')) {
    const currentDate = new Date().toLocaleDateString();
    return `Today is ${currentDate}. Each day is a new opportunity to learn about our rich heritage.`;
  }
  
  if (lowerPrompt.includes('weather')) {
    return "I can't check the weather for you, but I can share some wisdom about weathering life's storms! What would you like to talk about?";
  }
  
  return null; // Not a basic query
}
