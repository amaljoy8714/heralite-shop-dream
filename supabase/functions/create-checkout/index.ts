// Creates a Stripe Checkout Session (live mode if STRIPE_SECRET_KEY is set)
// or directly creates a paid order in "mock-pay" mode otherwise.
// Public endpoint — supports guest checkout.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders, json } from "../_shared/cors.ts";

type Item = { product_id?: string; slug?: string; qty: number };
type Body = {
  items: Item[];
  email: string;
  full_name?: string;
  phone?: string;
  shipping_address: Record<string, unknown>;
  success_url?: string;
  cancel_url?: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405 });

  try {
    const body = (await req.json()) as Body;
    if (!body?.items?.length || !body.email) {
      return json({ error: "items and email required" }, { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Auth (optional)
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
      userId = data.user?.id ?? null;
    }

    // Fetch products from DB (price authority) — match by id or slug
    const ids = body.items.map((i) => i.product_id).filter(Boolean) as string[];
    const slugs = body.items.map((i) => i.slug ?? i.product_id).filter(Boolean) as string[];
    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("id,slug,name,price_cents,currency,thumb,images,in_stock,active")
      .or(`id.in.(${ids.length ? ids.join(",") : "00000000-0000-0000-0000-000000000000"}),slug.in.(${slugs.join(",")})`);
    if (pErr) throw pErr;
    if (!products?.length) return json({ error: "no valid products" }, { status: 400 });

    const lineItems = body.items.map((i) => {
      const key = i.product_id ?? i.slug;
      const p = products.find((x) => x.id === key || x.slug === key);
      if (!p) throw new Error(`product ${key} not found`);
      if (!p.active) throw new Error(`product ${p.name} inactive`);
      return {
        product_id: p.id,
        title: p.name,
        image: p.thumb ?? (Array.isArray(p.images) ? p.images[0] : null),
        qty: i.qty,
        unit_price_cents: p.price_cents,
      };
    });

    const subtotal = lineItems.reduce((s, l) => s + l.unit_price_cents * l.qty, 0);
    const shipping = subtotal >= 5000 ? 0 : 499;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shipping + tax;
    const currency = (products[0].currency || "USD").toUpperCase();

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    // -------- LIVE STRIPE PATH --------
    if (stripeKey) {
      // Create pending order first so webhook can match it
      const { data: order, error: oErr } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          email: body.email,
          full_name: body.full_name,
          phone: body.phone,
          status: "pending_payment",
          subtotal_cents: subtotal,
          tax_cents: tax,
          shipping_cents: shipping,
          total_cents: total,
          currency,
          shipping_address: body.shipping_address,
          payment_method: "stripe",
        })
        .select()
        .single();
      if (oErr) throw oErr;

      await supabase.from("order_items").insert(
        lineItems.map((l) => ({
          order_id: order.id,
          product_id: l.product_id,
          title: l.title,
          image: l.image,
          qty: l.qty,
          unit_price_cents: l.unit_price_cents,
        })),
      );

      // Build Stripe Checkout Session
      const params = new URLSearchParams();
      params.append("mode", "payment");
      params.append("customer_email", body.email);
      params.append("success_url", body.success_url || `${new URL(req.url).origin}/orders/${order.id}?paid=1`);
      params.append("cancel_url", body.cancel_url || `${new URL(req.url).origin}/checkout?cancelled=1`);
      params.append("metadata[order_id]", order.id);
      lineItems.forEach((l, idx) => {
        params.append(`line_items[${idx}][quantity]`, String(l.qty));
        params.append(`line_items[${idx}][price_data][currency]`, currency.toLowerCase());
        params.append(`line_items[${idx}][price_data][unit_amount]`, String(l.unit_price_cents));
        params.append(`line_items[${idx}][price_data][product_data][name]`, l.title);
      });
      if (shipping > 0) {
        params.append("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
        params.append("shipping_options[0][shipping_rate_data][display_name]", "Standard shipping");
        params.append("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(shipping));
        params.append("shipping_options[0][shipping_rate_data][fixed_amount][currency]", currency.toLowerCase());
      }

      const sres = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
      const session = await sres.json();
      if (!sres.ok) {
        console.error("stripe error", session);
        return json({ error: session?.error?.message || "stripe error" }, { status: 502 });
      }
      await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
      return json({ url: session.url, order_id: order.id, mode: "stripe" });
    }

    // -------- MOCK-PAY FALLBACK (no Stripe key set) --------
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        email: body.email,
        full_name: body.full_name,
        phone: body.phone,
        status: "placed",
        subtotal_cents: subtotal,
        tax_cents: tax,
        shipping_cents: shipping,
        total_cents: total,
        currency,
        shipping_address: body.shipping_address,
        payment_method: "mock",
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (oErr) throw oErr;

    await supabase.from("order_items").insert(
      lineItems.map((l) => ({
        order_id: order.id,
        product_id: l.product_id,
        title: l.title,
        image: l.image,
        qty: l.qty,
        unit_price_cents: l.unit_price_cents,
      })),
    );

    // Fire confirmation email (best-effort)
    try {
      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-order-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.id }),
      });
    } catch (_) { /* ignore */ }

    return json({
      url: `${new URL(req.url).origin}/orders/${order.id}?paid=1`,
      order_id: order.id,
      tracking_number: order.tracking_number,
      mode: "mock",
    });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, { status: 500 });
  }
});
