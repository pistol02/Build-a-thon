
import { initializeApp } from "firebase/app";

import { Firestore, getFirestore } from "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; 


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
// export const analytics = getAnalytics(app);


//  Exported
export default app
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const realtimeDb = getDatabase(app); // Add this line for Realtime Database
