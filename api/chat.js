// File: /api/chat.js
import { NextResponse } from 'next/server';

/**
 * GriotBot Chat API handler - OPTIMIZED FOR FREE/CHEAP MODELS
 */
export const config = {
  runtime: 'edge',
};

// FREE AND ULTRA-CHEAP MODEL OPTIONS
const MODELS = {
  // 🆓 COMPLETELY FREE MODELS
  free_llama: 'meta-llama/llama-3.1-8b-instruct:free',        // FREE unlimited
  free_mixtral: 'mistralai/mixtral-8x7b-instruct:free',       // FREE unlimited
  free_qwen: 'qwen/qwen-2-7b-instruct:free',                  // FREE unlimited
  
  // 💰 ULTRA-CHEAP MODELS (use if free models don't work well)
  cheap_gpt35: 'openai/gpt-3.5-turbo',                        // ~$0.001 per request
  cheap_claude_haiku: 'anthropic/claude-3-haiku:beta',        // ~$0.0005 per request
  
  // 🚫 EXPENSIVE MODELS (avoid during testing)
  expensive_sonnet: 'anthropic/claude-3.7-sonnet:beta',       // $0.08-$0.38 per request
  expensive_opus: 'anthropic/claude-3-opus:beta',             // $0.15+ per request
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

    // 🆓 USE FREE MODEL - CHANGE THIS LINE TO SWITCH MODELS
    const model = MODELS.free_llama; // Start with completely free model
    
    // 📝 OPTIMIZED SHORTER SYSTEM PROMPT (to reduce token usage)
    const systemInstruction = createOptimizedSystemInstruction(storytellerMode);

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: storytellerMode ? 0.8 : 0.7,
        max_tokens: storytellerMode ? 600 : 800, // Even shorter for storyteller mode
        // Add OpenRouter-specific free tier settings
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to get response from AI service' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
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
    console.error('Error in chat API:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 📝 OPTIMIZED SYSTEM PROMPT - Much shorter to reduce token costs
 */
function createOptimizedSystemInstruction(storytellerMode) {
  const baseInstruction = `You are GriotBot, an AI inspired by West African griots. Provide culturally rich responses for people of African descent.

Key principles:
- Include Black historical context and cultural wisdom
- Be warm, respectful, and empowering
- Reference notable figures, proverbs when relevant
- Acknowledge diaspora diversity (African American, Afro-Caribbean, etc.)
- Be emotionally intelligent about racism and identity topics
- Offer uplifting guidance and hope

Keep responses concise but meaningful (under 200 words when possible).`;

  if (storytellerMode) {
    return baseInstruction + `

STORYTELLER MODE: 
- Frame your response as a brief story or narrative
- NO staging directions (avoid: *clears throat*, **smiles warmly**, etc.)
- Get straight to the story content
- Keep it concise (under 150 words)
- End with a clear lesson or wisdom
- Use natural storytelling language, not theatrical descriptions`;
  }

  return baseInstruction;
}

// 🔧 ALTERNATIVE MODELS TO TEST (in order of preference):
/*
PRIORITY 1 - FREE MODELS (try these first):
- meta-llama/llama-3.1-8b-instruct:free
- mistralai/mixtral-8x7b-instruct:free  
- qwen/qwen-2-7b-instruct:free

PRIORITY 2 - ULTRA-CHEAP (if free models don't work well):
- openai/gpt-3.5-turbo (~$0.001 per request)
- anthropic/claude-3-haiku:beta (~$0.0005 per request)

AVOID (too expensive for testing):
- anthropic/claude-3.7-sonnet:beta
- anthropic/claude-3-opus:beta
*/
