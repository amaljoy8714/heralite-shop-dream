// Sends order confirmation email via Resend if RESEND_API_KEY is set,
// otherwise logs the email to console (dev fallback).
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, json } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405 });

  const { order_id } = await req.json();
  if (!order_id) return json({ error: "order_id required" }, { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", order_id)
    .single();
  if (error || !order) return json({ error: "order not found" }, { status: 404 });

  const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;
  const itemsHtml = (order.order_items as Array<{ title: string; qty: number; unit_price_cents: number }>)
    .map((i) => `<tr><td>${i.title}</td><td>×${i.qty}</td><td style="text-align:right">${fmt(i.unit_price_cents * i.qty)}</td></tr>`)
    .join("");

  const html = `
  <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
    <h1 style="font-size:22px;margin:0 0 8px">Thanks for your order, ${order.full_name || ""}!</h1>
    <p style="color:#555">Order <b>${order.order_number}</b> — tracking <b>${order.tracking_number}</b></p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      ${itemsHtml}
      <tr><td colspan="2">Subtotal</td><td style="text-align:right">${fmt(order.subtotal_cents)}</td></tr>
      <tr><td colspan="2">Shipping</td><td style="text-align:right">${fmt(order.shipping_cents)}</td></tr>
      <tr><td colspan="2">Tax</td><td style="text-align:right">${fmt(order.tax_cents)}</td></tr>
      <tr><td colspan="2"><b>Total</b></td><td style="text-align:right"><b>${fmt(order.total_cents)} ${order.currency}</b></td></tr>
    </table>
    <p>Estimated delivery: <b>${order.estimated_delivery}</b></p>
    <p style="color:#888;font-size:12px">HeraLite — sleep & wellness</p>
  </div>`;

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.log("[send-order-email] (no RESEND_API_KEY) would send to", order.email, "\n", html);
    return json({ ok: true, mode: "stub" });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: Deno.env.get("RESEND_FROM") || "HeraLite <onboarding@resend.dev>",
      to: [order.email],
      subject: `Order confirmed — ${order.order_number}`,
      html,
    }),
  });
  const out = await res.json();
  if (!res.ok) {
    console.error("resend error", out);
    return json({ error: out }, { status: 502 });
  }
  return json({ ok: true, mode: "resend", id: out.id });
});
