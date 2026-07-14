# Design

## Theme

Light-mode-first (warm off-white), dark mode via `next-themes` class strategy (warm brown-black, never pure black). All tokens are OKLCH CSS variables in `src/app/globals.css`, mapped through Tailwind v4 `@theme inline`.

## Colors

- Background light: `oklch(98.51% 0 0)` / dark: `oklch(17% 0.015 50)`
- Surface light: `oklch(100% 0 0)` / dark: `oklch(22% 0.018 50)`
- Text light: `oklch(24% 0.02 50)` warm charcoal / dark: `oklch(93% 0.01 85)`
- Primary (flame orange): light `oklch(70.5% 0.213 47.6)`, hover `oklch(64% 0.21 44)`; dark `oklch(74% 0.2 50)`
- Flame gradient (streak moments only): `--flame-from` → `--flame-to` (`oklch(76.9% 0.188 70.1)` amber)
- States: success `oklch(72.3% 0.219 149.6)`, warning `oklch(85.2% 0.199 91.936)`, error `oklch(63.7% 0.237 25.3)`, info `oklch(62.3% 0.214 259.815)`
- Habit palette: 8 named colors in `src/shared/constants` (flame, amber, sun, leaf, ocean, violet, rose, berry), each with css + hex.
- Strategy: committed warm neutrals with the flame orange carrying identity moments (streaks, checks, FAB, active nav). Never cold grays, never #000/#fff.

## Typography

- Headings: **Bricolage Grotesque** (`--font-heading`, applied to h1-h6) — personality for streak counters and levels.
- Body/UI: **Outfit** (`--font-sans`).
- Both loaded via `next/font`, exposed as CSS variables.
- Hierarchy through big scale jumps on numbers (streak counts) vs small muted labels.

## Components

- Shadcn UI (radix base) in `src/shared/ui` (button, card, input, label, checkbox), aliases remapped to `@/shared/*`.
- Custom: `BottomNav` (fixed, safe-area aware), `ThemeToggle`, `Greeting`, inline SVG icons in `src/shared/icons`.
- Habits feature: `CheckButton` (48px circle, pop + canvas-confetti), `HabitHeatmap` (365-day GitHub-style grid, intensity grows with run length), `StreakBadge`.
- Radius scale from `--radius: 0.625rem` (cards typically rounded-xl/2xl).

## Motion

- `animate-pop` keyframe (scale 1 → 1.22 → 1, 350ms spring-like cubic-bezier) on check.
- Light element-anchored confetti on check only, `disableForReducedMotion`.
- Ease-out curves, no bounce; never animate layout properties.

## Layout

- Mobile-first: `max-w-md` centered column, `px-4`, bottom padding clears the fixed BottomNav (`pb-28`), FAB sits above the nav (`bottom-24`).
- Touch targets ≥ 44px (`h-11`/`size-12`).
