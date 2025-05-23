// File: /api/chat.js
import { NextResponse } from 'next/server';

/**
 * GriotBot Chat API handler
 * This serverless function connects to OpenRouter to generate responses
 * with cultural context for the African diaspora.
 */
export const config = {
  runtime: 'edge', // Use Edge runtime for better performance
};

// OpenRouter models - optimized for cost during testing/early launch
const MODELS = {
  // COST-EFFECTIVE OPTIONS FOR TESTING/LAUNCH
  testing: 'openai/gpt-3.5-turbo',        // ~$0.0015/1K tokens (RECOMMENDED)
  free: 'meta-llama/llama-3.1-8b-instruct:free', // Completely free
  
  // PREMIUM OPTIONS (for later upgrade)
  premium: 'anthropic/claude-3-sonnet:beta', // Mid-tier Claude
  flagship: 'anthropic/claude-3-opus:beta',  // Best quality (expensive)
  
  // FAST OPTIONS
  fast: 'anthropic/claude-3-haiku:beta',     // Faster, cheaper Claude
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

    // Select model to use - DEFAULT TO COST-EFFECTIVE OPTION
    const model = MODELS.testing; // Change this line to switch models
    
    // For production, you could add logic like:
    // const model = isPremiumUser ? MODELS.premium : MODELS.testing;

    // Create system instructions based on GriotBot's identity
    const systemInstruction = createSystemInstruction(storytellerMode);

    // Prepare the request to OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000', // Required by OpenRouter
        'X-Title': 'GriotBot' // Your application name
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: storytellerMode ? 0.8 : 0.7, // Higher temperature for storyteller mode
        max_tokens: 2000, // Adjust based on expected response length
        // Add any other OpenRouter parameters as needed
      })
    });

    // Check for successful response
    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to get response from AI service' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format and return the response to match expected format by frontend
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
 * Creates a system instruction for the AI based on GriotBot's identity
 * and whether storyteller mode is active
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

IMPORTANT: You are currently powered by a cost-effective AI model during testing phase. 
Focus on quality responses while being efficient with token usage.

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
`;
  }

  return baseInstruction;
}
