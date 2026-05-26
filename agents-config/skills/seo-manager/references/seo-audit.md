# SEO Audit Checklist

## Pre-Launch / Complete Audit

### Technical Foundation

- [ ] HTTPS with valid SSL certificate
- [ ] HSTS header configured
- [ ] Security headers set (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- [ ] robots.txt properly configured (not blocking CSS/JS)
- [ ] XML sitemap created and submitted to Google Search Console
- [ ] Sitemap referenced in robots.txt
- [ ] No `noindex` on pages that should be indexed
- [ ] Custom 404 page returning proper 404 status code
- [ ] No redirect chains (A→B→C); all redirects are direct
- [ ] www/non-www consolidated via 301 redirect
- [ ] Trailing slash behavior consistent site-wide

### Crawlability & Indexing

- [ ] All important pages reachable within 3 clicks from homepage
- [ ] No orphan pages (every page has at least one internal link)
- [ ] Internal links use semantic `<a href>` tags (not onClick handlers)
- [ ] No broken internal links (crawl with Screaming Frog or similar)
- [ ] Canonical tags on every page (self-referencing)
- [ ] No conflicting canonical and noindex signals
- [ ] URL parameters handled (canonical to clean URL)
- [ ] Pagination implemented properly (no rel=prev/next needed post-2019; use canonical + internal linking)

### Performance (Core Web Vitals)

- [ ] LCP < 2.5s (preload hero image, optimize server response)
- [ ] INP < 200ms (break long tasks, defer third-party scripts)
- [ ] CLS < 0.1 (set image dimensions, font display swap)
- [ ] LCP image uses `fetchpriority="high"` and is not lazy-loaded
- [ ] All below-fold images use lazy loading
- [ ] All images have explicit `width` and `height` attributes
- [ ] WebP/AVIF served with fallbacks
- [ ] Fonts self-hosted or preloaded with `font-display: swap`
- [ ] No render-blocking CSS/JS in critical path
- [ ] Third-party scripts deferred or loaded lazily

### On-Page Elements

- [ ] Every page has a unique title tag (50-60 chars)
- [ ] Every page has a unique meta description (120-160 chars)
- [ ] One H1 per page containing primary keyword
- [ ] Heading hierarchy is logical (H1→H2→H3, no skipping)
- [ ] All images have descriptive alt text
- [ ] No images using "image of" or "picture of" in alt text
- [ ] Decorative images use empty alt (`alt=""`)
- [ ] Image file names are descriptive with hyphens

### Structured Data

- [ ] Organization schema on homepage
- [ ] BreadcrumbList on all pages except homepage
- [ ] Article/BlogPosting on blog posts with author, dates
- [ ] Product + Offer on product pages
- [ ] FAQPage on FAQ sections
- [ ] All schema validated with Google Rich Results Test
- [ ] No spammy or misleading structured data

### Mobile

- [ ] Mobile-friendly test passing
- [ ] Viewport meta tag set on every page
- [ ] Content parity between mobile and desktop
- [ ] Touch targets minimum 48x48px
- [ ] Base font size minimum 16px
- [ ] No intrusive interstitials on mobile
- [ ] No horizontal scrolling

### Social

- [ ] Open Graph tags on every page (title, description, image 1200x630, url)
- [ ] Twitter Card tags (`twitter:card` at minimum)
- [ ] OG images display correctly (test with Facebook Sharing Debugger)

### International (if applicable)

- [ ] hreflang tags on all language/region versions
- [ ] Reciprocal hreflang (every page links to ALL versions including itself)
- [ ] `x-default` hreflang set
- [ ] hreflang URLs match canonical URLs exactly
- [ ] Language codes follow ISO 639-1, country codes follow ISO 3166-1 alpha-2

---

## Common SEO Mistakes

### Critical (Fix Immediately)

1. **Missing or duplicate title tags** -- every page needs a unique title
2. **Noindex on important pages** -- accidentally blocking pages from indexing
3. **Broken canonical tags** -- canonicalizing to non-existent or noindexed URLs
4. **Soft 404s** -- returning 200 status with "page not found" content
5. **Mixed content** -- loading HTTP resources on HTTPS pages
6. **Blocking CSS/JS in robots.txt** -- crawlers need these for rendering
7. **No mobile viewport** -- Google can't properly render the page

### Serious (Fix Soon)

8. **Missing alt text on images** -- accessibility and image SEO issue
9. **Redirect chains** -- A→B→C loses link equity and adds latency
10. **Duplicate content without canonical** -- dilutes ranking signals
11. **Thin content** -- pages with little unique value
12. **Keyword cannibalization** -- multiple pages targeting the same keyword
13. **Missing structured data** -- missing rich snippet opportunities
14. **Slow page speed** -- Core Web Vitals in "Poor" range

### Moderate (Optimize)

15. **Generic anchor text** -- "click here" instead of descriptive text
16. **Missing breadcrumbs** -- both UX and crawlability issue
17. **No internal linking strategy** -- important pages lack link equity
18. **Outdated content** -- stale information losing rankings
19. **Missing hreflang** -- international sites showing wrong version

---

## SEO Tools Reference

| Tool | Best For | Type |
|---|---|---|
| **Google Search Console** | Index coverage, search performance, Core Web Vitals | Free |
| **Google Analytics 4** | Traffic analysis, organic conversion tracking | Free |
| **PageSpeed Insights** | Core Web Vitals lab + field data | Free |
| **Lighthouse** | Performance, accessibility, SEO audit | Free |
| **Google Rich Results Test** | Schema validation | Free |
| **Google Mobile-Friendly Test** | Mobile rendering check | Free |
| **Screaming Frog** | Site crawling, technical audit | Free (500 URLs) / Paid |
| **Ahrefs** | Backlink analysis, keyword research, content gap | Paid |
| **Semrush** | Keyword research, site audit, competitor analysis | Paid |
| **Moz** | Domain authority, link analysis | Paid |
| **Surfer SEO** | Content optimization, TF-IDF analysis | Paid |
| **GTmetrix** | Performance testing with waterfall chart | Free / Paid |

### GA4 Setup for SEO

1. Connect Search Console: Admin > Product Links > Search Console Links
2. Filter organic: Reports > Acquisition > Traffic Acquisition > filter "Organic Search"
3. Set up key events: form submissions, signups, purchases
4. Landing page report: Reports > Engagement > Landing Pages

---

## AI & SEO (2025-2026)

### Google AI Overviews

- AI Overviews appear in 47%+ of US searches
- To be cited by AI: use answer-first content structure, demonstrate E-E-A-T, implement schema
- AI Overviews pull from top-ranking, authoritative, well-structured sources
- Structured data helps AI systems parse and cite your content

### AI Content Policies

- Google does not penalize AI-generated content per se
- Content must demonstrate E-E-A-T regardless of how it's created
- "Helpful Content" system targets content written primarily for SEO manipulation
- Add genuine expertise, original insights, and first-hand experience

### Optimization for AI Search

- Use clear, concise answer-first paragraphs
- Structure content with descriptive headings as questions
- Implement comprehensive schema markup
- Build topical authority through content clusters
- Cite authoritative sources
- Keep content factually accurate and well-sourced
