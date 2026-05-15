import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListReviews, adminSetReviewStatus, checkIsAdmin } from "@/lib/reviews.functions";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StarRow } from "@/components/reviews/StarRating";
import { Check, X, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviews,
});

type Row = {
  id: string;
  rating: number;
  title: string;
  review_text: string;
  status: string;
  is_flagged: boolean;
  flag_reason: string | null;
  confidence_score: number;
  created_at: string;
};

function AdminReviews() {
  const list = useServerFn(adminListReviews);
  const set = useServerFn(adminSetReviewStatus);
  const checkAdmin = useServerFn(checkIsAdmin);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const refresh = async () => {
    try {
      const r = await list({ data: undefined as never });
      setRows(r.reviews as Row[]);
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin({ data: undefined as never }).then((r) => {
      setIsAdmin(r.isAdmin);
      if (r.isAdmin) refresh();
      else setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const act = async (id: string, status: "approved" | "rejected") => {
    try {
      await set({ data: { id, status } });
      toast.success(status === "approved" ? "Approved" : "Rejected");
      setRows((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <h1 className="font-display text-3xl font-bold">Review moderation</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pending and flagged reviews awaiting decision.</p>

        {loading ? (
          <div className="mt-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : isAdmin === false ? (
          <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 text-destructive" />
            <p className="mt-2 font-semibold">Admin access required</p>
            <p className="mt-1 text-sm text-muted-foreground">Your account doesn't have moderation permissions.</p>
            <Link to="/" className="mt-4 inline-block text-sm text-primary underline">Back home</Link>
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            No pending reviews. 🎉
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <div className="flex flex-wrap items-center gap-3">
                  <StarRow value={r.rating} />
                  <span className="font-semibold">{r.title}</span>
                  <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    {r.status} · confidence {Math.round(r.confidence_score * 100)}%
                  </span>
                </div>
                {r.flag_reason && (
                  <p className="mt-2 text-xs text-destructive">Flags: {r.flag_reason}</p>
                )}
                <p className="mt-3 text-sm text-foreground/80">{r.review_text}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => act(r.id, "approved")}
                    className="flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => act(r.id, "rejected")}
                    className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
