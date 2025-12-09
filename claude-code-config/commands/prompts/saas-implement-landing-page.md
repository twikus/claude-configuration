---
description: Implement a production-ready landing page from specification using shadcn/ui components
---

<objective>
Implement a complete, production-ready landing page from a markdown specification file.

Use high-quality shadcn/ui ecosystem components to create a beautiful, accessible, performant landing page. This transforms a landing page spec (content, sections, design) into fully functional React components.
</objective>

<context>
Project structure: !`ls -la`
Existing components: !`ls src/components/ 2>/dev/null || ls components/ 2>/dev/null || echo "No components folder"`
Tailwind config: !`cat tailwind.config.ts 2>/dev/null | head -30 || cat tailwind.config.js 2>/dev/null | head -30 || echo "No tailwind config"`
</context>

<process>
## Phase 1: Specification Analysis

1. **Ask for spec file path**:
   > "Please provide the path to your landing page specification file."

2. **Read spec completely**, extract:
   - Sections required (Hero, Features, Pricing, FAQ, etc.)
   - Content (headlines, descriptions, CTAs)
   - Design preferences (colors, style)
   - Target audience

3. **Ask for project location** if not provided

4. **Analyze existing project**:
   - Read `tsconfig.json` for path aliases
   - Read `tailwind.config.ts` for theme
   - Check `components.json` for shadcn setup
   - Note existing patterns and conventions

## Phase 2: Component Research

5. **Research component sources** using Context7 MCP:
   - Official Shadcn UI: https://ui.shadcn.com
   - Shadcn UI Blocks: https://shadcn-ui-blocks.akashmoradiya.com
   - Coss.com: https://coss.com/origin
   - Aceternity UI (selective): https://ui.aceternity.com

6. **Document component choices** in `landing-page-components.md`:
```markdown
# Landing Page Components

## Hero Section
- **Source**: Shadcn UI Blocks - hero-03
- **URL**: https://shadcn-ui-blocks.akashmoradiya.com/r/hero-03.json
- **Install**: `npx shadcn add <url>`
- **Why**: [Rationale]

## Navigation
- **Source**: Coss.com - comp-577
- **URL**: https://coss.com/origin/r/comp-577.json
- **Install**: `pnpm dlx shadcn@latest add <url>`
- **Why**: [Rationale]

[Continue for each section...]
```

## Phase 3: Setup

7. **Configure theme** in `app/globals.css`:
   - Update CSS variables based on brand colors
   - Ensure sufficient contrast (4.5:1 for text)

8. **Install base components**:
```bash
npx shadcn@latest add button card input label badge separator
npx shadcn@latest add navigation-menu dropdown-menu sheet
npx shadcn@latest add accordion dialog toast
```

## Phase 4: Build Sections

9. **Build Navigation** - `src/features/landing/navbar.tsx`:
   - Logo and branding
   - Navigation links
   - CTA button
   - Mobile menu with Sheet

10. **Build Hero** - `src/features/landing/hero.tsx`:
    - Headline and subheadline from spec
    - Primary and secondary CTAs
    - Hero image if specified
    - Mobile-first responsive design

11. **Build Features** - `src/features/landing/features.tsx`:
    - Feature cards from spec
    - Icons from lucide-react
    - Grid layout (responsive)

12. **Build Pricing** (if in spec) - `src/features/landing/pricing.tsx`:
    - Pricing tiers from spec
    - Feature lists with checkmarks
    - Highlight recommended tier

13. **Build FAQ** (if in spec) - `src/features/landing/faq.tsx`:
    - Accordion component
    - All questions from spec

14. **Build CTA** - `src/features/landing/cta.tsx`:
    - Compelling headline
    - Primary and secondary buttons
    - Strategic placement

15. **Build Footer** - `src/features/landing/footer.tsx`:
    - Navigation links
    - Legal links
    - Social media
    - Copyright

## Phase 5: Assembly

16. **Assemble page** in `app/page.tsx`:
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

17. **Add smooth scrolling** in `app/globals.css`:
```css
html {
  scroll-behavior: smooth;
}
```

## Phase 6: Quality Assurance

18. **Mobile responsiveness**:
    - Test at 375px width (iPhone SE)
    - Verify readable text (min 16px)
    - Check touch targets (min 44x44px)
    - Test mobile navigation

19. **Accessibility audit**:
    - Keyboard navigation (Tab through page)
    - Heading hierarchy (h1 → h2 → h3)
    - Alt text on images
    - ARIA labels on icon buttons
    - Color contrast (4.5:1 minimum)

20. **Performance optimization**:
    - Next.js Image for all images
    - `priority` on above-fold images
    - `loading="lazy"` on below-fold
    - next/font for fonts
    - Remove unused imports

21. **Final verification**:
```bash
pnpm lint
pnpm ts
pnpm build
```
</process>

<constraints>
**QUALITY STANDARDS** (non-negotiable):
- WCAG 2.1 AA accessibility compliance
- Mobile-first responsive design
- Lighthouse score 90+
- Clean, maintainable code

**COMPONENT RULES**:
- Adapt to existing project structure
- Respect existing path aliases and conventions
- Never overwrite existing components without understanding
- Use shadcn/ui ecosystem components

**DO NOT**:
- Skip reading the spec file
- Ignore existing project conventions
- Leave placeholder content
- Skip accessibility requirements
- Use hardcoded colors (use theme variables)
</constraints>

<output>
**Files created**:
- `landing-page-components.md` - Component sources documentation
- `src/features/landing/navbar.tsx`
- `src/features/landing/hero.tsx`
- `src/features/landing/features.tsx`
- `src/features/landing/pricing.tsx` (if in spec)
- `src/features/landing/faq.tsx` (if in spec)
- `src/features/landing/cta.tsx`
- `src/features/landing/footer.tsx`
- Updated `app/page.tsx`

**Quality verified**:
- Mobile responsive
- WCAG 2.1 AA accessible
- Performant (Lighthouse 90+)
- All spec requirements implemented
</output>

<success_criteria>
- All spec sections implemented
- Mobile responsive on all breakpoints
- Keyboard navigation works
- Color contrast passes WCAG AA
- Images optimized with Next.js Image
- No TypeScript or ESLint errors
- Build succeeds without warnings
- Component sources documented
</success_criteria>
