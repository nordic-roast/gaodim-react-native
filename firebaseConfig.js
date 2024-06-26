import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// @ts-ignore
import {
  initializeAuth,
  getReactNativePersistence,
} from "@firebase/auth/dist/rn/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_APIKEY,
  authDomain: process.env.EXPO_PUBLIC_AUTHDOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_DATABASEURL,
  projectId: process.env.EXPO_PUBLIC_PROJECTID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.EXPO_PUBLIC_APPID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENTID,
};

const firebaseApp = initializeApp(firebaseConfig);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export const database = getDatabase(firebaseApp);

export const storage = getStorage(firebaseApp);

export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(firebaseApp);
