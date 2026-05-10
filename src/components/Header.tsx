import { Link } from "@tanstack/react-router";
import { ShoppingCart, Search, MapPin } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart";
import logo from "@/assets/heralite-logo.jpg";

export function Header() {
  const items = useCart((s) => s.items);
  const count = cartCount(items);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-[var(--primary-deep)] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2 md:gap-5 md:px-6 md:py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src={logo} alt="HeraLiite logo" className="h-11 w-11 rounded-full bg-white object-contain p-0.5" />
            <div className="leading-tight">
              <div className="font-display text-xl font-bold tracking-tight">Hera<span className="text-[oklch(0.78_0.15_295)]">Liite</span></div>
              <div className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 md:block">Light · Life · Balance</div>
            </div>
          </Link>

          <div className="hidden items-center gap-1 text-xs lg:flex">
            <MapPin className="h-4 w-4" />
            <div className="leading-tight">
              <div className="text-white/60">Deliver to</div>
              <div className="font-semibold">India 110001</div>
            </div>
          </div>

          <div className="flex flex-1 items-center overflow-hidden rounded-md bg-white">
            <input
              className="h-10 flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              placeholder="Search HeraLiite — light, life, balance"
            />
            <button className="flex h-10 items-center justify-center bg-[var(--gold)] px-4 text-[var(--primary-deep)] hover:brightness-95">
              <Search className="h-5 w-5" />
            </button>
          </div>

          <Link to="/checkout" className="relative flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/10">
            <div className="relative">
              <ShoppingCart className="h-7 w-7" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-xs font-bold text-[var(--primary-deep)]">
                  {count}
                </span>
              )}
            </div>
            <span className="hidden text-sm font-semibold md:inline">Cart</span>
          </Link>
        </div>
      </div>
      <nav className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-3 py-2 text-sm md:px-6">
          <span className="font-semibold">All</span>
          <span className="opacity-90 hover:opacity-100">Today's Deals</span>
          <span className="opacity-90 hover:opacity-100">Mood Lights</span>
          <span className="opacity-90 hover:opacity-100">Humidifiers</span>
          <span className="opacity-90 hover:opacity-100">Sleep & Wellness</span>
          <span className="opacity-90 hover:opacity-100">Gifts</span>
          <span className="opacity-90 hover:opacity-100">Customer Service</span>
        </div>
      </nav>
    </header>
  );
}
