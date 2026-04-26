# PROJECT_CONTEXT.md

## Project Name

MasterHong / what-is-score

## One-line Description

네이버 쇼핑 상품의 순위와 판매 신호를 분석해서, 온라인 셀러가 “내 상품 문제인지, 시장 문제인지” 빠르게 판단하도록 돕는 실전형 판매 진단 도구.

## Target User

- 네이버 스마트스토어/쇼핑 판매자
- 초보 온라인 셀러
- 상품은 올렸지만 왜 안 팔리는지 모르는 판매자
- 광고비, 썸네일, 가격, 리뷰, 상세페이지, 상품명 문제를 직관적으로 알고 싶은 사람

## Core User Problem

온라인 셀러는 매출 부진의 원인을 정확히 모른다.

사용자는 보통 이런 고민을 한다:

- 내 상품이 문제인가?
- 시장 전체가 죽은 건가?
- 썸네일이 약한가?
- 가격이 문제인가?
- 리뷰 신뢰가 부족한가?
- 상품명/SEO가 문제인가?
- 광고비가 새고 있는가?
- 오늘 당장 뭘 고쳐야 하는가?

MasterHong은 복잡한 데이터를 초보 셀러가 이해할 수 있는 사업 언어로 번역해야 한다.

## Product Philosophy

MasterHong은 단순한 데이터 도구가 아니다.

핵심 철학:

- 어려운 분석 용어를 초보 셀러 언어로 번역한다.
- CTR, CVR, SEO, 노출, 전환 같은 용어를 그대로 보여주지 않는다.
- 사용자에게는 “썸네일 문제”, “상세페이지 문제”, “상품명/카테고리 문제”, “가격/리뷰 신뢰 문제”, “광고비가 새는 문제”처럼 바로 이해되는 말로 보여준다.
- 사용자가 보고서를 읽고 끝나는 게 아니라, 오늘 바로 고칠 행동을 알게 해야 한다.
- 속도, 직관성, 신뢰감이 중요하다.
- 복잡한 전문가 도구가 아니라 “사업 고인물 해석기”가 되어야 한다.

## Main Features

### Current / Existing

- 네이버 공식 쇼핑 검색 API 기반 키워드 + 스토어명 순위 확인
- Cloudflare Worker 기반 API 라우팅
- NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 런타임 Secret 사용
- 네이버 상품 페이지에서 확장 프로그램으로 public product signals 추출
- productId, productTitle, storeName, saleCount, reviewCount, interestCustomerCount, price 등 normalizedSignals 추출
- signal 파라미터 기반 웹앱 전달
- localStorage 기반 최근 분석 기록
- SEO head, OG/Twitter, JSON-LD, sitemap, robots.txt, ads.txt, 404 처리
- privacy, terms, contact, methodology 신뢰 페이지

### Planned / Direction

- “내탓? 시장탓?” 판정 기능
- 내 상품과 경쟁 상품/시장군 비교
- 판매 부진 원인 후보 자동 분류
- 썸네일, 상품명, 카테고리, 가격, 리뷰, 상세페이지, 광고비 문제 판정
- 초보 셀러용 액션 가이드
- 점수 카드/리포트 공유 기능
- Chrome Web Store 정식 배포
- 커스텀 도메인 연결
- Google Search Console / Naver Search Advisor 등록
- 장기적으로 온라인 사업자용 필수 도구 풀셋/무기고로 확장

## Business Goal

초기 목표:

- 네이버 셀러가 실제로 반복해서 쓰는 판매 진단 도구 만들기
- “왜 안 팔리는지”를 직관적으로 알려주는 MVP 검증
- 무료 도구로 유입 확보
- 향후 유료 리포트, 월 구독, 고급 분석 도구로 확장

장기 목표:

- 온라인 사업자가 “안 쓰면 손해”라고 느끼는 필수 도구 플랫폼
- 마진계산기, 광고점검기, 정부지원사업 레이더, 판매진단기 등 실전형 도구 풀셋
- 초보와 고수 사이의 언어를 연결하는 사업 통역 플랫폼

## Important URLs

- Current production:
  - https://what-is-score.benywade31.workers.dev/

- Important routes:
  - /
  - /api/ranking
  - /api/env-check
  - /robots.txt
  - /sitemap.xml
  - /ads.txt
  - /privacy.html
  - /terms.html
  - /contact.html
  - /methodology.html
  - /404.html

- Future:
  - Custom domain planned
  - Canonical, sitemap, OG URL must be updated after custom domain connection

## Tech Stack

- Frontend:
  - HTML
  - CSS
  - Vanilla JavaScript

- Backend:
  - Cloudflare Worker
  - Local Node server for development

- Hosting:
  - Cloudflare Workers / assets

- APIs:
  - Naver Shopping Search API

- Extension:
  - Chrome Extension Manifest V3
  - content script
  - popup script

- Storage:
  - Browser localStorage
  - Cloudflare environment secrets for API credentials

## Key Files

### App / Frontend

- index.html
  - Main landing page and app UI
  - SEO metadata
  - visible content for search engines

- script.js
  - Browser-side app logic
  - ranking lookup UI
  - result rendering
  - localStorage history
  - extension signal ingestion

- styles.css
  - Main UI styling
  - SEO content sections
  - responsive layout

### Backend / API

- worker.js
  - Cloudflare Worker entry
  - API routes
  - static asset handling
  - headers
  - ads.txt
  - 404
  - canonical/www redirect logic

- server.js
  - Local development server
  - mirrors important API/static behavior

- ranking-core.mjs
  - Shared Naver Shopping API ranking logic
  - credential resolution
  - store-name matching
  - candidate scoring

- functions/api/ranking.js
  - Possible old/parallel Cloudflare Pages function
  - Needs confirmation whether legacy or still used

### Extension

- extension/manifest.json
  - Chrome extension permissions and config

- extension/content.js
  - Naver product page signal extraction
  - normalizedSignals creation

- extension/popup.js
  - Popup UI
  - product signal handoff to web app

### SEO / Trust / Docs

- robots.txt
- sitemap.xml
- ads.txt
- privacy.html
- terms.html
- contact.html
- methodology.html
- SEO_CHECKLIST.md
- WEBSTORE_SUBMISSION.md
- DEPLOY.md
- README.md

## Security Notes

Important security requirements:

- NAVER_CLIENT_ID and NAVER_CLIENT_SECRET must never be exposed in frontend code.
- API credentials must stay in Cloudflare runtime secrets or local environment variables.
- Do not log secrets.
- Do not commit .env files.
- Extension must use minimal permissions.
- Avoid unnecessary host permissions.
- User-provided input must be validated.
- Any decoded signal parameter must be treated as untrusted input.
- Avoid unsafe innerHTML unless data is sanitized.
- External URLs and redirects must be reviewed.
- Do not collect private user data unless explicitly needed.
- Public product page data extraction should remain limited to visible/public signals.

## SEO Notes

Current SEO direction:

- Search engines must see useful visible Korean content.
- Each important page needs title, description, canonical.
- sitemap.xml and robots.txt must stay valid.
- 404 page should return actual 404 status.
- ads.txt must return text/plain.
- OG/Twitter metadata should use final custom domain after domain connection.
- JSON-LD should accurately describe the product/service.
- Google Search Console and Naver Search Advisor registration needed after custom domain.

Main search intent:

- 네이버 쇼핑 순위 확인
- 스마트스토어 순위 확인
- 네이버 상품 판매량 확인
- 스마트스토어 판매 진단
- 온라인 셀러 상품 분석
- 내 상품이 안 팔리는 이유

## UX / Product Notes

The user should immediately understand:

- 이 도구가 무엇을 해주는지
- 어떤 정보를 입력해야 하는지
- 결과를 어떻게 해석해야 하는지
- 오늘 무엇을 고쳐야 하는지

Avoid showing overly technical words to beginner sellers.

Prefer business language:

- 썸네일 문제
- 가격 문제
- 리뷰 신뢰 문제
- 상품명 문제
- 카테고리 문제
- 상세페이지 문제
- 광고비 누수 문제
- 시장 전체 하락
- 내 상품 경쟁력 부족

## Do Not Break

- Naver ranking lookup flow
- Cloudflare Worker deployment
- /api/ranking route
- /api/env-check route
- Existing SEO files
- Existing trust pages
- Extension handoff flow using signal parameter
- localStorage history behavior
- 404 status behavior
- ads.txt content type
- runtime secret handling

## Known Risks / Needs Confirmation

- functions/api/ranking.js may be legacy duplicate logic.
- node_modules and generated files should not be unnecessarily committed.
- dist/master-hong-extension.zip should be confirmed before source control.
- Chrome Web Store readiness still needs review.
- Custom domain is not connected yet.
- Canonical/sitemap/OG URLs need update after custom domain.
- No obvious automated test suite exists yet.
- Extension public data extraction may be fragile if Naver page structure changes.
- Direct server-side scraping/fetching of Naver pages may hit 429 and should not be relied on for production.

## Current Priority

Current priority:

1. Stabilize the Codex agent operating system.
2. Fill this PROJECT_CONTEXT.md correctly.
3. Run read-only full review of what-is-score.
4. Identify top 10 risks and improvements.
5. Fix only safe, high-impact issues step by step.
6. Avoid destructive rewrites.
7. Prepare for custom domain, search console registration, and Chrome extension beta distribution.

## How Codex Should Work On This Project

Before editing:

1. Read root AGENTS.md.
2. Read root REVIEW_AGENTS.md.
3. Read root GLOBAL_CHECKLIST.md.
4. Read root EXECUTE.md.
5. Read this PROJECT_CONTEXT.md.
6. Inspect project structure.
7. Explain plan before changing files.

When reviewing:

- Start read-only.
- Use one agent role at a time.
- Report issues before fixes.
- Prioritize security and existing functionality.
- Do not deploy or commit unless explicitly instructed.

When fixing:

- Make small safe changes.
- Preserve working features.
- Run available checks.
- Show changed files.
- Explain manual test steps if no tests exist.