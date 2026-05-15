import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitReview } from "@/lib/reviews.functions";
import { StarInput } from "./StarRating";
import { ImageUploader } from "./ImageUploader";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function ReviewForm({
  productId,
  userId,
  onSubmitted,
  onCancel,
}: {
  productId: string;
  userId: string;
  onSubmitted: () => void;
  onCancel: () => void;
}) {
  const submit = useServerFn(submitReview);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating");
    if (text.trim().length < 10) return toast.error("Review must be at least 10 characters");
    if (title.trim().length < 3) return toast.error("Add a short title");
    setBusy(true);
    try {
      const res = await submit({ data: { productId, rating, title: title.trim(), text: text.trim(), imageUrls } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      if (res.status === "approved") toast.success("Review posted!");
      else if (res.status === "pending") toast.info("Review submitted — awaiting moderation.");
      else toast.warning("Review flagged and rejected.");
      onSubmitted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={send} className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div>
        <label className="mb-2 block text-sm font-semibold">Your rating *</label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold">Title *</label>
        <input
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarise your experience"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold">Your review *</label>
        <textarea
          rows={5}
          maxLength={4000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell others what you liked, what could be better…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <p className="mt-1 text-xs text-muted-foreground">{text.length}/4000 · min 10 characters</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Photos (optional)</label>
        <ImageUploader urls={imageUrls} onChange={setImageUrls} userId={userId} />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-[var(--primary-deep)] py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Submit review
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-lg border border-border bg-background px-4 text-sm font-semibold transition hover:bg-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
