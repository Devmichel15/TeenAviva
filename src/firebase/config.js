import { initializeApp, getApps } from "firebase/app";

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

export default app;
