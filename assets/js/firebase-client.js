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
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js';

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

const COLLECTIONS = {
  quote: 'quotes',
  sample: 'samples',
  inquiry: 'inquiries'
};

const VALID_STATUSES = ['신규', '확인중', '진행중', '견적완료', '완료', '보류'];
const PORTFOLIO_CATEGORIES = ['paper', 'gift', 'rigid', 'special'];

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

function cleanFileName(name = 'image') {
  return String(name)
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(-90) || 'image';
}

export function makePortfolioId() {
  const rand = Math.random().toString(36).slice(2, 8);
  return `P-${Date.now()}-${rand}`;
}

export async function uploadPortfolioImage(projectId, file, index = 0) {
  if (!projectId || !file) throw new Error('PORTFOLIO_UPLOAD_INPUT');
  if (!String(file.type || '').startsWith('image/')) throw new Error('PORTFOLIO_IMAGE_ONLY');
  const safeName = cleanFileName(file.name);
  const path = `portfolio/${projectId}/${String(index + 1).padStart(2, '0')}-${Date.now()}-${safeName}`;
  const ref = storageRef(storage, path);
  const result = await uploadBytes(ref, file, {
    contentType: file.type,
    customMetadata: { projectId, originalName: file.name || safeName }
  });
  const url = await getDownloadURL(result.ref);
  return { url, path, name: file.name || safeName, size: file.size || 0, type: file.type || '' };
}

export async function createPortfolioProject(payload = {}) {
  const id = payload.id || makePortfolioId();
  const title = String(payload.title || '').trim();
  const cat = String(payload.cat || '').trim();
  const images = Array.isArray(payload.images) ? payload.images.filter(Boolean) : [];
  if (!title) throw new Error('PORTFOLIO_TITLE_REQUIRED');
  if (!PORTFOLIO_CATEGORIES.includes(cat)) throw new Error('PORTFOLIO_CATEGORY_REQUIRED');
  if (!images.length) throw new Error('PORTFOLIO_IMAGE_REQUIRED');

  const now = new Date().toISOString();
  const data = {
    id,
    title,
    cat,
    kicker: String(payload.kicker || '').trim(),
    type: String(payload.type || '').trim(),
    feature: String(payload.feature || '').trim(),
    usage: String(payload.usage || '').trim(),
    desc: String(payload.desc || '').trim(),
    images,
    imageFiles: Array.isArray(payload.imageFiles) ? payload.imageFiles : [],
    published: true,
    source: 'cms',
    createdAtClient: now,
    updatedAtClient: now,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, 'portfolio', id), data);
  return { ...data, createdAt: undefined, updatedAt: undefined };
}

export async function fetchPortfolioProjects() {
  const snapshot = await getDocs(collection(db, 'portfolio'));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data(), source: 'cms' }))
    .filter((item) => item.published !== false)
    .sort((a, b) => new Date(b.createdAtClient || 0) - new Date(a.createdAtClient || 0));
}
