# FINE.B 검색엔진 운영 설정

운영 도메인: `https://finebpkg.com/`

## Google Search Console

현재 저장소에는 Google Search Console 소유확인 값이 없습니다. 임의의 verification 값을 배포하지 않습니다.

권장 순서:
1. Search Console에서 `finebpkg.com` 도메인 속성을 등록합니다.
2. 가능하면 DNS 방식으로 소유권을 확인합니다.
3. URL 접두어 방식의 HTML 메타 인증을 사용할 경우 Google이 발급한 실제 값만 각 공개 페이지 `<head>` 또는 공통 SEO 코드에 추가합니다.
4. 사이트맵으로 `https://finebpkg.com/sitemap.xml`을 제출합니다.
5. 홈, 제작품목, 포트폴리오, 주문제작가이드 등 핵심 URL은 URL 검사에서 색인 요청합니다.

메타 인증을 선택한 경우 형식:
`<meta name="google-site-verification" content="GOOGLE에서_발급받은_실제값">`

> 실제 인증값을 받기 전에는 placeholder를 운영 HTML에 넣지 않습니다.

## Naver Search Advisor

현재 실제 Naver 소유확인 메타가 코드에 존재하며 유지합니다.

- 사이트: `https://finebpkg.com/`
- 사이트맵: `https://finebpkg.com/sitemap.xml`
- robots: `https://finebpkg.com/robots.txt`

서치어드바이저에서 사이트맵 제출 후 주요 URL 검사/수집 상태를 확인합니다.

## IndexNow (선택)

Naver Search Advisor는 IndexNow를 지원하므로 포트폴리오나 콘텐츠 변경을 빠르게 알리는 용도로 사용할 수 있습니다. 다만 API key 검증 파일을 `finebpkg.com`에 실제로 호스팅해야 하므로 가짜 키나 placeholder key 파일은 저장소에 배포하지 않습니다.

활성화할 때 사용할 GitHub Secret 이름:

- `INDEXNOW_KEY` — Naver/IndexNow에서 사용할 실제 API key
- `INDEXNOW_KEY_LOCATION` — 동일 호스트에 공개한 key 파일의 절대 URL (예: `https://finebpkg.com/<실제키>.txt`)

활성화 절차:
1. Naver Search Advisor 가이드에 따라 실제 API key를 생성합니다.
2. 안내된 key 파일을 `finebpkg.com`의 동일 호스트에 배포합니다.
3. 위 두 값을 GitHub Actions Secrets에 등록합니다.
4. 이후 Pages 배포 완료 후 변경 URL을 IndexNow endpoint로 전송하는 워크플로를 활성화할 수 있습니다.

현재는 실제 key 파일이 없으므로 자동 제출 workflow를 의도적으로 활성화하지 않습니다. 잘못된 keyLocation을 반복 호출하는 것보다 정상적인 sitemap/크롤링 상태를 유지하는 편이 안전합니다.

## 공개 색인 대상

- `/`
- `/about.html`
- `/production.html`
- `/process.html`
- `/works.html`
- `/guide.html`
- `/sample.html`
- `/faq.html`
- `/inquiry.html`
- `/quote.html`

색인 제외:
- `/admin.html`
- `/admin-portfolio.html`
- `/404.html` (meta robots `noindex,follow`)

## SEO 유지보수 규칙

- 운영 대표 URL은 항상 `https://finebpkg.com/` 기준으로 유지합니다.
- GitHub Pages 기본 URL을 canonical로 사용하지 않습니다.
- 새 공개 HTML 페이지를 추가할 때 `assets/js/seo-meta.js` 페이지 설정과 `sitemap.xml`을 같이 갱신합니다.
- 관리자/개발용 페이지는 sitemap에 추가하지 않습니다.
- `<meta name="keywords">` 대량 나열보다 실제 제목, 설명, H1/H2, 본문과 내부 링크를 우선합니다.
- 새 포트폴리오 이미지에는 콘텐츠에 맞는 alt를 사용하고 카드 이미지는 lazy loading을 유지합니다.
