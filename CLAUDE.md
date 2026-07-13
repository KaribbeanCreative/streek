# CLAUDE.md — Streek

## Project

Streek is a life-tracking app (habits, tasks, goals) with light gamification.
Goal : solid portfolio project + daily personal use.
v1 deadline : end of July 2026.
Absolute priority: SHIP, not perfection.

## Stack (non-negotiable)

- Next.js 16 (App Router) + strict TypeScript
- Tailwind CSS + Shadcn UI
- Supabase (auth + Postgres + RLS)
- Zustand (client state only when necessary)
- Deployment : Cloudflare Workers via the OpenNext Cloudflare adapter (`@opennextjs/cloudflare`)

## Architecture

```
src/
  app/                    # Routes only — NO business logic
  features/
    auth/
    onboarding/
    habits/               # includes tracking + streaks
    tasks/
    goals/
    gamification/
    settings/
  shared/
    ui/                   # Shadcn + Dope UI components
    icons/
    lib/                  # Supabase client, utils
    constants/
    types/
```

### Architecture rules (strict)

1. `app/` stays thin: pages import from `features/`, zero business logic.
2. A feature NEVER imports from another feature. Sharing goes through `shared/` or through the central `trackEvent()` hook from gamification.
3. Every feature exposes an `index.ts` (barrel file). The rest of the app imports `@/features/habits`, never internal files.
4. Internal feature structure: `components/`, `hooks/`, `actions/` (server actions), `stores/` (Zustand if needed), `types.ts`, `index.ts`.
5. NEVER re-architect without an explicit request. The structure above is locked.

## Auth strategy

- Primary sign-in method: **magic link** (Supabase `signInWithOtp`) — passwordless, email-first.
- Signup form includes an explicit, unchecked opt-in checkbox : "Receive news and offers by email". Store it as `marketing_opt_in boolean default false` on `profiles`. Never assume consent (GDPR).
- Emails are the core asset: validate them with Zod, normalize to lowercase before storage.

## Gamification foundations (from day 1)

- `events` table : every user action writes a raw event
  (`id, user_id, type, entity_id, xp_earned, created_at`).
  Types: `habit_checked`, `task_completed`, `goal_reached`.
- `user_stats` table : `user_id, total_xp, level, current_streak, longest_streak, freezes_available`.
- `features/gamification/rules.ts` : SINGLE source of truth for XP values, level formula, streak freeze logic. No hardcoded XP values anywhere else.
- `features/gamification/trackEvent()` : central hook called by habits/tasks/goals. Features signal the action, gamification applies the rules.

## Design system

- **Light-mode-first**, dark mode available via toggle (class strategy, `next-themes`)
- Identity concept : the flame (streak symbol). Warm tones everywhere — never cold grays or pure black/white.

### Light mode (default)

- Background: `oklch(98.51% 0 0)`
- Surface/cards: `oklch(100% 0 0)`
- Text: `oklch(24% 0.02 50)` (warm charcoal)
- Primary (flame orange): `oklch(70.5% 0.213 47.6)` — hover: `oklch(64% 0.21 44)`
- Flame accent gradient (streaks only): primary → `oklch(76.9% 0.188 70.1)` (orange → amber)

### Dark mode

- Background: `oklch(17% 0.015 50)` (warm brown-black)
- Surface: `oklch(22% 0.018 50)`
- Text: `oklch(93% 0.01 85)`
- Primary: `oklch(74% 0.2 50)` (slightly brightened orange for contrast)

### State colors (same in both modes)

- Success: `oklch(72.3% 0.219 149.6)`
- Warning: oklch(85.2% 0.199 91.936)
- Error: `oklch(63.7% 0.237 25.3)`
- Info: `oklch(62.3% 0.214 259.815)`

### Typography

- Headings: **Bricolage Grotesque** (gives personality to streak counters and levels)
- Body + UI: **Outfit**
- Both via `next/font` (Google Fonts)

### Motion

- Polished micro-interactions on key actions (habit check = juicy feedback: animation + confetti)

## Code conventions

- Strict TypeScript, no `any`
- Server actions for mutations, systematic Zod validation on input
- Supabase RLS enabled on all tables. Never a query without a policy
- Components: PascalCase. Hooks: `useXxx`. Server actions: explicit verb (`createHabit`, `checkHabit`)
- No useless comments, self-documenting code.

## Git

- Branches: `feature/<name>` (e.g., `feature/habits`), merge into `main` only when the feature is functional
- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- Atomic and frequent commits, messages in English.

## v1 scope — DO NOT EXCEED

✅ Included: auth, habits (GitHub-style grid + streaks + freeze), tasks, goals (simple version: title, deadline, manual progress), gamification (XP + levels + feedback), minimal onboarding (2-3 screens), basic settings.

❌ Excluded (v2+): goals ↔ habits/tasks links, badges, leagues, social, payment/premium (only the `plan` field exists on the user + centralized `hasAccess()` logic), mobile app, push notifications.

If a request falls outside the v1 scope: flag it and suggest noting it for v2 instead of implementing it.
