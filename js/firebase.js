import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC7KoFyjclpBmd9HxkaAwmd9H0uqPfKfxQ",
  authDomain: "test-repo-admin.firebaseapp.com",
  projectId: "test-repo-admin",
  storageBucket: "test-repo-admin.firebasestorage.app",
  messagingSenderId: "1040790855579",
  appId: "1:1040790855579:web:8958fe9573634861a0cb3e"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
