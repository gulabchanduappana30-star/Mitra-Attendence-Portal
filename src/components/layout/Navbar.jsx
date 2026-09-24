import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BATCHES, getBatchById } from '@backend/constants/batches';
import { isFirebaseConfigured } from '@backend/config/firebase';
import { ShieldCheck, User, LogOut, Settings, Zap, ChevronDown, Database, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

import { MitraLogo } from '../common/MitraLogo';

export const Navbar = ({ onOpenSettings }) => {
  const { user, logout, switchPersona, isAdmin } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const studentBatch = user?.batchId ? getBatchById(user.batchId) : null;
  const isConnectedToFirebase = isFirebaseConfigured();

  const handlePersonaSwitch = async (id) => {
    await switchPersona(id);
    setShowPersonaMenu(false);
  };

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0E1118]/90 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between transition-colors shadow-sm">
      {/* Left: Brand / Title */}
      <div className="flex items-center gap-3">
        <MitraLogo className="h-9 md:h-10" showSubtitle={true} />
        <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> PORTAL 2026
        </span>
      </div>

      {/* Right: Actions & User Persona */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Light/Dark Theme Switcher */}
        <ThemeToggle />

        {/* Database Status Pill */}
        <button
          onClick={onOpenSettings}
          className={`hidden md:flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-full border transition-all ${
            isConnectedToFirebase
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300'
          }`}
          title="Firebase Cloud Status"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{isConnectedToFirebase ? 'FIREBASE CLOUD' : 'LOCAL ENGINE'}</span>
        </button>

        {/* User Persona Button */}
        <div className="relative">
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#151924] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-left transition-all shadow-sm"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-500 shadow-sm"
            />
            <div className="hidden sm:block">
              <div className="text-xs font-black text-slate-900 dark:text-white leading-tight flex items-center gap-1 font-mono">
                {user?.name || 'Admin'}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">
                {isAdmin ? (
                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Master Admin
                  </span>
                ) : (
                  <span>{studentBatch?.name || 'Student'}</span>
                )}
              </div>
            </div>
          </button>

          {/* Persona Menu Popup */}
          {showPersonaMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#151924] border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider font-black text-amber-600 dark:text-amber-400 font-mono">Switch Persona</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Test different portal privileges</p>
              </div>

              <div className="py-1.5 space-y-1">
                <button
                  onClick={() => handlePersonaSwitch('usr_admin_1')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors font-mono ${
                    user?.id === 'usr_admin_1' || isAdmin
                      ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-500/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> Admin (Master)
                  </span>
                  {(user?.id === 'usr_admin_1' || isAdmin) && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
                </button>

                <div className="my-1 border-t border-slate-200 dark:border-slate-800"></div>
                <p className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 font-mono">Student Accounts</p>

                <button
                  onClick={() => handlePersonaSwitch('usr_24pa1a4507')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-mono"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> A Lokesh (Vibe)
                  </span>
                </button>

                <button
                  onClick={() => handlePersonaSwitch('usr_24pa1a4511')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-mono"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span> A Sai Kiran (AI)
                  </span>
                </button>

                <button
                  onClick={() => handlePersonaSwitch('usr_24pa1a4520')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-mono"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> B Mythili (Marketing)
                  </span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <button
                  onClick={() => { setShowPersonaMenu(false); onOpenSettings(); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-mono"
                >
                  <Settings className="w-3.5 h-3.5" /> Firebase Cloud Settings
                </button>
                <button
                  onClick={() => { setShowPersonaMenu(false); logout(); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-mono font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
