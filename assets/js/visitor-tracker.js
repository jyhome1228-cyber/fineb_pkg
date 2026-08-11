import { recordDailyVisitor } from './firebase-client.js';

const VISITOR_KEY = 'fineb_visitor_id_v1';

function makeVisitorId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const random = Math.random().toString(36).slice(2);
  return `v-${Date.now().toString(36)}-${random}`;
}

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = makeVisitorId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return makeVisitorId();
  }
}

function getKoreaDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

async function track() {
  if (document.visibilityState === 'prerender') return;
  const visitorId = getVisitorId();
  const date = getKoreaDate();
  const path = `${location.pathname || '/'}${location.search || ''}`;
  try {
    await recordDailyVisitor({ visitorId, date, path });
  } catch (error) {
    // 방문자 집계 실패가 사이트 이용을 방해하지 않도록 조용히 무시합니다.
    console.debug('FINE.B visitor tracking skipped:', error?.code || error?.message || error);
  }
}

track();