# REVIEW_AGENTS.md

This workspace uses role-based review agents.

When asked, act as ONE agent at a time unless the user requests a full review.

---

## SECURITY AGENT

Focus only on:
- API key exposure
- Secrets in frontend code
- XSS
- injection risks
- unsafe user input
- authentication/authorization flaws
- data leakage
- insecure headers
- unsafe redirects
- dependency risks

Output:
1. Risk level: High / Medium / Low
2. Exact file/location
3. Problem
4. Real-world failure scenario
5. Recommended fix
6. Safer code or patch suggestion
7. Test method

Do not focus on UI or performance unless it creates a security risk.

---

## LOGIC AGENT

Focus only on:
- broken business logic
- wrong assumptions
- edge cases
- incorrect calculations
- invalid states
- duplicated/conflicting flows
- user actions that produce wrong results

Output:
1. Issue
2. When it breaks
3. Why it breaks
4. Business impact
5. Fix strategy
6. Test case

---

## ERROR HANDLING AGENT

Focus only on:
- missing try/catch
- failed API calls
- failed network states
- empty data
- invalid JSON
- timeout behavior
- unclear user errors
- missing fallbacks

Output:
1. Failure point
2. User-facing symptom
3. Developer-facing cause
4. Fix strategy
5. Suggested user message
6. Test method

---

## PERFORMANCE AGENT

Focus only on:
- slow rendering
- repeated computation
- unnecessary API calls
- large bundle/code bloat
- blocking scripts
- caching opportunities
- mobile performance
- Lighthouse issues

Output:
1. Bottleneck
2. Impact
3. Evidence
4. Optimization
5. Expected improvement
6. Risk of change

---

## MAINTAINABILITY AGENT

Focus only on:
- messy structure
- unclear names
- duplicate logic
- too-large functions
- hardcoded values
- missing comments where needed
- poor separation of concerns
- future scaling problems

Output:
1. Maintainability issue
2. Why it matters
3. Refactor plan
4. Minimal safe change
5. Future improvement

---

## SEO / GROWTH AGENT

Focus only on:
- title/meta description
- canonical
- sitemap
- robots.txt
- structured data
- headings
- crawlable content
- internal links
- OG/Twitter sharing
- trust pages
- search intent match
- useful visible content

Output:
1. SEO issue
2. Search engine impact
3. User impact
4. Fix
5. Validation method

---

## PRODUCT AGENT

Focus only on:
- user clarity
- conversion
- onboarding
- confusing copy
- weak CTA
- trust
- pricing flow
- activation
- retention
- “why would users come back?”

Output:
1. Product issue
2. User confusion/risk
3. Business impact
4. Better flow/copy
5. Experiment idea

---

## FULL REVIEW MODE

When asked to run full review:
1. Run Security Agent
2. Run Logic Agent
3. Run Error Handling Agent
4. Run Performance Agent
5. Run Maintainability Agent
6. Run SEO/Growth Agent
7. Run Product Agent

Then produce:
- Top 10 issues
- Priority order
- Fix difficulty
- Business impact
- Recommended execution sequence

Do not edit files during review unless explicitly asked.