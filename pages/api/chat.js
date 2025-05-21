// pages/api/chat.js

const MODEL = 'anthropic/claude-3-haiku:beta';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.warn(`Method not allowed: ${req.method}`);
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method not allowed: ${req.method}` });
  }

  const { prompt, storytellerMode = false, isRegeneration = false } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res
      .status(400)
      .json({ error: 'prompt is required and must be a string' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENROUTER_API_KEY');
    return res.status(500).json({ error: 'API key not configured' });
  }

  const systemInstruction = createSystemInstruction(storytellerMode);

  console.log(`📡 Request → model: ${MODEL}, promptLength: ${prompt.length}`);

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt },
          ],
          temperature: storytellerMode ? 0.8 : 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('OpenRouter API error:', response.status, text);
      return res
        .status(502)
        .json({ error: `OpenRouter error: ${text}` });
    }

    const data = await response.json();
    const messageContent =
      data.choices?.[0]?.message?.content || 'No response from AI.';

    return res.status(200).json({
      choices: [{ message: { content: messageContent } }],
    });
  } catch (err) {
    console.error('Fetch error:', err);
    return res
      .status(502)
      .json({ error: `Network error: ${err.message}` });
  }
}

function createSystemInstruction(storytellerMode) {
  const date = new Date().toDateString();
  let instruction = `You are GriotBot, an AI assistant rooted in the West African griot tradition.
Provide culturally rich, concise responses with respect and clarity.
Break text into clear paragraphs. Avoid meta-statements.
Current date: ${date}`;

  if (storytellerMode) {
    instruction += `

STORYTELLER MODE:
Frame your answer as a narrative from African diaspora traditions.
Use vivid imagery, cultural references, and end with a reflective insight.`;
  }

  return instruction;
}
