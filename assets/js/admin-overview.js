import { db, fetchAdminRequests } from './firebase-client.js';
import { collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

const TYPES = ['quote', 'sample', 'inquiry'];
const COLLECTIONS = {
  quote: 'quotes',
  sample: 'samples',
  inquiry: 'inquiries'
};
const SOUND_PREF_KEY = 'fineb_admin_inquiry_sound_enabled';

const $ = (selector) => document.querySelector(selector);

let audioContext = null;
let audioUnlocked = false;
let soundEnabled = localStorage.getItem(SOUND_PREF_KEY) !== 'false';
let refreshTimer = null;

function typeLabel(type) {
  return type === 'quote' ? '견적' : type === 'sample' ? '샘플' : '제작';
}

function statusLabel(row) {
  return row?.status || '신규';
}

function safeDate(value) {
  const date = new Date(value || 0);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function formatDate(value) {
  const date = safeDate(value);
  if (!date.getTime()) return '-';
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function requestTitle(row) {
  return row?.spec?.title || row?.spec?.product || row?.company || row?.name || `${typeLabel(row?.type)} 문의`;
}

function ensureEnhancementStyles() {
  if ($('#adminOverviewEnhancementStyles')) return;
  const style = document.createElement('style');
  style.id = 'adminOverviewEnhancementStyles';
  style.textContent = `
    #soundAlertTest{white-space:nowrap}
    .inquiry-inbox-bar{position:fixed;z-index:9998;left:50%;bottom:18px;display:flex;align-items:center;gap:12px;width:min(640px,calc(100vw - 32px));min-height:54px;transform:translate(-50%,16px);border:1px solid #cbd5df;border-radius:15px;padding:8px 9px 8px 12px;background:rgba(255,255,255,.97);box-shadow:0 14px 34px rgba(10,34,64,.16);opacity:0;pointer-events:none;transition:opacity .2s ease,transform .2s ease;backdrop-filter:blur(12px)}
    .inquiry-inbox-bar.show{transform:translate(-50%,0);opacity:1;pointer-events:auto}
    .inquiry-inbox-mark{position:relative;display:grid;place-items:center;flex:0 0 34px;width:34px;height:34px;border-radius:10px;background:#0A2240;color:#fff;font-size:11px;font-weight:800;letter-spacing:.03em}
    .inquiry-inbox-mark:after{content:"";position:absolute;right:-2px;top:-2px;width:8px;height:8px;border:2px solid #fff;border-radius:999px;background:#dc554f}
    .inquiry-inbox-copy{min-width:0;flex:1}
    .inquiry-inbox-copy strong{display:block;overflow:hidden;color:#172432;font-size:11.5px;font-weight:760;text-overflow:ellipsis;white-space:nowrap}
    .inquiry-inbox-copy span{display:block;overflow:hidden;margin-top:3px;color:#7d8995;font-size:9.5px;text-overflow:ellipsis;white-space:nowrap}
    .inquiry-inbox-actions{display:flex;align-items:center;gap:6px;flex:0 0 auto}
    .inquiry-inbox-actions button{min-height:34px;border:1px solid #d7dfe6;border-radius:10px;padding:0 11px;background:#fff;color:#27333f;font-size:10px;font-weight:700;cursor:pointer}
    .inquiry-inbox-actions button:hover{border-color:#0A2240;color:#0A2240}
    .inquiry-inbox-actions .primary{border-color:#0A2240;background:#0A2240;color:#fff}
    .inquiry-inbox-actions .primary:hover{background:#123557;color:#fff}
    @media(max-width:760px){.inquiry-inbox-bar{bottom:12px;width:calc(100vw - 24px);gap:9px;padding-left:9px}.inquiry-inbox-mark{width:32px;height:32px;flex-basis:32px}.inquiry-inbox-copy span{max-width:42vw}.inquiry-inbox-actions button{padding:0 9px}.inquiry-inbox-actions .dismiss{display:none}}
  `;
  document.head.appendChild(style);
}

function ensureInboxBar() {
  let bar = $('#inquiryInboxBar');
  if (bar) return bar;

  bar = document.createElement('aside');
  bar.id = 'inquiryInboxBar';
  bar.className = 'inquiry-inbox-bar';
  bar.setAttribute('aria-live', 'polite');
  bar.innerHTML = `
    <span class="inquiry-inbox-mark" aria-hidden="true">IN</span>
    <div class="inquiry-inbox-copy">
      <strong id="inquiryInboxTitle">새 문의가 있습니다.</strong>
      <span id="inquiryInboxMeta">확인이 필요한 신규 문의</span>
    </div>
    <div class="inquiry-inbox-actions">
      <button type="button" class="dismiss" id="inquiryInboxDismiss">잠시 숨김</button>
      <button type="button" class="primary" id="inquiryInboxOpen">확인하기</button>
    </div>
  `;
  document.body.appendChild(bar);
  return bar;
}

function renderInboxNotice(all) {
  const bar = ensureInboxBar();
  const newRows = all.filter((row) => statusLabel(row) === '신규');

  if (!newRows.length) {
    bar.classList.remove('show');
    bar.dataset.requestType = '';
    bar.dataset.requestId = '';
    return;
  }

  const newest = newRows[0];
  const title = $('#inquiryInboxTitle');
  const meta = $('#inquiryInboxMeta');
  const openButton = $('#inquiryInboxOpen');
  const dismissButton = $('#inquiryInboxDismiss');

  if (title) title.textContent = `확인하지 않은 새 문의 ${newRows.length}건이 있습니다.`;
  if (meta) meta.textContent = `최근 ${typeLabel(newest.type)} 문의 · ${requestTitle(newest)} · ${formatDate(newest.createdAtClient)}`;

  bar.dataset.requestType = newest.type || '';
  bar.dataset.requestId = newest.id || '';
  bar.classList.add('show');

  if (openButton) {
    openButton.onclick = () => {
      if (bar.dataset.requestType && bar.dataset.requestId) {
        openRequest(bar.dataset.requestType, bar.dataset.requestId);
      }
    };
  }

  if (dismissButton) {
    dismissButton.onclick = () => {
      bar.classList.remove('show');
      window.setTimeout(() => {
        if ($('#inquiryInboxBar')?.dataset.requestId === newest.id) bar.classList.add('show');
      }, 10 * 60 * 1000);
    };
  }
}

function updateSoundButton() {
  const button = $('#soundAlertToggle');
  if (!button) return;
  button.dataset.enabled = soundEnabled ? 'true' : 'false';
  button.dataset.ready = audioUnlocked ? 'true' : 'false';
  if (!soundEnabled) {
    button.textContent = '알림음 꺼짐';
  } else if (audioUnlocked) {
    button.textContent = '알림음 켜짐';
  } else {
    button.textContent = '알림음 켜기';
  }
}

async function unlockAudio(force = false) {
  if (!soundEnabled && !force) return false;
  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') await audioContext.resume();
    audioUnlocked = audioContext.state === 'running';
    updateSoundButton();
    return audioUnlocked;
  } catch (error) {
    console.warn('Admin alert audio could not be enabled:', error);
    audioUnlocked = false;
    updateSoundButton();
    return false;
  }
}

function scheduleTone(ctx, startAt, frequency, duration, volume = 0.065) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.03);
}

async function playTripleDingDong(force = false) {
  if (!soundEnabled && !force) return false;
  const ready = audioUnlocked || await unlockAudio(force);
  if (!ready || !audioContext) {
    showLiveToast('알림음을 들으려면 화면을 한 번 클릭한 뒤 다시 테스트해주세요.', 'warning');
    return false;
  }

  const base = audioContext.currentTime + 0.04;
  for (let i = 0; i < 3; i += 1) {
    const at = base + i * 0.72;
    scheduleTone(audioContext, at, 880, 0.22, 0.07);
    scheduleTone(audioContext, at + 0.24, 659.25, 0.30, 0.075);
  }
  return true;
}

function showLiveToast(message, state = 'ok') {
  let toast = $('#inquiryLiveToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'inquiryLiveToast';
    toast.className = 'inquiry-live-toast';
    document.body.appendChild(toast);
  }
  toast.dataset.state = state;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toast._hideTimer);
  toast._hideTimer = window.setTimeout(() => toast.classList.remove('show'), 5000);
}

function openRequest(type, id) {
  const navButton = document.querySelector(`[data-type="${type}"]`);
  if (!navButton) return;
  navButton.click();
  window.setTimeout(() => {
    const row = [...document.querySelectorAll('.request-row')].find((item) => item.dataset.id === id);
    if (row) {
      row.click();
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 80);
}

function renderOverview(groups) {
  const all = TYPES.flatMap((type) => (groups[type] || []).map((row) => ({ ...row, type: row.type || type })))
    .sort((a, b) => safeDate(b.createdAtClient) - safeDate(a.createdAtClient));

  const counts = {
    all: all.length,
    quote: groups.quote?.length || 0,
    sample: groups.sample?.length || 0,
    inquiry: groups.inquiry?.length || 0
  };

  const countTargets = {
    all: ['overviewAllCount', 'navAllCount'],
    quote: ['overviewQuoteCount'],
    sample: ['overviewSampleCount'],
    inquiry: ['overviewInquiryCount']
  };
  Object.entries(countTargets).forEach(([key, ids]) => ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = counts[key];
  }));

  const recent = $('#overviewRecentList');
  if (recent) {
    const rows = all.slice(0, 6);
    recent.innerHTML = rows.length ? rows.map((row) => `
      <button type="button" class="overview-recent-row" data-overview-request-type="${escapeHtml(row.type)}" data-overview-request-id="${escapeHtml(row.id)}">
        <span class="overview-type-badge" data-request-type="${escapeHtml(row.type)}">${typeLabel(row.type)}</span>
        <span class="overview-recent-copy"><strong>${escapeHtml(requestTitle(row))}</strong><small>${escapeHtml(row.company || '-')}${row.name ? ` · ${escapeHtml(row.name)}` : ''}</small></span>
        <span class="status" data-status-name="${escapeHtml(statusLabel(row))}">${escapeHtml(statusLabel(row))}</span>
        <time>${formatDate(row.createdAtClient)}</time>
      </button>`).join('') : '<div class="overview-empty">아직 접수된 문의가 없습니다.</div>';

    recent.querySelectorAll('[data-overview-request-id]').forEach((button) => {
      button.addEventListener('click', () => openRequest(button.dataset.overviewRequestType, button.dataset.overviewRequestId));
    });
  }

  renderInboxNotice(all);

  const updated = $('#overviewUpdatedAt');
  if (updated) {
    const now = new Date();
    updated.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 동기화`;
  }
}

async function refreshOverview() {
  try {
    const [quote, sample, inquiry] = await Promise.all(TYPES.map((type) => fetchAdminRequests(type)));
    renderOverview({ quote, sample, inquiry });
  } catch (error) {
    console.error('Overview refresh failed:', error);
    const recent = $('#overviewRecentList');
    if (recent) recent.innerHTML = '<div class="overview-empty">전체 문의 현황을 불러오지 못했습니다.</div>';
  }
}

function queueOverviewRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(refreshOverview, 180);
}

function startRealtimeWatch() {
  TYPES.forEach((type) => {
    let initialized = false;
    onSnapshot(collection(db, COLLECTIONS[type]), (snapshot) => {
      if (!initialized) {
        initialized = true;
        return;
      }

      const changes = snapshot.docChanges();
      if (changes.length) queueOverviewRefresh();

      const added = changes.filter((change) => change.type === 'added' && change.doc.data()?.deleted !== true);
      if (!added.length) return;

      playTripleDingDong();
      const newest = added[added.length - 1].doc.data();

      const originalTitle = document.title.replace(/^🔔\s*/, '');
      document.title = `🔔 새 ${typeLabel(type)} 문의 · ${originalTitle}`;
      window.setTimeout(() => {
        if (document.title.startsWith('🔔')) document.title = originalTitle;
      }, 12000);

      if (!audioUnlocked && soundEnabled) {
        showLiveToast(`새 ${typeLabel(type)} 문의가 들어왔습니다. 알림음을 사용하려면 화면을 한 번 클릭해주세요.`, 'warning');
      }

      if (newest?.name) console.info(`New ${typeLabel(type)} inquiry:`, newest.name);
    }, (error) => console.warn(`Realtime watch failed: ${type}`, error));
  });
}

function bindOverviewCards() {
  document.querySelectorAll('[data-overview-type]').forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.overviewType;
      if (type === 'all') {
        $('#overviewRecentList')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      document.querySelector(`[data-type="${type}"]`)?.click();
      document.querySelector('.admin-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function ensureSoundTestButton() {
  if ($('#soundAlertTest')) return $('#soundAlertTest');
  const soundButton = $('#soundAlertToggle');
  if (!soundButton) return null;

  const testButton = document.createElement('button');
  testButton.className = 'admin-btn';
  testButton.id = 'soundAlertTest';
  testButton.type = 'button';
  testButton.textContent = '알림음 테스트';
  soundButton.insertAdjacentElement('afterend', testButton);
  return testButton;
}

function bindSoundControls() {
  updateSoundButton();

  const soundButton = $('#soundAlertToggle');
  const testButton = ensureSoundTestButton();

  soundButton?.addEventListener('pointerdown', (event) => event.stopPropagation());
  soundButton?.addEventListener('click', async () => {
    if (!soundEnabled) {
      soundEnabled = true;
      localStorage.setItem(SOUND_PREF_KEY, 'true');
      await unlockAudio();
      showLiveToast(audioUnlocked ? '새 문의 알림음이 켜졌습니다.' : '화면을 한 번 클릭하면 알림음이 활성화됩니다.');
      updateSoundButton();
      return;
    }

    if (!audioUnlocked) {
      localStorage.setItem(SOUND_PREF_KEY, 'true');
      await unlockAudio();
      showLiveToast(audioUnlocked ? '새 문의 알림음이 켜졌습니다.' : '화면을 한 번 클릭하면 알림음이 활성화됩니다.');
      updateSoundButton();
      return;
    }

    soundEnabled = false;
    localStorage.setItem(SOUND_PREF_KEY, 'false');
    showLiveToast('새 문의 알림음을 껐습니다.');
    updateSoundButton();
  });

  testButton?.addEventListener('pointerdown', (event) => event.stopPropagation());
  testButton?.addEventListener('click', async () => {
    testButton.disabled = true;
    testButton.textContent = '테스트 중…';
    const played = await playTripleDingDong(true);
    if (played) showLiveToast('테스트 알림음이 3회 재생됩니다.');
    window.setTimeout(() => {
      testButton.disabled = false;
      testButton.textContent = '알림음 테스트';
    }, 2400);
  });

  const gestureUnlock = (event) => {
    if (event?.target?.closest?.('#soundAlertToggle, #soundAlertTest')) return;
    if (soundEnabled && !audioUnlocked) unlockAudio();
  };
  window.addEventListener('pointerdown', gestureUnlock, { passive: true });
  window.addEventListener('keydown', gestureUnlock);
}

document.addEventListener('DOMContentLoaded', async () => {
  ensureEnhancementStyles();
  ensureInboxBar();
  bindOverviewCards();
  bindSoundControls();
  await refreshOverview();
  startRealtimeWatch();
});