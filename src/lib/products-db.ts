import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset, resolveImages } from "./asset-resolver";

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  brand: string;
  price_cents: number;
  old_price_cents: number | null;
  currency: string;
  images: string[];
  thumb: string;
  category: string | null;
  stock: number;
  in_stock: boolean;
  active: boolean;
  bullets: string[];
  specs: { label: string; value: string }[];
  sort_order: number;
  avg_rating: number;
  total_reviews: number;
};

function normalize(row: any): DbProduct {
  return {
    ...row,
    images: resolveImages(row.images ?? []),
    thumb: resolveAsset(row.thumb ?? (Array.isArray(row.images) ? row.images[0] : "")),
    bullets: Array.isArray(row.bullets) ? row.bullets : [],
    specs: Array.isArray(row.specs) ? row.specs : [],
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(normalize);
    },
  });
}

// Maps static product IDs (in src/lib/products.ts) → DB slugs
const STATIC_ID_TO_SLUG: Record<string, string> = {
  "cloud-rain-humidifier": "cloud-rain-humidifier",
  s0: "cosmomist-astronaut",
  s1: "edenmist-raindrop",
  s2: "lunamist-moon",
  s3: "lumamist-crystal",
  s4: "embermist-flame",
  s5: "zenmist-wood",
  s6: "umbramist-umbrella",
  s7: "nordmist-orb",
  s8: "chromamist-rgb",
};

export type PriceOverride = { price: number; oldPrice: number };

export function usePriceOverrides() {
  return useQuery({
    queryKey: ["price-overrides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("slug, price_cents, old_price_cents");
      if (error) throw error;
      const bySlug = new Map<string, PriceOverride>();
      for (const row of data ?? []) {
        bySlug.set(row.slug, {
          price: (row.price_cents ?? 0) / 100,
          oldPrice: (row.old_price_cents ?? row.price_cents ?? 0) / 100,
        });
      }
      const byStaticId = new Map<string, PriceOverride>();
      for (const [staticId, slug] of Object.entries(STATIC_ID_TO_SLUG)) {
        const o = bySlug.get(slug);
        if (o) byStaticId.set(staticId, o);
      }
      return byStaticId;
    },
    staleTime: 30_000,
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    enabled: !!slug,
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data ? normalize(data) : null;
    },
  });
}
