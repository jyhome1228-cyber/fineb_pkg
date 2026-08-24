import { db } from './firebase-client.js';
import {
  collection,
  getDocs,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

const $ = (selector) => document.querySelector(selector);
const DAY = 86400000;
let allRows = [];
let activePeriod = 'today';

const PAGE_TARGETS = [
  { path: 'index.html', label: '홈', keywords: ['패키지 제작', '칼라박스 제작', '박스 인쇄'] },
  { path: 'production.html', label: '제작품목', keywords: ['박스 제작', '박스 인쇄', '쇼핑백'] },
  { path: 'sample.html', label: '샘플제작', keywords: ['샘플 제작', '소량', '박스 인쇄'] },
  { path: 'grad2026.html', label: '졸업전시', keywords: ['졸업전시', '졸업작품', '졸업인쇄'] },
  { path: 'guide.html', label: '주문제작가이드', keywords: ['박스', '인쇄', '후가공'] },
  { path: 'process.html', label: '제작과정', keywords: ['인쇄', '후가공', '도무송'] },
  { path: 'works.html', label: '포트폴리오', keywords: ['패키지', '박스', '제작사례'] },
  { path: 'faq.html', label: 'FAQ', keywords: ['패키지', '제작기간', '샘플'] },
  { path: 'inquiry.html', label: '제작문의', keywords: ['패키지', '박스', '제작문의'] },
  { path: 'quote.html', label: '견적내기', keywords: ['패키지', '칼라박스', '견적'] }
];

function kstDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function dateDaysAgo(days) {
  return kstDateKey(new Date(Date.now() - days * DAY));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function clean(value, fallback = '-') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function setState(text, state = 'ok') {
  const el = $('#trafficState');
  if (!el) return;
  el.textContent = text;
  el.dataset.state = state;
}

function entryPath(row) {
  const raw = String(row.landingPath || row.firstPath || '/').trim() || '/';
  try {
    const url = new URL(raw, 'https://finebpkg.com');
    [...url.searchParams.keys()].forEach((key) => {
      if (/^utm_/i.test(key)) url.searchParams.delete(key);
    });
    const queryText = url.searchParams.toString();
    const path = url.pathname === '/index.html' ? '/' : url.pathname;
    return `${path}${queryText ? `?${queryText}` : ''}`;
  } catch {
    return raw.startsWith('/') ? raw : `/${raw}`;
  }
}

function referrerHostFromUrl(raw = '') {
  if (!raw) return '';
  try { return new URL(raw).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function referrerLabel(row) {
  const host = clean(row.referrerHost, '') || referrerHostFromUrl(row.referrerUrl || row.referrer || '');
  if (host) return host.toLowerCase();

  const source = clean(row.source, '');
  const medium = clean(row.medium, '').toLowerCase();
  if (source === 'Direct' || medium === 'direct') return 'Direct / 직접 방문';
  if (source) return source;

  return '기존 데이터 / 출처 미수집';
}

function isLegacy(row) {
  return referrerLabel(row) === '기존 데이터 / 출처 미수집';
}

function isDirect(row) {
  return referrerLabel(row) === 'Direct / 직접 방문';
}

function isSearch(row) {
  const medium = clean(row.medium, '').toLowerCase();
  if (medium === 'organic') return true;
  const source = clean(row.source, '').toLowerCase();
  const host = referrerLabel(row).toLowerCase();
  return ['google', 'naver', 'bing', 'daum'].some((name) => source === name || host.includes(name));
}

function countBy(rows, getter) {
  const map = new Map();
  rows.forEach((row) => {
    const key = getter(row);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

function selectedRows() {
  if (activePeriod === 'date') {
    const key = $('#trafficDate')?.value || kstDateKey();
    return allRows.filter((row) => row.date === key);
  }
  if (activePeriod === 'today') {
    const today = kstDateKey();
    return allRows.filter((row) => row.date === today);
  }
  if (activePeriod === 'yesterday') {
    const yesterday = dateDaysAgo(1);
    return allRows.filter((row) => row.date === yesterday);
  }
  const days = Number(activePeriod) || 30;
  const start = dateDaysAgo(days - 1);
  return allRows.filter((row) => String(row.date || '') >= start);
}

function periodText() {
  if (activePeriod === 'today') return '오늘 기준';
  if (activePeriod === 'yesterday') return '어제 기준';
  if (activePeriod === 'date') return `${$('#trafficDate')?.value || kstDateKey()} 기준`;
  return `최근 ${activePeriod}일 기준`;
}

function renderRank(target, entries) {
  const el = $(target);
  if (!el) return;
  if (!entries.length) {
    el.innerHTML = '<div class="rank-empty">해당 기간에 수집된 데이터가 없습니다.</div>';
    return;
  }
  el.innerHTML = entries.slice(0, 8).map(([name, count], index) => `
    <div class="rank-row">
      <span class="rank-no">${String(index + 1).padStart(2, '0')}</span>
      <span class="rank-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
      <span class="rank-count">${count.toLocaleString('ko-KR')}</span>
    </div>
  `).join('');
}

function formatDateTime(row) {
  const raw = row.createdAtClient;
  if (!raw) return clean(row.date);
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return clean(row.date);
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  }).format(date);
}

function renderLogs(rows) {
  const body = $('#trafficRows');
  if (!body) return;
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="5" class="muted">해당 기간에 유입 기록이 없습니다.</td></tr>';
    return;
  }
  body.innerHTML = rows.slice(0, 80).map((row) => {
    let term = clean(row.keyword, '');
    if (!term) term = clean(row.campaign, '');
    if (!term && isSearch(row)) term = '검색엔진 비공개';
    if (!term) term = '-';
    return `<tr>
      <td>${escapeHtml(formatDateTime(row))}</td>
      <td><span class="url" title="${escapeHtml(entryPath(row))}">${escapeHtml(entryPath(row))}</span></td>
      <td>${escapeHtml(referrerLabel(row))}</td>
      <td>${escapeHtml(term)}</td>
      <td>${escapeHtml(clean(row.device, '기존 데이터'))}</td>
    </tr>`;
  }).join('');
}

function renderTraffic() {
  const rows = selectedRows();
  const searchCount = rows.filter(isSearch).length;
  const directCount = rows.filter(isDirect).length;
  const referralCount = rows.filter((row) => !isSearch(row) && !isDirect(row) && !isLegacy(row)).length;

  $('#sumVisits').textContent = rows.length.toLocaleString('ko-KR');
  $('#sumSearch').textContent = searchCount.toLocaleString('ko-KR');
  $('#sumDirect').textContent = directCount.toLocaleString('ko-KR');
  $('#sumReferral').textContent = referralCount.toLocaleString('ko-KR');
  $('#periodLabel').textContent = periodText();

  renderRank('#entryRank', countBy(rows, entryPath));
  renderRank('#referrerRank', countBy(rows, referrerLabel));
  renderLogs(rows);
}

async function fetchTraffic() {
  const start = dateDaysAgo(89);
  const snapshot = await getDocs(query(collection(db, 'visits'), where('date', '>=', start)));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => String(b.createdAtClient || b.date || '').localeCompare(String(a.createdAtClient || a.date || '')));
}

async function fetchText(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${path}:${response.status}`);
  return response.text();
}

function metaStatus(label, type = '') {
  return `<span class="meta-status${type ? ` ${type}` : ''}">${escapeHtml(label)}</span>`;
}

async function auditMeta() {
  let sitemap = '';
  try { sitemap = await fetchText('sitemap.xml'); } catch {}
  const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1].trim());

  const results = [];
  for (const target of PAGE_TARGETS) {
    try {
      const html = await fetchText(target.path);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const title = doc.querySelector('title')?.textContent?.trim() || '';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
      const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content')?.trim() || '';
      const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() || '';
      const combined = `${title} ${description}`.toLowerCase();
      const hits = target.keywords.filter((keyword) => combined.includes(keyword.toLowerCase()));
      const inSitemap = target.path === 'index.html'
        ? sitemapUrls.some((url) => /^https?:\/\/[^/]+\/?$/i.test(url))
        : sitemapUrls.some((url) => url.endsWith(`/${target.path}`));
      const indexable = !/noindex/i.test(robots);
      const score = [title, description, canonical, indexable, inSitemap].filter(Boolean).length;
      results.push({ ...target, title, description, hits, score, indexable, inSitemap });
    } catch {
      results.push({ ...target, error: true, title: '', description: '', hits: [], score: 0 });
    }
  }

  const body = $('#metaRows');
  if (!body) return;
  body.innerHTML = results.map((item) => {
    if (item.error) return `<tr><td>${escapeHtml(item.label)}</td><td>${metaStatus('확인 실패', 'bad')}</td><td colspan="3" class="muted">페이지를 불러오지 못했습니다.</td></tr>`;
    const allKeywords = item.hits.length === item.keywords.length;
    const state = item.score === 5 && allKeywords ? metaStatus('정상') : item.score >= 4 ? metaStatus('점검', 'warn') : metaStatus('보강 필요', 'bad');
    const keywordText = item.keywords.map((keyword) => `${item.hits.includes(keyword) ? '✓' : '·'} ${keyword}`).join(' · ');
    return `<tr>
      <td><strong>${escapeHtml(item.label)}</strong><br><span class="muted">/${item.path === 'index.html' ? '' : escapeHtml(item.path)}</span></td>
      <td>${state}</td>
      <td>${escapeHtml(clean(item.title))}</td>
      <td><span class="url" title="${escapeHtml(clean(item.description))}">${escapeHtml(clean(item.description))}</span></td>
      <td>${escapeHtml(keywordText)}</td>
    </tr>`;
  }).join('');
}

function setPeriod(value) {
  activePeriod = value;
  document.querySelectorAll('.period-btn[data-period]').forEach((button) => {
    button.classList.toggle('active', button.dataset.period === value);
  });
  renderTraffic();
}

async function load() {
  setState('유입 데이터 확인 중…', 'loading');
  try {
    allRows = await fetchTraffic();
    renderTraffic();
    setState(`최근 90일 ${allRows.length.toLocaleString('ko-KR')}건 수집`, 'ok');
  } catch (error) {
    console.error('Traffic load failed:', error);
    setState('유입 데이터 연결 오류', 'error');
    $('#entryRank').innerHTML = '<div class="rank-empty">Firestore 연결을 확인해주세요.</div>';
    $('#referrerRank').innerHTML = '<div class="rank-empty">Firestore 연결을 확인해주세요.</div>';
  }

  try { await auditMeta(); } catch (error) { console.error('Meta audit failed:', error); }
}

$('#trafficDate').value = kstDateKey();
document.querySelectorAll('.period-btn[data-period]').forEach((button) => {
  button.addEventListener('click', () => setPeriod(button.dataset.period));
});
$('#showDate')?.addEventListener('click', () => setPeriod('date'));
$('#trafficDate')?.addEventListener('change', () => {
  if (activePeriod === 'date') renderTraffic();
});
$('#refreshTraffic')?.addEventListener('click', load);

load();