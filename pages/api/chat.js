// File: /pages/api/chat.js - HYBRID STRATEGY

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

    // Smart model selection based on request type
    const modelConfig = selectOptimalModel(prompt, storytellerMode);
    
    console.log('🌿 GriotBot request:', {
      promptLength: prompt.length,
      storytellerMode: storytellerMode,
      selectedModel: modelConfig.model,
      reasoning: modelConfig.reasoning,
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
        model: modelConfig.model,
        messages: [
          { role: 'system', content: modelConfig.systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
        top_p: 0.85,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      // If primary model fails, try fallback
      if (modelConfig.model !== 'meta-llama/llama-3.1-8b-instruct:free') {
        console.log('🔄 Primary model failed, trying free fallback...');
        return await tryFallbackModel(req, res, prompt, storytellerMode, apiKey);
      }
      
      const errorText = await response.text();
      console.error('All models failed:', response.status, errorText);
      return res.status(502).json({ error: 'Service temporarily unavailable. Please try again.' });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || 
                  'I apologize, but I seem to be having trouble processing your request.';

    // Clean response regardless of model
    content = cleanResponse(content);

    console.log('✅ GriotBot response generated:', {
      model: modelConfig.model,
      responseLength: content.length,
      tokensUsed: data.usage?.total_tokens || 'unknown',
      estimatedCost: calculateCost(modelConfig.model, data.usage)
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
 * Intelligently selects the best model based on request characteristics
 */
function selectOptimalModel(prompt, storytellerMode) {
  const promptLength = prompt.length;
  const isComplex = /historical|specific|date|quote|statistics|detailed|explain|analysis/i.test(prompt);
  const isSimple = /hello|hi|thanks|how are you|what is griotbot/i.test(prompt);
  
  // Use free model for simple queries
  if (isSimple && !storytellerMode) {
    return {
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      maxTokens: 150,
      temperature: 0.6,
      systemMessage: createOptimizedSystemMessage(false),
      reasoning: 'simple_query_free_model'
    };
  }
  
  // Use GPT for complex queries, storytelling, or when quality is critical
  if (isComplex || storytellerMode || promptLength > 100) {
    return {
      model: 'openai/gpt-3.5-turbo',
      maxTokens: storytellerMode ? 250 : 180,
      temperature: storytellerMode ? 0.8 : 0.6,
      systemMessage: createOptimizedSystemMessage(storytellerMode),
      reasoning: storytellerMode ? 'storytelling_mode_premium' : 'complex_query_premium'
    };
  }
  
  // Default to free model for general queries
  return {
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    maxTokens: 180,
    temperature: 0.6,
    systemMessage: createOptimizedSystemMessage(false),
    reasoning: 'general_query_free_model'
  };
}

/**
 * Fallback to free model if premium model fails
 */
async function tryFallbackModel(req, res, prompt, storytellerMode, apiKey) {
  try {
    const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://griot-website.vercel.app',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: createOptimizedSystemMessage(storytellerMode) },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      let content = data.choices?.[0]?.message?.content || 'Fallback response unavailable.';
      content = cleanResponse(content);
      
      console.log('✅ Fallback model successful');
      return res.status(200).json({
        choices: [{ message: { content } }]
      });
    }
  } catch (fallbackError) {
    console.error('Fallback model also failed:', fallbackError);
  }
  
  return res.status(502).json({ error: 'Service temporarily unavailable. Please try again.' });
}

/**
 * Calculate estimated cost for monitoring
 */
function calculateCost(model, usage) {
  if (!usage || model.includes(':free')) return '$0.00';
  
  const costs = {
    'openai/gpt-3.5-turbo': {
      input: 0.0005 / 1000,
      output: 0.0015 / 1000
    }
  };
  
  const modelCost = costs[model];
  if (!modelCost) return 'unknown';
  
  const inputCost = (usage.prompt_tokens || 0) * modelCost.input;
  const outputCost = (usage.completion_tokens || 0) * modelCost.output;
  const total = inputCost + outputCost;
  
  return `$${total.toFixed(4)}`;
}

/**
 * Creates optimized system messages
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
  const problematicStarts = [
    /^my child,?\s*/i,
    /^dear child,?\s*/i,
    /^young one,?\s*/i,
    /^listen,?\s*my child,?\s*/i,
    /^ah,?\s*my child,?\s*/i,
    /^come,?\s*child,?\s*/i
  ];
  
  let cleaned = content;
  
  for (const pattern of problematicStarts) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  cleaned = cleaned.trim();
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  cleaned = cleaned.replace(/(\b\w+\b.*?)\1{2,}/gi, '$1');
  
  return cleaned;
}
