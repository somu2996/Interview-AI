import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "igneous-source-h4dh4",
  appId: "1:155821292171:web:e532795846a1df1f72328e",
  apiKey: "AIzaSyDXzn566rn_hKdGkAMS4TnZPVOR_VqbCHU",
  authDomain: "igneous-source-h4dh4.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-aiinterviewprepp-69a373d8-3304-4619-bcf8-c1e365c13976",
  storageBucket: "igneous-source-h4dh4.firebasestorage.app",
  messagingSenderId: "155821292171"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
