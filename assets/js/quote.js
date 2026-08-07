const PRODUCTS=[
  {id:'paper-tuck',cat:'paper',name:'맞뚜껑 단상자',moq:500,tags:'기본형',visual:'graphic'},
  {id:'paper-cross',cat:'paper',name:'십자조립 단상자',moq:500,tags:'조립형',visual:'graphic'},
  {id:'paper-glue',cat:'paper',name:'삼면접착 단상자',moq:500,tags:'화장품 · 식품',visual:'photo-box'},
  {id:'paper-y1',cat:'paper',name:'Y형 상하 박스',moq:500,tags:'조립형',visual:'graphic'},
  {id:'paper-y2',cat:'paper',name:'Y형 이중고 박스',moq:500,tags:'조립형',visual:'graphic'},
  {id:'paper-sleeve',cat:'paper',name:'Y형 슬리브 박스',moq:500,tags:'슬리브',visual:'photo-box'},
  {id:'paper-g',cat:'paper',name:'G형 조립 박스',moq:500,tags:'조립형',visual:'graphic'},
  {id:'paper-handle',cat:'paper',name:'하우스 끈손잡이 박스',moq:500,tags:'손잡이형',visual:'graphic-handle'},
  {id:'paper-window',cat:'paper',name:'오픈 창문형 단상자',moq:500,tags:'제품 노출형',visual:'graphic-window'},
  {id:'paper-hang',cat:'paper',name:'행잉탭 박스',moq:500,tags:'리테일 진열',visual:'graphic-hang'},
  {id:'paper-donut',cat:'paper',name:'도넛 · 베이커리 박스',moq:500,tags:'식품',visual:'photo-box'},
  {id:'paper-slide',cat:'paper',name:'슬라이드 상자',moq:500,tags:'서랍형',visual:'graphic-drawer'},
  {id:'corr-g',cat:'corrugated',name:'골판지 G형 박스',moq:500,tags:'배송 · 선물',visual:'photo-corr'},
  {id:'corr-handle',cat:'corrugated',name:'골판지 손잡이 박스',moq:500,tags:'세트 · 선물',visual:'graphic-handle'},
  {id:'corr-separate',cat:'corrugated',name:'골판지 분리형 박스',moq:500,tags:'조립형',visual:'graphic'},
  {id:'corr-shopping',cat:'corrugated',name:'쇼핑백형 골판지 박스',moq:500,tags:'핸들형',visual:'graphic-handle'},
  {id:'corr-shipping',cat:'corrugated',name:'택배박스',moq:500,tags:'배송용',visual:'photo-corr'},
  {id:'corr-laminated',cat:'corrugated',name:'골판지 합지박스',moq:500,tags:'칼라박스',visual:'photo-box'},
  {id:'corr-gift1',cat:'corrugated',name:'선물박스 · 플라스틱 손잡이',moq:500,tags:'선물포장',visual:'graphic-handle'},
  {id:'corr-gift2',cat:'corrugated',name:'선물박스 · 종이 손잡이',moq:500,tags:'선물포장',visual:'graphic-handle'},
  {id:'rigid-cover',cat:'rigid',name:'표지 싸바리 박스',moq:500,tags:'프리미엄 · 자석',visual:'photo-rigid'},
  {id:'rigid-2',cat:'rigid',name:'2단 싸바리 박스',moq:500,tags:'상하 분리',visual:'graphic-rigid'},
  {id:'rigid-3',cat:'rigid',name:'3단 싸바리 박스',moq:500,tags:'고급 선물',visual:'graphic-rigid'},
  {id:'rigid-drawer',cat:'rigid',name:'서랍형 싸바리',moq:500,tags:'슬라이드',visual:'graphic-drawer'},
  {id:'rigid-magnet',cat:'rigid',name:'자석 싸바리',moq:500,tags:'프리미엄',visual:'photo-rigid'},
  {id:'bag-basic',cat:'bag',name:'종이 쇼핑백',moq:500,tags:'브랜드 · 리테일',visual:'photo-bag'},
  {id:'bag-triangle',cat:'bag',name:'삼각 쇼핑백',moq:500,tags:'특수 구조',visual:'graphic-bag'},
  {id:'other',cat:'other',name:'기타 · 특수제작',moq:0,tags:'목록에 없는 제작',visual:'graphic-other'}
];
const CATS=[['all','전체'],['paper','종이박스'],['corrugated','골판지'],['rigid','싸바리'],['bag','쇼핑백'],['other','기타']];
const QTY=[500,1000,2000,3000,5000,10000,'직접입력'];
const PAPER_MATERIALS=window.FINEB_PAPER_MATERIALS||[];
const CORR_MATERIALS=window.FINEB_CORR_MATERIALS||[];
const PRINT_METHODS=['옵셋 인쇄','UV 인쇄','실크 인쇄','수지판 인쇄','기타'];
const PRINT_COLORS=['먹 1도','별색 1도','별색 2도','CMYK 4도','CMYK + 별색','인쇄 없음'];
const PRINT_SIDES=['외부','내부','내·외부'];
const COATINGS=['코팅 없음','무광 라미네이팅','유광 라미네이팅','기타'];
const FINISHES=['금박','은박','먹박','컬러박','홀로그램박','형압','디보싱','부분에폭시','타공','창문','미싱'];
const INSERTS=['없음','종이 패드','골판지 패드','EVA','스펀지','PET','펄프','기타'];
const state={step:1,maxStep:1,cat:'all',product:null,qty:null,customQty:null,w:'',d:'',h:'',paper:null,gsm:null,printMethod:null,printColor:null,printSide:null,coating:null,finishes:[],insert:'없음'};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function thumb(p){const photo=p.visual?.startsWith('photo-');return `<div class="product-thumb ${photo?'is-photo':''} ${p.visual||'graphic'}" aria-hidden="true"><span class="product-thumb-icon"></span></div>`;}
function materials(){return state.product?.cat==='corrugated'?CORR_MATERIALS:PAPER_MATERIALS}
function renderCats(){$('#categoryTabs').innerHTML=CATS.map(([id,label])=>`<button class="choice ${state.cat===id?'selected':''}" data-cat="${id}" type="button">${label}</button>`).join('');$$('#categoryTabs [data-cat]').forEach(b=>b.onclick=()=>{state.cat=b.dataset.cat;renderCats();renderProducts();});}
function renderProducts(){const list=state.cat==='all'?PRODUCTS:PRODUCTS.filter(p=>p.cat===state.cat);$('#productGrid').innerHTML=list.map(p=>`<button type="button" class="option-card product-option ${state.product?.id===p.id?'selected':''}" data-product="${p.id}">${thumb(p)}<strong>${p.name}</strong><small>${p.moq?`최소 ${p.moq.toLocaleString()}개 · `:''}${p.tags}</small></button>`).join('');$$('#productGrid [data-product]').forEach(c=>c.onclick=()=>{state.product=PRODUCTS.find(p=>p.id===c.dataset.product);state.paper=null;state.gsm=null;renderProducts();renderPapers();renderGsm();updateSummary();});}
function renderQty(){$('#qtyGrid').innerHTML=QTY.map(q=>`<button type="button" class="choice ${state.qty===q?'selected':''}" data-qty="${q}">${typeof q==='number'?q.toLocaleString()+'개':q}</button>`).join('')+(state.qty==='직접입력'?`<div class="input-wrap" style="grid-column:1/-1"><label>직접 수량 입력</label><input id="customQty" inputmode="numeric" value="${state.customQty||''}" placeholder="예: 15000"></div>`:'');$$('#qtyGrid [data-qty]').forEach(c=>c.onclick=()=>{state.qty=isNaN(Number(c.dataset.qty))?c.dataset.qty:Number(c.dataset.qty);renderQty();updateSummary();});$('#customQty')?.addEventListener('input',e=>{state.customQty=e.target.value;updateSummary();});}
function paperThumb(p){return `<div class="paper-swatch paper-tone-${p.tone||'white'}"></div>`}
function renderPapers(){const list=materials();$('#paperGrid').innerHTML=list.map(p=>`<button type="button" class="paper-card ${state.paper?.id===p.id?'selected':''}" data-paper="${p.id}">${paperThumb(p)}<div class="paper-info"><strong>${p.name}</strong><small>${p.note}</small></div></button>`).join('');$$('#paperGrid [data-paper]').forEach(c=>c.onclick=()=>{state.paper=list.find(p=>p.id===c.dataset.paper);state.gsm=null;renderPapers();renderGsm();updateSummary();});}
function renderGsm(){if(!state.paper){$('#gsmGrid').innerHTML='<span class="muted">먼저 종이·소재를 선택해주세요.</span>';return}if(!state.paper.gsm.length){$('#gsmGrid').innerHTML='<span class="muted">해당 소재는 평량 대신 골 규격으로 선택됩니다.</span>';return}$('#gsmGrid').innerHTML=state.paper.gsm.map(g=>`<button type="button" class="choice ${state.gsm===g?'selected':''}" data-gsm="${g}">${g} GSM</button>`).join('');$$('#gsmGrid [data-gsm]').forEach(b=>b.onclick=()=>{state.gsm=Number(b.dataset.gsm);renderGsm();updateSummary();});}
function renderSingle(selector,items,key){$(selector).innerHTML=items.map(v=>`<button type="button" class="option-card ${state[key]===v?'selected':''}" data-value="${v}"><strong>${v}</strong></button>`).join('');$$(`${selector} [data-value]`).forEach(c=>c.onclick=()=>{state[key]=c.dataset.value;renderSingle(selector,items,key);updateSummary();});}
function renderFinish(){$('#finishGrid').innerHTML=FINISHES.map(v=>`<button type="button" class="option-card ${state.finishes.includes(v)?'selected':''}" data-value="${v}"><strong>${v}</strong></button>`).join('');$$('#finishGrid [data-value]').forEach(c=>c.onclick=()=>{const v=c.dataset.value;state.finishes=state.finishes.includes(v)?state.finishes.filter(x=>x!==v):[...state.finishes,v];renderFinish();updateSummary();});}
function captureDimensions(){state.w=$('#width')?.value.trim()||'';state.d=$('#depth')?.value.trim()||'';state.h=$('#height')?.value.trim()||''}
function qtyLabel(){if(state.qty==='직접입력')return state.customQty?Number(state.customQty).toLocaleString()+'개':'직접입력';return state.qty?Number(state.qty).toLocaleString()+'개':'-'}
function updateSummary(){captureDimensions();const material=state.paper?`${state.paper.name}${state.gsm?' / '+state.gsm+'gsm':''}`:'-';const print=[state.printMethod,state.printColor,state.printSide].filter(Boolean).join(' / ')||'-';const rows=[['박스 형태',state.product?.name||'-'],['수량',qtyLabel()],['완성 사이즈',state.w&&state.d&&state.h?`${state.w} × ${state.d} × ${state.h} mm`:'-'],['종이 · 소재',material],['인쇄',print],['코팅',state.coating||'-'],['후가공',state.finishes.length?state.finishes.join(', '):'-'],['내부 구성',state.insert||'-']];$('#summaryList').innerHTML=rows.map(([k,v])=>`<div class="summary-row"><span>${k}</span><strong>${v}</strong></div>`).join('');$('#miniProcess').innerHTML=[['01','BOX',state.product?.name||'미선택'],['02','PAPER',state.paper?.name||'미선택'],['03','PRINT',state.printMethod||'미선택'],['04','FINISH',state.coating||'미선택']].map(([n,k,v])=>`<div><b>${n}</b><span><small>${k}</small>${v}</span></div>`).join('');}
function updateTrack(){$$('.track-item').forEach((item,i)=>{const n=i+1;item.classList.toggle('active',n===state.step);item.classList.toggle('done',n<state.step||n<state.maxStep);});}
function showStep(n){state.step=n;state.maxStep=Math.max(state.maxStep,n);$$('.quote-step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===n));updateTrack();updateSummary();window.scrollTo({top:$('.quote-process-strip').offsetTop-72,behavior:'smooth'});}
function validateStep(n){if(n===1){captureDimensions();if(!state.product){alert('박스 형태를 선택해주세요.');return false}if(!state.qty||(state.qty==='직접입력'&&!state.customQty)){alert('제작 수량을 선택해주세요.');return false}if(!state.w||!state.d||!state.h){alert('완성 사이즈를 입력해주세요.');return false}}if(n===2){if(!state.paper){alert('종이·소재를 선택해주세요.');return false}if(state.paper.gsm.length&&!state.gsm){alert('평량을 선택해주세요.');return false}}if(n===3&&!state.printMethod){alert('인쇄 방식을 선택해주세요.');return false}return true;}
function saveRequest(payload){const key='fineb_quote_requests';const list=JSON.parse(localStorage.getItem(key)||'[]');list.unshift(payload);localStorage.setItem(key,JSON.stringify(list.slice(0,200)));localStorage.setItem('fineb_quote_draft',JSON.stringify(payload));}
function submitQuote(){const name=$('#name').value.trim(),phone=$('#phone').value.trim(),email=$('#email').value.trim();if(!name||!phone||!email){alert('담당자명, 연락처, 이메일을 입력해주세요.');return}captureDimensions();const files=[...$('#fileInput').files];const payload={id:'Q-'+Date.now(),type:'quote',status:'신규',createdAt:new Date().toISOString(),company:$('#company').value.trim(),name,phone,email,message:$('#message').value.trim(),files:files.map(f=>({name:f.name,size:f.size})),spec:{product:state.product?.name||'',category:state.product?.cat||'',qty:qtyLabel(),size:state.w&&state.d&&state.h?`${state.w} × ${state.d} × ${state.h} mm`:'',paper:state.paper?.name||'',gsm:state.gsm||'',printMethod:state.printMethod||'',printColor:state.printColor||'',printSide:state.printSide||'',coating:state.coating||'',finishes:[...state.finishes],insert:state.insert||''}};saveRequest(payload);alert('견적 요청이 저장되었습니다. 어드민 페이지에서 확인할 수 있습니다.');}
function init(){const qp=new URLSearchParams(location.search).get('cat');if(CATS.some(([id])=>id===qp))state.cat=qp;renderCats();renderProducts();renderQty();renderPapers();renderGsm();renderSingle('#printMethodGrid',PRINT_METHODS,'printMethod');renderSingle('#printColorGrid',PRINT_COLORS,'printColor');renderSingle('#printSideGrid',PRINT_SIDES,'printSide');renderSingle('#coatingGrid',COATINGS,'coating');renderFinish();renderSingle('#insertGrid',INSERTS,'insert');updateSummary();updateTrack();['width','depth','height'].forEach(id=>$('#'+id)?.addEventListener('input',updateSummary));$$('.next-step').forEach(btn=>btn.addEventListener('click',()=>{if(validateStep(state.step))showStep(Math.min(5,state.step+1));}));$$('.prev-step').forEach(btn=>btn.addEventListener('click',()=>showStep(Math.max(1,state.step-1))));$$('.track-item').forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.jump);if(n<=state.maxStep)showStep(n);}));$('#submitQuote').addEventListener('click',submitQuote);}
document.addEventListener('DOMContentLoaded',init);