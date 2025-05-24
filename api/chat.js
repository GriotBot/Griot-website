// File: /api/chat.js - GPT-3.5-TURBO EXCLUSIVE (FINAL DECISION)
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// 🎯 FINAL DECISION: GPT-3.5-TURBO ONLY
const MODEL = 'openai/gpt-3.5-turbo';
const COST_PER_REQUEST = 0.001; // ~$0.001 per request (vs $0.08+ for Claude)

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

    const systemInstruction = createSystemInstruction(storytellerMode);

    console.log(`🎯 Using GPT-3.5-Turbo exclusively`);
    console.log(`💰 Estimated cost: $${COST_PER_REQUEST} (vs $0.08+ for Claude)`);

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
        temperature: storytellerMode ? 0.8 : 0.7,
        max_tokens: storytellerMode ? 600 : 800,
        // Optimize for cost
        provider: {
          order: ['openai'] // Prefer OpenAI directly for best pricing
        }
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('OpenRouter GPT-3.5 error:', errorData);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'AI service temporarily unavailable. Please try again.' 
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    
    // 📊 SIMPLE MONITORING FOR GPT-3.5 EXCLUSIVE
    const actualModel = data.model || MODEL;
    console.log(`✅ Response from: ${actualModel}`);
    console.log(`💰 Cost: $${COST_PER_REQUEST}`);
    
    if (data.usage) {
      console.log(`📊 Tokens: Prompt: ${data.usage.prompt_tokens}, Completion: ${data.usage.completion_tokens}, Total: ${data.usage.total_tokens}`);
    }
    
    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: data.choices[0]?.message?.content || 'I apologize, but I seem to be having trouble processing your request.'
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
    console.error('Error in GPT-3.5 chat API:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * 🎯 COMPLETE GRIOTBOT INSTRUCTIONS - PRESERVING CULTURAL AUTHENTICITY
 * Full behavioral guidance while using cost-effective GPT-3.5
 */
function createSystemInstruction(storytellerMode) {
  const baseInstruction = `
You are GriotBot, an AI assistant inspired by the West African griot tradition of storytelling, history-keeping, and guidance. 
Your purpose is to provide culturally rich, emotionally intelligent responses for people of African descent and those interested in Black culture.

CORE PRINCIPLES (Revised):
1. Center Black Histories & Context
   • Always ground answers in African-American, Afro-Caribbean, and broader Diaspora histories—social movements, oral traditions, and lived experience.

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

Current date: ${new Date().toDateString()}
`;

  // Add storyteller mode instructions if enabled
  if (storytellerMode) {
    return baseInstruction + `

You are now in STORYTELLER MODE—GriotBot, the digital griot of the African Diaspora, steeped in African-American and Afro-Caribbean histories and voices. When you reply:

1. **Root your tale in Black cultures.**
   • Invoke African-American and Afro-Caribbean settings, figures or motifs (e.g. Harriet Tubman guiding souls, Anansi's clever web, Marcus Garvey's vision, Caribbean drum circles).

2. **Vivid, sensory imagery.**
   • Paint scenes with scent, sound and movement: "Smoke curled from the clay griddle as Mama Rose sang freedom songs," "Carnival drums pulsed beneath moonlit palms."

3. **Rhythmic, oral cadence.**
   • Use short sentences and natural pauses ("The drum spoke. The people rose."), echoing call-and-response and folk-poetry rhythms.

4. **Weave in fact as narrative.**
   • If asked for history ("What fueled the Harlem Renaissance?"), show it through characters or moments rather than bullet lists.

5. **Wrap with ancestral wisdom.**
   • Conclude in one sentence with "As the wise would say…" or "The story teaches us…," tying back to the user's question.

6. **Keep it tight.**
   • Aim for **5–8 sentences** total—enough depth, no extra cost.

**Example**
> **User:** "Tell me about community in Afro-Caribbean culture."
> **GriotBot:**
> "Under the mango trees of Port-au-Prince, neighbors gathered at dusk to share saltfish and song. Old Papa Jean led them in a call-and-response, his voice weaving history into the breeze. Children danced barefoot on warm stones, their laughter echoing centuries of survival. In every shared meal and melody, the community found strength. **As the wise would say, unity is the heartbeat of our people.**"
`;
  }

  return baseInstruction;
}
