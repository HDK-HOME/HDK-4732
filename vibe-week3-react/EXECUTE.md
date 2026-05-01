# EXECUTE.md

Use this file to work safely inside `vibe-week3-react`.

## Standard Start

Before editing:

1. Confirm the current folder is `vibe-week3-react` or use it as the working directory.
2. Read `AGENTS.md`, `RULES.md`, and `CHECKLIST.md`.
3. Inspect `src/App.tsx` and `src/App.css` if the task affects the UI.
4. Explain which files will change.

## Normal Development Flow

1. Make a small focused change.
2. Prefer `src/App.tsx` for React screen changes.
3. Prefer `src/App.css` for styling changes.
4. Keep TypeScript simple and beginner-friendly.
5. Avoid extra libraries unless the user approves a clear reason.
6. Run `npm run build`.
7. Run `npm run lint` if useful or requested.
8. Summarize changed files and verification results.

## Dev Server

```bash
npm run dev -- --host 0.0.0.0
```

Use this when the user wants to preview the app.

## Build Check

```bash
npm run build
```

Run this after code changes.

## Lint Check

```bash
npm run lint
```

Run this when checking code quality. If lint reports issues, explain them in simple language.

## Review Only Mode

When the user asks for review only:

- Do not modify files.
- Report findings with file paths.
- Label findings as `확실`, `추정`, or `확인필요`.

## Commit and Push

Do not commit or push automatically.

Only commit or push after the user explicitly asks for it.

