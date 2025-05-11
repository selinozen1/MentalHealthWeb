import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDMio-30ktPaZE-CbrCsyXTVUW7L1w-Cks",
    authDomain: "mentalhealth-7cd68.firebaseapp.com",
    projectId: "mentalhealth-7cd68",
    storageBucket: "mentalhealth-7cd68.appspot.com",
    messagingSenderId: "526534931192",
    appId: "1:526534931192:web:d27cb5a4bd8bb6da4e410d",
    measurementId: "G-XS5C3766DC"
  };

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore veritabanı örneğini al
export const db = getFirestore(app);

// Authentication servisini al
export const auth = getAuth(app);

export default app; 