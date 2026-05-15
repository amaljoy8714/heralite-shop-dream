import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export function RatingBreakdown({
  breakdown,
  total,
}: {
  breakdown: Record<string, number>;
  total: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = Number(breakdown?.[String(star)] ?? 0);
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="flex w-12 items-center gap-1 font-medium text-foreground">
              {star} <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            </span>
            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold to-[oklch(0.85_0.16_75)] transition-all duration-1000 ease-out"
                style={{ width: mounted ? `${pct}%` : "0%" }}
              />
            </div>
            <span className="w-12 text-right text-xs text-muted-foreground">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
