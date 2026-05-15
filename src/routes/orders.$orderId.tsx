import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, ShoppingCart, Star, FileDown, ListChecks, CheckCircle2,
  Package, Truck, MapPin, Home, CreditCard, MessageSquare,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useOrders, type OrderStatus } from "@/lib/orders";
import { useCart } from "@/lib/cart";
import { downloadInvoicePdf } from "@/lib/invoice";
import { mainProduct } from "@/lib/products";
import { SuggestedProducts } from "./orders";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/$orderId")({
  head: () => ({
    meta: [{ title: "Order Details · HeraLite" }],
  }),
  component: OrderDetailsPage,
});

const STATUSES: OrderStatus[] = ["Placed", "Processing", "Shipped", "Out for delivery", "Delivered"];
const ICONS: Record<OrderStatus, typeof Package> = {
  Placed: CheckCircle2, Processing: Package, Shipped: Truck, "Out for delivery": MapPin, Delivered: Home,
};

function OrderDetailsPage() {
  const { orderId } = Route.useParams();
  const order = useOrders((s) => s.orders.find((o) => o.orderId === orderId));
  const add = useCart((s) => s.add);
  const navigate = useNavigate();
  const [tab, setTab] = useState<"details" | "invoice">("details");

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-3xl p-10 text-center">
          <h1 className="font-display text-2xl">Order not found</h1>
          <Link to="/orders" className="mt-4 inline-block text-primary underline">Back to your orders</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const buyAgain = (it: typeof order.items[number]) => {
    add({ id: mainProduct.id, title: it.title, price: it.price, image: it.image }, it.qty);
    toast.success("Added to cart");
    navigate({ to: "/checkout" });
  };

  const writeReview = () => {
    navigate({ to: "/product/$id", params: { id: mainProduct.id }, hash: "reviews" });
  };

  const currentIdx = STATUSES.indexOf(order.status);
  const subtotal = order.items.reduce((a, i) => a + i.price * i.qty, 0);
  const tax = +(subtotal * 0.07).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Order details</h1>
            <p className="text-sm text-muted-foreground">
              Order <span className="font-mono font-semibold">{order.orderId}</span> · Placed {new Date(order.placedAt).toLocaleDateString()}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">{order.status}</span>
        </div>

        {/* 1. Product details */}
        <section className="mt-6 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="font-display text-base font-bold">Product details</h2>
          <div className="mt-3 divide-y">
            {order.items.map((it, i) => (
              <div key={i} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                <img src={it.image} alt="" className="h-20 w-20 shrink-0 rounded-lg bg-secondary/40 object-contain p-1" />
                <div className="flex-1 text-sm">
                  <div className="font-semibold">{it.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Qty {it.qty} · ${it.price.toFixed(2)}</div>
                </div>
                <button
                  onClick={() => buyAgain(it)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> Buy again
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 2. How's your item? */}
        <section className="mt-5 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-accent/30 to-secondary/30 p-5">
          <h2 className="font-display text-base font-bold">How's your item?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Share your experience with other shoppers.</p>
          <div className="mt-4 space-y-3">
            {order.items.map((it, i) => (
              <button
                key={i}
                onClick={writeReview}
                className="flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <img src={it.image} alt="" className="h-14 w-14 shrink-0 rounded-lg bg-secondary/40 object-contain p-1" />
                <div className="flex-1 text-sm">
                  <div className="line-clamp-1 font-semibold">{it.title}</div>
                  <div className="mt-1 flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
                  </div>
                </div>
                <span className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                  Write review
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Order info — tabs */}
        <section className="mt-5 rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
          <div className="flex border-b">
            <button
              onClick={() => setTab("details")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-colors",
                tab === "details" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ListChecks className="h-4 w-4" /> Order details
            </button>
            <button
              onClick={() => { setTab("invoice"); downloadInvoicePdf(order); toast.success("Invoice downloading…"); }}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-colors",
                tab === "invoice" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileDown className="h-4 w-4" /> Download invoice
            </button>
          </div>

          <div className="p-5">
            {/* Timeline */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current position</h3>
            <div className="mt-4 flex items-start justify-between gap-2">
              {STATUSES.map((s, i) => {
                const Icon = ICONS[s];
                const done = i <= currentIdx;
                return (
                  <div key={s} className="flex flex-1 flex-col items-center text-center">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2",
                      done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className={cn("mt-2 text-[10px] font-semibold leading-tight", done ? "text-foreground" : "text-muted-foreground")}>
                      {s}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivered actions */}
            {order.status === "Delivered" && (
              <div className="mt-5 flex flex-wrap gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <button
                  onClick={() => buyAgain(order.items[0])}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> Buy again
                </button>
                <button
                  onClick={writeReview}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/5"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Leave feedback
                </button>
              </div>
            )}

            {/* Order summary */}
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order summary</h3>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className="text-emerald-600 font-semibold">FREE</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Tax (7%)</dt><dd>${tax.toFixed(2)}</dd></div>
                  <div className="flex justify-between border-t pt-2 font-bold"><dt>Total paid</dt><dd className="text-primary">${order.total.toFixed(2)}</dd></div>
                </dl>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment method</h3>
                <div className="mt-3 flex items-center gap-3 rounded-xl border bg-secondary/30 p-3 text-sm">
                  <div className="flex h-10 w-14 items-center justify-center rounded-md bg-gradient-to-br from-[var(--primary-deep)] to-primary text-white">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Card ending •••• 4242</div>
                    <div className="text-xs text-muted-foreground">Charged ${order.total.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shipping address</h3>
              <div className="mt-2 rounded-xl border bg-secondary/20 p-3 text-sm">
                <div className="font-semibold">{order.customerName}</div>
                <div className="text-muted-foreground">{order.address}</div>
                <div className="text-muted-foreground">{order.city}, {order.state} {order.zip}</div>
                <div className="text-muted-foreground">United States</div>
              </div>
            </div>

            {/* Invoice download */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
              <div>
                <div className="font-semibold">Need a copy of your invoice?</div>
                <div className="text-xs text-muted-foreground">PDF · Order {order.orderId}</div>
              </div>
              <button
                onClick={() => { downloadInvoicePdf(order); toast.success("Invoice downloading…"); }}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110"
              >
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
