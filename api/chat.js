// api/chat.js (server‑side)
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(500).json({ error: 'API key not set' });

  const userMessage = req.body.message;
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [{ role: 'user', content: userMessage }],
      }),
    }
  );
  const data = await response.json();
  return res.status(200).json(data);
}
