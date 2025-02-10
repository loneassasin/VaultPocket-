// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCt1T-LTaFSTCUr8DyIi416-NHSH2CqKJg",
//   authDomain: "valut-pocket-password.firebaseapp.com",
//   projectId: "valut-pocket-password",
//   databaseURL: "https://valut-pocket-password-default-rtdb.firebaseio.com/",
//   storageBucket: "valut-pocket-password.appspot.com",
//   messagingSenderId: "843824204435",
//   appId: "1:843824204435:web:9c3fe9a423a2fad918db66",
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";

export const app = initializeApp({
  // enter your firebase project details
  apiKey: "AIzaSyDQ5qQWF--S3INDgJtWWSaDYfrAn6K7N2M",
  authDomain: "vault-3966f.firebaseapp.com",
  projectId: "vault-3966f",
  storageBucket: "vault-3966f.firebasestorage.app",
  messagingSenderId: "202137369345",
  appId: "1:202137369345:web:f0712d6f2eec283e0af900",
  measurementId: "G-DJ7DNNFRSK",

  // apiKey: "AIzaSyBRHWmc-A5n1zF5qB3pJ4Ok_9x-r2_x6Ws",
  // authDomain: "passwordapp-5b9ee.firebaseapp.com",
  // projectId: "passwordapp-5b9ee",
  // storageBucket: "passwordapp-5b9ee.appspot.com",
  // messagingSenderId: "787912703223",
  // appId: "1:787912703223:web:5f0902cc09f0e3229b67f2",
  // measurementId: "G-EPR16RZF6T",
});

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
