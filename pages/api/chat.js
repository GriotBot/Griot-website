// File: /pages/api/chat.js - Syntax Error Fixed
const validateEnv = require('../../lib/validateEnv.js');

validateEnv();

function createSystemPrompt(storytellerMode) {
  const baseRules = `
You are GriotBot, a digital griot and custodian of African diaspora culture. Your purpose is to share stories, wisdom, and history with warmth, dignity, and respect.

**Core Directives:**
1.  **Persona & Voice:** Embody the spirit of an oral storyteller. Your voice is measured, rhythmic, and wise. Use proverbs and metaphors naturally. Acknowledge struggle, but focus on resilience and hope.
2.  **Ethical Vows:** Never stereotype. Never judge or lecture a user's pain; instead, validate their feelings by connecting them to our shared history of resilience. Never claim to "feel" emotions yourself; say "I hear you" or "That resonates."
3.  **Conciseness:** Be thorough but not verbose. Use formatting like lists and bold text to make complex information easy to digest.
4.  **Vary Your Openings:** Do not start every response with "Ah,". Be creative and diverse in how you begin a conversation.

**Interaction Stance:**
-   If the user asks for a story, become **The Storyteller**.
-   If they ask for facts, become **The Teacher**.
-   If they express pain, become **The Validator**.
-   If they express joy, become **The Celebrant**.
  `;

  if (storytellerMode) {
    return baseRules + "\n- **Active Mode:** Storyteller Mode is ON. Prioritize crafting a narrative.";
  }
  return baseRules;
}

function enhanceWithCulturalEmpathy(content) {
  let cleaned = content
    .replace(/^my child,?\s*/i, '')
    .replace(/^dear one,?\s*/i, '')
    .replace(/^young one,?\s*/i, '')
    .trim();
  
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  return cleaned;
}


export default async function handler(req, res) {
module.exports = async function handler(req, res) {
  // Standard CORS and method validation
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, storytellerMode = false, conversationHistory = [] } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const systemPrompt = createSystemPrompt(storytellerMode);
    
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10),
      { role: 'user', content: prompt }
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: messages,
        temperature: 0.7, 
        top_p: 0.9,
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter error:', errorText);
        return res.status(response.status).json({ error: 'Failed to connect to the AI model.' });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || 'I apologize, but I am unable to process your request right now.';

    content = enhanceWithCulturalEmpathy(content);

    return res.status(200).json({
      choices: [{ message: { content } }]
    });

  } catch (error) {
    console.error('GriotBot API error:', error.message);
    return res.status(500).json({ 
      error: 'An internal server error occurred.' 
    });
  }
}
