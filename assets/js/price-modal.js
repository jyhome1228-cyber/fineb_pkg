(()=>{'use strict';
  let overlay=null,previousFocus=null,previousOverflow='';
  function close(){
    if(!overlay)return;
    const current=overlay;overlay=null;current.remove();
    document.body.style.overflow=previousOverflow;
    if(previousFocus&&typeof previousFocus.focus==='function')previousFocus.focus();
  }
  function open(){
    if(overlay)return;
    previousFocus=document.activeElement;
    previousOverflow=document.body.style.overflow;
    overlay=document.createElement('div');
    overlay.className='fineb-price-overlay';
    overlay.setAttribute('role','presentation');
    overlay.innerHTML='<div class="fineb-price-dialog" role="dialog" aria-modal="true" aria-label="샘플 제작 기준 단가표"><div class="fineb-price-modal-header"><div><small>FINE.B / SAMPLE PRICE</small><strong>샘플 제작 단가표</strong></div><button type="button" class="fineb-price-close" aria-label="단가표 팝업 닫기">×</button></div><iframe class="fineb-price-frame" src="sample-price.html?modal=1#price-list" title="파인비 샘플 제작 단가표" loading="eager"></iframe></div>';
    document.body.appendChild(overlay);
    document.body.style.overflow='hidden';
    overlay.querySelector('.fineb-price-close').addEventListener('click',close);
    overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
    overlay.querySelector('.fineb-price-close').focus();
  }
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-price-modal]');
    if(!trigger)return;
    e.preventDefault();open();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay){e.preventDefault();close()}});
  const style=document.createElement('style');
  style.textContent=`
  .fineb-price-overlay{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(11,28,47,.68);backdrop-filter:blur(7px)}
  .fineb-price-dialog{width:min(1060px,100%);height:min(850px,calc(100dvh - 48px));display:flex;flex-direction:column;overflow:hidden;border-radius:18px;background:#fff;box-shadow:0 28px 90px rgba(0,0,0,.27)}
  .fineb-price-modal-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 22px;border-bottom:1px solid #e3e8ee;background:#fff;flex-shrink:0}
  .fineb-price-modal-header>div{display:flex;flex-direction:column;gap:2px}
  .fineb-price-modal-header small{font-size:9px;font-weight:700;letter-spacing:.16em;color:#77889b}
  .fineb-price-modal-header strong{font-size:19px;color:#0a2240;line-height:1.3}
  .fineb-price-close{display:grid;place-items:center;width:39px;height:39px;flex-shrink:0;border:1px solid #dfe6ed;border-radius:50%;background:#fff;color:#102942;font-size:27px;line-height:1;cursor:pointer}
  .fineb-price-close:hover{background:#f0f4f8}
  .fineb-price-frame{display:block;width:100%;flex:1;min-height:0;border:0;background:#f6f8fb}
  @media(max-width:720px){.fineb-price-overlay{padding:0;align-items:stretch}.fineb-price-dialog{width:100%;height:100dvh;max-height:none;border-radius:0}.fineb-price-modal-header{padding:12px 16px}.fineb-price-modal-header strong{font-size:17px}}
  `;
  document.head.appendChild(style);
})();