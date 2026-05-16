import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Heart, Leaf, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About HeraLite — Our Story & Philosophy" },
      { name: "description", content: "HeraLite is a small maison crafting mood-lighting and wellness objects for the modern home. Learn the story behind the brand." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-6 md:py-28">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">About Us</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-[var(--primary-deep)] md:text-6xl">A quieter kind of beauty.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            HeraLite is a small design maison crafting mood-lighting and wellness objects for homes that value calm over noise.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-20">
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>HeraLite was founded in 2024 with a single intention — to design objects that soften the rooms they live in. We believe that a home is more than its furniture; it is the light, the air, the small rituals that shape the evening.</p>
          <p>We started in a small studio with one product and a quiet conviction: that mass-production has its place, but not in the objects you live with every night. Each HeraLite piece is hand-finished, hand-inspected, and packaged with care before it leaves us.</p>
          <p>Today, HeraLite is trusted in over 1,500 homes worldwide. We're still a small team — and that's by design. We'd rather make less, and make it well.</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { Icon: Heart, title: "Considered", body: "Quality over quantity. Always." },
            { Icon: Leaf, title: "Mindful", body: "Materials chosen to last." },
            { Icon: Award, title: "Honest", body: "Real support. No fine print." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-secondary/30 p-6 text-center">
              <Icon className="mx-auto h-6 w-6 text-primary" />
              <div className="mt-3 font-display text-lg font-bold text-[var(--primary-deep)]">{title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/contact" className="inline-block rounded-full bg-[var(--primary-deep)] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-primary">
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
