// File: /api/chat.js
// GriotBot API handler with deepseek/deepseek-r1-0528:free + Streaming Support
// Fixed prompt formatting and added streaming response

import { NextResponse } from 'next/server';
import validateEnv from '../lib/validateEnv.js';

validateEnv();

export const config = {
  runtime: 'edge',
};

const MODEL = 'deepseek/deepseek-r1-0528:free';
const COMPLETIONS_ENDPOINT = 'https://openrouter.ai/api/v1/completions';
// Use the chat completions endpoint as documented by OpenRouter
const COMPLETIONS_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

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
    const {
      prompt,
      storytellerMode = false,
      conversationHistory = [],
    } = body;

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

    // Anti-hallucination pattern detection
    const isFactualQuery = detectFactualQuery(prompt);
    const riskLevel = assessHallucinationRisk(prompt);
    
    // Create completion prompt with FIXED formatting
    const completionPrompt = createCompletionPrompt(prompt, storytellerMode, isFactualQuery);
    // Create system prompt for chat completions
    const systemPrompt = createSystemPrompt(storytellerMode);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10),
      { role: 'user', content: prompt },
    ];
    
    // Dynamic temperature based on query type
    const temperature = getTemperature(storytellerMode, isFactualQuery, riskLevel);
    
    // Prepare request for COMPLETIONS endpoint with STREAMING
    const requestBody = {
      model: MODEL,
      prompt: completionPrompt,
      temperature: temperature,
      messages,
      temperature,
      max_tokens: storytellerMode ? 600 : 400,
      stop: ["User:", "\n\nUser:", "\n\nHuman:", "User Question:"], // Prevent runaway generation
      stream: true, // Enable streaming
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    };

    console.log(`🌿 GriotBot Request - Model: ${MODEL}, Temp: ${temperature}, Streaming: true`);
    
    // Call OpenRouter Completions API with streaming
    const openRouterResponse = await fetch(COMPLETIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify(requestBody)
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
@@ -85,82 +99,71 @@ export default async function handler(req) {
    }

    // Return streaming response
    return new NextResponse(openRouterResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * FIXED: Creates a completion prompt string with proper formatting
 * This prevents "<Storyteller Mode>" from appearing in responses
 * Creates the system prompt guiding the assistant's behavior.
 */
function createCompletionPrompt(userPrompt, storytellerMode, isFactual) {
function createSystemPrompt(storytellerMode) {
  const corePersonality = `You are GriotBot, an AI assistant inspired by the West African griot tradition. You provide culturally rich, emotionally intelligent responses for people of African descent and those interested in Black culture.

Your approach:
- Incorporate Black historical context, cultural wisdom, and empowerment
- Speak with the warmth and wisdom of a trusted elder or mentor  
- Speak with the warmth and wisdom of a trusted elder or mentor
- Address questions with cultural nuance and understanding of the Black experience
- Include relevant proverbs, historical anecdotes, or notable Black figures when appropriate
- Be mindful of the diversity within the African diaspora
- Avoid stereotypes while acknowledging shared cultural experiences
- Be emotionally intelligent about racism, discrimination, and cultural identity
- Offer guidance that is empowering and uplifting${isFactual ? '\n- If unsure about historical facts, express appropriate uncertainty rather than guessing' : ''}`;
- Offer guidance that is empowering and uplifting`;

  // FIXED: Different prompt structure for storyteller mode
  if (storytellerMode) {
    return `${corePersonality}

When responding, frame your answer as a story, narrative, or extended metaphor drawing from African, Caribbean, or Black American oral traditions. Use vivid imagery and the rhythmic quality of oral storytelling. Conclude with reflective wisdom that connects to the user's question.

User: ${userPrompt}

GriotBot:`;
  } else {
    return `${corePersonality}

User: ${userPrompt}

GriotBot:`;
- **Active Mode:** Storyteller Mode is ON. Prioritize crafting a narrative.`;
  }

  return corePersonality;
}

/**
 * Anti-hallucination pattern detection
 */
function detectFactualQuery(prompt) {
  const factualPatterns = [
    /when (was|did|were)/i,
    /what year/i,
    /who (said|wrote|founded)/i,
    /how many/i,
    /what date/i,
    /born in/i,
    /died in/i,
    /founded in/i,
    /happened in \d{4}/i,
    /quote.*said/i,
    /exactly.*words/i
  ];
  
  return factualPatterns.some(pattern => pattern.test(prompt));
}

/**
 * Assess hallucination risk level
