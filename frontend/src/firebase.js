// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-application-367ab.firebaseapp.com",
  projectId: "mern-blog-application-367ab",
  storageBucket: "mern-blog-application-367ab.appspot.com",
  messagingSenderId: "275106791441",
  appId: "1:275106791441:web:1628db5e609db0da23f1b0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);