import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { MitraLogo } from '../components/common/MitraLogo';
import { 
  Zap, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { addToast } = useToast();

  const [loginMode, setLoginMode] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      addToast('Please enter both your identifier and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await login(identifier.trim(), password);
      if (result.success) {
        addToast(`Welcome back, ${result.user.name}!`, 'success');
      } else {
        addToast(result.message || 'Authentication failed. Please verify your credentials.', 'error');
      }
    } catch (err) {
      addToast('An error occurred during sign-in. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090C12] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-200 relative overflow-hidden bg-cyber-grid selection:bg-amber-500 selection:text-black">
      
      {/* Top Header Bar */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#0E1118]/85 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MitraLogo className="h-10 sm:h-11" showSubtitle={true} />
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            PORTAL ACTIVE
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Cyber Ambient Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[650px] h-[350px] cyber-glow-gold rounded-full pointer-events-none blur-3xl -z-10" />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 z-10">
        <div className="w-full max-w-md space-y-6">
          
          {/* Headline Section */}
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              SIGN IN • MITRA PORTAL 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase font-heading leading-tight text-slate-900 dark:text-white">
              ACCESS YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500">ACCOUNT.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {loginMode === 'student' 
                ? 'Sign in using your student Gmail ID to access your attendance records and batch schedule.' 
                : 'Sign in to the administrative console to manage student rosters, batches, and sessions.'}
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-[#111520] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-900/5 dark:shadow-none transition-all">
            
            {/* Segmented Role Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                ACCOUNT TYPE
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-[#090C12] rounded-2xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('student');
                    setIdentifier('');
                    setPassword('');
                  }}
                  className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${
                    loginMode === 'student'
                      ? 'bg-slate-900 text-white dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-400 dark:text-slate-950 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {loginMode === 'student' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950 fill-current" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-slate-400 dark:border-slate-600" />
                  )}
                  <span>STUDENT</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('admin');
                    setIdentifier('admin@mitra.club');
                    setPassword('mitra@1234');
                  }}
                  className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${
                    loginMode === 'admin'
                      ? 'bg-slate-900 text-white dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-400 dark:text-slate-950 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {loginMode === 'admin' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950 fill-current" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-slate-400 dark:border-slate-600" />
                  )}
                  <span>ADMIN</span>
                </button>
              </div>
            </div>

            {/* Student Quick Helper Banner */}
            {loginMode === 'student' && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    Demo Student: <strong className="font-mono">24pa1a4507@gmail.com</strong> / <strong className="font-mono">mitra123</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('24pa1a4507@gmail.com');
                    setPassword('mitra123');
                  }}
                  className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded-lg transition-colors"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {/* Admin Quick Helper Banner */}
            {loginMode === 'admin' && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    Demo Admin: <strong className="font-mono">admin@mitra.club</strong> / <strong className="font-mono">mitra@1234</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('admin@mitra.club');
                    setPassword('mitra@1234');
                  }}
                  className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded-lg transition-colors"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                  {loginMode === 'student' ? 'Student Gmail ID / Email' : 'Admin Username / Email'}
                </label>
                <div className="relative">
                  {loginMode === 'student' ? (
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  )}
                  <input
                    type={loginMode === 'student' ? 'email' : 'text'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={loginMode === 'student' ? 'e.g. yourname@gmail.com' : 'Admin or admin@mitra.club'}
                    autoComplete={loginMode === 'student' ? 'email' : 'username'}
                    className="w-full bg-slate-50 dark:bg-[#090C12] border border-slate-300 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full bg-slate-50 dark:bg-[#090C12] border border-slate-300 dark:border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Main CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3.5 px-6 bg-slate-900 hover:bg-black dark:bg-gradient-to-r dark:from-amber-500 dark:to-yellow-400 dark:hover:from-amber-400 dark:hover:to-yellow-300 text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <span>{loading ? 'AUTHENTICATING...' : `SIGN IN AS ${loginMode.toUpperCase()}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {loginMode === 'student' 
                  ? 'Having trouble signing in? Contact your Batch Admin or Mitra Coordinator.'
                  : 'Authorized personnel only. Access logged and monitored.'}
              </p>
            </div>

          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            MITRA CLUB ATTENDANCE PORTAL • 2026 EDITION
          </p>

        </div>
      </main>
    </div>
  );
};
