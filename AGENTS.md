<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

**FoodOrder** is a single Next.js 16 app (npm) backed by Supabase. Stripe and Resend are optional.

### Services

| Service | Command | URL |
|---------|---------|-----|
| Next.js dev server | `npm run dev` | http://localhost:3000 |
| Local Supabase | `npx supabase start` (requires Docker) | API http://127.0.0.1:54321, Studio http://127.0.0.1:54323 |
| Mailpit (local email) | started with Supabase | http://127.0.0.1:54324 |

### First-time local backend setup

1. Ensure Docker is running (`sudo dockerd` if the daemon is not already up; use `sg docker` or add your user to the `docker` group).
2. From repo root: `npx supabase start` (migrations `001`–`003` apply automatically).
3. **Seed data caveat:** `supabase/migrations/004_seed_data.sql` fails on `supabase start` because item UUIDs use the invalid prefix `i` (not hex). Workaround: temporarily move that file aside, run `supabase start`, then apply seed with `sed 's/i000000/a100000/g' supabase/migrations/004_seed_data.sql | docker exec -i supabase_db_workspace psql -U postgres -d postgres` after creating a demo auth user in `auth.users` (see migration comments for `owner_user_id`).
4. Create `.env.local` from `npx supabase status -o env`:
   - `NEXT_PUBLIC_SUPABASE_URL` = `API_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` = `SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` = `http://localhost:3000`

### Lint, build, tests

- **Lint:** `npm run lint` (has pre-existing ESLint errors in the repo)
- **Build:** `npm run build` (currently fails TypeScript check in `app/api/onboard/route.ts` — missing `email` on profile upsert)
- **Tests:** none configured (no `test` script or test framework)

### Demo credentials (local seed)

- Owner email: `demo-owner@localhost.com` / password: `demo-password-123`
- Demo storefront: http://localhost:3000/demo-restaurant

### Optional integrations

- **Stripe:** per-restaurant keys in `/{slug}/admin/settings`; cash-on-delivery works without Stripe
- **Resend:** set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env.local`
- **Storage buckets** (for image uploads): create `menu-images` and `restaurant-logos` in Supabase Storage
