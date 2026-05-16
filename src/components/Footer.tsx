import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 bg-[var(--primary-deep)] text-white/70">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <h4 className="font-display text-3xl text-white">HeraLite</h4>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/40">Light · Life · Balance</p>
            <p className="mt-6 max-w-sm text-[13px] font-light leading-relaxed text-white/60">
              Crafting sculptural objects for an intentional home since 2024. Every piece is hand-finished in our studio.
            </p>
            <div className="mt-8 flex gap-5 text-[11px] uppercase tracking-[0.25em] text-white/50">
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">Pinterest</a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h6 className="mb-6 text-[10px] font-bold uppercase tracking-[0.32em] text-white/50">Boutique</h6>
            <ul className="space-y-3 text-[13px] font-light">
              <li><a href="#products" className="hover:text-white">The Collection</a></li>
              <li><Link to="/track" className="hover:text-white">Track Order</Link></li>
              <li><span className="hover:text-white">Limited Drops</span></li>
              <li><span className="hover:text-white">Stockists</span></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h6 className="mb-6 text-[10px] font-bold uppercase tracking-[0.32em] text-white/50">Maison</h6>
            <ul className="space-y-3 text-[13px] font-light">
              <li>Our Studio</li>
              <li>Sustainability</li>
              <li>Contact</li>
              <li>Privacy</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h6 className="mb-6 text-[10px] font-bold uppercase tracking-[0.32em] text-white/50">Newsletter</h6>
            <p className="mb-5 text-[13px] font-light leading-relaxed text-white/60">
              Private invitations to studio releases and seasonal rituals.
            </p>
            <form className="flex items-center border-b border-white/15 pb-2.5">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent text-[13px] font-light text-white placeholder:text-white/30 focus:outline-none"
              />
              <button type="submit" className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/70 hover:text-white">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-[10px] uppercase tracking-[0.28em] text-white/40 md:flex-row">
          <span>© MMXXVI HeraLite Maison · All rights reserved</span>
          <span>Hand-finished · Studio-grade</span>
        </div>
      </div>
    </footer>
  );
}
