(()=>{
  const gallery=document.querySelector('.factory-gallery');
  if(!gallery)return;
  const section=gallery.closest('.factory-section');
  const title=section?.querySelector('.factory-head h2');
  const desc=section?.querySelector('.factory-head p');
  if(title) title.innerHTML='제작의 시작부터 완성까지<br>꼼꼼하게 함께합니다.';
  if(desc) desc.innerHTML='구조와 사양을 정리하는 단계부터 인쇄·가공·후가공, 검수와 납품 준비까지.<br>각 과정에서 필요한 내용을 확인하고 제작이 안정적으로 이어지도록 함께 살핍니다.';

  const slides=[
    ['01 · PRINTING EQUIPMENT','https://cdn.imweb.me/upload/S2023030963558ef55ba8e/99dc629d7108b.png'],
    ['02 · PRODUCTION LINE','https://cdn.imweb.me/upload/S2023030963558ef55ba8e/25e8592dee7d0.png'],
    ['03 · WORKSPACE','https://cdn.imweb.me/upload/S2023030963558ef55ba8e/a29f65f4e627a.png']
  ];

  gallery.outerHTML=`<div class="factory-carousel" data-factory-carousel><div class="factory-carousel-viewport"><div class="factory-carousel-track">${slides.map(([label,url])=>`<article class="factory-slide" style="background-image:url('${url}')"><span class="factory-label">${label}</span></article>`).join('')}</div></div><div class="factory-carousel-controls"><div class="factory-carousel-arrows"><button class="factory-carousel-btn" type="button" data-factory-prev aria-label="이전 사진">←</button><button class="factory-carousel-btn" type="button" data-factory-next aria-label="다음 사진">→</button></div><div class="factory-carousel-dots"></div><div class="factory-carousel-count"><strong>01</strong> / ${String(slides.length).padStart(2,'0')}</div></div></div>`;

  const carousel=document.querySelector('[data-factory-carousel]');
  const track=carousel.querySelector('.factory-carousel-track');
  const items=[...carousel.querySelectorAll('.factory-slide')];
  const dots=carousel.querySelector('.factory-carousel-dots');
  const count=carousel.querySelector('.factory-carousel-count strong');
  const controls=carousel.querySelector('.factory-carousel-controls');
  let index=0,timer;
  const visible=()=>window.innerWidth<=620?1:window.innerWidth<=900?2:3;
  const maxIndex=()=>Math.max(0,items.length-visible());
  const step=()=>items[0].getBoundingClientRect().width+14;
  const render=()=>{
    index=Math.max(0,Math.min(index,maxIndex()));
    track.style.transform=`translate3d(${-index*step()}px,0,0)`;
    count.textContent=String(index+1).padStart(2,'0');
    controls.classList.toggle('is-static',maxIndex()===0);
    dots.innerHTML=maxIndex()>0?Array.from({length:maxIndex()+1},(_,i)=>`<button type="button" class="factory-carousel-dot ${i===index?'active':''}" data-factory-dot="${i}" aria-label="${i+1}번째"></button>`).join(''):'';
    dots.querySelectorAll('[data-factory-dot]').forEach(btn=>btn.onclick=()=>{index=Number(btn.dataset.factoryDot);render();restart();});
  };
  const next=()=>{if(maxIndex()===0)return;index=index>=maxIndex()?0:index+1;render();};
  const prev=()=>{if(maxIndex()===0)return;index=index<=0?maxIndex():index-1;render();};
  const restart=()=>{clearInterval(timer);if(maxIndex()>0)timer=setInterval(next,3800);};
  carousel.querySelector('[data-factory-next]').onclick=()=>{next();restart();};
  carousel.querySelector('[data-factory-prev]').onclick=()=>{prev();restart();};
  carousel.addEventListener('mouseenter',()=>clearInterval(timer));
  carousel.addEventListener('mouseleave',restart);
  window.addEventListener('resize',()=>{render();restart();});
  render();
  restart();
})();
