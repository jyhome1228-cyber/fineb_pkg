document.addEventListener('DOMContentLoaded',()=>{
  const ensureStyle=href=>{if(!document.querySelector(`link[href="${href}"]`)){const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);}};
  ensureStyle('assets/css/refinement.css');
  ensureStyle('assets/css/enhance.css');
  ensureStyle('assets/css/system-ui.css');
  ensureStyle('assets/css/forms.css');

  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
  if(toggle&&nav)toggle.addEventListener('click',()=>nav.classList.toggle('open'));

  const menuLabels=[['about.html','회사소개'],['production.html','제작품목'],['process.html','제작과정'],['works.html','제작사례'],['guide.html','제작가이드'],['sample.html','샘플제작'],['faq.html','자주묻는질문'],['inquiry.html','제작문의'],['quote.html','견적내기 →']];
  document.querySelectorAll('.nav a').forEach(link=>{const href=(link.getAttribute('href')||'').split('#')[0];const found=menuLabels.find(([path])=>href.endsWith(path));if(found)link.textContent=found[1];});
  document.querySelectorAll('.faq-q').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.faq-item').classList.toggle('open')));

  function privacyBlock(id){const wrap=document.createElement('div');wrap.className='privacy-consent';wrap.innerHTML=`<label class="privacy-check"><input type="checkbox" id="${id}"><span><strong>[필수] 개인정보 수집 및 이용에 동의합니다.</strong><small>견적·샘플·제작문의 상담 및 회신을 위해 담당자명, 연락처, 이메일, 회사/브랜드명과 요청내용을 수집합니다.</small></span></label><details><summary>개인정보 수집 및 이용 안내</summary><div>수집 목적: 제작 상담, 견적 안내, 샘플 제작 및 문의 회신<br>수집 항목: 회사/브랜드명, 담당자명, 연락처, 이메일, 제작 사양, 문의내용<br>보유 기간: 상담 및 제작 업무 종료 후 내부 정책에 따라 보관 후 파기<br>동의를 거부할 수 있으나, 필수 정보 수집에 동의하지 않으면 온라인 문의 접수가 어렵습니다.</div></details>`;return wrap;}
  const quoteAction=document.querySelector('#submitQuote')?.closest('.step-actions');if(quoteAction&&!document.querySelector('#privacyQuote'))quoteAction.insertAdjacentElement('beforebegin',privacyBlock('privacyQuote'));
  const sampleAction=document.querySelector('#submitSample')?.closest('.step-actions');if(sampleAction&&!document.querySelector('#privacySample'))sampleAction.insertAdjacentElement('beforebegin',privacyBlock('privacySample'));
  const inquiryForm=document.querySelector('#inquiryForm');if(inquiryForm&&!document.querySelector('#privacyInquiry')){const submit=inquiryForm.querySelector('button[type="submit"]');if(submit)submit.insertAdjacentElement('beforebegin',privacyBlock('privacyInquiry'));}

  document.querySelectorAll('.footer').forEach(footer=>{
    const container=footer.querySelector('.container');if(!container||container.querySelector('.business-footer'))return;
    const info=document.createElement('div');info.className='business-footer';info.innerHTML=`<div class="biz-left"><strong>파인비(fine.B)</strong> &nbsp; 대표 이준휘 &nbsp; 사업자등록번호 391-30-00766<br>경기도 파주시 가람로116번길 107, 209호 (와동동, 운정한강듀클래스)<br>칼라박스제작 · 샘플제작 · 디자인 · 인쇄 · 출판·제본 · 쇼핑백 제작 · 임가공</div><div class="biz-right">제작 및 파일 문의 &nbsp; <a href="mailto:whales84@naver.com">whales84@naver.com</a><br>디자인·도면·참고이미지 등 모든 제작 파일은 이메일로 보내주세요.</div>`;
    const bottom=container.querySelector('.footer-bottom');if(bottom)container.insertBefore(info,bottom);else container.appendChild(info);
  });
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>nav?.classList.remove('open')));
});
