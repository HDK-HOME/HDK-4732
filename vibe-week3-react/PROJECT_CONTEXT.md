# PROJECT_CONTEXT.md

## Project Name

vibe-week3-react

## One-line Description

A beginner-friendly Vite + React + TypeScript practice project for Vibe Coding Week 3.

## Target User

- Beginner React learner
- Solo entrepreneur learning product building
- User practicing inside GitHub Codespaces

## Core Learning Problem

The user needs a simple place to practice React with TypeScript without mixing it with existing projects.

This project should make it easy to see how changing `src/App.tsx` and `src/App.css` changes the screen.

## Why This Exists

The HDK-4732 repo already contains other project folders. This folder is a separate React practice space so the user can learn safely without touching existing working apps.

Firebase Studio may be useful later, but this practice project runs in Codespaces with standard Vite commands so the user can learn the basic local workflow first.

## Tech Stack

- Frontend: React
- Build tool: Vite
- Language: TypeScript
- Styling: CSS
- Package manager: npm

## TypeScript Direction

TypeScript should stay beginner-friendly.

- Use simple types when they help explain data shape.
- Avoid advanced generics and type gymnastics.
- Do not add complex architecture just to satisfy types.
- Prefer readable React code first.

## Main Files

- `src/App.tsx`: main practice screen and React component
- `src/App.css`: main practice styles
- `src/main.tsx`: React app entry point
- `src/index.css`: global CSS
- `index.html`: Vite HTML entry
- `package.json`: scripts and dependencies

## First Milestone

Create a simple React page with:

- title
- description
- button
- card layout
- basic CSS styling

## Later Milestones

- Add `useState`
- Add input fields
- Add button click interactions
- Add simple list rendering
- Add simple prop types when components are separated
- Split one small component out only when it helps learning

## Do Not Break

- The app must remain runnable with `npm run dev -- --host 0.0.0.0`.
- The app must build with `npm run build`.
- The project must stay inside `vibe-week3-react`.
- Sibling projects must not be modified.

## Current Priority

Keep the project simple, clear, and useful for React Week 3 TypeScript practice.

