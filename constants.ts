import { CryptoPair } from './types';

// Read from environment variable (Vite prefix required) or fallback to the provided key
export const CRYPTOCOMPARE_API_KEY = (import.meta as any).env?.VITE_CRYPTOCOMPARE_API_KEY || '8a639309466b93ee7cbfafaae16279eb22cffe30d1c68a25d0047d2a77d43ab2';
export const CRYPTOCOMPARE_API_BASE = 'https://min-api.cryptocompare.com/data/v2';

export const SUPPORTED_PAIRS: CryptoPair[] = [
  // Majors
  { symbol: 'BTC/USDT', base: 'BTC', quote: 'USDT', name: 'Bitcoin', type: 'CRYPTO' },
  { symbol: 'ETH/USDT', base: 'ETH', quote: 'USDT', name: 'Ethereum', type: 'CRYPTO' },
  { symbol: 'BNB/USDT', base: 'BNB', quote: 'USDT', name: 'Binance Coin', type: 'CRYPTO' },
  { symbol: 'SOL/USDT', base: 'SOL', quote: 'USDT', name: 'Solana', type: 'CRYPTO' },
  { symbol: 'XRP/USDT', base: 'XRP', quote: 'USDT', name: 'Ripple', type: 'CRYPTO' },
  
  // L1s & L2s
  { symbol: 'ADA/USDT', base: 'ADA', quote: 'USDT', name: 'Cardano', type: 'CRYPTO' },
  { symbol: 'AVAX/USDT', base: 'AVAX', quote: 'USDT', name: 'Avalanche', type: 'CRYPTO' },
  { symbol: 'TRX/USDT', base: 'TRX', quote: 'USDT', name: 'Tron', type: 'CRYPTO' },
  { symbol: 'DOT/USDT', base: 'DOT', quote: 'USDT', name: 'Polkadot', type: 'CRYPTO' },
  { symbol: 'SUI/USDT', base: 'SUI', quote: 'USDT', name: 'Sui', type: 'CRYPTO' },
  { symbol: 'MATIC/USDT', base: 'MATIC', quote: 'USDT', name: 'Polygon', type: 'CRYPTO' },
  { symbol: 'LTC/USDT', base: 'LTC', quote: 'USDT', name: 'Litecoin', type: 'CRYPTO' },
  { symbol: 'HBAR/USDT', base: 'HBAR', quote: 'USDT', name: 'Hedera', type: 'CRYPTO' },
  { symbol: 'NEAR/USDT', base: 'NEAR', quote: 'USDT', name: 'Near Protocol', type: 'CRYPTO' },
  { symbol: 'ALGO/USDT', base: 'ALGO', quote: 'USDT', name: 'Algorand', type: 'CRYPTO' },
  { symbol: 'XLM/USDT', base: 'XLM', quote: 'USDT', name: 'Stellar', type: 'CRYPTO' },
  
  // DeFi & Utility
  { symbol: 'LINK/USDT', base: 'LINK', quote: 'USDT', name: 'Chainlink', type: 'CRYPTO' },
  { symbol: 'UNI/USDT', base: 'UNI', quote: 'USDT', name: 'Uniswap', type: 'CRYPTO' },
  { symbol: 'AAVE/USDT', base: 'AAVE', quote: 'USDT', name: 'Aave', type: 'CRYPTO' },
  { symbol: 'ONDO/USDT', base: 'ONDO', quote: 'USDT', name: 'Ondo Finance', type: 'CRYPTO' },
  { symbol: 'RWA/USDT', base: 'RWA', quote: 'USDT', name: 'Xend Finance', type: 'CRYPTO' },
  { symbol: 'XMR/USDT', base: 'XMR', quote: 'USDT', name: 'Monero', type: 'CRYPTO' },
  
  // Memes & High Volatility
  { symbol: 'DOGE/USDT', base: 'DOGE', quote: 'USDT', name: 'Dogecoin', type: 'CRYPTO' },
  { symbol: 'SHIB/USDT', base: 'SHIB', quote: 'USDT', name: 'Shiba Inu', type: 'CRYPTO' },
  { symbol: 'PEPE/USDT', base: 'PEPE', quote: 'USDT', name: 'Pepe', type: 'CRYPTO' },
  { symbol: 'WIF/USDT', base: 'WIF', quote: 'USDT', name: 'dogwifhat', type: 'CRYPTO' },
  { symbol: 'WLFI/USDT', base: 'WLFI', quote: 'USDT', name: 'World Liberty', type: 'CRYPTO' },
  { symbol: 'HYPE/USDT', base: 'HYPE', quote: 'USDT', name: 'Hyperliquid', type: 'CRYPTO' },

  // Forex
  { symbol: 'EUR/USD', base: 'EUR', quote: 'USD', name: 'Euro', type: 'FOREX' },
  { symbol: 'GBP/USD', base: 'GBP', quote: 'USD', name: 'British Pound', type: 'FOREX' },
  { symbol: 'AUD/USD', base: 'AUD', quote: 'USD', name: 'Aus Dollar', type: 'FOREX' },
  { symbol: 'JPY/USD', base: 'JPY', quote: 'USD', name: 'Japanese Yen', type: 'FOREX' },
];

export interface TimeframeConfig {
  label: string;
  value: string;
  limit: number;
  apiValue: 'histominute' | 'histohour' | 'histoday';
  aggregate: number;
  category: 'SCALP' | 'DAY' | 'SWING' | 'POSITION';
}

export const TIMEFRAMES: TimeframeConfig[] = [
  // Scalping (1m - 5m)
  { label: '1 Min', value: '1m', limit: 200, apiValue: 'histominute', aggregate: 1, category: 'SCALP' },
  { label: '3 Min', value: '3m', limit: 200, apiValue: 'histominute', aggregate: 3, category: 'SCALP' },
  { label: '5 Min', value: '5m', limit: 200, apiValue: 'histominute', aggregate: 5, category: 'SCALP' },
  
  // Day Trading (15m - 1h)
  { label: '15 Min', value: '15m', limit: 200, apiValue: 'histominute', aggregate: 15, category: 'DAY' },
  { label: '30 Min', value: '30m', limit: 200, apiValue: 'histominute', aggregate: 30, category: 'DAY' },
  { label: '1 Hour', value: '1h', limit: 200, apiValue: 'histohour', aggregate: 1, category: 'DAY' },
  
  // Swing Trading (2h - 1d)
  { label: '2 Hours', value: '2h', limit: 200, apiValue: 'histohour', aggregate: 2, category: 'SWING' },
  { label: '4 Hours', value: '4h', limit: 200, apiValue: 'histohour', aggregate: 4, category: 'SWING' },
  { label: '8 Hours', value: '8h', limit: 200, apiValue: 'histohour', aggregate: 8, category: 'SWING' },
  { label: '12 Hours', value: '12h', limit: 200, apiValue: 'histohour', aggregate: 12, category: 'SWING' },
  { label: '1 Day', value: '1d', limit: 200, apiValue: 'histoday', aggregate: 1, category: 'SWING' },
  
  // Position Trading (3d - 1w)
  { label: '3 Days', value: '3d', limit: 200, apiValue: 'histoday', aggregate: 3, category: 'POSITION' },
  { label: '1 Week', value: '1w', limit: 200, apiValue: 'histoday', aggregate: 7, category: 'POSITION' },
];

export const INITIAL_CREDITS = 3;
export const COST_PER_ANALYSIS = 1;