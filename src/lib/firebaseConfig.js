// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVTrLgXCaJrzaj1-j6WhCGpLZFICBxSvA",
    authDomain: "loc7-d8d17.firebaseapp.com",
    projectId: "loc7-d8d17",
    storageBucket: "loc7-d8d17.firebasestorage.app",
    messagingSenderId: "761180552560",
    appId: "1:761180552560:web:025a4a0ee01aadf36ba3b5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
