// File: /api/chat.js
// GriotBot API handler - FIXED VERSION
// Resolved all syntax errors and configuration issues

import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Use the correct DeepSeek model with chat completions
const MODEL = 'deepseek/deepseek-r1-0528:free';
const CHAT_COMPLETIONS_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req) {
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new NextResponse(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { 
      prompt, 
      storytellerMode = false,
      conversationHistory = []
    } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return new NextResponse(
        JSON.stringify({ error: 'Prompt is required and must be a string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || !apiKey.trim()) {
      console.error('❌ Missing OPENROUTER_API_KEY environment variable');
      return new NextResponse(
        JSON.stringify({ 
          error: 'API key not configured',
          debug: 'Check environment variables in Vercel dashboard'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Anti-hallucination detection
    const isFactualQuery = detectFactualQuery(prompt);
    const riskLevel = assessHallucinationRisk(prompt);
    
    // Create system prompt
    const systemPrompt = createSystemPrompt(storytellerMode, isFactualQuery);
    
    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      // Include last 10 messages from conversation history
      ...conversationHistory.slice(-10),
      { role: 'user', content: prompt }
    ];
    
    // Dynamic temperature based on query type
    const temperature = getTemperature(storytellerMode, isFactualQuery, riskLevel);
    
    // Request payload for chat completions
    const requestBody = {
      model: MODEL,
      messages: messages,
      temperature: temperature,
      max_tokens: storytellerMode ? 600 : 400,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
      stream: false // Disable streaming for now to fix connection issues
    };

    console.log(`🌿 GriotBot Request - Model: ${MODEL} (DeepSeek R1 Free), Temperature: ${temperature}`);
    
    // Call OpenRouter Chat Completions API
    const openRouterResponse = await fetch(CHAT_COMPLETIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'https://griot-website.vercel.app',
        'X-Title': 'GriotBot - Digital Griot Assistant'
      },
      body: JSON.stringify(requestBody)
    });

    // Check response status
    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('❌ OpenRouter API error:', {
        status: openRouterResponse.status,
        statusText: openRouterResponse.statusText,
        error: errorText
      });
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to connect to AI model',
          status: openRouterResponse.status,
          details: errorText,
          debug: 'Check API key validity and model availability'
        }),
        { status: openRouterResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse successful response
    const responseData = await openRouterResponse.json();
    
    // Validate response structure
    if (!responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
      console.error('❌ Invalid response structure:', responseData);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Invalid response from AI model',
          debug: 'Response structure is malformed'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const assistantMessage = responseData.choices[0].message.content;
    
    // Post-process response to remove any unwanted artifacts
    const cleanedResponse = cleanResponse(assistantMessage, storytellerMode);
    
    console.log('✅ GriotBot response generated successfully');
    
    // Return successful response
    return new NextResponse(
      JSON.stringify({
        response: cleanedResponse,
        model: MODEL,
        usage: responseData.usage || null,
        temperature: temperature
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        } 
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error in chat API:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        debug: 'Check server logs for detailed error information'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Creates the system prompt guiding GriotBot's behavior
 */
function createSystemPrompt(storytellerMode, isFactual) {
  const corePersonality = `You are GriotBot, an AI assistant inspired by the West African griot tradition. You provide culturally rich, emotionally intelligent responses for people of African descent and those interested in Black culture.

Your approach:
- Incorporate Black historical context, cultural wisdom, and empowerment
- Speak with the warmth and wisdom of a trusted elder or mentor
- Address questions with cultural nuance and understanding of the Black experience
- Include relevant proverbs, historical anecdotes, or notable Black figures when appropriate
- Be mindful of the diversity within the African diaspora
- Avoid stereotypes while acknowledging shared cultural experiences
- Be emotionally intelligent about racism, discrimination, and cultural identity
- Offer guidance that is empowering and uplifting`;

  // Add factual accuracy guidance for risky queries
  let factualGuidance = '';
  if (isFactual) {
    factualGuidance = '\n- When asked about specific historical facts, dates, or quotes, express appropriate uncertainty if you\'re not completely confident rather than guessing';
  }

  // Add storyteller mode guidance
  let storytellerGuidance = '';
  if (storytellerMode) {
    storytellerGuidance = '\n\n**Storyteller Mode Active:** Frame your response as a narrative or story, drawing from African, Caribbean, or Black American oral traditions. Use vivid imagery and conclude with reflective wisdom.';
  }

  return corePersonality + factualGuidance + storytellerGuidance;
}

/**
 * Detects if the query is asking for specific factual information
 */
function detectFactualQuery(prompt) {
  const factualPatterns = [
    /when (was|did|were)/i,
    /what year/i,
    /who (said|wrote|founded)/i,
    /how many/i,
    /what date/i,
    /born in/i,
    /died in/i,
    /founded in/i,
    /happened in \d{4}/i,
    /quote.*said/i,
    /exactly.*words/i
  ];
  
  return factualPatterns.some(pattern => pattern.test(prompt));
}

/**
 * Assesses the risk level for potential hallucination
 */
function assessHallucinationRisk(prompt) {
  const highRiskPatterns = [
    /exact(ly)? quote/i,
    /said exactly/i,
    /precise(ly)? words/i,
    /specific date/i,
    /exact number/i
  ];
  
  const mediumRiskPatterns = [
    /statistics/i,
    /percentage/i,
    /how many/i,
    /when exactly/i
  ];
  
  if (highRiskPatterns.some(pattern => pattern.test(prompt))) {
    return 'high';
  } else if (mediumRiskPatterns.some(pattern => pattern.test(prompt))) {
    return 'medium';
  }
  return 'low';
}

/**
 * Calculates appropriate temperature based on context
 */
function getTemperature(storytellerMode, isFactual, riskLevel) {
  // Base temperature
  let temperature = 0.7;
  
  // Adjust for storyteller mode
  if (storytellerMode) {
    temperature += 0.1; // More creative for stories
  }
  
  // Adjust for factual queries (more conservative)
  if (isFactual) {
    temperature -= 0.2;
  }
  
  // Adjust for risk level
  if (riskLevel === 'high') {
    temperature = Math.min(temperature - 0.2, 0.3); // Very conservative
  } else if (riskLevel === 'medium') {
    temperature -= 0.1;
  }
  
  // Ensure temperature stays in valid range
  return Math.max(0.1, Math.min(1.0, temperature));
}

/**
 * Cleans the AI response to remove unwanted artifacts
 */
function cleanResponse(response, storytellerMode) {
  if (!response || typeof response !== 'string') {
    return 'I apologize, but I encountered an issue generating a response. Please try asking your question again.';
  }
  
  // Remove common AI artifacts
  let cleaned = response
    .replace(/^(GriotBot|Assistant|AI):\s*/i, '') // Remove role prefixes
    .replace(/\[.*?\]/g, '') // Remove bracketed annotations
    .replace(/<.*?>/g, '') // Remove XML-like tags
    .trim();
  
  // Ensure response isn't empty after cleaning
  if (!cleaned) {
    return storytellerMode 
      ? 'Let me gather my thoughts and share a story with you. Please ask your question again.'
      : 'I\'m here to help with your question. Could you please rephrase it?';
  }
  
  return cleaned;
}
