import { db } from './firebase-client.js';
import {
  collection,
  getDocs,
  query,
  where
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

const $ = (selector) => document.querySelector(selector);
const DAY = 86400000;

const PAGE_TARGETS = [
  { path: 'index.html', label: '홈', keywords: ['패키지 제작', '칼라박스 제작', '박스 인쇄'] },
  { path: 'production.html', label: '제작품목', keywords: ['박스 제작', '박스 인쇄', '쇼핑백'] },
  { path: 'sample.html', label: '샘플제작', keywords: ['샘플 제작', '소량', '박스 인쇄'] },
  { path: 'grad2026.html', label: '졸업전시', keywords: ['졸업전시', '졸업작품', '졸업인쇄'] },
  { path: 'guide.html', label: '주문제작가이드', keywords: ['박스', '인쇄', '후가공'] },
  { path: 'process.html', label: '제작과정', keywords: ['인쇄', '후가공', '도무송'] },
  { path: 'works.html', label: '포트폴리오', keywords: ['패키지', '박스', '제작사례'] },
  { path: 'faq.html', label: 'FAQ', keywords: ['패키지', '제작기간', '샘플'] },
  { path: 'about.html', label: '회사소개', keywords: ['FINE.B', '패키지 제작', '파인비'] },
  { path: 'inquiry.html', label: '제작문의', keywords: ['패키지', '박스', '제작문의'] },
  { path: 'quote.html', label: '견적내기', keywords: ['패키지', '칼라박스', '견적'] }
];

function kstDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function dateDaysAgo(days) {
  return kstDateKey(new Date(Date.now() - days * DAY));
}

function clean(value, fallback = '-') {
  const text = String(value || '').trim();
  return text || fallback;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function shortPath(path = '/') {
  const text = String(path || '/').replace(/^https?:\/\/[^/]+/i, '') || '/';
  if (text === '/' || text === '/index.html' || text === 'index.html') return '/';
  return text.startsWith('/') ? text : `/${text}`;
}

function formatDate(row) {
  const raw = row.createdAtClient || '';
  if (!raw) return clean(row.date);
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return clean(row.date);
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  }).format(date);
}

function normalizeSource(row) {
  const source = clean(row.source, 'Direct');
  if (source === '-') return 'Direct';
  return source;
}

function isOrganic(row) {
  const medium = String(row.medium || '').toLowerCase();
  if (medium === 'organic') return true;
  return ['Google', 'Naver', 'Bing', 'Daum'].includes(normalizeSource(row));
}

function countBy(rows, getter) {
  const map = new Map();
  rows.forEach((row) => {
    const key = getter(row);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function setState(text, state = 'ok') {
  const el = $('#analyticsState');
  if (!el) return;
  el.textContent = text;
  el.dataset.state = state;
}

async function fetchTraffic() {
  const start = dateDaysAgo(89);
  const snapshot = await getDocs(query(collection(db, 'visits'), where('date', '>=', start)));
  return snapshot.docs
    .map((docItem) => ({ id: docItem.id, ...docItem.data() }))
    .sort((a, b) => String(b.createdAtClient || b.date || '').localeCompare(String(a.createdAtClient || a.date || '')));
}

function renderTraffic(rows) {
  const today = kstDateKey();
  const monthStart = dateDaysAgo(29);
  const todayRows = rows.filter((row) => row.date === today);
  const monthRows = rows.filter((row) => String(row.date || '') >= monthStart);
  const organicRows = monthRows.filter(isOrganic);
  const organicShare = monthRows.length ? Math.round((organicRows.length / monthRows.length) * 100) : 0;

  $('#statToday').textContent = todayRows.length.toLocaleString('ko-KR');
  $('#statMonth').textContent = monthRows.length.toLocaleString('ko-KR');
  $('#statOrganic').textContent = `${organicShare}%`;

  const landingCounts = countBy(rows, (row) => shortPath(row.landingPath || row.firstPath || '/'));
  const topLanding = landingCounts[0];
  $('#statLanding').textContent = topLanding ? shortPath(topLanding[0]).replace(/^\//, '') || 'HOME' : '-';
  $('#statLandingLabel').textContent = topLanding ? `최근 90일 ${topLanding[1].toLocaleString('ko-KR')}회 첫 진입` : '아직 유입 기록이 없습니다.';

  const sourceCounts = countBy(rows, (row) => normalizeSource(row));
  const maxSource = sourceCounts[0]?.[1] || 1;
  $('#sourceBars').innerHTML = sourceCounts.length
    ? sourceCounts.slice(0, 10).map(([source, count]) => {
        const pct = rows.length ? Math.round((count / rows.length) * 100) : 0;
        const width = Math.max(4, Math.round((count / maxSource) * 100));
        return `<div class="source-row"><div class="source-name">${escapeHtml(source)}</div><div class="source-track"><div class="source-fill" style="width:${width}%"></div></div><div class="source-value">${count} · ${pct}%</div></div>`;
      }).join('')
    : '<div class="empty-analytics">아직 수집된 유입 데이터가 없습니다.</div>';

  $('#landingRows').innerHTML = landingCounts.length
    ? landingCounts.slice(0, 12).map(([path, count]) => {
        const pct = rows.length ? Math.round((count / rows.length) * 100) : 0;
        return `<tr><td><strong>${escapeHtml(shortPath(path))}</strong></td><td>${count.toLocaleString('ko-KR')}회</td><td>${pct}%</td></tr>`;
      }).join('')
    : '<tr><td colspan="3" class="empty-analytics">아직 랜딩페이지 데이터가 없습니다.</td></tr>';

  $('#recentRows').innerHTML = rows.length
    ? rows.slice(0, 80).map((row) => {
        const source = normalizeSource(row);
        const organic = isOrganic(row);
        let keyword = clean(row.keyword, '');
        const campaign = clean(row.campaign, '');
        if (!keyword && campaign) keyword = campaign;
        if (!keyword && organic) keyword = '검색엔진 비공개';
        if (!keyword) keyword = '-';
        const referrer = clean(row.referrerUrl || row.referrerHost || row.referrer, source === 'Direct' ? '직접 접속 / 북마크' : '-');
        const landing = shortPath(row.landingPath || row.firstPath || '/');
        return `<tr>
          <td>${escapeHtml(formatDate(row))}</td>
          <td><strong>${escapeHtml(source)}</strong><br><span class="muted">${escapeHtml(clean(row.medium, source === 'Direct' ? 'direct' : 'referral'))}</span></td>
          <td><span class="keyword">${escapeHtml(keyword)}</span></td>
          <td><span class="url" title="${escapeHtml(landing)}">${escapeHtml(landing)}</span></td>
          <td><span class="url" title="${escapeHtml(referrer)}">${escapeHtml(referrer)}</span></td>
          <td>${escapeHtml(clean(row.device, '기존 데이터'))}</td>
        </tr>`;
      }).join('')
    : '<tr><td colspan="6" class="empty-analytics">아직 유입 기록이 없습니다.</td></tr>';
}

async function fetchText(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${path}:${response.status}`);
  return response.text();
}

function getMeta(doc, selector, attr = 'content') {
  return doc.querySelector(selector)?.getAttribute(attr)?.trim() || '';
}

function statusChip(text, type = 'neutral') {
  return `<span class="status-chip ${type}">${escapeHtml(text)}</span>`;
}

async function auditMeta() {
  let sitemapText = '';
  let robotsText = '';
  let sitemapOk = false;
  let robotsOk = false;

  try {
    sitemapText = await fetchText('sitemap.xml');
    sitemapOk = /<urlset|<sitemapindex/i.test(sitemapText);
  } catch {}
  try {
    robotsText = await fetchText('robots.txt');
    robotsOk = /user-agent:/i.test(robotsText);
  } catch {}

  const sitemapUrls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1].trim());
  const sitemapSet = new Set(sitemapUrls.map((url) => url.replace(/^https?:\/\/[^/]+\/?/i, '').replace(/^$/, 'index.html')));
  $('#sitemapState').textContent = sitemapOk ? `정상 · ${sitemapUrls.length} URLs` : '확인 필요';
  $('#robotsState').textContent = robotsOk ? (/sitemap:/i.test(robotsText) ? '정상 · Sitemap 안내됨' : '접근 가능 · Sitemap 안내 없음') : '확인 필요';
  $('#metaSitemapCount').textContent = sitemapUrls.length.toLocaleString('ko-KR');

  const results = [];
  for (const target of PAGE_TARGETS) {
    try {
      const html = await fetchText(target.path);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const title = doc.querySelector('title')?.textContent?.trim() || '';
      const description = getMeta(doc, 'meta[name="description"]');
      const robots = getMeta(doc, 'meta[name="robots"]');
      const canonical = getMeta(doc, 'link[rel="canonical"]', 'href');
      const ogTitle = getMeta(doc, 'meta[property="og:title"]');
      const ogDescription = getMeta(doc, 'meta[property="og:description"]');
      const ogImage = getMeta(doc, 'meta[property="og:image"]');
      const combined = `${title} ${description}`.toLowerCase();
      const keywordHits = target.keywords.map((keyword) => ({ keyword, hit: combined.includes(keyword.toLowerCase()) }));
      const normalizedPath = target.path === 'index.html' ? 'index.html' : target.path;
      const inSitemap = sitemapSet.has(normalizedPath) || (target.path === 'index.html' && (sitemapUrls.some((u) => /^https?:\/\/[^/]+\/?$/i.test(u))));
      const indexable = !/noindex/i.test(robots || '');
      const checks = [Boolean(title), Boolean(description), Boolean(canonical), indexable, Boolean(ogTitle), Boolean(ogDescription), Boolean(ogImage), inSitemap];
      const score = checks.filter(Boolean).length;
      const keywordMiss = keywordHits.some((item) => !item.hit);
      results.push({ ...target, title, description, robots, canonical, ogTitle, ogDescription, ogImage, inSitemap, indexable, score, keywordHits, keywordMiss, doc });
    } catch (error) {
      results.push({ ...target, error: error?.message || 'FETCH_ERROR', score: 0, keywordHits: target.keywords.map((keyword) => ({ keyword, hit: false })) });
    }
  }

  const home = results.find((item) => item.path === 'index.html');
  const naverVerification = home?.doc?.querySelector('meta[name="naver-site-verification"]')?.getAttribute('content')?.trim();
  $('#naverVerification').textContent = naverVerification ? '소유확인 메타 감지됨' : '메타 태그 확인 필요';

  const good = results.filter((item) => item.score >= 8 && !item.keywordMiss).length;
  const warn = results.length - good;
  $('#metaChecked').textContent = results.length.toLocaleString('ko-KR');
  $('#metaGood').textContent = good.toLocaleString('ko-KR');
  $('#metaWarn').textContent = warn.toLocaleString('ko-KR');

  $('#metaRows').innerHTML = results.map((item) => {
    if (item.error) {
      return `<tr><td><strong>${escapeHtml(item.label)}</strong><br><span class="muted">/${escapeHtml(item.path)}</span></td><td>${statusChip('불러오기 실패', 'bad')}</td><td colspan="4" class="muted">${escapeHtml(item.error)}</td></tr>`;
    }
    let stateType = 'ok';
    let stateText = '정상';
    if (item.score < 6) { stateType = 'bad'; stateText = '보강 필요'; }
    else if (item.score < 8 || item.keywordMiss) { stateType = 'warn'; stateText = '점검'; }
    const tech = [
      item.canonical ? statusChip('Canonical', 'ok') : statusChip('Canonical 없음', 'bad'),
      item.indexable ? statusChip('Index', 'ok') : statusChip('Noindex', 'bad'),
      item.ogTitle && item.ogDescription && item.ogImage ? statusChip('OG', 'ok') : statusChip('OG 점검', 'warn'),
      item.inSitemap ? statusChip('Sitemap', 'ok') : statusChip('Sitemap 없음', 'warn')
    ].join(' ');
    const keywordHtml = `<div class="keyword-list">${item.keywordHits.map((kw) => `<span class="keyword-dot ${kw.hit ? 'hit' : 'miss'}">${kw.hit ? '✓' : '·'} ${escapeHtml(kw.keyword)}</span>`).join('')}</div>`;
    return `<tr>
      <td><strong>${escapeHtml(item.label)}</strong><br><span class="muted">/${escapeHtml(item.path === 'index.html' ? '' : item.path)}</span></td>
      <td>${statusChip(stateText, stateType)}<br><span class="muted">${item.score}/8</span></td>
      <td><div class="meta-title">${escapeHtml(clean(item.title))}</div></td>
      <td><div class="meta-desc">${escapeHtml(clean(item.description))}</div></td>
      <td>${keywordHtml}</td>
      <td>${tech}</td>
    </tr>`;
  }).join('');

  return { sitemapOk, robotsOk, results };
}

async function load() {
  setState('유입·메타 데이터 확인 중…', 'loading');
  let trafficError = null;
  let metaError = null;
  let rows = [];

  try {
    rows = await fetchTraffic();
    renderTraffic(rows);
  } catch (error) {
    trafficError = error;
    console.error('Traffic analytics failed:', error);
    $('#sourceBars').innerHTML = '<div class="empty-analytics">Firestore 유입 데이터를 불러오지 못했습니다.</div>';
    $('#landingRows').innerHTML = '<tr><td colspan="3" class="empty-analytics">Firestore 연결을 확인해주세요.</td></tr>';
    $('#recentRows').innerHTML = '<tr><td colspan="6" class="empty-analytics">Firestore 연결을 확인해주세요.</td></tr>';
  }

  try {
    await auditMeta();
  } catch (error) {
    metaError = error;
    console.error('SEO audit failed:', error);
    $('#metaRows').innerHTML = '<tr><td colspan="6" class="empty-analytics">메타 점검 중 오류가 발생했습니다.</td></tr>';
  }

  if (trafficError && metaError) setState('데이터 연결 오류', 'error');
  else if (trafficError) setState('메타 점검 완료 · 유입 데이터 오류', 'error');
  else if (metaError) setState(`유입 ${rows.length}건 · 메타 점검 오류`, 'error');
  else setState(`최근 90일 유입 ${rows.length.toLocaleString('ko-KR')}건 · 메타 점검 완료`, 'ok');
}

$('#refreshAnalytics')?.addEventListener('click', load);
load();
