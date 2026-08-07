const PRODUCTS=[
  {id:'paper-tuck',cat:'paper',name:'맞뚜껑 단상자',moq:500,tags:'기본형 · 단상자',assembly:'접지 후 필요 부위 접착'},
  {id:'paper-cross',cat:'paper',name:'십자조립 박스',moq:500,tags:'조립형 · 무접착 가능',assembly:'조립식 구조 · 사양에 따라 무접착'},
  {id:'paper-glue',cat:'paper',name:'삼면접착 단상자',moq:500,tags:'접착형 · 범용',assembly:'접지 후 삼면접착'},
  {id:'paper-y-top',cat:'paper',name:'Y형 상하 박스',moq:500,tags:'상하형 · 선물',assembly:'구조별 접착 및 조립'},
  {id:'paper-y-double',cat:'paper',name:'Y형 이중고 박스',moq:500,tags:'이중 구조',assembly:'이중 구조 접지 · 접착'},
  {id:'paper-y-sleeve',cat:'paper',name:'Y형 슬리브 박스',moq:500,tags:'슬리브 · 세트',assembly:'슬리브와 본체 별도 가공'},
  {id:'paper-g',cat:'paper',name:'G형 조립 박스',moq:500,tags:'조립형',assembly:'톰슨 후 접지 · 조립'},
  {id:'paper-window',cat:'paper',name:'오픈 창문형 단상자',moq:500,tags:'창문 · 제품 노출',assembly:'창문 타공 후 접지 · 접착'},
  {id:'paper-hang',cat:'paper',name:'행잉탭 박스',moq:500,tags:'리테일 진열',assembly:'행잉탭 포함 접지 · 접착'},
  {id:'paper-sleeve',cat:'paper',name:'슬리브 · 띠지',moq:500,tags:'세트 · 보조포장',assembly:'슬리브 접지 · 필요 시 접착'},
  {id:'paper-handle',cat:'paper',name:'하우스 끈손잡이 박스',moq:500,tags:'손잡이형 · 기프트',assembly:'손잡이 부착 및 접착 가공'},
  {id:'paper-gift-handle',cat:'paper',name:'선물박스 · 플라스틱 손잡이',moq:500,tags:'손잡이 · 선물',assembly:'손잡이 부착 및 구조 접착'},
  {id:'paper-gift-paper',cat:'paper',name:'선물박스 · 종이 손잡이',moq:500,tags:'자체 손잡이',assembly:'자체 손잡이 구조 조립'},
  {id:'paper-slide',cat:'paper',name:'서랍형 박스',moq:500,tags:'슬라이드형',assembly:'서랍과 슬리브 별도 가공'},
  {id:'paper-food',cat:'paper',name:'베이커리 · 푸드 박스',moq:500,tags:'식품 · 베이커리',assembly:'구조에 따라 조립 또는 접착'},

  {id:'corr-g',cat:'corrugated',name:'골판지 G형 박스',moq:500,tags:'배송 · 선물',assembly:'골판지 톰슨 후 접지 · 조립'},
  {id:'corr-handle',cat:'corrugated',name:'골판지 손잡이 박스',moq:500,tags:'핸들형',assembly:'손잡이 구조 가공 · 조립'},
  {id:'corr-separate',cat:'corrugated',name:'골판지 분리형 박스',moq:500,tags:'상하 분리형',assembly:'상하 구조 별도 가공 · 조립'},
  {id:'corr-shopping',cat:'corrugated',name:'쇼핑백형 골판지 박스',moq:500,tags:'쇼핑백형',assembly:'손잡이 및 접지 가공'},
  {id:'corr-shipping',cat:'corrugated',name:'택배박스',moq:500,tags:'배송용',assembly:'조립형 · 사양에 따라 무접착'},
  {id:'corr-laminated',cat:'corrugated',name:'골판지 합지 · 칼라박스',moq:500,tags:'합지 · 고급 인쇄',assembly:'인쇄지 합지 후 톰슨 · 접착'},

  {id:'rigid-cover',cat:'rigid',name:'표지 싸바리 박스',moq:500,tags:'표지형 · 프리미엄',assembly:'싸바리 가공 · 합지 · 부자재 부착'},
  {id:'rigid-2',cat:'rigid',name:'2단 싸바리 박스',moq:500,tags:'상하 2단',assembly:'상·하 싸바리 별도 제작 후 세트'},
  {id:'rigid-3',cat:'rigid',name:'3단 싸바리 박스',moq:500,tags:'3단 · 고급 선물',assembly:'3단 구조 싸바리 가공 · 조립'},
  {id:'rigid-drawer',cat:'rigid',name:'서랍형 싸바리',moq:500,tags:'슬라이드형',assembly:'서랍·슬리브 싸바리 별도 제작'},
  {id:'rigid-magnet',cat:'rigid',name:'자석 싸바리',moq:500,tags:'자석 · 프리미엄',assembly:'싸바리 가공 후 자석 부착'},

  {id:'bag-basic',cat:'bag',name:'종이 쇼핑백',moq:500,tags:'브랜드 · 리테일',assembly:'접착 · 끈 부착 · 마감'},
  {id:'bag-triangle',cat:'bag',name:'삼각 쇼핑백',moq:500,tags:'특수 구조',assembly:'특수 접지 · 접착 · 손잡이 부착'},
  {id:'other',cat:'other',name:'기타 · 특수제작',moq:0,tags:'목록에 없는 구조',assembly:'구조 확인 후 공정 별도 안내'}
];

const CATS=[['all','전체'],['paper','종이박스'],['corrugated','골판지'],['rigid','싸바리'],['bag','쇼핑백'],['other','기타']];
const QTY=[500,1000,2000,3000,5000,10000,'직접입력'];

const PAPERS=[
  {id:'sc',name:'SC 마닐라',gsm:[300,350,400],note:'범용 패키지 보드'},
  {id:'iv',name:'IV · 아이보리',gsm:[300,350,400],note:'백색 패키지 보드'},
  {id:'riv',name:'R/IV · 로얄아이보리',gsm:[300,350,400],note:'고급 백색 패키지 보드'},
  {id:'ccp',name:'CCP',gsm:[300,350,400],note:'유광택 계열 · 공급처별 상이'},
  {id:'kraft',name:'크라프트',gsm:[250,300,337],note:'내추럴 크라프트 계열'},
  {id:'eco-black',name:'뉴에코블랙',gsm:[300,350,400],note:'블랙 패키지 보드'},
  {id:'earth',name:'얼스팩',gsm:[295],note:'친환경 계열 · 세부 제품별 상이'},
  {id:'moon',name:'문보드',gsm:[310,350,450,550],note:'고급 특수지'},
  {id:'bamboo-n',name:'밤부팩 N',gsm:[300,350],note:'대나무 펄프 계열'},
  {id:'bamboo-w',name:'밤부팩 W',gsm:[300,350],note:'대나무 펄프 계열'},
  {id:'acopack-ew',name:'아코팩 EW',gsm:[300,350,400],note:'패키지 특수지'},
  {id:'acopack-ww',name:'아코팩 WW',gsm:[300,350,400],note:'패키지 특수지'},
  {id:'oldmill-b',name:'올드밀 B',gsm:[300,350],note:'특수지'},
  {id:'oldmill-ew',name:'올드밀 EW',gsm:[300,350],note:'특수지'},
  {id:'oldmill-pw',name:'올드밀 PW',gsm:[300,350],note:'특수지'},
  {id:'special',name:'특수지 · 수입지',gsm:[],note:'제품명과 평량을 상담 후 확정'}
];

const CORRUGATED=[
  {id:'e-flute',name:'E골',gsm:[],note:'얇은 골판지 · 합지/패키지용'},
  {id:'b-flute',name:'B골',gsm:[],note:'완충성과 강도가 필요한 박스'},
  {id:'e-lami',name:'E골 · 인쇄지 합지',gsm:[],note:'칼라박스 · 고급 인쇄'},
  {id:'b-lami',name:'B골 · 인쇄지 합지',gsm:[],note:'강도 + 인쇄 표현'},
  {id:'corr-other',name:'기타 골판지 사양',gsm:[],note:'용도 확인 후 추천'}
];

const PRINT_METHODS=['옵셋 인쇄','UV 인쇄','실크 인쇄','수지판 인쇄','인쇄 방식 상담'];
const PRINT_COLORS=['먹 1도','별색 1도','별색 2도','CMYK 4도','CMYK + 별색','인쇄 없음'];
const PRINT_SIDES=['외부 인쇄','내부 인쇄','내·외부 인쇄','인쇄 없음'];
const COATINGS=['코팅 없음','무광 라미네이팅','유광 라미네이팅','기타 코팅 상담'];
const FINISHES=['금박','은박','컬러박','홀로그램박','형압','디보싱','부분 UV','부분에폭시','타공','창문','미싱','기타 후가공'];
const SAMPLES=['필요 없음','무지 샘플','인쇄 샘플','교정 인쇄 샘플','실제 사양 샘플'];
const INSERTS=['없음','종이 패드','골판지 패드','EVA','스펀지','PET','펄프','기타'];
const DELIVERIES=['택배','용차 · 화물','파렛트 납품','직접수령','현장 상황 협의'];

const state={
  step:1,maxStep:1,cat:'all',product:null,qty:null,customQty:'',w:'',d:'',h:'',
  paper:null,gsm:null,printMethod:null,printColor:null,printSide:null,coating:null,
  finishes:[],sample:'필요 없음',insert:'없음',delivery:'현장 상황 협의'
};

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function currentPaperList(){
  return state.product?.cat==='corrugated'?CORRUGATED:PAPERS;
}

function boxIcon(p){
  const navy='#0a2240',line='#8e99a8',paper='#f9fafb',kraft='#d7c3a7';
  if(p.cat==='bag') return `<svg viewBox="0 0 180 120" aria-hidden="true"><path d="M48 38h84l-8 68H56z" fill="${paper}" stroke="${navy}"/><path d="M69 40c0-21 42-21 42 0" fill="none" stroke="${navy}" stroke-width="2"/></svg>`;
  if(p.cat==='rigid') return `<svg viewBox="0 0 180 120" aria-hidden="true"><rect x="38" y="48" width="104" height="48" rx="2" fill="${navy}"/><path d="M38 48l22-22h103l-21 22" fill="#45526c"/><path d="M142 48l21-22v47l-21 23" fill="#7f879a"/></svg>`;
  if(p.cat==='corrugated') return `<svg viewBox="0 0 180 120" aria-hidden="true"><path d="M38 48h104v50H38z" fill="${kraft}" stroke="${navy}"/><path d="M38 48l25-18h104l-25 18M142 48l25-18v50l-25 18" fill="none" stroke="${navy}"/><path d="M46 77h86" stroke="${line}" stroke-dasharray="3 3"/></svg>`;
  return `<svg viewBox="0 0 180 120" aria-hidden="true"><rect x="42" y="40" width="96" height="60" rx="2" fill="${paper}" stroke="${navy}"/><path d="M42 40l25-16h96l-25 16M138 40l25-16v60l-25 16" fill="none" stroke="${line}"/></svg>`;
}

function renderCats(){
  $('#categoryTabs').innerHTML=CATS.map(([id,label])=>`<button class="choice ${state.cat===id?'selected':''}" data-cat="${id}" type="button">${label}</button>`).join('');
  $$('#categoryTabs [data-cat]').forEach(btn=>btn.onclick=()=>{state.cat=btn.dataset.cat;renderCats();renderProducts();});
}

function renderProducts(){
  const list=state.cat==='all'?PRODUCTS:PRODUCTS.filter(p=>p.cat===state.cat);
  $('#productGrid').innerHTML=list.map(p=>`<button class="product-card ${state.product?.id===p.id?'selected':''}" data-product="${p.id}" type="button"><span class="product-visual">${boxIcon(p)}</span><span class="product-copy"><strong>${p.name}</strong><small>${p.moq?`기본 선택 ${p.moq.toLocaleString()}개부터 · `:''}${p.tags}</small></span><i>✓</i></button>`).join('');
  $$('#productGrid [data-product]').forEach(card=>card.onclick=()=>{
    state.product=PRODUCTS.find(p=>p.id===card.dataset.product);
    state.paper=null;state.gsm=null;
    renderProducts();renderPapers();renderGsm();updateAssembly();updateSummary();
  });
}

function renderQty(){
  $('#qtyGrid').innerHTML=QTY.map(q=>`<button class="choice ${state.qty===q?'selected':''}" data-qty="${q}" type="button">${typeof q==='number'?q.toLocaleString()+'개':q}</button>`).join('')+(state.qty==='직접입력'?`<div class="input-wrap custom-qty"><label>직접 수량 입력</label><input id="customQty" inputmode="numeric" value="${state.customQty}" placeholder="예: 15000"></div>`:'');
  $$('#qtyGrid [data-qty]').forEach(btn=>btn.onclick=()=>{
    const raw=btn.dataset.qty; state.qty=raw==='직접입력'?raw:Number(raw); renderQty();updateSummary();
  });
  $('#customQty')?.addEventListener('input',e=>{state.customQty=e.target.value.replace(/[^0-9]/g,'');updateSummary();});
}

function renderPapers(){
  const list=currentPaperList();
  $('#paperGrid').innerHTML=list.map((p,i)=>`<button class="paper-card ${state.paper?.id===p.id?'selected':''}" data-paper="${p.id}" type="button"><span class="paper-swatch swatch-${(i%6)+1}"></span><span class="paper-info"><strong>${p.name}</strong><small>${p.note}</small></span><i>✓</i></button>`).join('');
  $$('#paperGrid [data-paper]').forEach(card=>card.onclick=()=>{
    state.paper=list.find(p=>p.id===card.dataset.paper);state.gsm=null;renderPapers();renderGsm();updateSummary();
  });
}

function renderGsm(){
  if(!state.paper){$('#gsmGrid').innerHTML='<span class="muted">먼저 종이 · 소재를 선택해주세요.</span>';return;}
  if(!state.paper.gsm.length){$('#gsmGrid').innerHTML='<span class="muted">이 소재는 세부 규격을 제품과 구조에 맞춰 상담 후 확정합니다.</span>';return;}
  $('#gsmGrid').innerHTML=state.paper.gsm.map(g=>`<button class="choice ${state.gsm===g?'selected':''}" data-gsm="${g}" type="button">${g} GSM</button>`).join('');
  $$('#gsmGrid [data-gsm]').forEach(btn=>btn.onclick=()=>{state.gsm=Number(btn.dataset.gsm);renderGsm();updateSummary();});
}

function renderSingleOptions(el,arr,key){
  $(el).innerHTML=arr.map(v=>`<button class="option-card ${state[key]===v?'selected':''}" data-value="${v}" type="button"><strong>${v}</strong><i>✓</i></button>`).join('');
  $$(`${el} [data-value]`).forEach(card=>card.onclick=()=>{state[key]=card.dataset.value;renderSingleOptions(el,arr,key);updateSummary();});
}

function renderFinish(){
  $('#finishGrid').innerHTML=FINISHES.map(v=>`<button class="option-card ${state.finishes.includes(v)?'selected':''}" data-value="${v}" type="button"><strong>${v}</strong><i>✓</i></button>`).join('');
  $$('#finishGrid [data-value]').forEach(card=>card.onclick=()=>{
    const v=card.dataset.value;
    state.finishes=state.finishes.includes(v)?state.finishes.filter(x=>x!==v):[...state.finishes,v];
    renderFinish();updateSummary();
  });
}

function updateAssembly(){
  const el=$('#assemblyDescription'); if(el) el.textContent=state.product?.assembly||'선택한 박스 구조에 맞춰 접착 또는 조립';
}

function captureDimensions(){
  state.w=$('#width')?.value.trim()||state.w;
  state.d=$('#depth')?.value.trim()||state.d;
  state.h=$('#height')?.value.trim()||state.h;
}

function qtyLabel(){
  if(state.qty==='직접입력') return state.customQty?Number(state.customQty).toLocaleString()+'개':'직접입력';
  return state.qty?Number(state.qty).toLocaleString()+'개':'-';
}

function updateSummary(){
  captureDimensions();
  const size=state.w&&state.d&&state.h?`${state.w} × ${state.d} × ${state.h} mm`:'-';
  const material=state.paper?`${state.paper.name}${state.gsm?' / '+state.gsm+'gsm':''}`:'-';
  const print=[state.printMethod,state.printColor,state.printSide].filter(Boolean).join(' / ')||'-';
  const rows=[
    ['박스 형태',state.product?.name||'-'],['수량',qtyLabel()],['완성 사이즈',size],['종이 · 소재',material],
    ['인쇄',print],['코팅',state.coating||'-'],['후가공',state.finishes.length?state.finishes.join(', '):'-'],
    ['톰슨 · 접착',state.product?.assembly||'-'],['샘플',state.sample],['내부 구성',state.insert],['납품',state.delivery]
  ];
  $('#summaryList').innerHTML=rows.map(([k,v])=>`<div class="summary-row"><span>${k}</span><strong>${v}</strong></div>`).join('');
  $('#miniProcess').innerHTML=[
    ['01','BOX',state.product?.name||'미선택'],['02','PAPER',state.paper?.name||'미선택'],['03','PRINT',state.printMethod||'미선택'],
    ['04','FINISH',state.coating||'미선택'],['05','THOMSON',state.product?'구조에 맞춰 적용':'미선택']
  ].map(([n,k,v])=>`<div><b>${n}</b><span><small>${k}</small>${v}</span></div>`).join('');
}

function updateTrack(){
  $$('.track-item').forEach((item,i)=>{
    const n=i+1;item.classList.toggle('active',n===state.step);item.classList.toggle('done',n<state.step||n<state.maxStep);
  });
}

function showStep(n){
  state.step=n;state.maxStep=Math.max(state.maxStep,n);
  $$('.quote-step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===n));
  updateTrack();updateSummary();
  const top=$('.quote-process-strip').offsetTop-70;window.scrollTo({top,behavior:'smooth'});
}

function validateStep(n){
  if(n===1){
    captureDimensions();
    if(!state.product){alert('원하시는 박스 형태를 선택해주세요.');return false;}
    if(!state.qty||(state.qty==='직접입력'&&!state.customQty)){alert('제작 수량을 선택해주세요.');return false;}
    if(!state.w||!state.d||!state.h){alert('완성 사이즈 W / D / H를 입력해주세요.');return false;}
  }
  if(n===2){
    if(!state.paper){alert('종이 · 소재를 선택해주세요.');return false;}
    if(state.paper.gsm.length&&!state.gsm){alert('평량을 선택해주세요.');return false;}
  }
  if(n===3){
    if(!state.printMethod||!state.printColor||!state.printSide){alert('인쇄 방식, 색상, 인쇄 면을 선택해주세요.');return false;}
  }
  if(n===4&&!state.coating){alert('코팅 여부를 선택해주세요.');return false;}
  return true;
}

function submitQuote(){
  const name=$('#name').value.trim(),phone=$('#phone').value.trim(),email=$('#email').value.trim();
  if(!name||!phone||!email){alert('담당자명, 연락처, 이메일을 입력해주세요.');return;}
  captureDimensions();
  const payload={...state,company:$('#company').value.trim(),name,phone,email,message:$('#message').value.trim(),files:[...$('#fileInput').files].map(f=>f.name),createdAt:new Date().toISOString()};
  localStorage.setItem('fineb_quote_draft',JSON.stringify(payload));
  alert('제작 사양이 정리되었습니다. 현재는 개발 단계로 실제 서버 접수는 연결 전입니다. 다음 단계에서 문의 DB와 연결할 예정입니다.');
}

function init(){
  const qp=new URLSearchParams(location.search).get('cat');if(CATS.some(([id])=>id===qp))state.cat=qp;
  renderCats();renderProducts();renderQty();renderPapers();renderGsm();
  renderSingleOptions('#printMethodGrid',PRINT_METHODS,'printMethod');
  renderSingleOptions('#printColorGrid',PRINT_COLORS,'printColor');
  renderSingleOptions('#printSideGrid',PRINT_SIDES,'printSide');
  renderSingleOptions('#coatingGrid',COATINGS,'coating');
  renderFinish();
  renderSingleOptions('#sampleGrid',SAMPLES,'sample');
  renderSingleOptions('#insertGrid',INSERTS,'insert');
  renderSingleOptions('#deliveryGrid',DELIVERIES,'delivery');
  updateAssembly();updateSummary();updateTrack();

  ['width','depth','height'].forEach(id=>$('#'+id)?.addEventListener('input',updateSummary));
  $$('.next-step').forEach(btn=>btn.addEventListener('click',()=>{if(validateStep(state.step))showStep(Math.min(6,state.step+1));}));
  $$('.prev-step').forEach(btn=>btn.addEventListener('click',()=>showStep(Math.max(1,state.step-1))));
  $$('.track-item').forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.jump);if(n<=state.maxStep)showStep(n);}));
  $('#submitQuote').addEventListener('click',submitQuote);
}

document.addEventListener('DOMContentLoaded',init);