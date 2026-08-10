import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

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

const COLLECTIONS = {
  quote: 'quotes',
  sample: 'samples',
  inquiry: 'inquiries'
};

const VALID_STATUSES = ['신규', '확인중', '진행중', '견적완료', '완료', '보류'];

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

export async function fetchAdminRequests(type) {
  const collectionName = collectionNameFor(type);
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => new Date(b.createdAtClient || 0) - new Date(a.createdAtClient || 0));
}

export async function updateAdminRequest(type, id, patch = {}) {
  const collectionName = collectionNameFor(type);
  const status = patch.status;
  if (!VALID_STATUSES.includes(status)) throw new Error('INVALID_STATUS');

  const safePatch = {
    status,
    statusUpdatedAt: patch.statusUpdatedAt || new Date().toISOString(),
    updatedAtClient: new Date().toISOString(),
    updatedAt: serverTimestamp()
  };

  await updateDoc(doc(db, collectionName, id), safePatch);
  return safePatch;
}

export async function importLegacyRequestIfMissing(type, payload) {
  const collectionName = collectionNameFor(type);
  const data = normalizeRequest(type, payload);
  const ref = doc(db, collectionName, data.id);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return false;

  const originalStatus = VALID_STATUSES.includes(data.status) ? data.status : '신규';
  const migrated = {
    ...data,
    status: '신규',
    privacyAgreed: data.privacyAgreed === true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    migratedFromLocalStorage: true,
    migratedAtClient: new Date().toISOString()
  };

  await setDoc(ref, migrated);

  if (originalStatus !== '신규') {
    await updateAdminRequest(type, data.id, {
      status: originalStatus,
      statusUpdatedAt: data.statusUpdatedAt || new Date().toISOString()
    });
  }
  return true;
}
