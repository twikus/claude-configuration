---
name: use-style
description: Apply named visual style guides to landing pages and UI. Use when the user invokes $use-style, names a style like grid, vercel-simple, stripe, linear, new-york-times, anthropic, gumroad, or raycast, or builds themed pages such as /aiblueprint, /agents, Vercel-style dark tool UIs, Linear-style app shells, editorial newspaper layouts, warm Anthropic/Claude AI-lab pages, loud neo-brutalist commerce, or glossy dark product marketing.
---

Load and apply a named style before designing or implementing any UI.

## Invocation

- Explicit: `$use-style grid` or "use the grid style"
- Implicit: user references `/aiblueprint`, `/agents`, `/aibuilder`, "grid theme", Vercel, Geist, a minimalist dark tool UI, Stripe / fintech / checkout / dashboard UI, Linear / issue tracker / app-shell sidebar UI, NYT / newspaper / editorial / broadsheet / magazine layouts, Anthropic / Claude / warm cream AI-lab pages, Gumroad / neo-brutalist / loud commerce / bold yellow-pink pages, or Raycast / glossy dark / glow gradients / floating glass nav / premium product marketing

Parse the style name from `$ARGUMENTS` or the message. Default to `grid` for Codelynx product landings. Default to `vercel-simple` when the user references Vercel, Geist, or minimalist dark developer tools. Default to `linear` when the user references Linear, an issue tracker, or a dense sidebar + list + detail app shell. Default to `new-york-times` when the user references a newspaper, broadsheet, magazine, or serif editorial layout. Default to `anthropic` when the user references Anthropic, Claude, or a warm cream + serif AI-lab aesthetic. Default to `gumroad` when the user references Gumroad, neo-brutalism, hard offset shadows, or a loud yellow/pink bordered look. Default to `raycast` when the user references Raycast, a glossy dark page with glow gradients, a floating glass nav, or premium dark product marketing.

## Workflow

1. Read `styles/<name>.md` from this skill directory.
2. Check for project overrides and prefer them over the portable spec:
   - `.agents/styles/<name>.md`
   - `.agents/styles/<name>-theme.md`
   - `.agents/styles/<name>-theme-migration.md` (migration playbooks only)
3. Treat the loaded style as hard constraints for layout, typography, color, borders, motion, and component choice.
4. Reuse existing primitives. In Codelynx repos, import `GridTheme*` components from `grid-theme-primitives.tsx` instead of reinventing patterns.

## Available styles

| Style | File | Vibe |
|-------|------|------|
| `grid` | `styles/grid.md` | Blueprint landing. Square geometry, 1px borders, mono data, condensed display type. |
| `vercel-simple` | `styles/vercel-simple.md` | Vercel dark mode. Black canvas, Geist + mono, 1px `#333` borders, minimal accent. |
| `stripe` | `styles/stripe.md` | Stripe fintech UI. Pale `#f6f9fc` canvas, white cards on soft shadows, blurple `#635BFF` accent, green CTA, rounded geometry. |
| `linear` | `styles/linear.md` | Linear app shell. Near-black `#08090a` canvas, dense aligned sidebar + list + detail panes, indigo `#5e6ad2` accent, Inter Display headings, quiet line-defined chrome. |
| `new-york-times` | `styles/new-york-times.md` | Print-newspaper editorial. Paper-white, serif headlines (Cheltenham/Georgia), Franklin sans kickers, blackletter masthead, hairline rules, multi-column grid, red/blue accents only. |
| `anthropic` | `styles/anthropic.md` | Warm AI-lab. Cream `#f0efe9` paper, bold grotesque sans display + reading serif, clay-coral `#cc785c` accent, big soft-rounded dark panels, pill buttons. Light marketing + dark Claude app surfaces. |
| `gumroad` | `styles/gumroad.md` | Loud neo-brutalist commerce. Yellow `#ffc900` + pink `#ff90e8`, thick black borders, hard offset shadows `4px 4px 0 #000`, flat fills, bold geometric sans, pill buttons. Light marketplace + dark dashboard surfaces. |
| `raycast` | `styles/raycast.md` | Glossy dark product marketing. Near-black `#0a0a0a` + red `#ff6363` glow, floating glass nav (`backdrop-blur`), oversized bold pricing, large-radius `rounded-3xl` cards, soft glow over hard shadows. |

Add new styles as `styles/<name>.md` and register them here.

## Output rules

- Match the style vibe precisely. Do not blend with generic SaaS aesthetics.
- Honor the anti-patterns section in the style file.
- When a project spec lists concrete tokens or components, use those over prose approximations.
- For landing pages, scaffold the page shell from the style first, then fill sections.

## Related skills

- `frontend-design` / `frontend-skill`: general UI craft. Defer to `use-style` when a named style is requested.
- `impeccable`: polish pass after the style is applied.
