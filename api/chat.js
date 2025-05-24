// File: /api/chat.js - WITH ANTI-HALLUCINATION SAFEGUARDS
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Model configuration
const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';
const COST_PER_REQUEST = parseFloat(process.env.OPENROUTER_MODEL_COST || '0.001');

// 🛡️ ANTI-HALLUCINATION: Detect factual queries that need extra accuracy
function isFactualQuery(prompt) {
  const factualKeywords = [
    'when did', 'what year', 'who said', 'quote from', 'born in', 'died in',
    'historical fact', 'what happened', 'date of', 'statistics', 'percentage',
    'how many', 'research shows', 'studies indicate', 'data shows',
    'according to', 'evidence', 'documented', 'recorded'
  ];
  
  return factualKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );
}

// 🌡️ DYNAMIC TEMPERATURE: Lower for facts, higher for creativity
function getOptimalTemperature(prompt, storytellerMode) {
  if (isFactualQuery(prompt)) {
    return 0.3; // Very low for factual accuracy
  } else if (storytellerMode) {
    return 0.8; // Higher for creative storytelling
  } else {
    return 0.7; // Standard for general guidance
  }
}

// 🔍 RESPONSE VALIDATION: Check for potential hallucination patterns
function validateResponse(response) {
  const suspiciousPatterns = [
    // Overly specific dates without qualification
    {
      pattern: /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/,
      type: 'specific_date'
    },
    // Exact quotes without uncertainty markers
    {
      pattern: /"[^"]{30,}"\s*[-–—]\s*[A-Z][a-z]+\s+[A-Z][a-z]+$/,
      type: 'unattributed_quote'
    },
    // Specific statistics without qualification
    {
      pattern: /\b\d{1,2}\.\d+%\s*of\s+(Black|African|Caribbean)/i,
      type: 'precise_statistic'
    },
    // Overly precise numbers
    {
      pattern: /\b\d{1,3},\d{3}\b/,
      type: 'precise_number'
    }
  ];
  
  const foundPatterns = suspiciousPatterns.filter(item => 
    item.pattern.test(response)
  );
  
  return {
    hasSuspiciousPatterns: foundPatterns.length > 0,
    patterns: foundPatterns.map(item => item.type),
    riskLevel: foundPatterns.length > 2 ? 'high' : foundPatterns.length > 0 ? 'medium' : 'low'
  };
}

// ✅ CONFIDENCE ENHANCEMENT: Add uncertainty markers when needed
function addConfidenceIndicators(response, isFactual) {
  if (!isFactual) return response;
  
  const uncertaintyPhrases = [
    'From what I understand',
    'Historical records suggest',
    'Based on available information',
    'As far as I know',
    'To the best of my knowledge',
    'From my understanding'
  ];
  
  // Check if response already has uncertainty markers
  const hasUncertaintyMarkers = uncertaintyPhrases.some(phrase => 
    response.toLowerCase().includes(phrase.toLowerCase())
  );
  
  // Check if response contains specific claims that might need qualification
  const specificClaimPatterns = [
    /\b\d{4}\b/, // Years
    /\b\d{1,2}%\b/, // Percentages
    /"[^"]{20,}"/, // Long quotes
    /\b(exactly|precisely|specifically)\b/i
  ];
  
  const hasSpecificClaims = specificClaimPatterns.some(pattern => 
    pattern.test(response)
  );
  
  // Add uncertainty marker if response has specific claims but no uncertainty language
  if (hasSpecificClaims && !hasUncertaintyMarkers) {
    return `From what I understand, ${response.charAt(0).toLowerCase()}${response.slice(1)}`;
  }
  
  return response;
}

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

    // API key validation
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('ERROR: OpenRouter API key not configured in environment variables');
      return new NextResponse(
        JSON.stringify({ error: 'AI service temporarily unavailable due to configuration issue' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemInstruction = createSystemInstruction(storytellerMode);
    
    // 🛡️ ANTI-HALLUCINATION: Detect query type and adjust parameters
    const isFactual = isFactualQuery(prompt);
    const temperature = getOptimalTemperature(prompt, storytellerMode);
    
    // Enhanced logging with hallucination risk assessment
    console.log(`🎯 GriotBot Request:`, {
      model: MODEL,
      storytellerMode,
      isFactual,
      temperature,
      promptLength: prompt.length,
      timestamp: new Date().toISOString()
    });

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
        // 🌡️ Dynamic temperature based on query type
        temperature: temperature,
        // 📏 Shorter responses for factual queries to prevent elaboration
        max_tokens: isFactual ? 400 : (storytellerMode ? 600 : 800),
        // 🔄 Reduce repetition
        frequency_penalty: 0.3,
        presence_penalty: 0.1,
        provider: {
          order: ['openai'],
          allow_fallbacks: true
        }
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      
      console.error('OpenRouter API Error:', {
        status: openRouterResponse.status,
        errorData,
        model: MODEL,
        isFactual,
        timestamp: new Date().toISOString()
      });
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'AI service temporarily unavailable. Please try again in a moment.' 
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    const actualModel = data.model || MODEL;
    let responseContent = data.choices?.[0]?.message?.content;
    
    if (!responseContent) {
      responseContent = "I hear your question, and I'm reflecting on how best to share this wisdom with you. Could you try asking again?";
    }

    // 🔍 VALIDATE RESPONSE for potential hallucinations
    const validation = validateResponse(responseContent);
    
    // 🛡️ ENHANCE RESPONSE with confidence indicators for factual queries
    responseContent = addConfidenceIndicators(responseContent, isFactual);
    
    // 📊 Enhanced logging with hallucination risk assessment
    console.log('GriotBot Response Analysis:', {
      model: actualModel,
      cost: COST_PER_REQUEST,
      isFactual,
      temperature,
      hallucinationRisk: validation.riskLevel,
      suspiciousPatterns: validation.patterns,
      tokens: data.usage ? {
        prompt: data.usage.prompt_tokens,
        completion: data.usage.completion_tokens,
        total: data.usage.total_tokens
      } : null,
      timestamp: new Date().toISOString()
    });
    
    // 🚨 Log warnings for high-risk responses
    if (validation.riskLevel === 'high') {
      console.warn('🚨 HIGH HALLUCINATION RISK DETECTED:', {
        patterns: validation.patterns,
        prompt: prompt.substring(0, 100) + '...',
        response: responseContent.substring(0, 200) + '...'
      });
    }
    
    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: responseContent
            }
          }
        ],
        // Enhanced monitoring data
        model_used: actualModel,
        estimated_cost: COST_PER_REQUEST,
        is_free: false,
        usage: data.usage,
        // 🛡️ NEW: Hallucination risk assessment
        quality_metrics: {
          is_factual_query: isFactual,
          temperature_used: temperature,
          hallucination_risk: validation.riskLevel,
          confidence_enhanced: isFactual && responseContent !== data.choices?.[0]?.message?.content
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
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
 * 🎯 ENHANCED SYSTEM INSTRUCTION WITH ANTI-HALLUCINATION SAFEGUARDS
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
