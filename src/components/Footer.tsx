import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-16 bg-[var(--primary-deep)] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <h4 className="mb-3 font-display text-lg text-white">HeraLite</h4>
          <p className="text-sm">Light. Life. Balance. A small maison crafting mood-lighting & wellness objects for the modern home. Trusted by 1,500+ homes worldwide.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/support" className="hover:text-white">Support Center</Link></li>
            <li><Link to="/track" className="hover:text-white">Track Order</Link></li>
            <li><Link to="/shipping" className="hover:text-white">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Get in touch</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:support@heralite.shop" className="hover:text-white">support@heralite.shop</a></li>
            <li>Reply within 24 hours</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © 2026 HeraLite. All rights reserved.
      </div>
    </footer>
  );
}
