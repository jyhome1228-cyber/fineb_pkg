import {
  makePortfolioId,
  uploadPortfolioImage,
  createPortfolioProject,
  fetchPortfolioProjects
} from './firebase-client.js';

const CATEGORY = {
  paper: { label: '단상자', kicker: 'PAPER BOX', type: '단상자 · 패키지' },
  gift: { label: '선물박스', kicker: 'GIFT PACKAGE', type: '선물 패키지' },
  rigid: { label: '싸바리', kicker: 'RIGID BOX', type: '싸바리 · 선물박스' },
  special: { label: '슬리브·특수구조', kicker: 'SPECIAL STRUCTURE', type: '특수구조 패키지' }
};

const state = {
  files: [],
  legacy: [],
  cms: [],
  query: '',
  busy: false
};

const $ = (s) => document.querySelector(s);

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

function setSync(text, status = 'ok') {
  const el = $('#portfolioSync');
  if (!el) return;
  el.textContent = text;
  el.dataset.state = status;
}

function setProgress(percent, text) {
  const value = Math.max(0, Math.min(100, Number(percent) || 0));
  $('#portfolioProgressBar').style.width = `${value}%`;
  if (text) $('#portfolioUploadStatus').firstChild.textContent = text;
}

function cleanLegacyProject(project = {}, index = 0) {
  return {
    id: `legacy-${index}`,
    title: project.title || '포트폴리오',
    cat: project.cat || 'paper',
    kicker: project.kicker || CATEGORY[project.cat]?.kicker || 'PACKAGE',
    type: project.type || '',
    feature: project.feature || '',
    usage: project.usage || '',
    images: Array.isArray(project.images) ? project.images.filter(Boolean) : [],
    source: 'legacy'
  };
}

async function loadLegacyProjects() {
  try {
    const response = await fetch(`assets/js/portfolio.js?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('LEGACY_FETCH');
    const text = await response.text();
    const marker = 'const projects=';
    const markerPos = text.indexOf(marker);
    if (markerPos < 0) return [];
    const start = text.indexOf('[', markerPos + marker.length);
    const end = text.indexOf('];', start);
    if (start < 0 || end < 0) return [];
    const parsed = JSON.parse(text.slice(start, end + 1));
    return parsed.map(cleanLegacyProject);
  } catch (error) {
    console.warn('기존 포트폴리오를 읽지 못했습니다.', error);
    return [];
  }
}

async function loadAll() {
  setSync('포트폴리오 동기화 중…', 'loading');
  try {
    const [legacy, cms] = await Promise.all([
      loadLegacyProjects(),
      fetchPortfolioProjects()
    ]);
    state.legacy = legacy;
    state.cms = cms;
    renderStats();
    renderList();
    setSync(`연결됨 · 총 ${legacy.length + cms.length}건`, 'ok');
  } catch (error) {
    console.error(error);
    setSync('Firestore 연결 오류', 'error');
    $('#portfolioAdminList').innerHTML = '<div class="pa-empty">포트폴리오 데이터를 불러오지 못했습니다.<br>Firestore Rules 적용 상태를 확인해주세요.</div>';
  }
}

function renderStats() {
  const all = [...state.cms, ...state.legacy];
  const imageCount = all.reduce((sum, item) => sum + (Array.isArray(item.images) ? item.images.length : 0), 0);
  $('#statPortfolioAll').textContent = all.length;
  $('#statPortfolioLegacy').textContent = state.legacy.length;
  $('#statPortfolioCms').textContent = state.cms.length;
  $('#statPortfolioImages').textContent = imageCount;
}

function renderList() {
  const wrap = $('#portfolioAdminList');
  const q = state.query.trim().toLowerCase();
  let all = [
    ...state.cms.map((item) => ({ ...item, source: 'cms' })),
    ...state.legacy
  ];
  if (q) {
    all = all.filter((item) => [item.title, item.type, item.feature, item.usage, CATEGORY[item.cat]?.label]
      .filter(Boolean).join(' ').toLowerCase().includes(q));
  }

  if (!all.length) {
    wrap.innerHTML = '<div class="pa-empty">조건에 맞는 포트폴리오가 없습니다.</div>';
    return;
  }

  wrap.innerHTML = all.map((item) => {
    const image = item.images?.[0] || '';
    const sourceLabel = item.source === 'cms' ? 'CMS · 노출중' : '기존 등록';
    const sourceClass = item.source === 'cms' ? '' : 'legacy';
    const summary = [CATEGORY[item.cat]?.label, item.type].filter(Boolean).join(' · ');
    return `<article class="pa-project">
      <div class="pa-project-image">${image ? `<img src="${esc(image)}" alt="${esc(item.title)}" loading="lazy">` : ''}</div>
      <div class="pa-project-copy">
        <div class="pa-project-meta"><span class="pa-badge ${sourceClass}">${esc(sourceLabel)}</span><small>${item.images?.length || 0} PHOTOS</small></div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(summary || item.feature || '패키지 제작 사례')}</p>
      </div>
    </article>`;
  }).join('');
}

function addFiles(fileList) {
  const incoming = [...fileList].filter((file) => String(file.type || '').startsWith('image/'));
  for (const file of incoming) {
    if (state.files.length >= 20) break;
    if (file.size > 15 * 1024 * 1024) {
      alert(`${file.name} 파일은 15MB를 초과해 제외했습니다.`);
      continue;
    }
    const duplicate = state.files.some((item) => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified);
    if (duplicate) continue;
    state.files.push({ file, preview: URL.createObjectURL(file) });
  }
  renderPreview();
}

function renderPreview() {
  const wrap = $('#portfolioPreview');
  if (!state.files.length) {
    wrap.innerHTML = '';
    setProgress(0, '이미지를 선택해주세요.');
    return;
  }

  wrap.innerHTML = state.files.map((item, index) => `<div class="pa-preview-item ${index === 0 ? 'cover' : ''}" data-preview-index="${index}">
    <img src="${item.preview}" alt="업로드 이미지 ${index + 1}">
    ${index === 0 ? '<span class="pa-preview-label">대표</span>' : ''}
    <button class="pa-preview-remove" type="button" data-remove-image="${index}" aria-label="이미지 제거">×</button>
    ${index > 0 ? `<button class="pa-preview-cover" type="button" data-cover-image="${index}">대표로 설정</button>` : ''}
  </div>`).join('');

  wrap.querySelectorAll('[data-remove-image]').forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.removeImage);
    const [removed] = state.files.splice(index, 1);
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    renderPreview();
  }));

  wrap.querySelectorAll('[data-cover-image]').forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.coverImage);
    const [selected] = state.files.splice(index, 1);
    if (selected) state.files.unshift(selected);
    renderPreview();
  }));

  setProgress(0, `${state.files.length}장 선택됨 · 첫 번째 이미지가 대표 이미지입니다.`);
}

function resetForm() {
  state.files.forEach((item) => { if (item.preview) URL.revokeObjectURL(item.preview); });
  state.files = [];
  $('#portfolioForm').reset();
  $('#portfolioCat').value = 'paper';
  $('#portfolioType').value = CATEGORY.paper.type;
  renderPreview();
}

async function submitPortfolio(event) {
  event.preventDefault();
  if (state.busy) return;

  const cat = $('#portfolioCat').value;
  const title = $('#portfolioTitle').value.trim();
  if (!title) return alert('프로젝트명을 입력해주세요.');
  if (!state.files.length) return alert('포트폴리오 이미지를 1장 이상 선택해주세요.');

  state.busy = true;
  const button = $('#portfolioSubmit');
  const oldText = button.textContent;
  button.disabled = true;
  button.textContent = '등록 중…';
  const projectId = makePortfolioId();

  try {
    const uploads = [];
    for (let i = 0; i < state.files.length; i += 1) {
      const item = state.files[i];
      const percentBefore = Math.round((i / state.files.length) * 90);
      setProgress(percentBefore, `이미지 업로드 중 ${i + 1} / ${state.files.length} · ${item.file.name}`);
      const uploaded = await uploadPortfolioImage(projectId, item.file, i);
      uploads.push(uploaded);
      setProgress(Math.round(((i + 1) / state.files.length) * 90), `이미지 업로드 완료 ${i + 1} / ${state.files.length}`);
    }

    setProgress(95, '포트폴리오 정보를 Firestore에 저장하는 중…');
    const preset = CATEGORY[cat] || CATEGORY.paper;
    await createPortfolioProject({
      id: projectId,
      title,
      cat,
      kicker: preset.kicker,
      type: $('#portfolioType').value.trim() || preset.type,
      feature: $('#portfolioFeature').value.trim() || '제작 이미지 참고',
      usage: $('#portfolioUsage').value.trim(),
      desc: $('#portfolioDesc').value.trim() || `${title} 제작 사례입니다. 등록된 제작 이미지를 통해 형태와 구성, 완성 결과를 확인할 수 있습니다.`,
      images: uploads.map((item) => item.url),
      imageFiles: uploads.map((item) => ({ path: item.path, name: item.name, size: item.size, type: item.type }))
    });

    setProgress(100, '등록 완료 · 포트폴리오 페이지에 바로 반영됩니다.');
    alert('포트폴리오가 등록되었습니다. 포트폴리오 페이지 새로고침 시 바로 확인할 수 있습니다.');
    resetForm();
    await loadAll();
  } catch (error) {
    console.error(error);
    const code = error?.code || error?.message || '';
    let message = '포트폴리오 등록에 실패했습니다.';
    if (String(code).includes('storage/unauthorized')) message = 'Firebase Storage Rules가 아직 적용되지 않았습니다.';
    else if (String(code).includes('permission-denied')) message = 'Firestore Rules가 아직 적용되지 않았습니다.';
    else if (String(code).includes('storage/unknown')) message = 'Firebase Storage 설정을 확인해주세요.';
    setProgress(0, message);
    alert(message);
  } finally {
    state.busy = false;
    button.disabled = false;
    button.textContent = oldText;
  }
}

function initDropzone() {
  const dropzone = $('#portfolioDropzone');
  const input = $('#portfolioImages');
  input.addEventListener('change', () => addFiles(input.files));
  ['dragenter', 'dragover'].forEach((name) => dropzone.addEventListener(name, (event) => {
    event.preventDefault();
    dropzone.classList.add('drag');
  }));
  ['dragleave', 'drop'].forEach((name) => dropzone.addEventListener(name, (event) => {
    event.preventDefault();
    dropzone.classList.remove('drag');
  }));
  dropzone.addEventListener('drop', (event) => addFiles(event.dataTransfer.files));
}

function initCategoryPreset() {
  $('#portfolioType').value = CATEGORY.paper.type;
  $('#portfolioCat').addEventListener('change', (event) => {
    const preset = CATEGORY[event.target.value];
    if (!preset) return;
    if (!$('#portfolioType').value.trim() || Object.values(CATEGORY).some((item) => item.type === $('#portfolioType').value.trim())) {
      $('#portfolioType').value = preset.type;
    }
  });
}

function init() {
  initDropzone();
  initCategoryPreset();
  $('#portfolioForm').addEventListener('submit', submitPortfolio);
  $('#refreshPortfolio').addEventListener('click', loadAll);
  $('#portfolioSearch').addEventListener('input', (event) => {
    state.query = event.target.value;
    renderList();
  });
  loadAll();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
