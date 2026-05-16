import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PackageSearch, Truck, RotateCcw, CreditCard, HelpCircle, MessageCircle, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support Center — HeraLite" },
      { name: "description", content: "Find answers to common questions about orders, shipping, returns, and more. HeraLite support center." },
    ],
  }),
  component: SupportPage,
});

const faqs = [
  { q: "How long does shipping take?", a: "Most orders arrive within 5–10 business days. You'll receive a tracking ID by email as soon as your order ships." },
  { q: "How do I track my order?", a: "Use the Track Order page and enter the tracking ID from your confirmation email. You can also view all your orders from Your Orders." },
  { q: "What is your return policy?", a: "We offer a 30-day return window from the date your order arrives. Items should be in original condition. Contact us to start a return." },
  { q: "Do you ship internationally?", a: "Yes — we ship worldwide, with complimentary shipping on every order." },
  { q: "How do I change or cancel my order?", a: "If your order hasn't shipped yet, email us at support@heralite.shop within 24 hours and we'll do our best to help." },
  { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards through our secure checkout." },
];

const topics = [
  { Icon: PackageSearch, title: "Track an Order", to: "/track", body: "Real-time updates on your shipment." },
  { Icon: Truck, title: "Shipping Info", to: "/shipping", body: "Delivery times & free worldwide shipping." },
  { Icon: RotateCcw, title: "Returns & Refunds", to: "/returns", body: "30-day return window. No questions asked." },
  { Icon: CreditCard, title: "Payment & Billing", to: "/support", body: "Secure checkout. All major cards." },
  { Icon: HelpCircle, title: "Product Care", to: "/support", body: "How to clean and care for your HeraLite." },
  { Icon: MessageCircle, title: "Contact Us", to: "/contact", body: "Real humans. Reply within 24 hours." },
];

function SupportPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-5 py-16 text-center md:px-6 md:py-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Support Center</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-[var(--primary-deep)] md:text-6xl">How can we help?</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Browse common topics or get in touch — we reply to every message within 24 hours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-16">
        <h2 className="mb-6 font-display text-2xl font-bold text-[var(--primary-deep)] md:text-3xl">Browse topics</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {topics.map(({ Icon, title, to, body }) => (
            <Link key={title} to={to} className="group rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div className="mt-4 font-display text-lg font-bold text-[var(--primary-deep)]">{title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16 md:px-6 md:pb-20">
        <h2 className="mb-6 font-display text-2xl font-bold text-[var(--primary-deep)] md:text-3xl">Frequently asked questions</h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-white">
          {faqs.map((f, i) => (
            <button key={i} type="button" onClick={() => setOpen(open === i ? null : i)} className="block w-full px-5 py-4 text-left md:px-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-[var(--primary-deep)] md:text-base">{f.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-primary transition ${open === i ? "rotate-180" : ""}`} />
              </div>
              {open === i && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
            </button>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-[var(--primary-deep)] p-8 text-center text-white">
          <h3 className="font-display text-2xl font-bold">Still need help?</h3>
          <p className="mt-2 text-sm text-white/70">Send us a message — we typically reply within a few hours.</p>
          <Link to="/contact" className="mt-5 inline-block rounded-full bg-white px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--primary-deep)] transition hover:-translate-y-0.5">
            Contact Support
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
