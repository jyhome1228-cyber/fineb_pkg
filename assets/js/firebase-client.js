import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, updateDoc } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';

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
export const storage = getStorage(app);
export const auth = getAuth(app);

const COLLECTIONS = { quote: 'quotes', sample: 'samples', inquiry: 'inquiries' };
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function safeName(name='file') {
  return name.replace(/[^a-zA-Z0-9._가-힣-]/g, '_');
}

async function uploadRequestFiles(type, requestId, files=[]) {
  const validFiles = [...files].filter(Boolean);
  const total = validFiles.reduce((sum, file) => sum + (file.size || 0), 0);
  if (total > MAX_FILE_SIZE) throw new Error('FILE_TOO_LARGE');
  const uploaded = [];
  for (const file of validFiles) {
    const path = `requests/${type}/${requestId}/${Date.now()}-${safeName(file.name)}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, { contentType: file.type || 'application/octet-stream' });
    const url = await getDownloadURL(storageRef);
    uploaded.push({ name: file.name, size: file.size, type: file.type || '', path, url });
  }
  return uploaded;
}

export async function savePublicRequest(type, payload, files=[]) {
  const collectionName = COLLECTIONS[type];
  if (!collectionName) throw new Error('UNKNOWN_REQUEST_TYPE');
  const id = payload.id || `${type.toUpperCase().slice(0,1)}-${Date.now()}`;
  const uploadedFiles = await uploadRequestFiles(type, id, files);
  const data = {
    ...payload,
    id,
    type,
    status: '신규',
    createdAtClient: payload.createdAtClient || new Date().toISOString(),
    updatedAtClient: new Date().toISOString(),
    files: uploadedFiles
  };
  await setDoc(doc(db, collectionName, id), data);
  return data;
}

export async function loginAdmin(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const adminSnap = await getDoc(doc(db, 'admins', credential.user.uid));
  if (!adminSnap.exists() || adminSnap.data()?.active !== true) {
    await signOut(auth);
    throw new Error('NOT_ADMIN');
  }
  return credential.user;
}

export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function isAdminUser(user) {
  if (!user) return false;
  const snap = await getDoc(doc(db, 'admins', user.uid));
  return snap.exists() && snap.data()?.active === true;
}

export async function logoutAdmin() {
  await signOut(auth);
}

export async function listAdminRequests(type) {
  const collectionName = COLLECTIONS[type];
  if (!collectionName) return [];
  const q = query(collection(db, collectionName), orderBy('createdAtClient', 'desc'), limit(300));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateAdminRequest(type, id, patch) {
  const collectionName = COLLECTIONS[type];
  if (!collectionName) throw new Error('UNKNOWN_REQUEST_TYPE');
  await updateDoc(doc(db, collectionName, id), { ...patch, updatedAtClient: new Date().toISOString() });
}
