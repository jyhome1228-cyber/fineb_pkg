(()=>{
  const BASE='https://finebpkg.com/';
  const NAVER='06f7a753cf337b669bb989d2de987ae43aab51f8';
  const DEFAULT_IMAGE='https://cdn.imweb.me/upload/S2023030963558ef55ba8e/c5acf880c9b79.png';
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();

  const pages={
    'index.html':{
      title:'패키지 제작·칼라박스 제작 전문 | FINE.B 파인비',
      description:'파인비(FINE.B)는 단상자, 칼라박스, 골판지·택배박스, 싸바리·선물박스, 쇼핑백과 인쇄물의 구조 상담부터 인쇄·후가공·양산·납품까지 함께하는 패키지 제작 파트너입니다.',
      keywords:'패키지제작, 패키지제작업체, 박스제작, 박스제작업체, 칼라박스제작, 컬러박스제작, 단상자제작, 종이박스제작, 골판지박스제작, 택배박스제작, 합지박스제작, 싸바리박스제작, 선물박스제작, 쇼핑백제작, 패키지인쇄, 박스인쇄, 패키지후가공, 패키지샘플, 소량박스제작, 패키지주문제작, 맞춤박스제작, 파주패키지제작, 파주박스제작, 파주인쇄, 운정인쇄, 파인비, FINE.B',
      label:'패키지 제작'
    },
    'about.html':{
      title:'패키지 제작업체 FINE.B 파인비 | 회사소개·제작 파트너',
      description:'FINE.B 파인비는 경기도 파주에서 패키지 구조 상담부터 종이·인쇄·후가공·가공·양산·납품까지 제작 전 과정을 함께 확인하는 패키지 제작 파트너입니다.',
      keywords:'파인비, FINE.B, 패키지제작업체, 패키지제작회사, 박스제작업체, 칼라박스업체, 패키지생산업체, 패키지인쇄업체, 박스인쇄업체, 패키지제조, 박스제조, 패키지양산, 파주패키지제작, 파주박스제작, 파주인쇄업체, 운정패키지, 운정인쇄',
      label:'회사소개'
    },
    'production.html':{
      title:'단상자·골판지·싸바리·쇼핑백 제작 | FINE.B 제작품목',
      description:'종이 단상자와 칼라박스, 골판지·택배박스, 싸바리·선물박스, 쇼핑백, 브랜드북·카탈로그·리플렛·책자와 소량 인쇄 샘플까지 FINE.B 제작 품목을 확인하세요.',
      keywords:'단상자제작, 칼라박스제작, 종이박스제작, 화장품박스제작, 식품박스제작, 제품박스제작, 골판지박스제작, 택배박스제작, 합지박스제작, 골판지칼라박스, 싸바리박스제작, 선물박스제작, 자석박스제작, 서랍형박스, 슬리브박스, 쇼핑백제작, 종이쇼핑백제작, 브랜드북제작, 카탈로그인쇄, 리플렛인쇄, 책자인쇄, 인쇄물제작, 맞춤패키지제작, 파주박스제작',
      label:'제작품목'
    },
    'process.html':{
      title:'패키지 제작과정 | 인쇄·코팅·후가공·도무송·접착 | FINE.B',
      description:'패키지 제작의 옵셋 인쇄, 코팅, 금박·은박·형압·에폭시 후가공, 톰슨·도무송, 접착, 가공, 포장과 납품까지 실제 제작 흐름과 확인사항을 안내합니다.',
      keywords:'패키지제작과정, 박스제작과정, 패키지인쇄, 박스인쇄, 옵셋인쇄, UV인쇄, 별색인쇄, 박스코팅, 무광라미네이팅, 유광라미네이팅, 패키지후가공, 금박, 은박, 컬러박, 형압, 디보싱, 부분에폭시, 톰슨, 도무송, 박스타발, 박스접착, 패키지가공, 패키지포장, 패키지납품',
      label:'제작과정'
    },
    'works.html':{
      title:'패키지 제작사례·박스 포트폴리오 | FINE.B 파인비',
      description:'단상자, 칼라박스, 선물박스, 싸바리, 슬리브, 자석박스와 특수구조 패키지 등 FINE.B의 실제 제작 사례와 후가공 결과를 확인하세요.',
      keywords:'패키지포트폴리오, 패키지제작사례, 박스제작사례, 칼라박스제작사례, 단상자제작사례, 단상자디자인, 패키지디자인사례, 선물박스제작, 싸바리제작, 자석싸바리, 자석박스, 슬리브박스, 특수박스제작, 패키지후가공, 금박패키지, 부분에폭시, 형압패키지, 맞춤패키지사례',
      label:'포트폴리오'
    },
    'guide.html':{
      title:'박스 주문제작 가이드 | 종이·평량·인쇄·후가공 | FINE.B',
      description:'박스 구조부터 로얄아이보리·아이보리·CCP·특수지와 평량, 옵셋·별색·UV 인쇄, 코팅, 금박·형압·에폭시 후가공, 사이즈와 납품 기준까지 정리한 패키지 주문제작 가이드입니다.',
      keywords:'박스주문제작, 패키지주문제작, 주문제작박스, 박스제작가이드, 패키지제작가이드, 박스구조, 패키지종이, 박스종이, 로얄아이보리, 아이보리지, CCP, SC마닐라, 특수지, 종이평량, 패키지평량, 옵셋인쇄, 별색인쇄, UV인쇄, 박스코팅, 금박, 은박, 형압, 디보싱, 부분에폭시, 박스사이즈, 패키지사이즈, 패키지납품',
      label:'주문제작가이드'
    },
    'sample.html':{
      title:'패키지 샘플 제작·소량 박스 인쇄 | FINE.B 파인비',
      description:'종이박스, 단상자, 골판지박스와 쇼핑백을 1·2·3·5·10·20개 단위로 소량 인쇄 샘플 제작해 구조와 디자인을 양산 전에 확인할 수 있습니다.',
      keywords:'패키지샘플, 패키지샘플제작, 박스샘플, 박스샘플제작, 단상자샘플, 칼라박스샘플, 골판지샘플, 쇼핑백샘플, 소량박스제작, 소량패키지제작, 소량패키지인쇄, 소량박스인쇄, 패키지목업, 박스목업, 인쇄샘플, 교정인쇄, 패키지가샘플, 양산전샘플',
      label:'샘플제작'
    },
    'faq.html':{
      title:'패키지 제작 FAQ | 제작기간·최소수량·샘플·후가공 | FINE.B',
      description:'패키지 제작기간, 최소 제작수량, 박스 MOQ, 디자인, 샘플 제작, 교정 인쇄, 금박·에폭시 후가공과 제작 공정 등 패키지 제작 FAQ를 확인하세요.',
      keywords:'패키지제작기간, 박스제작기간, 박스최소수량, 패키지최소수량, 패키지MOQ, 박스MOQ, 패키지샘플, 박스샘플, 패키지디자인, 박스디자인, 교정인쇄, 박후가공, 금박후가공, 에폭시후가공, 박스후가공, 패키지제작FAQ, 박스제작FAQ, 패키지제작문의',
      label:'자주묻는질문'
    },
    'inquiry.html':{
      title:'패키지·박스 제작문의 | 맞춤 제작 상담 FINE.B 파인비',
      description:'구조나 소재를 정확히 몰라도 제품 용도, 예상 수량과 일정만으로 상담할 수 있습니다. 단상자·칼라박스·싸바리·골판지·쇼핑백·인쇄물 맞춤 제작을 FINE.B에 문의하세요.',
      keywords:'패키지제작문의, 패키지제작상담, 박스제작문의, 박스제작상담, 칼라박스문의, 칼라박스상담, 단상자제작문의, 골판지박스문의, 택배박스문의, 싸바리제작문의, 선물박스문의, 쇼핑백제작문의, 인쇄제작문의, 인쇄물제작문의, 패키지맞춤제작, 맞춤박스제작, 박스주문제작, 패키지업체문의, 파주패키지문의',
      label:'제작문의'
    },
    'quote.html':{
      title:'패키지·칼라박스 제작 견적 | 박스 주문제작 견적 FINE.B',
      description:'박스 형태, 제작 수량, 완성 사이즈, 종이·평량, 인쇄, 코팅과 후가공 사양을 순서대로 선택해 단상자·골판지·싸바리·쇼핑백 제작 견적을 요청하세요.',
      keywords:'패키지견적, 패키지제작견적, 박스견적, 박스제작견적, 칼라박스견적, 단상자견적, 종이박스견적, 골판지박스견적, 택배박스견적, 합지박스견적, 싸바리견적, 선물박스견적, 쇼핑백견적, 패키지주문제작, 박스주문제작, 맞춤박스견적, 인쇄견적, 후가공견적, 파주박스견적',
      label:'견적내기'
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
  const setLink=(selector,attrs)=>{
    let el=document.head.querySelector(selector);
    if(!el){el=document.createElement('link');document.head.appendChild(el);}
    Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
    return el;
  };

  document.title=data.title;
  setMeta('meta[name="description"]',{name:'description',content:data.description});
  setMeta('meta[name="keywords"]',{name:'keywords',content:data.keywords});
  setMeta('meta[name="robots"]',{name:'robots',content:'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'});
  setMeta('meta[name="author"]',{name:'author',content:'FINE.B 파인비'});
  setMeta('meta[name="naver-site-verification"]',{name:'naver-site-verification',content:NAVER});
  setMeta('meta[name="geo.region"]',{name:'geo.region',content:'KR-41'});
  setMeta('meta[name="geo.placename"]',{name:'geo.placename',content:'Paju-si, Gyeonggi-do'});

  setMeta('meta[property="og:type"]',{property:'og:type',content:'website'});
  setMeta('meta[property="og:site_name"]',{property:'og:site_name',content:'FINE.B 파인비'});
  setMeta('meta[property="og:locale"]',{property:'og:locale',content:'ko_KR'});
  setMeta('meta[property="og:title"]',{property:'og:title',content:data.title});
  setMeta('meta[property="og:description"]',{property:'og:description',content:data.description});
  setMeta('meta[property="og:url"]',{property:'og:url',content:canonical});
  setMeta('meta[property="og:image"]',{property:'og:image',content:DEFAULT_IMAGE});
  setMeta('meta[property="og:image:alt"]',{property:'og:image:alt',content:'FINE.B 파인비 패키지 제작'});

  setMeta('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'});
  setMeta('meta[name="twitter:title"]',{name:'twitter:title',content:data.title});
  setMeta('meta[name="twitter:description"]',{name:'twitter:description',content:data.description});
  setMeta('meta[name="twitter:image"]',{name:'twitter:image',content:DEFAULT_IMAGE});

  setLink('link[rel="canonical"]',{rel:'canonical',href:canonical});
  setLink('link[rel="alternate"][hreflang="ko-KR"]',{rel:'alternate',hreflang:'ko-KR',href:canonical});
  setLink('link[rel="alternate"][hreflang="x-default"]',{rel:'alternate',hreflang:'x-default',href:canonical});

  const graph=[
    {
      '@type':'Organization',
      '@id':BASE+'#organization',
      name:'FINE.B',
      alternateName:['파인비','fine.B'],
      url:BASE,
      email:'whales84@naver.com',
      telephone:'+82-10-4758-7049',
      address:{
        '@type':'PostalAddress',
        streetAddress:'가람로116번길 107, 204호',
        addressLocality:'파주시',
        addressRegion:'경기도',
        addressCountry:'KR'
      },
      areaServed:{'@type':'Country',name:'대한민국'},
      knowsAbout:['패키지 제작','칼라박스 제작','단상자 제작','골판지 박스 제작','싸바리 박스 제작','쇼핑백 제작','패키지 인쇄','패키지 후가공','패키지 샘플 제작'],
      description:pages['index.html'].description
    },
    {
      '@type':'WebSite',
      '@id':BASE+'#website',
      url:BASE,
      name:'FINE.B 파인비',
      alternateName:'파인비 패키지 제작',
      inLanguage:'ko-KR',
      publisher:{'@id':BASE+'#organization'}
    },
    {
      '@type':'WebPage',
      '@id':canonical+'#webpage',
      url:canonical,
      name:data.title,
      description:data.description,
      inLanguage:'ko-KR',
      isPartOf:{'@id':BASE+'#website'},
      about:{'@id':BASE+'#organization'}
    }
  ];

  if(path!=='index.html'){
    graph.push({
      '@type':'BreadcrumbList',
      '@id':canonical+'#breadcrumb',
      itemListElement:[
        {'@type':'ListItem',position:1,name:'홈',item:BASE},
        {'@type':'ListItem',position:2,name:data.label,item:canonical}
      ]
    });
  }

  if(path==='faq.html'){
    const faq=[...document.querySelectorAll('.faq-item')].map(item=>{
      const q=item.querySelector('.faq-q')?.textContent?.replace(/\+\s*$/,'').trim();
      const a=item.querySelector('.faq-a')?.textContent?.replace(/\s+/g,' ').trim();
      return q&&a?{'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}:null;
    }).filter(Boolean);
    if(faq.length)graph.push({'@type':'FAQPage','@id':canonical+'#faq',mainEntity:faq});
  }

  const old=document.getElementById('fineb-seo-schema');
  if(old)old.remove();
  const schema=document.createElement('script');
  schema.id='fineb-seo-schema';
  schema.type='application/ld+json';
  schema.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph});
  document.head.appendChild(schema);
})();