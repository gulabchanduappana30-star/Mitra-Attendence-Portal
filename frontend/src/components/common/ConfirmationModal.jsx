import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-neutral-400 hover:text-black dark:hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${isDanger ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-[#FAC600]'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black uppercase text-black dark:text-white font-heading">{title}</h3>
            <p className="text-xs text-neutral-500 font-sans mt-1">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                : 'bg-black hover:bg-neutral-900 dark:bg-[#FAC600] dark:hover:bg-amber-400 text-white dark:text-black shadow-md'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
