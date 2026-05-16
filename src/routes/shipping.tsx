import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Truck, Globe, Clock, PackageSearch } from "lucide-react";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping Info — HeraLite" },
      { name: "description", content: "Free worldwide shipping on every HeraLite order. Delivery in 5–10 business days." },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-5 py-16 text-center md:px-6 md:py-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Shipping</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-[var(--primary-deep)] md:text-6xl">Complimentary worldwide.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Every HeraLite order ships free, hand-packaged with care, and tracked door-to-door.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 md:px-6 md:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { Icon: Truck, title: "Free Shipping", body: "Every order ships complimentary — no minimum." },
            { Icon: Globe, title: "Worldwide Delivery", body: "We ship to over 100 countries." },
            { Icon: Clock, title: "5–10 Business Days", body: "Typical delivery time after dispatch." },
            { Icon: PackageSearch, title: "Tracked End-to-End", body: "You'll receive a tracking ID by email when your order ships." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-lg font-bold text-[var(--primary-deep)]">{title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-xl font-bold text-[var(--primary-deep)]">Processing time</h2>
          <p>Orders are typically processed and dispatched within 1–2 business days. You'll receive an email with your tracking ID as soon as your order leaves our studio.</p>
          <h2 className="font-display text-xl font-bold text-[var(--primary-deep)]">Customs & duties</h2>
          <p>International orders may be subject to local customs duties and taxes, which are the responsibility of the recipient. We declare every package honestly to avoid delays.</p>
          <h2 className="font-display text-xl font-bold text-[var(--primary-deep)]">Lost or delayed packages</h2>
          <p>If your order hasn't arrived within the expected window, <Link to="/contact" className="text-primary underline">contact us</Link> and we'll investigate immediately.</p>
        </div>

        <div className="mt-10 text-center">
          <Link to="/track" className="inline-block rounded-full bg-[var(--primary-deep)] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-primary">
            Track Your Order
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
