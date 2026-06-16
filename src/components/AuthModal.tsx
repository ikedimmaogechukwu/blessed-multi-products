import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  onClose: () => void;
  darkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, darkMode }) => {
  const { loginWithEmail, registerWithEmail, resetPassword, loginWithGoogle } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Forms inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithEmail(email.trim(), password);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect email credentials or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;

    setLoading(true);
    setErrorMsg('');
    try {
      await registerWithEmail(email.trim(), password, fullName.trim(), phone.trim());
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please make sure email is not already registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');
    try {
      await resetPassword(email.trim());
      setFeedbackMsg('✓ Reset link has been dispatched to your email inbox.');
      setEmail('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch password recovery email.');
    } finally {
      setLoading(false);
    }
  };

  // Preset admin details filler helper
  const handleFillAdmin = () => {
    setEmail('ogechukwublessing009@gmail.com');
    setPassword('BlessedAdmin123!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-105 text-slate-850'
      } z-10 transition-all duration-300`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-1.5 rounded-full hover:bg-slate-500/10 ${
            darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-850'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 border-b dark:border-slate-850 border-gray-150">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setFeedbackMsg('');
            }}
            className={`py-3.5 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-colors ${
              activeTab === 'login' || activeTab === 'forgot'
                ? 'border-amber-500 text-amber-500 font-black bg-gradient-to-t from-amber-500/5 to-transparent'
                : 'border-transparent text-slate-450 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In Account
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
              setFeedbackMsg('');
            }}
            className={`py-3.5 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-amber-500 text-amber-500 font-black bg-gradient-to-t from-amber-500/5 to-transparent'
                : 'border-transparent text-slate-450 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Inner Form content */}
        <div className="p-6 space-y-4">
          
          <div className="text-center">
            {activeTab === 'login' && <p className="text-[11px] text-slate-450 uppercase tracking-widest font-bold">Welcome Back to Blessed Multi-Products</p>}
            {activeTab === 'register' && <p className="text-[11px] text-slate-450 uppercase tracking-widest font-bold">Register with "Quality You Can Trust"</p>}
            {activeTab === 'forgot' && <p className="text-[11px] text-slate-450 uppercase tracking-widest font-bold">Retrieve Access credentials</p>}
          </div>

          {/* Errors/success boxes */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[11px] font-bold">
              ✕ {errorMsg}
            </div>
          )}
          {feedbackMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-[11px] font-bold animate-pulse">
              {feedbackMsg}
            </div>
          )}

          {/* SIGN IN VIEW */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-455">Email Address:</label>
                <div className={`flex items-center rounded-xl border px-3 py-1 bg-white dark:bg-slate-950 ${darkMode ? 'border-slate-800' : 'border-gray-220'}`}>
                  <Mail className="w-4.5 h-4.5 text-slate-500 shrink-0 mr-2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-1.5 focus:ring-0 text-xs dark:text-white text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-455">Account Password:</label>
                <div className={`flex items-center rounded-xl border px-3 py-1 bg-white dark:bg-slate-950 ${darkMode ? 'border-slate-800' : 'border-gray-220'}`}>
                  <Lock className="w-4.5 h-4.5 text-slate-500 shrink-0 mr-2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-1.5 focus:ring-0 text-xs dark:text-white text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold block">
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="hover:text-amber-500 underline"
                >
                  Forgot your password?
                </button>
                {/* Admin login helper shortcut */}
                <button
                  type="button"
                  onClick={handleFillAdmin}
                  className="text-amber-500 hover:underline font-mono"
                  title="Applies designated Administrator username/password for immediate inspection"
                >
                  💡 Fill Admin Credentials
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-tr from-amber-500 to-amber-300 hover:brightness-110 text-blue-950 font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <ShieldCheck className="w-4.5 h-4.5" />}
                <span>Sign In Securely</span>
              </button>

              <div className="relative my-3 flex py-1 items-center">
                <div className="flex-grow border-t dark:border-slate-800 border-gray-150"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">or</span>
                <div className="flex-grow border-t dark:border-slate-800 border-gray-150"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold tracking-wider hover:bg-slate-500/5 transition-all flex items-center justify-center gap-2 ${
                  darkMode ? 'border-slate-800 text-slate-300' : 'border-gray-220 text-slate-700'
                }`}
              >
                <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" fillRule="evenodd" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" fillRule="evenodd" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" fillRule="evenodd" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* SIGN UP REGISTRATION VIEW */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-455">Full Name:</label>
                <div className={`flex items-center rounded-xl border px-3 py-1 bg-white dark:bg-slate-950 ${darkMode ? 'border-slate-800' : 'border-gray-220'}`}>
                  <User className="w-4.5 h-4.5 text-slate-500 shrink-0 mr-2" />
                  <input
                    type="text"
                    required
                    placeholder="Ogechukwu Blessing"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-1.5 focus:ring-0 text-xs dark:text-white text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-455">Email Address:</label>
                <div className={`flex items-center rounded-xl border px-3 py-1 bg-white dark:bg-slate-950 ${darkMode ? 'border-slate-800' : 'border-gray-220'}`}>
                  <Mail className="w-4.5 h-4.5 text-slate-500 shrink-0 mr-2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-1.5 focus:ring-0 text-xs dark:text-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-455">WhatsApp Mobile Phone:</label>
                  <input
                    type="text"
                    placeholder="E.g., 09053656282"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-805 text-white' : 'bg-slate-50 border-gray-200'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-455">Choose Password:</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-805 text-white' : 'bg-slate-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-tr from-amber-500 to-amber-300 hover:brightness-110 text-blue-950 font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <ShieldCheck className="w-4.5 h-4.5" />}
                <span>Register Account</span>
              </button>

              <div className="relative my-3 flex py-1 items-center">
                <div className="flex-grow border-t dark:border-slate-800 border-gray-150"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">or</span>
                <div className="flex-grow border-t dark:border-slate-800 border-gray-150"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold tracking-wider hover:bg-slate-500/5 transition-all flex items-center justify-center gap-2 ${
                  darkMode ? 'border-slate-800 text-slate-300' : 'border-gray-220 text-slate-700'
                }`}
              >
                <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" fillRule="evenodd" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" fillRule="evenodd" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" fillRule="evenodd" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD RESET VIEW */}
          {activeTab === 'forgot' && (
            <div className="space-y-4">
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-455">Enter Your Email Address:</label>
                  <div className={`flex items-center rounded-xl border px-3 py-1 bg-white dark:bg-slate-950 ${darkMode ? 'border-slate-800' : 'border-gray-220'}`}>
                    <Mail className="w-4.5 h-4.5 text-slate-500 shrink-0 mr-2" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-none outline-none py-1.5 focus:ring-0 text-xs dark:text-white text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-tr from-amber-500 to-amber-300 hover:brightness-110 text-blue-950 font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <ShieldCheck className="w-4.5 h-4.5" />}
                  <span>Dispatch Reset Link</span>
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                  setFeedbackMsg('');
                }}
                className="text-[10px] text-slate-450 hover:text-amber-500 block text-center underline mx-auto"
              >
                &larr; Back to standard Sign In
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
