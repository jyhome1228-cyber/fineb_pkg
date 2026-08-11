(()=>{
  const BASE='https://finebpkg.com/';
  const NAVER='06f7a753cf337b669bb989d2de987ae43aab51f8';
  const DEFAULT_IMAGE='https://cdn.imweb.me/upload/S2023030963558ef55ba8e/c5acf880c9b79.png';
  const LOGO=BASE+'assets/logo.svg';
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();

  const pages={
    'index.html':{
      title:'패키지 제작·칼라박스 제작 | FINE.B 파인비',
      description:'파인비(FINE.B)는 단상자, 칼라박스, 골판지·택배박스, 싸바리·선물박스, 쇼핑백과 인쇄물의 구조 상담부터 인쇄·후가공·양산·납품까지 함께하는 패키지 제작 파트너입니다.',
      label:'패키지 제작',
      pageType:'WebPage'
    },
    'about.html':{
      title:'FINE.B 파인비 회사소개 | 패키지 제작 파트너',
      description:'경기도 파주의 FINE.B 파인비는 패키지 구조 상담부터 종이 선택, 인쇄·후가공·가공, 양산과 납품까지 제작 전 과정을 함께 확인하는 패키지 제작 파트너입니다.',
      label:'회사소개',
      pageType:'AboutPage'
    },
    'production.html':{
      title:'단상자·골판지·싸바리·쇼핑백 제작 | FINE.B',
      description:'종이 단상자와 칼라박스, 골판지·택배박스, 싸바리·선물박스, 쇼핑백, 브랜드북·카탈로그·리플렛·책자와 소량 인쇄 샘플까지 FINE.B 제작 품목을 확인하세요.',
      label:'제작품목',
      pageType:'CollectionPage',
      service:'맞춤 패키지 제작'
    },
    'process.html':{
      title:'패키지 제작과정 | 인쇄·후가공·도무송·접착 | FINE.B',
      description:'옵셋 인쇄, 코팅, 금박·은박·형압·에폭시 후가공, 톰슨·도무송, 접착, 가공, 포장과 납품까지 FINE.B의 패키지 제작 흐름과 확인사항을 안내합니다.',
      label:'제작과정',
      pageType:'WebPage'
    },
    'works.html':{
      title:'패키지 제작사례·박스 포트폴리오 | FINE.B',
      description:'단상자, 칼라박스, 선물박스, 싸바리, 슬리브와 특수구조 패키지 등 FINE.B의 실제 제작 사례와 패키지 완성 결과를 확인하세요.',
      label:'포트폴리오',
      pageType:'CollectionPage'
    },
    'guide.html':{
      title:'박스 주문제작 가이드 | 종이·인쇄·후가공 | FINE.B',
      description:'박스 구조부터 로얄아이보리·아이보리·CCP·특수지와 평량, 옵셋·별색·UV 인쇄, 코팅, 금박·형압·에폭시 후가공, 사이즈와 납품 기준까지 정리했습니다.',
      label:'주문제작가이드',
      pageType:'WebPage'
    },
    'sample.html':{
      title:'패키지 샘플 제작·소량 박스 인쇄 | FINE.B',
      description:'종이박스, 단상자, 골판지박스와 쇼핑백을 1·2·3·5·10·20개 단위로 소량 인쇄 샘플 제작해 구조와 디자인을 양산 전에 확인할 수 있습니다.',
      label:'샘플제작',
      pageType:'WebPage',
      service:'소량 패키지 인쇄 샘플 제작'
    },
    'faq.html':{
      title:'패키지 제작 FAQ | 제작기간·최소수량·샘플 | FINE.B',
      description:'패키지 제작기간, 최소 제작수량, 디자인, 샘플 제작, 교정 인쇄, 박·에폭시 후가공과 제작 공정 등 자주 묻는 내용을 확인하세요.',
      label:'자주묻는질문',
      pageType:'FAQPage'
    },
    'inquiry.html':{
      title:'패키지·박스 제작문의 | 맞춤 제작 상담 FINE.B',
      description:'구조나 소재를 정확히 몰라도 제품 용도, 예상 수량과 일정만으로 상담할 수 있습니다. 단상자·칼라박스·싸바리·골판지·쇼핑백·인쇄물 맞춤 제작을 문의하세요.',
      label:'제작문의',
      pageType:'ContactPage'
    },
    'quote.html':{
      title:'패키지·칼라박스 제작 견적 | FINE.B 파인비',
      description:'박스 형태, 제작 수량, 완성 사이즈, 종이·평량, 인쇄, 코팅과 후가공 사양을 순서대로 선택해 단상자·골판지·싸바리·쇼핑백 제작 견적을 요청하세요.',
      label:'견적내기',
      pageType:'WebPage'
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
  document.head.querySelector('meta[name="keywords"]')?.remove();
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el=>el.remove());

  setMeta('meta[name="description"]',{name:'description',content:data.description});
  setMeta('meta[name="robots"]',{name:'robots',content:'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'});
  setMeta('meta[name="author"]',{name:'author',content:'FINE.B 파인비'});
  setMeta('meta[name="naver-site-verification"]',{name:'naver-site-verification',content:NAVER});
  setMeta('meta[name="geo.region"]',{name:'geo.region',content:'KR-41'});
  setMeta('meta[name="geo.placename"]',{name:'geo.placename',content:'Paju-si, Gyeonggi-do'});
  setMeta('meta[name="theme-color"]',{name:'theme-color',content:'#0a2240'});

  setMeta('meta[property="og:type"]',{property:'og:type',content:'website'});
  setMeta('meta[property="og:site_name"]',{property:'og:site_name',content:'FINE.B 파인비'});
  setMeta('meta[property="og:locale"]',{property:'og:locale',content:'ko_KR'});
  setMeta('meta[property="og:title"]',{property:'og:title',content:data.title});
  setMeta('meta[property="og:description"]',{property:'og:description',content:data.description});
  setMeta('meta[property="og:url"]',{property:'og:url',content:canonical});
  setMeta('meta[property="og:image"]',{property:'og:image',content:DEFAULT_IMAGE});
  setMeta('meta[property="og:image:alt"]',{property:'og:image:alt',content:`${data.label} | FINE.B 파인비`});

  setMeta('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'});
  setMeta('meta[name="twitter:title"]',{name:'twitter:title',content:data.title});
  setMeta('meta[name="twitter:description"]',{name:'twitter:description',content:data.description});
  setMeta('meta[name="twitter:image"]',{name:'twitter:image',content:DEFAULT_IMAGE});
  setMeta('meta[name="twitter:image:alt"]',{name:'twitter:image:alt',content:`${data.label} | FINE.B 파인비`});

  setLink('link[rel="canonical"]',{rel:'canonical',href:canonical});
  setLink('link[rel="icon"]',{rel:'icon',href:'assets/favicon.svg',type:'image/svg+xml'});
  setLink('link[rel="manifest"]',{rel:'manifest',href:'site.webmanifest'});

  const organization={
    '@type':'Organization',
    '@id':BASE+'#organization',
    name:'FINE.B',
    alternateName:['파인비','fine.B'],
    url:BASE,
    logo:{'@type':'ImageObject',url:LOGO},
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
  };

  const graph=[
    organization,
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
      '@type':data.pageType||'WebPage',
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

  if(data.service){
    graph.push({
      '@type':'Service',
      '@id':canonical+'#service',
      name:data.service,
      url:canonical,
      description:data.description,
      areaServed:{'@type':'Country',name:'대한민국'},
      provider:{'@id':BASE+'#organization'}
    });
  }

  if(path==='faq.html'){
    const faq=[...document.querySelectorAll('.faq-item')].map(item=>{
      const q=item.querySelector('.faq-q')?.textContent?.replace(/\+\s*$/,'').trim();
      const a=item.querySelector('.faq-a')?.textContent?.replace(/\s+/g,' ').trim();
      return q&&a?{'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}:null;
    }).filter(Boolean);
    const faqPage=graph.find(item=>item['@id']===canonical+'#webpage');
    if(faq.length&&faqPage)faqPage.mainEntity=faq;
  }

  document.getElementById('fineb-seo-schema')?.remove();
  const schema=document.createElement('script');
  schema.id='fineb-seo-schema';
  schema.type='application/ld+json';
  schema.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph});
  document.head.appendChild(schema);
})();