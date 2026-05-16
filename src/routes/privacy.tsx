import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — HeraLite" },
      { name: "description", content: "How HeraLite collects, uses, and protects your personal information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="mx-auto max-w-3xl px-5 py-14 md:px-6 md:py-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Privacy Policy</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-[var(--primary-deep)] md:text-5xl">Your privacy matters.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: May 2026</p>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-xl font-bold text-[var(--primary-deep)]">What we collect</h2>
            <p className="mt-2">We collect only the information needed to process your order and provide support — name, email, shipping address, and payment details (processed securely by our payment provider).</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-[var(--primary-deep)]">How we use it</h2>
            <p className="mt-2">Your information is used to fulfill orders, send shipping updates, and respond to support requests. We never sell your data.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-[var(--primary-deep)]">Cookies</h2>
            <p className="mt-2">We use essential cookies to keep your cart and session working. We don't use third-party advertising trackers.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-[var(--primary-deep)]">Your rights</h2>
            <p className="mt-2">You can request a copy of your data, or ask us to delete it, at any time. Email <a href="mailto:support@heralite.shop" className="text-primary underline">support@heralite.shop</a>.</p>
          </section>
        </div>
      </section>
      <Footer />
    </div>
  );
}
