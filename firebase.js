// ==========================================
// BRAND ITEMS - FIREBASE
// ==========================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBWCjzqC86X8f7HFf-yCrhiLpoZMROWSlE",
    authDomain: "brand-items.firebaseapp.com",
    projectId: "brand-items",
    storageBucket: "brand-items.firebasestorage.app",
    messagingSenderId: "705695809822",
    appId: "1:705695809822:web:e0469e2a5bac2a4458890f",
    measurementId: "G-084SH06PFR"
};

// Firebase শুরু
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

// Firebase Authentication
const auth = getAuth(app);

// অন্য JS ফাইলে ব্যবহার করার জন্য
window.firebaseApp = app;
window.firebaseDB = db;
window.firebaseAuth = auth;

console.log("Firebase connected successfully!");