# isTurs – Conventions for Claude Code Sessions

## Tech Stack
- **Next.js 15** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4** – config lives in `app/globals.css` via `@theme` blocks, not `tailwind.config.ts`
- **shadcn/ui** (new-york style, neutral base) – components in `components/ui/`
- **Supabase** (Postgres + Auth) via `@supabase/ssr` (NOT the deprecated `@supabase/auth-helpers-nextjs`)
- **Stripe** (test mode) for subscriptions
- **Framer Motion** for game animations
- **nanoid** for 10-char slugs
- **Zod** for all validation (API routes + game content)
- **pnpm** as package manager

## Project Layout
```
app/
  (marketing)/        – public landing page, no auth required
  (auth)/             – login, signup, OAuth callback
  (dashboard)/        – requires auth (layout.tsx redirects to /login)
  play/[slug]/        – PUBLIC game player, no auth
  api/
    activities/       – POST (create), PATCH (update)
    results/          – POST (anonymous result submission)
    stripe/           – checkout session + webhook

components/
  ui/                 – shadcn primitives (Button, Input, Card, etc.)
  games/
    quiz/             – QuizEditor, QuizPlayer, types.ts
    match-up/         – types.ts stub
    whack-a-mole/     – types.ts stub
    spin-wheel/       – types.ts stub
  dashboard/          – ActivityCard, TemplatePicker
  shared/             – Nav, ShareLinkDialog

lib/
  supabase/           – client.ts (browser), server.ts (RSC/route), middleware.ts
  stripe/             – server.ts (Stripe SDK instance)
  games/              – registry.ts (GameType → metadata)

types/
  database.ts         – hand-maintained Supabase type stubs

supabase/
  migrations/
    00001_init.sql    – full schema: profiles, activities, results + RLS
```

## Adding a New Game Type

1. **Schema** – create `components/games/<type>/types.ts` with a Zod schema for the `content` JSONB column.
2. **Components** – create `QuizEditor.tsx` and `QuizPlayer.tsx` equivalents.
3. **Register** – add an entry to `lib/games/registry.ts`.
4. **Template picker** – add a card in `components/dashboard/TemplatePicker.tsx`.
5. **Editor route** – create `app/(dashboard)/activities/new/<type>/page.tsx`.
6. **DB enum** – add the type string to the `check` constraint in `supabase/migrations/00001_init.sql` and run a new migration.
7. **Play route** – add a branch in `app/play/[slug]/page.tsx` to render the new player.

## RLS Model
- **profiles**: user reads/updates own row only.
- **activities**: owner has full access; anyone can `SELECT` where `is_public = true` (powers `/play/[slug]`).
- **results**: anyone can `INSERT` if the activity is public (anonymous student submits score); only the activity owner can `SELECT`.
- The Stripe webhook uses the **service role key** (bypasses RLS) to update `profiles.plan`.

## Freemium Gate
Located in `app/api/activities/route.ts` (POST handler):
1. Fetch `profiles.plan` for the authenticated user.
2. If `plan = 'free'`, count their activities.
3. If count ≥ 5, return HTTP 403 with `"Free plan limit reached. Upgrade to Pro to create more."`.
4. Updating an existing activity (`PATCH /api/activities/[id]`) bypasses the gate — no new row created.

## Stripe Webhook Events Handled
- `customer.subscription.created` → set `plan = 'pro'`
- `customer.subscription.updated` → sync status
- `customer.subscription.deleted` → set `plan = 'free'`

## Environment Variables
Copy `.env.local.example` to `.env.local` and fill in values. **Never commit `.env.local`.**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Never expose client-side. |
| `NEXT_PUBLIC_APP_URL` | e.g. `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Stripe test secret key |
| `STRIPE_WEBHOOK_SECRET` | From `stripe listen` or dashboard |
| `NEXT_PUBLIC_STRIPE_PRICE_ID` | The Pro monthly price ID |

## Running the Migration
Paste `supabase/migrations/00001_init.sql` into the Supabase SQL editor, or:
```bash
supabase db push   # if using Supabase CLI with linked project
```
