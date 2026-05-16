// Public tracking lookup. Requires tracking_number; email match required for guest orders
// to prevent enumeration.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, json } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const tracking = url.searchParams.get("tracking_number");
  const email = url.searchParams.get("email");
  if (!tracking) return json({ error: "tracking_number required" }, { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, order_number, tracking_number, status, total_cents, currency, placed_at, paid_at, estimated_delivery, timeline, shipping_address, email, full_name, order_items(*)")
    .eq("tracking_number", tracking.toUpperCase())
    .maybeSingle();
  if (error) return json({ error: error.message }, { status: 500 });
  if (!order) return json({ error: "not found" }, { status: 404 });

  // Privacy: require email match unless signed-in user owns it
  const authHeader = req.headers.get("authorization");
  let isOwner = false;
  if (authHeader?.startsWith("Bearer ")) {
    const { data } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (data.user?.email && data.user.email.toLowerCase() === order.email.toLowerCase()) isOwner = true;
  }
  if (!isOwner && (!email || email.toLowerCase() !== order.email.toLowerCase())) {
    // redact PII
    return json({
      order_number: order.order_number,
      tracking_number: order.tracking_number,
      status: order.status,
      placed_at: order.placed_at,
      estimated_delivery: order.estimated_delivery,
      timeline: order.timeline,
    });
  }

  return json(order);
});
