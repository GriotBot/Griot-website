// File: /pages/api/chat.js - DEBUG VERSION with detailed logging

export const config = {
  runtime: 'edge',
};

const MODEL = 'openai/gpt-3.5-turbo';
const CHAT_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req) {
  console.log('🔍 DEBUG: Chat API called');
  
  try {
    // Method check
    if (req.method !== 'POST') {
      console.log('❌ DEBUG: Wrong method:', req.method);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse body
    const body = await req.json();
    const { prompt, storytellerMode = false } = body;
    console.log('📝 DEBUG: Parsed body:', { prompt: prompt?.substring(0, 50) + '...', storytellerMode });

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      console.log('❌ DEBUG: Invalid prompt:', typeof prompt, prompt);
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log('🔑 DEBUG: API Key exists:', !!apiKey);
    console.log('🔑 DEBUG: API Key starts with:', apiKey?.substring(0, 10) + '...');
    
    if (!apiKey) {
      console.log('❌ DEBUG: No API key found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create system instruction
    const systemInstruction = createSystemInstruction(storytellerMode);
    console.log('📋 DEBUG: System instruction length:', systemInstruction.length);

    // Prepare request
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
      temperature: storytellerMode ? 0.8 : 0.7,
      max_tokens: storytellerMode ? 600 : 400,
      top_p: 0.9
    };

    console.log('📤 DEBUG: Request to OpenRouter:', {
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      temperature: requestBody.temperature,
      max_tokens: requestBody.max_tokens
    });

    // Make OpenRouter request
    const openRouterResponse = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || process.env.FRONTEND_URL || 'https://griot-website.vercel.app',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 DEBUG: OpenRouter response status:', openRouterResponse.status);
    console.log('📥 DEBUG: OpenRouter response headers:', Object.fromEntries(openRouterResponse.headers));

    // Check if response is ok
    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('❌ DEBUG: OpenRouter error details:', {
        status: openRouterResponse.status,
        statusText: openRouterResponse.statusText,
        body: errorText,
        headers: Object.fromEntries(openRouterResponse.headers)
      });
      
      // Return specific error based on status
      let errorMessage = 'Service temporarily unavailable. Please try again.';
      
      if (openRouterResponse.status === 401) {
        errorMessage = 'Authentication failed - please check API configuration.';
        console.error('🔑 DEBUG: Authentication failed - check API key');
      } else if (openRouterResponse.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        console.error('⏱️ DEBUG: Rate limited');
      } else if (openRouterResponse.status === 400) {
        errorMessage = 'Invalid request format.';
        console.error('📝 DEBUG: Bad request - check request format');
      } else if (openRouterResponse.status >= 500) {
        errorMessage = 'OpenRouter server error. Please try again later.';
        console.error('🖥️ DEBUG: Server error on OpenRouter side');
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse response
    const data = await openRouterResponse.json();
    console.log('✅ DEBUG: OpenRouter response parsed:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasUsage: !!data.usage,
      firstChoiceHasMessage: !!data.choices?.[0]?.message,
      contentLength: data.choices?.[0]?.message?.content?.length
    });

    // Extract response content
    const botResponse = data.choices?.[0]?.message?.content?.trim() || 
                       'I apologize, but I seem to be having trouble processing your request.';

    console.log('💬 DEBUG: Bot response length:', botResponse.length);
    console.log('💬 DEBUG: Bot response preview:', botResponse.substring(0, 100) + '...');

    // Log usage for monitoring
    if (data.usage) {
      console.log('💰 DEBUG: Token usage:', {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens
      });
    }

    // Return successful response
    const response = {
      choices: [
        {
          message: {
            content: botResponse
          }
        }
      ]
    };

    console.log('✅ DEBUG: Returning successful response');
    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 DEBUG: Unexpected error in chat API:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({ error: 'Internal server error - check logs for details' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Creates system instruction for the AI
 */
function createSystemInstruction(storytellerMode) {
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

Current date: ${currentDate}`;

  if (storytellerMode) {
    return baseInstruction + `

STORYTELLER MODE ACTIVATED:
Frame your response as a story, narrative, or extended metaphor drawing from African, Caribbean, or Black American oral traditions. Use vivid imagery and the rhythmic quality of oral storytelling. Conclude with reflective wisdom that connects to the user's question.`;
  }

  return baseInstruction;
}
