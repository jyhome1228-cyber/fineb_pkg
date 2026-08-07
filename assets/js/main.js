document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
  if(toggle&&nav){toggle.addEventListener('click',()=>nav.classList.toggle('open'));}

  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click',()=>btn.closest('.faq-item').classList.toggle('open'));
  });

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',()=>nav?.classList.remove('open'));
  });
});
