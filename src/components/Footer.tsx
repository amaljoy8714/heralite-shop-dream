import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-16 bg-[var(--primary-deep)] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <h4 className="mb-3 font-display text-lg text-white">HeraLite</h4>
          <p className="text-sm">Light. Life. Balance. Premium mood-lighting & wellness, shipped FREE across the United States.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/track" className="hover:text-white">Track Order</Link></li>
            <li>Shipping</li>
            <li>Returns</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>About</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © 2026 HeraLite. All rights reserved.
      </div>
    </footer>
  );
}
