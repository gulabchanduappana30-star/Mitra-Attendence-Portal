import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check for stored Firebase Config or fallback to env vars
const getFirebaseConfig = () => {
  const savedConfig = typeof window !== 'undefined' ? localStorage.getItem('mitra_firebase_config') : null;
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.error('Failed to parse saved Firebase config', e);
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
  };
};

export const config = getFirebaseConfig();

export const isFirebaseConfigured = () => {
  return Boolean(config.apiKey && config.projectId && config.apiKey !== "");
};

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured()) {
  try {
    app = !getApps().length ? initializeApp(config) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn("Firebase initialization skipped or failed. Falling back to local storage engine.", err);
  }
}

export { app, auth, db };
