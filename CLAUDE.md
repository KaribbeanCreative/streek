# CLAUDE.md — Streek

Application web de suivi de vie (habitudes, tâches, objectifs), destinée à de vrais utilisateurs. Doit rester fonctionnelle, fiable et déployable à tout moment.

## Stack

- Next.js 16 (App Router) + TypeScript (strict)
- Tailwind CSS + Shadcn UI (composants dans `src/components/ui`)
- Supabase (PostgreSQL + Auth) — clients dans `src/lib/supabase`
- Zustand pour l'état client (`src/stores`)
- Node.js 20+ requis
- Déploiement : Vercel

## Commandes

- `npm run dev` — serveur de développement
- `npm run build` — build de production (doit passer avant tout merge)
- `npm run lint` — ESLint

## Conventions de code

- TypeScript strict : pas de `any` non justifié.
- Composants React fonctionnels, nommés en PascalCase ; fichiers utilitaires en camelCase.
- Privilégier les Server Components ; ajouter `"use client"` uniquement si nécessaire (état, événements).
- UI exclusivement via les composants Shadcn existants ; ne pas réinventer un composant déjà présent dans `src/components/ui`.
- Thème light mode par défaut.
- Jamais de secret en dur : tout passe par les variables d'environnement (`.env.local`, jamais commité).

## Structure

```
src/
  app/         routes (App Router)
  components/  composants réutilisables
    ui/        composants Shadcn
  lib/         utilitaires + clients (supabase…)
  stores/      stores Zustand
  types/       types TS partagés
```

## Workflow Git (important)

- `main` reste toujours stable et déployable.
- Une branche par feature : `feat/nom-de-la-feature`. Ne jamais coder une feature directement sur `main`.
- Messages de commit en Conventional Commits : `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- Fusion dans `main` via Pull Request une fois la feature fonctionnelle.

## Préférences de travail

- Avant une tâche qui touche plusieurs fichiers ou un choix d'architecture, proposer un plan et attendre ma validation (je travaille souvent en mode plan).
- Si un choix est ambigu, me poser la question plutôt que de trancher seul.
- Après une modification, indiquer ce que je dois vérifier ou configurer de mon côté (Supabase, Git).
- Travailler brique par brique : une fonctionnalité finie et vérifiée avant de passer à la suivante.

## Périmètre

- v1 (en cours) : auth, module Habitudes (avec grille annuelle type GitHub), module Tâches, gamification légère (streaks + points).
- v2 (backlog, NE PAS coder sans demande explicite) : objectifs, timer/pomodoro, journal, notes.
