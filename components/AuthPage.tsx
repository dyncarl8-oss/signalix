import React, { useState } from 'react';
import { Activity, Mail, Lock, ArrowRight, CheckCircle2, ArrowLeft, AlertTriangle, RefreshCw, Loader2, Info } from 'lucide-react';
import { userService } from '../services/userService';
import { UserProfile } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBack: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'verify-sent';

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onBack }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setShowResend(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError('');
    setShowResend(false);
    
    try {
      const user = await userService.login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        setError('Email not verified yet.');
        setShowResend(true);
      } else {
        setError(err.message);
      }
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError('');

    try {
      await userService.register(email, undefined, password);
      setMode('verify-sent');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      await userService.resendVerification(email, password);
      setSuccessMsg("Verification email resent!");
      setShowResend(false);
      setError('');
    } catch (err: any) {
      if (err.message === 'ALREADY_VERIFIED') {
         setError('Account is already verified.');
         setShowResend(false);
      } else {
         setError(err.message);
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await userService.resetPassword(email);
      setSuccessMsg('Reset link sent. Check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      const user = await userService.googleLogin();
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
       setIsGoogleLoading(false);
    }
  }

  const isLoading = isEmailLoading || isGoogleLoading;

  return (
    <div className="min-h-screen bg-[#030304] flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
         <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] opacity-20"></div>
         <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-cyan-900/10 rounded-full blur-[150px] opacity-20"></div>
      </div>

      <div className="w-full max-w-sm relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-10 cursor-pointer" onClick={onBack}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-3">
             <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">Signalix<span className="text-cyan-500">AI</span></span>
        </div>

        {/* Minimalist Card */}
        <div className="bg-[#0a0a0f]/80 backdrop-blur-md rounded-2xl border border-white/5 p-8 shadow-2xl relative overflow-hidden group">
          
          {/* Top Scanner Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          
          {/* Mode: Verify Sent */}
          {mode === 'verify-sent' && (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                 <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Check Your Inbox</h2>
              <p className="text-gray-500 text-xs mb-6">Verification link sent to <span className="text-white">{email}</span></p>
              <button onClick={() => switchMode('login')} className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-bold hover:bg-white/10 transition-colors">
                 Back to Login
              </button>
            </div>
          )}

          {/* Mode: Forgot Password */}
          {mode === 'forgot-password' && (
            <div>
               <button onClick={() => switchMode('login')} className="text-gray-500 hover:text-white text-xs mb-6 flex items-center gap-1 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Back
               </button>
               <h2 className="text-lg font-bold text-white mb-1">Reset Password</h2>
               <p className="text-gray-500 text-xs mb-6">We'll send you a link to reset it.</p>

               {successMsg && <div className="p-3 mb-4 bg-green-900/20 border border-green-500/20 rounded text-green-400 text-xs text-center">{successMsg}</div>}
               
               <form onSubmit={handleForgotPassword} className="space-y-4">
                  {error && <div className="text-red-400 text-xs text-center">{error}</div>}
                  <div className="space-y-1">
                     <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Email</label>
                     <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full h-10 bg-[#050508] border border-gray-800 rounded px-3 text-white text-sm focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder-gray-700"
                        placeholder="name@example.com"
                     />
                  </div>
                  <button type="submit" disabled={isEmailLoading} className="w-full h-10 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded transition-all flex items-center justify-center">
                     {isEmailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                  </button>
               </form>
            </div>
          )}

          {/* Mode: Login / Signup */}
          {(mode === 'login' || mode === 'signup') && (
            <>
               <div className="text-center mb-6">
                  <h2 className="text-lg font-bold text-white">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                  <p className="text-gray-500 text-xs mt-1">Enter the neural network.</p>
               </div>

               <div className="space-y-4">
                  <button 
                     type="button"
                     onClick={handleGoogleLogin}
                     disabled={isLoading}
                     className="w-full h-10 bg-white text-black font-bold text-sm rounded flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                  >
                     {isGoogleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="G" />}
                     Google
                  </button>

                  <div className="relative flex items-center py-1">
                     <div className="flex-grow border-t border-gray-800"></div>
                     <span className="flex-shrink-0 mx-3 text-gray-700 text-[10px] uppercase">Or</span>
                     <div className="flex-grow border-t border-gray-800"></div>
                  </div>

                  {successMsg && <div className="p-3 bg-green-900/20 border border-green-500/20 rounded text-green-400 text-xs text-center">{successMsg}</div>}

                  <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
                     {error && (
                       <div className="bg-red-900/10 border border-red-500/20 rounded p-3">
                         <div className="text-red-400 text-xs text-center flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {error}
                         </div>
                         {showResend && (
                            <button
                              type="button"
                              onClick={handleResendVerification}
                              disabled={resendLoading}
                              className="w-full mt-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[10px] rounded border border-red-500/20 flex items-center justify-center gap-1 uppercase tracking-wide font-bold transition-colors"
                            >
                              {resendLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Resend Email'}
                            </button>
                         )}
                       </div>
                     )}
                     
                     <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Email</label>
                        <div className="relative">
                           <input 
                              type="email" 
                              required
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              className="w-full h-10 bg-[#050508] border border-gray-800 rounded px-3 pl-9 text-white text-sm focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder-gray-700"
                              placeholder="name@example.com"
                           />
                           <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
                        </div>
                     </div>
                     
                     <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Password</label>
                        <div className="relative">
                           <input 
                              type="password" 
                              required
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              className="w-full h-10 bg-[#050508] border border-gray-800 rounded px-3 pl-9 text-white text-sm focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder-gray-700"
                              placeholder="••••••••"
                           />
                           <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
                        </div>
                     </div>

                     {mode === 'login' && (
                        <div className="flex justify-end">
                           <button type="button" onClick={() => switchMode('forgot-password')} className="text-[10px] text-gray-500 hover:text-cyan-400 transition-colors">
                              Forgot Password?
                           </button>
                        </div>
                     )}

                     <button 
                        type="submit"
                        disabled={isEmailLoading}
                        className="w-full h-10 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm rounded transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                     >
                        {isEmailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Sign Up')}
                     </button>
                  </form>
               </div>

               <div className="mt-6 text-center">
                  <button 
                     onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                     className="text-xs text-gray-500 hover:text-white transition-colors"
                  >
                     {mode === 'login' ? "Don't have an account? Sign up" : "Have an account? Sign in"}
                  </button>
               </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;