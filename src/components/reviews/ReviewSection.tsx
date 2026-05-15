import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getProductReviews, toggleHelpful, getMyHelpfulVotes } from "@/lib/reviews.functions";
import { useAuth } from "@/lib/auth";
import { StarRow } from "./StarRating";
import { RatingBreakdown } from "./RatingBreakdown";
import { ReviewForm } from "./ReviewForm";
import { ThumbsUp, ShieldCheck, BadgeAlert, X, ChevronLeft, ChevronRight, Loader2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  rating: number;
  title: string;
  text: string;
  images: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
  author: string;
  avatar: string | null;
};

type SortKey = "recent" | "highest" | "lowest" | "helpful";

export function ReviewSection({ productSlug }: { productSlug: string }) {
  const fetchReviews = useServerFn(getProductReviews);
  const vote = useServerFn(toggleHelpful);
  const myVotes = useServerFn(getMyHelpfulVotes);
  const { user } = useAuth();

  const [sort, setSort] = useState<SortKey>("recent");
  const [data, setData] = useState<{ product: { id: string; avg_rating: number; total_reviews: number; rating_breakdown: Record<string, number> } | null; reviews: Review[] }>({
    product: null,
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetchReviews({ data: { productSlug, sort } });
      setData(res);
      if (user && res.reviews.length) {
        const v = await myVotes({ data: { reviewIds: res.reviews.map((r) => r.id) } });
        setVoted(new Set(v.voted));
      } else {
        setVoted(new Set());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, productSlug, user?.id]);

  const product = data.product;
  const sortedVerifiedFirst = useMemo(() => {
    return [...data.reviews].sort((a, b) => Number(b.verified) - Number(a.verified));
  }, [data.reviews]);

  const handleVote = async (id: string) => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }
    try {
      const res = await vote({ data: { reviewId: id } });
      setData((d) => ({ ...d, reviews: d.reviews.map((r) => (r.id === id ? { ...r, helpful: res.helpful } : r)) }));
      setVoted((s) => {
        const ns = new Set(s);
        if (res.voted) ns.add(id);
        else ns.delete(id);
        return ns;
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Customer Reviews</h2>
        {user ? (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-[var(--primary-deep)] px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <MessageSquarePlus className="h-4 w-4" />
            {showForm ? "Close" : "Write a review"}
          </button>
        ) : (
          <Link
            to="/login"
            search={{ redirect: typeof window !== "undefined" ? window.location.pathname : "/" }}
            className="rounded-lg border border-primary/30 bg-secondary/60 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-secondary"
          >
            Sign in to write a review
          </Link>
        )}
      </div>

      {showForm && user && product && (
        <div className="mb-6">
          <ReviewForm
            productId={product.id}
            userId={user.id}
            onCancel={() => setShowForm(false)}
            onSubmitted={() => {
              setShowForm(false);
              refresh();
            }}
          />
        </div>
      )}

      {/* Aggregate */}
      <div className="grid gap-6 rounded-2xl border border-border bg-gradient-to-br from-secondary/30 to-accent/20 p-6 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="font-display text-5xl font-bold text-[var(--primary-deep)]">
            {(product?.avg_rating ?? 0).toFixed(1)}
          </div>
          <StarRow value={product?.avg_rating ?? 0} size={20} className="mt-2" />
          <p className="mt-1 text-sm text-muted-foreground">
            Based on {product?.total_reviews ?? 0} review{(product?.total_reviews ?? 0) === 1 ? "" : "s"}
          </p>
        </div>
        <RatingBreakdown
          breakdown={(product?.rating_breakdown ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }) as Record<string, number>}
          total={product?.total_reviews ?? 0}
        />
      </div>

      {/* Sort */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">
          {data.reviews.length} review{data.reviews.length === 1 ? "" : "s"}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:border-primary"
        >
          <option value="recent">Most recent</option>
          <option value="highest">Highest rated</option>
          <option value="lowest">Lowest rated</option>
          <option value="helpful">Most helpful</option>
        </select>
      </div>

      {/* List */}
      <div className="mt-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : sortedVerifiedFirst.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No reviews yet. Be the first to share your experience.
          </div>
        ) : (
          sortedVerifiedFirst.map((r) => (
            <article key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]">
              <header className="flex flex-wrap items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[var(--primary-deep)] text-sm font-bold text-primary-foreground">
                  {r.author.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{r.author}</span>
                    {r.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                        <ShieldCheck className="h-3 w-3" /> Verified Purchase
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        <BadgeAlert className="h-3 w-3" /> Unverified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <StarRow value={r.rating} size={12} />
                    <span>·</span>
                    <span>{new Date(r.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                  </div>
                </div>
              </header>

              <h3 className="mt-3 font-semibold">{r.title}</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-foreground/80">{r.text}</p>

              {r.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.images.slice(0, 3).map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setLightbox({ images: r.images, index: i })}
                      className="relative h-20 w-20 overflow-hidden rounded-md border border-border transition hover:opacity-90"
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                  {r.images.length > 3 && (
                    <button
                      onClick={() => setLightbox({ images: r.images, index: 3 })}
                      className="flex h-20 w-20 items-center justify-center rounded-md border border-border bg-muted text-sm font-semibold text-foreground/70 transition hover:bg-secondary"
                    >
                      +{r.images.length - 3}
                    </button>
                  )}
                </div>
              )}

              <footer className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => handleVote(r.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    voted.has(r.id)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground/70 hover:border-primary hover:text-primary",
                  )}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Helpful ({r.helpful})
                </button>
              </footer>
            </article>
          ))
        )}
      </div>

      {/* Image lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 hover:bg-white/20"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="flex flex-1 items-center justify-center" style={{ touchAction: "pinch-zoom" }} onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.images[lightbox.index]} alt="" className="max-h-full max-w-full object-contain" style={{ touchAction: "pinch-zoom" }} />
          </div>
          {lightbox.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((l) => l && { ...l, index: (l.index - 1 + l.images.length) % l.images.length }); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox((l) => l && { ...l, index: (l.index + 1) % l.images.length }); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}
          <div className="pb-6 pt-3 text-center text-xs text-white/60">
            {lightbox.index + 1} / {lightbox.images.length}
          </div>
        </div>
      )}
    </section>
  );
}
