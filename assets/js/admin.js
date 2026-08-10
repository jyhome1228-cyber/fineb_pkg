import {
  ADMIN_EMAIL,
  observeAdminAuth,
  signInAdmin,
  signOutAdmin,
  fetchAdminRequests,
  updateAdminRequest,
  importLegacyRequestIfMissing
} from './firebase-client.js';

const LOCAL_KEYS = {
  quote: 'fineb_quote_requests',
  sample: 'fineb_sample_requests',
  inquiry: 'fineb_inquiry_requests'
};
const MIGRATION_KEY = 'fineb_firestore_admin_migration_v2';
const STATUSES = ['신규', '확인중', '진행중', '견적완료', '완료', '보류'];
const TYPES = ['quote', 'sample', 'inquiry'];
const adminState = {
  type: 'quote',
  status: 'all',
  query: '',
  selected: null,
  data: { quote: [], sample: [], inquiry: [] },
  loading: false
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function labelType(type) {
  return type === 'quote' ? '견적문의' : type === 'sample' ? '샘플문의' : '제작문의';
}

function fmtDate(v) {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function val(v) {
  return v === undefined || v === null || v === '' ? '-' : Array.isArray(v) ? v.join(', ') : String(v);
}

function esc(v) {
  return val(v).replace(/[&<>'"]/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[m]);
}

function requestTitle(r) {
  return r.spec?.title || r.spec?.product || r.company || r.name || labelType(r.type);
}

function requestStatus(r) {
  return r.status || '신규';
}

function allRequests() {
  return Object.values(adminState.data)
    .flat()
    .sort((a, b) => new Date(b.createdAtClient || 0) - new Date(a.createdAtClient || 0));
}

function setSyncState(text, state = 'ok') {
  const el = $('#cloudSyncState');
  if (!el) return;
  el.textContent = text;
  el.dataset.state = state;
}

function showLogin(message = '') {
  const login = $('#adminLogin');
  const app = $('#adminApp');
  if (login) login.hidden = false;
  if (app) app.hidden = true;
  const msg = $('#adminLoginMessage');
  if (msg) msg.textContent = message;
}

function showAdmin(user) {
  const login = $('#adminLogin');
  const app = $('#adminApp');
  if (login) login.hidden = true;
  if (app) app.hidden = false;
  const email = $('#adminAccountEmail');
  if (email) email.textContent = user?.email || ADMIN_EMAIL;
}

function authErrorMessage(error) {
  const code = error?.code || '';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return '이메일 또는 비밀번호가 맞지 않습니다.';
  }
  if (code === 'auth/too-many-requests') return '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.';
  if (code === 'auth/operation-not-allowed') return 'Firebase Authentication에서 이메일/비밀번호 로그인을 활성화해주세요.';
  if (code === 'auth/unauthorized-domain') return 'Firebase Authentication 승인 도메인에 현재 사이트 주소를 추가해주세요.';
  if (code === 'admin/email-not-allowed') return '허용된 관리자 이메일이 아닙니다.';
  return '관리자 로그인에 실패했습니다. Firebase Authentication 설정을 확인해주세요.';
}

function firestoreErrorMessage(error) {
  const code = error?.code || '';
  if (code === 'permission-denied') return 'Firestore 보안 규칙이 아직 반영되지 않았습니다. rules 배포 상태를 확인해주세요.';
  if (code === 'unavailable') return '네트워크 연결이 불안정합니다. 연결 후 새로고침해주세요.';
  if (code === 'failed-precondition') return 'Firestore 조회 설정을 확인해주세요.';
  return 'Firestore 데이터를 불러오지 못했습니다.';
}

function loadLegacyList(type) {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_KEYS[type]) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function migrateLegacyLocalOnce() {
  if (localStorage.getItem(MIGRATION_KEY)) return 0;

  let migrated = 0;
  let failed = 0;

  for (const type of TYPES) {
    const list = loadLegacyList(type).slice(0, 300);
    for (const item of list) {
      if (!item?.id) continue;
      try {
        const created = await importLegacyRequestIfMissing(type, item);
        if (created) migrated += 1;
      } catch (error) {
        failed += 1;
        console.warn('Legacy request migration failed:', type, item?.id, error);
      }
    }
  }

  if (failed === 0) {
    localStorage.setItem(MIGRATION_KEY, new Date().toISOString());
  }
  return migrated;
}

async function loadAll() {
  if (adminState.loading) return;
  adminState.loading = true;
  setSyncState('Firestore 동기화 중…', 'loading');

  try {
    const [quotes, samples, inquiries] = await Promise.all([
      fetchAdminRequests('quote'),
      fetchAdminRequests('sample'),
      fetchAdminRequests('inquiry')
    ]);

    adminState.data.quote = quotes;
    adminState.data.sample = samples;
    adminState.data.inquiry = inquiries;

    renderStats();
    renderWorkflowCounts();
    renderList();
    renderDetail();
    setSyncState(`Firestore 연결됨 · ${allRequests().length}건`, 'ok');
  } catch (error) {
    console.error(error);
    setSyncState('Firestore 연결 오류', 'error');
    const wrap = $('#requestList');
    if (wrap) {
      wrap.innerHTML = `<div class="empty-state">${esc(firestoreErrorMessage(error))}<br><small>브라우저 localStorage가 아닌 Firestore가 원본 데이터입니다.</small></div>`;
    }
  } finally {
    adminState.loading = false;
  }
}

function countStatus(list, status) {
  return list.filter((r) => requestStatus(r) === status).length;
}

function renderStats() {
  const all = allRequests();
  $('#statAll').textContent = all.length;
  $('#statNew').textContent = countStatus(all, '신규');
  $('#statCheck').textContent = countStatus(all, '확인중');
  $('#statProgress').textContent = countStatus(all, '진행중');
  $('#statQuoted').textContent = countStatus(all, '견적완료');
  $('#statDone').textContent = countStatus(all, '완료');
  $('#navQuoteCount').textContent = adminState.data.quote.length;
  $('#navSampleCount').textContent = adminState.data.sample.length;
  $('#navInquiryCount').textContent = adminState.data.inquiry.length;
}

function renderWorkflowCounts() {
  const list = adminState.data[adminState.type] || [];
  const ids = {
    신규: 'flowNew',
    확인중: 'flowCheck',
    진행중: 'flowProgress',
    견적완료: 'flowQuoted',
    완료: 'flowDone',
    보류: 'flowHold'
  };
  Object.entries(ids).forEach(([status, id]) => {
    const el = $('#' + id);
    if (el) el.textContent = countStatus(list, status);
  });
  $$('[data-guide-status]').forEach((b) => b.classList.toggle('active', adminState.status === b.dataset.guideStatus));
}

function searchableText(r) {
  const s = r.spec || {};
  return [
    r.id,
    r.company,
    r.name,
    r.phone,
    r.email,
    r.message,
    s.product,
    s.title,
    s.inquiryType,
    s.qty,
    s.paper,
    s.size,
    s.printMethod,
    s.printColor,
    s.finish,
    s.finishes
  ].flat().filter(Boolean).join(' ').toLowerCase();
}

function currentList() {
  let list = [...(adminState.data[adminState.type] || [])];
  if (adminState.status !== 'all') list = list.filter((r) => requestStatus(r) === adminState.status);
  const q = adminState.query.trim().toLowerCase();
  if (q) list = list.filter((r) => searchableText(r).includes(q));
  return list.sort((a, b) => new Date(b.createdAtClient || 0) - new Date(a.createdAtClient || 0));
}

function renderList() {
  const list = currentList();
  $('#listTitle').textContent = labelType(adminState.type);
  $('#listCount').textContent = `${list.length}건`;
  const wrap = $('#requestList');

  if (!list.some((r) => r.id === adminState.selected)) adminState.selected = list[0]?.id || null;

  if (!list.length) {
    wrap.innerHTML = '<div class="empty-state">조건에 맞는 문의가 없습니다.<br><small>상태 필터나 검색어를 변경해보세요.</small></div>';
    renderDetail();
    return;
  }

  wrap.innerHTML = list.map((r) => {
    const status = requestStatus(r);
    const s = r.spec || {};
    return `<div class="request-row ${adminState.selected === r.id ? 'active' : ''}" data-id="${esc(r.id)}">
      <span class="status" data-status-name="${esc(status)}">${esc(status)}</span>
      <div class="request-main">
        <strong>${esc(requestTitle(r))}</strong>
        <small>${esc(r.company)} · ${esc(r.name)}</small>
        <small class="request-spec">${esc(s.qty)}${s.paper ? ' · ' + esc(s.paper) : ''}</small>
      </div>
      <time>${fmtDate(r.createdAtClient)}</time>
    </div>`;
  }).join('');

  $$('.request-row').forEach((row) => {
    row.onclick = () => {
      adminState.selected = row.dataset.id;
      renderList();
      renderDetail();
    };
  });
  renderDetail();
}

function findSelected() {
  return (adminState.data[adminState.type] || []).find((r) => r.id === adminState.selected) || null;
}

function detailFields(r) {
  const s = r.spec || {};
  if (r.type === 'quote') {
    return [
      ['제품', s.product],
      ['수량', s.qty],
      ['사이즈', s.size],
      ['종이', s.paper],
      ['평량', s.gsm ? s.gsm + 'gsm' : ''],
      ['인쇄 방식', s.printMethod],
      ['인쇄 색상', s.printColor],
      ['인쇄 면', s.printSide],
      ['코팅', s.coating],
      ['후가공', s.finishes],
      ['내부 구성', s.insert]
    ];
  }
  if (r.type === 'sample') {
    return [
      ['제품', s.product],
      ['수량', s.qty],
      ['사이즈', s.size],
      ['종이', s.paper],
      ['평량', s.gsm ? s.gsm + 'gsm' : ''],
      ['인쇄', s.print],
      ['후가공', s.finish]
    ];
  }
  return [
    ['문의 유형', s.inquiryType],
    ['예상 수량', s.qty],
    ['문의 제목', s.title]
  ];
}

async function setRequestStatus(id, status) {
  if (!STATUSES.includes(status)) return;
  const item = (adminState.data[adminState.type] || []).find((x) => x.id === id);
  if (!item || item.status === status) return;

  const previous = item.status || '신규';
  setSyncState('상태 저장 중…', 'loading');

  try {
    const statusUpdatedAt = new Date().toISOString();
    await updateAdminRequest(adminState.type, id, { status, statusUpdatedAt });
    item.status = status;
    item.statusUpdatedAt = statusUpdatedAt;
    renderStats();
    renderWorkflowCounts();
    renderList();
    setSyncState('Firestore 저장 완료', 'ok');
  } catch (error) {
    console.error(error);
    item.status = previous;
    setSyncState('상태 저장 실패', 'error');
    alert(firestoreErrorMessage(error));
    renderDetail();
  }
}

function renderDetail() {
  const r = findSelected();
  const wrap = $('#requestDetail');
  if (!r) {
    wrap.innerHTML = '<div class="detail-empty">왼쪽 문의를 선택하면<br>상세 내용이 표시됩니다.</div>';
    return;
  }

  const fields = detailFields(r);
  const status = requestStatus(r);
  const phone = val(r.phone).replace(/[^0-9+]/g, '');
  const email = val(r.email);

  wrap.innerHTML = `<div class="detail-head">
    <div class="detail-head-copy">
      <small>${esc(r.id)} · ${labelType(r.type)}</small>
      <div class="detail-title-line"><h2>${esc(requestTitle(r))}</h2><span class="status" data-status-name="${esc(status)}">${esc(status)}</span></div>
      <p>${fmtDate(r.createdAtClient)}</p>
    </div>
    <div class="detail-actions"><button type="button" class="admin-btn" id="pdfRequest">PDF 저장</button></div>
  </div>
  <div class="detail-section"><h3>고객 정보</h3><div class="detail-grid customer-grid">
    <div class="detail-field"><span>회사 / 브랜드</span><strong>${esc(r.company)}</strong></div>
    <div class="detail-field"><span>담당자</span><strong>${esc(r.name)}</strong></div>
    <div class="detail-field"><span>연락처</span><strong>${phone && phone !== '-' ? `<a href="tel:${esc(phone)}">${esc(r.phone)} ↗</a>` : esc(r.phone)}</strong></div>
    <div class="detail-field"><span>이메일</span><strong>${email && email !== '-' ? `<a href="mailto:${esc(email)}">${esc(email)} ↗</a>` : esc(email)}</strong></div>
  </div></div>
  <div class="detail-section"><h3>${r.type === 'inquiry' ? '문의 정보' : '제작 사양'}</h3><div class="detail-grid spec-grid">${fields.map(([k, v]) => `<div class="detail-field"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div></div>
  <div class="detail-section"><h3>요청사항</h3><div class="detail-message">${esc(r.message)}</div></div>
  <div class="detail-section"><h3>파일 안내</h3><div class="detail-message">디자인·도면·참고이미지는 <a href="mailto:whales84@naver.com">whales84@naver.com</a> 으로 수신합니다.</div></div>
  <div class="detail-section status-section">
    <div class="status-section-head"><div><h3>처리 상태</h3><p>변경 내용은 Firestore에 즉시 저장됩니다.</p></div></div>
    <div class="status-actions">${STATUSES.map((v) => `<button type="button" class="status-action ${status === v ? 'active' : ''}" data-set-status="${v}"><b>${v}</b><span>${statusDescription(v)}</span></button>`).join('')}</div>
  </div>`;

  $$('[data-set-status]').forEach((b) => {
    b.onclick = () => setRequestStatus(r.id, b.dataset.setStatus);
  });
  $('#pdfRequest').onclick = () => printRequest(r);
}

function statusDescription(status) {
  return ({
    신규: '미확인',
    확인중: '내용 확인',
    진행중: '상담·견적 작업',
    견적완료: '견적 전달',
    완료: '처리 종료',
    보류: '추가 확인 대기'
  })[status] || '';
}

function printRequest(r) {
  const fields = detailFields(r);
  const title = `FINE.B ${labelType(r.type)} - ${requestTitle(r)}`;
  const rows = fields.map(([k, v]) => `<div class="cell"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('');
  const win = window.open('', '_blank', 'width=960,height=820');
  if (!win) return;

  win.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
  @page{size:A4;margin:14mm}*{box-sizing:border-box}body{font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;color:#15191f;margin:0;font-size:11px}.top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #0A2240;padding-bottom:18px;margin-bottom:22px}.brand{font-size:25px;font-weight:800;color:#0A2240}.type{font-size:10px;letter-spacing:.12em;color:#74808c}.title{font-size:23px;margin:5px 0}.meta{color:#74808c}.badge{display:inline-block;padding:5px 9px;border-radius:999px;background:#eef3f7;color:#0A2240;font-weight:700}.section{margin:22px 0}.section h3{font-size:11px;color:#0A2240;border-bottom:1px solid #dfe5eb;padding-bottom:8px;margin:0 0 10px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-left:1px solid #e1e6eb;border-top:1px solid #e1e6eb}.grid.two{grid-template-columns:repeat(2,1fr)}.cell{min-height:58px;padding:10px 12px;border-right:1px solid #e1e6eb;border-bottom:1px solid #e1e6eb}.cell span{display:block;color:#89939d;font-size:9px;margin-bottom:5px}.cell b{font-size:11px;word-break:break-word}.message{padding:14px;background:#f6f8fa;line-height:1.7;white-space:pre-wrap}.foot{margin-top:30px;padding-top:12px;border-top:1px solid #dfe5eb;color:#78838f;line-height:1.7}.no-print{position:fixed;right:20px;top:20px;background:#0A2240;color:#fff;border:0;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}@media print{.no-print{display:none}}
  </style></head><body><button class="no-print" onclick="window.print()">PDF로 저장</button><div class="top"><div><div class="brand">FINE.B</div><div>PACKAGE DEVELOPMENT & PRODUCTION</div></div><div class="type">${labelType(r.type)} · ${esc(r.id)}</div></div><div><span class="badge">${esc(requestStatus(r))}</span><h1 class="title">${esc(requestTitle(r))}</h1><div class="meta">접수일 ${fmtDate(r.createdAtClient)}</div></div><div class="section"><h3>고객 정보</h3><div class="grid two"><div class="cell"><span>회사 / 브랜드</span><b>${esc(r.company)}</b></div><div class="cell"><span>담당자</span><b>${esc(r.name)}</b></div><div class="cell"><span>연락처</span><b>${esc(r.phone)}</b></div><div class="cell"><span>이메일</span><b>${esc(r.email)}</b></div></div></div><div class="section"><h3>${r.type === 'inquiry' ? '문의 정보' : '제작 사양'}</h3><div class="grid">${rows}</div></div><div class="section"><h3>요청사항</h3><div class="message">${esc(r.message)}</div></div><div class="foot">FINE.B 파인비 · 대표전화 010-4758-7049<br>파일 및 제작 문의 whales84@naver.com</div><script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script></body></html>`);
  win.document.close();
}

function setType(type) {
  adminState.type = type;
  adminState.status = 'all';
  adminState.query = '';
  adminState.selected = null;
  $('#adminSearch').value = '';
  $$('[data-type]').forEach((b) => b.classList.toggle('active', b.dataset.type === type));
  $$('[data-status]').forEach((b) => b.classList.toggle('active', b.dataset.status === 'all'));
  renderWorkflowCounts();
  renderList();
}

function setStatusFilter(status) {
  adminState.status = status;
  adminState.selected = null;
  $$('[data-status]').forEach((b) => b.classList.toggle('active', b.dataset.status === status));
  renderWorkflowCounts();
  renderList();
}

function bindAdminUI() {
  $$('[data-type]').forEach((b) => {
    b.onclick = () => setType(b.dataset.type);
  });
  $$('[data-status]').forEach((b) => {
    b.onclick = () => setStatusFilter(b.dataset.status);
  });
  $$('[data-guide-status]').forEach((b) => {
    b.onclick = () => setStatusFilter(b.dataset.guideStatus);
  });
  $('#adminSearch')?.addEventListener('input', (e) => {
    adminState.query = e.target.value;
    adminState.selected = null;
    renderList();
  });
  $('#clearSearch').onclick = () => {
    adminState.query = '';
    $('#adminSearch').value = '';
    renderList();
  };
  $('#refreshAdmin').onclick = () => loadAll();
  $('#adminLogout').onclick = () => signOutAdmin();
}

function bindLoginUI() {
  const form = $('#adminLoginForm');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = $('#adminEmail').value.trim();
    const password = $('#adminPassword').value;
    const button = $('#adminLoginButton');
    const message = $('#adminLoginMessage');

    button.disabled = true;
    button.textContent = '로그인 중…';
    message.textContent = '';

    try {
      await signInAdmin(email, password);
      $('#adminPassword').value = '';
    } catch (error) {
      console.error(error);
      message.textContent = authErrorMessage(error);
    } finally {
      button.disabled = false;
      button.textContent = '관리자 로그인';
    }
  });
}

async function handleAuthenticatedUser(user) {
  const email = String(user?.email || '').toLowerCase();
  if (email !== ADMIN_EMAIL) {
    await signOutAdmin();
    showLogin('허용되지 않은 관리자 계정입니다.');
    return;
  }

  showAdmin(user);
  setSyncState('기존 데이터 확인 중…', 'loading');

  try {
    const migrated = await migrateLegacyLocalOnce();
    await loadAll();
    if (migrated > 0) setSyncState(`Firestore 연결됨 · 기존 ${migrated}건 복구`, 'ok');
  } catch (error) {
    console.error(error);
    setSyncState('Firestore 연결 오류', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  bindAdminUI();
  bindLoginUI();
  $('#adminEmail').value = ADMIN_EMAIL;

  observeAdminAuth((user) => {
    if (!user) {
      showLogin();
      return;
    }
    handleAuthenticatedUser(user);
  });
});
