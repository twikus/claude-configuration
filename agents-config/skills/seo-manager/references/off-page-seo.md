# Off-Page SEO & Link Building Reference

## Backlink Quality Signals

### What Makes a Quality Backlink

- **Domain authority/rating**: Higher DR/DA = more valuable
- **Topical relevance**: Same niche or related topic
- **Editorial placement**: Naturally placed within content body
- **Dofollow**: Passes link equity (nofollow, sponsored, ugc do not)
- **Diverse anchor text**: Mix of branded, natural, keyword-rich
- **Traffic**: The linking page receives organic traffic
- **Unique referring domain**: First link from a domain is most valuable

### Link Attribute Types

| Attribute | Equity | Use Case |
|---|---|---|
| `dofollow` (default) | Yes | Editorial links, natural mentions |
| `rel="nofollow"` | No | Untrusted content, user-generated |
| `rel="sponsored"` | No | Paid placements, ads |
| `rel="ugc"` | No | Comments, forum posts |

### Ideal Anchor Text Distribution

| Type | Ratio | Example |
|---|---|---|
| **Branded** | 30-40% | "Company Name", "Brand" |
| **Natural/Generic** | 20-30% | "click here", "this article", "learn more" |
| **Partial match** | 15-20% | "great SEO tools for beginners" |
| **Exact match** | 5-10% | "best SEO tools" |
| **URL/Naked** | 10-15% | "example.com/page" |

---

## Link Building Strategies

### Guest Posting

1. Find sites accepting guest posts: `"write for us" + [niche]`
2. Study their content style and guidelines
3. Pitch unique, relevant topics they haven't covered
4. Include 1-2 natural contextual links back to your site
5. Focus on quality sites (DR 30+, real traffic, editorial standards)

### Broken Link Building

1. Find resource pages in your niche
2. Use Ahrefs Broken Link Checker or Check My Links extension
3. Identify broken outbound links on those pages
4. Create/have content that replaces the dead resource
5. Contact the webmaster suggesting your replacement

### Skyscraper Technique

1. Find top-linked content in your niche (Ahrefs Content Explorer)
2. Create something significantly better (more comprehensive, updated, better design)
3. Contact everyone linking to the original, offering your improved version

### Digital PR

1. Create newsworthy content (original research, data studies, surveys)
2. Write press releases for genuine news
3. Pitch journalists and bloggers
4. Use platforms: HARO (now Connectively), Source of Sources, Featured, Qwoted

### Unlinked Brand Mentions

1. Find mentions: Google Alerts, Brand24, Semrush Brand Monitoring
2. Contact author requesting a link
3. Conversion rate: 10-40% (much higher than cold outreach)

---

## Toxic Backlinks

### Red Flags

- Links from PBNs (private blog networks)
- Sites created solely to manipulate rankings
- Foreign-language sites unrelated to your audience
- Identical exact-match anchor text across many links
- Sitewide links (footer, sidebar) from low-quality domains
- Links from penalized or deindexed domains

### Disavow File Format

```
# Disavow file for example.com
# Last updated: 2026-02-10

# Specific URLs
https://spammysite.com/toxic-page

# Entire domains
domain:linkfarm-example.com
domain:pbn-network.net
```

- One URL or `domain:` per line
- Submit at: https://search.google.com/search-console/disavow-links
- Only use when you have a manual action or confirmed negative SEO attack

---

## Local SEO

### Google Business Profile

- Business name matches real-world branding exactly (no keyword stuffing)
- Address verified; local phone number (not toll-free)
- Primary category = core service
- 10+ high-quality photos (exterior, interior, team, products)
- Publish Google Posts weekly
- Proactively seed Q&A section

### NAP Consistency

**NAP** = Name, Address, Phone Number. Must be identical everywhere:
- Website footer and schema markup
- Google Business Profile
- All social profiles
- All directory listings
- Use exact same format (e.g., "Street" vs "St." -- pick one)

### Reviews Management

- Request reviews immediately after positive interactions
- Direct link: `https://search.google.com/local/writereview?placeid=[PLACE_ID]`
- Respond to every review (positive and negative)
- Never buy reviews or use review gating
- Target: 4.5+ stars, 50+ reviews for competitive markets

---

## Google Search Console Key Metrics

| Metric | Where |
|---|---|
| Clicks / Impressions / CTR / Position | Performance > Search Results |
| Index Coverage | Pages (Indexing) |
| Core Web Vitals | Experience > Core Web Vitals |
| Manual Actions | Security & Manual Actions |
| Backlinks | Links |

### Actionable Insights

- **Striking distance keywords**: Position 4-20, optimize to reach page 1
- **High impression, low CTR**: Improve title tags and meta descriptions
- **Declining pages**: Content refresh needed
- **"Crawled - currently not indexed"**: Improve quality, add internal links, consolidate thin pages

---

## Google Algorithm Updates

| Update | Year | Targets |
|---|---|---|
| **Panda** | 2011 | Thin/duplicate/low-quality content |
| **Penguin** | 2012 | Unnatural backlinks, link schemes |
| **Hummingbird** | 2013 | Semantic search, query intent |
| **RankBrain** | 2015 | Machine learning for query interpretation |
| **BERT** | 2019 | NLP, contextual understanding |
| **Helpful Content** | 2022 | Content written for SEO vs humans |
| **Core Updates** | Ongoing | Broad reassessment of quality, E-E-A-T |

### Penalty Recovery

**Manual action**: Fix issues, document changes, submit reconsideration request in GSC.

**Algorithmic**: Audit content, improve E-E-A-T, consolidate thin pages, wait for next core update (3-6 months).

---

## Competitor Analysis

### Backlink Gap

1. Enter your domain + 2-4 competitors in Ahrefs Link Intersect (or Semrush Backlink Gap)
2. Filter: DR 30+, dofollow, traffic > 100
3. Analyze why they link to competitors
4. Create outreach strategy for each opportunity

### Content Gap

1. Use Ahrefs Content Gap or Semrush Keyword Gap
2. Find keywords competitors rank for in top 10 where you don't
3. Prioritize by volume x relevance
4. Create content calendar targeting gaps

Run backlink gap monthly, content gap quarterly.
