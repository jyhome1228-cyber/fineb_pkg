document.addEventListener('DOMContentLoaded',()=>{
  const projects=[
    {kicker:'PAPER BOX',title:'감태 수연면 패키지',desc:'감태 수연면 제품을 위한 단상자 제작 사례입니다. 세로형 제품 규격에 맞춰 패키지 구조와 전면 정보 구성을 정리했습니다.',type:'단상자',feature:'세로형 제품 패키지',usage:'식품 패키지'},
    {kicker:'PAPER BOX',title:'감태 캬라멜 단상자',desc:'감태 캬라멜 제품을 위한 단상자 사례입니다. 제품의 인상과 정보를 한 면 안에서 명확하게 전달할 수 있도록 구성한 패키지입니다.',type:'단상자',feature:'제품 판매용 패키지',usage:'식품 패키지'},
    {kicker:'SPECIAL STRUCTURE',title:'호박즙 손잡이형 선물상자',desc:'호박즙 제품의 보관과 이동을 고려한 손잡이형 선물상자입니다. 별도 쇼핑백 없이 들고 이동할 수 있는 구조가 특징입니다.',type:'손잡이형 선물상자',feature:'일체형 손잡이 구조',usage:'건강식품 · 선물 패키지'},
    {kicker:'GIFT PACKAGE',title:'프리미엄 김 선물세트',desc:'프리미엄 김 제품을 선물용으로 구성한 패키지 사례입니다. 제품군을 하나의 세트로 묶고 선물용 인상을 강화한 구성이 특징입니다.',type:'선물 패키지',feature:'세트 구성',usage:'식품 · 명절 선물'},
    {kicker:'GIFT BOX',title:'곶감 선물세트 상·하',desc:'곶감 제품을 위한 상·하 분리형 선물박스입니다. 뚜껑과 하부를 분리한 구조로 제품을 안정적으로 담고 선물용 완성도를 높였습니다.',type:'상·하 분리형 선물박스',feature:'상·하 구조',usage:'농산물 · 선물 패키지'},
    {kicker:'RIGID BOX',title:'더 테라피스트 자석 싸바리',desc:'자석 여닫이 방식의 표지형 싸바리 제작 사례입니다. 반복 개폐가 가능하고 제품을 보호하면서도 프리미엄한 인상을 주는 구조입니다.',type:'자석형 싸바리',feature:'자석 여닫이',usage:'프리미엄 제품 · 선물 패키지'},
    {kicker:'GIFT PACKAGE',title:'꽃차 선물세트 패키지',desc:'여러 제품을 한 세트로 구성한 꽃차 선물 패키지입니다. 제품이 정돈되어 보이도록 내부 구성과 외부 패키지의 인상을 함께 맞춘 사례입니다.',type:'선물 패키지',feature:'다품목 세트 구성',usage:'차 · 식품 선물'},
    {kicker:'SPECIAL RIGID',title:'쓰리스푼 슬리브 싸바리',desc:'슬리브 방식으로 열고 닫는 싸바리 패키지입니다. 외부 슬리브와 내부 본체가 분리되는 구조이며 부분 에폭시 후가공이 적용된 사례입니다.',type:'슬리브 싸바리',feature:'슬리브 구조 · 부분 에폭시',usage:'브랜드 제품 패키지'},
    {kicker:'RIGID BOX',title:'마사지볼 3단 싸바리',desc:'제품을 단계적으로 수납할 수 있도록 3단으로 구성한 싸바리 패키지입니다. 여러 구성품을 하나의 세트로 보여주기 좋은 구조입니다.',type:'3단 싸바리',feature:'3단 구성',usage:'제품 세트 · 선물 패키지'},
    {kicker:'PAPER BOX',title:'꿀 단상자',desc:'꿀 제품을 위한 판매용 단상자 사례입니다. 패키지 표면의 특정 영역을 강조하는 부분 에폭시 후가공이 적용되었습니다.',type:'단상자',feature:'부분 에폭시',usage:'식품 패키지'},
    {kicker:'RIGID BOX',title:'보안 USB 자석 표지 싸바리',desc:'USB 제품을 안전하게 보관하도록 구성한 자석 표지형 싸바리입니다. 제품 고정과 개폐 편의성을 함께 고려한 구조입니다.',type:'자석형 싸바리',feature:'자석 표지 구조 · IT 제품 패키지',usage:'전자제품 · 기념품'},
    {kicker:'VIP GIFT',title:'감태 VIP 선물세트',desc:'감태 제품을 프리미엄 선물용으로 구성한 VIP 패키지 사례입니다. 여러 구성품을 한 세트로 정돈해 보여주는 선물 패키지입니다.',type:'VIP 선물세트',feature:'다품목 구성 · 프리미엄 선물',usage:'식품 · VIP 선물'}
  ];
  const cards=[...document.querySelectorAll('.work-case')];
  const imageUrls=[];

  const setCardImage=(index,url)=>{
    const card=cards[index];
    if(!card)return;
    const media=card.querySelector('.work-case-image');
    if(!media)return;
    media.innerHTML=`<img src="${url}" alt="${projects[index].title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">`;
  };

  const source=new Image();
  source.onload=()=>{
    const sw=source.naturalWidth/4;
    const sh=source.naturalHeight/3;
    projects.forEach((project,index)=>{
      const col=index%4;
      const row=Math.floor(index/4);
      const canvas=document.createElement('canvas');
      canvas.width=Math.round(sw);
      canvas.height=Math.round(sh);
      const ctx=canvas.getContext('2d');
      ctx.drawImage(source,col*sw,row*sh,sw,sh,0,0,canvas.width,canvas.height);
      const url=canvas.toDataURL('image/jpeg',.92);
      imageUrls[index]=url;
      setCardImage(index,url);
    });
  };
  source.onerror=()=>{
    projects.forEach((project,index)=>{
      const fallback=`assets/works/case-${String(index+1).padStart(2,'0')}.svg`;
      imageUrls[index]=fallback;
      setCardImage(index,fallback);
    });
  };
  source.src='assets/works/contact.svg';

  document.querySelector('.work-modal')?.remove();
  const modal=document.createElement('div');
  modal.className='work-modal';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML=`<div class="work-modal-backdrop" data-work-close></div><div class="work-modal-panel" role="dialog" aria-modal="true" aria-labelledby="portfolioModalTitle"><button class="work-modal-close" type="button" data-work-close aria-label="닫기">×</button><div class="work-modal-media"><img class="work-modal-image" alt="" style="width:100%;height:100%;object-fit:cover;display:block"></div><div class="work-modal-body"><div class="work-modal-kicker"></div><h2 class="work-modal-title" id="portfolioModalTitle"></h2><p class="work-modal-desc"></p><div class="work-specs"><div class="work-spec-row"><b>제작유형</b><span data-spec="type"></span></div><div class="work-spec-row"><b>특징</b><span data-spec="feature"></span></div><div class="work-spec-row"><b>용도</b><span data-spec="usage"></span></div></div><div class="work-modal-cta"><a class="btn-primary" href="quote.html">이 형태로 견적내기</a><a class="btn-secondary" href="inquiry.html">제작 문의하기</a></div></div></div>`;
  document.body.appendChild(modal);

  const openModal=index=>{
    const item=projects[index];
    if(!item)return;
    const img=modal.querySelector('.work-modal-image');
    img.src=imageUrls[index]||`assets/works/case-${String(index+1).padStart(2,'0')}.svg`;
    img.alt=item.title;
    modal.querySelector('.work-modal-kicker').textContent=item.kicker;
    modal.querySelector('.work-modal-title').textContent=item.title;
    modal.querySelector('.work-modal-desc').textContent=item.desc;
    modal.querySelector('[data-spec="type"]').textContent=item.type;
    modal.querySelector('[data-spec="feature"]').textContent=item.feature;
    modal.querySelector('[data-spec="usage"]').textContent=item.usage;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  };
  const closeModal=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');};
  cards.forEach((card,index)=>{
    card.addEventListener('click',()=>openModal(index));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(index);}});
  });
  modal.querySelectorAll('[data-work-close]').forEach(el=>el.addEventListener('click',closeModal));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();});
});
