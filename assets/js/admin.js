const LOCAL_KEYS={quote:'fineb_quote_requests',sample:'fineb_sample_requests',inquiry:'fineb_inquiry_requests'};
const STATUSES=['신규','확인중','진행중','견적완료','완료','보류'];
const adminState={type:'quote',status:'all',query:'',selected:null,data:{quote:[],sample:[],inquiry:[]}};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

function getList(type){try{return JSON.parse(localStorage.getItem(LOCAL_KEYS[type])||'[]')}catch{return []}}
function setList(type,list){localStorage.setItem(LOCAL_KEYS[type],JSON.stringify(list.slice(0,300)))}
function labelType(type){return type==='quote'?'견적문의':type==='sample'?'샘플문의':'제작문의'}
function fmtDate(v){if(!v)return '-';const d=new Date(v);if(Number.isNaN(d.getTime()))return '-';return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`}
function val(v){return v===undefined||v===null||v===''?'-':Array.isArray(v)?v.join(', '):String(v)}
function esc(v){return val(v).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function requestTitle(r){return r.spec?.title||r.spec?.product||r.company||r.name||labelType(r.type)}
function requestStatus(r){return r.status||'신규'}
function allRequests(){return Object.values(adminState.data).flat().sort((a,b)=>new Date(b.createdAtClient||b.createdAt)-new Date(a.createdAtClient||a.createdAt))}

function loadAll(){
  adminState.data.quote=getList('quote');
  adminState.data.sample=getList('sample');
  adminState.data.inquiry=getList('inquiry');
  renderStats();renderWorkflowCounts();renderList();renderDetail();
}

function countStatus(list,status){return list.filter(r=>requestStatus(r)===status).length}
function renderStats(){
  const all=allRequests();
  $('#statAll').textContent=all.length;
  $('#statNew').textContent=countStatus(all,'신규');
  $('#statCheck').textContent=countStatus(all,'확인중');
  $('#statProgress').textContent=countStatus(all,'진행중');
  $('#statQuoted').textContent=countStatus(all,'견적완료');
  $('#statDone').textContent=countStatus(all,'완료');
  $('#navQuoteCount').textContent=adminState.data.quote.length;
  $('#navSampleCount').textContent=adminState.data.sample.length;
  $('#navInquiryCount').textContent=adminState.data.inquiry.length;
}
function renderWorkflowCounts(){
  const list=adminState.data[adminState.type]||[];
  const ids={신규:'flowNew',확인중:'flowCheck',진행중:'flowProgress',견적완료:'flowQuoted',완료:'flowDone',보류:'flowHold'};
  Object.entries(ids).forEach(([status,id])=>{const el=$('#'+id);if(el)el.textContent=countStatus(list,status)});
  $$('[data-guide-status]').forEach(b=>b.classList.toggle('active',adminState.status===b.dataset.guideStatus));
}

function searchableText(r){const s=r.spec||{};return [r.id,r.company,r.name,r.phone,r.email,r.message,s.product,s.title,s.inquiryType,s.qty,s.paper,s.size,s.printMethod,s.printColor,s.finish,s.finishes].flat().filter(Boolean).join(' ').toLowerCase()}
function currentList(){
  let list=[...(adminState.data[adminState.type]||[])];
  if(adminState.status!=='all')list=list.filter(r=>requestStatus(r)===adminState.status);
  const q=adminState.query.trim().toLowerCase();if(q)list=list.filter(r=>searchableText(r).includes(q));
  return list.sort((a,b)=>new Date(b.createdAtClient||b.createdAt)-new Date(a.createdAtClient||a.createdAt));
}

function renderList(){
  const list=currentList();
  $('#listTitle').textContent=labelType(adminState.type);
  $('#listCount').textContent=`${list.length}건`;
  const wrap=$('#requestList');
  if(!list.some(r=>r.id===adminState.selected))adminState.selected=list[0]?.id||null;
  if(!list.length){wrap.innerHTML='<div class="empty-state">조건에 맞는 문의가 없습니다.<br><small>상태 필터나 검색어를 변경해보세요.</small></div>';renderDetail();return}
  wrap.innerHTML=list.map(r=>{const status=requestStatus(r);const s=r.spec||{};return `<div class="request-row ${adminState.selected===r.id?'active':''}" data-id="${esc(r.id)}"><span class="status" data-status-name="${esc(status)}">${esc(status)}</span><div class="request-main"><strong>${esc(requestTitle(r))}</strong><small>${esc(r.company)} · ${esc(r.name)}</small><small class="request-spec">${esc(s.qty)}${s.paper?' · '+esc(s.paper):''}</small></div><time>${fmtDate(r.createdAtClient||r.createdAt)}</time></div>`}).join('');
  $$('.request-row').forEach(row=>row.onclick=()=>{adminState.selected=row.dataset.id;renderList();renderDetail()});
  renderDetail();
}
function findSelected(){return (adminState.data[adminState.type]||[]).find(r=>r.id===adminState.selected)||null}
function detailFields(r){const s=r.spec||{};if(r.type==='quote')return [['제품',s.product],['수량',s.qty],['사이즈',s.size],['종이',s.paper],['평량',s.gsm?s.gsm+'gsm':''],['인쇄 방식',s.printMethod],['인쇄 색상',s.printColor],['인쇄 면',s.printSide],['코팅',s.coating],['후가공',s.finishes],['내부 구성',s.insert]];if(r.type==='sample')return [['제품',s.product],['수량',s.qty],['사이즈',s.size],['종이',s.paper],['평량',s.gsm?s.gsm+'gsm':''],['인쇄',s.print],['후가공',s.finish]];return [['문의 유형',s.inquiryType],['예상 수량',s.qty],['문의 제목',s.title]]}

function setRequestStatus(id,status){
  if(!STATUSES.includes(status))return;
  const item=(adminState.data[adminState.type]||[]).find(x=>x.id===id);if(!item)return;
  item.status=status;item.statusUpdatedAt=new Date().toISOString();setList(adminState.type,adminState.data[adminState.type]);
  renderStats();renderWorkflowCounts();renderList();
}
function renderDetail(){
  const r=findSelected(),wrap=$('#requestDetail');
  if(!r){wrap.innerHTML='<div class="detail-empty">왼쪽 문의를 선택하면<br>상세 내용이 표시됩니다.</div>';return}
  const fields=detailFields(r),status=requestStatus(r),phone=val(r.phone).replace(/[^0-9+]/g,''),email=val(r.email);
  wrap.innerHTML=`<div class="detail-head"><div class="detail-head-copy"><small>${esc(r.id)} · ${labelType(r.type)}</small><div class="detail-title-line"><h2>${esc(requestTitle(r))}</h2><span class="status" data-status-name="${esc(status)}">${esc(status)}</span></div><p>${fmtDate(r.createdAtClient||r.createdAt)}</p></div><div class="detail-actions"><button type="button" class="admin-btn" id="pdfRequest">PDF 저장</button></div></div><div class="detail-section"><h3>고객 정보</h3><div class="detail-grid customer-grid"><div class="detail-field"><span>회사 / 브랜드</span><strong>${esc(r.company)}</strong></div><div class="detail-field"><span>담당자</span><strong>${esc(r.name)}</strong></div><div class="detail-field"><span>연락처</span><strong>${phone&&phone!=='-'?`<a href="tel:${esc(phone)}">${esc(r.phone)} ↗</a>`:esc(r.phone)}</strong></div><div class="detail-field"><span>이메일</span><strong>${email&&email!=='-'?`<a href="mailto:${esc(email)}">${esc(email)} ↗</a>`:esc(email)}</strong></div></div></div><div class="detail-section"><h3>${r.type==='inquiry'?'문의 정보':'제작 사양'}</h3><div class="detail-grid spec-grid">${fields.map(([k,v])=>`<div class="detail-field"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div></div><div class="detail-section"><h3>요청사항</h3><div class="detail-message">${esc(r.message)}</div></div><div class="detail-section"><h3>파일 안내</h3><div class="detail-message">디자인·도면·참고이미지는 <a href="mailto:whales84@naver.com">whales84@naver.com</a> 으로 수신합니다.</div></div><div class="detail-section status-section"><div class="status-section-head"><div><h3>처리 상태</h3><p>현재 업무 단계에 맞춰 상태를 변경해주세요.</p></div></div><div class="status-actions">${STATUSES.map(v=>`<button type="button" class="status-action ${status===v?'active':''}" data-set-status="${v}"><b>${v}</b><span>${statusDescription(v)}</span></button>`).join('')}</div></div>`;
  $$('[data-set-status]').forEach(b=>b.onclick=()=>setRequestStatus(r.id,b.dataset.setStatus));
  $('#pdfRequest').onclick=()=>printRequest(r);
}
function statusDescription(status){return ({신규:'미확인',확인중:'내용 확인',진행중:'상담·견적 작업',견적완료:'견적 전달',완료:'처리 종료',보류:'추가 확인 대기'})[status]||''}

function printRequest(r){
  const fields=detailFields(r),title=`FINE.B ${labelType(r.type)} - ${requestTitle(r)}`,rows=fields.map(([k,v])=>`<div class="cell"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('');
  const win=window.open('','_blank','width=960,height=820');if(!win)return;
  win.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:A4;margin:14mm}*{box-sizing:border-box}body{font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;color:#15191f;margin:0;font-size:11px}.top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #0A2240;padding-bottom:18px;margin-bottom:22px}.brand{font-size:25px;font-weight:800;color:#0A2240}.type{font-size:10px;letter-spacing:.12em;color:#74808c}.title{font-size:23px;margin:5px 0}.meta{color:#74808c}.badge{display:inline-block;padding:5px 9px;border-radius:999px;background:#eef3f7;color:#0A2240;font-weight:700}.section{margin:22px 0}.section h3{font-size:11px;color:#0A2240;border-bottom:1px solid #dfe5eb;padding-bottom:8px;margin:0 0 10px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-left:1px solid #e1e6eb;border-top:1px solid #e1e6eb}.grid.two{grid-template-columns:repeat(2,1fr)}.cell{min-height:58px;padding:10px 12px;border-right:1px solid #e1e6eb;border-bottom:1px solid #e1e6eb}.cell span{display:block;color:#89939d;font-size:9px;margin-bottom:5px}.cell b{font-size:11px;word-break:break-word}.message{padding:14px;background:#f6f8fa;line-height:1.7;white-space:pre-wrap}.foot{margin-top:30px;padding-top:12px;border-top:1px solid #dfe5eb;color:#78838f;line-height:1.7}.no-print{position:fixed;right:20px;top:20px;background:#0A2240;color:#fff;border:0;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}@media print{.no-print{display:none}}</style></head><body><button class="no-print" onclick="window.print()">PDF로 저장</button><div class="top"><div><div class="brand">FINE.B</div><div>PACKAGE DEVELOPMENT & PRODUCTION</div></div><div class="type">${labelType(r.type)} · ${esc(r.id)}</div></div><div><span class="badge">${esc(requestStatus(r))}</span><h1 class="title">${esc(requestTitle(r))}</h1><div class="meta">접수일 ${fmtDate(r.createdAtClient||r.createdAt)}</div></div><div class="section"><h3>고객 정보</h3><div class="grid two"><div class="cell"><span>회사 / 브랜드</span><b>${esc(r.company)}</b></div><div class="cell"><span>담당자</span><b>${esc(r.name)}</b></div><div class="cell"><span>연락처</span><b>${esc(r.phone)}</b></div><div class="cell"><span>이메일</span><b>${esc(r.email)}</b></div></div></div><div class="section"><h3>${r.type==='inquiry'?'문의 정보':'제작 사양'}</h3><div class="grid">${rows}</div></div><div class="section"><h3>요청사항</h3><div class="message">${esc(r.message)}</div></div><div class="foot">FINE.B 파인비 · 대표전화 010-4758-7049<br>파일 및 제작 문의 whales84@naver.com</div><script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script></body></html>`);win.document.close();
}

function setType(type){adminState.type=type;adminState.status='all';adminState.query='';adminState.selected=null;$('#adminSearch').value='';$$('[data-type]').forEach(b=>b.classList.toggle('active',b.dataset.type===type));$$('[data-status]').forEach(b=>b.classList.toggle('active',b.dataset.status==='all'));renderWorkflowCounts();renderList()}
function setStatusFilter(status){adminState.status=status;adminState.selected=null;$$('[data-status]').forEach(b=>b.classList.toggle('active',b.dataset.status===status));renderWorkflowCounts();renderList()}

document.addEventListener('DOMContentLoaded',()=>{
  loadAll();
  $$('[data-type]').forEach(b=>b.onclick=()=>setType(b.dataset.type));
  $$('[data-status]').forEach(b=>b.onclick=()=>setStatusFilter(b.dataset.status));
  $$('[data-guide-status]').forEach(b=>b.onclick=()=>setStatusFilter(b.dataset.guideStatus));
  $('#adminSearch').addEventListener('input',e=>{adminState.query=e.target.value;adminState.selected=null;renderList()});
  $('#clearSearch').onclick=()=>{adminState.query='';$('#adminSearch').value='';renderList()};
  $('#refreshAdmin').onclick=loadAll;
});
