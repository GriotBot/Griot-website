// File: /pages/api/chat.js
import { NextResponse } from 'next/server';

/**
 * GriotBot Chat API handler with optimized system prompt
 * Connects to OpenRouter for culturally grounded AI responses
 */
export const config = {
  runtime: 'edge', // Use Edge runtime for better performance
};

// OpenRouter model configuration
const MODEL = 'openai/gpt-3.5-turbo-instruct';
const MAX_PROMPT_LENGTH = 5000; // Character limit for prompts

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

    // Check prompt length limit
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return new NextResponse(
        JSON.stringify({ error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` }),
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

    // Create optimized system instruction
    const systemInstruction = createSystemInstruction(storytellerMode);

    // Log request details for monitoring
    console.log(`📡 GriotBot Request → model: ${MODEL}, promptLength: ${prompt.length}, storyteller: ${storytellerMode}`);

    // Prepare the request to OpenRouter
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
        temperature: storytellerMode ? 0.8 : 0.7, // Higher creativity for storytelling
        max_tokens: storytellerMode ? 800 : 600, // More tokens for storytelling
        // Anti-hallucination parameters
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      })
    });

    // Check for successful response
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

    // Format and return the response
    const data = await openRouterResponse.json();
    const messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      console.warn('No message content in OpenRouter response:', data);
      return new NextResponse(
        JSON.stringify({ error: 'No response content received from AI service' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Log successful response
    console.log(`✅ GriotBot Response → length: ${messageContent.length} chars`);

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

/**
 * Creates the optimized system instruction for GriotBot
 * @param {boolean} storytellerMode - Whether to enable storyteller mode
 * @returns {string} Complete system instruction
 */
function createSystemInstruction(storytellerMode) {
  const currentDate = new Date().toDateString();
  
  // Base optimized GriotBot system prompt
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

  // Add storyteller mode enhancement if activated
  if (storytellerMode) {
    return basePrompt + `

STORYTELLER MODE ACTIVE:
Frame your response as a narrative drawing from African diaspora oral traditions. Use vivid imagery, cultural metaphors, and conclude with a reflective insight that connects to the user's question. Speak as if sharing wisdom around a gathering fire, weaving the story with the rhythm and depth of traditional griot storytelling.`;
  }

  return basePrompt;
}

/**
 * Enhanced anti-hallucination pattern detection
 * Identifies high-risk queries that require extra caution
 * @param {string} prompt - User's question
 * @returns {object} Risk assessment and suggested parameters
 */
function assessHistoricalRisk(prompt) {
  const highRiskPatterns = [
    /what.*said.*exactly/i,
    /quote.*from/i,
    /when.*born.*died/i,
    /\d{4}.*happened/i,
    /how many.*died/i,
    /precise.*date/i
  ];
  
  const mediumRiskPatterns = [
    /when.*founded/i,
    /who.*first/i,
    /what year/i,
    /how long/i,
    /statistics.*about/i
  ];

  const isHighRisk = highRiskPatterns.some(pattern => pattern.test(prompt));
  const isMediumRisk = mediumRiskPatterns.some(pattern => pattern.test(prompt));

  if (isHighRisk) {
    return {
      riskLevel: 'high',
      temperature: 0.3,
      additionalInstruction: 'Be especially careful about exact quotes, specific dates, and precise statistics. Use qualifying language when appropriate.'
    };
  } else if (isMediumRisk) {
    return {
      riskLevel: 'medium', 
      temperature: 0.5,
      additionalInstruction: 'Provide factual information with appropriate context and acknowledge any uncertainty.'
    };
  }

  return {
    riskLevel: 'low',
    temperature: 0.7,
    additionalInstruction: null
  };
}
