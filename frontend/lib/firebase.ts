import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace these with YOUR actual keys from the Firebase Console!
const firebaseConfig = {
  apiKey: "AIzaSyBj4bDNcWriI1WOLTAEt2kwK9cXy7DPxu8",
  authDomain: "khetse-marketplace.firebaseapp.com",
  projectId: "khetse-marketplace",
  storageBucket: "khetse-marketplace.firebasestorage.app",
  messagingSenderId: "909849933116",
  appId: "1:909849933116:web:2facf80466efa8b58b1a39",
  measurementId: "G-YR1WJGSS3E"
};

// Initialize Firebase (This check prevents Next.js from crashing by initializing twice)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);