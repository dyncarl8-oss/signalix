import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, OHLCData, TechnicalIndicators } from '../types';

// Fallback chain: Updated strictly per user request
const MODEL_CHAIN = [
  'gemini-2.5-pro',             // Primary
  'gemini-flash-latest',        // Fallback 1
  'gemini-flash-lite-latest',   // Fallback 2
  'gemini-2.5-flash'            // Fallback 3
];

export const analyzeMarket = async (
  pairName: string,
  timeframe: string,
  ohlc: OHLCData[],
  indicators: TechnicalIndicators
): Promise<AIAnalysisResult> => {
  console.log(`[SignalixAI] Starting Market Analysis for ${pairName} (${timeframe})`);
  
  if (!process.env.API_KEY || process.env.API_KEY.includes("PASTE_YOUR")) {
    console.error("[SignalixAI] Critical Error: API Key is missing or default placeholder.");
    throw new Error("Invalid API Key. Please update vite.config.ts with a valid Gemini API Key.");
  } else {
    console.log("[SignalixAI] API Key found (Masked):", process.env.API_KEY.substring(0, 8) + "...");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare a condensed version of OHLC for the prompt to save tokens but keep context
  const recentOHLC = ohlc.slice(-15).map(d => ({
    t: new Date(d.time * 1000).toISOString().split('T')[1].substr(0,5),
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

  // Helper to try models in sequence
  const tryGenerate = async (modelIndex: number): Promise<AIAnalysisResult> => {
    if (modelIndex >= MODEL_CHAIN.length) {
      console.error("[SignalixAI] All models in the chain failed.");
      throw new Error("All AI models failed to respond. Please check your API Key and quota.");
    }

    const currentModel = MODEL_CHAIN[modelIndex];
    console.log(`[SignalixAI] Attempting analysis with model [${modelIndex + 1}/${MODEL_CHAIN.length}]: ${currentModel}`);

    try {
      const config: any = {
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

      console.log(`[SignalixAI] Sending request to ${currentModel}...`);
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: prompt,
        config: config
      });
      console.log(`[SignalixAI] Response received from ${currentModel}.`);

      const resultText = response.text;
      if (!resultText) {
        throw new Error(`Model ${currentModel} returned empty response.`);
      }

      console.log(`[SignalixAI] Parsing JSON response from ${currentModel}...`);
      
      try {
        const parsed = JSON.parse(resultText) as AIAnalysisResult;
        console.log(`[SignalixAI] Analysis successful with ${currentModel}. Verdict: ${parsed.verdict}`);
        return parsed;
      } catch (e) {
        console.error(`[SignalixAI] JSON Parse Error for model ${currentModel}. Raw text:`, resultText);
        throw new Error("Invalid JSON response from AI");
      }

    } catch (error: any) {
      const errorMsg = error.message || JSON.stringify(error);
      
      // CRITICAL: Fail fast if API key is invalid/blocked/leaked
      if (
        errorMsg.includes("leaked") || 
        errorMsg.includes("API key") || 
        errorMsg.includes("PERMISSION_DENIED") || 
        errorMsg.includes("403")
      ) {
        console.error(`[SignalixAI] FATAL AUTH ERROR on ${currentModel}:`, errorMsg);
        throw new Error(`FATAL: API Key is invalid or leaked. Please replace the key in vite.config.ts. Google says: ${errorMsg}`);
      }

      console.warn(`[SignalixAI] Model ${currentModel} failed (recoverable). Error:`, errorMsg);
      
      // Recursive call to next model
      console.log(`[SignalixAI] Falling back to next model...`);
      return tryGenerate(modelIndex + 1);
    }
  };

  try {
    return await tryGenerate(0);
  } catch (error: any) {
    console.error("[SignalixAI] Final Analysis Failure:", error.message);
    throw error;
  }
};