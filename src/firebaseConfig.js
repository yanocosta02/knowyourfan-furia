import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyfe2p4CG-ykWm5sNUbIw8gaHvuayG3Do", 
  authDomain: "knowyourfan-furia.firebaseapp.com",
  projectId: "knowyourfan-furia",
  storageBucket: "knowyourfan-furia.firebasestorage.app", 
  messagingSenderId: "193811804734",
  appId: "1:193811804734:web:c6ba77e2d7969399b4d76f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
// Não exporte storage