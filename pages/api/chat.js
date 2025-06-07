// File: /pages/api/chat.js - Debug Version
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://griot-website.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, storytellerMode = false } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Web search detection
  const webSearchTriggers = [
    'current', 'recent', 'latest', 'today', 'this year', 'happening now',
    'new research', 'recent studies', 'current events', 'breaking news'
  ];
  
  const shouldUseWebSearch = webSearchTriggers.some(trigger => 
    prompt.toLowerCase().includes(trigger)
  );

  console.log(`🔍 Debug: shouldUseWebSearch = ${shouldUseWebSearch} for prompt: "${prompt.substring(0, 50)}..."`);

  // TEST BOTH METHODS
  if (shouldUseWebSearch) {
    // Method 1: Try :online suffix (might work better)
    const onlineResult = await testOnlineMethod(apiKey, prompt, storytellerMode);
    if (onlineResult) {
      console.log('✅ :online method worked');
      return res.status(200).json(onlineResult);
    }

    // Method 2: Try plugins method
    const pluginResult = await testPluginMethod(apiKey, prompt, storytellerMode);
    if (pluginResult) {
      console.log('✅ Plugin method worked');
      return res.status(200).json(pluginResult);
    }

    // Both failed, fall back to standard
    console.log('❌ Both web search methods failed, falling back...');
  }

  // Standard fallback
  return await standardResponse(apiKey, prompt, storytellerMode, res);
}

// Method 1: :online suffix
async function testOnlineMethod(apiKey, prompt, storytellerMode) {
  try {
    console.log('🧪 Testing :online method...');
    
    const model = (process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo') + ':online';
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'system',
          content: createSystemInstruction(storytellerMode, true)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: storytellerMode ? 0.45 : 0.4,
      max_tokens: storytellerMode ? 600 : 500
    };

    console.log(`🧪 Online method using model: ${model}`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://griot-website.vercel.app',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`🧪 Online method response: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Online method failed: ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    if (data.choices?.[0]?.message?.content) {
      return {
        choices: [{
          message: {
            content: data.choices[0].message.content
          }
        }]
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Online method error:', error.message);
    return null;
  }
}

// Method 2: Plugin method
async function testPluginMethod(apiKey, prompt, storytellerMode) {
  try {
    console.log('🧪 Testing plugin method...');
    
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'system',
          content: createSystemInstruction(storytellerMode, true)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: storytellerMode ? 0.45 : 0.4,
      max_tokens: storytellerMode ? 600 : 500,
      plugins: [{
        id: 'web',
        max_results: 2, // Fewer results to reduce chance of error
        search_prompt: 'Find current information relevant to African diaspora culture and Black communities.'
      }]
    };

    console.log(`🧪 Plugin method using model: ${model}`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://griot-website.vercel.app',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`🧪 Plugin method response: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Plugin method failed: ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    if (data.choices?.[0]?.message?.content) {
      return {
        choices: [{
          message: {
            content: data.choices[0].message.content
          }
        }]
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Plugin method error:', error.message);
    return null;
  }
}

// Standard fallback
async function standardResponse(apiKey, prompt, storytellerMode, res) {
  try {
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'system',
          content: createSystemInstruction(storytellerMode, false)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: storytellerMode ? 0.45 : 0.4,
      max_tokens: storytellerMode ? 600 : 500
    };

    console.log(`📡 Standard fallback using model: ${model}`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://griot-website.vercel.app',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Standard response failed:', response.status, errorText);
      return res.status(502).json({ 
        error: `Unable to process your request (Error ${response.status}).`
      });
    }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      return res.status(200).json({
        choices: [{
          message: {
            content: "I'm here to help, but I didn't receive a complete response. Could you try asking your question again?"
          }
        }]
      });
    }

    console.log(`✅ Standard response successful`);
    return res.status(200).json({
      choices: [{
        message: {
          content: messageContent
        }
      }]
    });

  } catch (error) {
    console.error('Standard response error:', error.message);
    return res.status(200).json({
      choices: [{
        message: {
          content: "I'm experiencing a technical difficulty right now. Please try again in a moment, and I'll be ready to help you explore culture, history, and wisdom."
        }
      }]
    });
  }
}

function createSystemInstruction(storytellerMode, hasWebSearch = false) {
  const currentDate = new Date().toDateString();
  
  const baseInstructions = [
    'You are GriotBot, an AI assistant inspired by the West African griot tradition.',
    'Provide culturally rich, concise responses with respect and clarity.',
    'Break text into clear paragraphs. Avoid meta-statements.',
    `Current date: ${currentDate}`
  ];

  if (hasWebSearch) {
    baseInstructions.push('You have access to current web information to enhance your cultural responses with up-to-date context.');
  }

  if (storytellerMode) {
    baseInstructions.push(
      '', 
      'STORYTELLER MODE:',
      'Frame your answer as a narrative from African diaspora traditions.',
      'Use vivid imagery, cultural references, and end with a reflective insight.'
    );
  }

  return baseInstructions.join('\n');
}
