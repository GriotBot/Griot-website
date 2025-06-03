// File: /api/chat.js
// GriotBot API handler - FIXED VERSION
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Use the correct model and endpoint
const MODEL = 'openai/gpt-3.5-turbo'; // More reliable than instruct variant
const CHAT_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

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

    // Anti-hallucination pattern detection
    const isFactualQuery = detectFactualQuery(prompt);
    const riskLevel = assessHallucinationRisk(prompt);
    
    // Create system instruction
    const systemInstruction = createSystemInstruction(storytellerMode, isFactualQuery);
    
    // Dynamic temperature based on query type
    const temperature = getTemperature(storytellerMode, isFactualQuery, riskLevel);
    
    // Prepare request for CHAT COMPLETIONS endpoint (standard format)
    const requestBody = {
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: systemInstruction
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: temperature,
      max_tokens: storytellerMode ? 600 : 400,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    };

    console.log(`🌿 GriotBot Request - Model: ${MODEL}, Temp: ${temperature}, Factual: ${isFactualQuery}, Risk: ${riskLevel}`);
    
    // Call OpenRouter Chat Completions API
    const openRouterResponse = await fetch(CHAT_ENDPOINT, {
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
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', {
        status: openRouterResponse.status,
        statusText: openRouterResponse.statusText,
        body: errorText
      });
      
      // Return more specific error messages
      if (openRouterResponse.status === 401) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid API key' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (openRouterResponse.status === 429) {
        return new NextResponse(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        return new NextResponse(
          JSON.stringify({ error: 'Service temporarily unavailable. Please try again.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const data = await openRouterResponse.json();
    
    // Extract response content properly
    const botResponse = data.choices?.[0]?.message?.content?.trim() || 
                       'I apologize, but I seem to be having trouble processing your request.';

    // Apply anti-hallucination post-processing if needed
    const finalResponse = isFactualQuery ? 
      addUncertaintyPhrases(botResponse, riskLevel) : 
      botResponse;

    // Log usage for cost monitoring
    if (data.usage) {
      console.log(`💰 Tokens - Prompt: ${data.usage.prompt_tokens}, Completion: ${data.usage.completion_tokens}, Total: ${data.usage.total_tokens}`);
    }

    // Return in format expected by frontend
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
 * Creates system instruction for the AI
 */
function createSystemInstruction(storytellerMode, isFactual) {
  const currentDate = new Date().toDateString();
  
  const baseInstruction = `You are GriotBot, an AI assistant inspired by the West African griot tradition of storytelling, history-keeping, and guidance. Your purpose is to provide culturally rich, emotionally intelligent responses for people of African descent and those interested in Black culture.

CORE PRINCIPLES:
- Provide responses that incorporate Black historical context, cultural wisdom, and empowerment
- Be warm, respectful, and speak with the wisdom of an elder or mentor
- Address questions with cultural nuance and understanding of the Black experience
- Include relevant proverbs, historical anecdotes, or references to notable Black figures when appropriate
- Be mindful of the diversity within the African diaspora
- Avoid stereotypes while acknowledging shared cultural experiences
- Be emotionally intelligent about topics like racism, discrimination, and cultural identity
- Offer guidance that is empowering and uplifting

Current date: ${currentDate}

${isFactual ? 'IMPORTANT: If unsure about historical facts, dates, or quotes, express appropriate uncertainty rather than guessing.' : ''}`;

  if (storytellerMode) {
    return baseInstruction + `

STORYTELLER MODE ACTIVATED:
Frame your response as a story, narrative, or extended metaphor drawing from African, Caribbean, or Black American oral traditions. Use vivid imagery and the rhythmic quality of oral storytelling. Conclude with reflective wisdom that connects to the user's question.`;
  }

  return baseInstruction;
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
    /\d{4}.*\d{4}/i, // Multiple years
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
  if (riskLevel === 'high') return 0.3; // Very conservative for facts
  if (isFactual) return 0.4; // Conservative for factual content
  if (storytellerMode) return 0.8; // Creative for stories
  return 0.7; // Standard for general queries
}

/**
 * Add uncertainty phrases for factual queries when appropriate
 */
function addUncertaintyPhrases(response, riskLevel) {
  if (riskLevel === 'low') return response;
  
  // Add uncertainty phrases for medium/high risk responses
  const uncertaintyPhrases = [
    'From historical records,',
    'According to documented sources,',
    'Historical accounts suggest',
    'It\'s widely documented that',
    'Based on available historical information,'
  ];
  
  // Simple implementation: prepend uncertainty phrase if response doesn't already have one
  const hasUncertainty = uncertaintyPhrases.some(phrase => 
    response.toLowerCase().includes(phrase.toLowerCase())
  );
  
  if (!hasUncertainty && riskLevel === 'high') {
    const randomPhrase = uncertaintyPhrases[Math.floor(Math.random() * uncertaintyPhrases.length)];
    return `${randomPhrase} ${response}`;
  }
  
  return response;
}
