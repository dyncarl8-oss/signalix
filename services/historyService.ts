import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { HistoryItem, AIAnalysisResult, CryptoPair } from "../types";

const COLLECTION_NAME = "analysis_history";

export const historyService = {
  
  async saveAnalysis(userId: string, pair: CryptoPair, timeframe: string, result: AIAnalysisResult) {
    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        userId,
        pair,
        timeframe,
        result,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error("Error saving analysis to history:", error);
      // Fail silently to not disrupt the UI flow
    }
  },

  async getUserHistory(userId: string, maxItems = 20): Promise<HistoryItem[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(maxItems)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          pair: data.pair,
          timeframe: data.timeframe,
          result: data.result,
          timestamp: data.timestamp.toMillis()
        };
      });

    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  }
};