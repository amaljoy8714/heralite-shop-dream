import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, ShoppingBag, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { useMyOrders } from "@/lib/orders-db";
import { useProducts } from "@/lib/products-db";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Your Orders · HeraLite" },
      { name: "description", content: "View your purchase history, reorder favorites, and download invoices." },
    ],
  }),
  component: OrdersPage,
});

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Pending payment",
  placed: "Placed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading } = useMyOrders(user?.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Your Orders</h1>
            <p className="text-sm text-muted-foreground">Purchase history & order details</p>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="font-display text-lg font-bold">Purchase history</h2>

          {authLoading || isLoading ? (
            <div className="mt-4 flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : !user ? (
            <div className="mt-4 rounded-2xl border-2 border-dashed border-primary/30 bg-card p-10 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-3 font-semibold">Sign in to view your orders</div>
              <p className="mt-1 text-sm text-muted-foreground">Or look up a guest order using your tracking number.</p>
              <div className="mt-5 flex justify-center gap-3">
                <Link to="/login" search={{ redirect: "/orders" }} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110">Sign in</Link>
                <Link to="/track" className="rounded-full border px-5 py-2.5 text-sm font-bold hover:bg-muted">Track an order</Link>
              </div>
            </div>
          ) : !orders?.length ? (
            <div className="mt-4 rounded-2xl border-2 border-dashed border-primary/30 bg-card p-10 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-3 font-semibold">No orders yet</div>
              <p className="mt-1 text-sm text-muted-foreground">Once you place an order, it'll show up here.</p>
              <Link to="/" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {orders.map((o) => (
                <Link
                  key={o.id}
                  to="/orders/$orderId"
                  params={{ orderId: o.id }}
                  className="block rounded-2xl border bg-card p-4 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <img src={o.order_items[0]?.image ?? ""} alt="" className="h-20 w-20 shrink-0 rounded-lg bg-secondary/40 object-contain p-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">{STATUS_LABEL[o.status] ?? o.status}</span>
                        <span className="text-xs text-muted-foreground">{new Date(o.placed_at).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-1 line-clamp-1 font-semibold">{o.order_items[0]?.title}{o.order_items.length > 1 && ` + ${o.order_items.length - 1} more`}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">Order <span className="font-mono">{o.order_number}</span> · ${(o.total_cents / 100).toFixed(2)}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <SuggestedProducts />
      </div>
      <Footer />
    </div>
  );
}

export function SuggestedProducts() {
  const { data: products } = useProducts();
  const picks = (products ?? []).slice(0, 4);
  if (!picks.length) return null;
  return (
    <section className="mt-12">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-bold">Suggested for you</h2>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {picks.map((p) => (
          <Link
            key={p.id}
            to="/product/$id"
            params={{ id: p.slug }}
            className="group rounded-xl border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-secondary/40 p-2">
              <img src={p.thumb} alt={p.name} className="h-full w-full object-contain transition-transform group-hover:scale-105" />
            </div>
            <div className="mt-2 line-clamp-2 text-xs font-semibold leading-tight">{p.name}</div>
            <div className="mt-1 text-sm font-bold text-primary">${(p.price_cents / 100).toFixed(2)}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
