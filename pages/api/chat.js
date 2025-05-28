// File: /pages/api/chat.js - Fixed version for Claude Haiku
import { NextResponse } from 'next/server';

/**
 * GriotBot Chat API handler with optimized system prompt
 * Fixed for anthropic/claude-3-haiku:beta model
 */
export const config = {
  runtime: 'edge',
};

// Use your existing working model
const MODEL = 'anthropic/claude-3-haiku:beta';
const MAX_PROMPT_LENGTH = 5000;

export default async function handler(req) {
  // CORS headers
  const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || '*'
    : '*';

  const corsHeaders = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return new NextResponse(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }

  try {
    // Parse request body
    const body = await req.json();
    const { prompt, storytellerMode = false } = body;

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Prompt is required and must be a non-empty string' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return new NextResponse(
        JSON.stringify({ error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    // Get API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || !apiKey.trim()) {
      console.error('Missing or empty OPENROUTER_API_KEY');
      return new NextResponse(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    // Create optimized system instruction
    const systemInstruction = createSystemInstruction(storytellerMode);

    console.log(`📡 GriotBot Request → model: ${MODEL}, promptLength: ${prompt.length}, storyteller: ${storytellerMode}`);

    // Make API call to OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt.trim() }
        ],
        temperature: storytellerMode ? 0.8 : 0.7,
        max_tokens: storytellerMode ? 800 : 600,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });

    // Check if OpenRouter response is ok
    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', {
        status: openRouterResponse.status,
        statusText: openRouterResponse.statusText,
        body: errorText
      });
      
      const errorMessage = openRouterResponse.status === 429 
        ? 'Rate limit exceeded. Please try again later.'
        : openRouterResponse.status === 401
        ? 'Authentication failed'
        : openRouterResponse.status === 402
        ? 'Insufficient credits'
        : `API error: ${openRouterResponse.status}`;
        
      return new NextResponse(
        JSON.stringify({ error: errorMessage }),
        { 
          status: 502, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    // Parse OpenRouter response
    const data = await openRouterResponse.json();
    console.log('OpenRouter raw response:', JSON.stringify(data, null, 2));

    // Extract message content - handle multiple possible response formats
    let messageContent = null;
    
    if (data.choices && data.choices.length > 0) {
      const choice = data.choices[0];
      
      // Try different possible response structures
      messageContent = choice.message?.content || 
                      choice.text || 
                      choice.delta?.content ||
                      null;
    }

    if (!messageContent || messageContent.trim().length === 0) {
      console.error('No valid message content found in response:', data);
      return new NextResponse(
        JSON.stringify({ error: 'No response content received from AI service' }),
        { 
          status: 502, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }

    console.log(`✅ GriotBot Response → length: ${messageContent.length} chars`);

    // Return successful response in expected format
    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: messageContent.trim()
            }
          }
        ]
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );

  } catch (error) {
    console.error('Error in GriotBot chat API:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
}

/**
 * Creates the optimized system instruction for GriotBot
 */
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
