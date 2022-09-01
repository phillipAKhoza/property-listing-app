import {getFirestore} from 'firebase/firestore'
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB61YYRUFwz0c8ode-PmQsQWj2dUUjtKNo",
  authDomain: "property-listing-286e4.firebaseapp.com",
  projectId: "property-listing-286e4",
  storageBucket: "property-listing-286e4.appspot.com",
  messagingSenderId: "783344542978",
  appId: "1:783344542978:web:ace8ed6b7bc15d3c468e1b"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore()