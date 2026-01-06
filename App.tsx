import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import RiskPage from './components/RiskPage';
import { userService } from './services/userService';
import { UserProfile } from './types';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export type ViewState = 'landing' | 'auth' | 'dashboard' | 'terms' | 'privacy' | 'risk';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await firebaseUser.reload();
        } catch (e) {
          // ignore reload error
        }

        if (firebaseUser.emailVerified) {
          setLoading(true); 
          try {
            const params = new URLSearchParams(window.location.search);
            const paymentSuccess = params.get('payment') === 'success';

            if (paymentSuccess) {
              setProcessingPayment(true);
              const upgradedUser = await userService.upgradeToPro();
              setUser(upgradedUser);
              window.history.replaceState({}, '', window.location.pathname);
              setProcessingPayment(false);
            } else {
               const profile = await userService.getCurrentUserProfile();
               setUser(profile);
            }
            
            // Only switch to dashboard if we are currently on a non-public page
            if (currentView === 'auth' || currentView === 'landing') {
              setCurrentView('dashboard');
            }
          } catch (e) {
            console.error("Error fetching user profile", e);
            setUser(null);
            setProcessingPayment(false);
          } finally {
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false); 
        }
      } else {
        setUser(null);
        if (currentView === 'dashboard') setCurrentView('landing');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentView]);

  const handleLoginSuccess = (userData: UserProfile) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await userService.logout();
    setCurrentView('landing'); 
  };

  if (loading || processingPayment) {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col gap-4 items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        {processingPayment && (
           <p className="text-gray-400 font-mono text-sm animate-pulse">Confirming Pro Subscription...</p>
        )}
      </div>
    );
  }

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage 
          onGetStarted={() => {
             if (user) setCurrentView('dashboard');
             else setCurrentView('auth');
          }}
          onLogin={() => {
             if (user) setCurrentView('dashboard');
             else setCurrentView('auth');
          }}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'auth' && (
        <AuthPage 
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
        />
      )}

      {currentView === 'terms' && <TermsPage onBack={() => setCurrentView('landing')} />}
      {currentView === 'privacy' && <PrivacyPage onBack={() => setCurrentView('landing')} />}
      {currentView === 'risk' && <RiskPage onBack={() => setCurrentView('landing')} />}
    </>
  );
}