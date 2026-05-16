import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PackageSearch, CheckCircle2, Truck, Package, MapPin, Home, Copy, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { trackOrderPublic, type DbOrder, type DbOrderStatus } from "@/lib/orders-db";
import { toast } from "sonner";

const searchSchema = z.object({ tn: z.string().optional() });

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Order · HeraLite" },
      { name: "description", content: "Enter your HeraLite tracking number to see real-time order status." },
    ],
  }),
  validateSearch: searchSchema,
  component: TrackPage,
});

const STATUSES: DbOrderStatus[] = ["placed", "processing", "shipped", "out_for_delivery", "delivered"];
const LABEL: Record<string, string> = {
  pending_payment: "Pending payment", placed: "Placed", processing: "Processing",
  shipped: "Shipped", out_for_delivery: "Out for delivery", delivered: "Delivered",
};
const ICONS = { placed: CheckCircle2, processing: Package, shipped: Truck, out_for_delivery: MapPin, delivered: Home } as const;

function TrackPage() {
  const search = Route.useSearch();
  const [tn, setTn] = useState(search.tn ?? "");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<DbOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setOrder(null);
    try {
      const o = await trackOrderPublic(tn.trim(), email.trim());
      setOrder(o);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <PackageSearch className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">Track Your Order</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your tracking number and email to see real-time updates.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <input value={tn} onChange={(e) => setTn(e.target.value)} placeholder="Tracking · HL-XXXXX-XXXXXX"
            className="h-12 w-full rounded-full border bg-card px-5 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email used on the order"
            className="h-12 w-full rounded-full border bg-card px-5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button type="submit" disabled={loading} className="h-12 w-full rounded-full bg-primary px-8 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110 disabled:opacity-50">
            {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Track"}
          </button>
        </form>

        {error && (
          <div className="mt-8 rounded-xl border-2 border-dashed border-destructive/40 bg-destructive/5 p-6 text-center">
            <div className="font-semibold text-destructive">{error}</div>
          </div>
        )}

        {order && <OrderView order={order} />}

        {!order && !error && (
          <div className="mt-8 rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
            <p>Don't have a tracking number? <Link to="/" className="font-semibold text-primary hover:underline">Start shopping →</Link></p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function OrderView({ order }: { order: DbOrder }) {
  const currentIdx = STATUSES.indexOf(order.status as DbOrderStatus);
  const copyTn = async () => {
    try { await navigator.clipboard.writeText(order.tracking_number); toast.success("Tracking number copied!"); }
    catch { toast.error("Copy failed"); }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-accent/40 via-white to-secondary/30 p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Tracking</div>
            <div className="mt-1 font-mono text-lg font-bold text-[var(--primary-deep)]">{order.tracking_number}</div>
          </div>
          <button onClick={copyTn} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        </div>
        <div className="mt-4 text-sm">
          <span className="font-semibold">Status:</span>{" "}
          <span className="font-bold text-primary">{LABEL[order.status] ?? order.status}</span>
          <span className="mx-2 text-muted-foreground">·</span>
          <span className="text-muted-foreground">ETA {order.estimated_delivery}</span>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="font-display text-lg font-bold">Shipment progress</h2>
        <div className="mt-6 flex items-start justify-between gap-2">
          {STATUSES.map((s, i) => {
            const Icon = ICONS[s as keyof typeof ICONS];
            const done = i <= currentIdx;
            return (
              <div key={s} className="flex flex-1 flex-col items-center text-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className={`mt-2 text-[10px] font-semibold leading-tight md:text-xs ${done ? "text-foreground" : "text-muted-foreground"}`}>{LABEL[s]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {order.order_items && (
        <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-lg font-bold">Order details</h2>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div><span className="text-muted-foreground">Order:</span> <span className="font-mono font-semibold">{order.order_number}</span></div>
            <div><span className="text-muted-foreground">Placed:</span> <span className="font-semibold">{new Date(order.placed_at).toLocaleString()}</span></div>
            <div><span className="text-muted-foreground">Total:</span> <span className="font-semibold text-primary">${(order.total_cents / 100).toFixed(2)}</span></div>
          </div>
          <div className="mt-5 divide-y">
            {order.order_items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 py-3">
                <img src={it.image ?? ""} alt="" className="h-14 w-14 rounded-md object-cover" />
                <div className="flex-1 text-sm">
                  <div className="line-clamp-2 font-medium">{it.title}</div>
                  <div className="text-xs text-muted-foreground">Qty {it.qty} · ${(it.unit_price_cents / 100).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
