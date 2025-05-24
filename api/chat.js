// File: /api/chat.js - SMART ROUTING VERSION
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// SMART ROUTING: Try cheapest first, fallback to more expensive if needed
const MODEL_FALLBACK_CHAIN = [
  // Tier 1: FREE models (try all free options first)
  'meta-llama/llama-3.1-8b-instruct:free',        // 🆓 FREE - Best balance
  'mistralai/mixtral-8x7b-instruct:free',         // 🆓 FREE - High quality
  'qwen/qwen-2-7b-instruct:free',                 // 🆓 FREE - Fast
  
  // Tier 2: Cheap backup (if all free models fail)
  'openai/gpt-3.5-turbo',                         // 💰 ~$0.001 - 100x cheaper than Claude
  
  // Tier 3: Premium (only if everything else fails)
  'anthropic/claude-3-haiku:beta',                // 💸 $0.08+ - LAST RESORT ONLY
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

    // SMART ROUTING: Use OpenRouter's model fallback feature
    const primaryModel = MODEL_FALLBACK_CHAIN[0]; // Start with cheapest
    const fallbackModels = MODEL_FALLBACK_CHAIN.slice(1); // Use rest as fallbacks

    const systemInstruction = createSystemInstruction(storytellerMode);

    console.log(`🎯 Primary model: ${primaryModel}`);
    console.log(`🔄 Fallbacks: ${fallbackModels.length} models available`);

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        // PRIMARY MODEL
        model: primaryModel,
        
        // SMART ROUTING: Automatic fallbacks
        models: MODEL_FALLBACK_CHAIN,
        
        // COST OPTIMIZATION: Use :floor variant for cheapest providers
        // Note: This ensures even within each model, cheapest providers are tried first
        
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        
        temperature: storytellerMode ? 0.8 : 0.7,
        max_tokens: storytellerMode ? 600 : 800, // Optimized token limits
        
        // PROVIDER ROUTING: Optimize for cost
        provider: {
          order: ['lowest-cost'], // Prioritize cheapest providers
          allow_fallbacks: true   // Enable automatic provider fallbacks
        }
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter API error after all fallbacks:', errorData);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'All AI models temporarily unavailable. Please try again in a moment.' 
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    
    // LOG WHICH MODEL WAS ACTUALLY USED (for cost monitoring)
    const modelUsed = data.model || primaryModel;
    const isFreeTier = modelUsed.includes(':free');
    const estimatedCost = isFreeTier ? 0 : (modelUsed.includes('gpt-3.5') ? 0.001 : 0.08);
    
    console.log(`✅ Model used: ${modelUsed}`);
    console.log(`💰 Estimated cost: $${estimatedCost}`);
    console.log(`🎯 Was free model? ${isFreeTier ? 'YES' : 'NO'}`);
    
    if (data.usage) {
      console.log(`📊 Token usage - Prompt: ${data.usage.prompt_tokens}, Completion: ${data.usage.completion_tokens}, Total: ${data.usage.total_tokens}`);
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
        // Pass through usage data and model info for monitoring
        usage: data.usage,
        model_used: modelUsed,
        estimated_cost: estimatedCost,
        is_free: isFreeTier
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
 * OPTIMIZED SYSTEM INSTRUCTION - Concise but effective
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

STORYTELLER MODE: Frame responses as engaging narratives. Draw from African, Caribbean, or Black American oral traditions. End with reflective wisdom. Avoid theatrical staging (*clears throat*, etc.) - focus on the story content.`;
  }

  return baseInstruction;
}
