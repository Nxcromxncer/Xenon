import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjbt1wJjuhQ0lAJcmqX3GX0lxXlNKBHlo",
  authDomain: "mark-1-7670f.firebaseapp.com",
  projectId: "mark-1-7670f",
  storageBucket: "mark-1-7670f.firebasestorage.app",
  messagingSenderId: "712620164871",
  appId: "1:712620164871:web:6d18ef698747f786b9e7a2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();