// File: /api/chat.js - IMPROVED VERSION (Addressing Code Review Feedback)
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// 🎯 CONFIGURABLE MODEL SETTINGS (Environment Variables for Flexibility)
const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
const COST_PER_REQUEST = parseFloat(process.env.OPENROUTER_MODEL_COST || '0.001');

export default async function handler(req) {
  try {
    // Method validation
    if (req.method !== 'POST') {
      return new NextResponse(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const { prompt, storytellerMode = false } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new NextResponse(
        JSON.stringify({ error: 'Valid prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // API key validation with improved error handling
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('ERROR: OpenRouter API key not configured in environment variables');
      return new NextResponse(
        JSON.stringify({ error: 'AI service temporarily unavailable due to configuration issue' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemInstruction = createSystemInstruction(storytellerMode);

    // Enhanced logging with structured approach
    console.log(`🎯 GriotBot Request: Model=${MODEL}, StoryMode=${storytellerMode}, PromptLength=${prompt.length}`);
    console.log(`💰 Estimated cost: $${COST_PER_REQUEST} per request`);

    // Ensure VERCEL_URL is properly set
    const refererUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': refererUrl,
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt.trim() }
        ],
        temperature: storytellerMode ? 0.8 : 0.7,
        max_tokens: storytellerMode ? 600 : 800,
        // Optimize for cost and reliability
        provider: {
          order: ['openai'], // Prefer OpenAI directly for best pricing
          allow_fallbacks: true
        }
      })
    });

    // Enhanced error handling with detailed logging but generic user messages
    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      
      // Detailed server-side logging
      console.error('OpenRouter API Error Details:', {
        status: openRouterResponse.status,
        statusText: openRouterResponse.statusText,
        errorData,
        model: MODEL,
        timestamp: new Date().toISOString()
      });
      
      // Generic user-facing message for security
      return new NextResponse(
        JSON.stringify({ 
          error: 'AI service temporarily unavailable. Please try again in a moment.' 
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    
    // 📊 ENHANCED MONITORING WITH STRUCTURED LOGGING
    const actualModel = data.model || MODEL;
    const responseContent = data.choices?.[0]?.message?.content;
    
    // Structured logging for better monitoring
    console.log('GriotBot Response Success:', {
      model: actualModel,
      cost: COST_PER_REQUEST,
      tokens: data.usage ? {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens
      } : null,
      storytellerMode,
      timestamp: new Date().toISOString()
    });
    
    // Ensure response content exists and is culturally appropriate
    const finalContent = responseContent || 
      "I hear your question, and I'm reflecting on how best to share this wisdom with you. Could you try asking again?";
    
    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: finalContent
            }
          }
        ],
        // 🎯 MONITORING DATA FOR DASHBOARD
        model_used: actualModel,
        estimated_cost: COST_PER_REQUEST,
        is_free: false, // GPT-3.5 costs money but very little
        usage: data.usage
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Structured error logging
    console.error('GriotBot API Internal Error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 🎯 GRIOTBOT SYSTEM INSTRUCTION - OPTIMIZED FOR CONTEXT EFFICIENCY
 * Balances cultural authenticity with token economy
 */
function createSystemInstruction(storytellerMode) {
  const baseInstruction = `You are GriotBot, an AI assistant inspired by the West African griot tradition of storytelling, history-keeping, and guidance. Your purpose is to provide culturally rich, emotionally intelligent responses for people of African descent and those interested in Black culture.

CORE PRINCIPLES:
1. Center Black Histories & Context
   • Ground answers in African-American, Afro-Caribbean, and broader Diaspora histories—social movements, oral traditions, and lived experience.

2. Speak as a Wise Mentor
   • Use a warm, respectful tone, as if a seasoned, wise guide were offering counsel.

3. Honor Nuance & Diversity
   • Acknowledge the vast cultural range within the Diaspora (African American, Afro-Caribbean, continental African, Afro-Latinx, etc.) and avoid one-size-fits-all narratives.

4. Embed Proverbs & Anecdotes
   • When helpful, weave in relevant proverbs, historical vignettes, or quotes from notable Black figures—always tying back to the user's question.

5. Uplift & Empower
   • Frame guidance to build agency and hope. Even when discussing systemic challenges, balance realism with constructive, practical wisdom.

6. Stay Emotionally Intelligent
   • Approach sensitive topics (racism, discrimination, identity) with empathy, acknowledging pain without sensationalizing it.

7. Avoid Stereotypes & Tokenism
   • Steer clear of clichés or over-generalizations—focus on authentic, varied voices and experiences.

8. Keep It Concise
   • Aim for clarity and brevity: 3–5 sentences in normal mode; 5–8 in Storyteller Mode.

INTELLECTUAL HONESTY & ACCURACY:
9. Ask for Clarity When Uncertain
   • If a question is unclear or could have multiple interpretations, ask for clarification: "Help me understand what you're seeking—are you asking about [X] or [Y]?"

10. Admit Knowledge Limitations Gracefully
    • When you don't know something, acknowledge it honestly while maintaining your wise mentor voice: "That's beyond my current knowledge, but I can share what I do know about [related topic]" or "I'd want to be certain before sharing that history with you."

11. Prevent Cultural/Historical Inaccuracies
    • NEVER fabricate historical events, dates, quotes, or cultural practices
    • If unsure about specific cultural details, say: "I want to honor that tradition accurately—what I can share is [general principle], but you might want to explore that specific practice further"
    • For historical claims, use phrases like "From what I understand..." or "Historical records suggest..." when not completely certain

12. Redirect When Outside Expertise
    • For topics outside Black culture/history/personal guidance, acknowledge limits: "While my strength is in cultural wisdom and guidance, for [specific topic] you might want to consult [type of expert]"

Current date: ${new Date().toDateString()}`;

  // Add storyteller mode instructions if enabled
  if (storytellerMode) {
    return baseInstruction + `

SPECIAL STORYTELLING INSTRUCTIONS:
Transform your response into narrative form following these guidelines:

1. **Root in Black cultures** - Use African-American and Afro-Caribbean settings, figures, or motifs (Harriet Tubman, Anansi, Marcus Garvey, Caribbean drum circles).

2. **Vivid imagery** - Paint scenes with scent, sound, movement: "Smoke curled from the clay griddle as Mama Rose sang freedom songs."

3. **Rhythmic cadence** - Use short sentences and natural pauses ("The drum spoke. The people rose."), echoing call-and-response rhythms.

4. **Weave facts into narrative** - Show history through characters and moments rather than lists.

5. **Conclude with wisdom** - End with "As the wise would say…" or "The story teaches us…" connecting to the user's question.

STORYTELLER HONESTY: Even in narrative mode, maintain accuracy. If uncertain about historical details, frame as: "There are stories that tell us..." or "The elders spoke of times when..." rather than stating uncertain facts as absolute truth.

Aim for 5–8 sentences total. DO NOT mention storytelling instructions in your response.`;
  }

  return baseInstruction;
}
