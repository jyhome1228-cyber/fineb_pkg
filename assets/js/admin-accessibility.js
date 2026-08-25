(()=>{
  const VIEW_KEY='fineb_admin_view_mode';
  const $=s=>document.querySelector(s);

  function ensureCustomerNav(){
    const nav=document.querySelector('.admin-nav');
    if(!nav||nav.querySelector('a[href="admin-customers.html"]'))return;
    const link=document.createElement('a');
    link.href='admin-customers.html';
    link.className='admin-site-link';
    link.style.marginTop='2px';
    link.style.background='rgba(255,255,255,.06)';
    link.textContent='고객관리';
    const analytics=nav.querySelector('a[href="admin-analytics.html"]');
    if(analytics)nav.insertBefore(link,analytics);
    else nav.appendChild(link);
  }

  function setView(mode){
    const large=mode==='large';
    document.body.classList.toggle('view-large',large);
    $('#viewLarge')?.classList.toggle('active',large);
    $('#viewNormal')?.classList.toggle('active',!large);
    try{localStorage.setItem(VIEW_KEY,large?'large':'normal')}catch{}
  }

  function safe(v){return v===undefined||v===null||v===''?'-':Array.isArray(v)?v.join(', '):String(v)}
  function html(v){return safe(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function typeLabel(type){return type==='quote'?'견적문의':type==='sample'?'샘플문의':'제작문의'}
  function reqTitle(r){return r?.spec?.title||r?.spec?.product||r?.company||r?.name||typeLabel(r?.type)}
  function reqStatus(r){return r?.status||'신규'}
  function dateText(v){
    if(!v)return '-';
    const d=new Date(v);if(Number.isNaN(d.getTime()))return '-';
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  function fieldsFor(r){
    const s=r?.spec||{};
    if(r?.type==='quote')return [['제품',s.product],['수량',s.qty],['사이즈',s.size],['종이',s.paper],['평량',s.gsm?s.gsm+'gsm':''],['인쇄 방식',s.printMethod],['인쇄 색상',s.printColor],['인쇄 면',s.printSide],['코팅',s.coating],['후가공',s.finishes],['내부 구성',s.insert]];
    if(r?.type==='sample')return [['제품',s.product],['수량',s.qty],['사이즈',s.size],['종이',s.paper],['평량',s.gsm?s.gsm+'gsm':''],['인쇄',s.print],['후가공',s.finish]];
    return [['문의 유형',s.inquiryType],['예상 수량',s.qty],['문의 제목',s.title]];
  }

  let oldTitle='';
  function cleanupPrint(){
    const root=$('#pdfPrintRoot');if(root)root.innerHTML='';
    if(oldTitle){document.title=oldTitle;oldTitle=''}
  }

  function stablePrint(r){
    const root=$('#pdfPrintRoot');if(!root||!r)return;
    const fields=fieldsFor(r);
    const customer=[['회사 / 브랜드',r.company],['담당자',r.name],['연락처',r.phone],['이메일',r.email]];
    const cells=items=>items.map(([k,v])=>`<div class="pdf-cell"><span>${html(k)}</span><strong>${html(v)}</strong></div>`).join('');
    root.innerHTML=`<article class="pdf-sheet">
      <header class="pdf-head"><div><div class="pdf-brand">FINE.B</div><div class="pdf-brand-sub">PACKAGE DEVELOPMENT & PRODUCTION</div></div><div class="pdf-id">${html(typeLabel(r.type))}<br>${html(r.id)}</div></header>
      <section class="pdf-summary"><span class="pdf-badge">${html(reqStatus(r))}</span><h1>${html(reqTitle(r))}</h1><div class="pdf-date">접수일 ${html(dateText(r.createdAtClient||r.createdAt))}</div></section>
      <section class="pdf-section"><h2>고객 정보</h2><div class="pdf-grid two">${cells(customer)}</div></section>
      <section class="pdf-section"><h2>${r.type==='inquiry'?'문의 정보':'제작 사양'}</h2><div class="pdf-grid">${cells(fields)}</div></section>
      <section class="pdf-section"><h2>요청사항</h2><div class="pdf-message">${html(r.message)}</div></section>
      <footer class="pdf-footer">FINE.B 파인비 · 대표전화 010-4758-7049<br>파일 및 제작 문의 whales84@naver.com</footer>
    </article>`;
    oldTitle=document.title;
    document.title=`FINEB_${typeLabel(r.type)}_${reqTitle(r)}`.replace(/[\\/:*?"<>|]/g,'_');
    requestAnimationFrame(()=>setTimeout(()=>window.print(),80));
  }

  document.addEventListener('DOMContentLoaded',()=>{
    ensureCustomerNav();
    let mode='normal';
    try{mode=localStorage.getItem(VIEW_KEY)||'normal'}catch{}
    setView(mode);
    $('#viewNormal')?.addEventListener('click',()=>setView('normal'));
    $('#viewLarge')?.addEventListener('click',()=>setView('large'));
  });

  /* 구형 전역 admin.js에서만 안정형 인쇄를 가로챕니다.
     모듈형 admin.js에서는 선택 데이터가 전역에 노출되지 않으므로
     이벤트를 막지 않고 admin.js의 기본 PDF 저장 기능을 그대로 사용합니다. */
  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('#pdfRequest');
    if(!btn)return;
    let r=null;
    try{
      if(typeof findSelected==='function')r=findSelected();
      else if(typeof adminState!=='undefined')r=(adminState.data[adminState.type]||[]).find(x=>x.id===adminState.selected)||null;
    }catch{}
    if(!r)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    stablePrint(r);
  },true);

  window.addEventListener('afterprint',cleanupPrint);
})();
