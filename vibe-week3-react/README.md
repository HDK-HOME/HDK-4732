# vibe-week3-react

Vibe Coding 3주차 React 실습을 위한 beginner-friendly Vite + React + TypeScript 프로젝트입니다.

이 프로젝트는 HDK-4732 레포 안에 있는 독립 실습 폴더입니다. 기존 sibling project인 `../what-is-eat`, `../what-is-score`와 분리해서 사용합니다.

## Tech Stack

- Vite
- React
- TypeScript
- CSS

## Learning Goals

- React 컴포넌트 이해하기
- JSX로 화면 구조 만들기
- `src/App.tsx`가 화면을 어떻게 바꾸는지 이해하기
- `src/App.css`로 스타일을 조정하기
- TypeScript 타입을 필요한 경우에만 단순하게 사용하기
- 버튼, 카드, 입력창, 리스트 같은 기본 UI를 단계적으로 만들기
- 실행, 빌드, 변경 확인, 커밋 흐름 익히기

## Commands

```bash
npm install
npm run dev -- --host 0.0.0.0
npm run build
npm run lint
```

## Folder Structure

```text
vibe-week3-react/
  src/
    App.tsx       # beginner practice UI starts here
    App.css       # beginner practice styling starts here
    main.tsx      # React app entry point
    index.css     # global CSS
  public/         # static assets
  index.html      # Vite HTML entry
  package.json    # scripts and dependencies
```

## Main Practice Files

Start with these files first:

- `src/App.tsx`
- `src/App.css`

Avoid creating complex folder structures too early. Add new files only when a learning milestone clearly needs them.

## TypeScript Direction

Use TypeScript as a learning support tool, not as a source of complexity.

- Keep types simple.
- Add explicit types only when they make the code clearer.
- Avoid advanced generics, utility types, or complex type abstractions in early lessons.

## Important Rules

- Keep this project beginner-friendly.
- Do not modify `../what-is-eat`.
- Do not modify `../what-is-score`.
- Do not modify root workspace harness files from this project without explicit approval.
- Do not auto commit, push, or deploy.
- Before changing files, explain what will change.
- After changing files, run `npm run build`.

