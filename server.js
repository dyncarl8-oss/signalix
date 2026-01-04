import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON body parsing
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// --- GEMINI AI ANALYSIS ENDPOINT ---
const MODEL_CHAIN = [
  'gemini-2.5-pro',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash'
];

app.post('/api/analyze', async (req, res) => {
  const { pairName, timeframe, ohlc, indicators } = req.body;
  
  console.log(`[Server] Starting Market Analysis for ${pairName} (${timeframe})`);

  if (!process.env.API_KEY) {
    console.error("[Server] Critical Error: API Key is missing.");
    return res.status(500).json({ error: "Server configuration error: API Key missing" });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare condensed OHLC data
  const recentOHLC = ohlc.slice(-15).map(d => ({
    t: new Date(d.time * 1000).toISOString().split('T')[1].substring(0,5),
    o: d.open,
    h: d.high,
    l: d.low,
    c: d.close,
    v: d.volumeto
  }));

  const prompt = `
    You are SignalixAI, an elite AI trading engine. 
    Analyze the following market data for ${pairName} on the ${timeframe} timeframe.
    
    Current Price: ${ohlc[ohlc.length-1].close}
    
    Technical Indicators (Computed):
    - RSI (14): ${indicators.rsi.value}
    - SMA (20): ${indicators.sma20.toFixed(2)}
    - SMA (50): ${indicators.sma50.toFixed(2)}
    - SMA (200): ${indicators.sma200.toFixed(2)}
    - Bollinger Bands: Upper ${indicators.bollinger.upper.toFixed(2)}, Lower ${indicators.bollinger.lower.toFixed(2)}
    - MACD: Value ${indicators.macd.value.toFixed(4)}

    Recent Price Action (Last 15 candles):
    ${JSON.stringify(recentOHLC, null, 2)}

    Task:
    1. First, engage in a deep "thought process".
       CRITICAL: Write this as raw text only. No markdown.
    2. Formulate a final verdict: UP, DOWN, or NEUTRAL.
       
    RULES FOR VERDICT:
    - If you see a CLEAR setup (UP or DOWN), your Confidence score MUST be between 90 and 99. DO NOT output a confidence below 90 for UP/DOWN signals.
    - If the market is choppy, unclear, or conflicting, you MUST output 'NEUTRAL'. In this case, confidence does not matter (set it to 0).
    - Users are paying for this. Do not guess. If unsure, say NEUTRAL.
    
    3. Estimate the duration for this move based on the ${timeframe} timeframe (e.g. "Next 4-8 Hours").
    
    Think deeply about market structure and risk.
  `;

  // Helper function to try models in sequence
  const tryGenerate = async (modelIndex) => {
    if (modelIndex >= MODEL_CHAIN.length) {
      console.error("[Server] All models in the chain failed.");
      throw new Error("All AI models failed to respond.");
    }

    const currentModel = MODEL_CHAIN[modelIndex];
    console.log(`[Server] Attempting analysis with model [${modelIndex + 1}/${MODEL_CHAIN.length}]: ${currentModel}`);

    try {
      const config = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            thoughtProcess: { type: Type.STRING, description: "Your raw internal monologue. No markdown." },
            verdict: { type: Type.STRING, enum: ['UP', 'DOWN', 'NEUTRAL'] },
            confidence: { type: Type.NUMBER },
            timeHorizon: { type: Type.STRING, description: "General horizon category e.g. 'Intraday'" },
            predictionDuration: { type: Type.STRING, description: "Specific estimated duration e.g. 'Next 4 Hours'" },
            summary: { type: Type.STRING, description: "A concise summary of the verdict for the user." },
            keyFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            entryZone: { type: Type.STRING },
            targetZone: { type: Type.STRING },
            stopLoss: { type: Type.STRING }
          },
          required: ['thoughtProcess', 'verdict', 'confidence', 'summary', 'keyFactors', 'riskWarnings', 'predictionDuration']
        }
      };

      console.log(`[Server] Sending request to ${currentModel}...`);
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: prompt,
        config: config
      });
      console.log(`[Server] Response received from ${currentModel}.`);

      const resultText = response.text;
      if (!resultText) {
        throw new Error(`Model ${currentModel} returned empty response.`);
      }
      
      try {
        const parsed = JSON.parse(resultText);
        console.log(`[Server] Analysis successful with ${currentModel}. Verdict: ${parsed.verdict}`);
        return parsed;
      } catch (e) {
        console.error(`[Server] JSON Parse Error for model ${currentModel}. Raw text:`, resultText);
        throw new Error("Invalid JSON response from AI");
      }

    } catch (error) {
       const errorMsg = error.message || JSON.stringify(error);
       
       if (
        errorMsg.includes("leaked") || 
        errorMsg.includes("API key") || 
        errorMsg.includes("PERMISSION_DENIED") || 
        errorMsg.includes("403")
      ) {
        console.error(`[Server] FATAL AUTH ERROR on ${currentModel}:`, errorMsg);
        throw new Error(`FATAL: API Key issue. ${errorMsg}`);
      }

      console.warn(`[Server] Model ${currentModel} failed (recoverable). Error:`, errorMsg);
      console.log(`[Server] Falling back to next model...`);
      return tryGenerate(modelIndex + 1);
    }
  };

  try {
    const result = await tryGenerate(0);
    res.json(result);
  } catch (error) {
    console.error("[Server] Final Analysis Failure:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// API Endpoint to create Polar Checkout
app.post('/api/create-checkout', async (req, res) => {
  try {
    const { customerEmail, userId } = req.body;
    
    // Load Token from Env
    const polarToken = process.env.POLAR_ACCESS_TOKEN;
    
    if (!polarToken) {
      console.error('Missing POLAR_ACCESS_TOKEN in .env file');
      return res.status(500).json({ error: 'Server configuration error: Missing Payment Token' });
    }

    const productId = '19c116dd-58c2-4df0-8904-c1cb6d617e95';
    
    // Determine the base URL for the success redirect
    // 1. Prefer explicitly set BASE_URL env var (Best for Render)
    // 2. Fallback to Request Origin header
    // 3. Fallback to constructing from host header (Render uses x-forwarded-proto)
    let origin = process.env.BASE_URL;
    
    if (!origin) {
      if (req.headers.origin) {
        origin = req.headers.origin;
      } else {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        origin = `${protocol}://${host}`;
      }
    }

    // Call Polar Sandbox API
    // Note: If you move to production, change this URL to https://api.polar.sh/v1/checkouts/
    const response = await fetch('https://sandbox-api.polar.sh/v1/checkouts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${polarToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: `${origin}?payment=success`,
        customer_email: customerEmail,
        metadata: {
          userId: userId
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polar API Error:', errorText);
      return res.status(response.status).json({ error: 'Failed to create checkout' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});