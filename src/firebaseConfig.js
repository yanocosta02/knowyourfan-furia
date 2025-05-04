import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // Descomente se precisar do Storage no futuro

// Lê as variáveis de ambiente prefixadas com VITE_ (do arquivo .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // Mesmo se não usar Storage, está na config
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Verificação opcional para ajudar a encontrar erros de digitação no .env
console.log("Firebase Config from Env:", firebaseConfig); // Log para ver o que foi carregado
for (const key in firebaseConfig) {
  // Storage Bucket pode ser opcional dependendo do seu uso
  const isOptional = key === 'storageBucket';
  if (!firebaseConfig[key] && !isOptional) {
    console.error(
      `ERRO: Variável de ambiente Firebase "${key}" (VITE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}) não encontrada ou vazia no arquivo .env!`
    );
    // Você pode querer lançar um erro aqui ou ter um comportamento de fallback
  }
}

// Initialize Firebase
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase inicializado com sucesso!");
} catch (error) {
    console.error("Falha ao inicializar Firebase:", error);
    // Lide com o erro - talvez mostre uma mensagem para o usuário
    // ou impeça o restante da aplicação de carregar
    throw new Error("Não foi possível conectar ao Firebase. Verifique a configuração.");
}


// Export Firebase services (só exporta se 'app' foi inicializado)
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
// export const storage = app ? getStorage(app) : null; // Descomente se usar Storage

// Adicional: Exporta o próprio app se precisar em outro lugar
// export { app };