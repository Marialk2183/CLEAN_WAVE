// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAGWqHEjjAuvL4MhCvEohqrAqMuKJ963nY",
  authDomain: "weekends-drive-only.firebaseapp.com",
  projectId: "weekends-drive-only",
 storageBucket: "weekends-drive-only.appspot.com",
  messagingSenderId: "644624941668",
  appId: "1:644624941668:web:c78410c57dc237fceed571",
  measurementId: "G-8YJT48HESE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };