// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8c2ZlTFXK9NLoeL2N3LHvF-X0jrQzaYw",
  authDomain: "ablelyfvideo.firebaseapp.com",
  projectId: "ablelyfvideo",
  storageBucket: "ablelyfvideo.appspot.com",
  messagingSenderId: "738787398942",
  appId: "1:738787398942:web:569eee11c8db02b887250f",
  measurementId: "G-DBE0DN26TY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const storage = getStorage(app);
export const db = getFirestore(app);
