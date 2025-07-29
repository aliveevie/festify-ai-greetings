const express = require('express');
const { Agent } = require('alith');
const cors = require('cors');

const app = express();
app.use(express.json());

const allowedOrigins = [
  'https://festify-ai.vercel.app',
  'http://localhost:3000', // add other local ports if needed
];

app.use(cors());

// Rate limiting and usage tracking
const usageTracker = new Map();
const DAILY_LIMIT = 2; // Maximum 2 greetings per day
const COOLDOWN_HOURS = 12; // 12-hour cooldown between requests

// Helper function to get client IP
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.ip || 
         'unknown';
}

// Helper function to check if user can generate greeting
function canGenerateGreeting(ip) {
  const now = Date.now();
  const userData = usageTracker.get(ip) || { 
    dailyCount: 0, 
    lastRequest: 0, 
    dailyReset: getStartOfDay(now) 
  };
  
  // Check if we need to reset daily count
  if (now >= userData.dailyReset) {
    userData.dailyCount = 0;
    userData.dailyReset = getStartOfDay(now) + (24 * 60 * 60 * 1000); // Next day
  }
  
  // Check daily limit
  if (userData.dailyCount >= DAILY_LIMIT) {
    return {
      allowed: false,
      reason: 'daily_limit_exceeded',
      message: `Daily limit of ${DAILY_LIMIT} greetings exceeded. Please try again tomorrow.`,
      nextReset: new Date(userData.dailyReset).toISOString()
    };
  }
  
  // Check cooldown period
  const timeSinceLastRequest = now - userData.lastRequest;
  const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
  
  if (userData.lastRequest > 0 && timeSinceLastRequest < cooldownMs) {
    const remainingTime = cooldownMs - timeSinceLastRequest;
    const remainingHours = Math.ceil(remainingTime / (60 * 60 * 1000));
    
    return {
      allowed: false,
      reason: 'cooldown_active',
      message: `Please wait ${remainingHours} hour(s) before generating another greeting.`,
      remainingTime: remainingTime,
      nextAllowed: new Date(userData.lastRequest + cooldownMs).toISOString()
    };
  }
  
  return { allowed: true };
}

// Helper function to get start of day timestamp
function getStartOfDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

// Helper function to update usage tracker
function updateUsageTracker(ip) {
  const now = Date.now();
  const userData = usageTracker.get(ip) || { 
    dailyCount: 0, 
    lastRequest: 0, 
    dailyReset: getStartOfDay(now) 
  };
  
  // Reset daily count if needed
  if (now >= userData.dailyReset) {
    userData.dailyCount = 0;
    userData.dailyReset = getStartOfDay(now) + (24 * 60 * 60 * 1000);
  }
  
  userData.dailyCount += 1;
  userData.lastRequest = now;
  
  usageTracker.set(ip, userData);
  
  return userData;
}

// Cleanup old entries periodically (every hour)
setInterval(() => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  for (const [ip, data] of usageTracker.entries()) {
    if (now - data.lastRequest > oneDayMs) {
      usageTracker.delete(ip);
    }
  }
}, 60 * 60 * 1000); // Run every hour

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
  
  // Get client IP for rate limiting
  const clientIP = getClientIP(req);
  console.log(`[Rate Limit] Request from IP: ${clientIP}`);
  
  // Check if user can generate greeting
  const usageCheck = canGenerateGreeting(clientIP);
  
  if (!usageCheck.allowed) {
    console.log(`[Rate Limit] Request denied for IP ${clientIP}: ${usageCheck.reason}`);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      reason: usageCheck.reason,
      message: usageCheck.message,
      ...(usageCheck.nextReset && { nextReset: usageCheck.nextReset }),
      ...(usageCheck.nextAllowed && { nextAllowed: usageCheck.nextAllowed }),
      ...(usageCheck.remainingTime && { remainingTime: usageCheck.remainingTime })
    });
  }
  
  try {
    console.log(`[Alith API] Processing request for IP: ${clientIP}`);
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
    
    // Update usage tracker after successful generation
    const updatedUsage = updateUsageTracker(clientIP);
    console.log(`[Rate Limit] Updated usage for IP ${clientIP}: ${updatedUsage.dailyCount}/${DAILY_LIMIT} daily, last request: ${new Date(updatedUsage.lastRequest).toISOString()}`);
    
    return res.status(200).json({ 
      result: parsed,
      usage: {
        dailyCount: updatedUsage.dailyCount,
        dailyLimit: DAILY_LIMIT,
        remainingToday: DAILY_LIMIT - updatedUsage.dailyCount,
        nextAllowed: new Date(updatedUsage.lastRequest + (COOLDOWN_HOURS * 60 * 60 * 1000)).toISOString()
      }
    });
    
  } catch (error) {
    console.error('[Alith API] Error:', error);
    return res.status(500).json({ error: error?.message || error?.toString() });
  }
});

// Add endpoint to check current usage status
app.get('/api/usage-status', (req, res) => {
  const clientIP = getClientIP(req);
  const userData = usageTracker.get(clientIP);
  
  if (!userData) {
    return res.json({
      dailyCount: 0,
      dailyLimit: DAILY_LIMIT,
      remainingToday: DAILY_LIMIT,
      canGenerate: true,
      nextAllowed: null
    });
  }
  
  const now = Date.now();
  const usageCheck = canGenerateGreeting(clientIP);
  
  return res.json({
    dailyCount: userData.dailyCount,
    dailyLimit: DAILY_LIMIT,
    remainingToday: Math.max(0, DAILY_LIMIT - userData.dailyCount),
    canGenerate: usageCheck.allowed,
    lastRequest: userData.lastRequest > 0 ? new Date(userData.lastRequest).toISOString() : null,
    nextAllowed: usageCheck.allowed ? null : usageCheck.nextAllowed,
    dailyReset: new Date(userData.dailyReset).toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Alith API server running on port ${PORT}`);
  console.log(`Rate limiting: ${DAILY_LIMIT} greetings per day, ${COOLDOWN_HOURS}-hour cooldown`);
});
