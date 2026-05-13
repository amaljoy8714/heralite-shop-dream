import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Truck, ShieldCheck, Sparkles, Lock } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mainProduct, soldOutProducts } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeraLite — Premium Mood Lighting & Cloud Rain Humidifier" },
      { name: "description", content: "Shop the HeraLite Cloud Rain Humidifier — premium mood-lighting and wellness, shipped FREE across the United States. Light. Life. Balance." },
    ],
  }),
  component: HomePage,
});

const offerStrip = [
  "✦ FREE Shipping on every order",
  "✦ 50% Off — Limited stock",
  "✦ Bundle 2 → Extra 15% Off",
  "✦ 30-day money-back guarantee",
  "✦ Premium curated mood-lighting collection",
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Premium offer marquee — moved to right under header */}
      <div className="overflow-hidden bg-[var(--primary-deep)] py-2 text-white">
        <div className="flex animate-[scroll_30s_linear_infinite] gap-12 whitespace-nowrap text-xs font-semibold tracking-wider">
          {[...offerStrip, ...offerStrip, ...offerStrip].map((t, i) => (
            <span key={i} className="text-white/90">{t}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-[var(--primary-deep)] md:text-7xl">
              Light. Life.<br />
              <span className="text-primary">Balance.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Curated mood-lighting & wellness pieces. Hand-picked, premium, and shipped FREE across the United States.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/product/$id" params={{ id: mainProduct.id }} className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110">
                Shop Bestseller
              </Link>
              <a href="#products" className="rounded-full border-2 border-[var(--primary-deep)]/15 bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-[var(--primary-deep)] hover:bg-white/70">
                Collection
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> FREE shipping</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> 30-day returns</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/25 blur-3xl" />
            <div className="absolute right-4 top-4 z-10 rotate-3 rounded-full bg-[var(--gold)] px-4 py-3 text-center font-display font-bold leading-none text-[var(--primary-deep)] shadow-lg">
              <div className="text-2xl">50% OFF</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest">Free Shipping</div>
            </div>
            <img src={mainProduct.images[0]} alt={mainProduct.title} className="mx-auto aspect-square w-full max-w-lg rounded-3xl border border-white/40 object-cover shadow-[var(--shadow-glow)]" />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-6 text-center md:grid-cols-4">
          {[
            ["FREE Shipping", "On every order"],
            ["30-Day Returns", "Hassle-free"],
            ["Premium Quality", "Hand inspected"],
            ["Secure Checkout", "256-bit SSL"],
          ].map(([t, s]) => (
            <div key={t}>
              <div className="text-sm font-bold text-[var(--primary-deep)]">{t}</div>
              <div className="text-xs text-muted-foreground">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">The Collection</span>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">Curated · Calming · Crafted</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">One bestseller in stock today. Restocking the rest soon — sign up to be notified.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Main product */}
          <Link
            to="/product/$id"
            params={{ id: mainProduct.id }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
          >
            <div className="relative aspect-square overflow-hidden bg-[var(--accent)]">
              <img src={mainProduct.thumb} alt={mainProduct.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
              <span className="absolute left-2 top-2 rounded-full bg-[var(--gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary-deep)]">
                50% OFF
              </span>
              <span className="absolute right-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                Bestseller
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{mainProduct.title}</h3>
              <div className="flex items-center gap-1 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(mainProduct.rating) ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted"}`} />
                ))}
                <span className="text-muted-foreground">{mainProduct.rating}</span>
              </div>
              <div className="mt-auto flex items-baseline gap-2">
                <span className="font-display text-xl font-bold text-primary">${mainProduct.price}</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--success)]">In stock · FREE shipping</span>
            </div>
          </Link>

          {/* Sold out products */}
          {soldOutProducts.map((p) => (
            <SoldOutCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Footer />

      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
    </div>
  );
}

function SoldOutCard({ product }: { product: { id: string; title: string; price: number; oldPrice: number; emoji: string } }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary via-white to-[var(--accent)]/40">
        <div className={`flex h-full w-full items-center justify-center text-7xl transition-all duration-500 ${revealed ? "scale-90 opacity-30 blur-[2px]" : "opacity-90 group-hover:scale-105"}`}>
          {product.emoji}
        </div>
        {revealed && (
          <>
            <div className="absolute inset-0 animate-[fade-in_0.3s_ease-out] bg-gradient-to-t from-[var(--primary-deep)]/60 via-[var(--primary-deep)]/20 to-transparent" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-[scale-in_0.3s_ease-out]">
              <Sparkles className="mx-auto h-5 w-5 text-[var(--gold)]" />
              <div className="mt-1 rounded-full border border-[var(--primary-deep)]/20 bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--primary-deep)] backdrop-blur shadow-lg">
                Sold Out
              </div>
              <div className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-white drop-shadow">Restocking soon</div>
            </div>
          </>
        )}
        {!revealed && (
          <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--primary-deep)] backdrop-blur">
            <Lock className="inline h-2.5 w-2.5" /> Tap
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{product.title}</h3>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold text-primary">${product.price}</span>
          <span className="text-xs text-muted-foreground line-through">${product.oldPrice}</span>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {revealed ? "Notify when back" : "Tap to view"}
        </span>
      </div>
    </button>
  );
}
