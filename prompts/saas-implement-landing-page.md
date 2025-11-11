# Landing Page Implementation

You are a senior frontend developer and design systems specialist with 10+ years experience building production-ready landing pages using modern UI components and design patterns.

Implement a complete, production-ready landing page from a markdown specification file using high-quality Shadcn UI components. Execute all steps systematically to create a beautiful, accessible, performant landing page.

This is a comprehensive implementation workflow that transforms a landing page specification (with sections, content, and design requirements) into a fully functional, modern landing page using Shadcn UI ecosystem components.

## Workflow Instructions - IMPORTANT

**CRITICAL**: Follow these workflow rules throughout the entire implementation:

**Specification Analysis:**

- Read the provided spec file completely before starting any implementation
- Understand all sections required (Hero, Features, Pricing, FAQ, CTA, Footer, etc.)
- Identify design preferences, brand colors, and content requirements
- Note target audience and positioning to inform design decisions

**Project Adaptation:**

- Ask user for project location if not provided
- Read existing project structure and conventions
- Respect existing path aliases, component organization, and styling patterns
- Adapt implementation to match existing codebase architecture
- Never overwrite existing components without understanding their purpose

**Component Research:**

- Use MCP Context7 to research Shadcn UI and related component libraries
- Explore multiple component sources before making selections
- Prioritize production-ready, accessible, modern components
- Document all component choices with sources and rationale

**Quality Standards:**

- WCAG 2.1 AA accessibility compliance is non-negotiable
- Mobile-first responsive design for all sections
- Optimized images using Next.js Image component
- Performance-first approach (Lighthouse score 90+)
- Clean, maintainable code following project conventions

**Documentation Requirements:**

- Create `landing-page-components.md` documenting all component sources
- Create `landing-page-checklist.md` to track implementation progress
- Update project CLAUDE.md with landing page implementation details
- Document any new patterns or conventions introduced

These steps are NOT optional - they ensure production-quality landing pages from day one.

## Step 0 - Read Specification File

**MANDATORY FIRST STEP**: Read the landing page specification file provided by the user.

Ask: "Please provide the path to your landing page specification file."

Read the spec file completely and extract:

- **Sections**: What sections need to be built (Hero, Features, Pricing, FAQ, etc.)
- **Content**: Headline, descriptions, CTAs, images, testimonials
- **Design**: Color preferences, style guidelines, brand identity
- **Features**: Interactive elements, forms, animations
- **Audience**: Target users to inform design decisions

**CRITICAL**: If spec file is missing or incomplete, STOP and ask user for complete specification.

Documentation: Create a mental map of all requirements before proceeding to implementation.

## Step 1 - Analyze Current Project

Understand the existing project structure and conventions.

Ask user: "Where is your project located?"

Use Glob to explore project structure:

`**/*.tsx` to find existing components
`**/tailwind.config.*` to understand styling setup
`**/tsconfig.json` to check path aliases

Read key configuration files:

- `tsconfig.json` - Understand path aliases (@/\* mapping)
- `tailwind.config.ts` - Check existing theme configuration
- `components.json` - Verify shadcn/ui setup
- `app/globals.css` - Review existing CSS variables and theme

**Document findings:**

- Framework version (Next.js 14/15, App Router/Pages Router)
- Component organization (features/, components/, src/ structure)
- Existing UI components and patterns
- Theme configuration and color palette
- Path aliases and import conventions

**IMPORTANT**: Respect existing conventions throughout implementation. Adapt to the project, don't force a new structure.

## Step 2 - Research Component Sources

Use MCP Context7 to understand available component libraries and identify the best components for each section.

Research Shadcn UI ecosystem:

```bash
# Use MCP Context7 to get Shadcn UI documentation
mcp__context7__resolve-library-id with "shadcn-ui"
mcp__context7__get-library-docs for component patterns
```

**Component Source Hierarchy:**

1. **Official Shadcn UI** (https://ui.shadcn.com) - Base components, highest quality
2. **Shadcn UI Blocks** (https://shadcn-ui-blocks.akashmoradiya.com) - Pre-built sections
3. **Coss.com** (https://coss.com/origin) - Modern, production-ready components
4. **Aceternity UI** (https://ui.aceternity.com) - Advanced effects (use selectively)

**Selection Criteria:**

- Modern, contemporary design (not dated Bootstrap-style)
- Production-ready and well-tested
- Accessible (WCAG 2.1 AA compliant)
- Responsive (mobile-first)
- Customizable to match brand
- Performant (minimal dependencies)

**Create documentation file:**

Create `landing-page-components.md` with this structure:

```markdown
# Landing Page Components

## Hero Section

- **Source**: Shadcn UI Blocks - hero-03
- **URL**: https://shadcn-ui-blocks.akashmoradiya.com/r/hero-03.json
- **Install**: `npx shadcn add <url>`
- **Why**: Modern split layout, perfect for SaaS landing pages
- **Customizations**: Update colors, add brand imagery

## Navigation

- **Source**: Coss.com - comp-577
- **URL**: https://coss.com/origin/r/comp-577.json
- **Install**: `pnpm dlx shadcn@latest add <url>`
- **Why**: Clean design, mobile-friendly, easy to customize
- **Customizations**: Add logo, update links, integrate theme toggle

[Continue for each section...]
```

Documentation: https://ui.shadcn.com/docs/components/accordion

## Step 3 - Create Implementation Checklist

Create `landing-page-checklist.md` to track progress systematically.

**Checklist structure:**

```markdown
# Landing Page Implementation Checklist

**Project**: [Project Name]
**Spec File**: [Path to spec]
**Started**: [Date]
**Status**: In Progress

## Phase 1: Setup

- [ ] Spec file read and analyzed
- [ ] Project structure understood
- [ ] Component sources researched
- [ ] Theme colors configured
- [ ] Base components installed

## Phase 2: Sections

- [ ] Navigation/Header
- [ ] Hero section
- [ ] Features section
- [ ] Social proof/Testimonials
- [ ] Pricing section
- [ ] FAQ section
- [ ] CTA sections
- [ ] Footer section

## Phase 3: Quality

- [ ] Mobile responsiveness verified
- [ ] Accessibility audit completed
- [ ] Performance optimized
- [ ] Images optimized
- [ ] Cross-browser tested

## Phase 4: Polish

- [ ] Content proofread
- [ ] Links verified
- [ ] Forms tested
- [ ] Animations polished
- [ ] Final review complete

**Completion Date**: [Date when done]
```

Update this checklist after completing each step.

## Step 4 - Configure Theme and Design System

Establish the visual foundation based on spec requirements.

Read existing Tailwind configuration:

`tailwind.config.ts` or `tailwind.config.js`

Update theme colors if needed:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Add custom brand colors from spec
        brand: {
          primary: "#...",
          secondary: "#...",
        },
      },
    },
  },
};
```

**Configure Shadcn UI theme:**

Update CSS variables in `app/globals.css` (or `src/app/globals.css`):

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: /* brand primary color */;
    --secondary: /* brand secondary color */;
    /* Update other CSS variables based on brand colors */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* Dark mode colors if required */
  }
}
```

**IMPORTANT**: Use the spec's color preferences to inform theme choices. Ensure sufficient contrast for accessibility (4.5:1 for text).

Documentation: https://ui.shadcn.com/docs/theming

## Step 5 - Install Base Components

Install foundational Shadcn UI components needed across sections.

**Essential base components:**

```bash
npx shadcn@latest add button card input label badge
```

**Typography and layout:**

```bash
npx shadcn@latest add separator
```

**Navigation components:**

```bash
npx shadcn@latest add navigation-menu dropdown-menu sheet
```

**If forms are in spec:**

```bash
npx shadcn@latest add form select textarea checkbox radio-group
```

**Feedback components:**

```bash
npx shadcn@latest add accordion dialog toast
```

Verify installation by checking `src/components/ui/` or `components/ui/` directory.

**IMPORTANT**: Install only components you'll actually use. Don't bloat the project with unused dependencies.

Update checklist: Mark "Base components installed" as complete.

## Step 6 - Build Navigation Section

Implement the header/navbar with logo, links, and mobile menu.

**Analyze spec requirements:**

- Logo and branding
- Navigation link structure
- CTA button in header
- Mobile menu behavior
- Sticky/fixed positioning

**Install navbar component:**

Search for modern navbar from Coss.com or Shadcn UI Blocks:

```bash
# Example: Coss.com navbar
pnpm dlx shadcn@latest add https://coss.com/origin/r/comp-577.json
```

**Create navbar file:**

Create `src/features/landing/navbar.tsx` (or match existing structure):

```typescript
"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Brand</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>

        {/* CTA */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button>Get Started</Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            {/* Mobile nav items */}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
```

**Customization:**

- Replace "Brand" with actual logo from spec
- Update navigation links based on sections in spec
- Customize CTA button text and action
- Add smooth scroll for anchor links
- Ensure mobile menu is fully functional

**Integration:**

Add navbar to `app/layout.tsx` or page component as appropriate.

Update checklist: Mark "Navigation/Header" as complete.

Documentation: https://ui.shadcn.com/docs/components/navigation-menu

## Step 7 - Build Hero Section

Implement the primary landing section that makes the first impression.

**Analyze spec requirements:**

- Headline and subheadline text
- Primary and secondary CTAs
- Hero image, illustration, or background
- Layout pattern (centered, split, with media)

**Install hero component:**

```bash
# Example: Shadcn UI Blocks hero section
npx shadcn add https://shadcn-ui-blocks.akashmoradiya.com/r/hero-03.json
```

**Create hero file:**

Create `src/features/landing/hero.tsx`:

```typescript
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Hero() {
  return (
    <section className="container grid lg:grid-cols-2 gap-8 py-24 lg:py-32">
      <div className="flex flex-col justify-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          {/* Headline from spec */}
          Build Your SaaS in Days, Not Months
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
          {/* Subheadline from spec */}
          Complete Next.js starter with authentication, database, and payment integration.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button size="lg">
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Image
          src="/hero-image.png"
          alt="Hero illustration"
          width={600}
          height={400}
          className="rounded-lg"
          priority
        />
      </div>
    </section>
  )
}
```

**Customization:**

- Replace placeholder text with spec content
- Update CTA buttons with spec actions
- Add hero image/illustration if specified
- Apply brand colors from theme
- Optimize for mobile (stack elements on small screens)

**Modern enhancements (optional):**

- Subtle fade-in animation on load
- Gradient backgrounds or mesh patterns
- Interactive elements (not overwhelming)

Update checklist: Mark "Hero section" as complete.

## Step 8 - Build Features Section

Implement product/service highlights showcasing key features.

**Analyze spec requirements:**

- Number of features (3, 6, 9, etc.)
- Feature descriptions and icons
- Layout pattern (grid, cards, bento)
- Visual elements needed

**Install feature component:**

```bash
# Example: Feature grid from Shadcn UI Blocks
npx shadcn add https://shadcn-ui-blocks.akashmoradiya.com/r/features-01.json
```

**Create features file:**

Create `src/features/landing/features.tsx`:

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, Rocket } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Zap,
      title: "Fast Setup",
      description: "Get your SaaS running in minutes with pre-configured authentication, database, and payment integration."
    },
    {
      icon: Shield,
      title: "Secure by Default",
      description: "Built-in security best practices with Better Auth, CSRF protection, and encrypted sessions."
    },
    {
      icon: Rocket,
      title: "Production Ready",
      description: "Deploy to Vercel with one click. Optimized for performance and scalability from day one."
    },
  ]

  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Everything You Need
        </h2>
        <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400">
          All the features you need to build and launch your SaaS
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="h-10 w-10 mb-4 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
```

**Customization:**

- Map spec features to array
- Choose appropriate icons from lucide-react
- Adjust grid columns based on feature count
- Add hover effects on cards
- Ensure mobile-friendly (stack on mobile)

Update checklist: Mark "Features section" as complete.

Documentation: https://ui.shadcn.com/docs/components/card

## Step 9 - Build Social Proof Section (If in Spec)

Implement testimonials, logos, or statistics if specified.

**Only implement if spec includes social proof elements.**

**For testimonials:**

```bash
npx shadcn add https://shadcn-ui-blocks.akashmoradiya.com/r/testimonials-01.json
```

**For logo clouds:**

Create simple logo grid with `next/image`:

```typescript
import Image from "next/image"

export function LogoCloud() {
  const logos = [
    { name: "Company 1", src: "/logos/company1.svg" },
    { name: "Company 2", src: "/logos/company2.svg" },
    // Add more from spec
  ]

  return (
    <section className="container py-16">
      <p className="text-center text-sm text-gray-500 mb-8">
        Trusted by leading companies
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
        {logos.map((logo) => (
          <Image
            key={logo.name}
            src={logo.src}
            alt={logo.name}
            width={120}
            height={40}
            className="grayscale"
          />
        ))}
      </div>
    </section>
  )
}
```

**For statistics:**

```typescript
export function Stats() {
  const stats = [
    { value: "10k+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ]

  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-4xl font-bold">{stat.value}</div>
            <div className="text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

Update checklist: Mark "Social proof/Testimonials" as complete.

## Step 10 - Build Pricing Section (If in Spec)

Implement pricing tiers if specified in the spec.

**Only implement if spec includes pricing information.**

**Install pricing component:**

```bash
npx shadcn add https://shadcn-ui-blocks.akashmoradiya.com/r/pricing-01.json
```

**Create pricing file:**

Create `src/features/landing/pricing.tsx`:

```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "$29",
      description: "Perfect for side projects",
      features: [
        "Up to 5 projects",
        "Basic analytics",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "$99",
      description: "For growing businesses",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Custom domain",
      ],
      popular: true,
    },
  ]

  return (
    <section className="container py-24" id="pricing">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400">
          Choose the plan that fits your needs
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <Card key={tier.name} className={tier.popular ? "border-primary" : ""}>
            <CardHeader>
              {tier.popular && (
                <div className="text-xs font-semibold text-primary mb-2">POPULAR</div>
              )}
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-6">{tier.price}<span className="text-lg font-normal text-gray-500">/mo</span></div>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                Get Started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
```

**Customization:**

- Map spec pricing data to tiers array
- Highlight recommended tier with border or badge
- Add billing toggle if monthly/annual options
- Connect CTA buttons to checkout

Update checklist: Mark "Pricing section" as complete.

## Step 11 - Build FAQ Section (If in Spec)

Implement frequently asked questions using accordion component.

**Install accordion component:**

```bash
npx shadcn@latest add accordion
```

**Create FAQ file:**

Create `src/features/landing/faq.tsx`:

```typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "What is included in the starter kit?",
      answer: "The starter kit includes Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, authentication, database setup, and payment integration."
    },
    {
      question: "Can I use this for commercial projects?",
      answer: "Yes! Once you purchase, you can use it for unlimited personal and commercial projects."
    },
    // Add more FAQs from spec
  ]

  return (
    <section className="container py-24" id="faq">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
```

**Customization:**

- Add all FAQ items from spec
- Ensure accessible keyboard navigation
- Consider search/filter for many FAQs

Update checklist: Mark "FAQ section" as complete.

Documentation: https://ui.shadcn.com/docs/components/accordion

## Step 12 - Build CTA Sections

Implement call-to-action sections at strategic points.

**Create CTA component:**

Create `src/features/landing/cta.tsx`:

```typescript
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="container py-24">
      <div className="rounded-lg bg-primary px-6 py-16 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          Ready to Get Started?
        </h2>
        <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-8">
          Join thousands of developers building amazing SaaS products.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
          <Button size="lg" variant="secondary">
            Start Building Now
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            View Documentation
          </Button>
        </div>
      </div>
    </section>
  )
}
```

**Strategic placement:**

- Mid-page CTA after features
- Bottom CTA before footer
- Optional sticky CTA bar on mobile

Update checklist: Mark "CTA sections" as complete.

## Step 13 - Build Footer Section

Implement footer with navigation, links, and legal information.

**Install footer component:**

```bash
# Example: Shadcn UI Blocks footer
npx shadcn add https://shadcn-ui-blocks.akashmoradiya.com/r/footer-05.json
```

**Create footer file:**

Create `src/features/landing/footer.tsx`:

```typescript
import Link from "next/link"
import { Twitter, Github, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#pricing">Pricing</Link></li>
              <li><Link href="#faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-gray-500 hover:text-gray-900">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" className="text-gray-500 hover:text-gray-900">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-500 hover:text-gray-900">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          © 2025 Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
```

**Customization:**

- Add all footer links from spec
- Include social media links
- Update copyright information
- Add newsletter signup if required

Update checklist: Mark "Footer section" as complete.

## Step 14 - Assemble Landing Page

Integrate all sections into the main page component.

**Update or create page file:**

Edit `app/page.tsx` (or `src/app/page.tsx`):

```typescript
import { Navbar } from "@/features/landing/navbar"
import { Hero } from "@/features/landing/hero"
import { Features } from "@/features/landing/features"
import { Pricing } from "@/features/landing/pricing"
import { FAQ } from "@/features/landing/faq"
import { CTA } from "@/features/landing/cta"
import { Footer } from "@/features/landing/footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
```

**Layout considerations:**

- Consistent section padding (py-16, py-24)
- Proper spacing between sections
- Max-width containers for readability
- Alternating backgrounds for visual interest (optional)

**Add smooth scrolling:**

In `app/globals.css`:

```css
html {
  scroll-behavior: smooth;
}
```

Update checklist: Mark "Page assembly" as complete.

## Step 15 - Optimize Mobile Responsiveness

Verify all sections work perfectly on mobile devices.

**Mobile testing checklist:**

- Test at 375px width (iPhone SE)
- Verify readable text sizes (min 16px)
- Check touch targets (min 44x44px)
- Test mobile navigation menu
- Verify image scaling
- Check form inputs on mobile

**Common responsive adjustments:**

- Stack grid columns on mobile: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Adjust text sizes: `text-2xl md:text-4xl lg:text-6xl`
- Reduce padding on mobile: `py-12 md:py-16 lg:py-24`
- Hide/show elements: `hidden md:block`

**Tablet verification:**

- Test at 768px and 1024px
- Ensure smooth breakpoint transitions
- Verify grid layouts adapt properly

**Desktop optimization:**

- Test at 1440px and larger
- Ensure max-width constraints: `max-w-7xl mx-auto`
- Verify layouts don't break at large sizes

Update checklist: Mark "Mobile responsiveness verified" as complete.

## Step 16 - Accessibility Audit

Ensure WCAG 2.1 AA compliance for all users.

**Keyboard navigation:**

- Tab through entire page
- Verify focus indicators visible
- Ensure all interactive elements reachable
- Test skip links if implemented

**Screen reader testing:**

- Check heading hierarchy (h1 → h2 → h3)
- Verify alt text on all images
- Ensure ARIA labels on icon buttons
- Test with VoiceOver (Mac) or NVDA (Windows) if possible

**Visual accessibility:**

- Verify color contrast using browser DevTools (4.5:1 for text, 3:1 for large text)
- Ensure information isn't conveyed by color alone
- Check text is readable on all backgrounds
- Test with reduced motion preference

**Add missing accessibility features:**

```typescript
// Example: Alt text on images
<Image
  src="/hero.png"
  alt="Dashboard interface showing analytics and user management"
  width={600}
  height={400}
/>

// Example: ARIA label on icon button
<Button variant="ghost" size="icon" aria-label="Open menu">
  <Menu className="h-5 w-5" />
</Button>

// Example: Skip to content link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to content
</a>
```

Update checklist: Mark "Accessibility audit completed" as complete.

Documentation: https://www.w3.org/WAI/WCAG21/quickref/

## Step 17 - Performance Optimization

Ensure fast load times and optimal performance.

**Image optimization:**

- Use Next.js Image component for all images
- Specify width and height to prevent CLS
- Add `priority` to above-fold images
- Use `loading="lazy"` for below-fold images
- Convert to WebP or AVIF formats
- Optimize file sizes (compress images)

```typescript
// Above-fold image (hero)
<Image
  src="/hero.png"
  alt="Hero"
  width={600}
  height={400}
  priority
/>

// Below-fold image
<Image
  src="/feature.png"
  alt="Feature"
  width={400}
  height={300}
  loading="lazy"
/>
```

**Code optimization:**

- Remove unused components and imports
- Lazy load heavy sections if needed
- Minimize bundle size
- Remove console.logs

**Font optimization:**

Use `next/font` in `app/layout.tsx`:

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

**Build and verify:**

```bash
pnpm build
# Check bundle size and build warnings
# Aim for small bundle sizes
```

**Performance metrics:**

- Run Lighthouse audit (aim for 90+ score)
- Check Core Web Vitals (LCP, FID, CLS)
- Test on slow 3G connection

Update checklist: Mark "Performance optimized" as complete.

Documentation: https://nextjs.org/docs/app/building-your-application/optimizing/images

## Step 18 - Final Polish

Perfect the details and ensure everything is production-ready.

**Visual polish:**

- Verify consistent spacing throughout
- Check color consistency
- Ensure alignment of all elements
- Test all hover states and transitions
- Verify smooth scroll behavior works

**Content polish:**

- Proofread all text for typos
- Verify all links work correctly
- Test all CTAs lead to correct destinations
- Ensure forms work (if applicable)
- Check error states

**Cross-browser testing:**

- Test in Chrome, Firefox, Safari
- Verify on mobile browsers (Safari iOS, Chrome Android)
- Check for layout inconsistencies
- Test all interactive features

**Animation polish (optional):**

Add subtle entrance animations if appropriate:

```typescript
// Example: Fade in on scroll using Framer Motion
import { motion } from "framer-motion"

export function Features() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Content */}
    </motion.section>
  )
}
```

**IMPORTANT**: Ensure animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Update checklist: Mark "Final polish complete" as complete.

## Step 19 - Create Documentation

Document the implementation for future reference and maintenance.

**Create implementation documentation:**

Create `landing-page-implementation.md`:

````markdown
# Landing Page Implementation

**Project**: [Project Name]
**Implemented**: [Date]
**Spec File**: [Path to spec]

## Components Used

### Navigation

- **Source**: Coss.com - comp-577
- **File**: `src/features/landing/navbar.tsx`
- **Customizations**: Added logo, updated links, integrated theme toggle

### Hero Section

- **Source**: Shadcn UI Blocks - hero-03
- **File**: `src/features/landing/hero.tsx`
- **Customizations**: Updated content, added brand imagery

[Continue for all sections...]

## Theme Configuration

**Colors**:

- Primary: #...
- Secondary: #...
- Accent: #...

**Typography**:

- Font: Inter
- Headings: Bold, tracking-tight
- Body: Normal weight

## Performance Benchmarks

- **Lighthouse Score**: 95/100
- **Bundle Size**: 120KB gzipped
- **LCP**: 1.2s
- **CLS**: 0.05

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation tested
- Screen reader compatible
- Color contrast verified

## Editing Guide

### Updating Content

Edit section files in `src/features/landing/`:

- Hero: Update `hero.tsx`
- Features: Modify features array in `features.tsx`
- Pricing: Update tiers array in `pricing.tsx`

### Customizing Colors

Edit `app/globals.css` CSS variables:

```css
:root {
  --primary: ...;
  --secondary: ...;
}
```
````

### Adding Sections

1. Create new component in `src/features/landing/`
2. Import and add to `app/page.tsx`
3. Ensure responsive design
4. Test accessibility

## Known Issues

[List any known issues or limitations]

## Future Enhancements

[List potential improvements for future iterations]

````

**Update project CLAUDE.md:**

Add landing page section with:
- Component sources and dependencies
- File structure
- Customization instructions
- Performance notes

Update checklist: Mark "Documentation complete" as complete.

## Step 20 - Final Verification and Cleanup

Ensure everything is complete and production-ready.

**Final checklist verification:**

- Read through entire `landing-page-checklist.md`
- Verify all items are checked
- Ensure no steps were skipped

**Code cleanup:**

```bash
# Format code
pnpm format

# Run linter
pnpm lint

# Type check
pnpm ts

# Build verification
pnpm build
````

Fix any errors or warnings from these commands.

**Final quality check:**

- All spec requirements implemented
- Mobile responsive on all sections
- Accessible (WCAG 2.1 AA)
- Performant (Lighthouse 90+)
- Cross-browser compatible
- All links work
- No console errors
- Production-ready

**Cleanup temporary files:**

- Remove `landing-page-checklist.md` if no longer needed (or keep for reference)
- Delete any test components or commented code
- Ensure no placeholder content remains

**Mark project complete:**

Update `landing-page-checklist.md`:

```markdown
**Status**: ✅ COMPLETE
**Completion Date**: [Date]
```

**Hand off to user:**

Provide summary of what was implemented:

- All sections created
- Component sources documented
- Performance optimized
- Accessibility verified
- Ready for production deployment

Setup completed - the landing page is fully implemented, production-ready, and optimized for performance, accessibility, and user experience.
