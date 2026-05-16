import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Leaf, Award, Users, Star, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { mainProduct } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeraLite — Light. Life. Balance. | Our Story" },
      { name: "description", content: "HeraLite is a maison of mood-lighting and wellness objects, hand-crafted to bring calm into modern homes. Trusted by 1500+ happy customers worldwide." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero — brand story focused */}
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[var(--gold)]/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center md:px-6 md:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--primary-deep)]/15 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--primary-deep)] backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" /> The HeraLite Maison
          </div>
          <h1 className="font-display text-[44px] font-bold leading-[0.95] tracking-tight text-[var(--primary-deep)] md:text-7xl">
            Light. Life.{" "}
            <span className="bg-gradient-to-r from-primary to-[var(--primary-deep)] bg-clip-text text-transparent">Balance.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A small maison of mood-lighting and wellness objects, born from a single belief — that the modern home deserves a quieter kind of beauty.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/product/$id" params={{ id: mainProduct.id }} className="rounded-full bg-[var(--primary-deep)] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 hover:bg-primary">
              Shop the Collection
            </Link>
            <Link to="/about" className="rounded-full border border-[var(--primary-deep)]/20 bg-white/60 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--primary-deep)] backdrop-blur transition hover:bg-white">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* 1500+ Happy Customers */}
      <section className="border-b border-border bg-white py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-secondary/60 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--primary-deep)]">
            <Users className="h-4 w-4 text-primary" /> Trusted Worldwide
          </div>
          <div className="mt-6 font-display text-6xl font-bold text-[var(--primary-deep)] md:text-8xl">
            1,500<span className="text-primary">+</span>
          </div>
          <div className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Happy Customers</div>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            From quiet apartments in Tokyo to studio lofts in New York — HeraLite now lives in over 1,500 homes around the world.
          </p>
          <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[var(--gold)] text-[var(--gold)]" />
            ))}
            <span className="ml-2 text-sm font-bold text-[var(--primary-deep)]">4.9 / 5 average rating</span>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gradient-to-b from-white via-secondary/30 to-white py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:px-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Our Story</span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-[var(--primary-deep)] md:text-5xl">
              Born from a quiet evening.
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              HeraLite began the way most small things do — with a question. What if the objects we live with every evening felt as considered as the people in the room? A softer light. A gentler hush. A mist of calm.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              We started in a small studio in 2024, designing one piece at a time. No mass production. No noise. Just sculpted objects, made to soften the room they live in.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Today, HeraLite is a growing maison — still small, still considered, and now trusted by over 1,500 homes around the world.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-transparent to-[var(--gold)]/20 blur-3xl" />
            <div className="grid grid-cols-2 gap-3">
              <img src={mainProduct.images[0]} alt="HeraLite design" loading="lazy" className="aspect-[3/4] rounded-2xl object-cover shadow-[var(--shadow-card)]" />
              <img src={mainProduct.images[1]} alt="HeraLite in the home" loading="lazy" className="mt-8 aspect-[3/4] rounded-2xl object-cover shadow-[var(--shadow-card)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand pillars */}
      <section className="border-y border-border bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="mb-12 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">What We Stand For</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-[var(--primary-deep)] md:text-5xl">A brand built on three quiet ideas.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { Icon: Heart, title: "Considered, not mass-made", body: "Every piece is hand-inspected in our studio before it leaves us. We'd rather make less than make loud." },
              { Icon: Leaf, title: "Designed to be lived with", body: "Quiet materials, soft finishes, gentle light. Objects that age beautifully and belong in the room." },
              { Icon: Award, title: "Honest to the people in it for", body: "Complimentary shipping. 30-day returns. Real humans answering real emails. No fine print." },
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
      <section className="bg-white py-10">
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

      {/* CTA */}
      <section className="bg-[var(--primary-deep)] py-16 text-center text-white md:py-20">
        <div className="mx-auto max-w-2xl px-5 md:px-6">
          <h2 className="font-display text-3xl font-bold md:text-5xl">Step into the maison.</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
            Discover the pieces 1,500+ homes already live with.
          </p>
          <Link to="/product/$id" params={{ id: mainProduct.id }} className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--primary-deep)] transition hover:-translate-y-0.5">
            Shop the Collection
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
