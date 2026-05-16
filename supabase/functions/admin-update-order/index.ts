// Admin-only: update order status; appends to timeline.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, json } from "../_shared/cors.ts";

const STATUSES = ["placed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405 });

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "unauthorized" }, { status: 401 });
  const token = authHeader.replace("Bearer ", "");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData.user) return json({ error: "unauthorized" }, { status: 401 });

  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
  if (!isAdmin) return json({ error: "forbidden" }, { status: 403 });

  const { order_id, status, notes } = await req.json();
  if (!order_id || !STATUSES.includes(status)) return json({ error: "invalid input" }, { status: 400 });

  const { data: existing, error: e1 } = await supabase
    .from("orders").select("timeline").eq("id", order_id).single();
  if (e1 || !existing) return json({ error: "not found" }, { status: 404 });

  const newTimeline = Array.isArray(existing.timeline) ? [...existing.timeline] : [];
  newTimeline.push({ status, at: Date.now(), notes: notes || null, by: userData.user.id });

  const { error: e2 } = await supabase
    .from("orders")
    .update({ status, timeline: newTimeline, notes: notes ?? undefined })
    .eq("id", order_id);
  if (e2) return json({ error: e2.message }, { status: 500 });

  return json({ ok: true });
});
