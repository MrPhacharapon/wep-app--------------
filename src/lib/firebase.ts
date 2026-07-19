import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx1eHP-PWV7nNpaEt3ws3zVXjjYvUt3-s",
  authDomain: "sliplpsec.firebaseapp.com",
  projectId: "sliplpsec",
  storageBucket: "sliplpsec.firebasestorage.app",
  messagingSenderId: "766775247803",
  appId: "1:766775247803:web:578ff2871500c90869fa9e",
  measurementId: "G-KZ8F7218J7"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
