# what-is-eat deploy notes

## Git structure

이 폴더는 저장소 안의 독립 프로젝트로 취급합니다.

- 앱 코드: `what-is-eat/`
- 실행 기준: `what-is-eat/package.json`
- Cloudflare 배포 기준: `what-is-eat/wrangler.jsonc`

## Local run

```bash
cd what-is-eat
npm start
```

## Cloudflare

이 프로젝트는 `wrangler.jsonc` 기반 Worker + Assets 배포 구조입니다.

### Cloudflare settings

- Git repository: `HDK-4732`
- Deploy command: `npx wrangler deploy -c what-is-eat/wrangler.jsonc`
- Version command: `npx wrangler versions upload -c what-is-eat/wrangler.jsonc`
- Root directory: `/` 그대로 둬도 됨

## Recommended repo usage

- `what-is-eat`와 `what-is-score`는 같은 저장소 안의 독립 앱입니다.
- Cloudflare에서는 프로젝트를 따로 만들고, 각 프로젝트에 맞는 wrangler 설정 파일을 사용합니다.
