# Structured Data (Schema.org) Reference

All structured data should use **JSON-LD** format in `<script type="application/ld+json">` tags.

Validate with: [Google Rich Results Test](https://search.google.com/test/rich-results)

## Organization (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "What the company does",
  "sameAs": [
    "https://twitter.com/company",
    "https://linkedin.com/company/company",
    "https://github.com/company"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-555-5555",
    "contactType": "customer service"
  }
}
```

## Article / BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title (max 110 chars)",
  "description": "Article summary",
  "image": "https://example.com/article-image.jpg",
  "datePublished": "2026-01-15T08:00:00+00:00",
  "dateModified": "2026-02-01T10:00:00+00:00",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/authors/author-name",
    "sameAs": ["https://linkedin.com/in/author"]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Site Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/article-slug"
  }
}
```

## Product

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": "https://example.com/product.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/products/product-slug"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

## FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The answer to the question."
      }
    },
    {
      "@type": "Question",
      "name": "Second question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Second answer."
      }
    }
  ]
}
```

## HowTo

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Do Something",
  "description": "Step-by-step guide",
  "totalTime": "PT30M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1 Title",
      "text": "Step 1 description",
      "image": "https://example.com/step1.jpg"
    },
    {
      "@type": "HowToStep",
      "name": "Step 2 Title",
      "text": "Step 2 description"
    }
  ]
}
```

## BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://example.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title"
    }
  ]
}
```

## LocalBusiness

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "description": "What the business does",
  "image": "https://example.com/storefront.jpg",
  "telephone": "+1-555-555-5555",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "ST",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "priceRange": "$$"
}
```

## SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "App Name",
  "description": "What the app does",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "89"
  }
}
```

## VideoObject

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Video Title",
  "description": "Video description",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "uploadDate": "2026-01-15",
  "duration": "PT5M30S",
  "contentUrl": "https://example.com/video.mp4",
  "embedUrl": "https://www.youtube.com/embed/VIDEO_ID"
}
```

## Rich Results Trigger Map

| Schema Type | Rich Result |
|---|---|
| `Product` + `Offer` + `Review` | Star ratings, price, availability |
| `FAQPage` | Expandable Q&A in SERPs |
| `HowTo` | Step-by-step with images |
| `Article` | Publication date, author |
| `Recipe` | Cooking time, calories, rating |
| `Event` | Date, location, tickets |
| `LocalBusiness` | Address, hours, reviews |
| `BreadcrumbList` | Navigation path in SERPs |
| `VideoObject` | Thumbnail, duration |
| `SoftwareApplication` | Rating, price |
