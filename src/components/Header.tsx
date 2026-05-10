import { Link } from "@tanstack/react-router";
import { ShoppingCart, MapPin } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart";

export function Header() {
  const items = useCart((s) => s.items);
  const count = cartCount(items);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 md:gap-6 md:px-6 md:py-4">
        <Link to="/" className="flex shrink-0 items-center">
          <div className="font-display text-2xl font-bold leading-none tracking-tight md:text-3xl">
            <span className="text-[var(--primary-deep)]">Hera</span>
            <span className="text-primary">Liite</span>
            <span className="ml-0.5 text-[var(--gold)]">✦</span>
          </div>
        </Link>

        <div className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
          <MapPin className="h-4 w-4 text-primary" />
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-wider">Ship to</div>
            <div className="font-semibold text-foreground">United States</div>
          </div>
        </div>

        <Link to="/checkout" className="relative ml-auto flex items-center gap-2 rounded-md px-3 py-2 hover:bg-secondary lg:ml-6">
          <div className="relative">
            <ShoppingCart className="h-6 w-6 text-[var(--primary-deep)]" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </div>
          <span className="hidden text-sm font-semibold text-[var(--primary-deep)] md:inline">Cart</span>
        </Link>
      </div>
      <div className="border-t border-border bg-secondary/40">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--primary-deep)] md:px-6">
          <span className="text-[var(--gold)]">✦</span>
          <span>Light · Life · Balance</span>
          <span className="text-[var(--gold)]">✦</span>
        </div>
      </div>
    </header>
  );
}
