import { 
  collection, 
  addDoc, 
  query, 
  where, 
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
      console.log("Analysis saved to history");
    } catch (error) {
      console.error("Error saving analysis to history:", error);
    }
  },

  async getUserHistory(userId: string, maxItems = 20): Promise<HistoryItem[]> {
    try {
      // Note: We removed orderBy("timestamp", "desc") to prevent "Missing Index" errors
      // if the compound index isn't created in Firebase Console manually.
      // We will sort in memory instead.
      const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
        limit(50) // Fetch a bit more to sort client-side
      );

      const querySnapshot = await getDocs(q);
      
      const items = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          pair: data.pair,
          timeframe: data.timeframe,
          result: data.result,
          timestamp: data.timestamp && data.timestamp.toMillis ? data.timestamp.toMillis() : Date.now()
        };
      });

      // Sort client-side (Newest first)
      return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, maxItems);

    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  }
};