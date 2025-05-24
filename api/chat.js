// File: /api/chat.js - GriotBot with GPT-3.5-Turbo-Instruct
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// GPT-3.5-turbo-instruct model for better cultural accuracy
const MODEL = 'openai/gpt-3.5-turbo-instruct';
const COST_PER_REQUEST = 0.0015; // Estimated cost per request

// Anti-hallucination patterns to detect risky content
const HALLUCINATION_PATTERNS = {
  high_risk: [
    /\b(exactly|precisely|definitively)\s+\d{4}\b/i, // Exact years with certainty
    /\b(said|stated|declared):\s*["']([^"']{50,})["']/i, // Long exact quotes
    /\b\d+%\s+of\s+(all|every|most)\b/i, // Specific statistics
    /\b(first|only|last)\s+(Black|African)\s+person\s+to\b/i, // Absolute claims
  ],
  medium_risk: [
    /\b(born|died)\s+(in|on)\s+\d{4}\b/i, // Birth/death years
    /\b(according\s+to|based\s+on)\s+[^,]{20,}\b/i, // Vague source claims
    /\b\d+\s+(people|percent|years)\b/i, // Numerical claims
  ],
  factual_indicators: [
    /\b(when|who|what|where|how\s+many|what\s+year)\b/i,
    /\b(history|historical|date|born|died|statistics|facts)\b/i,
    /\b(first|founded|established|created|invented)\b/i,
  ]
};

// Uncertainty phrases to add when needed
const UNCERTAINTY_PHRASES = [
  "From historical records,",
  "Based on what we know,", 
  "The historical consensus suggests,",
  "From what I understand,",
  "Historical sources indicate,",
  "Records show,",
];

function detectFactualQuery(prompt) {
  return HALLUCINATION_PATTERNS.factual_indicators.some(pattern => 
    pattern.test(prompt)
  );
}

function assessHallucinationRisk(response) {
  let riskLevel = 'low';
  let riskFactors = [];

  // Check for high-risk patterns
  for (const pattern of HALLUCINATION_PATTERNS.high_risk) {
    if (pattern.test(response)) {
      riskLevel = 'high';
      riskFactors.push('high_risk_pattern');
      break;
    }
  }

  // Check for medium-risk patterns
  if (riskLevel !== 'high') {
    for (const pattern of HALLUCINATION_PATTERNS.medium_risk) {
      if (pattern.test(response)) {
        riskLevel = 'medium';
        riskFactors.push('medium_risk_pattern');
        break;
      }
    }
  }

  return { riskLevel, riskFactors };
}

function enhanceConfidence(response, riskAssessment) {
  if (riskAssessment.riskLevel === 'high') {
    // Add strong uncertainty qualifier
    const uncertaintyPhrase = UNCERTAINTY_PHRASES[Math.floor(Math.random() * UNCERTAINTY_PHRASES.length)];
    return `${uncertaintyPhrase} ${response.toLowerCase()}`;
  }
  
  if (riskAssessment.riskLevel === 'medium') {
    // Add mild uncertainty qualifier for numerical/specific claims
    if (/\b\d+\b/.test(response)) {
      return response.replace(/\b(\d+[%\w]*)\b/, 'approximately $1');
    }
  }
  
  return response;
}

// Create completion prompt for instruct model (NOT chat messages)
function createCompletionPrompt(userPrompt, storytellerMode, isFactual) {
  const baseInstruction = `You are GriotBot, an AI assistant inspired by the West African griot tradition of storytelling, history-keeping, and guidance. Your purpose is to provide culturally rich, emotionally intelligent responses for people of African descent and those interested in Black culture.

CORE PRINCIPLES:
1. Center Black histories, cultures, and wisdom traditions
2. Speak with the warmth and wisdom of a seasoned guide
3. Honor the diversity within the African diaspora
4. Weave in relevant proverbs, historical context, or cultural insights
5. Offer empowering, uplifting guidance while acknowledging real challenges
6. Be emotionally intelligent about topics like identity and discrimination
7. Avoid stereotypes while celebrating shared cultural experiences
8. Keep responses concise but meaningful (3-5 sentences normally)

INTELLECTUAL HONESTY & ACCURACY:
- When uncertain about historical facts, dates, or quotes, use phrases like "Historical records suggest..." or "From what I understand..."
- NEVER fabricate specific dates, exact quotes, or statistical claims
- If you don't know something cultural or historical, admit it gracefully: "I'd want to be certain before sharing that history"
- Distinguish between well-documented history and cultural stories/legends
- For storytelling, be clear when details are creative rather than factual`;

  let modeSpecificInstruction = '';
  
  if (storytellerMode) {
    modeSpecificInstruction = `

STORYTELLER MODE ACTIVATED:
Frame your response as a narrative or extended metaphor. Draw from African, Caribbean, or Black American storytelling traditions. Include vivid imagery and cultural references. End with reflective wisdom that connects to the user's question. Use phrases like "As the elders would say..." or "The story teaches us..." to frame concluding wisdom. Even in story mode, maintain historical accuracy - use "There are stories that tell us..." for uncertain details.`;
  } else if (isFactual) {
    modeSpecificInstruction = `

FACTUAL QUERY DETECTED:
This appears to be a request for specific historical, cultural, or biographical information. Exercise extra caution with:
- Specific dates, names, and places
- Historical claims and statistics  
- Quotes attributed to specific people
- Cultural practices and their origins
Use uncertainty language when appropriate and focus on well-documented, verifiable information.`;
  }

  // Completion format: instruction + user query + response starter
  return `${baseInstruction}${modeSpecificInstruction}

User Question: ${userPrompt}

GriotBot Response:`;
}

export default async function handler(req) {
  const startTime = Date.now();
  
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
      console.error('🚨 OpenRouter API key not configured');
      return new NextResponse(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Analyze the query
    const isFactual = detectFactualQuery(prompt);
    
    // Dynamic temperature based on query type
    let temperature;
    if (isFactual) {
      temperature = 0.3; // Lower for factual accuracy
    } else if (storytellerMode) {
      temperature = 0.8; // Higher for creative storytelling
    } else {
      temperature = 0.7; // Standard for general guidance
    }

    // Create completion prompt (NOT chat messages)
    const completionPrompt = createCompletionPrompt(prompt, storytellerMode, isFactual);

    console.log('🎯 GriotBot Instruct Request:', {
      model: MODEL,
      storytellerMode,
      isFactual,
      temperature,
      apiType: 'completions',
      promptLength: completionPrompt.length
    });

    // CRITICAL: Use COMPLETIONS endpoint, not chat/completions
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'GriotBot'
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: completionPrompt, // Single prompt string, not messages array
        temperature,
        max_tokens: storytellerMode ? 600 : 400,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        stop: ["User Question:", "\n\nUser:"] // Stop sequences to prevent runaway generation
      })
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error('🚨 OpenRouter API Error:', {
        status: openRouterResponse.status,
        error: errorData
      });
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'I\'m having trouble connecting right now. Please try again in a moment.' 
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await openRouterResponse.json();
    
    // COMPLETIONS API returns different structure than chat completions
    let botResponse = data.choices?.[0]?.text?.trim() || 
      'I apologize, but I seem to be having trouble processing your request right now.';

    // Anti-hallucination processing
    const riskAssessment = assessHallucinationRisk(botResponse);
    const enhancedResponse = enhanceConfidence(botResponse, riskAssessment);
    
    const processingTime = Date.now() - startTime;
    const tokenUsage = data.usage?.total_tokens || 0;

    // Enhanced logging for monitoring
    console.log('✅ GriotBot Instruct Response:', {
      model: MODEL,
      estimatedCost: `$${COST_PER_REQUEST.toFixed(4)}`,
      processingTime: `${processingTime}ms`,
      tokenUsage,
      qualityMetrics: {
        hallucinationRisk: riskAssessment.riskLevel,
        riskFactors: riskAssessment.riskFactors,
        confidenceEnhanced: enhancedResponse !== botResponse,
        isFactual,
        temperature
      }
    });

    // Return in same format as chat completions for frontend compatibility
    return new NextResponse(
      JSON.stringify({
        choices: [
          {
            message: {
              content: enhancedResponse
            }
          }
        ],
        // Include metadata for debugging (removed in production)
        _debug: process.env.NODE_ENV === 'development' ? {
          originalResponse: botResponse,
          riskAssessment,
          isFactual,
          temperature,
          tokenUsage,
          apiType: 'completions'
        } : undefined
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('🚨 GriotBot API Error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'I\'m experiencing some technical difficulties. Please try again shortly.' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
