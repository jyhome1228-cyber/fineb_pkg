document.addEventListener('DOMContentLoaded',()=>{
  // Global visible menu labels
  const pageLabels=[['works.html','포트폴리오'],['guide.html','주문제작가이드']];
  document.querySelectorAll('a[href]').forEach(link=>{
    const href=(link.getAttribute('href')||'').split('#')[0];
    const found=pageLabels.find(([path])=>href.endsWith(path));
    if(found)link.textContent=found[1];
  });
  if(location.pathname.endsWith('/works.html')||location.pathname.endsWith('works.html')) document.title='포트폴리오 | FINE.B';
  if(location.pathname.endsWith('/guide.html')||location.pathname.endsWith('guide.html')) document.title='주문제작가이드 | FINE.B';

  // Home-only GRAD 2026 campaign strip above the header
  const isHome=location.pathname==='/'||location.pathname===''||location.pathname.endsWith('/index.html');
  if(isHome&&!document.querySelector('.grad-top-banner')){
    const header=document.querySelector('.header');
    if(header){
      const banner=document.createElement('a');
      banner.className='grad-top-banner';
      banner.href='grad2026.html';
      banner.setAttribute('aria-label','2026 디자인 전공 학생 졸업전시 샘플 제작 혜택 보기');
      banner.innerHTML='<span class="grad-top-badge">GRAD 2026</span><span class="grad-top-copy grad-top-copy-desktop">졸업전시 준비 중이라면? 디자인 전공 학생 샘플 제작 혜택</span><span class="grad-top-copy grad-top-copy-mobile">디자인 전공 학생 샘플 제작 혜택</span><span class="grad-top-arrow">자세히 보기 →</span>';
      header.before(banner);
      if(!document.querySelector('#fineb-grad-banner-style')){
        const gradStyle=document.createElement('style');
        gradStyle.id='fineb-grad-banner-style';
        gradStyle.textContent=`
          .grad-top-banner{
            min-height:42px;
            padding:0 24px;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:12px;
            background:#0A2240;
            color:#fff;
            border-bottom:1px solid rgba(255,255,255,.12);
            font-size:12.5px;
            line-height:1.2;
            letter-spacing:-.01em;
          }
          .grad-top-badge{
            display:inline-flex;
            align-items:center;
            min-height:24px;
            padding:0 9px;
            border-radius:999px;
            background:#dfeaff;
            color:#0A2240;
            font-size:9.5px;
            font-weight:800;
            letter-spacing:.1em;
          }
          .grad-top-copy{font-weight:650}
          .grad-top-copy-mobile{display:none}
          .grad-top-arrow{font-size:11px;color:#b9c8da;font-weight:600}
          .grad-top-banner:hover .grad-top-arrow{color:#fff}
          @media(max-width:720px){
            .grad-top-banner{min-height:40px;padding:0 14px;gap:8px;justify-content:space-between}
            .grad-top-copy-desktop{display:none}
            .grad-top-copy-mobile{display:inline;font-size:11.5px}
            .grad-top-badge{font-size:8.5px;padding:0 7px;min-height:22px}
            .grad-top-arrow{font-size:0}
            .grad-top-arrow:after{content:'→';font-size:14px}
          }
        `;
        document.head.appendChild(gradStyle);
      }
    }
  }

  // Header action buttons: same size / hierarchy
  if(!document.querySelector('#fineb-header-action-style')){
    const style=document.createElement('style');
    style.id='fineb-header-action-style';
    style.textContent=`
      .nav a[href$="sample.html"],
      .nav a[href$="quote.html"]{
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        width:108px!important;
        height:40px!important;
        min-height:40px!important;
        padding:0 14px!important;
        border-radius:999px!important;
        box-sizing:border-box!important;
        font-size:13px!important;
        font-weight:650!important;
        line-height:1!important;
        letter-spacing:-.01em!important;
        white-space:nowrap!important;
      }
      .nav a[href$="sample.html"]{
        order:90!important;
        margin-left:3px!important;
        border:1px solid #c8d1dc!important;
        background:#fff!important;
        color:#0A2240!important;
        box-shadow:none!important;
      }
      .nav a[href$="sample.html"]:after,
      .nav a[href$="quote.html"]:after{display:none!important}
      .nav a[href$="sample.html"]:hover{
        border-color:#0A2240!important;
        background:#f4f7fa!important;
      }
      .nav a[href$="sample.html"].active{
        border-color:#0A2240!important;
        background:#eef3f7!important;
        color:#0A2240!important;
      }
      .nav a[href$="quote.html"]{
        order:91!important;
        margin-left:-10px!important;
        border:1px solid #0A2240!important;
        background:#0A2240!important;
        color:#fff!important;
      }
      @media(max-width:1100px){
        .nav a[href$="sample.html"],.nav a[href$="quote.html"]{margin-left:0!important}
      }
      @media(max-width:900px){
        .nav a[href$="sample.html"],.nav a[href$="quote.html"]{
          width:100%!important;
          height:40px!important;
          min-height:40px!important;
          border-radius:12px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Interactive production process
  const processButtons=[...document.querySelectorAll('[data-process-target]')];
  const processPanels=[...document.querySelectorAll('[data-process-panel]')];
  const activateProcess=id=>{
    processButtons.forEach(btn=>btn.classList.toggle('active',btn.dataset.processTarget===id));
    processPanels.forEach(panel=>panel.classList.toggle('active',panel.dataset.processPanel===id));
  };
  processButtons.forEach(btn=>btn.addEventListener('click',()=>activateProcess(btn.dataset.processTarget)));
  if(processButtons.length&&!processButtons.some(b=>b.classList.contains('active'))) activateProcess(processButtons[0].dataset.processTarget);

  // Guide cards open detail panel within each section
  document.querySelectorAll('[data-guide-group]').forEach(group=>{
    const cards=[...group.querySelectorAll('[data-guide-target]')];
    const panels=[...group.querySelectorAll('[data-guide-panel]')];
    cards.forEach(card=>card.addEventListener('click',()=>{
      const id=card.dataset.guideTarget;
      const isActive=card.classList.contains('active');
      cards.forEach(c=>c.classList.remove('active'));
      panels.forEach(p=>p.classList.remove('active'));
      if(!isActive){
        card.classList.add('active');
        const panel=group.querySelector(`[data-guide-panel="${id}"]`);
        panel?.classList.add('active');
      }
    }));
  });

  // Works filters
  document.querySelectorAll('[data-work-filter]').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.preventDefault();
      const cat=btn.dataset.workFilter;
      document.querySelectorAll('[data-work-filter]').forEach(b=>b.classList.toggle('active',b===btn));
      document.querySelectorAll('[data-work-cat]').forEach(card=>{
        card.hidden=!(cat==='all'||card.dataset.workCat===cat);
      });
    });
  });

  // Smooth jump for guide nav
  document.querySelectorAll('.guide-nav a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const target=document.querySelector(a.getAttribute('href'));
      if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
    });
  });
});
