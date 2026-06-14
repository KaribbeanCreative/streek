# Streek

Application web de suivi de vie (habitudes, tâches, objectifs), destinée à de vrais utilisateurs.

🔗 **En ligne :** https://streek.karibbeancreative.xyz

## Stack

- **Next.js 16** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** + **Shadcn UI**
- **Supabase** (PostgreSQL + Auth, avec RLS)
- **Zustand** pour l'état client
- **Resend** pour l'envoi d'emails (SMTP)
- Hébergement : **Vercel** · DNS : **Cloudflare**
- Node.js 20+ requis

## Installation locale

```bash
pnpm install
cp .env.example .env.local   # puis renseigner les clés Supabase
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` — serveur de développement
- `pnpm build` — build de production (doit passer avant tout merge)
- `pnpm lint` — ESLint

## Base de données

Les migrations SQL sont dans `supabase/migrations/`, à exécuter dans le SQL Editor du dashboard Supabase. Chaque table active la Row Level Security pour isoler les données par utilisateur.

## Déploiement

- **Vercel** : auto-déploiement à chaque push sur `main`. Les variables d'environnement Supabase sont configurées côté projet Vercel.
- **Domaine** : `streek.karibbeancreative.xyz`, CNAME vers Vercel géré dans Cloudflare (DNS only).
- **Auth email** : confirmation d'inscription activée. Les emails partent via Resend (SMTP custom dans Supabase), depuis le domaine vérifié `karibbeancreative.xyz`. Le lien de confirmation passe par la route `/auth/confirm`.

Le workflow Git, les conventions de code et le périmètre fonctionnel sont décrits dans [`CLAUDE.md`](./CLAUDE.md).

## Journal

### 2026-06-14 — v1 initiale et mise en ligne

- Bootstrap du projet (Next.js 16, Tailwind v4, Shadcn UI).
- Clients Supabase SSR + proxy de session.
- Authentification email/mot de passe (login, register, dashboard protégé, logout).
- Module **Tâches** : CRUD, priorités, échéances, responsive mobile.
- Connexion automatique via le lien de confirmation email (route `/auth/confirm`).
- **Mise en production** : déploiement Vercel, domaine custom `streek.karibbeancreative.xyz`, confirmation email branchée sur Resend. Application ouverte aux tests utilisateurs.
