import { initializeApp, getApps } from "firebase/app";
<<<<<<< HEAD
import { getFirestore } from "firebase/firestore";
=======
>>>>>>> 99b8c04df4fe5bb22abd0185030e2cd0b3a1cdc1

const firebaseConfig = {
  apiKey: "AIzaSyDv4N3P5g6VzXA7BdPIGBoxe9uJTEhYYvo",
  authDomain: "teenaviva-d3498.firebaseapp.com",
  projectId: "teenaviva-d3498",
  storageBucket: "teenaviva-d3498.firebasestorage.app",
  messagingSenderId: "1084436367346",
  appId: "1:1084436367346:web:4b1bca283ae224750a4d6b",
  measurementId: "G-0THL9KZ27H",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

<<<<<<< HEAD
export const db = getFirestore(app);

=======
>>>>>>> 99b8c04df4fe5bb22abd0185030e2cd0b3a1cdc1
export default app;
