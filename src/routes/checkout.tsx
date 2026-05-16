import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Trash2, Minus, Plus, ShieldCheck, Lock, Crown, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart, cartTotal } from "@/lib/cart";
import { createCheckoutSession } from "@/lib/orders-db";
import { toast } from "sonner";

const searchSchema = z.object({
  step: z.enum(["cart", "address", "payment"]).optional(),
  cancelled: z.string().optional(),
});

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout · HeraLite" },
      { name: "description", content: "Secure checkout for your HeraLite order." },
    ],
  }),
  validateSearch: searchSchema,
  component: CheckoutPage,
});

const addressSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().regex(/^[\d\s\-()+]{7,20}$/, "Enter a valid phone"),
  email: z.string().trim().email("Enter a valid email").max(255),
  address: z.string().trim().min(5, "Full address required").max(300),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2, "Enter state").max(80),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a valid US ZIP"),
});

type AddressForm = z.infer<typeof addressSchema>;
type Step = "cart" | "address" | "payment";

function CheckoutPage() {
  const search = Route.useSearch();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>((search.step as Step) ?? "cart");
  const [form, setForm] = useState<AddressForm>({ name: "", phone: "", email: "", address: "", city: "", state: "", zip: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});
  const [loading, setLoading] = useState(false);

  const subtotal = cartTotal(items);
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const submitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addressSchema.safeParse(form);
    if (!result.success) {
      const errs: Partial<Record<keyof AddressForm, string>> = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as keyof AddressForm] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep("payment");
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await createCheckoutSession({
        items: items.map((i) => ({ slug: i.id, qty: i.qty })),
        email: form.email,
        full_name: form.name,
        phone: form.phone,
        shipping_address: {
          line1: form.address, city: form.city, state: form.state, zip: form.zip, country: "US",
        },
      });
      clear();
      if (res.mode === "stripe") {
        window.location.href = res.url;
      } else {
        toast.success("Order placed!");
        navigate({ to: "/orders/$orderId", params: { orderId: res.order_id }, search: { paid: "1" } });
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
          {search.cancelled && <p className="mt-2 text-destructive">Payment was cancelled.</p>}
          <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground">Start Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="font-display text-3xl font-bold">
          {step === "cart" ? "Your Cart" : step === "address" ? "Shipping" : "Payment"}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
          {(["cart", "address", "payment"] as const).map((s, i) => {
            const order = ["cart", "address", "payment"];
            const active = order.indexOf(step) >= i;
            const labels = { cart: "Cart", address: "Shipping", payment: "Payment" };
            return (
              <div key={s} className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                <span className={active ? "text-foreground" : "text-muted-foreground"}>{labels[s]}</span>
                {i < 2 && <span className="mx-2 h-px w-6 bg-border md:w-8" />}
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {step === "cart" && (
              <div className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-xl font-bold">Items in your cart ({items.length})</h2>
                <ul className="mt-4 divide-y">
                  {items.map((it) => (
                    <li key={it.id} className="flex gap-4 py-4">
                      <img src={it.image} alt="" className="h-24 w-24 rounded-md object-cover" />
                      <div className="flex-1">
                        <div className="line-clamp-2 text-sm font-medium">{it.title}</div>
                        <div className="mt-1 text-sm font-bold text-primary">${it.price.toFixed(2)}</div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center rounded-md border">
                            <button onClick={() => setQty(it.id, it.qty - 1)} className="px-2 py-1 hover:bg-muted"><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-8 text-center text-sm">{it.qty}</span>
                            <button onClick={() => setQty(it.id, it.qty + 1)} className="px-2 py-1 hover:bg-muted"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <button onClick={() => remove(it.id)} className="flex items-center gap-1 text-xs text-destructive hover:underline">
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right text-sm font-bold">${(it.price * it.qty).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === "address" && (
              <form onSubmit={submitAddress} className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-xl font-bold">Shipping address</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {([
                    ["name", "Full name", "text"],
                    ["phone", "Phone", "tel"],
                    ["email", "Email", "email"],
                    ["zip", "ZIP code", "text"],
                  ] as const).map(([k, label, type]) => (
                    <Field key={k} label={label} error={errors[k]}>
                      <input type={type} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </Field>
                  ))}
                  <div className="md:col-span-2">
                    <Field label="Street address" error={errors.address}>
                      <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </Field>
                  </div>
                  <Field label="City" error={errors.city}><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></Field>
                  <Field label="State" error={errors.state}><input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="e.g. CA" className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></Field>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setStep("cart")} className="rounded-full border px-6 py-2.5 text-sm font-semibold hover:bg-muted">Back to cart</button>
                  <button type="submit" className="flex-1 rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110 md:flex-none md:px-10">
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {step === "payment" && (
              <div className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-xl font-bold">Payment</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  When you click <b>Place Order</b> you'll be redirected to secure Stripe checkout
                  (or, while we're in test mode, your order will be created instantly).
                </p>

                <div className="mt-4 rounded-lg border bg-muted/30 p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold"><Lock className="h-4 w-4 text-primary" /> Secure payment</div>
                  <p className="mt-1 text-xs text-muted-foreground">Powered by Stripe. We never see your card details.</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => setStep("address")} className="rounded-full border px-6 py-2.5 text-sm font-semibold hover:bg-muted">Back</button>
                  <button onClick={placeOrder} disabled={loading} className="flex-1 rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110 disabled:opacity-50 md:flex-none md:px-10">
                    {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : `Place Order · $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-3 rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)] lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-xl font-bold">Order Summary</h2>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-sm"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <hr />
            <div className="flex justify-between font-bold"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
            {step === "cart" && (
              <button onClick={() => setStep("address")} className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">
                Continue to Shipping
              </button>
            )}
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> 30-day returns · Free shipping over $50
            </p>
            {subtotal < 50 && (
              <div className="mt-2 flex items-center gap-1.5 rounded-md bg-accent/30 px-2 py-1.5 text-[11px] text-[var(--primary-deep)]">
                <Crown className="h-3 w-3" /> Add ${(50 - subtotal).toFixed(2)} more for free shipping
              </div>
            )}
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
