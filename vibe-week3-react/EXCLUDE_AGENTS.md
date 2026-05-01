# EXCLUDE_AGENTS.md

These areas are excluded from normal work on `vibe-week3-react`.

## Do Not Modify

Do not modify sibling projects:

- `../what-is-eat`
- `../what-is-score`

Do not modify root workspace harness files:

- `../AGENTS.md`
- `../README.md`
- `../REVIEW_AGENTS.md`
- `../EXECUTE.md`
- `../GLOBAL_CHECKLIST.md`
- `../PROJECT_CONTEXT_TEMPLATE.md`

Do not modify deployment or hosting settings outside this project.

## Secrets and Environment Files

Do not create, edit, print, or commit secrets.

Avoid touching:

- `.env`
- `.env.*`
- `.dev.vars`
- Cloudflare secret settings
- API keys
- tokens

## Git and Deployment

Do not run these without explicit user approval:

- `git commit`
- `git push`
- deploy commands
- Cloudflare deploy commands
- GitHub Actions changes

## Exception Rule

If a requested task appears to require editing an excluded file, stop first and explain:

- why the file may need to change
- what risk it creates
- the exact file path
- the minimal proposed change

Wait for user approval before editing excluded files.

