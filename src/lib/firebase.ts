import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';

const firebaseConfig = {
  apiKey: 'AIzaSyAZrCsK8Xm6Ks0ymJ4zOt0uiXbpDHOQdhU',
  authDomain: 'batapsu.firebaseapp.com',
  projectId: 'batapsu',
  storageBucket: 'batapsu.firebasestorage.app',
  messagingSenderId: '770765910541',
  appId: '1:770765910541:web:90b679e8f4149d60dfdb44',
  measurementId: 'G-CXCGC8YYM8',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Firebase AI (Gemini) — free tier, runs client-side
const ai = getAI(app, { backend: new GoogleAIBackend() });
export const geminiModel = getGenerativeModel(ai, { model: 'gemini-2.0-flash' });
