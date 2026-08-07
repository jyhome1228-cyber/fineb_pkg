const SAMPLE_PRODUCTS=[
{id:'paper-tuck',cat:'paper',name:'맞뚜껑 단상자',tags:'종이박스'},
{id:'paper-cross',cat:'paper',name:'십자조립 단상자',tags:'종이박스'},
{id:'paper-glue',cat:'paper',name:'삼면접착 단상자',tags:'종이박스'},
{id:'paper-y',cat:'paper',name:'Y형 박스',tags:'종이박스'},
{id:'paper-g',cat:'paper',name:'G형 조립 박스',tags:'종이박스'},
{id:'paper-sleeve',cat:'paper',name:'슬리브 박스',tags:'종이박스'},
{id:'corr-g',cat:'corrugated',name:'골판지 G형 박스',tags:'골판지'},
{id:'corr-handle',cat:'corrugated',name:'골판지 손잡이 박스',tags:'골판지'},
{id:'corr-shipping',cat:'corrugated',name:'택배박스',tags:'골판지'},
{id:'corr-laminated',cat:'corrugated',name:'골판지 합지박스',tags:'골판지'},
{id:'bag-basic',cat:'bag',name:'종이 쇼핑백',tags:'쇼핑백'},
{id:'bag-triangle',cat:'bag',name:'삼각 쇼핑백',tags:'쇼핑백'}
];
const SAMPLE_CATS=[['all','전체'],['paper','종이박스'],['corrugated','골판지박스'],['bag','쇼핑백']];
const SAMPLE_QTY=[1,2,3,5,10,20];
const SAMPLE_PRINT=['플로터 인쇄 · 기본','교정 인쇄 · 별도 상담'];
const SAMPLE_FINISH=['후가공 없음','박 · 상담 필요','에폭시 · 상담 필요','기타 후가공 · 상담 필요'];
const sampleState={cat:'all',product:null,qty:null,print:'플로터 인쇄 · 기본',finish:'후가공 없음'};
const $s=s=>document.querySelector(s);const $$s=s=>[...document.querySelectorAll(s)];
function sampleIcon(cat){const fill=cat==='corrugated'?'#d9cbb8':cat==='bag'?'#f2f4f6':'#fff';return `<svg viewBox="0 0 160 90" width="100%" height="82" aria-hidden="true"><rect x="35" y="23" width="90" height="53" rx="4" fill="${fill}" stroke="#0a2240" stroke-width="1.2"/><path d="M35 23l23-13h90l-23 13M125 23l23-13v53l-23 13" fill="none" stroke="#7f879a" stroke-width="1.2"/></svg>`}
function renderSampleCats(){$s('#sampleCategoryTabs').innerHTML=SAMPLE_CATS.map(([id,label])=>`<button class="choice ${sampleState.cat===id?'selected':''}" data-cat="${id}" type="button">${label}</button>`).join('');$$s('#sampleCategoryTabs [data-cat]').forEach(b=>b.onclick=()=>{sampleState.cat=b.dataset.cat;renderSampleCats();renderSampleProducts();});}
function renderSampleProducts(){const list=sampleState.cat==='all'?SAMPLE_PRODUCTS:SAMPLE_PRODUCTS.filter(p=>p.cat===sampleState.cat);$s('#sampleProductGrid').innerHTML=list.map(p=>`<div class="option-card ${sampleState.product?.id===p.id?'selected':''}" data-product="${p.id}">${sampleIcon(p.cat)}<strong>${p.name}</strong><small>${p.tags} · 싸바리 제외</small></div>`).join('');$$s('#sampleProductGrid [data-product]').forEach(c=>c.onclick=()=>{sampleState.product=SAMPLE_PRODUCTS.find(p=>p.id===c.dataset.product);renderSampleProducts();updateSampleSummary();});}
function renderSampleQty(){$s('#sampleQtyGrid').innerHTML=SAMPLE_QTY.map(q=>`<button type="button" class="choice ${sampleState.qty===q?'selected':''}" data-qty="${q}">${q}개</button>`).join('');$$s('#sampleQtyGrid [data-qty]').forEach(b=>b.onclick=()=>{sampleState.qty=Number(b.dataset.qty);renderSampleQty();updateSampleSummary();});}
function renderChoiceGrid(selector,items,key){$s(selector).innerHTML=items.map(v=>`<div class="option-card ${sampleState[key]===v?'selected':''}" data-value="${v}"><strong>${v}</strong></div>`).join('');$$s(`${selector} [data-value]`).forEach(c=>c.onclick=()=>{sampleState[key]=c.dataset.value;renderChoiceGrid(selector,items,key);updateSampleSummary();});}
function updateSampleSummary(){const w=$s('#sampleWidth')?.value.trim(),d=$s('#sampleDepth')?.value.trim(),h=$s('#sampleHeight')?.value.trim();const rows=[['형태',sampleState.product?.name||'-'],['수량',sampleState.qty?sampleState.qty+'개':'-'],['사이즈',w&&d&&h?`${w} × ${d} × ${h} mm`:'-'],['인쇄',sampleState.print],['후가공',sampleState.finish]];$s('#sampleSummary').innerHTML=rows.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('');}
function submitSample(){const w=$s('#sampleWidth').value.trim(),d=$s('#sampleDepth').value.trim(),h=$s('#sampleHeight').value.trim(),name=$s('#sampleName').value.trim(),phone=$s('#samplePhone').value.trim(),email=$s('#sampleEmail').value.trim();if(!sampleState.product){alert('샘플 형태를 선택해주세요.');return}if(!sampleState.qty){alert('샘플 수량을 선택해주세요.');return}if(!w||!d||!h){alert('완성 사이즈를 입력해주세요.');return}if(!name||!phone||!email){alert('담당자명, 연락처, 이메일을 입력해주세요.');return}const payload={...sampleState,w,d,h,company:$s('#sampleCompany').value.trim(),name,phone,email,message:$s('#sampleMessage').value.trim(),files:[...$s('#sampleFiles').files].map(f=>f.name),createdAt:new Date().toISOString()};localStorage.setItem('fineb_sample_draft',JSON.stringify(payload));alert('샘플 제작 사양이 정리되었습니다. 현재는 화면 개발 단계이며 실제 서버 접수는 관리자 시스템 연결 후 활성화됩니다.');}
document.addEventListener('DOMContentLoaded',()=>{renderSampleCats();renderSampleProducts();renderSampleQty();renderChoiceGrid('#samplePrintGrid',SAMPLE_PRINT,'print');renderChoiceGrid('#sampleFinishGrid',SAMPLE_FINISH,'finish');['sampleWidth','sampleDepth','sampleHeight'].forEach(id=>$s('#'+id).addEventListener('input',updateSampleSummary));$s('#submitSample').addEventListener('click',submitSample);updateSampleSummary();});