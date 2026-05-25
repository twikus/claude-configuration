# Technical SEO Reference

## Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | < 200ms | 200ms - 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

### LCP Optimization

- Preload the LCP image with `fetchpriority="high"`
- Use `<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />`
- Serve WebP/AVIF with `<picture>` fallbacks
- Use responsive `srcset` and `sizes` attributes
- Preconnect to critical origins: `<link rel="preconnect" href="https://cdn.example.com" />`
- Minimize server response time (TTFB < 800ms)
- Avoid render-blocking CSS/JS

### INP Optimization

- Break long tasks (>50ms) using `setTimeout(resolve, 0)` or `scheduler.yield()`
- Defer third-party scripts (analytics, chat widgets)
- Use Web Workers for heavy computation
- Debounce expensive event handlers (300ms for search inputs)
- Use `requestIdleCallback()` for non-critical work
- Batch DOM reads and writes to avoid layout thrashing

### CLS Optimization

- Always set `width` and `height` on `<img>` and `<video>` elements
- Use `font-display: swap` with `size-adjust` for web fonts
- Reserve space for dynamic content (ads, embeds) with `min-height`
- Use `content-visibility: auto` for off-screen content
- Avoid inserting content above existing content

---

## Crawlability & Indexing

### robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /*?sort=
Disallow: /*?filter=

Sitemap: https://example.com/sitemap.xml
```

Rules:
- Place at domain root: `https://example.com/robots.txt`
- `Allow` takes precedence over `Disallow` for same-length paths
- Block URL parameters that create duplicate content
- Never block CSS/JS files (crawlers need them for rendering)
- Always reference the sitemap

### XML Sitemaps

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>2026-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://example.com/images/photo.jpg</image:loc>
      <image:caption>Descriptive caption</image:caption>
    </image:image>
  </url>
</urlset>
```

- Max 50,000 URLs or 50MB per sitemap file
- Use sitemap index for larger sites
- Only include canonical, indexable URLs (200 status)
- Submit to Google Search Console
- `<lastmod>` should reflect actual content changes

### Canonical Tags

```html
<link rel="canonical" href="https://www.example.com/page" />
```

- Every page should have a self-referencing canonical
- Use absolute URLs, not relative
- Canonical URL must return 200 status
- Do not canonical to a noindexed page
- Do not chain canonicals (A→B→C)
- Canonical is a hint, not a directive

### hreflang (International SEO)

```html
<link rel="alternate" hreflang="en-us" href="https://example.com/page" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/page" />
```

- Use ISO 639-1 language codes + ISO 3166-1 alpha-2 country codes
- Reciprocity is mandatory: every page must link to ALL other versions including itself
- Always include `x-default` as fallback
- Use subfolders (`/fr/`) over subdomains for consolidated domain authority

---

## URL Structure

```
GOOD: https://example.com/blog/technical-seo-guide
BAD:  https://example.com/p?id=12345&cat=7
```

- Use hyphens (`-`) to separate words, never underscores
- Lowercase only
- Keep under 60 characters
- Use logical hierarchy: `/category/subcategory/page`
- Avoid dates in URLs unless time-dependent (news)
- Choose trailing slash or not, be consistent, 301 redirect the other

---

## HTTP Status Codes for SEO

| Code | Use |
|---|---|
| **301** | Permanent redirect; passes ~90-99% link equity |
| **302/307** | Temporary redirect; does NOT pass link equity permanently |
| **404** | Page does not exist; no replacement available |
| **410** | Permanently deleted; faster deindexing than 404 |
| **503** | Temporary downtime; Google retries later |

- Never redirect all 404s to homepage (Google treats as soft 404)
- Avoid redirect chains (A→B→C); always redirect directly
- 301 for: domain migrations, permanent URL changes, HTTP→HTTPS
- 302/307 for: A/B testing, geolocation redirects (max ~6 months)

---

## Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; upgrade-insecure-requests
```

HTTPS is a ranking factor since 2014. All sites must use HTTPS.

---

## Mobile-First Indexing

- Google indexes the mobile version of every site
- Content parity: mobile must have same content, structured data, meta tags as desktop
- Minimum 16px base font size
- Touch targets: minimum 48x48 CSS pixels with 8px spacing
- No intrusive interstitials on mobile
- Test with Google Mobile-Friendly Test

---

## Internal Linking

### Topic Cluster Architecture

```
Pillar Page:  /technical-seo              (comprehensive hub, 3000-5000+ words)
  |-- Cluster: /technical-seo/core-web-vitals
  |-- Cluster: /technical-seo/structured-data
  |-- Cluster: /technical-seo/site-speed

Each cluster links back to pillar. Pillar links to each cluster.
```

### Anchor Text

```html
GOOD: <a href="/blog/cwv-guide">optimizing Core Web Vitals</a>
BAD:  <a href="/blog/cwv-guide">click here</a>
```

- Use descriptive, keyword-relevant text (3-7 words)
- Vary anchor text across links (synonyms, natural language)
- Place links high on the page for more weight
- Keep important pages within 3 clicks of homepage
- Fix orphan pages: every page needs at least one internal link pointing to it
- All internal links should be dofollow (default)
