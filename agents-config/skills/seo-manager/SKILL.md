---
name: seo-manager
description: Comprehensive SEO management for web applications. Use when implementing meta tags, structured data, sitemaps, robots.txt, Open Graph, Core Web Vitals optimization, canonical URLs, hreflang, or when the user mentions SEO, search engine optimization, rich snippets, schema markup, or wants to audit/improve search rankings.
---

# SEO Manager

Implement and optimize SEO for any web application. Covers technical SEO, on-page optimization, structured data, performance, and framework-specific patterns (Next.js, Astro, Nuxt, Remix).

## Quick Decision: What Do You Need?

**Adding meta tags / OG / Twitter cards?** → See [On-Page SEO](references/on-page-seo.md) for the complete head template

**Adding structured data (JSON-LD)?** → See [Structured Data](references/structured-data.md) for copy-paste schemas (Article, Product, FAQ, HowTo, BreadcrumbList, Organization, LocalBusiness)

**Working with Next.js?** → See [Next.js SEO](references/nextjs-seo.md) for Metadata API, sitemap.ts, robots.ts, opengraph-image.tsx, generateStaticParams, ISR

**Fixing Core Web Vitals / performance?** → See [Technical SEO](references/technical-seo.md) for LCP/INP/CLS optimization

**Running an SEO audit?** → See [SEO Audit](references/seo-audit.md) for the complete checklist and common mistakes

**Link building / off-page / local SEO?** → See [Off-Page SEO](references/off-page-seo.md)

---

## Essential SEO Checklist (Every Page)

```html
<!-- 1. Title: unique, 50-60 chars, primary keyword first -->
<title>Primary Keyword - Secondary | Brand</title>

<!-- 2. Meta description: unique, 120-160 chars, CTA -->
<meta name="description" content="Compelling description. Call to action." />

<!-- 3. Canonical -->
<link rel="canonical" href="https://example.com/current-page" />

<!-- 4. Open Graph -->
<meta property="og:title" content="Title" />
<meta property="og:description" content="Description" />
<meta property="og:image" content="https://example.com/og.png" /> <!-- 1200x630 -->
<meta property="og:url" content="https://example.com/page" />

<!-- 5. Twitter -->
<meta name="twitter:card" content="summary_large_image" />

<!-- 6. Structured Data (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Description"
}
</script>
```

## Core Web Vitals Targets

| Metric | Target | Key Fix |
|---|---|---|
| **LCP** | < 2.5s | Preload hero image with `fetchpriority="high"` |
| **INP** | < 200ms | Break long JS tasks, defer third-party scripts |
| **CLS** | < 0.1 | Set `width`/`height` on images, `font-display: swap` |

## Next.js Quick Start

```tsx
// app/layout.tsx - Site-wide defaults
export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: { template: '%s | Brand', default: 'Brand - Tagline' },
  description: 'Default description',
  openGraph: { type: 'website', siteName: 'Brand' },
  twitter: { card: 'summary_large_image', site: '@brand' },
}

// app/blog/[slug]/page.tsx - Dynamic pages
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://example.com/blog/${slug}` },
    openGraph: { images: [post.coverImage] },
  }
}
```

## Schema Types by Page

| Page | Schema | Rich Result |
|---|---|---|
| Homepage | `Organization` | Logo, social links |
| Blog posts | `BlogPosting` + `BreadcrumbList` | Author, date |
| Products | `Product` + `Offer` | Price, rating, stock |
| FAQ sections | `FAQPage` | Expandable Q&A |
| How-to guides | `HowTo` | Step-by-step |
| Local business | `LocalBusiness` | Address, hours, reviews |

## Reference Guides

- **[references/technical-seo.md](references/technical-seo.md)** -- Core Web Vitals, crawlability, robots.txt, sitemaps, canonical tags, hreflang, URL structure, security headers, mobile-first indexing, internal linking
- **[references/on-page-seo.md](references/on-page-seo.md)** -- Meta tags (complete head template), title/description patterns, heading hierarchy, keyword placement, content optimization, E-E-A-T, image SEO, featured snippets, content freshness, duplicate content
- **[references/structured-data.md](references/structured-data.md)** -- JSON-LD templates for Organization, Article, Product, FAQ, HowTo, BreadcrumbList, LocalBusiness, SoftwareApplication, VideoObject
- **[references/nextjs-seo.md](references/nextjs-seo.md)** -- Metadata API, generateMetadata, sitemap.ts, robots.ts, opengraph-image.tsx, ISR, next/image, next/font, next/script, redirects/headers, schema-dts, next-seo, framework comparison (Astro/Remix/Nuxt)
- **[references/off-page-seo.md](references/off-page-seo.md)** -- Backlink quality, link building strategies, toxic links, local SEO, Google Business Profile, Search Console, GA4, competitor analysis, algorithm updates
- **[references/seo-audit.md](references/seo-audit.md)** -- Complete pre-launch checklist, common SEO mistakes (critical/serious/moderate), tools reference, AI & SEO
