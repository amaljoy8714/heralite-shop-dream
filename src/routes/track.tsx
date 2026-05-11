import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PackageSearch, CheckCircle2, Truck, Package, MapPin, Home, Copy } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useOrders, type Order, type OrderStatus } from "@/lib/orders";
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

const STATUSES: OrderStatus[] = ["Placed", "Processing", "Shipped", "Out for delivery", "Delivered"];

const ICONS: Record<OrderStatus, typeof Package> = {
  Placed: CheckCircle2,
  Processing: Package,
  Shipped: Truck,
  "Out for delivery": MapPin,
  Delivered: Home,
};

function TrackPage() {
  const search = Route.useSearch();
  const [input, setInput] = useState(search.tn ?? "");
  const [query, setQuery] = useState(search.tn ?? "");
  const order = useOrders((s) => s.orders.find((o) => o.trackingNumber.toUpperCase() === query.toUpperCase()));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(input.trim());
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
          <p className="mt-2 text-sm text-muted-foreground">Enter the tracking number we sent to your email to see real-time updates.</p>
        </div>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. HL-XXXXX-XXXXXX"
            className="h-12 flex-1 rounded-full border bg-card px-5 text-sm font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button type="submit" className="h-12 rounded-full bg-primary px-8 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">
            Track
          </button>
        </form>

        {query && !order && (
          <div className="mt-8 rounded-xl border-2 border-dashed border-destructive/40 bg-destructive/5 p-6 text-center">
            <div className="font-semibold text-destructive">No order found</div>
            <p className="mt-1 text-sm text-muted-foreground">Double-check the tracking number. Orders placed on this device are saved locally for tracking.</p>
          </div>
        )}

        {order && <OrderView order={order} />}

        {!query && (
          <div className="mt-8 rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
            <p>Don’t have a tracking number? <Link to="/" className="font-semibold text-primary hover:underline">Start shopping →</Link></p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function OrderView({ order }: { order: Order }) {
  const currentIdx = STATUSES.indexOf(order.status);
  const copyTn = async () => {
    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      toast.success("Tracking number copied!");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-accent/40 via-white to-secondary/30 p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Tracking</div>
            <div className="mt-1 font-mono text-lg font-bold text-[var(--primary-deep)]">{order.trackingNumber}</div>
          </div>
          <button onClick={copyTn} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        </div>
        <div className="mt-4 text-sm">
          <span className="font-semibold">Status:</span>{" "}
          <span className="font-bold text-primary">{order.status}</span>
          <span className="mx-2 text-muted-foreground">·</span>
          <span className="text-muted-foreground">ETA {order.estimatedDelivery}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="font-display text-lg font-bold">Shipment progress</h2>
        <div className="mt-6 flex items-start justify-between gap-2">
          {STATUSES.map((s, i) => {
            const Icon = ICONS[s];
            const done = i <= currentIdx;
            return (
              <div key={s} className="flex flex-1 flex-col items-center text-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className={`mt-2 text-[10px] font-semibold leading-tight md:text-xs ${done ? "text-foreground" : "text-muted-foreground"}`}>{s}</div>
                {i < STATUSES.length - 1 && (
                  <div className={`-z-10 mt-[-22px] hidden h-0.5 w-full ${i < currentIdx ? "bg-primary" : "bg-border"} sm:block`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Details */}
      <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="font-display text-lg font-bold">Order details</h2>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div><span className="text-muted-foreground">Order ID:</span> <span className="font-mono font-semibold">{order.orderId}</span></div>
          <div><span className="text-muted-foreground">Placed:</span> <span className="font-semibold">{new Date(order.placedAt).toLocaleString()}</span></div>
          <div><span className="text-muted-foreground">Customer:</span> <span className="font-semibold">{order.customerName}</span></div>
          <div><span className="text-muted-foreground">Total:</span> <span className="font-semibold text-primary">${order.total.toFixed(2)}</span></div>
          <div className="sm:col-span-2"><span className="text-muted-foreground">Shipping to:</span> <span className="font-semibold">{order.address}, {order.city}, {order.state} {order.zip}</span></div>
        </div>
        <div className="mt-5 divide-y">
          {order.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <img src={it.image} alt="" className="h-14 w-14 rounded-md object-cover" />
              <div className="flex-1 text-sm">
                <div className="line-clamp-2 font-medium">{it.title}</div>
                <div className="text-xs text-muted-foreground">Qty {it.qty} · ${it.price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
