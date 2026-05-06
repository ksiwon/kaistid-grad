import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// ── Environment detection ─────────────────────────────────────
// DEV  → import.meta.env.DEV === true  → USE_MOCK = true  → mock data / localStorage
// PROD → import.meta.env.DEV === false → USE_MOCK depends on whether Firebase env vars exist
//
// .env.local  (git-ignored) : VITE_FIREBASE_API_KEY=xxx  ...
// .env        (committed)   : empty or placeholder values

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// In dev mode always use mocks so the site works without Firebase credentials.
// In prod mode, use Firebase only when all env vars are present.
export const USE_MOCK: boolean =
  import.meta.env.DEV ||
  !firebaseConfig.apiKey ||
  !firebaseConfig.projectId;

export const isConfigured: boolean = !USE_MOCK;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (e) {
    console.warn('[Firebase] Initialization failed. Falling back to demo mode.', e);
  }
}

if (USE_MOCK) {
  console.info('[App] Running in DEMO mode — all data is local/in-memory.');
}

export { app, db, auth, storage };