import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Não importe getStorage

// 🚨 ATENÇÃO: Configuração diretamente no código.
// Isso é um RISCO DE SEGURANÇA. Use apenas para teste local rápido.
// Mova para variáveis de ambiente (import.meta.env.VITE_...) o mais rápido possível!
const firebaseConfig = {
  apiKey: "AIzaSyAyfe2p4CG-ykWm5sNUbIw8gaHvuayG3Do", // SUA CHAVE - RISCO!
  authDomain: "knowyourfan-furia.firebaseapp.com",
  projectId: "knowyourfan-furia",
  storageBucket: "knowyourfan-furia.firebasestorage.app", // Mesmo não usando, está aqui
  messagingSenderId: "193811804734",
  appId: "1:193811804734:web:c6ba77e2d7969399b4d76f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
// Não exporte storage