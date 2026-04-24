# what-is-score deploy notes

## Git structure

이 폴더는 저장소 안의 독립 프로젝트로 취급합니다.

- 앱 코드: `what-is-score/`
- 실행 기준: `what-is-score/package.json`
- 비밀값: `what-is-score/.env`

## Local run

```bash
cd what-is-score
cp .env.example .env
npm start
```

## Cloudflare

이 프로젝트는 `wrangler.jsonc` 기반 Worker 배포 구조입니다.

### Required files

- `wrangler.jsonc`
- `worker.js`
- 정적 자산: `index.html`, `script.js`, `styles.css`

### Cloudflare settings

- Git repository: `HDK-4732`
- Deploy command: `npx wrangler deploy -c what-is-score/wrangler.jsonc`
- Version command: `npx wrangler versions upload -c what-is-score/wrangler.jsonc`
- Root directory: `/` 그대로 둬도 됨

### Environment variables

- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

### Local check

```bash
cd what-is-score
cp .dev.vars.example .dev.vars
npm run cf:dry-run
npm run cf:dev
```

## Recommended repo usage

- 지금처럼 상위 저장소에 여러 프로젝트를 둘 수 있습니다.
- Cloudflare 연결 시에는 프로젝트별 루트 디렉터리를 분리합니다.
- `what-is-score`는 이 폴더 자체를 하나의 앱 루트로 취급하면 됩니다.
