<overview>
UX/UI code review checklist for frontend components, accessibility, responsive design, and user experience patterns.
</overview>

<accessibility priority="critical">
**WCAG 2.1 AA compliance:**

- [ ] All images have meaningful `alt` text (not "image" or empty for decorative)
- [ ] Form inputs have associated `<label>` elements or `aria-label`
- [ ] Interactive elements are keyboard-accessible (Tab, Enter, Escape)
- [ ] Focus management: visible focus indicators, logical tab order
- [ ] Color contrast ratio >= 4.5:1 for text, >= 3:1 for large text
- [ ] No information conveyed by color alone
- [ ] ARIA roles used correctly (not overriding semantic HTML)
- [ ] Screen reader: content is meaningful when read linearly
- [ ] Error messages are associated with their inputs (`aria-describedby`)
- [ ] Dynamic content changes announced (`aria-live` regions)
</accessibility>

<component_patterns priority="high">
**React/Component best practices:**

- [ ] Loading states handled (skeleton, spinner, not blank)
- [ ] Error states handled with actionable messages
- [ ] Empty states meaningful (not just blank space)
- [ ] Optimistic updates where appropriate (forms, toggles)
- [ ] Debounced inputs for search/filter (300ms+)
- [ ] No layout shifts (CLS) - reserve space for async content
- [ ] Images use proper sizing (width/height or aspect-ratio)
- [ ] Lists use virtualization for >100 items
</component_patterns>

<responsive_design priority="high">
**Multi-device support:**

- [ ] Touch targets >= 44x44px on mobile
- [ ] No horizontal scroll on mobile viewports
- [ ] Text readable without zooming (>= 16px base)
- [ ] Responsive images (srcset or next/image)
- [ ] Navigation usable on mobile (hamburger, bottom nav)
- [ ] Forms usable on mobile (proper input types, autocomplete)
</responsive_design>

<user_experience priority="high">
**Interaction quality:**

- [ ] Feedback on user actions (button press, form submit)
- [ ] Confirmation for destructive actions (delete, leave unsaved)
- [ ] Undo support where possible
- [ ] Consistent visual hierarchy (headings, spacing, alignment)
- [ ] Progress indicators for long operations (>1s)
- [ ] Meaningful error messages (not "Something went wrong")
- [ ] Form validation on blur + submit (not only submit)
- [ ] Preserved scroll position on navigation
</user_experience>

<performance_ux priority="medium">
**Perceived performance:**

- [ ] Above-the-fold content loads first
- [ ] Lazy load below-fold images and heavy components
- [ ] Skeleton loaders instead of spinners for content areas
- [ ] Animations are smooth (60fps, use transform/opacity)
- [ ] No unnecessary re-renders (React.memo, useMemo where needed)
- [ ] Bundle splitting for route-based code splitting
</performance_ux>

<search_patterns>
Grep patterns for UX/UI issues:

<missing_alt_text>
```bash
grep -rE '<img[^>]*(?!alt=)[^>]*>' --include="*.{tsx,jsx}"
```
</missing_alt_text>

<missing_loading_states>
```bash
grep -rE '(isLoading|loading|pending)' --include="*.{tsx,jsx}" -l
```
</missing_loading_states>

<hardcoded_colors>
```bash
grep -rE '(color|background|border):\s*#[0-9a-fA-F]' --include="*.{css,scss,tsx,jsx}"
```
</hardcoded_colors>
</search_patterns>

<sources>
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Accessibility](https://m3.material.io/foundations/accessible-design)
- [Core Web Vitals](https://web.dev/vitals/)
</sources>
