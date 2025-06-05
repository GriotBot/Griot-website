// File: /pages/api/chat.js - OPTIMIZED FOR SPEED & QUALITY

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
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

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Create optimized system message
    const systemMessage = createOptimizedSystemMessage(storytellerMode);
    
    console.log('🌿 GriotBot request:', {
      promptLength: prompt.length,
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
        model: 'openai/gpt-3.5-turbo', // Switch back to GPT for speed and quality
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: storytellerMode ? 250 : 180, // Reduced for conciseness
        temperature: storytellerMode ? 0.8 : 0.6, // Lower for more focused responses
        top_p: 0.85, // Slightly more focused
        frequency_penalty: 0.1, // Reduce repetition
        presence_penalty: 0.1 // Encourage diverse vocabulary
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      
      let errorMessage = 'Service temporarily unavailable. Please try again.';
      if (response.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (response.status === 401) {
        errorMessage = 'Authentication error. Please try again later.';
      }
      
      return res.status(502).json({ error: errorMessage });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || 
                  'I apologize, but I seem to be having trouble processing your request.';

    // Post-process to remove problematic patterns
    content = cleanResponse(content);

    // Log successful response
    console.log('✅ GriotBot response generated:', {
      responseLength: content.length,
      tokensUsed: data.usage?.total_tokens || 'unknown'
    });

    return res.status(200).json({
      choices: [{ message: { content } }]
    });

  } catch (error) {
    console.error('GriotBot API error:', error.message);
    return res.status(500).json({ 
      error: 'Internal server error. Please try again.' 
    });
  }
}

/**
 * Creates an optimized system message that produces concise, appropriate responses
 */
function createOptimizedSystemMessage(storytellerMode) {
  const currentDate = new Date().toDateString();
  
  if (storytellerMode) {
    return `You are GriotBot, a digital griot. Tell a brief story (2-3 paragraphs) that answers the user's question using African, Caribbean, or African American storytelling traditions. Include cultural wisdom and end with a meaningful lesson. Be concise but vivid. Avoid starting with "my child" or overly formal language. Current date: ${currentDate}`;
  }
  
  return `You are GriotBot, an AI assistant focused on African diaspora culture and empowerment. Provide helpful, culturally informed responses in 1-2 paragraphs. Be warm but direct. Include relevant cultural context when appropriate. Avoid starting responses with "my child" or overly formal greetings. Be conversational and supportive. Current date: ${currentDate}`;
}

/**
 * Cleans response to remove problematic patterns
 */
function cleanResponse(content) {
  // Remove common problematic openings
  const problematicStarts = [
    /^my child,?\s*/i,
    /^dear child,?\s*/i,
    /^young one,?\s*/i,
    /^listen,?\s*my child,?\s*/i,
    /^ah,?\s*my child,?\s*/i,
    /^come,?\s*child,?\s*/i
  ];
  
  let cleaned = content;
  
  // Remove problematic starts
  for (const pattern of problematicStarts) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  // Trim whitespace and ensure proper capitalization
  cleaned = cleaned.trim();
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  // Remove excessive repetition of phrases
  cleaned = cleaned.replace(/(\b\w+\b.*?)\1{2,}/gi, '$1');
  
  return cleaned;
}
