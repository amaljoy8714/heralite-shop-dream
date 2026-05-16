import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveAsset } from "./asset-resolver";

export type DbOrderStatus =
  | "pending_payment" | "placed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";

export type DbOrderItem = {
  id: string;
  product_id: string | null;
  title: string;
  image: string | null;
  qty: number;
  unit_price_cents: number;
};

export type DbOrder = {
  id: string;
  order_number: string;
  tracking_number: string;
  user_id: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  status: DbOrderStatus;
  subtotal_cents: number;
  tax_cents: number;
  shipping_cents: number;
  total_cents: number;
  currency: string;
  shipping_address: Record<string, any>;
  payment_method: string | null;
  paid_at: string | null;
  placed_at: string;
  estimated_delivery: string;
  timeline: { status: string; at: number; notes?: string | null }[];
  order_items: DbOrderItem[];
};

function normalize(row: any): DbOrder {
  return {
    ...row,
    timeline: Array.isArray(row.timeline) ? row.timeline : [],
    order_items: (row.order_items ?? []).map((i: any) => ({ ...i, image: resolveAsset(i.image) })),
  };
}

export function useMyOrders(userId: string | undefined) {
  return useQuery({
    enabled: !!userId,
    queryKey: ["my-orders", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("placed_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(normalize);
    },
  });
}

export function useOrder(orderId: string | undefined) {
  return useQuery({
    enabled: !!orderId,
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId!)
        .maybeSingle();
      if (error) throw error;
      return data ? normalize(data) : null;
    },
  });
}

export async function trackOrderPublic(tracking: string, email: string) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-order?tracking_number=${encodeURIComponent(tracking)}&email=${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
  });
  if (!res.ok) throw new Error((await res.json()).error || "not found");
  return normalize(await res.json());
}

export async function createCheckoutSession(payload: {
  items: { slug: string; qty: number }[];
  email: string;
  full_name?: string;
  phone?: string;
  shipping_address: Record<string, any>;
}) {
  const { data: sess } = await supabase.auth.getSession();
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      ...(sess.session ? { Authorization: `Bearer ${sess.session.access_token}` } : {}),
    },
    body: JSON.stringify({
      items: payload.items.map((i) => ({ slug: i.slug, qty: i.qty })),
      email: payload.email,
      full_name: payload.full_name,
      phone: payload.phone,
      shipping_address: payload.shipping_address,
      success_url: `${window.location.origin}/orders/__ID__?paid=1`.replace(
        "__ID__", "{ORDER_ID}",
      ),
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "checkout failed");
  return json as { url: string; order_id: string; tracking_number?: string; mode: string };
}
