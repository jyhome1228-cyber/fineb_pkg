const DEFAULT_INQUIRIES=[
  {status:'답변완료',type:'패키지 제작',title:'화장품 단상자 제작 문의',name:'김**',date:'2026.08.07'},
  {status:'답변완료',type:'싸바리 제작',title:'싸바리 1,000개 문의',name:'박**',date:'2026.08.06'},
  {status:'접수',type:'쇼핑백',title:'쇼핑백 제작 문의',name:'이**',date:'2026.08.06'}
];
function maskName(name){if(!name)return '***';return name.length<2?'*':name[0]+'**';}
function today(){const d=new Date();return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;}
function load(){try{return JSON.parse(localStorage.getItem('fineb_inquiries'))||DEFAULT_INQUIRIES;}catch(e){return DEFAULT_INQUIRIES;}}
function save(rows){localStorage.setItem('fineb_inquiries',JSON.stringify(rows));}
function render(){const rows=load();document.querySelector('#boardList').innerHTML=rows.map(r=>`<div class="board-row"><span class="status">${r.status}</span><div><strong>${r.title}</strong><div class="muted" style="font-size:12px">${r.type}</div></div><span>${r.name}</span><span class="muted">${r.date}</span></div>`).join('');}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.querySelector('#inquiryForm').addEventListener('submit',e=>{
    e.preventDefault();
    const row={status:'접수',type:document.querySelector('#inqType').value,title:document.querySelector('#inqTitle').value.trim(),name:maskName(document.querySelector('#inqName').value.trim()),date:today()};
    const rows=load();rows.unshift(row);save(rows);render();e.target.reset();
    alert('문의가 임시 등록되었습니다. 현재는 프론트엔드 1차 버전으로 실제 서버 전송 전 단계입니다.');
  });
});
