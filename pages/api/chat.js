const MODEL = 'anthropic/claude-3-haiku:beta';
const MAX_PROMPT_LENGTH = 5000; // Character limit for prompts

export default async function handler(req, res) {
  // CORS headers - Environment-specific origin
  const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://your-domain.vercel.app' // Replace with your actual domain
    : '*'; // Allow all origins in development

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

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
    return res
      .status(400)
      .json({ error: 'prompt is required and must be a non-empty string' });
  }

  // Check prompt length limit
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res
      .status(400)
      .json({ error: `prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` });
  }

  // Validate API key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    console.error('Missing or empty OPENROUTER_API_KEY');
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Create system instruction with OPTIMIZED PROMPT
  const systemInstruction = createSystemInstruction(storytellerMode);

  // Log request details
  console.log(`📡 Request → model: ${MODEL}, promptLength: ${prompt.length}, storyteller: ${storytellerMode}`);

  try {
    // Call OpenRouter API
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt },
          ],
          temperature: storytellerMode ? 0.8 : 0.7,
          max_tokens: storytellerMode ? 2500 : 2000, // Slightly more tokens for storytelling
        }),
      }
    );

    // Handle OpenRouter API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, response.statusText, errorText);
      
      // Return appropriate error based on status code
      const errorMessage = response.status === 429 
        ? 'Rate limit exceeded. Please try again later.'
        : response.status === 401
        ? 'Authentication failed'
        : `OpenRouter error: ${response.status}`;
        
      return res
        .status(502)
        .json({ error: errorMessage });
    }

    // Parse and validate response
    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      console.warn('No message content in OpenRouter response:', data);
      return res
        .status(502)
        .json({ error: 'No response content received from AI service' });
    }

    // Log successful response
    console.log(`✅ Response → length: ${messageContent.length} chars`);

    // Return response in expected format
    return res.status(200).json({
      choices: [{ message: { content: messageContent } }],
    });

  } catch (err) {
    console.error('Network/fetch error:', err.message, err.stack);
    
    // Return generic network error (don't expose internal error details)
    return res
      .status(502)
      .json({ error: 'Network error communicating with AI service' });
  }
}

/**
 * Creates system instruction with OPTIMIZED CULTURAL PROMPT
 * @param {boolean} storytellerMode - Whether to enable storyteller mode
 * @returns {string} System instruction text
 */
function createSystemInstruction(storytellerMode) {
  const currentDate = new Date().toDateString();
  
  // OPTIMIZED GRIOTBOT PROMPT - Cultural depth with conciseness emphasis
  const baseInstruction = `You are GriotBot, a wise digital griot rooted in African diaspora traditions. Provide culturally grounded guidance with warmth and historical knowledge.

KEY BEHAVIORS:
• BE CONCISE - Match response length to question complexity (1-3 sentences for simple facts)
• Ground responses in Black histories and diaspora experiences  
• Honor diversity (African American, Afro-Caribbean, Afro-Latinx, continental African)
• Add proverbs or cultural context only when specifically relevant (not for basic facts)
• Handle sensitive topics with empathy, not sensationalism
• Admit uncertainty honestly: "I want to be certain about this history..."
• Never fabricate historical facts, dates, or quotes

KNOWLEDGE AREAS: Civil Rights, Harlem Renaissance, Reconstruction, Haitian Revolution, Pan-African thought, contemporary diaspora culture.

Respond with griot wisdom—be a keeper of stories and bridge between past and present. Keep responses respectful, authentic, and appropriately brief.

Current date: ${currentDate}`;

  if (storytellerMode) {
    return baseInstruction + `

STORYTELLER MODE ACTIVATED:
Frame your response as a narrative drawing from African diaspora oral traditions. Use vivid imagery, cultural metaphors, and conclude with a reflective insight that connects to the user's question. Speak as if sharing wisdom around a gathering fire, weaving the story with the rhythm and depth of traditional griot storytelling.`;
  }

  return baseInstruction;
}
