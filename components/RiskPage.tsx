import React, { useEffect } from 'react';
import { ArrowLeft, AlertTriangle, TrendingDown } from 'lucide-react';

interface RiskPageProps {
  onBack: () => void;
}

const RiskPage: React.FC<RiskPageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black text-gray-300 font-sans selection:bg-cyber-cyan selection:text-black relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 cyber-grid opacity-20"></div>
         <div className="absolute top-[-20%] right-[20%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 font-mono text-xs uppercase tracking-widest">
           <ArrowLeft className="w-4 h-4" /> Return to Terminal
        </button>

        <div className="border-b border-gray-800 pb-12 mb-12">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-900/20 rounded-lg flex items-center justify-center border border-red-900/50">
                 <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">RISK DISCLOSURE</h1>
           </div>
           <p className="text-gray-500 font-mono text-sm">Review Carefully Before Using Platform</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-gray-400">
           
           <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">
                 High Risk Warning
              </h3>
              <p className="text-red-200/80">
                 Trading cryptocurrencies, forex, and other financial instruments carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.
              </p>
           </div>

           <section>
              <h3 className="text-base font-bold text-white mb-3 uppercase tracking-wide">
                 1. AI Limitations
              </h3>
              <p>
                 SignalixAI uses advanced Large Language Models (LLMs) to analyze data. While powerful, these models can "hallucinate" or misinterpret technical patterns. 
                 <br/><br/>
                 <strong>AI signals are probabilistic, not deterministic.</strong> An 89% confidence score does NOT mean 89% of trades will win. It represents the model's internal certainty based on the training data, which may not reflect real-time market anomalies.
              </p>
           </section>

           <section>
              <h3 className="text-base font-bold text-white mb-3 uppercase tracking-wide">
                 2. Market Volatility
              </h3>
              <p>
                 Crypto markets operate 24/7 and can experience extreme volatility. Flash crashes, regulatory news, and exchange outages can render technical analysis irrelevant in seconds. SignalixAI does not account for black swan events or real-time news that hasn't been processed by the data feed.
              </p>
           </section>

           <section>
              <h3 className="text-base font-bold text-white mb-3 uppercase tracking-wide">
                 3. No Liability
              </h3>
              <p>
                 SignalixAI and its creators assume <strong>ZERO liability</strong> for financial losses incurred while using this platform. By using this tool, you acknowledge that you are solely responsible for your own trading decisions.
              </p>
           </section>

           <section>
              <h3 className="text-base font-bold text-white mb-3 uppercase tracking-wide">
                 4. Technical Failure
              </h3>
              <p>
                 Internet connectivity delays, API outages from data providers, or platform downtime may cause delays in signal generation. We do not guarantee 100% uptime or zero-latency data transmission.
              </p>
           </section>

           <div className="pt-12 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                 Trade Responsibly. Never invest what you cannot afford to lose.
              </p>
           </div>

        </div>
      </div>
    </div>
  );
};

export default RiskPage;