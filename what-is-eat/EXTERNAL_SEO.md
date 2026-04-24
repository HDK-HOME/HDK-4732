# External SEO Checklist

Primary canonical domain: `https://100boy.cloud`

Canonical page:

- `https://100boy.cloud/what-is-eat/`

Secondary domain to consolidate:

- `https://hdk-product.benywade31.workers.dev`

## 1. Domain consolidation

Search signals should be consolidated to the primary domain.

- Set `100boy.cloud` as the primary public domain.
- Configure a permanent `301` redirect from:
  - `https://hdk-product.benywade31.workers.dev/what-is-eat/`
  - to `https://100boy.cloud/what-is-eat/`
- Redirect any duplicate path such as `/what-is-eat` and `/what-is-eat/index.html` to `/what-is-eat/`.
- Keep `canonical` on the page pointed at `https://100boy.cloud/what-is-eat/`.

## 2. Google Search Console

Official references:

- Search Console getting started:
  - https://developers.google.com/search/docs/monitor-debug/search-console-start
- Build and submit a sitemap:
  - https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

Recommended setup:

- Add a `Domain property` for `100boy.cloud`.
- If needed, also add a URL-prefix property for:
  - `https://100boy.cloud/`
  - `https://hdk-product.benywade31.workers.dev/`
- Verify ownership.
- Submit:
  - `https://100boy.cloud/sitemap.xml`
- Use URL Inspection to request indexing for:
  - `https://100boy.cloud/what-is-eat/`

## 3. Naver Search Advisor

Official references:

- Site registration and ownership verification:
  - https://searchadvisor.naver.com/guide/faq-start-register
- robots.txt:
  - https://searchadvisor.naver.com/guide/seo-basic-robots

Recommended setup:

- Register the host `https://100boy.cloud`.
- Verify ownership with the meta tag or HTML file method.
- Submit:
  - `https://100boy.cloud/sitemap.xml`
  - `https://100boy.cloud/robots.txt`
- Request collection for:
  - `https://100boy.cloud/what-is-eat/`

## 4. Verification tags

Insert the issued tokens in the document head when available.

- Google:
  - `<meta name="google-site-verification" content="TOKEN" />`
- Naver:
  - `<meta name="naver-site-verification" content="TOKEN" />`

Both tags must be present in the final HTML source returned from the server.

## 5. Live checks

After deploy, verify:

- `https://100boy.cloud/robots.txt` returns `200` and plain text.
- `https://100boy.cloud/sitemap.xml` returns `200`.
- `https://100boy.cloud/what-is-eat/` returns `200`.
- `https://hdk-product.benywade31.workers.dev/what-is-eat/` returns `301` to `https://100boy.cloud/what-is-eat/`.
- Final HTML source contains:
  - one `h1`
  - canonical
  - meta description
  - structured data

## 6. Current repo status

Already implemented in this repository:

- canonical on the main page
- robots.txt at root
- sitemap.xml at root
- structured data for WebSite, WebPage, WebApplication, ItemList, FAQPage
- stronger static content for search indexing
- path normalization redirects for `/what-is-eat`

Not fully completable from the repository alone:

- Search Console verification
- Naver Search Advisor verification
- live sitemap submission
- workers.dev to custom-domain redirect at infrastructure level
