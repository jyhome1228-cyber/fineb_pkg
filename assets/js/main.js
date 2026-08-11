document.addEventListener('DOMContentLoaded',()=>{
  const ensureStyle=href=>{if(!document.querySelector(`link[href="${href}"]`)){const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);}};
  ensureStyle('assets/css/refinement.css');
  ensureStyle('assets/css/enhance.css');
  ensureStyle('assets/css/system-ui.css');
  ensureStyle('assets/css/forms.css');
  ensureStyle('assets/css/factory.css');
  if(!document.querySelector('script[src="assets/js/contact-paper-ui.js"]')){const uiScript=document.createElement('script');uiScript.src='assets/js/contact-paper-ui.js';document.body.appendChild(uiScript);}
  if(!document.querySelector('script[src="assets/js/seo-meta.js"]')){const seoScript=document.createElement('script');seoScript.src='assets/js/seo-meta.js';document.body.appendChild(seoScript);}
  if(!document.querySelector('script[src="assets/js/visitor-tracker.js"]')){const visitorScript=document.createElement('script');visitorScript.type='module';visitorScript.src='assets/js/visitor-tracker.js';document.body.appendChild(visitorScript);}

  // Homepage visual refresh: user-supplied production imagery only
  const homeHero=document.querySelector('.hero-main .hero-grid');
  const oldHeroVisual=homeHero?.querySelector('.hero-factory');
  if(homeHero&&oldHeroVisual){
    const style=document.createElement('style');
    style.textContent=`
      .hero-main .hero-grid{grid-template-columns:.86fr 1.14fr;gap:72px;align-items:center}
      .hero-main .hero-copy{max-width:610px;line-height:1.85}
      .hero-media-cluster{height:468px;display:grid;grid-template-columns:1.5fr .72fr;grid-template-rows:1fr 1fr;gap:12px}
      .hero-media-card{position:relative;overflow:hidden;border:1px solid #e1e6eb;border-radius:18px;background:#eef2f5 center/cover no-repeat}
      .hero-media-main{grid-row:1/3;background-image:url('https://cdn.imweb.me/upload/S2023030963558ef55ba8e/c5acf880c9b79.png');background-position:center}
      .hero-media-sub01{background-image:url('https://cdn.imweb.me/upload/S2023030963558ef55ba8e/57fc60e1f2986.png')}
      .hero-media-sub02{background-image:url('https://cdn.imweb.me/upload/S2023030963558ef55ba8e/188b61c233e04.png')}
      .hero-media-main:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(10,34,64,.28));pointer-events:none}
      .hero-media-label{position:absolute;left:18px;bottom:16px;z-index:2;padding:7px 10px;border-radius:999px;background:rgba(10,34,64,.66);color:#fff;font-size:9.5px;letter-spacing:.12em;font-weight:700;backdrop-filter:blur(8px)}
      .home-support-photo{min-height:340px;border-radius:20px;border:1px solid #e1e6eb;background:#eef2f5 url('https://cdn.imweb.me/upload/S2023030963558ef55ba8e/2a4304cf7c2f3.png') center/cover no-repeat;overflow:hidden}
      @media(max-width:1050px){.hero-main .hero-grid{grid-template-columns:1fr;gap:42px}.hero-media-cluster{height:430px}}
      @media(max-width:680px){.hero-media-cluster{height:470px;grid-template-columns:1fr 1fr;grid-template-rows:2fr 1fr}.hero-media-main{grid-column:1/3;grid-row:1}.hero-media-sub01{grid-column:1}.hero-media-sub02{grid-column:2}.hero-media-card{border-radius:14px}.hero-main .hero-copy br{display:none}}
    `;
    document.head.appendChild(style);
    const cluster=document.createElement('div');
    cluster.className='hero-media-cluster';
    cluster.innerHTML=`<div class="hero-media-card hero-media-main"><span class="hero-media-label">FINE.B / PACKAGE PRODUCTION</span></div><div class="hero-media-card hero-media-sub01"></div><div class="hero-media-card hero-media-sub02"></div>`;
    oldHeroVisual.replaceWith(cluster);
    const heroCopy=homeHero.querySelector('.hero-copy');
    if(heroCopy)heroCopy.innerHTML='패키지가 익숙하지 않아도 괜찮습니다.<br>구조 상담부터 인쇄·후가공·양산과 납품까지 필요한 과정을 함께 정리합니다.';
    const sampleVisual=document.querySelector('.sample-layout .factory-photo');
    if(sampleVisual){sampleVisual.className='home-support-photo';sampleVisual.innerHTML='';}
  }

  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
  if(toggle&&nav)toggle.addEventListener('click',()=>nav.classList.toggle('open'));

  const menuLabels=[['about.html','회사소개'],['production.html','제작품목'],['process.html','제작과정'],['works.html','포트폴리오'],['guide.html','주문제작가이드'],['sample.html','샘플제작'],['faq.html','자주묻는질문'],['inquiry.html','제작문의'],['quote.html','견적내기 →']];
  document.querySelectorAll('.nav a,.footer a').forEach(link=>{const href=(link.getAttribute('href')||'').split('#')[0];const found=menuLabels.find(([path])=>href.endsWith(path));if(found)link.textContent=found[1];});
  document.querySelectorAll('.faq-q').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.faq-item').classList.toggle('open')));

  if(document.querySelector('.factory-gallery')){
    ensureStyle('assets/css/factory-carousel.css');
    const script=document.createElement('script');script.src='assets/js/factory-carousel.js';document.body.appendChild(script);
  }

  if(document.querySelector('.process-interactive')){
    ensureStyle('assets/css/process-clean.css');
    document.querySelectorAll('.process-icon').forEach(el=>el.remove());
    const heroTitle=document.querySelector('.page-hero h1');
    const heroCopy=document.querySelector('.page-hero .page-hero-copy p');
    if(heroTitle)heroTitle.innerHTML='패키지가 완성되는<br>제작 흐름.';
    if(heroCopy)heroCopy.innerHTML='사양을 정리한 뒤 인쇄·코팅·후가공·톰슨·접착·가공·포장과 납품까지 이어집니다.<br>각 단계에서 필요한 확인사항을 놓치지 않도록 파인비가 제작 전 과정을 꼼꼼하게 함께합니다.';
    const deliveryDesc=document.querySelector('.process-interactive + .section .section-desc');
    if(deliveryDesc)deliveryDesc.innerHTML='포장과 운송 방식은 납품 장소와 현장 조건에 따라 달라집니다.<br>견적 문의 시 아래 내용을 함께 알려주시면 더 정확하게 준비할 수 있습니다.';
  }

  const guideSections=[...document.querySelectorAll('.guide-clean-section')];
  const guideLinks=[...document.querySelectorAll('.guide-index a')];
  if(guideSections.length&&guideLinks.length){
    const setActive=id=>guideLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${id}`));
    const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible)setActive(visible.target.id);},{rootMargin:'-25% 0px -60% 0px',threshold:[0,.1,.25,.5]});
    guideSections.forEach(section=>observer.observe(section));
    guideLinks.forEach(link=>link.addEventListener('click',()=>setActive(link.getAttribute('href').slice(1))));
  }

  function privacyBlock(id){const wrap=document.createElement('div');wrap.className='privacy-consent';wrap.innerHTML=`<label class="privacy-check"><input type="checkbox" id="${id}"><span><strong>[필수] 개인정보 수집 및 이용에 동의합니다.</strong><small>견적·샘플·제작문의 상담 및 회신을 위해 담당자명, 연락처, 이메일, 회사/브랜드명과 요청내용을 수집합니다.</small></span></label><details><summary>개인정보 수집 및 이용 안내</summary><div>수집 목적: 제작 상담, 견적 안내, 샘플 제작 및 문의 회신<br>수집 항목: 회사/브랜드명, 담당자명, 연락처, 이메일, 제작 사양, 문의내용<br>보유 기간: 상담 및 제작 업무 종료 후 내부 정책에 따라 보관 후 파기<br>동의를 거부할 수 있으나, 필수 정보 수집에 동의하지 않으면 온라인 문의 접수가 어렵습니다.</div></details>`;return wrap;}
  const quoteAction=document.querySelector('#submitQuote')?.closest('.step-actions');if(quoteAction&&!document.querySelector('#privacyQuote'))quoteAction.insertAdjacentElement('beforebegin',privacyBlock('privacyQuote'));
  const sampleAction=document.querySelector('#submitSample')?.closest('.step-actions');if(sampleAction&&!document.querySelector('#privacySample'))sampleAction.insertAdjacentElement('beforebegin',privacyBlock('privacySample'));
  const inquiryForm=document.querySelector('#inquiryForm');if(inquiryForm&&!document.querySelector('#privacyInquiry')){const submit=inquiryForm.querySelector('button[type="submit"]');if(submit)submit.insertAdjacentElement('beforebegin',privacyBlock('privacyInquiry'));}

  document.querySelectorAll('.footer').forEach(footer=>{
    const container=footer.querySelector('.container');if(!container||container.querySelector('.business-footer'))return;
    const info=document.createElement('div');info.className='business-footer';info.innerHTML=`<div class="biz-left"><strong>파인비(fine.B)</strong> &nbsp; 대표 이준휘 &nbsp; 사업자등록번호 391-30-00766<br>경기도 파주시 가람로116번길 107, 204호 (와동동, 운정한강듀클래스)<br>칼라박스제작 · 샘플제작 · 디자인 · 인쇄 · 출판·제본 · 쇼핑백 제작 · 임가공</div><div class="biz-right"><strong>대표전화</strong> &nbsp; <a href="tel:01047587049">010-4758-7049</a><br>제작 및 파일 문의 &nbsp; <a href="mailto:whales84@naver.com">whales84@naver.com</a><br>디자인·도면·참고이미지 등 모든 제작 파일은 이메일로 보내주세요.</div>`;
    const bottom=container.querySelector('.footer-bottom');if(bottom)container.insertBefore(info,bottom);else container.appendChild(info);
  });
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>nav?.classList.remove('open')));
});