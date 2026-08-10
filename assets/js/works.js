document.addEventListener('DOMContentLoaded',()=>{
  const data={
    'gamtae-noodle':{sprite:'sprite-01',kicker:'PAPER BOX',title:'감태 수연면 패키지',desc:'감태 수연면 제품을 위한 단상자 제작 사례입니다. 세로형 제품 규격에 맞춰 패키지 구조와 전면 정보 구성을 정리했습니다.',type:'단상자',feature:'세로형 제품 패키지',usage:'식품 패키지'},
    'gamtae-caramel':{sprite:'sprite-02',kicker:'PAPER BOX',title:'감태 캬라멜 단상자',desc:'감태 캬라멜 제품을 위한 단상자 사례입니다. 제품의 인상과 정보를 한 면 안에서 명확하게 전달할 수 있도록 구성한 패키지입니다.',type:'단상자',feature:'제품 판매용 패키지',usage:'식품 패키지'},
    'pumpkin-handle':{sprite:'sprite-03',kicker:'SPECIAL STRUCTURE',title:'호박즙 손잡이형 선물상자',desc:'호박즙 제품의 보관과 이동을 고려한 손잡이형 선물상자입니다. 별도 쇼핑백 없이 들고 이동할 수 있는 구조가 특징입니다.',type:'손잡이형 선물상자',feature:'일체형 손잡이 구조',usage:'건강식품 · 선물 패키지'},
    'premium-kim':{sprite:'sprite-04',kicker:'GIFT PACKAGE',title:'프리미엄 김 선물세트',desc:'프리미엄 김 제품을 선물용으로 구성한 패키지 사례입니다. 제품군을 하나의 세트로 묶고 선물용 인상을 강화한 구성이 특징입니다.',type:'선물 패키지',feature:'세트 구성',usage:'식품 · 명절 선물'},
    'persimmon-gift':{sprite:'sprite-05',kicker:'GIFT BOX',title:'곶감 선물세트 상·하',desc:'곶감 제품을 위한 상·하 분리형 선물박스입니다. 뚜껑과 하부를 분리한 구조로 제품을 안정적으로 담고 선물용 완성도를 높였습니다.',type:'상·하 분리형 선물박스',feature:'상·하 구조',usage:'농산물 · 선물 패키지'},
    'therapist-rigid':{sprite:'sprite-06',kicker:'RIGID BOX',title:'더 테라피스트 자석 싸바리',desc:'자석 여닫이 방식의 표지형 싸바리 제작 사례입니다. 반복 개폐가 가능하고 제품을 보호하면서도 프리미엄한 인상을 주는 구조입니다.',type:'자석형 싸바리',feature:'자석 여닫이',usage:'프리미엄 제품 · 선물 패키지'},
    'flower-gift':{sprite:'sprite-07',kicker:'GIFT PACKAGE',title:'꽃차 선물세트 패키지',desc:'꽃차 제품을 한 세트로 구성한 선물 패키지입니다. 여러 제품을 한 번에 정리해 보여줄 수 있도록 내부 구성과 외부 패키지를 함께 맞춘 사례입니다.',type:'선물박스',feature:'세트 패키지',usage:'차 · 식품 선물'},
    'three-spoon':{sprite:'sprite-08',kicker:'SPECIAL RIGID',title:'쓰리스푼 슬리브 싸바리',desc:'슬리브 방식의 싸바리 구조에 부분 에폭시 후가공을 적용한 사례입니다. 구조의 개폐감과 표면의 촉각 포인트를 함께 고려한 패키지입니다.',type:'슬리브 싸바리',feature:'부분 에폭시',usage:'프리미엄 제품 패키지'},
    'massage-rigid':{sprite:'sprite-09',kicker:'RIGID BOX',title:'마사지볼 3단 싸바리',desc:'제품을 단계별로 수납할 수 있도록 3단 구조로 구성한 싸바리 패키지입니다. 여러 구성품을 한 세트로 정리하는 용도에 적합한 사례입니다.',type:'3단 싸바리',feature:'3단 내부 구성',usage:'제품 세트 · 선물 패키지'},
    'honey-box':{sprite:'sprite-10',kicker:'PAPER BOX',title:'꿀 단상자',desc:'꿀 제품을 위한 단상자에 부분 에폭시를 적용한 제작 사례입니다. 단순한 종이박스 구조에 표면 포인트를 더해 제품 인상을 강조했습니다.',type:'단상자',feature:'부분 에폭시',usage:'식품 패키지'},
    'usb-rigid':{sprite:'sprite-11',kicker:'RIGID BOX',title:'보안 USB 자석 표지 싸바리',desc:'보안 USB 제품을 위한 자석형 표지 싸바리입니다. 소형 제품을 안전하게 고정하고 개봉 경험을 고려한 프리미엄 패키지 사례입니다.',type:'자석형 싸바리',feature:'자석 표지 구조',usage:'IT 제품 · 기프트 패키지'},
    'gamtae-vip':{sprite:'sprite-12',kicker:'VIP GIFT',title:'감태 VIP 선물세트',desc:'감태 제품군을 VIP 선물용으로 구성한 패키지입니다. 제품을 한눈에 확인할 수 있는 내부 구성과 선물세트 형태를 함께 설계한 사례입니다.',type:'VIP 선물세트',feature:'다품목 세트 구성',usage:'프리미엄 식품 선물'}
  };
  const modal=document.querySelector('#workModal');
  if(!modal)return;
  const image=modal.querySelector('.work-modal-image');
  const kicker=modal.querySelector('.work-modal-kicker');
  const title=modal.querySelector('.work-modal-title');
  const desc=modal.querySelector('.work-modal-desc');
  const type=modal.querySelector('[data-spec="type"]');
  const feature=modal.querySelector('[data-spec="feature"]');
  const usage=modal.querySelector('[data-spec="usage"]');
  const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');};
  const open=id=>{
    const item=data[id]; if(!item)return;
    image.className=`work-modal-image ${item.sprite}`;
    kicker.textContent=item.kicker; title.textContent=item.title; desc.textContent=item.desc;
    type.textContent=item.type; feature.textContent=item.feature; usage.textContent=item.usage;
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
  };
  document.querySelectorAll('[data-work-id]').forEach(card=>{
    card.addEventListener('click',()=>open(card.dataset.workId));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(card.dataset.workId);}});
  });
  modal.querySelectorAll('[data-modal-close]').forEach(el=>el.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close();});
});