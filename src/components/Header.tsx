import { Link } from "@tanstack/react-router";
import { ShoppingCart, MapPin, PackageSearch, User, LogOut, Package, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, cartCount } from "@/lib/cart";
import { useAuth, signOut } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const items = useCart((s) => s.items);
  const count = cartCount(items);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 md:gap-6 md:px-6 md:py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 leading-none group">
          <BrandLogo className="h-9 w-9 shrink-0 transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105 drop-shadow-[0_4px_10px_oklch(0.62_0.22_295/0.35)]" />
          <div className="flex flex-col leading-none">
            <div className="font-display text-[22px] font-bold tracking-tight md:text-[26px]">
              <span className="text-[var(--primary-deep)]">Hera</span>
              <span className="bg-gradient-to-r from-primary to-[var(--primary-deep)] bg-clip-text text-transparent">Lite</span>
            </div>
            <div className="mt-1 text-[8px] font-medium uppercase tracking-[0.4em] text-muted-foreground/80 md:text-[9px]">
              Light · Life · Balance
            </div>
          </div>
        </Link>

        <div className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
          <MapPin className="h-4 w-4 text-primary" />
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-wider">Ship to</div>
            <div className="font-semibold text-foreground">United States</div>
          </div>
        </div>

        <Link
          to="/track"
          className="ml-auto group relative flex items-center gap-2 overflow-hidden rounded-full border border-primary/20 bg-gradient-to-r from-white to-secondary/60 px-3 py-2 text-sm font-bold text-[var(--primary-deep)] shadow-[0_2px_8px_-2px_oklch(0.62_0.22_295/0.25)] transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_8px_20px_-6px_oklch(0.62_0.22_295/0.45)] md:px-4 lg:ml-6"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <PackageSearch className="h-[18px] w-[18px] text-primary" />
          <span className="hidden md:inline tracking-wide">Track Order</span>
        </Link>

        {/* Account */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-2 text-sm font-bold text-[var(--primary-deep)] transition-all hover:-translate-y-0.5 hover:border-primary/50">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {(user.email ?? "?")[0].toUpperCase()}
              </div>
              <span className="hidden md:inline max-w-[120px] truncate">{user.email}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                  <Package className="h-4 w-4" /> Your Orders
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin/reviews" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" /> Admin · Reviews
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="text-destructive cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/login"
            search={{ redirect: "/" }}
            className="flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-2 text-sm font-bold text-[var(--primary-deep)] transition-all hover:-translate-y-0.5 hover:border-primary/50"
          >
            <User className="h-[18px] w-[18px] text-primary" />
            <span className="hidden md:inline">Sign in</span>
          </Link>
        )}

        <Link to="/checkout" className="relative flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-secondary">
          <div className="relative">
            <ShoppingCart className="h-6 w-6 text-[var(--primary-deep)]" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-[0_4px_10px_-2px_oklch(0.62_0.22_295/0.6)]">
                {count}
              </span>
            )}
          </div>
          <span className="hidden text-sm font-semibold text-[var(--primary-deep)] md:inline">Cart</span>
        </Link>
      </div>
    </header>
  );
}
