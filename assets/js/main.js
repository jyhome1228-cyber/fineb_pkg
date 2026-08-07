document.addEventListener('DOMContentLoaded',()=>{
  const ensureStyle=href=>{
    if(!document.querySelector(`link[href="${href}"]`)){
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href=href;
      document.head.appendChild(link);
    }
  };
  ensureStyle('assets/css/refinement.css');
  ensureStyle('assets/css/enhance.css');

  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
  if(toggle&&nav){toggle.addEventListener('click',()=>nav.classList.toggle('open'));}

  const menuLabels=[
    ['about.html','회사소개'],
    ['production.html','제작품목'],
    ['process.html','제작과정'],
    ['works.html','제작사례'],
    ['guide.html','제작가이드'],
    ['sample.html','샘플제작'],
    ['faq.html','자주묻는질문'],
    ['inquiry.html','제작문의'],
    ['quote.html','견적내기 →']
  ];

  document.querySelectorAll('.nav a').forEach(link=>{
    const href=(link.getAttribute('href')||'').split('#')[0];
    const found=menuLabels.find(([path])=>href.endsWith(path));
    if(found) link.textContent=found[1];
  });

  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click',()=>btn.closest('.faq-item').classList.toggle('open'));
  });

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',()=>nav?.classList.remove('open'));
  });
});
