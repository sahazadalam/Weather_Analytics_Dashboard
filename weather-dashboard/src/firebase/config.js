import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCajAPi5c6ZmdOJgZAGAiGeaquGHzMscIk",
  authDomain: "weather-dashboard-2abf4.firebaseapp.com",
  projectId: "weather-dashboard-2abf4",
  storageBucket: "weather-dashboard-2abf4.firebasestorage.app",
  messagingSenderId: "1006734213219",
  appId: "1:1006734213219:web:e333bfc5bee134d56af856",
  measurementId: "G-CXEL23G8GQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();