import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, Brain, Zap, Shield, Terminal as TerminalIcon, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030304] text-white overflow-hidden font-sans selection:bg-cyan-500/30 relative">
      
      {/* Background - Clean Deep Space (No Grid) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] bg-blue-900/5 rounded-full blur-[150px] opacity-30"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/5 rounded-full blur-[150px] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 20 ? 'bg-[#030304]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
               <Activity className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Signalix<span className="text-cyan-500">AI</span></span>
          </div>
          
          <div className="flex items-center gap-8">
            <button onClick={onLogin} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log in</button>
            <button 
              onClick={onGetStarted}
              className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[90vh] flex flex-col justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span className="text-[10px] font-mono font-medium text-gray-400 tracking-widest uppercase">Engine Online v2.5</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-white leading-[1.05]">
            See beyond charts. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Trade Smarter.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
             Institutional-grade analysis, decoded in real-time.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <button 
              onClick={onGetStarted}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 group transform hover:-translate-y-1"
            >
              Start Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Split Layout: Terminal & Features */}
      <section className="relative z-10 py-32 px-6 border-t border-white/5 bg-[#050508]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           
           {/* Left: Minimal Terminal */}
           <div className="relative group">
              {/* Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-[#0a0a0f] shadow-2xl">
                 <div className="h-9 bg-[#121216] flex items-center px-4 justify-between border-b border-gray-800">
                    <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <span className="text-[10px] font-mono text-gray-600">analysis_stream.log</span>
                 </div>
                 <div className="p-6 font-mono text-xs md:text-sm space-y-3 bg-black/50 h-[400px]">
                    <div className="flex gap-3 opacity-50">
                       <span className="text-gray-600">[10:42:01]</span>
                       <span className="text-green-500">CONNECTING...</span>
                    </div>
                    <div className="flex gap-3">
                       <span className="text-gray-600">[10:42:03]</span>
                       <span className="text-purple-400">ANALYZING_STRUCTURE</span>
                       <span className="text-gray-400">BTC/USD 4h</span>
                    </div>
                    <div className="pl-24 text-gray-500 text-[10px] space-y-1 border-l border-gray-800 ml-3 py-2">
                       <p>Checking RSI(14) divergence...</p>
                       <p>Validating volume profile...</p>
                       <p>Calculating invalidation levels...</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                       <span className="text-gray-600">[10:42:05]</span>
                       <span className="text-cyan-400">VERDICT_GENERATED</span>
                    </div>
                    <div className="mt-4 bg-[#15151a] border border-gray-800 p-4 rounded-lg">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-green-400 font-bold">BULLISH CONFIRMED</span>
                          <span className="text-gray-500">94%</span>
                       </div>
                       <div className="w-full bg-gray-800 h-1 rounded-full mb-3">
                          <div className="w-[94%] bg-green-500 h-1 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                       </div>
                       <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                          <span>TARGET: $68,500</span>
                          <span>STOP: $63,800</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Context */}
           <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight text-white">
                 Neural Transparency.
                 <span className="block text-gray-500 mt-2 text-2xl font-medium">No more black boxes.</span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                 Unlike other signals that give you a blind "Buy" or "Sell", SignalixAI exposes its entire thought process. Watch the neural engine weigh indicators, check market regimes, and calculate risk in real-time.
              </p>
              
              <div className="space-y-4 pt-4">
                 <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                       <Brain className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-sm">Logic Streams</h3>
                       <p className="text-xs text-gray-500 mt-0.5">Follow the AI's reasoning step-by-step.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                       <Zap className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-sm">Instant Execution</h3>
                       <p className="text-xs text-gray-500 mt-0.5">30+ indicators processed in milliseconds.</p>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#020203] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           
           <div className="flex items-center gap-2">
              <span className="font-medium text-xs text-gray-700">
                 &copy; 2026 SignalixAI. All rights reserved. <span className="mx-2 opacity-30">|</span> Trading involves risk.
              </span>
           </div>
           
           <div className="flex items-center gap-8">
              <button className="text-[10px] font-medium text-gray-700 hover:text-gray-400 transition-colors uppercase tracking-wider">Terms</button>
              <button className="text-[10px] font-medium text-gray-700 hover:text-gray-400 transition-colors uppercase tracking-wider">Privacy</button>
              <button className="text-[10px] font-medium text-gray-700 hover:text-gray-400 transition-colors uppercase tracking-wider">Risk</button>
           </div>

        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
     <div className="mb-4 p-3 rounded-lg bg-black border border-gray-800 w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
     </div>
     <h3 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
       {title} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-500" />
     </h3>
     <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;