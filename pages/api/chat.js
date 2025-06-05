// File: /pages/api/chat.js - ULTRA SIMPLE DEBUG VERSION

export default async function handler(req, res) {
  console.log('🚀 API CALLED - Method:', req.method);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request handled');
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    console.log('❌ Wrong method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('📝 Parsing request body...');
    const { prompt } = req.body || {};
    console.log('📝 Prompt received:', prompt ? 'YES' : 'NO');
    
    if (!prompt) {
      console.log('❌ No prompt provided');
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    console.log('🔑 Checking API key...');
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key length:', apiKey ? apiKey.length : 0);
    console.log('🔑 API Key prefix:', apiKey ? apiKey.substring(0, 15) : 'NONE');
    
    if (!apiKey) {
      console.log('❌ No API key found in environment');
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    console.log('📤 Making request to OpenRouter...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });
    
    console.log('📥 OpenRouter response status:', response.status);
    console.log('📥 OpenRouter response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ OpenRouter error body:', errorText);
      console.log('❌ OpenRouter error status:', response.status);
      console.log('❌ OpenRouter error headers:', Object.fromEntries(response.headers));
      
      return res.status(502).json({ 
        error: `OpenRouter API error: ${response.status} - ${errorText}`
      });
    }
    
    const data = await response.json();
    console.log('✅ OpenRouter response received');
    console.log('✅ Response has choices:', !!data.choices);
    console.log('✅ First choice has message:', !!data.choices?.[0]?.message);
    console.log('✅ Message has content:', !!data.choices?.[0]?.message?.content);
    
    const content = data.choices?.[0]?.message?.content || 'No response generated';
    console.log('✅ Content length:', content.length);
    console.log('✅ Content preview:', content.substring(0, 100));
    
    return res.status(200).json({
      choices: [{ message: { content } }]
    });
    
  } catch (error) {
    console.log('💥 Unexpected error:', error.message);
    console.log('💥 Error stack:', error.stack);
    
    return res.status(500).json({ 
      error: `Server error: ${error.message}`
    });
  }
}
