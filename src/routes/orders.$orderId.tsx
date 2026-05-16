import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  ArrowLeft, ShoppingCart, Star, FileDown, ListChecks, CheckCircle2,
  Package, Truck, MapPin, Home, CreditCard, MessageSquare, Loader2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useOrder, type DbOrderStatus } from "@/lib/orders-db";
import { SuggestedProducts } from "./orders";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/$orderId")({
  head: () => ({ meta: [{ title: "Order Details · HeraLite" }] }),
  validateSearch: z.object({ paid: z.string().optional() }),
  component: OrderDetailsPage,
});

const STATUSES: DbOrderStatus[] = ["placed", "processing", "shipped", "out_for_delivery", "delivered"];
const LABEL: Record<DbOrderStatus, string> = {
  pending_payment: "Pending payment", placed: "Placed", processing: "Processing",
  shipped: "Shipped", out_for_delivery: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled",
};
const ICONS = {
  placed: CheckCircle2, processing: Package, shipped: Truck, out_for_delivery: MapPin, delivered: Home,
} as const;

function OrderDetailsPage() {
  const { orderId } = Route.useParams();
  const { paid } = Route.useSearch();
  const { data: order, isLoading } = useOrder(orderId);
  const add = useCart((s) => s.add);
  const navigate = useNavigate();
  const [tab, setTab] = useState<"details" | "invoice">("details");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <div className="flex justify-center p-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <div className="mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-2xl">Order not found</h1>
          <Link to="/orders" className="mt-4 inline-block text-primary underline">Back to your orders</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const buyAgain = (it: typeof order.order_items[number]) => {
    add({ id: it.product_id ?? it.title, title: it.title, price: it.unit_price_cents / 100, image: it.image ?? "" }, it.qty);
    toast.success("Added to cart");
    navigate({ to: "/checkout", search: {} });
  };

  const writeReview = () => {
    navigate({ to: "/product/$id", params: { id: "cloud-rain-humidifier" }, hash: "reviews" });
  };

  const downloadInvoice = async () => {
    // Lazy-load the invoice helper and adapt the DB order to its shape
    const mod = await import("@/lib/invoice");
    mod.downloadInvoicePdf({
      trackingNumber: order.tracking_number,
      orderId: order.order_number,
      customerName: order.full_name ?? "",
      email: order.email,
      address: String(order.shipping_address.line1 ?? ""),
      city: String(order.shipping_address.city ?? ""),
      state: String(order.shipping_address.state ?? ""),
      zip: String(order.shipping_address.zip ?? ""),
      items: order.order_items.map((i) => ({ title: i.title, qty: i.qty, price: i.unit_price_cents / 100, image: i.image ?? "" })),
      total: order.total_cents / 100,
      placedAt: new Date(order.placed_at).getTime(),
      status: "Placed",
      timeline: [],
      estimatedDelivery: order.estimated_delivery,
    });
  };

  const currentIdx = STATUSES.indexOf(order.status as DbOrderStatus);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        {paid === "1" && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
            <div className="font-bold text-emerald-700">🎉 Payment successful — your order is confirmed!</div>
            <div className="mt-1 text-emerald-700">Tracking number: <span className="font-mono font-bold">{order.tracking_number}</span></div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Order details</h1>
            <p className="text-sm text-muted-foreground">
              Order <span className="font-mono font-semibold">{order.order_number}</span> · Placed {new Date(order.placed_at).toLocaleDateString()}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">{LABEL[order.status as DbOrderStatus]}</span>
        </div>

        {/* 1. Product details */}
        <section className="mt-6 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-base font-bold">Product details</h2>
          <div className="mt-3 divide-y">
            {order.order_items.map((it) => (
              <div key={it.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                <img src={it.image ?? ""} alt="" className="h-20 w-20 shrink-0 rounded-lg bg-secondary/40 object-contain p-1" />
                <div className="flex-1 text-sm">
                  <div className="font-semibold">{it.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Qty {it.qty} · ${(it.unit_price_cents / 100).toFixed(2)}</div>
                </div>
                <button onClick={() => buyAgain(it)} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">
                  <ShoppingCart className="h-3.5 w-3.5" /> Buy again
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 2. How's your item */}
        <section className="mt-5 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-accent/30 to-secondary/30 p-5">
          <h2 className="font-display text-base font-bold">How's your item?</h2>
          <div className="mt-4 space-y-3">
            {order.order_items.map((it) => (
              <button key={it.id} onClick={writeReview} className="flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-white p-3 text-left hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md transition-all">
                <img src={it.image ?? ""} alt="" className="h-14 w-14 shrink-0 rounded-lg bg-secondary/40 object-contain p-1" />
                <div className="flex-1 text-sm">
                  <div className="line-clamp-1 font-semibold">{it.title}</div>
                  <div className="mt-1 flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
                  </div>
                </div>
                <span className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">Write review</span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Order info */}
        <section className="mt-5 rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
          <div className="flex border-b">
            <button onClick={() => setTab("details")} className={cn("flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-colors", tab === "details" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>
              <ListChecks className="h-4 w-4" /> Order details
            </button>
            <button onClick={() => { setTab("invoice"); downloadInvoice(); toast.success("Invoice downloading…"); }} className={cn("flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-colors", tab === "invoice" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>
              <FileDown className="h-4 w-4" /> Download invoice
            </button>
          </div>

          <div className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current position</h3>
            <div className="mt-4 flex items-start justify-between gap-2">
              {STATUSES.map((s, i) => {
                const Icon = ICONS[s as keyof typeof ICONS];
                const done = i <= currentIdx;
                return (
                  <div key={s} className="flex flex-1 flex-col items-center text-center">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-full border-2", done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground")}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className={cn("mt-2 text-[10px] font-semibold leading-tight", done ? "text-foreground" : "text-muted-foreground")}>{LABEL[s]}</div>
                  </div>
                );
              })}
            </div>

            {order.status === "delivered" && (
              <div className="mt-5 flex flex-wrap gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <button onClick={() => buyAgain(order.order_items[0])} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">
                  <ShoppingCart className="h-3.5 w-3.5" /> Buy again
                </button>
                <button onClick={writeReview} className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/5">
                  <MessageSquare className="h-3.5 w-3.5" /> Leave feedback
                </button>
              </div>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order summary</h3>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${(order.subtotal_cents / 100).toFixed(2)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{order.shipping_cents === 0 ? <span className="font-semibold text-emerald-600">FREE</span> : `$${(order.shipping_cents / 100).toFixed(2)}`}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd>${(order.tax_cents / 100).toFixed(2)}</dd></div>
                  <div className="flex justify-between border-t pt-2 font-bold"><dt>Total paid</dt><dd className="text-primary">${(order.total_cents / 100).toFixed(2)}</dd></div>
                </dl>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment method</h3>
                <div className="mt-3 flex items-center gap-3 rounded-xl border bg-secondary/30 p-3 text-sm">
                  <div className="flex h-10 w-14 items-center justify-center rounded-md bg-gradient-to-br from-[var(--primary-deep)] to-primary text-white">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold capitalize">{order.payment_method ?? "Card"}</div>
                    <div className="text-xs text-muted-foreground">Charged ${(order.total_cents / 100).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shipping address</h3>
              <div className="mt-2 rounded-xl border bg-secondary/20 p-3 text-sm">
                <div className="font-semibold">{order.full_name}</div>
                <div className="text-muted-foreground">{String(order.shipping_address.line1 ?? "")}</div>
                <div className="text-muted-foreground">{String(order.shipping_address.city ?? "")}, {String(order.shipping_address.state ?? "")} {String(order.shipping_address.zip ?? "")}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
              <div>
                <div className="font-semibold">Need a copy of your invoice?</div>
                <div className="text-xs text-muted-foreground">PDF · Order {order.order_number}</div>
              </div>
              <button onClick={downloadInvoice} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">
                <FileDown className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>
        </section>

        <SuggestedProducts />
      </div>
      <Footer />
    </div>
  );
}
