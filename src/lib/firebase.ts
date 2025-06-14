import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk7qLm9g89fCrqQMTNgqPBb7oIuQTvu58",
  authDomain: "nbfcsondage2026.firebaseapp.com",
  projectId: "nbfcsondage2026",
  storageBucket: "nbfcsondage2026.firebasestorage.app",
  messagingSenderId: "1000768164420",
  appId: "1:1000768164420:web:84a7c3a7eb7266dd606211"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db
}
