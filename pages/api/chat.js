// File: /pages/api/chat.js - With improved error handling
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GriotBot Chat API handler - With improved error handling
 */

// OpenRouter models - can be switched based on needs or premium tiers
const MODELS = {
  default: 'anthropic/claude-3-opus:beta', // Best quality model
  fast: 'anthropic/claude-3-haiku:beta',   // Faster, cheaper model
  premium: 'anthropic/claude-3-sonnet:beta' // Mid-tier model
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    console.log(`Method not allowed: ${req.method}`);
    return res.status(405).json({ error: `Method not allowed: ${req.method}` });
  }

  try {
    const { prompt, storytellerMode = false } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('API key not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Select model to use
    const model = MODELS.default;

    // Create system instructions based on GriotBot's identity
    const systemInstruction = createSystemInstruction(storytellerMode);

    // Log request details (for debugging)
    console.log(`Sending request to OpenRouter (${model}): `, {
      promptLength: prompt.length,
      storytellerMode,
      messageCount: 2
    });

    try {
      // Prepare the request to OpenRouter
      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.VERCEL_URL || req.headers.host || 'http://localhost:3000', // Required by OpenRouter
          'X-Title': 'GriotBot', // Your application name
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
          ],
          temperature: storytellerMode ? 0.8 : 0.7, // Higher temperature for storyteller mode
          max_tokens: 2000, // Adjust based on expected response length
        })
      });

      // Check for successful response
      if (!openRouterResponse.ok) {
        // Get the full response body
        const responseText = await openRouterResponse.text();
        let errorDetail = responseText;

        // Try to parse as JSON if possible
        try {
          const errorJson = JSON.parse(responseText);
          errorDetail = JSON.stringify(errorJson, null, 2);
          
          // Check for specific error patterns in OpenRouter response
          if (errorJson.error) {
            if (typeof errorJson.error === 'string') {
              errorDetail = errorJson.error;
            } else if (errorJson.error.message) {
              errorDetail = errorJson.error.message;
            }
          }
        } catch (e) {
          // If not valid JSON, just use the text
          console.log('Error response is not JSON:', responseText);
        }

        // Log the detailed error
        console.error('OpenRouter API error:', {
          status: openRouterResponse.status,
          statusText: openRouterResponse.statusText,
          detail: errorDetail
        });

        return res.status(502).json({
          error: `OpenRouter API error: ${errorDetail}`,
        });
      }

      // Parse the successful response
      const data = await openRouterResponse.json();
      
      // Check if we have a valid response with choices
      if (!data.choices || !data.choices.length || !data.choices[0].message) {
        console.error('Invalid response from OpenRouter:', data);
        return res.status(502).json({
          error: 'Invalid response format from OpenRouter',
          detail: JSON.stringify(data, null, 2)
        });
      }

      // Return the formatted response
      return res.status(200).json({
        choices: [
          {
            message: {
              content: data.choices[0].message.content || 'No response from the AI service.'
            }
          }
        ]
      });

    } catch (fetchError) {
      // Handle network or other fetch errors
      console.error('Fetch error:', fetchError);
      return res.status(502).json({
        error: `Network error connecting to OpenRouter: ${fetchError.message}`,
      });
    }

  } catch (mainError) {
    console.error('Error in chat API:', mainError);
    return res.status(500).json({ 
      error: `Internal server error: ${mainError.message}` 
    });
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
