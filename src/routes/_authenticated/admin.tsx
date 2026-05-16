import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useMyOrders } from "@/lib/orders-db";
import { useAuth } from "@/lib/auth";
import { useProducts } from "@/lib/products-db";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

const STATUSES = ["placed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

function AdminPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"orders" | "products">("orders");

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  if (isAdmin === null) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <div className="mx-auto max-w-md p-10 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 font-display text-2xl font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your account doesn't have admin privileges.</p>
          <Link to="/" className="mt-4 inline-block text-primary underline">Back to shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background"><Header />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <div className="mt-6 flex gap-2 border-b">
          {(["orders", "products"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-bold capitalize ${tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
          <Link to="/admin/reviews" className="ml-auto px-4 py-2 text-sm font-bold text-muted-foreground hover:text-primary">Reviews →</Link>
        </div>
        {tab === "orders" ? <AdminOrders /> : <AdminProducts />}
      </div>
      <Footer />
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    supabase.from("orders").select("*, order_items(*)").order("placed_at", { ascending: false }).limit(100)
      .then(({ data }) => { setOrders(data ?? []); setLoading(false); });
  };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ order_id: id, status }),
    });
    if (res.ok) { toast.success("Updated"); load(); }
    else toast.error("Update failed");
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="mt-6 space-y-3">
      {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
      {orders.map((o) => (
        <div key={o.id} className="rounded-xl border bg-card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1">
              <div className="font-mono text-xs font-bold text-primary">{o.order_number}</div>
              <div className="text-sm font-semibold">{o.full_name} · {o.email}</div>
              <div className="text-xs text-muted-foreground">{new Date(o.placed_at).toLocaleString()} · ${(o.total_cents / 100).toFixed(2)} · {o.order_items?.length} items</div>
              <div className="text-xs text-muted-foreground">Tracking: <span className="font-mono">{o.tracking_number}</span></div>
            </div>
            <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="rounded-md border bg-background px-3 py-1.5 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminProducts() {
  const { data: products, refetch } = useProducts();

  const toggle = async (id: string, field: "active" | "in_stock", current: boolean) => {
    const { error } = await supabase.from("products").update({ [field]: !current }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); refetch(); }
  };

  const updatePrice = async (id: string, priceCents: number) => {
    const { error } = await supabase.from("products").update({ price_cents: priceCents }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Price updated"); refetch(); }
  };

  const updateStock = async (id: string, stock: number) => {
    const { error } = await supabase.from("products").update({ stock }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Stock updated"); refetch(); }
  };

  return (
    <div className="mt-6 space-y-3">
      {(products ?? []).map((p) => (
        <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
          <img src={p.thumb} alt="" className="h-16 w-16 rounded-lg bg-secondary/40 object-contain p-1" />
          <div className="min-w-0 flex-1">
            <div className="line-clamp-1 font-semibold">{p.name}</div>
            <div className="text-xs text-muted-foreground">{p.slug}</div>
          </div>
          <label className="text-xs">
            <span className="block text-muted-foreground">Price ($)</span>
            <input type="number" step="0.01" defaultValue={(p.price_cents / 100).toFixed(2)}
              onBlur={(e) => updatePrice(p.id, Math.round(parseFloat(e.target.value) * 100))}
              className="w-24 rounded border px-2 py-1 text-sm" />
          </label>
          <label className="text-xs">
            <span className="block text-muted-foreground">Stock</span>
            <input type="number" defaultValue={p.stock}
              onBlur={(e) => updateStock(p.id, parseInt(e.target.value, 10) || 0)}
              className="w-20 rounded border px-2 py-1 text-sm" />
          </label>
          <button onClick={() => toggle(p.id, "active", p.active)} className={`rounded-full px-3 py-1 text-xs font-bold ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
            {p.active ? "Active" : "Inactive"}
          </button>
          <button onClick={() => toggle(p.id, "in_stock", p.in_stock)} className={`rounded-full px-3 py-1 text-xs font-bold ${p.in_stock ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            {p.in_stock ? "In stock" : "Sold out"}
          </button>
        </div>
      ))}
    </div>
  );
}
