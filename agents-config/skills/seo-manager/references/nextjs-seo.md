# Next.js SEO Reference

## Metadata API (App Router)

### Static Metadata

```tsx
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | Brand',
  description: 'Page description under 160 chars.',
  alternates: {
    canonical: 'https://example.com/page',
    languages: {
      'en-US': 'https://example.com/en/page',
      'fr': 'https://example.com/fr/page',
    },
  },
  openGraph: {
    title: 'Page Title',
    description: 'OG description',
    url: 'https://example.com/page',
    siteName: 'Brand',
    images: [{ url: 'https://example.com/og.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@brand',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
```

### Dynamic Metadata (generateMetadata)

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://example.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
  }
}
```

### Layout-Level Defaults

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    template: '%s | Brand',
    default: 'Brand - Tagline',
  },
  description: 'Default site description',
  openGraph: {
    type: 'website',
    siteName: 'Brand',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@brand',
  },
}
```

Child pages inherit from layout and can override specific fields.

---

## File Conventions

### sitemap.ts

```tsx
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  const blogUrls = posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://example.com', lastModified: new Date(), priority: 1.0 },
    { url: 'https://example.com/about', priority: 0.5 },
    ...blogUrls,
  ]
}
```

### Large Sitemaps (generateSitemaps)

```tsx
// app/sitemap.ts
export async function generateSitemaps() {
  const totalProducts = await getProductCount()
  const sitemapCount = Math.ceil(totalProducts / 50000)
  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const start = id * 50000
  const products = await getProducts({ start, limit: 50000 })
  return products.map((p) => ({
    url: `https://example.com/products/${p.slug}`,
    lastModified: p.updatedAt,
  }))
}
```

### robots.ts

```tsx
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/private/'] },
    ],
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

### Dynamic OG Images (opengraph-image.tsx)

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Blog post cover'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    (
      <div style={{
        fontSize: 48,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}>
        {post?.title}
      </div>
    ),
    { ...size }
  )
}
```

---

## Static Generation

### generateStaticParams

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

### ISR (Incremental Static Regeneration)

```tsx
// Time-based revalidation
export const revalidate = 3600 // revalidate every hour

// On-demand revalidation (in a route handler or server action)
import { revalidateTag, revalidatePath } from 'next/cache'

revalidateTag('blog-posts')
revalidatePath('/blog')
```

### Scaling Strategy

| Pages | Strategy |
|---|---|
| < 1,000 | `generateStaticParams` + SSG at build time |
| 1K-50K | ISR with `dynamicParams: true` + build top pages |
| 50K+ | ISR + `generateSitemaps()` + on-demand revalidation |
| 1M+ | SSR with CDN caching + segmented sitemaps |

---

## Performance Optimization

### next/image

```tsx
import Image from 'next/image'
import heroImage from '@/public/hero.jpg'

// Above-the-fold LCP image (priority + eager load)
<Image
  src={heroImage}
  alt="Descriptive alt text"
  placeholder="blur"
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Below-the-fold (lazy loaded by default)
<Image src={user.avatarUrl} alt={`${user.name} avatar`} width={48} height={48} />
```

Config:
```js
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**.example.com' }],
  },
}
```

### next/font

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

- Fonts self-hosted at build time (no Google Fonts request)
- `display: 'swap'` prevents flash of invisible text
- Automatic `size-adjust` prevents CLS

### next/script

```tsx
import Script from 'next/script'

// Analytics (loads after hydration)
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" strategy="afterInteractive" />

// Chat widget (loads during idle)
<Script src="https://widget.intercom.io/widget/APP_ID" strategy="lazyOnload" />

// Heavy analytics (offloaded to web worker)
<Script src="https://example.com/analytics.js" strategy="worker" />
```

| Strategy | When | Use For |
|---|---|---|
| `beforeInteractive` | Before hydration | Polyfills |
| `afterInteractive` | After hydration | Analytics, tag managers |
| `lazyOnload` | Browser idle | Chat widgets, social |
| `worker` | Web worker | Heavy analytics |

---

## Redirects & Headers

```js
// next.config.js
module.exports = {
  async redirects() {
    return [
      { source: '/old-page', destination: '/new-page', permanent: true }, // 301
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}
```

---

## Structured Data in Next.js

```tsx
import type { WithContext, BlogPosting } from 'schema-dts'

const jsonLd: WithContext<BlogPosting> = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: { '@type': 'Person', name: post.author.name },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* page content */}
    </>
  )
}
```

Use `schema-dts` for TypeScript autocompletion and compile-time validation of Schema.org types.

---

## Common Libraries

| Library | Purpose |
|---|---|
| `next-seo` | Meta tags + JSON-LD components (Pages Router) |
| `next-sitemap` | Build-time sitemap generation |
| `schema-dts` | TypeScript types for Schema.org (by Google) |
| `next-intl` | i18n with hreflang support |
| `next-themes` | Theme management without CLS |

---

## Deployment SEO (Vercel)

- Preview deployments auto-include `X-Robots-Tag: noindex`
- ISR handled natively (cache + CDN invalidation)
- Use Edge Middleware for trailing slash redirects, geo-routing
- `vercel.json` for additional redirects/headers

```json
{
  "redirects": [
    { "source": "/old/:slug", "destination": "/new/:slug", "permanent": true }
  ]
}
```

---

## Framework Comparison

| Feature | Next.js | Astro | Remix | Nuxt |
|---|---|---|---|---|
| Default Rendering | SSR | SSG (zero JS) | SSR | SSR |
| SSG / ISR | Yes / Yes | Yes / No | Yes / No | Yes / Yes |
| Meta API | Metadata object | Frontmatter | meta() function | useSeoMeta() |
| Sitemap | sitemap.ts | @astrojs/sitemap | Manual | @nuxtjs/sitemap |
| OG Images | opengraph-image.tsx | Manual | Manual | nuxt-og-image |
| JS Shipped | React runtime | Zero by default | React runtime | Vue runtime |

Choose **Astro** for content-heavy sites (blogs, docs). Choose **Next.js** for full-stack apps. Choose **Remix** for form-heavy apps. Choose **Nuxt** for Vue teams.
