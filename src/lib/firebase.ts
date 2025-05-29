
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFirestore, Firestore } from "firebase/firestore"; // Added Firestore import

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log the storage bucket being used in development environment on the server-side
if (process.env.NODE_ENV === 'development') {
  console.log('[Firebase Init] Attempting to use Storage Bucket:', firebaseConfig.storageBucket);
  if (!firebaseConfig.storageBucket || !firebaseConfig.storageBucket.endsWith('.appspot.com')) {
    console.warn(
      '[Firebase Init] WARNING: The configured storageBucket does NOT end with ".appspot.com". ' +
      'It should typically be in the format "YOUR-PROJECT-ID.appspot.com". ' +
      'Current value:', firebaseConfig.storageBucket
    );
  }
}

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const storage: FirebaseStorage = getStorage(app);
const db: Firestore = getFirestore(app); // Initialize Firestore

export { app, storage, db }; // Export db
