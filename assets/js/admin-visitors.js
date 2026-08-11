import { fetchVisitorStats } from './firebase-client.js';

const $ = (s) => document.querySelector(s);

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatKey(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function getKoreaRanges() {
  const nowKorea = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const y = nowKorea.getUTCFullYear();
  const m = nowKorea.getUTCMonth();
  const d = nowKorea.getUTCDate();
  const todayDate = new Date(Date.UTC(y, m, d));
  const weekday = todayDate.getUTCDay();
  const mondayOffset = weekday === 0 ? 6 : weekday - 1;
  const weekStartDate = new Date(todayDate.getTime() - mondayOffset * 86400000);
  const monthStartDate = new Date(Date.UTC(y, m, 1));

  return {
    today: formatKey(todayDate),
    weekStart: formatKey(weekStartDate),
    monthStart: formatKey(monthStartDate)
  };
}

function shortDate(key) {
  const [, month, day] = String(key).split('-');
  return `${Number(month)}.${Number(day)}`;
}

function setState(text, state = 'ok') {
  const el = $('#visitorSyncState');
  if (!el) return;
  el.textContent = text;
  el.dataset.state = state;
}

export async function loadVisitorStats() {
  const ranges = getKoreaRanges();
  setState('방문자 집계 동기화 중…', 'loading');

  try {
    const stats = await fetchVisitorStats(ranges);
    $('#visitorToday').textContent = stats.today.toLocaleString('ko-KR');
    $('#visitorWeekly').textContent = stats.weekly.toLocaleString('ko-KR');
    $('#visitorMonthly').textContent = stats.monthly.toLocaleString('ko-KR');
    $('#visitorTodayLabel').textContent = `${shortDate(stats.todayDate)} 오늘 · 브라우저 중복 제외`;
    $('#visitorWeeklyLabel').textContent = `${shortDate(stats.weekStart)} ~ ${shortDate(stats.todayDate)} · 중복 제외`;
    $('#visitorMonthlyLabel').textContent = `${shortDate(stats.monthStart)} ~ ${shortDate(stats.todayDate)} · 중복 제외`;
    setState(`Firestore visits 연결됨 · 일별 기록 ${stats.records.toLocaleString('ko-KR')}건`, 'ok');
  } catch (error) {
    console.error('Visitor stats load failed:', error);
    $('#visitorToday').textContent = '-';
    $('#visitorWeekly').textContent = '-';
    $('#visitorMonthly').textContent = '-';
    const code = error?.code || error?.message || '';
    if (String(code).includes('permission-denied')) {
      setState('방문자 Rules가 아직 적용되지 않았습니다.', 'error');
    } else {
      setState('방문자 집계 연결 오류', 'error');
    }
  }
}

function init() {
  loadVisitorStats();
  $('#refreshAdmin')?.addEventListener('click', () => loadVisitorStats());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();