import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Agent } from 'alith';

const agent = new Agent({
  model: 'gpt-4',
  preamble:
    'You are a professional AI agent specialized in crafting heartfelt, culturally rich, and personalized festival greetings. Your responses should include a title, a warm message, a creative design suggestion, interactive or digital features, and a note on cultural elements. Output your result as a JSON object with keys: title, message, design, interactive, cultural. Be concise, creative, and professional.',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const prompt = req.body?.prompt || req.query?.prompt;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt' });
  }
  try {
    console.log('[Alith API] Received prompt:', prompt);
    const raw = await agent.prompt(
      `Create a festival greeting based on this description: ${prompt}. Respond ONLY with a JSON object with keys: title, message, design, interactive, cultural.`
    );
    console.log('[Alith API] Raw response:', raw);
    let parsed;
    try {
      parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (err) {
      // Try to extract JSON from text if LLM returns extra text
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse JSON from LLM response');
      }
    }
    return res.status(200).json({ result: parsed });
  } catch (error: any) {
    console.error('[Alith API] Error:', error);
    return res.status(500).json({ error: error?.message || error?.toString() });
  }
} 