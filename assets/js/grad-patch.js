(()=>{
  const ensurePatchStyle=()=>{
    if(document.querySelector('link[href="assets/css/grad-patch.css"]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='assets/css/grad-patch.css';
    document.head.appendChild(link);
  };

  const refinePopup=()=>{
    const popup=document.querySelector('.grad-event-popup');
    if(!popup)return;
    const content=popup.querySelector('.grad-event-popup-content');
    if(!content)return;

    const period=content.querySelector('.grad-event-popup-period');
    const oldEvent=content.querySelector('.grad-event-popup-event');
    const oldBadge=content.querySelector('.grad-event-popup-badge');
    content.querySelector('.grad-event-popup-tags')?.remove();

    const tags=document.createElement('div');
    tags.className='grad-event-popup-tags';
    const event=document.createElement('span');
    event.className='grad-event-popup-event';
    event.textContent='EVENT!';
    const badge=document.createElement('span');
    badge.className='grad-event-popup-badge';
    badge.textContent='FINE.B GRAD 2026';
    tags.append(event,badge);
    oldEvent?.remove();
    oldBadge?.remove();
    if(period)period.after(tags);else content.prepend(tags);

    const title=content.querySelector('h2');
    if(title)title.innerHTML='대학교 졸업작품<br>준비하는 학생을 위한<br>샘플 제작 이벤트!';
    const copy=content.querySelector('p');
    if(copy)copy.textContent='전국 디자인 전공 학생 대상. 무료배송, 1:1 상담, 친구 10% 할인과 5인 이상 단체 샘플 추가 증정 혜택을 확인해보세요.';
    content.querySelector('.grad-event-popup-meta')?.remove();
  };

  const insertPriceGuide=()=>{
    if(!document.body.classList.contains('grad-page'))return;
    if(document.querySelector('.grad-price-section'))return;
    const benefits=document.querySelector('.grad-benefit-section');
    if(!benefits)return;

    const section=document.createElement('section');
    section.className='grad-section grad-price-section';
    section.innerHTML=`
      <div class="container">
        <div class="grad-section-head">
          <div><span class="grad-kicker">STUDENT SAMPLE PRICE</span><h2>학생 샘플 비용 안내.</h2></div>
          <p>졸업전시용 기본 단상자 샘플을 기준으로 가장 많이 문의하는 제작 비용을 정리했습니다.<br>구조·인쇄 범위·개발 난이도에 따라 최종 비용은 달라질 수 있습니다.</p>
        </div>
        <div class="grad-price-grid">
          <article class="grad-price-card primary">
            <small>BASIC SAMPLE</small>
            <h3>기본 단상자 샘플</h3>
            <div class="grad-price-amount"><strong>200,000원</strong><span>3–4개 기준</span></div>
            <ul class="grad-price-list">
              <li>R/IV 계열 종이 및 샘플기 제작 가능 사이즈 기준</li>
              <li>도면 제공</li>
              <li>무광 또는 유광 라미네이팅 제공</li>
            </ul>
          </article>
          <article class="grad-price-card">
            <small>DEVELOPMENT</small>
            <h3>샘플 테스트·개발이 필요한 경우</h3>
            <div class="grad-price-amount"><strong>+100,000원</strong><span>개발비</span></div>
            <ul class="grad-price-list">
              <li>구조 테스트와 샘플 검토를 거쳐 별도 개발이 필요한 경우 적용</li>
              <li>난이도와 구조에 따라 상담 후 최종 비용을 안내합니다.</li>
            </ul>
          </article>
        </div>
        <div class="grad-price-note-grid">
          <div class="grad-price-note"><strong>선물세트 · 별도 개발 구조</strong><p>선물세트나 별도 구조 개발이 필요한 경우 상담을 통해 비용을 산정합니다. 인쇄가 없는 단순 상·하 구성은 기본 20만원 기준에서 검토할 수 있습니다.</p></div>
          <div class="grad-price-note"><strong>인쇄 범위에 따른 비용</strong><p>인쇄 면적과 색상 범위가 많아질수록 출력·재료 사용량이 늘어나 제작 비용이 높아질 수 있습니다.</p></div>
        </div>
        <div class="grad-price-caution">※ 위 금액은 졸업전시 학생 샘플 이벤트의 기본 안내 기준입니다. 실제 칼선, 완성 사이즈, 인쇄 면적, 소재 및 제작 방식 확인 후 최종 비용이 확정됩니다.</div>
      </div>`;
    benefits.after(section);
  };

  ensurePatchStyle();
  refinePopup();
  insertPriceGuide();
})();
