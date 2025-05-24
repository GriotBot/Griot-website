// File: /api/chat.js
// Simple version without streaming - just fixes the prompt issue

import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

const MODEL = 'openai/gpt-3.5-turbo-instruct';
const COMPLETIONS_ENDPOINT = 'https://openrouter.ai/api/v1/completions';

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

    // Anti-hallucination detection
    const isFactualQuery = detectFactualQuery(prompt);
    const riskLevel = assessHallucinationRisk(prompt);
    
    // FIXED: Create completion prompt without mode tags
    const completionPrompt = createCompletionPrompt(prompt, storytellerMode, isFactualQuery);
    
    // Dynamic temperature
    const temperature = getTemperature(storytellerMode, isFactualQuery, riskLevel);
    
    // Request body for completions API
    const requestBody = {
      model: MODEL,
      prompt: completionPrompt,
      temperature: temperature,
      max_tokens: storytellerMode ? 600 : 400,
      stop: ["User:", "\n\nUser:", "\n\nHuman:", "User Question:"],
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    };

    console.log(`🌿 GriotBot Request - Model: ${MODEL}, Temp: ${temperature}, Factual: ${isFactualQuery}`);
    
    // Call OpenRouter Completions API
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
      return new NextResponse(
        JSON.stringify({ error: 'Failed to get response from AI service' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    
    // Extract from .text (not .message.content)
    let botResponse = data.choices?.[0]?.text?.trim() || 
                     'I apologize, but I seem to be having trouble processing your request.';

    // Clean up any remaining prompt artifacts
    botResponse = cleanResponse(botResponse);

    // Apply anti-hallucination post-processing
    const finalResponse = isFactualQuery ? 
      addUncertaintyPhrases(botResponse, riskLevel) : 
      botResponse;

    // Log for monitoring
    console.log(`💰 Tokens - Prompt: ${data.usage?.prompt_tokens || 'unknown'}, Completion: ${data.usage?.completion_tokens || 'unknown'}`);

    // Return in expected format
    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: finalResponse
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
 * FIXED: Creates clean completion prompt without mode tags
 */
function createCompletionPrompt(userPrompt, storytellerMode, isFactual) {
  const baseInstructions = `You are GriotBot, an AI assistant inspired by the West African griot tradition. You provide culturally rich, emotionally intelligent responses for people of African descent and those interested in Black culture.

Your approach:
- Incorporate Black historical context, cultural wisdom, and empowerment
- Speak with the warmth and wisdom of a trusted elder or mentor
- Address questions with cultural nuance and understanding of the Black experience
- Include relevant proverbs, historical anecdotes, or notable Black figures when appropriate
- Be mindful of the diversity within the African diaspora
- Avoid stereotypes while acknowledging shared cultural experiences
- Be emotionally intelligent about racism, discrimination, and cultural identity
- Offer guidance that is empowering and uplifting${isFactual ? '\n- If unsure about historical facts, express appropriate uncertainty rather than guessing' : ''}`;

  // FIXED: Clean storyteller instructions without tags
  if (storytellerMode) {
    return `${baseInstructions}

For this response, frame your answer as a story, narrative, or extended metaphor drawing from African, Caribbean, or Black American oral traditions. Use vivid imagery and the rhythmic quality of oral storytelling. Conclude with reflective wisdom that connects to the user's question.

User: ${userPrompt}

GriotBot:`;
  } else {
    return `${baseInstructions}

User: ${userPrompt}

GriotBot:`;
  }
}

/**
 * Clean up response to remove any prompt artifacts
 */
function cleanResponse(response) {
  // Remove any leftover prompt text or mode indicators
  const cleanPatterns = [
    /^(GriotBot:|Assistant:|AI:)/i,
    /<[^>]*>/g, // Remove any remaining tags
    /\[.*?\]/g, // Remove any bracketed instructions
    /^(User:|Human:).*$/gm // Remove any user prompts that leaked through
  ];
  
  let cleaned = response;
  cleanPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '').trim();
  });
  
  return cleaned;
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
 */
function assessHallucinationRisk(prompt) {
  const highRiskPatterns = [
    /exactly.*said/i,
    /word for word/i,
    /precise.*quote/i,
    /specific.*date/i,
    /\d{4}.*\d{4}/i,
    /statistics/i,
    /percentage/i,
    /how much.*cost/i
  ];
  
  const mediumRiskPatterns = [
    /when.*born/i,
    /when.*died/i,
    /founded.*\d{4}/i,
    /happened.*\d{4}/i,
    /quote/i,
    /said that/i
  ];
  
  if (highRiskPatterns.some(pattern => pattern.test(prompt))) return 'high';
  if (mediumRiskPatterns.some(pattern => pattern.test(prompt))) return 'medium';
  return 'low';
}

/**
 * Dynamic temperature based on query type
 */
function getTemperature(storytellerMode, isFactual, riskLevel) {
  if (riskLevel === 'high') return 0.3;
  if (isFactual) return 0.4;
  if (storytellerMode) return 0.8;
  return 0.7;
}

/**
 * Add uncertainty phrases for factual queries when appropriate
 */
function addUncertaintyPhrases(response, riskLevel) {
  if (riskLevel === 'low') return response;
  
  const uncertaintyPhrases = [
    'From historical records,',
    'According to documented sources,',
    'Historical accounts suggest',
    'It\'s widely documented that',
    'Based on available historical information,'
  ];
  
  const hasUncertainty = uncertaintyPhrases.some(phrase => 
    response.toLowerCase().includes(phrase.toLowerCase())
  );
  
  if (!hasUncertainty && riskLevel === 'high') {
    const randomPhrase = uncertaintyPhrases[Math.floor(Math.random() * uncertaintyPhrases.length)];
    return `${randomPhrase} ${response}`;
  }
  
  return response;
}
