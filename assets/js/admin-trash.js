import {
  fetchTrashRequests,
  moveRequestToTrash,
  restoreRequestFromTrash
} from './firebase-client.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const TYPE_LABELS = {
  quote: '견적문의',
  sample: '샘플문의',
  inquiry: '제작문의'
};
const LABEL_TYPES = {
  '견적문의': 'quote',
  '샘플문의': 'sample',
  '제작문의': 'inquiry'
};

const state = {
  rows: [],
  selected: null,
  query: '',
  active: false,
  loading: false
};

function val(v) {
  return v === undefined || v === null || v === '' ? '-' : Array.isArray(v) ? v.join(', ') : String(v);
}

function esc(v) {
  return val(v).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

function fmtDate(v) {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function requestTitle(r) {
  return r?.spec?.title || r?.spec?.product || r?.company || r?.name || TYPE_LABELS[r?.type] || '문의';
}

function detailFields(r) {
  const s = r?.spec || {};
  if (r?.type === 'quote') {
    return [
      ['제품', s.product], ['수량', s.qty], ['사이즈', s.size], ['종이', s.paper],
      ['평량', s.gsm ? `${s.gsm}gsm` : ''], ['인쇄 방식', s.printMethod],
      ['인쇄 색상', s.printColor], ['인쇄 면', s.printSide], ['코팅', s.coating],
      ['후가공', s.finishes], ['내부 구성', s.insert]
    ];
  }
  if (r?.type === 'sample') {
    return [
      ['제품', s.product], ['수량', s.qty], ['사이즈', s.size], ['종이', s.paper],
      ['평량', s.gsm ? `${s.gsm}gsm` : ''], ['인쇄', s.print], ['후가공', s.finish]
    ];
  }
  return [['문의 유형', s.inquiryType], ['예상 수량', s.qty], ['문의 제목', s.title]];
}

function compositeId(row) {
  return `${row.type}:${row.id}`;
}

function ensureTrashNav() {
  let button = $('#navTrash');
  if (button) return button;
  const nav = $('.admin-nav');
  if (!nav) return null;
  button = document.createElement('button');
  button.type = 'button';
  button.id = 'navTrash';
  button.className = 'trash-nav';
  button.innerHTML = '<span>휴지통</span><b id="navTrashCount">0</b>';
  const portfolioLink = nav.querySelector('a[href="admin-portfolio.html"]');
  if (portfolioLink) nav.insertBefore(button, portfolioLink);
  else nav.appendChild(button);
  return button;
}

function ensureTrashPanel() {
  let panel = $('#trashPanel');
  if (panel) return panel;
  const main = $('.admin-main');
  if (!main) return null;
  panel = document.createElement('section');
  panel.id = 'trashPanel';
  panel.className = 'trash-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="trash-head">
      <div><small>REQUEST ARCHIVE</small><h2>휴지통</h2><p>삭제한 문의는 Firestore에 그대로 보관됩니다. 필요할 때 다시 복원할 수 있습니다.</p></div>
      <button class="admin-btn" id="refreshTrash" type="button">휴지통 새로고침</button>
    </div>
    <div class="trash-layout">
      <div class="trash-list-wrap">
        <div class="trash-toolbar"><div><h3>삭제된 문의 <span class="trash-count" id="trashCount">0건</span></h3></div></div>
        <div class="trash-search"><input id="trashSearch" type="search" placeholder="회사명, 담당자, 제품명 검색"></div>
        <div class="trash-list" id="trashList"><div class="trash-loading">휴지통을 불러오는 중입니다.</div></div>
      </div>
      <aside class="trash-detail" id="trashDetail"><div class="trash-empty">삭제된 문의를 선택하면<br>상세 내용이 표시됩니다.</div></aside>
    </div>`;
  main.appendChild(panel);
  return panel;
}

function setNormalSectionsHidden(hidden) {
  ['.visitor-panel', '.admin-stats', '.admin-workflow', '.admin-content'].forEach((selector) => {
    const el = $(selector);
    if (el) el.hidden = hidden;
  });
}

function setTopCopy(trashMode) {
  const title = $('.admin-top h1');
  const desc = $('.admin-top p');
  if (title) title.textContent = trashMode ? '휴지통' : '문의 관리';
  if (desc) desc.textContent = trashMode
    ? '삭제한 견적·샘플·제작문의를 보관하고 필요할 때 다시 복원합니다.'
    : 'Firestore에 저장된 문의와 사이트 방문 현황을 함께 관리합니다.';
}

function enterTrash() {
  state.active = true;
  const nav = $('#navTrash');
  nav?.classList.add('active');
  $$('[data-type]').forEach((button) => button.classList.remove('active'));
  setNormalSectionsHidden(true);
  const panel = ensureTrashPanel();
  if (panel) panel.hidden = false;
  setTopCopy(true);
  loadTrash();
}

function exitTrash() {
  if (!state.active) return;
  state.active = false;
  $('#navTrash')?.classList.remove('active');
  setNormalSectionsHidden(false);
  const panel = $('#trashPanel');
  if (panel) panel.hidden = true;
  setTopCopy(false);
}

function filteredRows() {
  const q = state.query.trim().toLowerCase();
  if (!q) return state.rows;
  return state.rows.filter((row) => {
    const s = row.spec || {};
    return [row.id, row.company, row.name, row.phone, row.email, row.message, s.title, s.product, s.inquiryType, s.qty]
      .filter(Boolean).join(' ').toLowerCase().includes(q);
  });
}

function renderTrashList() {
  const wrap = $('#trashList');
  if (!wrap) return;
  const rows = filteredRows();
  $('#trashCount').textContent = `${rows.length}건`;
  const selectedExists = rows.some((row) => compositeId(row) === state.selected);
  if (!selectedExists) state.selected = rows[0] ? compositeId(rows[0]) : null;

  if (!rows.length) {
    wrap.innerHTML = '<div class="trash-list-empty">휴지통이 비어 있습니다.<br><small>삭제한 문의가 이곳에 보관됩니다.</small></div>';
    renderTrashDetail();
    return;
  }

  wrap.innerHTML = rows.map((row) => {
    const key = compositeId(row);
    return `<div class="trash-row ${state.selected === key ? 'active' : ''}" data-trash-key="${esc(key)}">
      <span class="trash-type">${esc(TYPE_LABELS[row.type] || row.type)}</span>
      <div class="trash-main"><strong>${esc(requestTitle(row))}</strong><small>${esc(row.company)} · ${esc(row.name)} · 삭제 전 ${esc(row.deletedFromStatus || row.status || '신규')}</small></div>
      <time>${fmtDate(row.deletedAtClient)}</time>
    </div>`;
  }).join('');

  $$('.trash-row', wrap).forEach((row) => {
    row.addEventListener('click', () => {
      state.selected = row.dataset.trashKey;
      renderTrashList();
      renderTrashDetail();
    });
  });
  renderTrashDetail();
}

function selectedRow() {
  return state.rows.find((row) => compositeId(row) === state.selected) || null;
}

function renderTrashDetail() {
  const wrap = $('#trashDetail');
  if (!wrap) return;
  const r = selectedRow();
  if (!r) {
    wrap.innerHTML = '<div class="trash-empty">삭제된 문의를 선택하면<br>상세 내용이 표시됩니다.</div>';
    return;
  }

  const fields = detailFields(r);
  wrap.innerHTML = `
    <div class="trash-detail-head">
      <div><small>${esc(r.id)} · ${esc(TYPE_LABELS[r.type])}</small><h2>${esc(requestTitle(r))}</h2><p>삭제일 ${fmtDate(r.deletedAtClient)} · 원래 상태 ${esc(r.deletedFromStatus || r.status || '신규')}</p></div>
      <div class="trash-detail-actions"><button class="admin-btn primary" id="restoreTrashRequest" type="button">복원하기</button></div>
    </div>
    <div class="trash-section"><h3>고객 정보</h3><div class="trash-grid">
      <div class="trash-field"><span>회사 / 브랜드</span><strong>${esc(r.company)}</strong></div>
      <div class="trash-field"><span>담당자</span><strong>${esc(r.name)}</strong></div>
      <div class="trash-field"><span>연락처</span><strong>${esc(r.phone)}</strong></div>
      <div class="trash-field"><span>이메일</span><strong>${esc(r.email)}</strong></div>
    </div></div>
    <div class="trash-section"><h3>${r.type === 'inquiry' ? '문의 정보' : '제작 사양'}</h3><div class="trash-grid">
      ${fields.map(([key, value]) => `<div class="trash-field"><span>${esc(key)}</span><strong>${esc(value)}</strong></div>`).join('')}
    </div></div>
    <div class="trash-section"><h3>요청사항</h3><div class="trash-message">${esc(r.message)}</div><div class="trash-note">휴지통에서는 실제 문서를 지우지 않습니다. 복원하면 원래 문의 목록에 다시 표시됩니다.</div></div>`;

  $('#restoreTrashRequest')?.addEventListener('click', async () => {
    const ok = window.confirm('이 문의를 원래 목록으로 복원할까요?');
    if (!ok) return;
    const button = $('#restoreTrashRequest');
    button.disabled = true;
    button.textContent = '복원 중…';
    try {
      await restoreRequestFromTrash(r.type, r.id);
      window.alert('문의가 복원되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error(error);
      button.disabled = false;
      button.textContent = '복원하기';
      window.alert('복원에 실패했습니다. Firestore Rules를 확인해주세요.');
    }
  });
}

async function loadTrash() {
  if (state.loading) return;
  state.loading = true;
  const wrap = $('#trashList');
  if (wrap) wrap.innerHTML = '<div class="trash-loading">휴지통을 불러오는 중입니다.</div>';
  try {
    state.rows = await fetchTrashRequests();
    const count = $('#navTrashCount');
    if (count) count.textContent = state.rows.length;
    renderTrashList();
  } catch (error) {
    console.error(error);
    if (wrap) wrap.innerHTML = '<div class="trash-list-empty">휴지통을 불러오지 못했습니다.<br><small>새 Firestore Rules를 게시해주세요.</small></div>';
  } finally {
    state.loading = false;
  }
}

function parseCurrentRequest() {
  const detail = $('#requestDetail');
  if (!detail || state.active) return null;
  const meta = detail.querySelector('.detail-head-copy > small');
  if (!meta) return null;
  const text = String(meta.textContent || '');
  const parts = text.split(' · ');
  if (parts.length < 2) return null;
  const id = parts[0].trim();
  const type = LABEL_TYPES[parts[1].trim()];
  const status = detail.querySelector('.status')?.textContent?.trim() || '';
  if (!id || !type) return null;
  return { id, type, status };
}

function injectTrashButton() {
  if (state.active) return;
  const actions = $('#requestDetail .detail-actions');
  if (!actions || actions.querySelector('#trashRequest')) return;
  const current = parseCurrentRequest();
  if (!current) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'trashRequest';
  button.className = 'admin-btn danger';
  button.textContent = '삭제';
  button.addEventListener('click', async () => {
    const ok = window.confirm('이 문의를 삭제하고 휴지통으로 이동할까요?\n휴지통에서 다시 복원할 수 있습니다.');
    if (!ok) return;
    button.disabled = true;
    button.textContent = '이동 중…';
    try {
      await moveRequestToTrash(current.type, current.id, current.status);
      window.alert('문의가 휴지통으로 이동되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error(error);
      button.disabled = false;
      button.textContent = '삭제';
      window.alert('휴지통 이동에 실패했습니다. 새 Firestore Rules를 게시해주세요.');
    }
  });
  actions.appendChild(button);
}

function observeDetail() {
  const detail = $('#requestDetail');
  if (!detail) return;
  const observer = new MutationObserver(() => injectTrashButton());
  observer.observe(detail, { childList: true, subtree: true });
  injectTrashButton();
}

function init() {
  const nav = ensureTrashNav();
  ensureTrashPanel();
  nav?.addEventListener('click', enterTrash);
  $$('[data-type]').forEach((button) => button.addEventListener('click', exitTrash));
  $('#refreshTrash')?.addEventListener('click', loadTrash);
  $('#trashSearch')?.addEventListener('input', (event) => {
    state.query = event.target.value;
    state.selected = null;
    renderTrashList();
  });
  observeDetail();
  loadTrash();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();