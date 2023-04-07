import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAR7EVrJw72j00UWYJD0hq9qN4bEDnEgu4",
  authDomain: "mytodo-ef261.firebaseapp.com",
  projectId: "mytodo-ef261",
  storageBucket: "mytodo-ef261.appspot.com",
  messagingSenderId: "1083288924723",
  appId: "1:1083288924723:web:d2f6a39fce0eae371ae946",
  measurementId: "G-M6YGBC4L09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const fstore = getFirestore(app);
