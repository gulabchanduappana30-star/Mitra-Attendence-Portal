import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        isDark 
          ? 'bg-slate-800/80 text-amber-400 hover:bg-slate-700/80 border border-slate-700/60 shadow-inner' 
          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200/80 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 transition-all duration-300 transform rotate-0 scale-100 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 transition-all duration-300 transform rotate-0 scale-100 text-indigo-600" />
        )}
      </div>
    </button>
  );
};
