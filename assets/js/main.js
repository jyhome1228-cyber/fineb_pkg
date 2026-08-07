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

  /* FAQ */
  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click',()=>btn.closest('.faq-item').classList.toggle('open'));
  });

  /* File upload: 10MB guidance */
  const maxUpload=10*1024*1024;
  document.querySelectorAll('input[type="file"]').forEach(input=>{
    const box=input.closest('.upload-box') || input.parentElement;
    if(box && !box.parentElement?.querySelector('.upload-email-note')){
      const note=document.createElement('div');
      note.className='upload-email-note';
      note.innerHTML='첨부파일은 <strong>총 10MB 이하</strong>를 권장합니다. 10MB를 초과하는 파일은 <a href="mailto:whales84@naver.com">whales84@naver.com</a> 으로 보내주세요.';
      box.insertAdjacentElement('afterend',note);
    }
    input.addEventListener('change',()=>{
      const total=[...input.files].reduce((sum,file)=>sum+file.size,0);
      if(total>maxUpload){
        alert('첨부파일 총 용량이 10MB를 초과합니다. whales84@naver.com 으로 파일을 보내주세요.');
        input.value='';
      }
    });
  });

  /* Footer business information */
  document.querySelectorAll('.footer').forEach(footer=>{
    const container=footer.querySelector('.container');
    if(!container || container.querySelector('.business-footer')) return;
    const info=document.createElement('div');
    info.className='business-footer';
    info.innerHTML=`
      <div class="biz-left">
        <strong>파인비(fine.B)</strong> &nbsp; 대표 이준휘 &nbsp; 사업자등록번호 391-30-00766<br>
        경기도 파주시 가람로116번길 107, 209호 (와동동, 운정한강듀클래스)<br>
        칼라박스제작 · 샘플제작 · 디자인 · 인쇄 · 출판·제본 · 쇼핑백 제작 · 임가공
      </div>
      <div class="biz-right">
        제작 및 파일 문의 &nbsp; <a href="mailto:whales84@naver.com">whales84@naver.com</a><br>
        파일이 10MB를 초과하는 경우 이메일로 보내주세요.
      </div>`;
    const bottom=container.querySelector('.footer-bottom');
    if(bottom) container.insertBefore(info,bottom); else container.appendChild(info);
  });

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',()=>nav?.classList.remove('open'));
  });
});
