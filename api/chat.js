// File: /api/chat.js - DEBUG VERSION TO VERIFY MODEL SWITCH
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// FREE MODELS - MAKE SURE THESE ARE BEING USED
const MODELS = {
  free_llama: 'meta-llama/llama-3.1-8b-instruct:free',
  free_mixtral: 'mistralai/mixtral-8x7b-instruct:free',
  cheap_gpt35: 'openai/gpt-3.5-turbo',
  // EXPENSIVE - AVOID THESE
  expensive_haiku: 'anthropic/claude-3-haiku:beta',
  expensive_sonnet: 'anthropic/claude-3.7-sonnet:beta',
};

export default async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return new NextResponse(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { prompt, storytellerMode = false } = body;

    if (!prompt || typeof prompt !== 'string') {
      return new NextResponse(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new NextResponse(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🆓 SWITCH TO FREE MODEL HERE
    const model = MODELS.free_llama; // ⚠️ CHANGE THIS LINE TO SWITCH MODELS
    
    // 🐛 DEBUG: Log which model we're using
    console.log('🤖 Using model:', model);
    console.log('💰 Expected cost: FREE');
    
    const systemInstruction = createOptimizedSystemInstruction(storytellerMode);

    const requestBody = {
      model: model,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: storytellerMode ? 0.8 : 0.7,
      max_tokens: storytellerMode ? 400 : 600, // Keep responses short
    };

    // 🐛 DEBUG: Log the request
    console.log('📤 Request to OpenRouter:', JSON.stringify(requestBody, null, 2));

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'GriotBot-Free'
      },
      body: JSON.stringify(requestBody)
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('❌ OpenRouter API error:', errorData);
      
      // If free model fails, fallback to cheap GPT-3.5
      if (model.includes(':free')) {
        console.log('🔄 Free model failed, trying GPT-3.5...');
        return handleFallback(req, prompt, storytellerMode, apiKey);
      }
      
      return new NextResponse(
        JSON.stringify({ error: 'Failed to get response from AI service' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    
    // 🐛 DEBUG: Log the response
    console.log('📥 Response from OpenRouter:', {
      model: data.model,
      usage: data.usage,
      cost: data.usage ? 'Should be $0.00' : 'Unknown'
    });

    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: data.choices[0]?.message?.content || 'No response from the AI service.'
            }
          }
        ]
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Error in chat API:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Fallback to cheap model if free model fails
async function handleFallback(req, prompt, storytellerMode, apiKey) {
  console.log('🆘 Using fallback: GPT-3.5-turbo');
  
  const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
      'X-Title': 'GriotBot-Fallback'
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: createOptimizedSystemInstruction(storytellerMode) },
        { role: 'user', content: prompt }
      ],
      temperature: storytellerMode ? 0.8 : 0.7,
      max_tokens: storytellerMode ? 400 : 600,
    })
  });

  const fallbackData = await fallbackResponse.json();
  
  return new NextResponse(
    JSON.stringify({
      choices: [
        {
          message: {
            content: fallbackData.choices[0]?.message?.content || 'Fallback response failed.'
          }
        }
      ]
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

function createOptimizedSystemInstruction(storytellerMode) {
  const baseInstruction = `You are GriotBot, an AI inspired by West African griots. Provide culturally rich, concise responses for people of African descent.

Key principles:
- Include Black historical context and cultural wisdom
- Be warm, respectful, and empowering  
- Reference notable figures, proverbs when relevant
- Acknowledge diaspora diversity (African American, Afro-Caribbean, etc.)
- Be emotionally intelligent about racism and identity topics
- Offer uplifting guidance and hope

Keep responses concise (under 150 words).`;

  if (storytellerMode) {
    return baseInstruction + `

STORYTELLER MODE: 
- Frame response as a brief story or narrative
- NO staging directions (avoid: *clears throat*, **smiles warmly**, etc.)
- Get straight to the story content
- Keep it very concise (under 100 words)
- End with a clear lesson or wisdom
- Use natural storytelling language, not theatrical descriptions`;
  }

  return baseInstruction;
}
