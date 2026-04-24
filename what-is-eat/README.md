# what-is-eat

기분, 허기, 예산, 상황을 바탕으로 오늘 저녁 메뉴와 먹는 방법을 추천하는 단일 페이지 서비스입니다.

## 실행

이 폴더 자체를 독립 프로젝트처럼 사용합니다.

```bash
cd what-is-eat
npm start
```

VS Code/Codespaces에서는 `Terminal > Run Task... > Preview what-is-eat`로도 확인할 수 있습니다.

## 폴더 구성

- `index.html`, `styles.css`, `script.js`: 앱 본문
- `manifest.webmanifest`, `favicon.png`: 앱 메타 자산
- `robots.txt`, `sitemap.xml`, `_redirects`: 배포 보조 파일
- `EXTERNAL_SEO.md`: 외부 SEO 작업 체크리스트
- `worker.js`, `wrangler.jsonc`: Cloudflare Worker 배포 기준 파일
- `package.json`: 프로젝트 전용 실행 기준

## Cloudflare Workers

로컬에서 Cloudflare 방식으로 확인하려면:

```bash
cd what-is-eat
npm run cf:dev
```

Cloudflare 배포 기준 설정 파일은 `what-is-eat/wrangler.jsonc` 입니다.
