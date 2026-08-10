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
