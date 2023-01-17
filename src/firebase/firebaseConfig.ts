import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDBAn0Flw_sUwBwCsre1mB-NddC9aVF8dQ",
    authDomain: "nagumo-s3.firebaseapp.com",
    projectId: "nagumo-s3",
    storageBucket: "nagumo-s3.appspot.com",
    messagingSenderId: "927271419159",
    appId: "1:927271419159:web:edbf692bd4f51ca3f60b52",
    measurementId: "G-S2SDH16WS9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
