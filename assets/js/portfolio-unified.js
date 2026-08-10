import { fetchPortfolioProjects } from './firebase-client.js';

const PAGE_SIZE = 6;
const CATEGORY_LABELS = {
  paper: 'PAPER BOX',
  gift: 'GIFT PACKAGE',
  rigid: 'RIGID BOX',
  special: 'SPECIAL STRUCTURE'
};

const state = {
  projects: [],
  filter: 'all',
  visible: PAGE_SIZE,
  modalProject: null,
  modalIndex: 0
};

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

function normalizeProject(project = {}, source = 'legacy', index = 0) {
  const images = Array.isArray(project.images) ? project.images.filter(Boolean) : [];
  return {
    id: project.id || `${source}-${index}`,
    title: project.title || '포트폴리오',
    images,
    cat: project.cat || 'paper',
    kicker: project.kicker || CATEGORY_LABELS[project.cat] || 'PACKAGE',
    type: project.type || '',
    feature: project.feature || '',
    usage: project.usage || '',
    desc: project.desc || '',
    source: project.source || source,
    createdAtClient: project.createdAtClient || ''
  };
}

async function loadLegacyProjects() {
  try {
    const response = await fetch(`assets/js/portfolio.js?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('LEGACY_PORTFOLIO_FETCH');
    const text = await response.text();
    const marker = 'const projects=';
    const startMarker = text.indexOf(marker);
    if (startMarker < 0) return [];
    const arrayStart = text.indexOf('[', startMarker + marker.length);
    const arrayEnd = text.indexOf('];', arrayStart);
    if (arrayStart < 0 || arrayEnd < 0) return [];
    const parsed = JSON.parse(text.slice(arrayStart, arrayEnd + 1));
    return parsed.map((item, index) => normalizeProject(item, 'legacy', index));
  } catch (error) {
    console.warn('Legacy portfolio load failed:', error);
    return [];
  }
}

async function loadProjects() {
  const [legacy, cms] = await Promise.all([
    loadLegacyProjects(),
    fetchPortfolioProjects().catch((error) => {
      console.warn('CMS portfolio load failed:', error);
      return [];
    })
  ]);
  state.projects = [
    ...cms.map((item, index) => normalizeProject(item, 'cms', index)),
    ...legacy
  ];
}

function filteredProjects() {
  if (state.filter === 'all') return state.projects;
  return state.projects.filter((project) => project.cat === state.filter);
}

function cardMarkup(project, index) {
  const image = project.images[0] || '';
  const summary = [project.feature, project.usage].filter(Boolean).join(' · ') || project.type || '제작 사례';
  return `<article class="work-case" tabindex="0" data-project-index="${index}">
    <div class="work-case-image">${image ? `<img src="${esc(image)}" alt="${esc(project.title)}" loading="lazy">` : ''}</div>
    <div class="work-case-copy">
      <small>${esc(project.kicker || CATEGORY_LABELS[project.cat] || 'PACKAGE')}</small>
      <span class="work-photo-count">${project.images.length} PHOTOS</span>
      <h3>${esc(project.title)}</h3>
      <p>${esc(summary)}</p>
    </div>
  </article>`;
}

function renderProjects() {
  const grid = $('.works-grid-real');
  const moreWrap = $('.works-more');
  const moreButton = $('#worksMoreBtn');
  if (!grid) return;

  const list = filteredProjects();
  const visibleList = list.slice(0, state.visible);
  grid.innerHTML = visibleList.map((project) => {
    const globalIndex = state.projects.indexOf(project);
    return cardMarkup(project, globalIndex);
  }).join('');

  if (!visibleList.length) {
    grid.innerHTML = '<div class="works-empty">등록된 포트폴리오가 없습니다.</div>';
  }

  if (moreWrap) moreWrap.hidden = list.length <= state.visible;
  if (moreButton) moreButton.textContent = `전체 더보기 (${Math.min(state.visible, list.length)}/${list.length})`;

  $$('.work-case', grid).forEach((card) => {
    const open = () => {
      const project = state.projects[Number(card.dataset.projectIndex)];
      if (project) openModal(project);
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
}

function ensureModal() {
  let modal = $('.work-modal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.className = 'work-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `<div class="work-modal-backdrop" data-modal-close></div>
    <div class="work-modal-panel" role="dialog" aria-modal="true" aria-label="포트폴리오 상세">
      <button class="work-modal-close" type="button" aria-label="닫기" data-modal-close>×</button>
      <div class="work-modal-gallery">
        <div class="work-modal-stage">
          <img class="work-modal-image" alt="">
          <button class="work-gallery-arrow prev" type="button" aria-label="이전 이미지">‹</button>
          <button class="work-gallery-arrow next" type="button" aria-label="다음 이미지">›</button>
          <span class="work-gallery-count"></span>
        </div>
        <div class="work-modal-thumbs"></div>
      </div>
      <div class="work-modal-body">
        <div class="work-modal-kicker"></div>
        <h2 class="work-modal-title"></h2>
        <p class="work-modal-desc"></p>
        <div class="work-specs"></div>
        <div class="work-modal-cta"><a class="btn-primary" href="quote.html">견적내기</a><a class="btn-secondary" href="inquiry.html">제작문의</a></div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  $$('[data-modal-close]', modal).forEach((button) => button.addEventListener('click', closeModal));
  $('.work-gallery-arrow.prev', modal).addEventListener('click', () => changeModalImage(-1));
  $('.work-gallery-arrow.next', modal).addEventListener('click', () => changeModalImage(1));
  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowLeft') changeModalImage(-1);
    if (event.key === 'ArrowRight') changeModalImage(1);
  });
  return modal;
}

function openModal(project) {
  state.modalProject = project;
  state.modalIndex = 0;
  const modal = ensureModal();
  $('.work-modal-kicker', modal).textContent = project.kicker || CATEGORY_LABELS[project.cat] || 'PACKAGE';
  $('.work-modal-title', modal).textContent = project.title;
  $('.work-modal-desc', modal).textContent = project.desc || `${project.title} 제작 사례입니다.`;
  const specs = [
    ['TYPE', project.type],
    ['FEATURE', project.feature],
    ['USE', project.usage]
  ].filter(([, value]) => value);
  $('.work-specs', modal).innerHTML = specs.map(([key, value]) => `<div class="work-spec-row"><b>${esc(key)}</b><span>${esc(value)}</span></div>`).join('');
  renderModalImage();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  const modal = $('.work-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function changeModalImage(direction) {
  const project = state.modalProject;
  if (!project?.images?.length) return;
  state.modalIndex = (state.modalIndex + direction + project.images.length) % project.images.length;
  renderModalImage();
}

function renderModalImage() {
  const project = state.modalProject;
  const modal = $('.work-modal');
  if (!project || !modal) return;
  const images = project.images || [];
  const current = images[state.modalIndex] || '';
  const image = $('.work-modal-image', modal);
  image.src = current;
  image.alt = `${project.title} ${state.modalIndex + 1}`;
  $('.work-gallery-count', modal).textContent = images.length ? `${state.modalIndex + 1} / ${images.length}` : '0 / 0';
  const thumbs = $('.work-modal-thumbs', modal);
  thumbs.innerHTML = images.map((url, index) => `<button type="button" class="${index === state.modalIndex ? 'active' : ''}" data-thumb-index="${index}"><img src="${esc(url)}" alt="${esc(project.title)} 썸네일 ${index + 1}" loading="lazy"></button>`).join('');
  $$('[data-thumb-index]', thumbs).forEach((button) => button.addEventListener('click', () => {
    state.modalIndex = Number(button.dataset.thumbIndex);
    renderModalImage();
  }));
  const arrows = $$('.work-gallery-arrow', modal);
  arrows.forEach((button) => { button.hidden = images.length <= 1; });
}

function bindFilters() {
  $$('.works-filter [data-work-filter]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      state.filter = link.dataset.workFilter || 'all';
      state.visible = PAGE_SIZE;
      $$('.works-filter [data-work-filter]').forEach((item) => item.classList.toggle('active', item === link));
      renderProjects();
    });
  });
  $('#worksMoreBtn')?.addEventListener('click', () => {
    state.visible += PAGE_SIZE;
    renderProjects();
  });
}

async function init() {
  const grid = $('.works-grid-real');
  if (!grid) return;
  grid.innerHTML = '<div class="works-loading">포트폴리오를 불러오는 중입니다.</div>';
  bindFilters();
  ensureModal();
  await loadProjects();
  renderProjects();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
