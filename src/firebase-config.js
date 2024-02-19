// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiBRyrFKJotoUWHaw2GeNfJIRP-R2iqDs",
  authDomain: "online-chat-4f605.firebaseapp.com",
  projectId: "online-chat-4f605",
  storageBucket: "online-chat-4f605.appspot.com",
  messagingSenderId: "1088926220587",
  appId: "1:1088926220587:web:e1dba92cb8e0b1f0fd056e",
  measurementId: "G-23P3809R6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);