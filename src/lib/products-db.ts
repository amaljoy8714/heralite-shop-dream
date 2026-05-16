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
