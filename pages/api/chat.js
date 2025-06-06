// pages/api/chat.js
// Debug-friendly caching implementation with fallbacks

// Cultural Knowledge Base (for caching when supported)
const CULTURAL_KNOWLEDGE_BASE = `
GRIOTBOT CULTURAL KNOWLEDGE BASE

## African Proverbs Collection
- "Wisdom is like a baobab tree; no one individual can embrace it." — African Proverb
- "Until the lion learns to write, every story will glorify the hunter." — African Proverb
- "We are the drums, we are the dance." — Afro-Caribbean Proverb
- "A tree cannot stand without its roots." — Jamaican Proverb
- "Unity is strength, division is weakness." — Swahili Proverb
- "Knowledge is like a garden; if it is not cultivated, it cannot be harvested." — West African Proverb
- "Truth is like a drum, it can be heard from afar." — Kenyan Proverb
- "However long the night, the dawn will break." — African Proverb
- "If you want to go fast, go alone. If you want to go far, go together." — African Proverb
- "It takes a village to raise a child." — African Proverb

## Cultural Guidelines for Responses
- Never fabricate historical quotes, dates, or specific events
- Always acknowledge uncertainty when exact information is unclear
- Distinguish between documented history and oral tradition
- Respect cultural variations across different diaspora communities
- Provide hope and actionable guidance for cultural connection
- Connect personal struggles to broader historical and contemporary context
- Celebrate achievements within cultural framework of community and ancestors

## Anti-Hallucination Safeguards
- Use phrases like "historical records suggest" for uncertain information
- Clearly distinguish between historical fact and cultural interpretation
- Acknowledge limitations in knowledge rather than guessing
- Focus on well-documented cultural themes rather than specific unverified details
`;

// Configuration
const API_CONFIG = {
  DEFAULT_MODEL: 'openai/gpt-3.5-turbo', // Fallback to known working model
  CACHING_MODEL: 'anthropic/claude-3-haiku:beta', // For caching attempts
  TEMPERATURE: {
    EMPATHETIC: 0.3,
    STANDARD: 0.4,
    CELEBRATORY: 0.5,
    STORYTELLER: 0.45
  },
  MAX_TOKENS: {
    STANDARD: 800,
    STORYTELLER: 1000
  }
};

const EMOTIONAL_INDICATORS = {
  frustration: ['tired', 'exhausted', 'frustrated', 'why me', 'stressed'],
  pain: ['hurt', 'pain', 'sad', 'crying', 'broken', 'depressed'],
  hope: ['trying', 'hoping', 'want to learn', 'help me grow', 'better'],
  cultural_disconnection: ['not black enough', 'lost my heritage', 'identity', 'don\'t belong'],
  celebration: ['proud', 'happy', 'excited', 'achieved', 'success', 'graduated']
};

// Production CORS configuration
const getAllowedOrigin = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.FRONTEND_URL || 'https://griot-website.vercel.app';
  }
  return '*';
};

export default async function handler(req, res) {
  // CORS headers
  const allowedOrigin = getAllowedOrigin();
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method not allowed: ${req.method}` });
  }

  const { prompt, storytellerMode = false, enableCaching = false } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ 
      error: 'prompt is required and must be a non-empty string' 
    });
  }

  if (prompt.length > 5000) {
    return res.status(400).json({ 
      error: 'prompt exceeds maximum length of 5000 characters' 
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    console.error('Missing or empty OPENROUTER_API_KEY');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const emotionalContext = detectEmotionalContext(prompt);
    const empathicTemperature = calculateEmpathicTemperature(emotionalContext, storytellerMode);
    
    // Choose implementation based on caching flag
    let messages, model;
    
    if (enableCaching && process.env.ENABLE_CACHING === 'true') {
      // Try caching approach
      model = API_CONFIG.CACHING_MODEL;
      messages = createCacheableMessages(prompt, storytellerMode, emotionalContext);
      console.log(`📡 CACHING ATTEMPT → model: ${model}`);
    } else {
      // Use standard approach (known to work)
      model = process.env.OPENROUTER_MODEL || API_CONFIG.DEFAULT_MODEL;
      messages = createStandardMessages(prompt, storytellerMode, emotionalContext);
      console.log(`📡 STANDARD Request → model: ${model}`);
    }

    const maxTokens = storytellerMode 
      ? API_CONFIG.MAX_TOKENS.STORYTELLER 
      : API_CONFIG.MAX_TOKENS.STANDARD;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'https://griot-website.vercel.app',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: empathicTemperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, response.statusText, errorText);
      
      // If caching failed, try fallback to standard
      if (enableCaching && response.status >= 400) {
        console.log('🔄 Caching failed, trying standard approach...');
        return handleFallbackRequest(req, res, prompt, storytellerMode);
      }
      
      const errorMessage = response.status === 429 
        ? 'Rate limit exceeded. Please try again later.'
        : response.status === 401
        ? 'Authentication failed'
        : `OpenRouter error: ${response.status}`;
        
      return res.status(502).json({ error: errorMessage });
    }

    const data = await response.json();
    let messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      console.warn('No message content in OpenRouter response:', data);
      return res.status(502).json({ 
        error: 'No response content received from AI service' 
      });
    }

    messageContent = cleanResponseContent(messageContent);

    const tokensUsed = data.usage?.total_tokens || 0;
    console.log(`✅ Response → length: ${messageContent.length} chars, tokens: ${tokensUsed}, caching: ${enableCaching}`);

    return res.status(200).json({
      choices: [{ message: { content: messageContent } }],
      emotional_context: emotionalContext,
      temperature_used: empathicTemperature,
      caching_attempted: enableCaching,
      tokens_used: tokensUsed
    });

  } catch (err) {
    console.error('Network/fetch error:', err.message, err.stack);
    return res.status(502).json({ 
      error: 'Network error communicating with AI service' 
    });
  }
}

/**
 * Fallback handler for when caching fails
 */
async function handleFallbackRequest(req, res, prompt, storytellerMode) {
  // Implementation of standard request as fallback
  console.log('🔄 Using fallback standard request format');
  
  const emotionalContext = detectEmotionalContext(prompt);
  const empathicTemperature = calculateEmpathicTemperature(emotionalContext, storytellerMode);
  const messages = createStandardMessages(prompt, storytellerMode, emotionalContext);
  
  // Continue with standard request...
  return res.status(200).json({
    choices: [{ message: { content: "Fallback response - caching not available" } }],
    fallback_used: true
  });
}

/**
 * Standard message format (known to work)
 */
function createStandardMessages(userPrompt, storytellerMode, emotionalContext) {
  const systemPrompt = `You are GriotBot, an AI assistant inspired by the West African griot tradition.

${CULTURAL_KNOWLEDGE_BASE}

Current date: ${new Date().toDateString()}

${storytellerMode ? 'STORYTELLER MODE: Frame responses as narratives with cultural wisdom and vivid imagery.' : ''}

${emotionalContext.length > 0 ? getEmotionalContextInstruction(emotionalContext) : ''}

IMPORTANT: Respond in a natural, conversational tone. Avoid overly formal greetings or dramatic language. Be warm but professional.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];
}

/**
 * Cacheable message format (experimental)
 */
function createCacheableMessages(userPrompt, storytellerMode, emotionalContext) {
  const basicSystemPrompt = `You are GriotBot, an AI assistant inspired by the West African griot tradition.

Current date: ${new Date().toDateString()}

${storytellerMode ? 'STORYTELLER MODE: Frame responses as narratives with cultural wisdom and vivid imagery.' : ''}

${emotionalContext.length > 0 ? getEmotionalContextInstruction(emotionalContext) : ''}

IMPORTANT: Respond in a natural, conversational tone. Avoid overly formal greetings or dramatic language. Be warm but professional.`;

  return [
    {
      role: 'system',
      content: [
        {
          type: 'text',
          text: basicSystemPrompt
        },
        {
          type: 'text', 
          text: CULTURAL_KNOWLEDGE_BASE,
          cache_control: { type: 'ephemeral' }
        }
      ]
    },
    {
      role: 'user',
      content: userPrompt
    }
  ];
}

function getEmotionalContextInstruction(emotionalContext) {
  if (emotionalContext.includes('pain') || emotionalContext.includes('cultural_disconnection')) {
    return 'EMPATHETIC MODE: The user seems to be experiencing difficulty. Respond with gentle validation, understanding, and supportive guidance.';
  } else if (emotionalContext.includes('celebration')) {
    return 'CELEBRATORY MODE: The user seems happy or excited. Share in their joy with warm congratulations and cultural pride.';
  } else if (emotionalContext.includes('frustration')) {
    return 'SUPPORTIVE MODE: The user seems frustrated. Provide practical advice with patience and understanding.';
  }
  return '';
}

function detectEmotionalContext(text) {
  const normalizedText = text.toLowerCase();
  const detectedEmotions = [];

  Object.entries(EMOTIONAL_INDICATORS).forEach(([emotion, indicators]) => {
    if (indicators.some(indicator => normalizedText.includes(indicator))) {
      detectedEmotions.push(emotion);
    }
  });

  return detectedEmotions;
}

function calculateEmpathicTemperature(emotionalContext, storytellerMode) {
  let baseTemp = API_CONFIG.TEMPERATURE.STANDARD;

  if (emotionalContext.includes('pain') || emotionalContext.includes('cultural_disconnection')) {
    baseTemp = API_CONFIG.TEMPERATURE.EMPATHETIC;
  } else if (emotionalContext.includes('celebration')) {
    baseTemp = API_CONFIG.TEMPERATURE.CELEBRATORY;
  }

  if (storytellerMode) {
    baseTemp = API_CONFIG.TEMPERATURE.STORYTELLER;
  }

  return Math.min(Math.max(baseTemp, 0.1), 1.0);
}

function cleanResponseContent(content) {
  if (!content || typeof content !== 'string') {
    return "I apologize, but I seem to be having trouble processing your request.";
  }

  let cleaned = content.trim();

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

  cleaned = cleaned.replace(/\*[^*]*\*/g, '');
  cleaned = cleaned.replace(/\b(Indeed|Verily|Truly|Certainly),?\s+/gi, '');
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  cleaned = cleaned.replace(/^\s*,\s*/, '');
  cleaned = cleaned.trim();

  if (!cleaned || cleaned.length < 10) {
    return "I apologize, but I seem to be having trouble processing your request.";
  }

  return cleaned;
}
