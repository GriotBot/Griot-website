// File: /pages/api/chat.js - With Streaming Enabled

// This helper function creates the system prompt for the AI.
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


export default async function handler(req, res) {
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

    // Request a streaming response from the AI model
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
        stream: true, // FIXED: This tells the API to start streaming the response
      })
    });

    if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();
        console.error('OpenRouter error:', errorText);
        return res.status(openRouterResponse.status).json({ error: 'Failed to connect to the AI model.' });
    }

    // FIXED: Pipe the streaming response directly back to the frontend.
    // This ReadableStream will deliver the response word-by-word.
    const stream = new ReadableStream({
      async start(controller) {
        const reader = openRouterResponse.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonStr = line.replace('data: ', '');
                if (jsonStr === '[DONE]') {
                    controller.close();
                    return;
                }
                try {
                    const parsed = JSON.parse(jsonStr);
                    const content = parsed.choices[0]?.delta?.content;
                    if (content) {
                        controller.enqueue(content);
                    }
                } catch (e) {
                    console.error('Error parsing stream chunk:', e);
                }
            }
          }
        }
        controller.close();
      },
    });
    
    // Send the stream back to the client
    return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

  } catch (error) {
    console.error('GriotBot API error:', error.message);
    return res.status(500).json({ 
      error: 'An internal server error occurred.' 
    });
  }
}
