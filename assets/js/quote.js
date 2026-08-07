const PRODUCTS=[
 {id:'paper-glue',cat:'paper',name:'종이 단상자 · 삼면접착',moq:500,tags:'화장품 · 식품'},
 {id:'paper-window',cat:'paper',name:'종이 단상자 · 오픈 창문형',moq:500,tags:'제품 노출형'},
 {id:'paper-kraft',cat:'paper',name:'크라프트 단상자',moq:500,tags:'친환경 · 식품'},
 {id:'paper-cross',cat:'paper',name:'십자조립 단상자',moq:500,tags:'조립형'},
 {id:'paper-tuck',cat:'paper',name:'맞뚜껑 단상자',moq:500,tags:'기본형'},
 {id:'paper-perf',cat:'paper',name:'이중미싱 단상자',moq:500,tags:'개봉 편의'},
 {id:'paper-hang',cat:'paper',name:'행잉탭 박스',moq:500,tags:'리테일 진열'},
 {id:'paper-triangle',cat:'paper',name:'삼각 박스',moq:500,tags:'특수 구조'},
 {id:'paper-neck',cat:'paper',name:'넥다운 박스',moq:500,tags:'병 · 용기'},
 {id:'paper-sleeve',cat:'paper',name:'슬리브 · 띠지',moq:500,tags:'세트 · 보조포장'},
 {id:'paper-donut',cat:'paper',name:'도넛 · 베이커리 박스',moq:500,tags:'베이커리'},
 {id:'paper-cookie',cat:'paper',name:'쿠키 박스',moq:500,tags:'식품'},
 {id:'paper-halfmoon',cat:'paper',name:'반달 상자',moq:500,tags:'기프트'},
 {id:'paper-slide',cat:'paper',name:'슬라이드 상자',moq:500,tags:'서랍형'},
 {id:'paper-pizza',cat:'paper',name:'피자 · 푸드 박스',moq:500,tags:'식품'},
 {id:'paper-handle',cat:'paper',name:'핸들 박스',moq:500,tags:'손잡이형'},
 {id:'corr-g',cat:'corrugated',name:'골판지 G형 박스',moq:500,tags:'배송 · 선물'},
 {id:'corr-handle',cat:'corrugated',name:'골판지 손잡이 박스',moq:500,tags:'세트 · 선물'},
 {id:'corr-separate',cat:'corrugated',name:'골판지 분리형 박스',moq:500,tags:'조립형'},
 {id:'corr-shopping',cat:'corrugated',name:'쇼핑백형 골판지 박스',moq:500,tags:'핸들형'},
 {id:'corr-shipping',cat:'corrugated',name:'택배박스',moq:500,tags:'배송용'},
 {id:'corr-laminated',cat:'corrugated',name:'골판지 합지박스',moq:500,tags:'고급 인쇄'},
 {id:'rigid-cover',cat:'rigid',name:'표지 싸바리 박스',moq:500,tags:'프리미엄 · 자석'},
 {id:'rigid-2',cat:'rigid',name:'2단 싸바리 박스',moq:500,tags:'상하 분리'},
 {id:'rigid-3',cat:'rigid',name:'3단 싸바리 박스',moq:500,tags:'고급 선물'},
 {id:'rigid-drawer',cat:'rigid',name:'서랍형 싸바리',moq:500,tags:'슬라이드'},
 {id:'rigid-magnet',cat:'rigid',name:'자석 싸바리',moq:500,tags:'프리미엄'},
 {id:'bag-basic',cat:'bag',name:'종이 쇼핑백',moq:500,tags:'브랜드 · 리테일'},
 {id:'bag-triangle',cat:'bag',name:'삼각 쇼핑백',moq:500,tags:'특수 구조'},
 {id:'other',cat:'other',name:'기타 · 특수제작',moq:0,tags:'목록에 없는 제작'}
];
const CATS=[['all','전체'],['paper','종이박스'],['corrugated','골판지'],['rigid','싸바리'],['bag','쇼핑백'],['other','기타']];
const QTY=[500,1000,2000,3000,5000,10000,'직접입력'];
// 제작기에서 사용할 우선 평량. 실제 발주 시 공급처 재고/제품 규격 확인 후 최종 확정.
const PAPERS=[
 {id:'ab',name:'AB / 로얄아이보리',gsm:[300,350,400],note:'패키지 보드'},
 {id:'iv',name:'IV / 아이보리',gsm:[300,350,400],note:'백색 패키지 보드'},
 {id:'ccp',name:'CCP',gsm:[300,350,400],note:'고광택 계열 · 공급처별 상이'},
 {id:'sc',name:'SC 마닐라',gsm:[300,350,400],note:'범용 패키지 보드'},
 {id:'eco-kraft',name:'뉴에코크라프트',gsm:[300,337],note:'크라프트'},
 {id:'eco-black',name:'뉴에코블랙',gsm:[300,350,400],note:'블랙 보드'},
 {id:'earth',name:'얼스팩',gsm:[295],note:'친환경 · 세부 제품별 상이'},
 {id:'moon',name:'문보드',gsm:[310,350,450,550],note:'고급 특수지'},
 {id:'bamboo-n',name:'밤부팩 N',gsm:[300,350],note:'대나무 펄프 계열'},
 {id:'bamboo-w',name:'밤부팩 W',gsm:[300,350],note:'대나무 펄프 계열'},
 {id:'acopack-ew',name:'아코팩 EW',gsm:[300,350,400],note:'패키지 특수지'},
 {id:'acopack-ww',name:'아코팩 WW',gsm:[300,350,400],note:'패키지 특수지'},
 {id:'oldmill-b',name:'올드밀 B',gsm:[300,350],note:'특수지'},
 {id:'oldmill-ew',name:'올드밀 EW',gsm:[300,350],note:'특수지'},
 {id:'oldmill-pw',name:'올드밀 PW',gsm:[300,350],note:'특수지'}
];
const PRINTS=['먹 1도','별색 1도','별색 2도','CMYK 4도','CMYK + 별색','인쇄 없음'];
const COATINGS=['코팅 없음','무광 라미네이팅','유광 라미네이팅','벨벳 코팅','기타'];
const FINISHES=['금박','은박','먹박','컬러박','홀로그램박','형압','디보싱','부분 UV','에폭시','타공','창문','미싱'];
const SAMPLES=['필요 없음','무지 샘플','인쇄 샘플','실제 사양 샘플'];
const INSERTS=['없음','종이 패드','골판지 패드','EVA','스펀지','PET','펄프','기타'];
const DELIVERIES=['택배','화물','직접수령','협의'];
const state={step:1,cat:'all',product:null,qty:null,customQty:null,w:'',d:'',h:'',paper:null,gsm:null,print:null,coating:null,finishes:[],sample:null,insert:null,delivery:null};

const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
function boxIcon(cat){
 const fill=cat==='rigid'?'#0a2240':cat==='corrugated'?'#d9cbb8':cat==='bag'?'#eef1f5':'#fff';
 return `<svg viewBox="0 0 160 90" width="100%" height="84" aria-hidden="true"><rect x="34" y="23" width="92" height="54" rx="4" fill="${fill}" stroke="#0a2240" stroke-width="1.3"/><path d="M34 23l24-13h91l-23 13M126 23l23-13v54l-23 13" fill="none" stroke="#7f879a" stroke-width="1.3"/></svg>`;
}
function renderCats(){
 $('#categoryTabs').innerHTML=CATS.map(([id,label])=>`<button class="choice ${state.cat===id?'selected':''}" data-cat="${id}" type="button">${label}</button>`).join('');
 $$('#categoryTabs [data-cat]').forEach(b=>b.onclick=()=>{state.cat=b.dataset.cat;renderCats();renderProducts();});
}
function renderProducts(){
 let list=state.cat==='all'?PRODUCTS:PRODUCTS.filter(p=>p.cat===state.cat);
 $('#productGrid').innerHTML=list.map(p=>`<div class="option-card ${state.product?.id===p.id?'selected':''}" data-product="${p.id}">${boxIcon(p.cat)}<strong>${p.name}</strong><small>${p.moq?`최소 ${p.moq.toLocaleString()}개 · `:''}${p.tags}</small></div>`).join('');
 $$('#productGrid [data-product]').forEach(c=>c.onclick=()=>{state.product=PRODUCTS.find(p=>p.id===c.dataset.product);renderProducts();updateSummary();});
}
function renderQty(){
 $('#qtyGrid').innerHTML=QTY.map(q=>`<div class="choice ${state.qty===q?'selected':''}" data-qty="${q}">${typeof q==='number'?q.toLocaleString()+'개':q}</div>`).join('')+(state.qty==='직접입력'?`<div class="input-wrap" style="grid-column:1/-1"><label>직접 수량 입력</label><input id="customQty" inputmode="numeric" value="${state.customQty||''}" placeholder="예: 15000"></div>`:'');
 $$('#qtyGrid [data-qty]').forEach(c=>c.onclick=()=>{state.qty=isNaN(Number(c.dataset.qty))?c.dataset.qty:Number(c.dataset.qty);renderQty();updateSummary();});
 $('#customQty')?.addEventListener('input',e=>{state.customQty=e.target.value;updateSummary();});
}
function renderPapers(){
 $('#paperGrid').innerHTML=PAPERS.map(p=>`<div class="paper-card ${state.paper?.id===p.id?'selected':''}" data-paper="${p.id}"><div class="paper-swatch"></div><div class="paper-info"><strong>${p.name}</strong><small>${p.note}</small></div></div>`).join('');
 $$('#paperGrid [data-paper]').forEach(c=>c.onclick=()=>{state.paper=PAPERS.find(p=>p.id===c.dataset.paper);state.gsm=null;renderPapers();renderGsm();updateSummary();});
}
function renderGsm(){
 if(!state.paper){$('#gsmGrid').innerHTML='<span class="muted">먼저 종이·소재를 선택해주세요.</span>';return;}
 $('#gsmGrid').innerHTML=state.paper.gsm.map(g=>`<button type="button" class="choice ${state.gsm===g?'selected':''}" data-gsm="${g}">${g} GSM</button>`).join('');
 $$('#gsmGrid [data-gsm]').forEach(b=>b.onclick=()=>{state.gsm=Number(b.dataset.gsm);renderGsm();updateSummary();});
}
function renderSingleOptions(el,arr,key){
 $(el).innerHTML=arr.map(v=>`<div class="option-card ${state[key]===v?'selected':''}" data-value="${v}"><strong>${v}</strong></div>`).join('');
 $$(`${el} [data-value]`).forEach(c=>c.onclick=()=>{state[key]=c.dataset.value;renderSingleOptions(el,arr,key);updateSummary();});
}
function renderFinish(){
 $('#finishGrid').innerHTML=FINISHES.map(v=>`<div class="option-card ${state.finishes.includes(v)?'selected':''}" data-value="${v}"><strong>${v}</strong></div>`).join('');
 $$('#finishGrid [data-value]').forEach(c=>c.onclick=()=>{let v=c.dataset.value;state.finishes=state.finishes.includes(v)?state.finishes.filter(x=>x!==v):[...state.finishes,v];renderFinish();updateSummary();});
}
function updateSummary(){
 const qty=state.qty==='직접입력'?(state.customQty?Number(state.customQty).toLocaleString()+'개':'직접입력'):state.qty?Number(state.qty).toLocaleString()+'개':'-';
 const rows=[['제품',state.product?.name||'-'],['수량',qty],['사이즈',state.w&&state.d&&state.h?`${state.w} × ${state.d} × ${state.h} mm`:'-'],['소재',state.paper?`${state.paper.name}${state.gsm?' / '+state.gsm+'gsm':''}`:'-'],['인쇄',state.print||'-'],['코팅',state.coating||'-'],['후가공',state.finishes.length?state.finishes.join(', '):'-'],['샘플',state.sample||'-'],['내부',state.insert||'-'],['납품',state.delivery||'-']];
 $('#summaryList').innerHTML=rows.map(r=>`<div class="summary-row"><span>${r[0]}</span><strong>${r[1]}</strong></div>`).join('');
}
function showStep(n){state.step=n;$$('.quote-step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===n));$$('.step-pill').forEach(p=>p.classList.toggle('active',Number(p.dataset.pill)===n));window.scrollTo({top:document.querySelector('.page-hero').offsetHeight-10,behavior:'smooth'});}
function validateStep(n){
 if(n===1&&!state.product){alert('제작할 제품을 선택해주세요.');return false;}
 if(n===2){state.w=$('#width').value.trim();state.d=$('#depth').value.trim();state.h=$('#height').value.trim();if(!state.qty||!state.w||!state.d||!state.h){alert('수량과 W/D/H 사이즈를 입력해주세요.');return false;}updateSummary();}
 return true;
}
function init(){
 const qp=new URLSearchParams(location.search).get('cat'); if(CATS.some(([id])=>id===qp)) state.cat=qp;
 renderCats();renderProducts();renderQty();renderPapers();renderGsm();renderSingleOptions('#printGrid',PRINTS,'print');renderSingleOptions('#coatingGrid',COATINGS,'coating');renderFinish();renderSingleOptions('#sampleGrid',SAMPLES,'sample');renderSingleOptions('#insertGrid',INSERTS,'insert');renderSingleOptions('#deliveryGrid',DELIVERIES,'delivery');updateSummary();
 $$('.next-step').forEach(b=>b.onclick=()=>{if(validateStep(state.step))showStep(Math.min(5,state.step+1));});$$('.prev-step').forEach(b=>b.onclick=()=>showStep(Math.max(1,state.step-1)));
 ['width','depth','height'].forEach(id=>$('#'+id)?.addEventListener('input',e=>{state[id==='width'?'w':id==='depth'?'d':'h']=e.target.value;updateSummary();}));
 $('#submitQuote').onclick=()=>{
   const name=$('#name').value.trim(),phone=$('#phone').value.trim(),email=$('#email').value.trim(); if(!name||!phone||!email){alert('담당자명, 연락처, 이메일을 입력해주세요.');return;}
   const payload={...state,company:$('#company').value.trim(),name,phone,email,message:$('#message').value.trim(),createdAt:new Date().toISOString()};
   localStorage.setItem('fineb_last_quote',JSON.stringify(payload));
   alert('견적 사양이 정리되었습니다.\n현재는 프론트엔드 1차 구현으로 서버 전송 전 단계입니다.');
 };
}
document.addEventListener('DOMContentLoaded',init);
