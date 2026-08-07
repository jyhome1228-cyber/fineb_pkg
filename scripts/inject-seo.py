from pathlib import Path
import re
import html

BASE = "https://jyhome1228-cyber.github.io/fineb_pkg/"
OG_IMAGE = BASE + "assets/og-preview.png"

PAGES = {
    "index.html": {
        "title": "파인비 FINE.B | 패키지 제작 · 샘플제작 · 인쇄",
        "description": "칼라박스, 골판지, 싸바리, 쇼핑백, 샘플, 책·인쇄물 제작. 구조 상담부터 인쇄·후가공·양산과 납품까지 함께하는 패키지 제작 파트너 FINE.B.",
    },
    "about.html": {
        "title": "회사소개 | FINE.B 파인비",
        "description": "패키지 제작의 시작부터 완성까지 함께하는 FINE.B 파인비의 소개와 제작 방식.",
    },
    "production.html": {
        "title": "제작품목 | FINE.B 파인비",
        "description": "종이박스, 골판지·택배박스, 싸바리·선물박스, 쇼핑백, 책·인쇄물과 소량 샘플 제작 품목 안내.",
    },
    "process.html": {
        "title": "패키지 제작과정 | FINE.B 파인비",
        "description": "인쇄, 코팅, 박·후가공, 톰슨·도무송, 접착, 가공, 포장, 납품까지 실제 패키지 제작 공정 안내.",
    },
    "works.html": {
        "title": "제작사례 | FINE.B 파인비",
        "description": "종이박스, 골판지, 싸바리, 쇼핑백, 책·인쇄물 등 FINE.B 패키지 제작사례.",
    },
    "guide.html": {
        "title": "패키지 제작가이드 | FINE.B 파인비",
        "description": "박스 형태, 인쇄 용지와 평량, 인쇄 방식, 코팅·후가공, 사이즈, 샘플과 납품까지 패키지 제작가이드.",
    },
    "sample.html": {
        "title": "소량 인쇄 샘플제작 | FINE.B 파인비",
        "description": "종이박스·골판지박스·쇼핑백을 1·2·3·5·10·20개 단위로 먼저 확인할 수 있는 소량 인쇄 샘플 제작.",
    },
    "faq.html": {
        "title": "자주묻는질문 | FINE.B 파인비",
        "description": "패키지 제작기간, 최소수량, 디자인, 샘플, 후가공과 제작 진행 과정에 대한 자주묻는질문.",
    },
    "inquiry.html": {
        "title": "제작문의 | FINE.B 파인비",
        "description": "패키지 구조를 정확히 몰라도 가능한 FINE.B 제작상담. 제품 용도, 예상 수량과 희망 일정만으로 문의할 수 있습니다.",
    },
    "quote.html": {
        "title": "패키지 견적내기 | FINE.B 파인비",
        "description": "박스 형태, 수량, 사이즈, 종이·평량, 인쇄, 코팅과 후가공 사양을 선택해 FINE.B에 제작 견적을 요청하세요.",
    },
}

COMMON = """
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<meta name="theme-color" content="#0A2240">
<meta name="application-name" content="FINE.B">
<meta name="apple-mobile-web-app-title" content="FINE.B">
<meta name="format-detection" content="telephone=no">
""".strip()


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def seo_block(filename: str, title: str, description: str) -> str:
    url = BASE if filename == "index.html" else BASE + filename
    block = f"""<!-- SEO:START -->
<title>{esc(title)}</title>
<meta name="description" content="{esc(description)}">
{COMMON}
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="FINE.B 파인비">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(description)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{OG_IMAGE}">
<meta property="og:image:secure_url" content="{OG_IMAGE}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="FINE.B 파인비 - Package Development & Production">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(description)}">
<meta name="twitter:image" content="{OG_IMAGE}">
<!-- SEO:END -->"""
    if filename == "index.html":
        block += """
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "파인비(fine.B)",
  "alternateName": "FINE.B",
  "url": "https://jyhome1228-cyber.github.io/fineb_pkg/",
  "logo": "https://jyhome1228-cyber.github.io/fineb_pkg/assets/logo.svg",
  "email": "whales84@naver.com",
  "description": "칼라박스, 샘플, 디자인, 인쇄, 출판·제본, 쇼핑백 및 패키지 제작",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "가람로116번길 107, 209호",
    "addressLocality": "파주시",
    "addressRegion": "경기도",
    "addressCountry": "KR"
  }
}
</script>"""
    return block


def inject_public(path: Path, cfg: dict):
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"<!-- SEO:START -->.*?<!-- SEO:END -->", "", text, flags=re.S)
    text = re.sub(r"<script type=\"application/ld\+json\">.*?</script>", "", text, flags=re.S)
    text = re.sub(r"<title>.*?</title>", "", text, flags=re.S | re.I)
    text = re.sub(r"<meta\s+name=[\"']description[\"'][^>]*>", "", text, flags=re.I)
    text = re.sub(r"<link\s+rel=[\"']icon[\"'][^>]*>", "", text, flags=re.I)
    text = re.sub(r"<meta\s+name=[\"']theme-color[\"'][^>]*>", "", text, flags=re.I)
    block = seo_block(path.name, cfg["title"], cfg["description"])
    match = re.search(r"<meta\s+name=[\"']viewport[\"'][^>]*>", text, flags=re.I)
    if match:
        pos = match.end()
        text = text[:pos] + block + text[pos:]
    else:
        text = text.replace("<head>", "<head>" + block, 1)
    path.write_text(text, encoding="utf-8")


def inject_admin(path: Path):
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    if 'href="assets/favicon.svg"' not in text:
        text = text.replace('<meta name="robots" content="noindex,nofollow">', '<meta name="robots" content="noindex,nofollow"><link rel="icon" type="image/svg+xml" href="assets/favicon.svg"><meta name="theme-color" content="#0A2240">', 1)
    path.write_text(text, encoding="utf-8")


for filename, cfg in PAGES.items():
    path = Path(filename)
    if path.exists():
        inject_public(path, cfg)

inject_admin(Path("admin.html"))
print("SEO metadata injected")
