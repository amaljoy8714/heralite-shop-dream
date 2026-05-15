import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SortEnum = z.enum(["recent", "highest", "lowest", "helpful"]);

export const getProductReviews = createServerFn({ method: "POST" })
  .inputValidator((i: { productSlug: string; sort?: string }) =>
    z.object({ productSlug: z.string().min(1).max(120), sort: SortEnum.optional().default("recent") }).parse(i),
  )
  .handler(async ({ data }) => {
    const { data: product, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, slug, name, avg_rating, total_reviews, rating_breakdown")
      .eq("slug", data.productSlug)
      .maybeSingle();
    if (pErr) throw new Error(pErr.message);
    if (!product) return { product: null, reviews: [] };

    let q = supabaseAdmin
      .from("reviews")
      .select("id, rating, title, review_text, images, verified_purchase, helpful_count, created_at, user_id")
      .eq("product_id", product.id)
      .eq("status", "approved");

    if (data.sort === "highest") q = q.order("rating", { ascending: false }).order("created_at", { ascending: false });
    else if (data.sort === "lowest") q = q.order("rating", { ascending: true }).order("created_at", { ascending: false });
    else if (data.sort === "helpful") q = q.order("helpful_count", { ascending: false }).order("created_at", { ascending: false });
    else q = q.order("created_at", { ascending: false });

    const { data: reviews, error: rErr } = await q.limit(200);
    if (rErr) throw new Error(rErr.message);

    const userIds = Array.from(new Set((reviews ?? []).map((r) => r.user_id)));
    const profiles = userIds.length
      ? (await supabaseAdmin.from("profiles").select("id, display_name, avatar_url").in("id", userIds)).data ?? []
      : [];
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    return {
      product,
      reviews: (reviews ?? []).map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        text: r.review_text,
        images: (r.images as string[]) ?? [],
        verified: r.verified_purchase,
        helpful: r.helpful_count,
        createdAt: r.created_at,
        author: profileMap.get(r.user_id)?.display_name ?? "Anonymous",
        avatar: profileMap.get(r.user_id)?.avatar_url ?? null,
      })),
    };
  });

const SubmitSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(120),
  text: z.string().trim().min(10).max(4000),
  imageUrls: z.array(z.string().url()).max(5).default([]),
});

export const submitReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => SubmitSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const reasons: string[] = [];
    let confidence = 0;

    // Rule 2: spam — 3+ reviews from same user on same product
    const { count: existingCount } = await supabaseAdmin
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("product_id", data.productId)
      .eq("user_id", userId);
    if ((existingCount ?? 0) >= 3) {
      return { ok: false as const, error: "You've already submitted the maximum reviews for this product." };
    }

    // Rule 5: short + 5★
    if (data.text.length < 15 && data.rating === 5) {
      reasons.push("short_high_rating");
      confidence = Math.max(confidence, 0.7);
    }

    // Rule 1: duplicate text — bigram similarity vs recent reviews
    {
      const { data: recent } = await supabaseAdmin
        .from("reviews")
        .select("review_text")
        .eq("product_id", data.productId)
        .order("created_at", { ascending: false })
        .limit(50);
      const lower = data.text.toLowerCase();
      const isDup = (recent ?? []).some((r) => similarity(lower, (r.review_text ?? "").toLowerCase()) > 0.7);
      if (isDup) {
        reasons.push("duplicate_text");
        confidence = Math.max(confidence, 0.85);
      }
    }

    // Rule 3: 5★ burst — >10 5★ reviews on this product in last hour
    if (data.rating === 5) {
      const since = new Date(Date.now() - 3600 * 1000).toISOString();
      const { count: burst } = await supabaseAdmin
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("product_id", data.productId)
        .eq("rating", 5)
        .gte("created_at", since);
      if ((burst ?? 0) > 10) {
        reasons.push("burst_5_star");
        confidence = Math.max(confidence, 0.6);
      }
    }

    // Status decision
    let status: "approved" | "pending" | "rejected" = "approved";
    let isFlagged = false;
    if (confidence > 0.8) {
      status = "rejected";
      isFlagged = true;
    } else if (confidence >= 0.5) {
      status = "pending";
      isFlagged = true;
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        product_id: data.productId,
        user_id: userId,
        rating: data.rating,
        title: data.title,
        review_text: data.text,
        images: data.imageUrls,
        verified_purchase: false,
        status,
        is_flagged: isFlagged,
        flag_reason: reasons.join(",") || null,
        confidence_score: confidence,
      })
      .select("id, status")
      .single();
    if (error) throw new Error(error.message);

    return { ok: true as const, status: inserted.status, flagged: isFlagged, reasons };
  });

export const toggleHelpful = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { reviewId: string }) => z.object({ reviewId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: existing } = await supabaseAdmin
      .from("review_helpful_votes")
      .select("review_id")
      .eq("review_id", data.reviewId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin.from("review_helpful_votes").delete().eq("review_id", data.reviewId).eq("user_id", userId);
    } else {
      await supabaseAdmin.from("review_helpful_votes").insert({ review_id: data.reviewId, user_id: userId });
    }
    const { data: row } = await supabaseAdmin.from("reviews").select("helpful_count").eq("id", data.reviewId).single();
    return { helpful: row?.helpful_count ?? 0, voted: !existing };
  });

export const getMyHelpfulVotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { reviewIds: string[] }) =>
    z.object({ reviewIds: z.array(z.string().uuid()).max(500) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    if (!data.reviewIds.length) return { voted: [] as string[] };
    const { data: rows } = await supabaseAdmin
      .from("review_helpful_votes")
      .select("review_id")
      .in("review_id", data.reviewIds)
      .eq("user_id", context.userId);
    return { voted: (rows ?? []).map((r) => r.review_id) };
  });

export const adminListReviews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    const { data } = await supabaseAdmin
      .from("reviews")
      .select("id, product_id, user_id, rating, title, review_text, status, is_flagged, flag_reason, confidence_score, created_at")
      .neq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(200);
    return { reviews: data ?? [] };
  });

export const adminSetReviewStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; status: "approved" | "rejected" }) =>
    z.object({ id: z.string().uuid(), status: z.enum(["approved", "rejected"]) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    const { error } = await supabaseAdmin
      .from("reviews")
      .update({ status: data.status, is_flagged: data.status === "rejected" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

// Lightweight bigram similarity (Dice coefficient)
function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const bigrams = (s: string) => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      m.set(g, (m.get(g) ?? 0) + 1);
    }
    return m;
  };
  const ma = bigrams(a);
  const mb = bigrams(b);
  let inter = 0;
  for (const [k, v] of ma) {
    const w = mb.get(k);
    if (w) inter += Math.min(v, w);
  }
  return (2 * inter) / (a.length - 1 + b.length - 1);
}
