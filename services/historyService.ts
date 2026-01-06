import { 
  collection, 
  addDoc, 
  query, 
  where, 
  limit, 
  getDocs,
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { HistoryItem, AIAnalysisResult, CryptoPair } from "../types";

const COLLECTION_NAME = "analysis_history";

// Helper to send logs to the server terminal
const serverLog = (level: 'info' | 'warn' | 'error', message: string, details?: any) => {
  // Print to browser console too
  if (level === 'error') console.error(message, details);
  else console.log(message, details);

  // Fire and forget send to server
  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, message, details })
  }).catch(() => {}); // Ignore network errors for logs
};

// Robust sanitization to prevent "Unsupported Field Value: undefined" errors in Firestore
const sanitizeData = (data: any): any => {
  // Primitives
  if (data === null) return null;
  if (data === undefined) return null;
  if (typeof data !== 'object') return data;
  if (data instanceof Date) return data; // Keep Dates as is

  // Arrays
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  // Objects
  const newObj: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      // Firestore does not accept 'undefined', so we skip the key entirely
      if (value !== undefined) {
        newObj[key] = sanitizeData(value);
      }
    }
  }
  return newObj;
};

export const historyService = {
  
  async saveAnalysis(userId: string, pair: CryptoPair, timeframe: string, result: AIAnalysisResult) {
    serverLog('info', `[History] Attempting to save analysis for user: ${userId}`);
    
    if (!userId) {
      serverLog('error', "[History] Error: No User ID provided.");
      return;
    }

    try {
      // 1. Sanitize input data to ensure no undefined values exist
      const cleanResult = sanitizeData(result);
      const cleanPair = sanitizeData(pair);
      
      const payload = {
        userId,
        pair: cleanPair,
        timeframe,
        result: cleanResult,
        timestamp: Timestamp.now()
      };

      // 2. Write to Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
      serverLog('info', `[History] SUCCESS: Document written with ID: ${docRef.id}`);
      
    } catch (error: any) {
      serverLog('error', "[History] SAVE FAILED. Check Firestore Rules.", { code: error.code, message: error.message });
      
      if (error.code === 'permission-denied') {
        serverLog('error', ">> PERMISSION DENIED: Please copy the rules from firestore.rules into your Firebase Console.");
      }
    }
  },

  async getUserHistory(userId: string, maxItems = 20): Promise<HistoryItem[]> {
    serverLog('info', `[History] Fetching items for user: ${userId}`);
    try {
      // Create a query that requires an index for ordering
      // This will trigger the "Missing Index" link in the console error if the index doesn't exist
      const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"), // <--- This triggers the need for a composite index
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      serverLog('info', `[History] Found ${querySnapshot.size} documents.`);

      const items = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Handle timestamp conversion safely (fall back to Date.now() if missing)
        let ts = Date.now();
        if (data.timestamp && typeof data.timestamp.toMillis === 'function') {
           ts = data.timestamp.toMillis();
        } else if (data.timestamp instanceof Date) {
           ts = data.timestamp.getTime();
        }

        return {
          id: doc.id,
          userId: data.userId,
          pair: data.pair,
          timeframe: data.timeframe,
          result: data.result,
          timestamp: ts
        } as HistoryItem;
      });

      return items.slice(0, maxItems);

    } catch (error: any) {
      serverLog('error', `[History] FETCH FAILED: ${error.message}`);
      
      // If permission denied
      if (error.code === 'permission-denied') {
        serverLog('warn', ">> ACTION REQUIRED: Go to Firebase Console > Firestore > Rules and allow read/write for 'analysis_history'.");
      }

      // If missing index
      if (error.message && error.message.includes("index")) {
        serverLog('warn', ">> INDEX REQUIRED: Click the link in the browser console error to create the index.");
      }
      
      return [];
    }
  }
};