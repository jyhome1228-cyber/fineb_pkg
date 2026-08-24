import { db } from './firebase-client.js';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';
import './grad-patch.js';

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

function detectDevice() {
  const width = Math.max(window.innerWidth || 0, screen?.width || 0);
  if (width <= 767) return '모바일';
  if (width <= 1180) return '태블릿';
  return '데스크톱';
}

function cleanReferrer(raw = '') {
  if (!raw) return { host: '', url: '', keyword: '' };
  try {
    const url = new URL(raw);
    const params = url.searchParams;
    const keyword = params.get('query') || params.get('q') || params.get('keyword') || params.get('search_query') || '';
    const clean = `${url.origin}${url.pathname}`;
    return {
      host: url.hostname.replace(/^www\./, ''),
      url: clean.slice(0, 320),
      keyword: keyword.slice(0, 120)
    };
  } catch {
    return { host: '', url: '', keyword: '' };
  }
}

function classifyAttribution() {
  const landingParams = new URLSearchParams(location.search);
  const utmSource = (landingParams.get('utm_source') || '').trim();
  const utmMedium = (landingParams.get('utm_medium') || '').trim();
  const utmCampaign = (landingParams.get('utm_campaign') || '').trim();
  const utmTerm = (landingParams.get('utm_term') || '').trim();
  const ref = cleanReferrer(document.referrer || '');

  if (utmSource) {
    return {
      source: utmSource.slice(0, 80),
      medium: (utmMedium || 'campaign').slice(0, 40),
      campaign: utmCampaign.slice(0, 120),
      keyword: (utmTerm || ref.keyword).slice(0, 120),
      referrerHost: ref.host,
      referrerUrl: ref.url
    };
  }

  const host = ref.host.toLowerCase();
  if (!host) return { source: 'Direct', medium: 'direct', campaign: '', keyword: '', referrerHost: '', referrerUrl: '' };
  if (/(^|\.)google\./.test(host)) return { source: 'Google', medium: 'organic', campaign: '', keyword: ref.keyword, referrerHost: ref.host, referrerUrl: ref.url };
  if (/(^|\.)naver\.com$/.test(host)) {
    const source = host.startsWith('blog.') ? 'Naver Blog' : host.startsWith('cafe.') ? 'Naver Cafe' : 'Naver';
    const medium = source === 'Naver' ? 'organic' : 'referral';
    return { source, medium, campaign: '', keyword: ref.keyword, referrerHost: ref.host, referrerUrl: ref.url };
  }
  if (/(^|\.)bing\.com$/.test(host)) return { source: 'Bing', medium: 'organic', campaign: '', keyword: ref.keyword, referrerHost: ref.host, referrerUrl: ref.url };
  if (/(^|\.)daum\.net$/.test(host) || /search\.daum\.net$/.test(host)) return { source: 'Daum', medium: 'organic', campaign: '', keyword: ref.keyword, referrerHost: ref.host, referrerUrl: ref.url };
  if (/instagram\.com$/.test(host)) return { source: 'Instagram', medium: 'social', campaign: '', keyword: '', referrerHost: ref.host, referrerUrl: ref.url };
  if (/facebook\.com$/.test(host) || /fb\.com$/.test(host)) return { source: 'Facebook', medium: 'social', campaign: '', keyword: '', referrerHost: ref.host, referrerUrl: ref.url };
  if (/kakao\.com$/.test(host) || /kakaotalk/.test(host)) return { source: 'Kakao', medium: 'social', campaign: '', keyword: '', referrerHost: ref.host, referrerUrl: ref.url };

  return {
    source: ref.host.slice(0, 80),
    medium: 'referral',
    campaign: '',
    keyword: ref.keyword,
    referrerHost: ref.host,
    referrerUrl: ref.url
  };
}

function landingPath() {
  const params = new URLSearchParams(location.search);
  const keep = new URLSearchParams();
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'].forEach((key) => {
    const value = params.get(key);
    if (value) keep.set(key, value.slice(0, 120));
  });
  const query = keep.toString();
  return `${location.pathname || '/'}${query ? `?${query}` : ''}`.slice(0, 320);
}

async function track() {
  if (document.visibilityState === 'prerender') return;
  const visitorId = getVisitorId();
  const date = getKoreaDate();
  const path = (location.pathname || '/').slice(0, 160);
  const visitId = `${date}_${visitorId}`;
  const ref = doc(db, 'visits', visitId);

  try {
    const existing = await getDoc(ref);
    if (existing.exists()) return;

    const attribution = classifyAttribution();
    await setDoc(ref, {
      visitorId,
      date,
      firstPath: path,
      landingPath: landingPath(),
      source: attribution.source,
      medium: attribution.medium,
      campaign: attribution.campaign,
      keyword: attribution.keyword,
      referrerHost: attribution.referrerHost,
      referrerUrl: attribution.referrerUrl,
      device: detectDevice(),
      pageTitle: String(document.title || '').slice(0, 160),
      createdAtClient: new Date().toISOString(),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    // 분석 기록 실패가 사이트 이용을 방해하지 않도록 조용히 무시합니다.
    console.debug('FINE.B visitor tracking skipped:', error?.code || error?.message || error);
  }
}

track();
