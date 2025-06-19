// File: /pages/api/chat.js - With Conversation Memory
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

  // UPDATED: Now accepts conversation history
  const { 
    prompt, 
    storytellerMode = false, 
    conversationHistory = [] // NEW: Array of previous messages
  } = req.body || {};

  console.log(`📨 Received request: prompt="${prompt?.substring(0, 50)}...", historyLength=${conversationHistory.length}, storyteller=${storytellerMode}`);

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Web search detection (check current prompt + recent context)
  const webSearchTriggers = [
    'current', 'recent', 'latest', 'today', 'this year', 'happening now',
    'new research', 'recent studies', 'current events', 'breaking news',
    'what\'s happening', 'right now', '2024', '2025'
  ];
  
  // Check both current prompt and recent conversation for web search triggers
  const recentContext = conversationHistory.slice(-2).map(msg => msg.content).join(' ');
  const contextToCheck = (prompt + ' ' + recentContext).toLowerCase();
  
  const shouldUseWebSearch = webSearchTriggers.some(trigger => 
    contextToCheck.includes(trigger)
  );

  // Build conversation messages for AI
  const messages = [
    {
      role: 'system',
      content: createSystemInstruction(storytellerMode, shouldUseWebSearch)
    }
  ];

  // Add conversation history (limit to last 10 messages to control costs)
  const recentHistory = conversationHistory.slice(-10);
  messages.push(...recentHistory);

  // Add current user message
  messages.push({
    role: 'user',
    content: prompt
  });

  // Select model based on web search need
  let baseModel = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324:free';
  let model = shouldUseWebSearch ? `${baseModel}:online` : baseModel;

  const requestBody = {
    model: model,
    messages: messages,
    temperature: storytellerMode ? 0.45 : 0.4,
    max_tokens: storytellerMode ? 600 : 500
  };

  console.log(`📡 Request → model: ${model}, webSearch: ${shouldUseWebSearch}, historyLength: ${recentHistory.length}, storyteller: ${storytellerMode}`);

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
                content: fallbackContent + "\n\n*Note: I couldn't access current web information for this query.*"
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

    console.log(`✅ Response → length: ${messageContent.length} chars, webSearch: ${shouldUseWebSearch}, contextual: ${recentHistory.length > 0}`);

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
    'Maintain conversation context and refer to previous messages when relevant.',
    'If a user asks a follow-up question, consider the conversation history to provide contextual answers.',
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
