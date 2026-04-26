# SEO Checklist

## SEO 검사기 점수 대응 항목

| 항목 | 원인 | 수정 파일 | 수정 내용 | 재검사 방법 |
| --- | --- | --- | --- | --- |
| Title 길이/주제 | 기존 title이 짧고 핵심 키워드가 부족했음 | `index.html` | `마스터홍 | 네이버 스마트스토어 순위·판매신호 분석기`로 변경 | SEO 검사기에서 title 길이와 키워드 확인 |
| Meta description 없음 | 검색 결과 스니펫에 사용할 설명 부족 | `index.html`, 정책 페이지 | 페이지별 description 추가 | 페이지 소스에서 `meta[name="description"]` 확인 |
| Canonical 없음 | 대표 URL 신호 부족 | `index.html`, `privacy.html`, `terms.html`, `contact.html`, `methodology.html` | 각 페이지 canonical 추가 | SEO 검사기 canonical 항목 확인 |
| Robots meta | 색인 허용 신호 불명확 | `index.html`, 주요 정적 페이지 | `index, follow` 추가 | noindex/nofollow 미검출 확인 |
| Open Graph/Twitter | 공유 메타데이터 없음 | `index.html`, `assets/brand/masterhong-og.svg` | OG/Twitter 메타와 실제 공유 이미지 추가 | OG/Twitter 카드 검사 |
| H1/H2 구조 | 핵심 주제와 섹션 의미가 약했음 | `index.html` | H1과 H2를 순위 확인, 판매신호 분석, 경쟁력 진단, 다음 행동으로 정리 | HTML heading outline 확인 |
| 신뢰/전문성 콘텐츠 | 기능 UI 중심으로 방법론 설명 부족 | `index.html`, `methodology.html` | 분석 방법론, 데이터 한계, 해석 방법, 예시 분석 추가 | 초기 HTML에서 본문 텍스트 확인 |
| 신뢰 페이지 링크 | footer 외 신뢰 링크 부족 | `index.html`, 정책 페이지 | hero 안내 링크와 문서 간 내부 링크 추가 | 크롤러 링크 추출 확인 |
| Sitemap 없음 | URL 목록 제출 파일 없음 | `sitemap.xml`, `robots.txt` | 주요 URL sitemap 생성 및 robots에 위치 명시 | `/sitemap.xml`, `/robots.txt` 확인 |
| 404 페이지 | 기본 404 또는 SPA fallback 가능성 | `404.html`, `worker.js`, `server.js` | 사용자 친화 HTML 404와 404 status 반환 | 없는 URL 요청 시 404 HTML 확인 |
| Favicon | favicon 참조 없음 | `favicon.svg`, `index.html` | favicon 및 apple-touch-icon 연결 | 브라우저/검사기 favicon 확인 |
| HSTS | 보안 헤더 없음 | `worker.js`, `server.js` | `Strict-Transport-Security` 추가 | `curl -I`로 헤더 확인 |
| ads.txt Content-Type | `/ads.txt`가 HTML로 반환될 수 있음 | `ads.txt`, `worker.js` | text/plain 응답 강제 | `curl -I /ads.txt` 확인 |
| Canonicalization | www workers.dev 변형 처리 없음 | `worker.js` | `www.what-is-score...`를 non-www로 301 redirect | www URL 요청 시 301 확인 |
| Render-blocking CSS | CSS가 일반 stylesheet로만 로딩됨 | `index.html` | 최소 critical CSS inline, stylesheet preload 적용, JS defer 유지 | Lighthouse render-blocking 항목 확인 |

## Google 공식 가이드 대응 항목

- Google SEO Starter Guide는 검색엔진이 콘텐츠를 쉽게 크롤링, 색인 생성, 이해할 수 있도록 개선하라고 안내한다. 대응으로 주요 설명을 JS 렌더링 전 초기 HTML에 배치했다.
- 사이트맵은 중요한 URL 목록을 전달하는 보조 수단이므로 `sitemap.xml`을 만들고 `robots.txt`에 명시했다.
- 사용자가 보는 콘텐츠와 검색엔진용 콘텐츠가 분리되지 않도록 방법론, 예시 분석, 내부 링크를 실제 화면에 노출했다.
- 구조화 데이터는 확실한 정보만 사용해 `WebApplication` 타입으로 작성했고, 허위 리뷰/평점/조직 세부정보는 넣지 않았다.
- CSS와 JS 리소스는 크롤러가 접근 가능한 정적 파일로 유지했다.

## Naver Search Advisor 대응 항목

- `robots.txt`는 `User-agent: *`와 `Allow: /`로 모든 검색엔진 접근을 허용한다.
- `robots.txt`에 `Sitemap: https://what-is-score.benywade31.workers.dev/sitemap.xml`을 명시했다.
- 메인 페이지와 신뢰 페이지에 canonical URL을 지정했다.
- 색인 대상 페이지에는 `noindex`나 `nofollow`를 넣지 않았다. 단, `404.html`은 검색 결과에 노출될 필요가 없어 `noindex, follow`를 사용했다.
- 메인 페이지 주요 콘텐츠는 JS 실행 후에만 생성되는 구조가 아니라 HTML 본문에 직접 포함했다.
- 페이지 제목은 각 페이지 주제를 설명하도록 분리했다.

## 아직 커스텀 도메인 연결 후 해결할 항목

- workers.dev 서브도메인의 `www` 변형은 Worker에서 301 redirect를 처리하도록 구현했다.
- 최종 운영 도메인이 연결되면 canonical, sitemap, robots.txt, OG URL을 커스텀 도메인 기준으로 교체해야 한다.
- 네이버 서치어드바이저와 Google Search Console 소유 확인 메타 태그는 실제 계정에서 발급받은 값으로 추가해야 한다.
- ads.txt는 AdSense 또는 광고 계정이 발급되면 공식 publisher line으로 교체해야 한다. 현재는 빈 text/plain 응답으로 Content-Type 실패만 제거한다.

## 재검사 방법

1. 로컬 확인: `npm start` 후 `http://127.0.0.1:8000/`, `/robots.txt`, `/sitemap.xml`, `/ads.txt`, 없는 경로를 확인한다.
2. 헤더 확인: `curl -I http://127.0.0.1:8000/ads.txt`와 `curl -I http://127.0.0.1:8000/not-found-test`로 Content-Type, HSTS, 404 status를 확인한다.
3. 배포 확인: `npm run cf:dry-run` 후 `npm run cf:deploy`로 Cloudflare Worker 설정이 유효한지 확인한다.
4. 검색엔진 확인: Google Search Console URL 검사, Naver Search Advisor 사이트 간단 체크, sitemap 제출을 진행한다.
5. SEO 검사기 재검사: title, description, canonical, OG/Twitter, favicon, HSTS, ads.txt, sitemap, 404, heading structure 항목을 다시 확인한다.
