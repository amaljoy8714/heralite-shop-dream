import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Truck, ShieldCheck, Sparkles, Award, Leaf, Moon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mainProduct, soldOutProducts } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeraLite — Premium Mood Lighting & Cloud Rain Humidifier" },
      { name: "description", content: "HeraLite — premium mood-lighting & wellness diffusers crafted to bring calm into your home. Free shipping. 30-day returns." },
    ],
  }),
  component: HomePage,
});

const offerStrip = [
  "✦ Complimentary Shipping Worldwide",
  "✦ 50% Off Launch Edition",
  "✦ Bundle 2 — Save an Extra 15%",
  "✦ 30-Day Serenity Guarantee",
  "✦ Hand-Inspected · Studio-Grade Finish",
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Premium offer marquee */}
      <div className="overflow-hidden bg-[var(--primary-deep)] py-2 text-white">
        <div className="flex animate-[scroll_30s_linear_infinite] gap-12 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.25em]">
          {[...offerStrip, ...offerStrip, ...offerStrip].map((t, i) => (
            <span key={i} className="text-white/80">{t}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        {/* subtle decorative blobs */}
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[var(--gold)]/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--primary-deep)]/15 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--primary-deep)] backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> The HeraLite Maison
            </div>
            <h1 className="font-display text-[44px] font-bold leading-[0.95] tracking-tight text-[var(--primary-deep)] md:text-7xl">
              Light. Life.<br />
              <span className="bg-gradient-to-r from-primary to-[var(--primary-deep)] bg-clip-text text-transparent">Balance.</span>
              <span className="mt-3 block text-[10px] font-medium uppercase tracking-[0.45em] text-muted-foreground/80 md:text-xs">
                ✦ A quiet ritual for the modern home ✦
              </span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              Sculptural mood-lighting & wellness diffusers, hand-finished and shipped complimentary worldwide. Designed to slow your evenings.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/product/$id" params={{ id: mainProduct.id }} className="group rounded-full bg-[var(--primary-deep)] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 hover:bg-primary">
                Shop the Collection
              </Link>
              <a href="#products" className="rounded-full border border-[var(--primary-deep)]/20 bg-white/60 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--primary-deep)] backdrop-blur transition hover:bg-white">
                Discover
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-primary" /> Free Shipping</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> 30-Day Returns</span>
              <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-primary" /> Studio-Grade</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-transparent to-[var(--gold)]/20 blur-3xl" />
            <div className="absolute right-3 top-3 z-10 rotate-3 rounded-full bg-gradient-to-br from-[var(--gold)] to-[oklch(0.72_0.15_70)] px-4 py-3 text-center font-display font-bold leading-none text-[var(--primary-deep)] shadow-xl">
              <div className="text-2xl">50% OFF</div>
              <div className="mt-1 text-[9px] uppercase tracking-[0.2em]">Launch Edition</div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-2 shadow-[0_30px_60px_-20px_oklch(0.62_0.22_295/0.4)] backdrop-blur">
              <img src={mainProduct.images[0]} alt={mainProduct.title} className="aspect-square w-full rounded-[1.6rem] object-cover" />
            </div>
            <div className="absolute -bottom-4 left-4 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur md:block">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary-deep)]">Editor's Pick</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand promise strip */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-5 py-8 md:grid-cols-4 md:px-6">
          {[
            [Truck, "Complimentary Shipping", "On every order"],
            [ShieldCheck, "30-Day Returns", "No questions asked"],
            [Award, "Studio-Grade Finish", "Hand-inspected"],
            [Leaf, "Mindful Materials", "Designed to last"],
          ].map(([Icon, t, s]) => {
            const I = Icon as typeof Truck;
            return (
              <div key={t as string} className="flex items-center gap-3 px-2 md:flex-col md:text-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary md:h-11 md:w-11">
                  <I className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--primary-deep)] md:text-[11px]">{t as string}</div>
                  <div className="text-[11px] text-muted-foreground">{s as string}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Editorial Story */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-secondary/30 to-white py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:px-6">
          <div className="order-2 md:order-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Our Philosophy</span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-[var(--primary-deep)] md:text-5xl">
              Crafted to slow<br />the world down.
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              HeraLite is built on a single belief — that beauty should feel quiet. Each piece is shaped to soften the room it lives in: a gentle cloud of mist, a warm wash of color, a soft falling-rain hush.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              No mass production. Just considered objects, made to be lived with.
            </p>
            <div className="mt-6 flex items-center gap-6 text-[11px] uppercase tracking-[0.25em] text-[var(--primary-deep)]">
              <span className="flex items-center gap-2"><Moon className="h-4 w-4 text-primary" /> Sleep · Focus · Calm</span>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="grid grid-cols-2 gap-3">
              <img src={mainProduct.images[1]} alt="" loading="lazy" className="aspect-[3/4] rounded-2xl object-cover shadow-[var(--shadow-card)]" />
              <img src={mainProduct.images[2]} alt="" loading="lazy" className="mt-8 aspect-[3/4] rounded-2xl object-cover shadow-[var(--shadow-card)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-20">
        <div className="mb-10 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">The Collection</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-[var(--primary-deep)] md:text-5xl">Curated · Calming · Crafted</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">A debut of nine pieces. One bestseller in stock — the rest restocking soon.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Main product */}
          <Link
            to="/product/$id"
            params={{ id: mainProduct.id }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
          >
            <div className="relative aspect-square overflow-hidden bg-[var(--accent)]">
              <img src={mainProduct.thumb} alt={mainProduct.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute left-2 top-2 rounded-full bg-[var(--gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary-deep)] shadow">
                50% OFF
              </span>
              <span className="absolute right-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow">
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
                <span className="text-xs text-muted-foreground line-through">${mainProduct.oldPrice}</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--success)]">In stock · Free shipping</span>
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

function SoldOutCard({ product }: { product: { id: string; title: string; price: number; oldPrice: number; emoji: string; image: string } }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary via-white to-[var(--accent)]/40">
        <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-contain p-3 transition duration-700 group-hover:scale-105" />
        {revealed && (
          <>
            <div className="absolute inset-0 animate-[fade-in_0.3s_ease-out] bg-gradient-to-t from-[var(--primary-deep)]/70 via-[var(--primary-deep)]/25 to-transparent" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-[scale-in_0.3s_ease-out]">
              <Sparkles className="mx-auto h-5 w-5 text-[var(--gold)]" />
              <div className="mt-1 rounded-full border border-[var(--primary-deep)]/20 bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--primary-deep)] backdrop-blur shadow-lg">
                Sold Out
              </div>
              <div className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-white drop-shadow">Restocking soon</div>
            </div>
          </>
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
