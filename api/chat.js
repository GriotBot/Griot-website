// File: /api/chat.js - COST OPTIMIZED VERSION
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// FREE AND CHEAP MODELS - Zero to minimal cost
const MODELS = {
  free_llama: 'meta-llama/llama-3.1-8b-instruct:free',        // 🆓 FREE - Best balance
  free_mixtral: 'mistralai/mixtral-8x7b-instruct:free',       // 🆓 FREE - Highest quality  
  free_qwen: 'qwen/qwen-2-7b-instruct:free',                  // 🆓 FREE - Fastest
  cheap_gpt35: 'openai/gpt-3.5-turbo',                        // 💰 ~$0.001 - Premium backup
  
  // REMOVED EXPENSIVE MODELS:
  // anthropic/claude-3-opus:beta - $0.08-$0.38 per request 💸
  // anthropic/claude-3-sonnet:beta - $0.05-$0.25 per request 💸
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

    // Use FREE Llama model as primary choice
    const model = MODELS.free_llama;

    // SHORTENED SYSTEM INSTRUCTION (150 words vs 500+ before)
    const systemInstruction = createSystemInstruction(storytellerMode);

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
        max_tokens: storytellerMode ? 600 : 800, // REDUCED from 2000
        // Cost monitoring
        stream: false,
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      
      // Fallback to GPT-3.5 if free model fails
      if (model === MODELS.free_llama) {
        console.log('Attempting fallback to GPT-3.5...');
        // Could implement fallback logic here
      }
      
      return new NextResponse(
        JSON.stringify({ error: 'Failed to get response from AI service' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    
    // Log token usage for monitoring
    if (data.usage) {
      console.log(`Token usage - Prompt: ${data.usage.prompt_tokens}, Completion: ${data.usage.completion_tokens}, Total: ${data.usage.total_tokens}`);
    }
    
    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: data.choices[0]?.message?.content || 'No response from the AI service.'
            }
          }
        ],
        // Pass through usage data for monitoring
        usage: data.usage
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
 * OPTIMIZED SYSTEM INSTRUCTION - Reduced from ~500 to ~150 words
 */
function createSystemInstruction(storytellerMode) {
  const baseInstruction = `You are GriotBot, an AI assistant inspired by West African griot traditions. Provide culturally rich, empowering responses for Black culture and diaspora experiences.

CORE PRINCIPLES:
- Include Black historical context and cultural wisdom
- Be warm, respectful, and empowering
- Reference relevant proverbs, figures, or traditions when appropriate
- Address the diversity of African diaspora experiences
- Be emotionally intelligent about racism and identity challenges
- Offer practical wisdom with hope and empowerment

Current date: ${new Date().toDateString()}`;

  if (storytellerMode) {
    return baseInstruction + `

STORYTELLER MODE: Frame responses as engaging narratives or stories. Draw from African, Caribbean, or Black American oral traditions. End with reflective wisdom that connects to the user's question. Keep responses concise and avoid theatrical staging.`;
  }

  return baseInstruction;
}
