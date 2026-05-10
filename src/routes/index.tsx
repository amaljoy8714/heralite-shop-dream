import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mainProduct, soldOutProducts } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeraLiite — Cloud Rain Humidifier & Mood Lights" },
      { name: "description", content: "Shop the HeraLiite Cloud Rain Humidifier and curated mood-lighting collection. Light. Life. Balance." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Bestseller · Limited stock
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[var(--primary-deep)] md:text-6xl">
              Light. Life.<br />
              <span className="text-primary">Balance.</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
              The HeraLiite Cloud Rain Humidifier — a calming raindrop diffuser with 7-color mood lighting. Sleep deeper, breathe better, feel lighter.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/product/$id" params={{ id: mainProduct.id }} className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110">
                Shop Now
              </Link>
              <a href="#products" className="rounded-md border border-[var(--primary-deep)]/20 bg-white px-6 py-3 text-sm font-semibold text-[var(--primary-deep)] hover:bg-white/70">
                Explore Collection
              </a>
            </div>
            <div className="mt-6 flex gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> Free shipping</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> 7-day returns</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" /> 4.6 / 2,400+</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-3xl" />
            <img src={mainProduct.images[0]} alt={mainProduct.title} className="mx-auto aspect-square w-full max-w-lg rounded-3xl object-cover shadow-[var(--shadow-glow)]" />
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Our Collection</h2>
            <p className="mt-1 text-muted-foreground">Curated mood-lighting picks · 1 in stock today</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Main product */}
          <Link
            to="/product/$id"
            params={{ id: mainProduct.id }}
            className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
          >
            <div className="relative aspect-square overflow-hidden bg-[var(--accent)]">
              <img src={mainProduct.thumb} alt={mainProduct.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
              <span className="absolute left-2 top-2 rounded-md bg-[var(--gold)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--primary-deep)]">
                57% OFF
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-3">
              <h3 className="line-clamp-2 text-sm font-medium text-foreground">{mainProduct.title}</h3>
              <div className="flex items-center gap-1 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(mainProduct.rating) ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted"}`} />
                ))}
                <span className="text-muted-foreground">({mainProduct.ratingCount.toLocaleString()})</span>
              </div>
              <div className="mt-auto flex items-baseline gap-2">
                <span className="font-display text-xl font-bold text-primary">₹{mainProduct.price}</span>
                <span className="text-xs text-muted-foreground line-through">₹{mainProduct.oldPrice}</span>
              </div>
              <span className="text-xs font-semibold text-[var(--success)]">In stock</span>
            </div>
          </Link>

          {/* Sold out products */}
          {soldOutProducts.map((p) => (
            <SoldOutCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SoldOutCard({ product }: { product: { id: string; title: string; price: number; oldPrice: number; emoji: string } }) {
  return (
    <button
      type="button"
      onClick={(e) => e.preventDefault()}
      className="group relative flex cursor-not-allowed flex-col overflow-hidden rounded-xl border bg-card text-left shadow-[var(--shadow-soft)] opacity-90"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[var(--accent)] to-secondary">
        <div className="flex h-full w-full items-center justify-center text-7xl grayscale">{product.emoji}</div>
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[1px]" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-destructive px-3 py-1 text-xs font-bold uppercase tracking-wider text-destructive-foreground">
          Sold Out
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">{product.title}</h3>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="font-display text-xl font-bold text-muted-foreground line-through">₹{product.price}</span>
        </div>
        <span className="text-xs font-semibold text-destructive">Currently unavailable</span>
      </div>
    </button>
  );
}
