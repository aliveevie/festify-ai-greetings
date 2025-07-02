const express = require('express');
const { Agent } = require('alith');
const cors = require('cors');

const app = express();
app.use(express.json());

// Allow all origins for CORS
app.use(cors());
app.options('*', cors());

const agent = new Agent({
  model: 'gpt-4',
  preamble:
    'You are a professional AI agent specialized in crafting heartfelt, culturally rich, and personalized festival greetings. Your responses should include a title, a warm message, a creative design suggestion, interactive or digital features, and a note on cultural elements. Output your result as a JSON object with keys: title, message, design, interactive, cultural. Be concise, creative, and professional.',
});

app.get('/', (req, res) => {
  res.send('Alith API server is running');
});

app.post('/api/generate-greeting', async (req, res) => {
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
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse JSON from LLM response');
      }
    }
    return res.status(200).json({ result: parsed });
  } catch (error) {
    console.error('[Alith API] Error:', error);
    return res.status(500).json({ error: error?.message || error?.toString() });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Alith API server running on port ${PORT}`);
});
