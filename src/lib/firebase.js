"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
    apiKey: "AIzaSyBk7qLm9g89fCrqQMTNgqPBb7oIuQTvu58",
    authDomain: "nbfcsondage2026.firebaseapp.com",
    projectId: "nbfcsondage2026",
    storageBucket: "nbfcsondage2026.firebasestorage.app",
    messagingSenderId: "1000768164420",
    appId: "1:1000768164420:web:84a7c3a7eb7266dd606211"
};
var app = (0, app_1.initializeApp)(firebaseConfig);
var db = (0, firestore_1.getFirestore)(app);
exports.db = db;
