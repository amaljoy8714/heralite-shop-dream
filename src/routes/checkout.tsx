import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Trash2, Minus, Plus, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart, cartTotal } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout · HeraLiite" },
      { name: "description", content: "Secure checkout for your HeraLiite order." },
    ],
  }),
  component: CheckoutPage,
});

const addressSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().regex(/^\d{10}$/, "Enter a valid 10-digit phone"),
  email: z.string().trim().email("Enter a valid email").max(255),
  address: z.string().trim().min(8, "Full address required").max(300),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit PIN"),
});

type AddressForm = z.infer<typeof addressSchema>;

function CheckoutPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>({ name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});
  const [payment, setPayment] = useState<"upi" | "card" | "cod">("upi");

  const subtotal = cartTotal(items);
  const shipping = subtotal > 0 ? 0 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

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
    setStep(2);
  };

  const placeOrder = () => {
    setOrderId("HL" + Date.now().toString().slice(-8));
    clear();
    setStep(3);
  };

  if (step === 3 && orderId) {
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
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-semibold">{orderId}</span></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Total paid</span><span className="font-semibold">₹{total}</span></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Shipping to</span><span className="text-right">{form.address}, {form.city}, {form.pincode}</span></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-muted-foreground">Estimated delivery</span><span className="font-semibold">3–5 business days</span></div>
          </div>
          <Link to="/" className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110">Continue Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Start shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="font-display text-3xl font-bold">Checkout</h1>

        {/* Steps */}
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
          {["Address", "Payment", "Confirm"].map((label, i) => {
            const n = (i + 1) as 1 | 2 | 3;
            const active = step >= n;
            return (
              <div key={label} className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{n}</span>
                <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                {i < 2 && <span className="mx-2 h-px w-8 bg-border" />}
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {step === 1 && (
              <form onSubmit={submitAddress} className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-xl font-bold">Shipping address</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {([
                    ["name", "Full name", "text"],
                    ["phone", "Phone (10 digits)", "tel"],
                    ["email", "Email", "email"],
                    ["pincode", "PIN code", "text"],
                  ] as const).map(([k, label, type]) => (
                    <Field key={k} label={label} error={errors[k]}>
                      <input
                        type={type}
                        value={form[k]}
                        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                        className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </Field>
                  ))}
                  <div className="md:col-span-2">
                    <Field label="Address (house, street, area)" error={errors.address}>
                      <input
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </Field>
                  </div>
                  <Field label="City" error={errors.city}>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </Field>
                  <Field label="State" error={errors.state}>
                    <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="h-11 w-full rounded-md border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </Field>
                </div>
                <button type="submit" className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 md:w-auto md:px-10">
                  Continue to Payment
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-xl font-bold">Payment method</h2>
                <div className="mt-4 space-y-3">
                  {([
                    ["upi", "UPI", "Pay via Google Pay, PhonePe, Paytm"],
                    ["card", "Credit / Debit Card", "Visa, Mastercard, RuPay"],
                    ["cod", "Cash on Delivery", "Pay when you receive"],
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
                <div className="mt-4 flex items-center gap-2 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                  <Lock className="h-4 w-4 text-primary" /> Your payment information is encrypted and secure.
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setStep(1)} className="rounded-full border px-6 py-2.5 text-sm font-semibold hover:bg-muted">Back</button>
                  <button onClick={placeOrder} className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 md:flex-none md:px-10">
                    Place Order — ₹{total}
                  </button>
                </div>
              </div>
            )}

            {/* Cart items */}
            <div className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="font-display text-xl font-bold">Your items ({items.length})</h2>
              <ul className="mt-4 divide-y">
                {items.map((it) => (
                  <li key={it.id} className="flex gap-4 py-4">
                    <img src={it.image} alt="" className="h-20 w-20 rounded-md object-cover" />
                    <div className="flex-1">
                      <div className="line-clamp-2 text-sm font-medium">{it.title}</div>
                      <div className="mt-1 text-sm font-bold text-primary">₹{it.price}</div>
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
                    <div className="text-sm font-semibold">₹{it.price * it.qty}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 rounded-xl border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-xl font-bold">Order summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={`₹${subtotal}`} />
                <Row label="Shipping" value={shipping === 0 ? "FREE" : `₹${shipping}`} />
                <Row label="Tax (5%)" value={`₹${tax}`} />
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-display text-lg font-bold">
                <span>Total</span><span className="text-primary">₹{total}</span>
              </div>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
