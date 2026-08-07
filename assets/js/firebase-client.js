import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBhTNbNhvaUAnYKkHuqqQUzlwzDcW7vKSA',
  authDomain: 'finebpkg.firebaseapp.com',
  projectId: 'finebpkg',
  storageBucket: 'finebpkg.firebasestorage.app',
  messagingSenderId: '1085966915967',
  appId: '1:1085966915967:web:f28c8ac1eaa27da78fe24a'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const COLLECTIONS = { quote: 'quotes', sample: 'samples', inquiry: 'inquiries' };

export async function savePublicRequest(type, payload) {
  const collectionName = COLLECTIONS[type];
  if (!collectionName) throw new Error('UNKNOWN_REQUEST_TYPE');
  const id = payload.id || `${type.toUpperCase().slice(0,1)}-${Date.now()}`;
  const data = {
    ...payload,
    id,
    type,
    status: '신규',
    createdAtClient: payload.createdAtClient || new Date().toISOString(),
    updatedAtClient: new Date().toISOString()
  };
  delete data.files;
  delete data.uploadWarning;
  await setDoc(doc(db, collectionName, id), data);
  return data;
}
