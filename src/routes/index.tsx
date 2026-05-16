import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Leaf, Award, Star, Truck, ShieldCheck, MessageCircle, ArrowRight, BadgeX } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mainProduct, soldOutProducts } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeraLite — Mood Lighting & Wellness Objects for the Modern Home" },
      { name: "description", content: "Discover the full HeraLite collection — premium mood-light humidifiers and wellness diffusers crafted for calm, modern living. Loved by 1,500+ homes worldwide." },
    ],
  }),
  component: HomePage,
});

const ALL_PRODUCTS = [
  { id: mainProduct.id, title: mainProduct.title, price: mainProduct.price, oldPrice: mainProduct.oldPrice, image: mainProduct.thumb, badge: "Bestseller" as string | null },
  ...soldOutProducts.map((p) => ({ id: p.id, title: p.title, price: p.price, oldPrice: p.oldPrice, image: p.image, badge: null as string | null })),
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero — premium branded */}
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[var(--gold)]/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center md:px-6 md:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--primary-deep)]/15 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--primary-deep)] backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" /> The HeraLite Collection
          </div>
          <h1 className="font-display text-[44px] font-bold leading-[0.95] tracking-tight text-[var(--primary-deep)] md:text-7xl">
            Wellness objects,{" "}
            <span className="bg-gradient-to-r from-primary to-[var(--primary-deep)] bg-clip-text text-transparent">made for calm.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Sculpted mood-light humidifiers, ambient diffusers and quiet companions — designed to turn any room into a sanctuary, one breath at a time.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#collection" className="rounded-full bg-[var(--primary-deep)] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 hover:bg-primary">
              Explore the Collection
            </a>
            <Link to="/about" className="rounded-full border border-[var(--primary-deep)]/20 bg-white/60 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--primary-deep)] backdrop-blur transition hover:bg-white">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Suggested / Hand-picked for You */}
      <section id="collection" className="relative overflow-hidden border-y border-border bg-gradient-to-br from-[#fdf6ec] via-white to-[#f3ecff] py-16 md:py-20">
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-[var(--gold)]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 md:px-6">
          <div className="mb-10 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary-deep)]/15 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--primary-deep)] backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> Hand-picked for You
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-[var(--primary-deep)] md:text-5xl">You may also love.</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              A curated edit of pieces our customers reach for again and again.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {ALL_PRODUCTS.map((p, idx) => {
              const discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
              const isMain = p.id === mainProduct.id;

              const cardInner = (
                <>
                  {p.badge && (
                    <div className="absolute right-2 top-2 z-10 rounded-full bg-[var(--primary-deep)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                      {p.badge}
                    </div>
                  )}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white via-secondary/30 to-white">
                    <img src={p.image} alt={p.title} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isMain ? "grayscale-[0.15]" : ""}`} />
                    {discount > 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[var(--gold)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--primary-deep)] shadow-sm">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 md:p-4">
                    <h3 className="line-clamp-2 text-[12.5px] font-semibold leading-snug text-[var(--primary-deep)] md:text-sm">{p.title}</h3>
                    <div className="mt-auto flex items-baseline gap-2 pt-3">
                      <span className="font-display text-base font-bold text-[var(--primary-deep)] md:text-lg">${p.price.toFixed(2)}</span>
                      <span className="text-[11px] text-muted-foreground line-through">${p.oldPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              );

              const className = "group relative flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/70 text-left shadow-[0_4px_20px_rgba(20,20,40,0.06)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-glow)]";
              const style = { animation: `fade-in 0.6s ease-out ${idx * 60}ms backwards` } as const;

              if (isMain) {
                return (
                  <Link key={`p-${p.id}`} to="/product/$id" params={{ id: p.id }} className={className} style={style}>
                    {cardInner}
                  </Link>
                );
              }
              return (
                <button
                  key={`p-${p.id}`}
                  type="button"
                  onClick={() =>
                    toast.error("Sold Out", {
                      description: "This piece is currently unavailable. Restock coming soon.",
                      icon: <BadgeX className="h-4 w-4" />,
                    })
                  }
                  className={className}
                  style={style}
                >
                  {cardInner}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1500+ Happy Customers — compact premium */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-5 md:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1b3a] via-[#2d1b4e] to-[#1e3a5f] p-7 text-center shadow-[0_20px_60px_-20px_rgba(45,27,78,0.5)] md:p-10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--gold)]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#5cbdb9]/25 blur-3xl" />

            <div className="relative flex flex-col items-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.35em] text-white/80 backdrop-blur">
                <Sparkles className="h-3 w-3 text-[var(--gold)]" /> Loved Worldwide
              </div>
              <div className="mt-4 font-display text-5xl font-bold leading-none md:text-6xl">
                <span className="bg-gradient-to-br from-white via-[#fce7c1] to-[var(--gold)] bg-clip-text text-transparent">1,500+</span>
              </div>
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70 md:text-xs">Happy Customers</div>
              <div className="mt-4 flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)] drop-shadow-[0_2px_8px_rgba(201,168,76,0.6)]" />
                ))}
                <span className="ml-2 text-xs font-bold text-white">4.9 / 5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand pillars */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="mb-12 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">The HeraLite Promise</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-[var(--primary-deep)] md:text-5xl">Crafted with intention.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Three principles guide every object that leaves our studio.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { Icon: Heart, title: "Hand-finished", body: "Every piece is individually inspected before it leaves us. Quality over quantity, always." },
              { Icon: Leaf, title: "Quietly designed", body: "Soft materials, gentle finishes, calm light. Objects built to belong in the room — not shout in it." },
              { Icon: Award, title: "Honestly priced", body: "Complimentary worldwide shipping. 30-day returns. Real humans on email. No fine print." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-secondary/30 p-7 transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-[var(--primary-deep)]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise strip */}
      <section className="border-y border-border bg-secondary/20 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-5 md:grid-cols-4 md:px-6">
          {[
            [Truck, "Free Shipping", "On every order"],
            [ShieldCheck, "30-Day Returns", "No questions asked"],
            [Award, "Studio-Grade", "Hand-inspected"],
            [MessageCircle, "Real Support", "We reply within 24h"],
          ].map(([Icon, t, s]) => {
            const I = Icon as typeof Truck;
            return (
              <div key={t as string} className="flex items-center gap-3 px-2 md:flex-col md:text-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm md:h-11 md:w-11">
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

      {/* CTA */}
      <section className="bg-[var(--primary-deep)] py-16 text-center text-white md:py-20">
        <div className="mx-auto max-w-2xl px-5 md:px-6">
          <h2 className="font-display text-3xl font-bold md:text-5xl">Bring home the calm.</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
            Join 1,500+ homes already living a little quieter.
          </p>
          <a href="#collection" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--primary-deep)] transition hover:-translate-y-0.5">
            Shop the Collection <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
