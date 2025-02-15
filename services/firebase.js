import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQ5qQWF--S3INDgJtWWSaDYfrAn6K7N2M",
  authDomain: "vault-3966f.firebaseapp.com",
  projectId: "vault-3966f",
  storageBucket: "vault-3966f.firebasestorage.app",
  messagingSenderId: "202137369345",
  appId: "1:202137369345:web:f0712d6f2eec283e0af900",
  measurementId: "G-DJ7DNNFRSK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
