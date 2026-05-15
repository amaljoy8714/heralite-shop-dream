## Product Review System — Build Plan

### 1. Backend (Lovable Cloud)
Enable Cloud, then create migrations for:

**Tables**
- `products` — `id uuid pk`, `slug text unique`, `name`, `avg_rating numeric(2,1) default 0`, `total_reviews int default 0`, `rating_breakdown jsonb default '{"1":0,"2":0,"3":0,"4":0,"5":0}'`. Seed with the existing HeraLite product (slug: `cloud-rain-humidifier`).
- `profiles` — `id uuid pk references auth.users`, `display_name`, `avatar_url`. Auto-created via trigger on signup.
- `reviews` — id, product_id fk, user_id fk, rating 1–5 check, title varchar(255), review_text text, images jsonb (array of storage URLs), verified_purchase bool default false, helpful_count int default 0, is_flagged bool default false, flag_reason text, status text check in ('approved','pending','rejected') default 'approved', confidence_score numeric, created_at timestamptz.
- `review_helpful_votes` — composite pk (review_id, user_id) so each user upvotes once.
- `user_roles` — separate table with `app_role` enum ('admin','user') and `has_role()` security-definer function (per security rules — never store roles on profiles).

**Storage**
- Public bucket `review-images`, RLS: authenticated users can insert into `{user_id}/...` path, anyone can read.

**Triggers / functions**
- `recalc_product_rating(product_id)` — recomputes `avg_rating`, `total_reviews`, `rating_breakdown` from `reviews` where `status='approved'`. Called by AFTER INSERT/UPDATE/DELETE trigger on reviews.
- `handle_new_user()` trigger to create profile row.

**RLS**
- `reviews`: anyone reads `status='approved'`; insert by authenticated user where `user_id = auth.uid()`; admins (`has_role(auth.uid(),'admin')`) can update/select all.
- `helpful_votes`: insert/delete own; read all.
- `products`: public read; admin write.

### 2. Server functions (`createServerFn`)
All in `src/lib/reviews.functions.ts`:
- `getProductReviews({ productSlug, sort })` — public, uses `supabaseAdmin`, returns approved reviews + product aggregates. Sort options: recent, highest, lowest, most_helpful.
- `submitReview({ productId, rating, title, text, imageUrls })` — auth-required. Runs **fake-review detection** before insert:
  1. Spam: count of user's reviews for product ≥ 3 → reject (status='rejected', confidence=1).
  2. Short + 5★: text < 15 chars and rating=5 → flag, confidence 0.7.
  3. Duplicate text: trigram similarity (`pg_trgm`) > 0.7 vs existing reviews same product → confidence 0.85.
  4. Burst: > 10 5★ reviews on product within last hour → flag confidence 0.6.
  5. Verified purchase: always false for now → "Unverified" badge.
  Final action: confidence > 0.8 → status='rejected' is_flagged=true; 0.5–0.8 → status='pending'; else 'approved'.
- `toggleHelpful({ reviewId })` — auth-required, upserts/deletes vote, recomputes count.
- `adminListFlagged()` / `adminSetReviewStatus({ id, status })` — guarded by `has_role(uid,'admin')`.

### 3. Frontend
- **Auth**: add `/login` and `/signup` routes (email + password + Google via Lovable broker). Wire `attachSupabaseAuth` in `src/start.ts`. Header shows Sign in / account menu.
- **Product page** (`product.$id.tsx`): replace static rating block with new `ReviewSection` component:
  - Aggregate header: big avg rating, star row, breakdown bars (animated width).
  - Sort dropdown.
  - Review cards: star row, verified/unverified badge, title, text, image thumbnail grid (max 3 + "+N"), date, helpful button.
  - Image lightbox reused from existing fullscreen viewer pattern.
  - "Write a review" button → opens dialog (or inline form for signed-in users; sign-in prompt otherwise).
- **Review form**: interactive star input (hover fill), title, textarea (min 10 chars), drag/drop image upload (max 5, 5MB, JPG/PNG/WEBP) with progress + thumbnails, zod validation, sonner toasts.
- **Home page** rating tile pulls live `avg_rating` / `total_reviews` for the seeded product.
- **Admin panel** at `/_authenticated/admin/reviews` (gated by `has_role`): table of pending/flagged reviews with Approve / Reject buttons.

### 4. Files to add / change
- New: `supabase/migrations/*` (schema + storage + roles + triggers), `src/lib/reviews.functions.ts`, `src/lib/review-detection.ts` (pure helpers), `src/components/reviews/ReviewSection.tsx`, `ReviewForm.tsx`, `StarRating.tsx`, `RatingBreakdown.tsx`, `ImageUploader.tsx`, `src/routes/login.tsx`, `signup.tsx`, `_authenticated.tsx`, `_authenticated/admin.reviews.tsx`.
- Edit: `src/routes/product.$id.tsx` (mount ReviewSection, drop hardcoded reviews), `src/routes/index.tsx` (live rating), `src/components/Header.tsx` (auth menu), `src/start.ts` (attachSupabaseAuth).

### 5. Out of scope (for this build)
- Linking past guest orders → "verified purchase" stays false until orders are tied to accounts.
- AI sentiment check (rule #6).
- Moderator role tier — only `admin` vs `user`.

Approve to proceed and I'll enable Lovable Cloud, run migrations, and build the UI in one pass.