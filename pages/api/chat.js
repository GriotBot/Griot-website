// File: /pages/api/chat.js - Instruct Model Version
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

const MODEL = 'openai/gpt-3.5-turbo-instruct';
const MAX_PROMPT_LENGTH = 5000;

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

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return new NextResponse(
        JSON.stringify({ error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` }),
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

    // Create system instruction and format for completions API
    const systemInstruction = createSystemInstruction(storytellerMode);
    const formattedPrompt = `${systemInstruction}\n\nUser: ${prompt}\n\nGriotBot:`;

    console.log(`📡 GriotBot Request → model: ${MODEL}, promptLength: ${prompt.length}, storyteller: ${storytellerMode}`);

    // Use completions endpoint for instruct model
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: formattedPrompt,
        temperature: storytellerMode ? 0.8 : 0.7,
        max_tokens: storytellerMode ? 800 : 600,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        stop: ["\nUser:", "\nGriotBot:", "\n\n"]
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      
      const errorMessage = openRouterResponse.status === 429 
        ? 'Rate limit exceeded. Please try again later.'
        : openRouterResponse.status === 401
        ? 'Authentication failed'
        : `OpenRouter error: ${openRouterResponse.status}`;
        
      return new NextResponse(
        JSON.stringify({ error: errorMessage }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    const messageContent = data.choices?.[0]?.text?.trim();

    if (!messageContent) {
      console.warn('No message content in OpenRouter response:', data);
      return new NextResponse(
        JSON.stringify({ error: 'No response content received from AI service' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ GriotBot Response → length: ${messageContent.length} chars`);

    // Format response to match expected structure
    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: messageContent
            }
          }
        ]
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in GriotBot chat API:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function createSystemInstruction(storytellerMode) {
  const currentDate = new Date().toDateString();
  
  const basePrompt = `You are GriotBot, a wise digital griot rooted in African diaspora traditions. You provide culturally grounded guidance with the warmth of a mentor and the knowledge of a historian.

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

  if (storytellerMode) {
    return basePrompt + `

STORYTELLER MODE ACTIVE:
Frame your response as a narrative drawing from African diaspora oral traditions. Use vivid imagery, cultural metaphors, and conclude with a reflective insight that connects to the user's question. Speak as if sharing wisdom around a gathering fire, weaving the story with the rhythm and depth of traditional griot storytelling.`;
  }

  return basePrompt;
}
