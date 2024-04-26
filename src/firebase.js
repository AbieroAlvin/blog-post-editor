import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const saveDraft = async (content) => {
  try {
    const docRef = await addDoc(collection(db, "drafts"), { content });
    return { id: docRef.id, content };
  } catch (error) {
    console.error("Error saving draft:", error);
    throw error;
  }
};

export const publishPost = async (content) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), { content });
    return { id: docRef.id, content };
  } catch (error) {
    console.error("Error publishing post:", error);
    throw error;
  }
};
