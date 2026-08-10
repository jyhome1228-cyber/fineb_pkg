(()=>{
  const BASE='https://jyhome1228-cyber.github.io/fineb_pkg/';
  const NAVER='06f7a753cf337b669bb989d2de987ae43aab51f8';
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const pages={
    'index.html':{
      title:'FINE.B 파인비 | 패키지·칼라박스 제작, 샘플·인쇄·후가공',
      description:'파인비(FINE.B)는 단상자, 골판지·택배박스, 싸바리·선물박스, 쇼핑백, 책·인쇄물의 구조 상담부터 인쇄·후가공·양산·납품까지 함께하는 패키지 제작 파트너입니다.',
      keywords:'패키지제작, 칼라박스제작, 단상자제작, 골판지박스제작, 택배박스제작, 싸바리박스, 선물박스제작, 쇼핑백제작, 패키지인쇄, 후가공, 샘플제작, 파인비, FINE.B, 파주인쇄'
    },
    'about.html':{
      title:'회사소개 | FINE.B 파인비 패키지 제작 파트너',
      description:'FINE.B 파인비는 패키지 구조 상담부터 종이·인쇄·후가공·가공·양산·납품까지 제작 전 과정을 함께 확인하는 패키지 제작 파트너입니다.',
      keywords:'파인비, FINE.B, 패키지제작업체, 패키지제작회사, 인쇄업체, 박스제작업체, 패키지생산, 파주패키지제작, 파주인쇄'
    },
    'production.html':{
      title:'제작품목 | 칼라박스·싸바리·쇼핑백·인쇄물 제작 | FINE.B',
      description:'종이 단상자, 골판지·택배박스, 싸바리·선물박스, 쇼핑백, 브랜드북·카탈로그·리플렛·책자와 소량 인쇄 샘플까지 FINE.B 제작 품목을 확인하세요.',
      keywords:'칼라박스제작, 단상자제작, 골판지박스, 택배박스제작, 싸바리박스, 선물박스, 쇼핑백제작, 브랜드북제작, 카탈로그인쇄, 리플렛인쇄, 책자제작, 인쇄물제작'
    },
    'process.html':{
      title:'패키지 제작과정 | 인쇄·후가공·톰슨·접착·납품 | FINE.B',
      description:'패키지 제작의 인쇄, 코팅, 박·후가공, 톰슨·도무송, 접착, 가공, 포장, 납품까지 FINE.B의 실제 제작 흐름과 확인사항을 안내합니다.',
      keywords:'패키지제작과정, 박스인쇄, 옵셋인쇄, 코팅, 금박, 은박, 형압, 에폭시, 톰슨, 도무송, 박스접착, 패키지가공, 패키지납품'
    },
    'works.html':{
      title:'포트폴리오 | 패키지·박스 제작사례 | FINE.B',
      description:'단상자, 선물박스, 싸바리, 슬리브와 특수구조 패키지 등 FINE.B의 실제 제작 사례와 다양한 패키지 제작 결과를 확인하세요.',
      keywords:'패키지포트폴리오, 패키지제작사례, 박스제작사례, 단상자디자인, 선물박스제작, 싸바리제작, 슬리브박스, 패키지후가공, 부분에폭시, 자석싸바리'
    },
    'guide.html':{
      title:'주문제작가이드 | 박스 구조·종이·평량·인쇄·후가공 | FINE.B',
      description:'맞뚜껑·삼면접착·조립형 등 박스 구조부터 로얄아이보리·아이보리·CCP·특수지, 평량, 옵셋 인쇄, 코팅, 박·후가공, 사이즈와 납품 기준까지 정리한 FINE.B 주문제작가이드입니다.',
      keywords:'박스주문제작가이드, 패키지종이, 로얄아이보리, 아이보리지, CCP, SC마닐라, 종이평량, 옵셋인쇄, 별색인쇄, UV인쇄, 금박, 형압, 부분에폭시, 박스사이즈'
    },
    'sample.html':{
      title:'샘플제작 | 소량 패키지·박스 인쇄 샘플 | FINE.B',
      description:'종이박스, 골판지박스, 쇼핑백을 1·2·3·5·10·20개 단위로 소량 인쇄 샘플 제작해 구조와 디자인을 양산 전에 확인할 수 있습니다.',
      keywords:'패키지샘플, 박스샘플제작, 소량박스제작, 소량패키지인쇄, 인쇄샘플, 단상자샘플, 골판지샘플, 쇼핑백샘플, 패키지목업'
    },
    'faq.html':{
      title:'자주묻는질문 | 패키지 제작기간·최소수량·샘플 | FINE.B',
      description:'패키지 제작기간, 최소 제작수량, 디자인, 샘플 제작, 교정 인쇄, 박·에폭시 후가공과 제작 공정 등 FINE.B 패키지 제작 FAQ를 확인하세요.',
      keywords:'패키지제작기간, 박스최소수량, 패키지MOQ, 패키지샘플, 패키지디자인, 교정인쇄, 박후가공, 에폭시후가공, 박스제작FAQ'
    },
    'inquiry.html':{
      title:'제작문의 | 패키지·박스·쇼핑백 맞춤제작 상담 | FINE.B',
      description:'구조나 소재를 정확히 몰라도 제품 용도, 예상 수량, 일정만으로 상담할 수 있습니다. 패키지·싸바리·골판지·쇼핑백·책·인쇄물 맞춤 제작을 FINE.B에 문의하세요.',
      keywords:'패키지제작문의, 박스제작문의, 칼라박스상담, 싸바리제작문의, 쇼핑백제작문의, 인쇄제작문의, 패키지맞춤제작, 박스주문제작'
    },
    'quote.html':{
      title:'견적내기 | 패키지·칼라박스 주문제작 견적 | FINE.B',
      description:'박스 형태, 수량, 사이즈, 종이·평량, 인쇄, 코팅과 후가공 사양을 순서대로 선택해 FINE.B 패키지·칼라박스 주문제작 견적을 요청하세요.',
      keywords:'패키지견적, 박스견적, 칼라박스견적, 단상자견적, 골판지박스견적, 싸바리견적, 쇼핑백견적, 패키지주문제작, 박스주문제작, 인쇄견적'
    }
  };
  const data=pages[path]||pages['index.html'];
  const canonical=BASE+(path==='index.html'?'':path);
  const setMeta=(selector,attrs)=>{
    let el=document.head.querySelector(selector);
    if(!el){el=document.createElement('meta');document.head.appendChild(el);}
    Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
    return el;
  };
  document.title=data.title;
  setMeta('meta[name="description"]',{name:'description',content:data.description});
  setMeta('meta[name="keywords"]',{name:'keywords',content:data.keywords});
  setMeta('meta[name="robots"]',{name:'robots',content:'index,follow,max-image-preview:large'});
  setMeta('meta[name="author"]',{name:'author',content:'FINE.B'});
  setMeta('meta[name="naver-site-verification"]',{name:'naver-site-verification',content:NAVER});
  setMeta('meta[property="og:type"]',{property:'og:type',content:'website'});
  setMeta('meta[property="og:site_name"]',{property:'og:site_name',content:'FINE.B'});
  setMeta('meta[property="og:locale"]',{property:'og:locale',content:'ko_KR'});
  setMeta('meta[property="og:title"]',{property:'og:title',content:data.title});
  setMeta('meta[property="og:description"]',{property:'og:description',content:data.description});
  setMeta('meta[property="og:url"]',{property:'og:url',content:canonical});
  let link=document.head.querySelector('link[rel="canonical"]');
  if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link);}link.href=canonical;
  if(path==='index.html'){
    const id='fineb-org-schema';
    if(!document.getElementById(id)){
      const s=document.createElement('script');s.id=id;s.type='application/ld+json';s.textContent=JSON.stringify({
        '@context':'https://schema.org','@type':'Organization',name:'FINE.B',alternateName:'파인비',url:BASE,
        email:'whales84@naver.com',telephone:'010-4758-7049',
        address:{'@type':'PostalAddress',streetAddress:'가람로116번길 107, 204호',addressLocality:'파주시',addressRegion:'경기도',addressCountry:'KR'},
        description:pages['index.html'].description
      });document.head.appendChild(s);
    }
  }
})();