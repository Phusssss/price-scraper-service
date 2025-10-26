import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDnFyp0GIiGiw9Nvs_UqX161lC-aap0HLo",
  authDomain: "nonglac-2025.firebaseapp.com",
  projectId: "nonglac-2025",
  storageBucket: "nonglac-2025.firebasestorage.app",
  messagingSenderId: "258039490955",
  appId: "1:258039490955:web:1f59dfbda556b8e833678e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);

// Sign in anonymously
try {
  await signInAnonymously(auth);
  console.log('Firebase authenticated');
} catch (error) {
  console.log('Firebase auth not required');
}