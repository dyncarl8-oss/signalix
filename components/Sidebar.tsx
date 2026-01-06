import React, { useState, useRef, useEffect } from 'react';
import { CryptoPair, HistoryItem, UserProfile } from '../types';
import { 
  Activity, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  LogOut, 
  Crown, 
  Zap, 
  CreditCard, 
  UserCircle2, 
  Settings,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  user: UserProfile;
  credits: number;
  onLogout: () => void;
  onOpenPricing: () => void;
  onOpenSubscription: () => void;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  credits,
  onLogout,
  onOpenPricing,
  onOpenSubscription,
  history,
  onLoadHistory
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050508] border-r border-gray-800 relative overflow-hidden">
      
      {/* 1. Branding Header */}
      <div className="p-6 pb-4 shrink-0 bg-[#050508]/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyber-cyan to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            <Activity className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white font-mono">
            SIGNALIX<span className="text-cyber-cyan">_AI</span>
          </h1>
        </div>
        <div className="mt-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest pl-1">
          Terminal v2.4.0
        </div>
      </div>

      {/* 2. History List (Scrollable) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
        <div className="flex items-center gap-2 mb-4 px-2 opacity-50">
           <Clock className="w-3 h-3 text-gray-400" />
           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Analysis Logs</span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-lg bg-gray-900/20 mx-2">
            <p className="text-xs text-gray-500 font-mono mb-2">No logs found</p>
            <p className="text-[10px] text-gray-600">Run a scan to generate history</p>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onLoadHistory(item)}
                className="w-full group bg-[#0a0a0f] hover:bg-[#15151a] border border-gray-800/50 hover:border-gray-700 rounded-lg p-3 transition-all text-left relative overflow-hidden"
              >
                {/* Result Indicator Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${
                   item.result.verdict === 'UP' ? 'bg-green-500' :
                   item.result.verdict === 'DOWN' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>

                <div className="flex justify-between items-start mb-1.5 pl-2">
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-gray-200 text-sm">{item.pair.base}/{item.pair.quote}</span>
                     <span className="text-[10px] text-gray-500 font-mono bg-gray-900 px-1 rounded">{item.timeframe}</span>
                  </div>
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${
                      item.result.verdict === 'UP' ? 'text-green-400' :
                      item.result.verdict === 'DOWN' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                      {item.result.verdict === 'UP' && <ArrowUpRight className="w-3 h-3" />}
                      {item.result.verdict === 'DOWN' && <ArrowDownRight className="w-3 h-3" />}
                      {item.result.verdict === 'NEUTRAL' && <Minus className="w-3 h-3" />}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pl-2">
                   <span className="text-[10px] text-gray-600 font-mono">{formatTime(item.timestamp)}</span>
                   <span className="text-[10px] text-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Load <ArrowUpRight className="w-2 h-2" />
                   </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Footer Section (Fixed) */}
      <div className="shrink-0 p-4 border-t border-gray-800 bg-[#08080c] relative z-20">
        
        {/* Credits / Plan Status Display */}
        <div className="mb-4 bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-4 rounded-xl relative overflow-hidden group">
           {/* Glow Effect */}
           {user.isPro && <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>}
           {!user.isPro && <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>}

           <div className="flex justify-between items-start relative z-10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                    {user.isPro ? 'Plan Status' : 'Credits Available'}
                 </span>
                 <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-mono font-bold ${user.isPro ? 'text-yellow-400' : 'text-white'}`}>
                       {user.isPro ? 'PRO' : credits}
                    </span>
                    {user.isPro && <span className="text-[10px] text-yellow-500/70 font-bold uppercase">Active</span>}
                 </div>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${user.isPro ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-gray-800 border-gray-700'}`}>
                 {user.isPro ? <Crown className="w-4 h-4 text-yellow-500" /> : <Zap className="w-4 h-4 text-purple-400" />}
              </div>
           </div>

           {!user.isPro ? (
             <button 
               onClick={onOpenPricing}
               className="w-full mt-3 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-cyber-cyan transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.1)]"
             >
               <Sparkles className="w-3 h-3" /> Get Pro Access
             </button>
           ) : (
             <div className="mt-2 text-[10px] text-gray-600 font-mono">
                Next billing: Auto-renewal active
             </div>
           )}
        </div>

        {/* User Profile Dropdown Area */}
        <div className="relative" ref={profileRef}>
          {isProfileOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#13131a] border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200">
               <div className="p-3 border-b border-gray-800/50">
                  <p className="text-white text-xs font-bold truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
               </div>
               <div className="p-1">
                 {user.isPro && (
                   <button
                     onClick={() => {
                        setIsProfileOpen(false);
                        onOpenSubscription();
                     }}
                     className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                   >
                     <CreditCard className="w-3.5 h-3.5" /> Manage Subscription
                   </button>
                 )}
                 <button 
                   onClick={onLogout}
                   className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-900/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2"
                 >
                   <LogOut className="w-3.5 h-3.5" /> Sign Out
                 </button>
               </div>
            </div>
          )}

          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all duration-200 ${isProfileOpen ? 'bg-gray-800 border-gray-700' : 'bg-transparent border-transparent hover:bg-gray-800/50 hover:border-gray-800'}`}
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-9 h-9 rounded-full border border-gray-700 object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                 <UserCircle2 className="w-5 h-5 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0 text-left">
               <div className="text-xs font-bold text-gray-200 truncate">{user.name}</div>
               <div className="text-[10px] text-gray-500 truncate font-mono">Online</div>
            </div>

            <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;