import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(toast => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border shadow-2xl backdrop-blur-md animate-fade-in transition-all ${
                isSuccess
                  ? 'bg-emerald-500/10 dark:bg-emerald-950/90 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                  : isError
                  ? 'bg-rose-500/10 dark:bg-rose-950/90 border-rose-500/30 text-rose-800 dark:text-rose-200'
                  : isWarning
                  ? 'bg-amber-500/10 dark:bg-amber-950/90 border-amber-500/30 text-amber-800 dark:text-amber-200'
                  : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />}
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
