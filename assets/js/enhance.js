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
