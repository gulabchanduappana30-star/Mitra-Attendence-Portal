import React, { useState } from 'react';
import { X, Database, Save, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import { isFirebaseConfigured, config } from '@backend/config/firebase';
import { useToast } from '../../context/ToastContext';

export const FirebaseSettingsModal = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    apiKey: config.apiKey || '',
    authDomain: config.authDomain || '',
    projectId: config.projectId || '',
    storageBucket: config.storageBucket || '',
    messagingSenderId: config.messagingSenderId || '',
    appId: config.appId || ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('mitra_firebase_config', JSON.stringify(formData));
    addToast('Firebase configuration saved! Reloading application...', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleReset = () => {
    localStorage.removeItem('mitra_firebase_config');
    addToast('Reset to default local demo mode.', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-white dark:bg-[#121318] border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-black dark:hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 dark:bg-[#FAC600]/15 dark:text-[#FAC600]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black uppercase text-black dark:text-white font-heading">Firebase Cloud Engine</h3>
            <p className="text-xs text-neutral-500 font-sans">Connect Firestore cloud database or use Local Storage</p>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-mono ${
          isFirebaseConfigured()
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>STATUS: <strong>{isFirebaseConfigured() ? 'LIVE FIREBASE CLOUD' : 'LOCAL STORAGE ENGINE'}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3 pt-2 text-xs font-mono">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">API Key</label>
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="AIzaSy..."
              className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Project ID</label>
              <input
                type="text"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                placeholder="mitra-club-app"
                className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Auth Domain</label>
              <input
                type="text"
                name="authDomain"
                value={formData.authDomain}
                onChange={handleChange}
                placeholder="mitra-club-app.firebaseapp.com"
                className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">App ID</label>
              <input
                type="text"
                name="appId"
                value={formData.appId}
                onChange={handleChange}
                placeholder="1:12345678:web:..."
                className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Storage Bucket</label>
              <input
                type="text"
                name="storageBucket"
                value={formData.storageBucket}
                onChange={handleChange}
                placeholder="mitra-club-app.appspot.com"
                className="w-full bg-neutral-50 dark:bg-[#0A0A0D] border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-[#FAC600]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-full text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Local Engine
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full text-xs font-black bg-black hover:bg-neutral-900 dark:bg-[#FAC600] dark:hover:bg-amber-400 text-white dark:text-black shadow-md flex items-center gap-1.5 uppercase"
              >
                <Save className="w-4 h-4" /> Save & Sync
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
