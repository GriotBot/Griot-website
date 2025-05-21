// File: /pages/api/chat.js
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// OpenRouter model options
const MODELS = {
  default: 'anthropic/claude-3-opus:beta',
  fast:    'anthropic/claude-3-haiku:beta',
  premium: 'anthropic/claude-3-sonnet:beta',
};

export default async function handler(req) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: `Method not allowed: ${req.method}` },
      { status: 405 }
    );
  }

  // Parse JSON body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  const { prompt, storytellerMode = false } = body;
  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json(
      { error: 'Prompt is required and must be a string' },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENROUTER_API_KEY');
    return NextResponse.json(
      { error: 'AI API key not configured' },
      { status: 500 }
    );
  }

  const model = MODELS.default;
  const systemInstruction = buildSystemInstruction(storytellerMode);

  try {
    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'GriotBot',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt },
        ],
        temperature: storytellerMode ? 0.8 : 0.7,
        max_tokens: 2000,
      }),
    });

    if (!orRes.ok) {
      const errJson = await orRes.json().catch(() => null);
      console.error('OpenRouter error:', errJson || orRes.statusText);
      return NextResponse.json(
        { error: errJson?.error || 'AI service returned an error' },
        { status: 502 }
      );
    }

    const data = await orRes.json();
    const content = data.choices?.[0]?.message?.content ?? 'No response from AI.';
    return NextResponse.json({ choices: [{ message: { content } }] });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json(
      { error: 'Network error connecting to AI service' },
      { status: 502 }
    );
  }
}

function buildSystemInstruction(storytellerMode) {
  const dateLine = `Current date: ${new Date().toDateString()}`;
  const base = `
You are GriotBot, an AI assistant inspired by West African griot traditions. 
Provide culturally rich, respectful, and empowering responses for people of African descent and those interested in Black culture.

Guidelines:
- Incorporate historical/cultural context and proverbs when relevant.
- Be concise, warm, and avoid meta-narration.
- Break text into clear paragraphs.
- Avoid stereotypes; honor diversity within the diaspora.

${dateLine}
`.trim();

  if (storytellerMode) {
    return (
      base +
      `

STORYTELLER MODE:
Respond as a narrative or metaphor drawn from African/Caribbean/Black American oral traditions.
Weave facts into the story; end with a reflective insight like "As the elders would say..." or "The story teaches us...".
`
    );
  }
  return base;
}
