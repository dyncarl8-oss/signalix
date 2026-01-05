import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, Brain, Zap, Shield, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

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
      
      {/* Unified Background - Deep Cyberpunk Space */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Deep Noise Texture */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
         {/* Ambient Glows */}
         <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[180px] opacity-40"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[180px] opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 20 ? 'bg-[#030304]/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
               <Activity className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Signalix<span className="text-cyan-500">AI</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={onLogin} className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider">Log in</button>
            <button 
              onClick={onGetStarted}
              className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wide hover:bg-cyan-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 h-screen flex flex-col justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[10px] font-mono font-medium text-gray-400 tracking-widest uppercase">System Operational</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-white leading-[1.05]">
            See beyond charts. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse-fast">Trade Smarter.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed font-light tracking-wide">
             Real-time logic. Zero black boxes.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <button 
              onClick={onGetStarted}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 group border border-white/10"
            >
              Start Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Split Layout: Terminal & Features */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           
           {/* Left: Minimal Terminal */}
           <div className="relative group perspective-1000">
              {/* Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/30 to-purple-600/30 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#050508]/80 backdrop-blur-sm shadow-2xl">
                 <div className="h-10 bg-white/5 flex items-center px-4 justify-between border-b border-white/5">
                    <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 tracking-wider">signalix_core.exe</span>
                 </div>
                 <div className="p-6 font-mono text-xs md:text-sm space-y-3 h-[400px] text-gray-300">
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
                    <div className="mt-4 bg-[#0a0a0f] border border-white/5 p-4 rounded-lg shadow-inner">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-green-400 font-bold tracking-wide">BULLISH CONFIRMED</span>
                          <span className="text-gray-500 font-mono">94%</span>
                       </div>
                       <div className="w-full bg-gray-800 h-1 rounded-full mb-3 overflow-hidden">
                          <div className="w-[94%] bg-green-500 h-1 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                       </div>
                       <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                          <span>TARGET: <span className="text-gray-300">$68,500</span></span>
                          <span>STOP: <span className="text-gray-300">$63,800</span></span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Context */}
           <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tight text-white">
                 Neural Transparency.
                 <span className="block text-gray-500 mt-2 text-2xl font-medium">It thinks. You trade.</span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg font-light">
                 Unlike other signals that give you a blind "Buy" or "Sell", SignalixAI exposes its entire thought process. Watch the neural engine weigh indicators, check market regimes, and calculate risk in real-time.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                 <FeatureCard 
                    icon={<Brain className="w-4 h-4 text-purple-400" />}
                    title="Logic Streams"
                    desc="Follow the AI's reasoning step-by-step."
                 />
                 <FeatureCard 
                    icon={<Zap className="w-4 h-4 text-cyan-400" />}
                    title="Instant Execution"
                    desc="30+ indicators processed in milliseconds."
                 />
                 <FeatureCard 
                    icon={<Shield className="w-4 h-4 text-green-400" />}
                    title="Risk Calculated"
                    desc="Automated stop-loss and invalidation zones."
                 />
              </div>
           </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#030304] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-gray-600">
                 &copy; 2026 SIGNALIX_AI. SYSTEMS NOMINAL.
              </span>
           </div>
           
           <div className="flex items-center gap-8 opacity-50 hover:opacity-100 transition-opacity">
              <button className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Terms</button>
              <button className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Privacy</button>
           </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
     <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded bg-black border border-white/5">
           {icon}
        </div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
     </div>
     <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;