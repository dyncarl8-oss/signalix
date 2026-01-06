import React, { useState } from 'react';
import { SUPPORTED_PAIRS, TIMEFRAMES } from '../constants';
import { CryptoPair, HistoryItem } from '../types';
import { Zap, Activity, Lock, Coins, BarChart2, Crown, History, PlayCircle, Clock, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface SidebarProps {
  selectedPair: CryptoPair;
  onSelectPair: (pair: CryptoPair) => void;
  selectedTimeframe: string;
  onSelectTimeframe: (tf: string) => void;
  credits: number;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onOpenPricing: () => void;
  isPro?: boolean;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedPair,
  onSelectPair,
  selectedTimeframe,
  onSelectTimeframe,
  credits,
  onAnalyze,
  isAnalyzing,
  onOpenPricing,
  isPro,
  history,
  onLoadHistory
}) => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'history'>('scanner');

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full lg:w-80 flex flex-col h-full border-r border-cyber-border bg-cyber-dark/50 overflow-hidden">
      
      {/* Brand & Credits Fixed Top */}
      <div className="p-4 bg-[#050508]/90 backdrop-blur z-10 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyber-cyan to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            <Activity className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">
            SIGNALIX<span className="text-cyber-cyan">AI</span>
          </h1>
        </div>

        {/* Credit Status */}
        <div className="glass-panel p-3 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            {isPro ? <Crown className="w-10 h-10" /> : <Zap className="w-10 h-10" />}
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-400 text-[10px] font-mono uppercase">{isPro ? 'Membership' : 'Neural Credits'}</span>
            {isPro ? <Crown className="w-3 h-3 text-yellow-500" /> : <Coins className="w-3 h-3 text-yellow-500" />}
          </div>
          
          {isPro ? (
             <div className="text-xl font-bold font-mono text-yellow-500">PRO <span className="text-xs text-gray-500 font-sans font-normal">active</span></div>
          ) : (
             <div className="text-xl font-bold font-mono text-white">{credits} <span className="text-xs text-gray-500 font-sans font-normal">available</span></div>
          )}

          {!isPro && (
            <button 
              onClick={onOpenPricing}
              className="text-[10px] text-cyber-cyan hover:text-white transition-colors underline decoration-dotted mt-1"
            >
              Get Unlimited Access &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-gray-800 bg-[#0a0a0f]">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'scanner' 
              ? 'text-white border-b-2 border-cyber-cyan bg-white/5' 
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" /> Scanner
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'history' 
              ? 'text-white border-b-2 border-cyber-cyan bg-white/5' 
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <History className="w-3.5 h-3.5" /> History
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        
        {/* SCANNER TAB */}
        {activeTab === 'scanner' && (
          <div className="flex flex-col gap-6">
            {/* Pair Selector */}
            <div>
              <label className="text-xs text-gray-500 font-mono uppercase mb-2 block">Market Asset</label>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {SUPPORTED_PAIRS.map(pair => (
                  <button
                    key={pair.symbol}
                    onClick={() => onSelectPair(pair)}
                    className={`flex items-center justify-between p-3 rounded border transition-all duration-200 text-sm ${
                      selectedPair.symbol === pair.symbol
                        ? 'bg-cyber-cyan/10 border-cyber-cyan/50 text-white shadow-[0_0_10px_rgba(0,243,255,0.1)]'
                        : 'bg-cyber-panel border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{pair.base}</span>
                      <span className="text-[10px] opacity-60">{pair.name}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-500">{pair.quote}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeframe Selector */}
            <div>
              <label className="text-xs text-gray-500 font-mono uppercase mb-2 block">Time Horizon</label>
              <div className="grid grid-cols-4 gap-2">
                {TIMEFRAMES.map(tf => (
                  <button
                    key={tf.value}
                    onClick={() => onSelectTimeframe(tf.value)}
                    className={`p-2 rounded border text-xs font-mono transition-all duration-200 ${
                      selectedTimeframe === tf.value
                        ? 'bg-cyber-magenta/10 border-cyber-magenta/50 text-white shadow-[0_0_10px_rgba(255,0,255,0.1)]'
                        : 'bg-cyber-panel border-transparent text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Spacer for button visibility */}
            <div className="h-20"></div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-3">
             {history.length === 0 ? (
               <div className="text-center py-10 text-gray-500">
                 <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                 <p className="text-xs font-mono">No analysis history found.</p>
               </div>
             ) : (
               history.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => onLoadHistory(item)}
                   className="w-full text-left bg-[#0f0f13] hover:bg-[#1a1a20] border border-gray-800 hover:border-gray-700 p-3 rounded-lg transition-all group relative overflow-hidden"
                 >
                   <div className="flex justify-between items-start mb-2 relative z-10">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-sm text-white">{item.pair.base}/{item.pair.quote}</span>
                         <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 font-mono">{item.timeframe}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                        item.result.verdict === 'UP' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                        item.result.verdict === 'DOWN' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                        'bg-yellow-900/20 text-yellow-400 border-yellow-900/50'
                      }`}>
                        {item.result.verdict === 'UP' && <ArrowUpRight className="w-3 h-3" />}
                        {item.result.verdict === 'DOWN' && <ArrowDownRight className="w-3 h-3" />}
                        {item.result.verdict === 'NEUTRAL' && <Minus className="w-3 h-3" />}
                        {item.result.verdict}
                      </span>
                   </div>
                   <div className="flex justify-between items-center relative z-10">
                      <span className="text-[10px] text-gray-600 font-mono">{formatTime(item.timestamp)}</span>
                      <span className="text-[10px] text-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity">Load Result &rarr;</span>
                   </div>
                   
                   {/* Verdict Glow */}
                   <div className={`absolute right-0 top-0 bottom-0 w-1 ${
                      item.result.verdict === 'UP' ? 'bg-green-500' :
                      item.result.verdict === 'DOWN' ? 'bg-red-500' : 'bg-yellow-500'
                   } opacity-50`}></div>
                 </button>
               ))
             )}
          </div>
        )}
      </div>

      {/* Action Button (Only visible on Scanner tab) */}
      {activeTab === 'scanner' && (
        <div className="p-4 bg-[#050508] border-t border-gray-800">
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || (!isPro && credits <= 0)}
            className={`w-full py-4 rounded font-bold text-sm tracking-widest uppercase transition-all duration-300 relative overflow-hidden group ${
              isAnalyzing 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                : (isPro || credits > 0)
                  ? 'bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]'
                  : 'bg-red-900/20 border border-red-800 text-red-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <BarChart2 className="animate-bounce w-4 h-4" /> Processing...
              </span>
            ) : (isPro || credits > 0) ? (
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Initiate Scan
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Insufficient Credits
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;