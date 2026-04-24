# what-is-score

스토어명과 키워드로 네이버 쇼핑 순위를 조회하는 도구입니다.

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

## 저장소 내 위치

- 이 저장소에서는 `what-is-score/` 폴더가 앱 루트입니다.
- 상위 저장소 루트의 `package.json`은 편의상 실행용 래퍼만 제공합니다.
- 실제 앱 기준 파일은 `what-is-score/package.json`입니다.
- Cloudflare 배포 기준 파일은 `what-is-score/wrangler.jsonc`입니다.

## 주의

- `Client Secret`은 서버에서만 사용합니다. 프론트엔드 JS에는 넣지 않습니다.
- 이 도구의 순위는 네이버 쇼핑 검색 API 기준입니다.
- 실제 웹 화면의 광고, 개인화, 실시간 편집 요소와는 차이가 날 수 있습니다.
