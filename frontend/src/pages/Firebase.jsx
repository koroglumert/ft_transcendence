import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
 const firebaseConfig = {
  apiKey: "AIzaSyAELvXZruRdfeYh6CF9bqIenUAAJhf5Q7U",
  authDomain: "transcendence-4e1a7.firebaseapp.com",
  projectId: "transcendence-4e1a7",
  storageBucket: "transcendence-4e1a7.appspot.com",
  messagingSenderId: "87417590488",
  appId: "1:87417590488:web:7a114626d3898dfd67bdad",
  measurementId: "G-CKSL6YBMNQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const imgDB = getStorage(app);

export {imgDB};