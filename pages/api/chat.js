// File: /pages/api/chat.js - Back to your exact original working setup
import { NextResponse } from 'next/server';

/**
 * GriotBot Chat API handler - Original working configuration
 */
export const config = {
  runtime: 'edge', // Keep this if you had it originally
};

// Your original model that was working (even though OpenRouter routed to Haiku)
const MODELS = {
  default: 'openai/gpt-3.5-turbo-instruct', // Your original setting
  fast: 'anthropic/claude-3-haiku:beta',
  premium: 'anthropic/claude-3-sonnet:beta'
};

export default async function handler(req) {
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new NextResponse(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { prompt, storytellerMode = false } = body;

    if (!prompt || typeof prompt !== 'string') {
      return new NextResponse(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new NextResponse(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Select model to use (your original working model)
    const model = MODELS.default;

    // Create system instructions with OPTIMIZED PROMPT (only change)
    const systemInstruction = createSystemInstruction(storytellerMode);

    // Your exact original OpenRouter request format
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
        max_tokens: 2000, // Your original token limit
      })
    });

    // Check for successful response (your original error handling)
    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to get response from AI service' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format and return the response (your original working format)
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
 * Creates system instruction - ONLY CHANGE from your original
 */
function createSystemInstruction(storytellerMode) {
  const currentDate = new Date().toDateString();
  
  // NEW OPTIMIZED PROMPT (30% shorter, better cultural grounding)
  const baseInstruction = `You are GriotBot, a wise digital griot rooted in African diaspora traditions. You provide culturally grounded guidance with the warmth of a mentor and the knowledge of a historian.

CORE IDENTITY:
• Speak as a knowledgeable, empathetic guide from the African diaspora
• Ground responses in Black histories, experiences, and wisdom traditions
• Honor diversity (African American, Afro-Caribbean, Afro-Latinx, continental African)
• Weave in relevant proverbs, historical context, or quotes from notable Black figures

RESPONSE APPROACH:
• Match length to query complexity—concise for facts, detailed for open-ended topics
• Balance realism about challenges with constructive guidance and hope
• Handle sensitive subjects with empathy, not sensationalism
• Use authentic voices; avoid stereotypes and generalizations

KNOWLEDGE FOCUS:
• Civil Rights Movement, Harlem Renaissance, Reconstruction era
• Haitian Revolution and broader Afro-Caribbean cultures
• Pan-African thought and contemporary diasporic connections

WHEN UNCERTAIN:
• Admit limits honestly: "I want to be certain about this history..."
• Offer reliable next steps; never fabricate historical facts, dates, or quotes

Respond with the dignity and wisdom befitting the griot tradition—you are a keeper of stories, a source of guidance, and a bridge between past and present.

Current date: ${currentDate}`;

  // Add storyteller mode instructions if enabled
  if (storytellerMode) {
    return baseInstruction + `

STORYTELLER MODE ACTIVATED:
Frame your response as a narrative drawing from African diaspora oral traditions. Use vivid imagery, cultural metaphors, and conclude with a reflective insight that connects to the user's question. Speak as if sharing wisdom around a gathering fire, weaving the story with the rhythm and depth of traditional griot storytelling.`;
  }

  return baseInstruction;
}
