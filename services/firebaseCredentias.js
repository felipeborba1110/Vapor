import { createSecretKey } from 'crypto';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBAXwOZJ0FjwxoR5ftvC1cjPJ-W_viKfc8",
  authDomain: "vaporapi-2eb4a.firebaseapp.com",
  projectId: "vaporapi-2eb4a",
  storageBucket: "vaporapi-2eb4a.firebasestorage.app",
  messagingSenderId: "521677691291",
  appId: "1:521677691291:web:15236c8d970ad28275693e"
};

const secret = "nosso segredinho"
export let JWTSecret = createSecretKey(secret, 'utf-8')