export function Footer() {
  return (
    <footer className="mt-16 bg-[var(--primary-deep)] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <h4 className="mb-3 font-display text-lg text-white">HeraLiite</h4>
          <p className="text-sm">Light. Life. Balance. Premium mood-lighting & wellness, shipped across the United States.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>Mood Lights</li><li>Humidifiers</li><li>Diffusers</li><li>Gifts</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Help</h4>
          <ul className="space-y-2 text-sm">
            <li>Track Order</li><li>Shipping</li><li>Returns</li><li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>About</li><li>Careers</li><li>Press</li><li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © 2026 HeraLiite. All rights reserved.
      </div>
    </footer>
  );
}
