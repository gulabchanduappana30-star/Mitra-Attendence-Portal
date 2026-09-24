import React from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

export const StatsCard = ({ title, value, subtitle, icon: Icon, trend, color = 'gold' }) => {
  const colorMap = {
    gold: 'bg-amber-100/70 text-amber-900 border-amber-300 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
    cyan: 'bg-cyan-100/70 text-cyan-900 border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30',
    emerald: 'bg-emerald-100/70 text-emerald-900 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
    rose: 'bg-rose-100/70 text-rose-900 border-rose-300 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
    violet: 'bg-violet-100/70 text-violet-900 border-violet-300 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30',
  };

  return (
    <div className="bg-white dark:bg-[#111520] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 relative overflow-hidden transition-all duration-200 group hover:-translate-y-1 hover:border-amber-500/40 dark:hover:border-amber-500/50 shadow-sm">
      {/* Subtle amber accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-yellow-400 transition-colors" />

      <div className="flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">{title}</p>
        {Icon && (
          <div className={`p-2.5 rounded-xl border transition-transform group-hover:scale-105 ${colorMap[color] || colorMap.gold}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2.5">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">{value}</h3>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-black font-mono px-2 py-0.5 rounded-full border ${
            trend > 0 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' 
              : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
          }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">{subtitle}</p>}
    </div>
  );
};
