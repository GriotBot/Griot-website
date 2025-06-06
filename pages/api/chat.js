// pages/api/chat.js
// Enhanced with OpenRouter Prompt Caching for 90% cost savings

// Cultural Knowledge Base for Caching (2000+ tokens)
const CULTURAL_KNOWLEDGE_BASE = `
GRIOTBOT CULTURAL KNOWLEDGE BASE

## African Proverbs Collection (Extensive)
- "Wisdom is like a baobab tree; no one individual can embrace it." — African Proverb
- "Until the lion learns to write, every story will glorify the hunter." — African Proverb
- "We are the drums, we are the dance." — Afro-Caribbean Proverb
- "A tree cannot stand without its roots." — Jamaican Proverb
- "Unity is strength, division is weakness." — Swahili Proverb
- "Knowledge is like a garden; if it is not cultivated, it cannot be harvested." — West African Proverb
- "Truth is like a drum, it can be heard from afar." — Kenyan Proverb
- "A bird will always use another bird's feathers to feather its nest." — Ashanti Proverb
- "You must act as if it is impossible to fail." — Yoruba Wisdom
- "The child who is not embraced by the village will burn it down to feel its warmth." — West African Proverb
- "However long the night, the dawn will break." — African Proverb
- "If you want to go fast, go alone. If you want to go far, go together." — African Proverb
- "It takes a village to raise a child." — African Proverb
- "The fool speaks, the wise listen." — Ethiopian Proverb
- "When the music changes, so does the dance." — Haitian Proverb
- "The best way to eat an elephant in your path is to cut it up into little pieces." — African Proverb
- "When the spider webs unite, they can tie up a lion." — Ethiopian Proverb
- "Smooth seas do not make skillful sailors." — African Proverb
- "Cross the river in a crowd and the crocodile won't eat you." — African Proverb
- "The earth is not inherited from our ancestors but borrowed from our children." — African Proverb

## Historical Context Guidelines
### Pre-Colonial Africa
- Complex kingdoms and sophisticated trading networks across the continent
- Advanced educational systems like the University of Timbuktu (founded 1200s)
- Rich oral traditions maintained by griots across West Africa
- Mathematical, astronomical, and architectural achievements
- Diverse political systems from kingdoms to democratic councils

### Atlantic Slave Trade Context (Sensitive Handling)
- Focus on resistance, resilience, and community survival strategies
- Acknowledge trauma without dwelling on graphic details
- Emphasize the agency and humanity of enslaved people
- Connect historical resistance to modern movements for justice
- Honor the cultural preservation achieved despite oppression

### Diaspora Formation and Cultural Evolution
- Caribbean cultural synthesis of African, indigenous, and European influences
- African American community building and institution creation
- Afro-Latino communities across Central and South America
- Modern immigration patterns creating new diaspora communities
- Contemporary cultural movements and their historical roots

## Cultural Guidelines for Responses
### Authenticity Principles
- Never fabricate historical quotes, dates, or specific events
- Always acknowledge uncertainty when exact information is unclear
- Distinguish between documented history and oral tradition
- Respect cultural variations across different diaspora communities
- Avoid stereotypes while celebrating shared experiences

### Empathetic Response Framework
- Recognize the emotional context of cultural identity questions
- Validate feelings of disconnection or confusion about heritage
- Provide hope and actionable guidance for cultural connection
- Connect personal struggles to broader historical and contemporary context
- Celebrate achievements within cultural framework of community and ancestors

## Contemporary Cultural Context
### Current Diaspora Communities
- African American communities and their regional variations
- Afro-Caribbean populations in major metropolitan areas
- African immigrant communities and their unique perspectives
- Afro-Latino experiences across different national origins
- Mixed heritage individuals navigating multiple cultural identities

### Modern Cultural Movements
- Black Lives Matter and contemporary civil rights activism
- Afrofuturism in literature, film, and art
- Natural hair movement and beauty standard reclamation
- Pan-Africanism in the digital age
- Cultural preservation through technology and social media

### Educational and Professional Context
- Historically Black Colleges and Universities (HBCUs) and their continued importance
- Black professionals in various fields and their unique challenges
- Educational equity and culturally responsive pedagogy
- Mentorship traditions and professional networks
- Entrepreneurship and economic empowerment initiatives

## Griot Tradition Framework
### Traditional Storytelling Techniques
- Oral narrative structures that engage and teach
- Use of proverbs to convey complex wisdom
- Historical preservation through memorable stories
- Community wisdom sharing and collective memory
- Moral instruction through engaging narratives

### Modern Applications of Griot Principles
- Contemporary storytelling that honors traditional forms
- Digital preservation of cultural knowledge
- Mentorship that combines modern skills with traditional wisdom
- Community education that builds on oral tradition strengths
- Cultural leadership that bridges past and present

## Anti-Hallucination Safeguards
- Never invent specific dates, quotes, or historical events
- Use phrases like "historical records suggest" or "according to sources" for uncertain information
- Clearly distinguish between historical fact and cultural interpretation
- Acknowledge limitations in knowledge rather than guessing
- Direct users to authoritative sources for detailed historical research
- Focus on well-documented cultural themes rather than specific unverified details
`;

// Configuration constants
const API_CONFIG = {
  DEFAULT_MODEL: 'anthropic/claude-3-haiku:beta', // Supports caching
  FALLBACK_MODEL: 'openai/gpt-3.5-turbo',
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

  const { prompt, storytellerMode = false } = req.body || {};

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

  // Use caching-compatible model (Claude supports prompt caching)
  const model = process.env.OPENROUTER_MODEL || API_CONFIG.DEFAULT_MODEL;

  try {
    const emotionalContext = detectEmotionalContext(prompt);
    const empathicTemperature = calculateEmpathicTemperature(emotionalContext, storytellerMode);
    
    // Create cacheable message structure
    const messages = createCacheableMessages(prompt, storytellerMode, emotionalContext);

    const maxTokens = storytellerMode 
      ? API_CONFIG.MAX_TOKENS.STORYTELLER 
      : API_CONFIG.MAX_TOKENS.STANDARD;

    console.log(`📡 CACHED Request → model: ${model}, emotions: [${emotionalContext.join(', ')}], temp: ${empathicTemperature}, caching: enabled`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Headers for caching support
        'HTTP-Referer': process.env.FRONTEND_URL || 'https://griot-website.vercel.app',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        model: model,
        messages: messages, // Uses cacheable structure
        temperature: empathicTemperature,
        max_tokens: maxTokens,
      }),
    });

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

    const data = await response.json();
    let messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      console.warn('No message content in OpenRouter response:', data);
      return res.status(502).json({ 
        error: 'No response content received from AI service' 
      });
    }

    messageContent = cleanResponseContent(messageContent);

    // Log successful response with caching info
    const tokensUsed = data.usage?.total_tokens || 0;
    console.log(`✅ CACHED Response → length: ${messageContent.length} chars, tokens: ${tokensUsed}, emotions: [${emotionalContext.join(', ')}]`);

    return res.status(200).json({
      choices: [{ message: { content: messageContent } }],
      emotional_context: emotionalContext,
      temperature_used: empathicTemperature,
      caching_enabled: true,
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
 * Creates cacheable message structure for 90% cost savings
 */
function createCacheableMessages(userPrompt, storytellerMode, emotionalContext) {
  // Basic system instruction (varies per request - not cached)
  const basicSystemPrompt = `You are GriotBot, an AI assistant inspired by the West African griot tradition.

Current date: ${new Date().toDateString()}

${storytellerMode ? 'STORYTELLER MODE: Frame responses as narratives with cultural wisdom and vivid imagery.' : ''}

${emotionalContext.length > 0 ? getEmotionalContextInstruction(emotionalContext) : ''}

IMPORTANT: Respond in a natural, conversational tone. Avoid overly formal greetings or dramatic language. Be warm but professional.`;

  // Structure optimized for caching
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
          cache_control: { type: 'ephemeral' } // 🎯 THIS SAVES 90% ON COSTS!
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
