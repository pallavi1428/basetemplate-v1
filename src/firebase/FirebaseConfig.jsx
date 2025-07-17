// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAifbfN9x6f70RnH02InYAu1xCGc8pni4k",
  authDomain: "prachaar-d29cf.firebaseapp.com",
  projectId: "prachaar-d29cf",
  storageBucket: "prachaar-d29cf.firebasestorage.app",
  messagingSenderId: "213791810337",
  appId: "1:213791810337:web:2ab94bbe11824b34819460",
  measurementId: "G-NEX7135DG7"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore & Auth
const db = getFirestore(app);
const fireDB = db; // Alias for backward compatibility
const auth = getAuth(app);

// Export Firebase services
export { db, fireDB, auth };
