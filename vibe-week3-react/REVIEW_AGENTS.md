# REVIEW_AGENTS.md

Use this file when the user asks for a review.

Review mode means: inspect and report issues first. Do not edit files unless the user explicitly asks for fixes.

## Review Output Labels

Classify findings as:

- `확실`: directly visible in the code or build output
- `추정`: likely based on the current structure, but needs more context
- `확인필요`: cannot be confirmed without running or opening the app

## Beginner Learning Review

Focus on:

- Is the code understandable for a beginner?
- Are too many concepts introduced at once?
- Are names clear?
- Are `src/App.tsx` and `src/App.css` still the main learning files?
- Is the structure too complex for Week 3 practice?

## React and TypeScript Review

Focus on:

- Component readability
- JSX structure
- Simple state usage when introduced
- Clear event handler names
- No unnecessary abstractions
- TypeScript types are simple and useful
- No advanced type patterns unless clearly needed

## Build Review

Focus on:

- `npm run build` passes
- `npm run lint` passes if available
- No broken imports
- No missing files
- No unused complexity that distracts from learning

## UX Review

Focus on:

- Text is clear and Korean-friendly
- Buttons and cards are easy to understand
- Layout works on mobile and desktop
- The page does not feel like a marketing landing page unless requested

## Safety Review

Focus on:

- No edits outside `vibe-week3-react`
- No changes to `../what-is-eat`
- No changes to `../what-is-score`
- No secrets or environment variables committed
- No deploy, commit, or push without user approval

## Full Review Mode

When asked for a full review, check:

1. Beginner learning clarity
2. React and TypeScript code structure
3. Build and lint readiness
4. UI and copy clarity
5. Safety boundaries

Then report prioritized findings with file paths and suggested next steps.

