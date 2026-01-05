import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, Brain, Zap, Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-[#000000] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Dynamic Background - Ultra Subtle */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[20%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] opacity-40"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] opacity-40"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 20 ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-cyan-500 w-6 h-6" />
            <span className="font-semibold text-xl tracking-tight text-white">Signalix<span className="text-cyan-500">AI</span></span>
          </div>
          
          <div className="flex items-center gap-8">
            <button onClick={onLogin} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log in</button>
            <button 
              onClick={onGetStarted}
              className="px-4 py-2 rounded-full bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          <h1 className="text-7xl md:text-9xl font-semibold tracking-tighter mb-8 text-white leading-none">
            Trade Smarter.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 font-medium tracking-tight mb-12 max-w-2xl mx-auto">
             Real-time analysis. Transparent reasoning.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <button 
              onClick={onGetStarted}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 group"
            >
              Start AI Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Minimalist Feature Grid */}
      <section className="relative z-10 py-20 px-6 border-t border-white/5 bg-[#020202]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="space-y-4">
              <Brain className="w-8 h-8 text-gray-400" />
              <h3 className="text-xl font-semibold text-white">Transparent Logic</h3>
              <p className="text-gray-500 text-base leading-relaxed">The only terminal that explains the 'why'. Watch the neural engine reason through data in real-time.</p>
           </div>
           <div className="space-y-4">
              <Zap className="w-8 h-8 text-gray-400" />
              <h3 className="text-xl font-semibold text-white">Instant Speed</h3>
              <p className="text-gray-500 text-base leading-relaxed">30+ technical indicators computed instantly. Latency so low it feels like magic.</p>
           </div>
           <div className="space-y-4">
              <Shield className="w-8 h-8 text-gray-400" />
              <h3 className="text-xl font-semibold text-white">Risk Calculated</h3>
              <p className="text-gray-500 text-base leading-relaxed">Automated entry, exit, and stop-loss zones generated for every single analysis.</p>
           </div>
        </div>
      </section>

      {/* Interface Preview (Subtle) */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
           <div className="rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-[#0a0a0f]">
              <div className="h-8 bg-[#1a1a1f] flex items-center px-4 gap-2 border-b border-gray-800">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-60">
                 <div className="space-y-4">
                    <div className="h-6 w-32 bg-gray-800 rounded-sm"></div>
                    <div className="h-32 w-full bg-gray-800/50 rounded-sm"></div>
                    <div className="h-6 w-48 bg-gray-800 rounded-sm"></div>
                 </div>
                 <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-800/30 rounded-sm"></div>
                    <div className="h-4 w-5/6 bg-gray-800/30 rounded-sm"></div>
                    <div className="h-4 w-4/6 bg-gray-800/30 rounded-sm"></div>
                    <div className="mt-8 h-20 w-full bg-gray-800/20 rounded-sm border border-gray-800/50 flex items-center justify-center">
                       <span className="text-xs font-mono text-gray-600">AI PROCESSING...</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           
           <div className="flex flex-col items-center md:items-start">
              <span className="font-semibold text-lg text-white mb-2">SignalixAI</span>
              <p className="text-gray-600 text-xs">
                 &copy; 2026 SignalixAI. All rights reserved. Trading involves risk.
              </p>
           </div>
           
           <div className="flex items-center gap-8">
              <button className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Terms of Service</button>
              <button className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Privacy Policy</button>
              <button className="text-xs font-medium text-gray-500 hover:text-white transition-colors">Risk Disclosure</button>
           </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;