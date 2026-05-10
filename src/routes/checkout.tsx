import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Trash2, Minus, Plus, ShieldCheck, CheckCircle2, Lock, Crown, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart, cartTotal } from "@/lib/cart";
import { mainProduct, BUNDLE_DISCOUNT } from "@/lib/products";

const searchSchema = z.object({
  step: z.enum(["cart", "address", "payment"]).optional(),
});

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout · HeraLiite" },
      { name: "description", content: "Secure checkout for your HeraLiite order." },
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

type Step = "cart" | "address" | "payment" | "confirm";

function CheckoutPage() {
  const search = Route.useSearch();
  const initial: Step = (search.step as Step) ?? "cart";
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(initial);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>({ name: "", phone: "", email: "", address: "", city: "", state: "", zip: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});
  const [payment, setPayment] = useState<"card" | "paypal">("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });

  const subtotal = cartTotal(items);
  const mainItem = items.find((i) => i.id === mainProduct.id);
  const bundleEligibleQty = mainItem?.qty ?? 0;
  const bundleSavings = bundleEligibleQty >= 2 ? mainProduct.price * bundleEligibleQty * BUNDLE_DISCOUNT : 0;
  const shipping = 0;
  const taxBase = subtotal - bundleSavings;
  const tax = +(taxBase * 0.07).toFixed(2);
  const total = +(taxBase + shipping + tax).toFixed(2);

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

  const placeOrder = () => {
    setOrderId("HL" + Date.now().toString().slice(-8));
    clear();
    setStep("confirm");
  };

  // CONFIRM
  if (step === "confirm" && orderId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)]/15">
            <CheckCircle2 className="h-12 w-12 text-[var(--success)]" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold">Order placed!</h1>
          <p className="mt-2 text-muted-foreground">Thank you {form.name}, your order has been confirmed.</p>
          <div className="mt-6 rounded-xl border bg-card p-5 text-left shadow-[var(--shadow-soft)]">
            <Row label="Order ID" value={orderId} mono />
            <Row label="Total paid" value={`$${total.toFixed(2)}`} />
            <Row label="Shipping to" value={`${form.address}, ${form.city}, ${form.state} ${form.zip}`} />
            <Row label="Estimated delivery" value="2–5 business days" />
          </div>
          <Link to="/" className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">Continue Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // EMPTY CART
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
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

        {/* Steps */}
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
            {/* CART */}
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
                      <div className="text-right">
                        <div className="text-sm font-bold">${(it.price * it.qty).toFixed(2)}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                {bundleSavings > 0 && (
                  <div className="mt-4 flex items-center gap-3 rounded-lg border-2 border-dashed border-[var(--gold)] bg-[var(--gold)]/10 p-4">
                    <Crown className="h-5 w-5 text-[var(--gold)]" />
                    <div className="flex-1 text-sm">
                      <div className="font-bold text-[var(--primary-deep)]">Bundle offer applied — Most Popular!</div>
                      <div className="text-xs text-muted-foreground">15% off when you buy 2 or more — saving ${bundleSavings.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ADDRESS */}
            {step === "address" && (
              <form onSubmit={submitAddress} className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-xl font-bold">Shipping address</h2>
                <p className="text-xs text-muted-foreground">We currently ship across the United States.</p>
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
                  <Field label="City" error={errors.city}>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </Field>
                  <Field label="State" error={errors.state}>
                    <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="e.g. CA" className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </Field>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setStep("cart")} className="rounded-full border px-6 py-2.5 text-sm font-semibold hover:bg-muted">Back to cart</button>
                  <button type="submit" className="flex-1 rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110 md:flex-none md:px-10">
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {/* PAYMENT */}
            {step === "payment" && (
              <div className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-xl font-bold">Payment method</h2>
                <div className="mt-4 space-y-3">
                  {([
                    ["card", "Credit / Debit Card", "Visa, Mastercard, Amex, Discover"],
                    ["paypal", "PayPal", "Pay securely with your PayPal account"],
                  ] as const).map(([id, label, desc]) => (
                    <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition ${payment === id ? "border-primary bg-accent/40" : "border-border"}`}>
                      <input type="radio" checked={payment === id} onChange={() => setPayment(id)} className="h-4 w-4 accent-[var(--primary)]" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{label}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {payment === "card" && (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Field label="Card number"><input value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="1234 5678 9012 3456" className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></Field>
                    </div>
                    <Field label="Name on card"><input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Expiry"><input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="MM / YY" className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></Field>
                      <Field label="CVC"><input value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} placeholder="123" className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></Field>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                  <Lock className="h-4 w-4 text-primary" /> Your payment information is encrypted and secure.
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => setStep("address")} className="rounded-full border px-6 py-2.5 text-sm font-semibold hover:bg-muted">Back</button>
                  <button onClick={placeOrder} className="flex-1 rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110 md:flex-none md:px-10">
                    Place Order — ${total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary / Invoice */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 rounded-xl border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-xl font-bold">Invoice</h2>
              <div className="mt-4 space-y-2 text-sm">
                <Row label={`Subtotal (${items.reduce((a, i) => a + i.qty, 0)} items)`} value={`$${subtotal.toFixed(2)}`} />
                {bundleSavings > 0 && (
                  <Row label="Bundle offer (-15%)" value={`-$${bundleSavings.toFixed(2)}`} accent />
                )}
                <Row label="Shipping" value="FREE" />
                <Row label="Tax (7%)" value={`$${tax.toFixed(2)}`} />
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-display text-lg font-bold">
                <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
              </div>

              {step === "cart" && (
                <button
                  onClick={() => navigate({ to: "/checkout", search: { step: "address" } }).then(() => setStep("address"))}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110"
                >
                  Buy Now <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <div className="mt-4 flex items-center gap-2 rounded-md bg-accent/40 p-3 text-xs">
                <ShieldCheck className="h-4 w-4 text-primary" /> Secure SSL encrypted checkout
              </div>
            </div>
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

function Row({ label, value, accent, mono }: { label: string; value: string; accent?: boolean; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right font-semibold ${accent ? "text-[var(--success)]" : ""} ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
