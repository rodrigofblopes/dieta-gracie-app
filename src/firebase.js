import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBE5_S3-lBa44RVNtEYunkB0Ik999KInI8",
  authDomain: "dieta-gracie-app.firebaseapp.com",
  projectId: "dieta-gracie-app",
  storageBucket: "dieta-gracie-app.firebasestorage.app",
  messagingSenderId: "191357835216",
  appId: "1:191357835216:web:9d71f6a529e04ef6b2cbd5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
