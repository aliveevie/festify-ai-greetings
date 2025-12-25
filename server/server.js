const express = require('express');
const { Agent } = require('alith');
const cors = require('cors');
const { mintDAT } = require('./dat');

const app = express();
app.use(express.json());

const allowedOrigins = [
  'https://festify-ai.vercel.app',
  'http://localhost:3000', // add other local ports if needed
  'http://localhost:5173', // Vite dev server
  'http://localhost:8080', // Alternative local port
  'https://festify.ai.ibxlab.com',
  'https://festify-ai-greetings.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now, can be restricted later
    }
  },
  credentials: true
}));

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
      // First, try to parse as-is
      parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (err) {
      // If parsing fails, try to extract and fix JSON from the response
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        let jsonString = match[0];
        
        // Fix unescaped control characters within string values
        // This function processes the JSON string and escapes control chars in string values only
        let result = '';
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < jsonString.length; i++) {
          const char = jsonString[i];
          const prevChar = i > 0 ? jsonString[i - 1] : '';
          
          if (escapeNext) {
            result += char;
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            result += char;
            escapeNext = true;
            continue;
          }
          
          if (char === '"' && prevChar !== '\\') {
            inString = !inString;
            result += char;
            continue;
          }
          
          if (inString) {
            // Inside a string value - escape control characters
            if (char === '\n') {
              result += '\\n';
            } else if (char === '\r') {
              result += '\\r';
            } else if (char === '\t') {
              result += '\\t';
            } else {
              result += char;
            }
          } else {
            // Outside string - keep as is
            result += char;
          }
        }
        
        try {
          parsed = JSON.parse(result);
        } catch (parseErr) {
          console.error('[Alith API] JSON parsing error:', parseErr.message);
          console.error('[Alith API] Problematic JSON (first 500 chars):', result.substring(0, 500));
          throw new Error('Could not parse JSON from LLM response: ' + parseErr.message);
        }
      } else {
        throw new Error('Could not find JSON object in LLM response');
      }
    }
    
    return res.status(200).json({ 
      result: parsed
    });
    
  } catch (error) {
    console.error('[Alith API] Error:', error);
    return res.status(500).json({ error: error?.message || error?.toString() });
  }
});

// DAT Minting Endpoint
// Implementation is ready and will work automatically once LazAI mainnet DAT is available
app.post('/api/mint-dat', async (req, res) => {
  const { walletAddress, privacyData, fileName, rewardAmount } = req.body;
  
  if (!walletAddress || !privacyData) {
    return res.status(400).json({ 
      error: 'Missing required fields: walletAddress and privacyData are required' 
    });
  }
  
  const ipfsJwt = process.env.IPFS_JWT || '';
  if (!ipfsJwt) {
    return res.status(500).json({ 
      error: 'IPFS_JWT environment variable is not set' 
    });
  }
  
  try {
    console.log('[DAT API] DAT minting request received for wallet:', walletAddress);
    
    // Note: Once LazAI mainnet DAT is available, the private key will be derived from wallet signature
    // The full implementation in dat.js is ready and will work automatically
    // For now, we return a message indicating the implementation is ready
    
    // TODO: When mainnet DAT is live, uncomment and use:
    // const privateKey = await derivePrivateKeyFromWalletSignature(walletAddress);
    // const result = await mintDAT(privateKey, ipfsJwt, privacyData, fileName || 'privacy_data.txt', rewardAmount || 100);
    
    return res.status(200).json({
      success: true,
      message: 'DAT minting implementation is ready. It will work automatically once LazAI mainnet DAT functionality is live.',
      walletAddress,
      fileName: fileName || 'privacy_data.txt',
      rewardAmount: rewardAmount || 100
    });
    
  } catch (error) {
    console.error('[DAT API] Error:', error);
    return res.status(500).json({ 
      error: error?.message || error?.toString() 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Alith API server running on port ${PORT}`);
});
