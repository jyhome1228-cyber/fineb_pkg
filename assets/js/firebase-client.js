import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBhTNbNhvaUAnYKkHuqqQUzlwzDcW7vKSA',
  authDomain: 'finebpkg.firebaseapp.com',
  projectId: 'finebpkg',
  storageBucket: 'finebpkg.firebasestorage.app',
  messagingSenderId: '1085966915967',
  appId: '1:1085966915967:web:f28c8ac1eaa27da78fe24a'
};

export const ADMIN_EMAIL = 'whales84@naver.com';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const COLLECTIONS = {
  quote: 'quotes',
  sample: 'samples',
  inquiry: 'inquiries'
};

function collectionNameFor(type) {
  const collectionName = COLLECTIONS[type];
  if (!collectionName) throw new Error('UNKNOWN_REQUEST_TYPE');
  return collectionName;
}

function normalizeRequest(type, payload = {}) {
  const id = payload.id || `${type.toUpperCase().slice(0, 1)}-${Date.now()}`;
  const now = new Date().toISOString();
  const data = {
    ...payload,
    id,
    type,
    status: payload.status || '신규',
    createdAtClient: payload.createdAtClient || now,
    updatedAtClient: now
  };
  delete data.files;
  delete data.uploadWarning;
  return data;
}

export async function savePublicRequest(type, payload) {
  const collectionName = collectionNameFor(type);
  const data = normalizeRequest(type, { ...payload, status: '신규' });
  await setDoc(doc(db, collectionName, data.id), {
    ...data,
    status: '신규',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return data;
}

export function observeAdminAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signInAdmin(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (normalizedEmail !== ADMIN_EMAIL) {
    const error = new Error('ADMIN_EMAIL_NOT_ALLOWED');
    error.code = 'admin/email-not-allowed';
    throw error;
  }
  return signInWithEmailAndPassword(auth, normalizedEmail, password);
}

export async function signOutAdmin() {
  return signOut(auth);
}

export async function fetchAdminRequests(type) {
  const collectionName = collectionNameFor(type);
  const q = query(collection(db, collectionName), orderBy('createdAtClient', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function updateAdminRequest(type, id, patch = {}) {
  const collectionName = collectionNameFor(type);
  const safePatch = {
    ...patch,
    updatedAtClient: new Date().toISOString(),
    updatedAt: serverTimestamp()
  };
  delete safePatch.id;
  delete safePatch.type;
  delete safePatch.createdAt;
  delete safePatch.createdAtClient;
  await updateDoc(doc(db, collectionName, id), safePatch);
  return safePatch;
}

export async function importLegacyRequestIfMissing(type, payload) {
  const collectionName = collectionNameFor(type);
  const data = normalizeRequest(type, payload);
  const ref = doc(db, collectionName, data.id);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return false;

  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    migratedFromLocalStorage: true,
    migratedAtClient: new Date().toISOString()
  });
  return true;
}
