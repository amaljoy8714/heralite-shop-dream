import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact HeraLite — We're Here to Help" },
      { name: "description", content: "Get in touch with the HeraLite team. We reply to every message within 24 hours." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll reply within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-5 py-16 text-center md:px-6 md:py-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Contact</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-[var(--primary-deep)] md:text-6xl">We'd love to hear from you.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Real humans answer every email. We reply within 24 hours, every day of the week.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3 md:px-6 md:py-20">
        <div className="space-y-5 md:col-span-1">
          {[
            { Icon: Mail, title: "Email", body: "support@heralite.shop" },
            { Icon: MessageCircle, title: "Live Chat", body: "Mon–Fri · 9am–6pm" },
            { Icon: Clock, title: "Response Time", body: "Within 24 hours" },
            { Icon: MapPin, title: "Studio", body: "Worldwide shipping" },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary-deep)]">{title}</div>
                <div className="text-sm text-muted-foreground">{body}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-white p-6 md:col-span-2 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary-deep)]">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary-deep)]">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary-deep)]">Subject</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary-deep)]">Message</label>
            <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <button disabled={sending} className="rounded-full bg-[var(--primary-deep)] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-primary disabled:opacity-60">
            {sending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
}
