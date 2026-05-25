# On-Page SEO & Content Reference

## Meta Tags

### Complete Head Template

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Title: 50-60 chars, primary keyword first -->
  <title>Primary Keyword - Secondary Keyword | Brand</title>

  <!-- Description: 120-160 chars, includes CTA -->
  <meta name="description" content="Compelling description with target keyword. Clear value proposition. Call to action." />

  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="canonical" href="https://example.com/page" />

  <!-- Open Graph (1200x630 image) -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Description" />
  <meta property="og:image" content="https://example.com/og.webp" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://example.com/page" />
  <meta property="og:site_name" content="Brand" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@brand" />
</head>
```

### Title Tag Patterns

```
Primary Keyword - Secondary Keyword | Brand
How to [Action] + [Result] | Brand
[Number] Best [Keyword] for [Audience] in [Year]
[Keyword] Guide: [Benefit] | Brand
```

- 50-60 characters (580px max width)
- Front-load primary keyword
- Use pipes (`|`) or dashes (`-`) as separators
- Include current year for time-sensitive content
- Every title must be unique across the site
- Power words: Ultimate, Complete, Proven, Essential, Free, Secret, [Number]

### Meta Description

- 120-160 characters (120 safe for mobile)
- Include target keyword (Google bolds matching terms)
- Use active voice, address user directly
- End with call-to-action (Learn, Discover, Get started)
- Google rewrites ~60-70% of descriptions; write them anyway

### Robots Meta Directives

```html
<meta name="robots" content="index, follow" />          <!-- Default -->
<meta name="robots" content="noindex, follow" />         <!-- Don't index, follow links -->
<meta name="robots" content="noindex, nofollow" />       <!-- Don't index or follow -->
<meta name="robots" content="max-snippet:160" />         <!-- Limit snippet length -->
<meta name="robots" content="max-image-preview:large" /> <!-- Allow large image previews -->
```

---

## Content Optimization

### Heading Hierarchy

```
H1: Main Topic (one per page, include primary keyword)
  H2: Major Section (include secondary keywords)
    H3: Subsection
      H4-H6: Rarely needed
```

- Never skip levels (H1→H3 without H2)
- One H1 per page
- Use descriptive headings, not "Overview" or "Details"

### Keyword Placement (Priority Order)

1. **Title tag** - primary keyword near beginning
2. **H1** - primary keyword
3. **URL slug** - primary keyword, hyphens
4. **First 100-150 words** - natural inclusion
5. **H2/H3 headings** - secondary/cluster keywords
6. **Body content** - natural 1-2% density (loose guideline)
7. **Image alt text** - when contextually appropriate
8. **Meta description** - for CTR (not ranking factor)

### Content Length Benchmarks

| Type | Words |
|---|---|
| How-to guides | 1,500-2,500 |
| Listicles | 1,200-2,000 |
| Reviews/comparisons | 1,800-2,500 |
| Pillar/ultimate guides | 3,000-5,000+ |
| Supporting articles | 1,200-1,800 |

Match top-ranking competitor length. Be 15-20% more comprehensive.

### Search Intent Types

| Intent | Signals | Page Type |
|---|---|---|
| **Informational** | "what is," "how to," "guide" | Blog, tutorial |
| **Navigational** | Brand/product names | Homepage, product page |
| **Transactional** | "buy," "discount," "order" | Product, checkout |
| **Commercial** | "best," "vs," "review" | Comparison, review |

Always analyze the actual SERP before creating content. Match the format of top-ranking results.

---

## E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

Trust is the most important component. Untrustworthy pages have low E-E-A-T regardless of other scores.

### Implementation Checklist

- [ ] Author bio pages with credentials and social links
- [ ] `Person` schema with `sameAs` to LinkedIn, etc.
- [ ] Comprehensive About page with team qualifications
- [ ] Cite reputable primary sources within content
- [ ] Publish original research, case studies, data
- [ ] HTTPS (mandatory)
- [ ] Clear contact information and physical address
- [ ] Editorial policy / fact-checking process linked
- [ ] Visible "Last updated" dates on content
- [ ] `dateModified` in schema markup

### YMYL Topics (Extra E-E-A-T Scrutiny)

Health, finance, legal, safety content. Requires formal credentials, not just personal experience.

---

## Image SEO

### Alt Text

```html
GOOD: alt="golden retriever puppy playing fetch in a park"
BAD:  alt="dog" or alt="image of golden retriever buy golden retriever"
DECORATIVE: alt=""
```

- Under 125 characters, descriptive
- Include keyword naturally when appropriate
- Never start with "image of" or "picture of"

### File Naming

```
GOOD: sunset-over-lake-tahoe.jpg
BAD:  IMG_2847.jpg or sunset_over_lake.jpg
```

### Modern Formats

| Format | Compression vs JPEG | Use For |
|---|---|---|
| **WebP** | 25-30% smaller | Default modern format |
| **AVIF** | Up to 50% smaller | Maximum compression |
| **SVG** | Vector (tiny) | Icons, logos |

### Responsive Images

```html
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Description" width="1200" height="630" />
</picture>

<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  alt="Description"
/>
```

Never lazy-load the LCP (above-the-fold hero) image.

---

## Featured Snippets

### Types and Optimization

| Type | Triggers | Optimal Format |
|---|---|---|
| **Paragraph** | "What is," definitions | 40-60 word answer after H2 |
| **Ordered List** | "How to," processes | 5-8 numbered steps |
| **Unordered List** | "Best," "Types of" | 5-8 bullet points |
| **Table** | Comparisons, specs | HTML `<table>` with 3-5 rows |

### Inverted Pyramid Method

Put the direct answer in the first paragraph after the heading, then expand with details:

```markdown
## What Is On-Page SEO?

On-page SEO is the practice of optimizing individual web pages
to rank higher in search engines. It involves optimizing content,
HTML source code, and page structure for specific search queries.

### Why On-Page SEO Matters
[expanded detail follows...]
```

Target keywords where you already rank positions 2-5.

---

## Content Freshness

### Refresh Schedule

| Tier | Description | Frequency |
|---|---|---|
| Tier 1 | High-traffic, high-conversion | Every 60-90 days |
| Tier 2 | Mid-traffic supporting content | Every 3-6 months |
| Tier 3 | Evergreen guides | Every 6-12 months |

### Content Decay Signals

- Declining organic traffic (month-over-month)
- Dropping keyword rankings
- Outdated statistics, screenshots, or examples
- Competitors publishing newer content

### Meaningful Updates (What Counts)

- Adding new sections with current data
- Rewriting outdated paragraphs
- Expanding topic coverage
- Refreshing internal/external links

Does NOT count: changing pub date without content changes, typo fixes, rearranging sentences.

---

## Duplicate Content

### Common Causes

- URL parameters (`?sort=`, `?utm_source=`)
- www vs non-www, HTTP vs HTTPS
- Trailing slash inconsistency
- CMS-generated duplicates (category, tag, date archives)

### Solutions

| Scenario | Solution |
|---|---|
| Permanently removing a page | 301 redirect |
| URL variations that need to remain accessible | Canonical tag |
| HTTP→HTTPS or www consolidation | 301 redirect |
| Tracking parameters (UTM) | Canonical tag |
| Syndicated content | Cross-domain canonical |

Self-referencing canonicals on every page is best practice.
