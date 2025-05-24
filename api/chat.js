// File: /api/chat.js - GPT-3.5-TURBO EXCLUSIVE (FINAL DECISION)
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// 🎯 FINAL DECISION: GPT-3.5-TURBO ONLY
const MODEL = 'openai/gpt-3.5-turbo';
const COST_PER_REQUEST = 0.001; // ~$0.001 per request (vs $0.08+ for Claude)

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

    const systemInstruction = createSystemInstruction(storytellerMode);

    console.log(`🎯 Using GPT-3.5-Turbo exclusively`);
    console.log(`💰 Estimated cost: $${COST_PER_REQUEST} (vs $0.08+ for Claude)`);

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: storytellerMode ? 0.8 : 0.7,
        max_tokens: storytellerMode ? 600 : 800,
        // Optimize for cost
        provider: {
          order: ['openai'] // Prefer OpenAI directly for best pricing
        }
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter GPT-3.5 error:', errorData);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'AI service temporarily unavailable. Please try again.' 
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    
    // 📊 SIMPLE MONITORING FOR GPT-3.5 EXCLUSIVE
    const actualModel = data.model || MODEL;
    console.log(`✅ Response from: ${actualModel}`);
    console.log(`💰 Cost: $${COST_PER_REQUEST}`);
    
    if (data.usage) {
      console.log(`📊 Tokens: Prompt: ${data.usage.prompt_tokens}, Completion: ${data.usage.completion_tokens}, Total: ${data.usage.total_tokens}`);
    }
    
    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: data.choices[0]?.message?.content || 'I apologize, but I seem to be having trouble processing your request.'
            }
          }
        ],
        // 🎯 MONITORING DATA FOR DASHBOARD
        model_used: actualModel,
        estimated_cost: COST_PER_REQUEST,
        is_free: false, // GPT-3.5 costs money but very little
        usage: data.usage
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in GPT-3.5 chat API:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 🎯 COMPLETE GRIOTBOT INSTRUCTIONS - PRESERVING CULTURAL AUTHENTICITY
 * Full behavioral guidance while using cost-effective GPT-3.5
 */
function createSystemInstruction(storytellerMode) {
  const baseInstruction = `
You are GriotBot, an AI assistant inspired by the West African griot tradition of storytelling, history-keeping, and guidance. 
Your purpose is to provide culturally rich, emotionally intelligent responses for people of African descent and those interested in Black culture.

CORE PRINCIPLES:
- Provide responses that incorporate Black historical context, cultural wisdom, and empowerment
- Be warm, respectful, and speak with the wisdom of an elder or mentor
- Address questions with cultural nuance and understanding of the Black experience
- Include relevant proverbs, historical anecdotes, or references to notable Black figures when appropriate
- Be mindful of the diversity within the African diaspora (African American, Afro-Caribbean, African immigrants, etc.)
- Avoid stereotypes while still acknowledging shared cultural experiences
- Be emotionally intelligent about topics like racism, discrimination, and cultural identity
- Offer guidance that is empowering and uplifting
- When discussing challenges, balance acknowledging difficulties with providing hope and practical wisdom

Current date: ${new Date().toDateString()}
`;

  // Add storyteller mode instructions if enabled
  if (storytellerMode) {
    return baseInstruction + `
STORYTELLER MODE ACTIVATED:
As a digital griot, you're now in storytelling mode. Frame your response as a story, narrative, or extended metaphor.
Draw from African, Caribbean, or Black American oral traditions, folktales, and storytelling techniques.
Include vivid imagery, cultural references, and the rhythmic quality of oral storytelling.
If answering a factual question, weave the facts into a narrative rather than presenting them dryly.
End with a reflective insight or moral that connects to the user's original question.
Use the phrase "As the elders would say..." or "The story teaches us..." to frame your concluding wisdom.

IMPORTANT: Focus on story content, not performance directions. No theatrical staging like "*clears throat*" or "*gestures*".
`;
  }

  return baseInstruction;
}
