import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mainProduct, soldOutProducts } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeraLite — Sculptural Mood Lighting & Wellness Diffusers" },
      { name: "description", content: "HeraLite Maison — sculptural mood-lighting & wellness diffusers, hand-finished in studio. Complimentary worldwide shipping. Est. 2024." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Quiet announcement bar */}
      <div className="bg-[var(--primary-deep)] py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.32em] text-white/85">
        Complimentary Worldwide Shipping &nbsp;·&nbsp; Est. MMXXIV
      </div>

      {/* Hero */}
      <section className="border-b border-border bg-[oklch(0.985_0.005_295)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-6 md:py-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              <span className="block h-px w-8 bg-[var(--primary-deep)]/30" />
              The Maison Collection
            </div>
            <h1 className="font-display text-[44px] font-normal leading-[1.02] tracking-tight text-[var(--primary-deep)] md:text-7xl">
              Light. Life.<br />
              <em className="font-normal italic text-muted-foreground/70">Balance.</em>
            </h1>
            <p className="mt-7 max-w-md text-[15px] font-light leading-relaxed text-muted-foreground md:text-base">
              Sculptural objects of light, hand-finished in our studio. Wellness diffusers and mood-lighting designed to slow your evenings.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to="/product/$id"
                params={{ id: mainProduct.id }}
                className="bg-[var(--primary-deep)] px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-primary"
              >
                Shop the Collection
              </Link>
              <a href="#products" className="group flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--primary-deep)]">
                Explore Rituals
                <span className="block h-px w-8 bg-[var(--primary-deep)] transition-all group-hover:w-14" />
              </a>
            </div>

            <div className="mt-14 flex gap-12 border-t border-border pt-8">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground/70">Archive</div>
                <div className="mt-1.5 font-display italic text-[var(--primary-deep)]">Est. MMXXIV</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground/70">Atelier</div>
                <div className="mt-1.5 font-display italic text-[var(--primary-deep)]">Hand-finished</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden bg-white shadow-[0_30px_80px_-30px_oklch(0.18_0.05_280/0.35)]">
              <img
                src={mainProduct.images[0]}
                alt={mainProduct.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-2 hidden max-w-[260px] bg-white px-7 py-6 shadow-xl md:block">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">Press</div>
              <p className="mt-3 font-display text-[15px] italic leading-snug text-[var(--primary-deep)]">
                "A quiet ritual for the modern home."
              </p>
              <div className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">— The Studio Journal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-5 py-10 md:grid-cols-4 md:px-6">
          {[
            ["Craftsmanship", "Studio-grade, hand-inspected"],
            ["Sustainability", "Mindful materials, built to last"],
            ["Service", "30-day trial, free returns"],
            ["Heritage", "Independent maison, Est. 2024"],
          ].map(([title, sub]) => (
            <div key={title} className="px-2 md:px-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70">{title}</div>
              <div className="mt-2 text-[12px] leading-relaxed text-[var(--primary-deep)]">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Story */}
      <section className="bg-[oklch(0.985_0.005_295)] py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-6">
          <div className="relative order-1 grid grid-cols-2 gap-3 md:order-2">
            <img src={mainProduct.images[1]} alt="" loading="lazy" className="aspect-[3/4] object-cover shadow-[var(--shadow-card)]" />
            <img src={mainProduct.images[2]} alt="" loading="lazy" className="mt-10 aspect-[3/4] object-cover shadow-[var(--shadow-card)]" />
          </div>
          <div className="order-2 md:order-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary">Our Philosophy</span>
            <h2 className="mt-4 font-display text-3xl font-normal leading-[1.1] text-[var(--primary-deep)] md:text-5xl">
              Crafted to slow<br />the world <em className="italic text-muted-foreground/70">down.</em>
            </h2>
            <p className="mt-6 text-[15px] font-light leading-relaxed text-muted-foreground">
              HeraLite is built on a single belief — that beauty should feel quiet. Each piece is shaped to soften the room it lives in: a gentle cloud of mist, a warm wash of color, a soft falling-rain hush.
            </p>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-muted-foreground">
              No mass production. Just considered objects, made to be lived with.
            </p>
            <div className="mt-8 flex gap-6 text-[10px] font-bold uppercase tracking-[0.32em] text-[var(--primary-deep)]">
              <span>Sleep</span><span className="text-border">·</span>
              <span>Focus</span><span className="text-border">·</span>
              <span>Calm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-28">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary">The Collection</span>
            <h2 className="mt-4 font-display text-3xl font-normal text-[var(--primary-deep)] md:text-5xl">
              Curated <em className="italic text-muted-foreground/70">·</em> Calming <em className="italic text-muted-foreground/70">·</em> Crafted
            </h2>
            <p className="mt-3 max-w-xl text-sm font-light text-muted-foreground">
              A debut of nine pieces. One signature object available now — the remainder restocking by appointment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
          {/* Main product */}
          <Link
            to="/product/$id"
            params={{ id: mainProduct.id }}
            className="group flex flex-col"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[oklch(0.96_0.01_295)]">
              <img src={mainProduct.thumb} alt={mainProduct.title} loading="lazy" className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]" />
              <span className="absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--primary-deep)] backdrop-blur">
                In Stock
              </span>
            </div>
            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--primary-deep)]">Cloud Rain</h3>
                <p className="mt-1 font-display text-[12px] italic text-muted-foreground">Sleep & Wellness Diffuser</p>
              </div>
              <div className="text-right">
                <div className="font-display text-[15px] text-[var(--primary-deep)]">${mainProduct.price}</div>
                <div className="text-[10px] text-muted-foreground line-through">${mainProduct.oldPrice}</div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-2.5 w-2.5 ${i < Math.round(mainProduct.rating) ? "fill-[var(--primary-deep)] text-[var(--primary-deep)]" : "text-border"}`} />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{mainProduct.ratingCount.toLocaleString()} reviews</span>
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

function shortName(title: string) {
  // "HeraLite CosmoMist-Astronaut Edition Wellness Diffuser" -> "CosmoMist"
  const stripped = title.replace(/^HeraLite\s+/i, "");
  const first = stripped.split(/[-—\s]/)[0];
  return first || stripped;
}

function subtitle(title: string) {
  const stripped = title.replace(/^HeraLite\s+/i, "");
  const parts = stripped.split(/[-—]/);
  return (parts[1] || parts[0] || "").trim().split("&")[0].trim() || "Atelier Edition";
}

function SoldOutCard({ product }: { product: { id: string; title: string; price: number; oldPrice: number; emoji: string; image: string } }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="group flex flex-col text-left"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[oklch(0.96_0.01_295)]">
        <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.04]" />
        {revealed && (
          <>
            <div className="absolute inset-0 animate-[fade-in_0.3s_ease-out] bg-[var(--primary-deep)]/35" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-[scale-in_0.3s_ease-out]">
              <Sparkles className="mx-auto h-4 w-4 text-white" />
              <div className="mt-2 bg-white/95 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--primary-deep)] shadow-lg">
                Waitlist
              </div>
              <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-white drop-shadow">Restocking soon</div>
            </div>
          </>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--primary-deep)]">{shortName(product.title)}</h3>
          <p className="mt-1 font-display text-[12px] italic text-muted-foreground line-clamp-1">{subtitle(product.title)}</p>
        </div>
        <div className="text-right">
          <div className="font-display text-[15px] text-[var(--primary-deep)]">${product.price}</div>
          <div className="text-[10px] text-muted-foreground line-through">${product.oldPrice}</div>
        </div>
      </div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {revealed ? "Notify when back" : "Reserve your piece"}
      </div>
    </button>
  );
}
