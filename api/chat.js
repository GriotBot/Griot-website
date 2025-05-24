// File: /api/chat.js - REPLACE IMMEDIATELY TO STOP COSTS
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// 🆓 FREE MODELS FIRST - ZERO COST
const MODEL_FALLBACK_CHAIN = [
  'meta-llama/llama-3.1-8b-instruct:free',        // 🆓 FREE
  'mistralai/mixtral-8x7b-instruct:free',         // 🆓 FREE
  'qwen/qwen-2-7b-instruct:free',                 // 🆓 FREE
  'openai/gpt-3.5-turbo',                         // 💰 ~$0.001 (100x cheaper than Claude)
  'anthropic/claude-3-haiku:beta',                // 💸 LAST RESORT ONLY
];

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

    // 🎯 SMART ROUTING: Try cheapest first, fallback to more expensive
    const primaryModel = MODEL_FALLBACK_CHAIN[0];
    
    const systemInstruction = createSystemInstruction(storytellerMode);

    console.log(`🆓 USING FREE MODEL: ${primaryModel}`);
    console.log(`🔄 Fallbacks available: ${MODEL_FALLBACK_CHAIN.length - 1}`);

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        // PRIMARY: Use FREE model
        model: primaryModel,
        
        // FALLBACK CHAIN: All models in order
        models: MODEL_FALLBACK_CHAIN,
        
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        
        temperature: storytellerMode ? 0.8 : 0.7,
        max_tokens: storytellerMode ? 600 : 800, // REDUCED from 2000
        
        // COST OPTIMIZATION
        provider: {
          allow_fallbacks: true
        }
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter error after all fallbacks:', errorData);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'All AI models temporarily unavailable. Please try again.' 
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    
    // 📊 TRACK WHICH MODEL WAS ACTUALLY USED
    const modelUsed = data.model || primaryModel;
    const isFreeTier = modelUsed.includes(':free');
    const estimatedCost = isFreeTier ? 0 : (modelUsed.includes('gpt-3.5') ? 0.001 : 0.08);
    
    // 🚨 ALERT IF EXPENSIVE MODEL USED
    if (estimatedCost > 0.01) {
      console.warn(`💸 EXPENSIVE MODEL USED: ${modelUsed} - Cost: $${estimatedCost}`);
    } else {
      console.log(`✅ SUCCESS: ${modelUsed} - Cost: $${estimatedCost}`);
    }
    
    if (data.usage) {
      console.log(`📊 Tokens: ${data.usage.total_tokens || 0}`);
    }
    
    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: data.choices[0]?.message?.content || 'No response available.'
            }
          }
        ],
        // 🎯 PASS MONITORING DATA TO FRONTEND
        model_used: modelUsed,
        estimated_cost: estimatedCost,
        is_free: isFreeTier,
        usage: data.usage
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in smart routing chat API:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 🎯 OPTIMIZED SYSTEM INSTRUCTION - NO MORE THEATRICAL STAGING
 */
function createSystemInstruction(storytellerMode) {
  const baseInstruction = `You are GriotBot, an AI assistant inspired by West African griot traditions. Provide culturally rich, empowering responses for Black culture and diaspora experiences.

CORE PRINCIPLES:
- Include Black historical context and cultural wisdom when relevant
- Be warm, respectful, and empowering
- Reference proverbs, figures, or traditions when appropriate
- Address the diversity of African diaspora experiences
- Be emotionally intelligent about racism and identity challenges
- Offer practical wisdom with hope and empowerment

Keep responses concise but meaningful (2-4 paragraphs).`;

  if (storytellerMode) {
    return baseInstruction + `

STORYTELLER MODE: Frame responses as engaging narratives. Draw from African, Caribbean, or Black American oral traditions. End with reflective wisdom. 

IMPORTANT: DO NOT use theatrical staging like "*clears throat*", "*smiles warmly*", "*gestures*" etc. Focus on the story content itself, not performance directions.`;
  }

  return baseInstruction;
}
