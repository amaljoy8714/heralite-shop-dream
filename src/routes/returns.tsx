import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RotateCcw, ShieldCheck, Mail } from "lucide-react";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Refunds — HeraLite" },
      { name: "description", content: "30-day return window on every HeraLite order. Easy, honest, no questions asked." },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-5 py-16 text-center md:px-6 md:py-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Returns</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-[var(--primary-deep)] md:text-6xl">30-day serenity guarantee.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            If your HeraLite doesn't bring you calm, send it back within 30 days for a full refund.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 md:px-6 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { Icon: RotateCcw, title: "30 Days", body: "From the date your order arrives." },
            { Icon: ShieldCheck, title: "Original Condition", body: "Unused & in original packaging." },
            { Icon: Mail, title: "Easy Start", body: "Email us to start a return." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-white p-6 text-center">
              <Icon className="mx-auto h-6 w-6 text-primary" />
              <div className="mt-3 font-display text-lg font-bold text-[var(--primary-deep)]">{title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-xl font-bold text-[var(--primary-deep)]">How to start a return</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Email us at <a href="mailto:support@heralite.shop" className="text-primary underline">support@heralite.shop</a> with your order ID.</li>
            <li>We'll send you a return label and instructions within 24 hours.</li>
            <li>Pack the item in its original packaging and drop it off.</li>
            <li>Once received, your refund is issued within 5–7 business days.</li>
          </ol>
          <h2 className="font-display text-xl font-bold text-[var(--primary-deep)]">Damaged or wrong item?</h2>
          <p>If your order arrived damaged or you received the wrong item, <Link to="/contact" className="text-primary underline">contact us</Link> right away with a photo and we'll make it right immediately — no need to send anything back.</p>
        </div>

        <div className="mt-10 text-center">
          <Link to="/contact" className="inline-block rounded-full bg-[var(--primary-deep)] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-primary">
            Start a Return
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
