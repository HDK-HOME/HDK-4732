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

이제 `functions/api/ranking.js`가 포함되어 있어 Cloudflare Pages Functions로 배포 가능합니다.

### Cloudflare Pages settings

- Framework preset: `None`
- Build command: 비워두기 또는 필요 시 `npm install`
- Build output directory: `/`
- Root directory: `what-is-score`

### Environment variables

- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

### Local Cloudflare-style dev

```bash
cd what-is-score
cp .dev.vars.example .dev.vars
npm run cf:dev
```

## Recommended repo usage

- 지금처럼 상위 저장소에 여러 프로젝트를 둘 수 있습니다.
- Cloudflare 연결 시에는 프로젝트별 루트 디렉터리를 분리합니다.
- `what-is-score`는 이 폴더 자체를 하나의 앱 루트로 취급하면 됩니다.
