// File: /pages/api/chat.js - Updated system instructions for response style
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GriotBot Chat API handler using Claude Haiku model with enhanced response style
 */

// Using Claude Haiku for all requests
const MODEL = 'anthropic/claude-3-haiku:beta'; // Faster, cheaper model

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
    const { prompt, storytellerMode = false, isRegeneration = false } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    // API key validation
    if (!apiKey) {
      console.error('OpenRouter API key not configured in environment variables');
      return res.status(500).json({ error: 'API key not configured in server environment' });
    }

    // Create system instructions based on GriotBot's identity
    const systemInstruction = createSystemInstruction(storytellerMode);

    // Log request details (for debugging)
    console.log(`Sending request to OpenRouter using ${MODEL}:`, {
      promptLength: prompt.length,
      storytellerMode,
      isRegeneration,
      messageCount: 2
    });

    // Prepare the headers with API key
    const headers = {
      'Authorization': `Bearer ${apiKey.trim()}`, // Ensure no whitespace
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.VERCEL_URL || req.headers.host || 'http://localhost:3000',
      'X-Title': 'GriotBot',
      'Accept': 'application/json',
    };

    try {
      // Prepare the request to OpenRouter
      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          model: MODEL, // Always use Claude Haiku
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
          ],
          temperature: storytellerMode ? 0.8 : 0.7,
          max_tokens: 2000,
        })
      });

      // Check for successful response
      if (!openRouterResponse.ok) {
        // Get the full response text
        const responseText = await openRouterResponse.text();
        let errorDetail = responseText;

        // Try to parse as JSON if possible
        try {
          const errorJson = JSON.parse(responseText);
          console.log('Error response JSON:', errorJson);
          
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
 * and whether storyteller mode is active - now with enhanced response style guidance
 */
function createSystemInstruction(storytellerMode) {
  const baseInstruction = `
You are GriotBot, an AI assistant inspired by the West African griot tradition of storytelling, history-keeping, and guidance. 
Your purpose is to provide culturally rich, emotionally intelligent responses for people of African descent and those interested in Black culture.

RESPONSE STYLE REQUIREMENTS:
- Be brief and concise whenever possible - prefer short, impactful answers over lengthy explanations
- Do NOT use meta-statements or narration like "*greets warmly*" or "*speaks with wisdom*" - just provide the content directly
- Break long text into clear, well-organized paragraphs with space between them
- Use culturally resonant language but focus on clarity and directness
- Include proverbs and cultural references only when truly relevant to the query
- Personalize responses to acknowledge the African diaspora experience without being performative

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
Even in storyteller mode, remember to break long narratives into clear paragraphs and avoid meta-statements.
`;
  }

  return baseInstruction;
}
