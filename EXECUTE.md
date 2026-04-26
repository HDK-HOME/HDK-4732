# EXECUTE.md

Use this file to operate Codex safely.

## Basic Start Command

Read the global workspace instructions first:

"Read ../AGENTS.md, ../REVIEW_AGENTS.md, and ../GLOBAL_CHECKLIST.md.
Then inspect this project.
Do not edit anything yet.
Summarize what this project does and identify the main files."

If Codex is launched from the 4732 root, use:

"Read AGENTS.md, REVIEW_AGENTS.md, and GLOBAL_CHECKLIST.md.
Then inspect the target project folder: [PROJECT_FOLDER_NAME].
Do not edit anything yet."

---

## Review Only

"Act as SECURITY AGENT.
Review [PROJECT_FOLDER_NAME].
Do not modify files.
Report issues only."

"Act as LOGIC AGENT.
Review [PROJECT_FOLDER_NAME].
Do not modify files.
Report issues only."

"Act as FULL REVIEW MODE.
Review [PROJECT_FOLDER_NAME].
Do not modify files.
Give top 10 prioritized issues."

---

## Fix Mode

After review:

"Apply only the top 3 safe fixes.
Do not rewrite the whole project.
Preserve existing behavior.
After changes, list changed files and run available checks."

---

## SEO Mode

"Act as SEO / GROWTH AGENT.
Review [PROJECT_FOLDER_NAME] using Google and Naver SEO basics.
Do not modify files yet.
Report missing items and exact fixes."

---

## Product Mode

"Act as PRODUCT AGENT.
Review the first-time user experience.
Focus on clarity, trust, activation, and conversion.
Do not modify files yet."

---

## Commit Mode

Before commit:

"Show git diff summary.
Confirm no unrelated large files are included.
Suggest a commit message."

Then:

"Commit only the intended files with message: [MESSAGE]."