# 마스터홍 판매신호 분석기

마스터홍의 판매신호 분석기는 스토어명과 키워드로 네이버 쇼핑 순위를 확인하고, 크롬 확장 프로그램으로 공개 상품 판매신호를 분석하는 도구입니다.

영문 표기: Master Hong

## 실행

이 폴더 자체를 독립 프로젝트처럼 사용합니다.

```bash
cd what-is-score
cp .env.example .env
npm start
```

`.env` 내용:

```env
NAVER_CLIENT_ID=YOUR_NAVER_CLIENT_ID
NAVER_CLIENT_SECRET=YOUR_NAVER_CLIENT_SECRET
```

## Cloudflare Workers

이 프로젝트는 `wrangler.jsonc`와 `worker.js`를 포함하므로 Cloudflare Workers로 배포할 수 있습니다.

- Cloudflare 배포 시: Worker `env.NAVER_CLIENT_ID`, `env.NAVER_CLIENT_SECRET` 사용
- 로컬 Node 실행 시: `process.env.NAVER_CLIENT_ID`, `process.env.NAVER_CLIENT_SECRET` 사용

로컬에서 Cloudflare 방식으로 확인하려면:

```bash
cd what-is-score
cp .dev.vars.example .dev.vars
npm run cf:dev
```

Cloudflare 대시보드에는 아래 환경변수를 넣으면 됩니다.

- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

## 동작 방식

- `keyword`로 네이버 쇼핑 검색 API를 조회합니다.
- 반환된 `mallName`과 입력한 스토어명을 비교합니다.
- 일치하는 첫 결과의 순위를 표시합니다.
- 조회 범위는 최대 500위까지 지원합니다.

## 상품 URL 판매신호 실험

네이버 공식 쇼핑 검색 API에는 3일/7일/6개월 판매량 필드가 없으므로 판매량처럼 보이는 값을 공식 API 응답으로 표현하지 않습니다. 상품 URL 기반 기능은 공개 페이지에서 감지한 신호 또는 자체 추적 데이터로 분리합니다.

단순 `fetch` 디버그:

```bash
node product-signal-debug.mjs "https://smartstore.naver.com/{store}/products/{productId}"
```

브라우저 렌더링 실험:

```bash
cd what-is-score
npm install
npx playwright install chromium
node product-signal-playwright.mjs "https://smartstore.naver.com/donomall/products/2419380777"
```

모바일 뷰포트로 테스트:

```bash
node product-signal-playwright.mjs "https://smartstore.naver.com/donomall/products/2419380777" --mobile
```

실험 출력:

- `productId`: URL의 `products/{id}`, `productId`, `productNo`, `nv_mid` 후보
- `status`: Chromium으로 연 페이지의 HTTP 상태
- `title`, `bodyLength`: 렌더링된 문서 기본 정보
- `detectedSignals`: 구매, 판매, 주문, 리뷰, 상품평, 후기, 찜, 관심, 좋아요 후보
- `snippets`: 본문 미리보기, 키워드 주변 텍스트, script JSON 후보
- `blockedReason`: 429, 로그인, 캡차, 접근 제한, 비정상 트래픽 후보

자동 수집 주의:

- 서버나 Worker에서 스마트스토어 상품 페이지를 직접 `fetch`하면 HTTP 429 등 자동 요청 제한이 발생할 수 있습니다.
- 브라우저 렌더링도 차단될 수 있으므로 현재 단계에서는 앱 UI에 붙이지 않고 자동 추출 가능성만 실험합니다.
- 실제 판매량으로 단정하지 않고 공개 페이지에서 감지한 판매신호 후보로만 다룹니다.

## 저장소 내 위치

- 이 저장소에서는 `what-is-score/` 폴더가 앱 루트입니다.
- 상위 저장소 루트의 `package.json`은 편의상 실행용 래퍼만 제공합니다.
- 실제 앱 기준 파일은 `what-is-score/package.json`입니다.
- Cloudflare 배포 기준 파일은 `what-is-score/wrangler.jsonc`입니다.

## 주의

- `Client Secret`은 서버에서만 사용합니다. 프론트엔드 JS에는 넣지 않습니다.
- 이 도구의 순위는 네이버 쇼핑 검색 API 기준입니다.
- 실제 웹 화면의 광고, 개인화, 실시간 편집 요소와는 차이가 날 수 있습니다.
