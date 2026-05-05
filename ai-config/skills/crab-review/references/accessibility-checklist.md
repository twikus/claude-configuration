# Accessibility Review Checklist

## Screen Reader Lens

Review as a blind user navigating with a screen reader.

**Semantic HTML:**
- Using `<div>` or `<span>` for interactive elements instead of `<button>`, `<a>`, `<input>`
- Missing heading hierarchy (h1 > h2 > h3, no skipping levels)
- Lists not using `<ul>`/`<ol>`/`<li>`
- Tables missing `<thead>`, `<th>`, `scope` attributes
- Navigation not wrapped in `<nav>`
- Main content not in `<main>`

**ARIA:**
- Images missing `alt` text (decorative images need `alt=""`)
- Form inputs missing associated `<label>` or `aria-label`
- Dynamic content updates missing `aria-live` regions
- Custom components missing appropriate `role` attribute
- Toggle states missing `aria-expanded`, `aria-checked`, `aria-selected`
- Modals missing `aria-modal="true"` and `role="dialog"`
- Error messages not linked to inputs via `aria-describedby`

**Content structure:**
- Page has no `<h1>` or multiple `<h1>` tags
- Meaningful content conveyed only through color/icons (needs text alternative)
- Links with generic text ("click here", "read more") without context
- Form validation errors not announced to screen readers

## Keyboard Navigator Lens

Review as a user who cannot use a mouse.

**Focus management:**
- Interactive elements not reachable via Tab key
- Custom focus styles removed without replacement (outline: none)
- Focus not moved to modals/dialogs when opened
- Focus not returned to trigger element when modal closes
- Focus trapped in modal (good) or trapped elsewhere (bad)

**Tab order:**
- Tab order doesn't follow visual/logical order
- tabindex > 0 used (breaks natural tab order)
- Hidden elements still focusable
- Skip-to-content link missing for long navigation

**Keyboard interaction:**
- Custom dropdowns/menus not navigable with arrow keys
- Escape key doesn't close modals/popups
- Enter/Space don't activate buttons and links
- Custom sliders/carousels missing keyboard controls

**Visible indicators:**
- No visible focus indicator on focused element
- Focus indicator has insufficient contrast
- Active/selected state indistinguishable from focused state

## Mobile User Lens

Review for touch and responsive usability.

**Touch targets:**
- Interactive elements smaller than 44x44px
- Touch targets too close together (less than 8px gap)
- Small text links without adequate padding

**Responsive layout:**
- Content overflows viewport on small screens
- Horizontal scrolling required to read content
- Fixed-width elements breaking layout on narrow screens
- Images without max-width: 100%

**Loading and feedback:**
- Missing loading indicators for async operations
- No error state UI when requests fail
- No empty state when lists have no items
- Form submission without feedback (spinner, success, error)
- No skeleton/placeholder during content load

**Mobile-specific:**
- Hover-dependent interactions with no touch alternative
- Pinch-to-zoom disabled (user-scalable=no)
- Viewport meta tag missing or misconfigured
- Text too small to read without zooming (< 16px base)
