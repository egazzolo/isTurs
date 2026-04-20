# isTurs

Interactive learning activities platform for teachers. Create quizzes, matching games, and more — share a link, students play anonymously.

## Quick Start

### 1. Install dependencies
```bash
pnpm install
```

### 2. Environment variables
```bash
cp .env.local.example .env.local
# Fill in Supabase, Stripe, and app URL values
```

### 3. Database
Run `supabase/migrations/00001_init.sql` in your Supabase SQL editor or via the CLI:
```bash
supabase link --project-ref <your-ref>
supabase db push
```

### 4. Run dev server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stripe (local testing)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the webhook secret into `STRIPE_WEBHOOK_SECRET`.

## Project Structure
See [CLAUDE.md](./CLAUDE.md) for full conventions, RLS model, and how to add game types.

## Game Types
| Type | Status |
|---|---|
| Quiz | Full implementation |
| Match Up | Coming soon |
| Whack-a-mole | Coming soon |
| Spin the Wheel | Coming soon |

## Tech Stack
Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase · Stripe · Framer Motion
