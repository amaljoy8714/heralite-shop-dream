import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Leaf, Award, Star, Truck, ShieldCheck, MessageCircle, Quote, ArrowRight } from "lucide-react";
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
              return (
                <Link
                  key={`suggest-${p.id}`}
                  to="/product/$id"
                  params={{ id: p.id }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-[0_4px_20px_rgba(20,20,40,0.06)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-glow)]"
                  style={{ animation: `fade-in 0.6s ease-out ${idx * 60}ms backwards` }}
                >
                  {p.badge && (
                    <div className="absolute right-2 top-2 z-10 rounded-full bg-[var(--primary-deep)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                      {p.badge}
                    </div>
                  )}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white via-secondary/30 to-white">
                    <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1500+ Happy Customers — premium colourful */}
      <section className="relative overflow-hidden border-y border-border py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1a1b3a] via-[#2d1b4e] to-[#1e3a5f]" />
        <div className="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-[#e8a87c]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-[#5cbdb9]/20 blur-3xl" />
        <div className="pointer-events-none absolute left-10 top-1/2 h-64 w-64 rounded-full bg-[#c9a84c]/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 md:px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.35em] text-white/80 backdrop-blur">
              <Sparkles className="h-3 w-3 text-[var(--gold)]" /> Loved Worldwide
            </div>
            <div className="mt-7 font-display text-7xl font-bold leading-none text-white md:text-9xl">
              <span className="bg-gradient-to-br from-white via-[#fce7c1] to-[var(--gold)] bg-clip-text text-transparent">1,500+</span>
            </div>
            <div className="mt-3 text-sm font-semibold uppercase tracking-[0.4em] text-white/70 md:text-base">Happy Customers</div>
            <div className="mx-auto mt-6 flex items-center justify-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[var(--gold)] text-[var(--gold)] drop-shadow-[0_2px_8px_rgba(201,168,76,0.6)]" />
              ))}
              <span className="ml-3 text-sm font-bold text-white">4.9 / 5</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
            {[
              { num: "1,500+", label: "Happy Homes", grad: "from-[#e8a87c] to-[#c44569]" },
              { num: "40+", label: "Countries Shipped", grad: "from-[#5cbdb9] to-[#3b82f6]" },
              { num: "4.9★", label: "Average Rating", grad: "from-[var(--gold)] to-[#e85d3a]" },
            ].map((s) => (
              <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/10">
                <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${s.grad} opacity-40 blur-2xl transition group-hover:opacity-70`} />
                <div className={`relative font-display text-4xl font-bold bg-gradient-to-br ${s.grad} bg-clip-text text-transparent md:text-5xl`}>{s.num}</div>
                <div className="relative mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
            {[
              { name: "Aisha K.", city: "London, UK", body: "Genuinely the most calming object in my bedroom. The rain sound puts me to sleep in minutes.", grad: "from-[#e8a87c]/30 to-[#c44569]/20" },
              { name: "Ryan S.", city: "New York, USA", body: "Beautiful build. Feels premium, looks expensive. Worth every dollar — and then some.", grad: "from-[#5cbdb9]/30 to-[#3b82f6]/20" },
              { name: "Maya P.", city: "Tokyo, JP", body: "I bought one as a gift and ended up ordering three more. The whole house feels softer.", grad: "from-[var(--gold)]/30 to-[#e85d3a]/20" },
            ].map((t) => (
              <div key={t.name} className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${t.grad} p-6 backdrop-blur-md`}>
                <Quote className="absolute right-4 top-4 h-8 w-8 text-white/15" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/90">&ldquo;{t.body}&rdquo;</p>
                <div className="mt-4 border-t border-white/10 pt-3">
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-[11px] uppercase tracking-wider text-white/60">{t.city}</div>
                </div>
              </div>
            ))}
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
