# Independent Supabase Backend

Everything below is portable: standard Supabase SQL + Deno edge functions. After GitHub export, run `supabase db push` and `supabase functions deploy` against any Supabase project.

## 1. Database schema (migration)

New tables (all with RLS):

- **`products`** — extend existing table with: `description`, `price_cents`, `currency`, `images jsonb`, `category`, `stock`, `active`. Seed from `src/lib/products.ts`.
- **`customers`** — `id` (= auth.users.id), `email`, `full_name`, `phone`, `default_address jsonb`. Auto-created via `handle_new_user` trigger (extend existing one).
- **`orders`** — `id`, `order_number` (human-readable, e.g. `HL-2026-00042`), `tracking_number` (auto-generated `HL-XXXXX-XXXXXX`), `user_id` (nullable for guests), `email`, `status` (`placed|processing|shipped|out_for_delivery|delivered|cancelled`), `subtotal_cents`, `tax_cents`, `shipping_cents`, `total_cents`, `currency`, `shipping_address jsonb`, `payment_method`, `stripe_session_id`, `stripe_payment_intent`, `paid_at`, `placed_at`, `estimated_delivery`, `timeline jsonb`.
- **`order_items`** — `order_id`, `product_id`, `title`, `image`, `qty`, `unit_price_cents`.

Database function `generate_tracking_number()` + trigger on `orders` insert → auto-fills `tracking_number` and `order_number`.

**RLS:**
- products: public SELECT, admin ALL
- customers: user reads/updates own, admin ALL
- orders & order_items: user reads own (by `user_id` OR by `email` match for guest lookups via tracking number on a public edge function), admin ALL, INSERT via service role (edge function only)

## 2. Edge functions (`supabase/functions/`)

All in Deno, deployable with `supabase functions deploy <name>`.

1. **`create-checkout`** — input: cart items + shipping address. Looks up products from DB (price authority), creates Stripe Checkout Session, stores pending order, returns `{ url }`. Stripe key read from `STRIPE_SECRET_KEY` (add later).
2. **`stripe-webhook`** — verifies `STRIPE_WEBHOOK_SECRET`, on `checkout.session.completed` marks order paid, sets `placed_at`, triggers email.
3. **`send-order-email`** — Resend API (`RESEND_API_KEY`, add later). Branded HTML with order summary + tracking link. Called by webhook; also callable manually.
4. **`track-order`** — public GET by `tracking_number` (+ email match for guest privacy). Returns order + timeline.
5. **`admin-update-order`** — admin only (checks `has_role`), updates status & appends to `timeline`.

Until Stripe/Resend keys are added: `create-checkout` falls back to a "mock pay" path that directly creates a paid order (so the full flow is testable), and `send-order-email` logs to console.

## 3. Auth

Already wired. I'll add:
- Email/password signup & login UI (already exists at `/login` — verify and polish)
- Google OAuth toggle (call `configure_social_auth` with `["google"]`)
- Guest checkout still works (orders allow null `user_id` + email)

## 4. Admin dashboard

New route `/_authenticated/admin` (gated by `has_role('admin')`):
- **Orders tab**: table of all orders, filter by status, click → detail view, update status (calls `admin-update-order`)
- **Products tab**: CRUD products (image upload to existing `review-images` bucket or new `product-images` bucket), toggle active/stock
- **Reuse existing**: `/admin/reviews`

## 5. Frontend rewiring

- `src/lib/products.ts` → replaced by `useProducts()` hook querying Supabase
- `src/lib/orders.ts` (zustand) → replaced by Supabase queries; keep cart in zustand
- `/checkout` → calls `create-checkout` edge function
- `/track` & `/orders/$orderId` → call `track-order` or query DB if logged in
- Invoice PDF generation stays client-side (already implemented)

## 6. Environment / portability

`.env` (already correct):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```
After export, add to your own Supabase project's edge function secrets:
```
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
RESEND_API_KEY=...
```
All migrations live in `supabase/migrations/` — `supabase db push` recreates schema on any project.

## Execution order

1. Migration: schema + RLS + tracking trigger + seed products
2. Edge functions: `track-order`, `create-checkout` (mock-pay mode), `send-order-email` (stub), `admin-update-order`, `stripe-webhook` (signature-verify ready)
3. Frontend: products hook, checkout rewire, orders rewire, admin dashboard
4. Verify build + smoke-test checkout → order → tracking flow
5. Tell you exactly which secrets to add when you're ready for live Stripe/Resend

## Out of scope this round

- Live Stripe (added when you provide the key — I'll request via secrets tool)
- Live Resend (same)
- Refunds / partial shipments
