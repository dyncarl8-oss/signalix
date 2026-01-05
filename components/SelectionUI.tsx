import React from 'react';
import { SUPPORTED_PAIRS, TIMEFRAMES } from '../constants';
import { CryptoPair } from '../types';

export const PairSelector: React.FC<{ onSelect: (pair: CryptoPair) => void }> = ({ onSelect }) => {
  const crypto = SUPPORTED_PAIRS.filter(p => p.type === 'CRYPTO');
  const forex = SUPPORTED_PAIRS.filter(p => p.type === 'FOREX');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-[#0b0b10] p-4 rounded-xl border border-gray-800 w-full shadow-lg">
      <h3 className="text-xs font-mono uppercase text-gray-500 mb-3 tracking-widest pl-1">Crypto Assets</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {crypto.map(pair => (
          <button
            key={pair.symbol}
            onClick={() => onSelect(pair)}
            className="px-3 py-3 rounded-lg bg-black/40 border border-gray-800 hover:border-cyber-cyan hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all text-xs font-bold text-gray-300 flex items-center justify-center"
          >
            {pair.symbol}
          </button>
        ))}
      </div>

      <h3 className="text-xs font-mono uppercase text-gray-500 mb-3 tracking-widest pl-1">Forex Assets</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
         {forex.map(pair => (
          <button
            key={pair.symbol}
            onClick={() => onSelect(pair)}
            className="px-3 py-3 rounded-lg bg-black/40 border border-gray-800 hover:border-cyber-magenta hover:text-cyber-magenta hover:bg-cyber-magenta/10 transition-all text-xs font-bold text-gray-300 flex items-center justify-center"
          >
            {pair.symbol}
          </button>
        ))}
      </div>
    </div>
  );
};

export const TimeframeSelector: React.FC<{ onSelect: (tf: string) => void }> = ({ onSelect }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-[#0b0b10] p-6 rounded-xl border border-gray-800 w-full shadow-lg">
      <h3 className="text-xs font-mono uppercase text-gray-500 mb-6 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center text-[10px]">2</span>
        Select Trading Timeframe
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
         {TIMEFRAMES.map(tf => (
            <button
              key={tf.value}
              onClick={() => onSelect(tf.value)}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-black/40 border border-gray-800 hover:border-purple-500 hover:bg-purple-500/10 group transition-all"
            >
              <span className="text-lg font-bold text-gray-200 group-hover:text-purple-400 mb-1">{tf.value}</span>
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">{tf.label.split(' ')[0]}</span>
            </button>
         ))}
      </div>
    </div>
  );
};