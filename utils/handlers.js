import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { app, auth } from "./../services/firebase";

// const auth = getAuth(app);
const database = getDatabase(app);

// Firebase Authentication Functions

// Sign up a new user
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in an existing user
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out the current user
// export const signOutUser = () => {
//   return signOut();
// };

// Firebase Realtime Database Functions

// Create a new record in the database
export const createRecord = (path, data) => {
  const newRecordRef = push(ref(database, path));
  return set(newRecordRef, data);
};

// Read a record from the database
export const readRecord = (path) => {
  return onValue(ref(database, path)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  });
};

// Update a record in the database
// export const updateRecord = (path, updates) => {
//   return update(ref(database, path), updates);
// };

// // Delete a record from the database
// export const deleteRecord = (path) => {
//   return remove(ref(database, path));
// };

// Generate Password
export const generatePassword = (
  length,
  includeNumbers,
  includeUppercase,
  includeLowercase,
  includeSymbols
) => {
  let characters = "";

  if (includeNumbers) {
    characters += "0123456789";
  }

  if (includeUppercase) {
    characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  if (includeLowercase) {
    characters += "abcdefghijklmnopqrstuvwxyz";
  }

  if (includeSymbols) {
    characters += "!@#$%^&*()-_=+[]{}<>:;,./?";
  }

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
};
