// File: /pages/api/chat.js - Optimized Online Method
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
    'new research', 'recent studies', 'current events', 'breaking news',
    'what\'s happening', 'right now', '2024', '2025'
  ];
  
  const shouldUseWebSearch = webSearchTriggers.some(trigger => 
    prompt.toLowerCase().includes(trigger)
  );

  // Select model and method
  let baseModel = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
  let model = shouldUseWebSearch ? `${baseModel}:online` : baseModel;

  const requestBody = {
    model: model,
    messages: [
      {
        role: 'system',
        content: createSystemInstruction(storytellerMode, shouldUseWebSearch)
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: storytellerMode ? 0.45 : 0.4,
    max_tokens: storytellerMode ? 600 : 500
  };

  console.log(`📡 Request → model: ${model}, webSearch: ${shouldUseWebSearch}, storyteller: ${storytellerMode}`);

  try {
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

    console.log(`📡 Response status: ${response.status}`);

    // If web search fails, automatically retry without it
    if (!response.ok && shouldUseWebSearch) {
      console.log('🔄 Web search failed, retrying without...');
      
      const fallbackBody = {
        ...requestBody,
        model: baseModel // Remove :online suffix
      };

      const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://griot-website.vercel.app',
          'X-Title': 'GriotBot'
        },
        body: JSON.stringify(fallbackBody)
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const fallbackContent = fallbackData.choices?.[0]?.message?.content;
        
        if (fallbackContent) {
          console.log('✅ Fallback successful');
          return res.status(200).json({
            choices: [{
              message: {
                content: fallbackContent + "\n\n*Note: I couldn't access current web information, but I've provided the best cultural context from my knowledge. For the latest updates, you might want to check recent news sources.*"
              }
            }]
          });
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
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

    console.log(`✅ Response → length: ${messageContent.length} chars, webSearch: ${shouldUseWebSearch}`);

    return res.status(200).json({
      choices: [{
        message: {
          content: messageContent
        }
      }]
    });

  } catch (error) {
    console.error('Network error:', error.message);
    
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
    baseInstructions.push('You have access to current web information. Use it to provide up-to-date cultural context, recent events, and contemporary developments in African diaspora communities.');
  }

  if (storytellerMode) {
    baseInstructions.push(
      '', 
      'STORYTELLER MODE:',
      'Frame your answer as a narrative from African diaspora traditions.',
      'Use vivid imagery, cultural references, and end with a reflective insight.',
      'Draw from oral storytelling techniques while maintaining authenticity.'
    );
  }

  return baseInstructions.join('\n');
}
