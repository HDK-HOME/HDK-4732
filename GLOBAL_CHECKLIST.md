# GLOBAL_CHECKLIST.md

Use this checklist before deployment.

## Security
- No API keys in frontend
- Secrets stored in environment variables
- User input validated
- No dangerous innerHTML usage without sanitization
- No sensitive data logged
- Headers reviewed
- External URLs checked

## Logic
- Main user flow works
- Empty states handled
- Invalid inputs handled
- Calculations verified
- Edge cases tested
- LocalStorage/session behavior checked

## Error Handling
- API failures handled
- Network errors handled
- Loading states exist
- User-friendly error messages exist
- No blank screen on failure

## Performance
- Mobile speed acceptable
- Images optimized
- No unnecessary heavy scripts
- No repeated expensive calls
- CSS/JS not obviously bloated

## SEO
- Unique title
- Meta description
- Canonical
- H1 exists
- H2 structure logical
- robots.txt valid
- sitemap.xml valid
- OG/Twitter tags
- Structured data if useful
- 404 page returns real 404

## UX
- First screen explains value clearly
- CTA is visible
- Mobile layout works
- Buttons are understandable
- User knows what to do next
- Result/output is easy to understand

## Maintainability
- Clear file structure
- Clear names
- No unnecessary duplication
- Comments only where useful
- Config separated from logic

## Deployment
- Build passes
- Tests/checks pass if available
- Dry-run passes if available
- Important URLs manually checked
- No unrelated files committed