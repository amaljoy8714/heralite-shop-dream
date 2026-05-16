// Stripe webhook: verifies signature and marks order as paid on checkout.session.completed
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const enc = new TextEncoder();

async function verifyStripeSignature(payload: string, sigHeader: string, secret: string) {
  // sigHeader: "t=...,v1=..."
  const parts = Object.fromEntries(sigHeader.split(",").map((p) => p.split("=")));
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  const signedPayload = `${t}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(signedPayload));
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === v1;
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("method_not_allowed", { status: 405 });

  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  if (secret) {
    const ok = await verifyStripeSignature(payload, sig, secret);
    if (!ok) return new Response("invalid signature", { status: 401 });
  } else {
    console.warn("STRIPE_WEBHOOK_SECRET not set — accepting unsigned event (dev only)");
  }

  const event = JSON.parse(payload);
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      if (!orderId) return new Response("missing order_id", { status: 400 });
      await supabase.from("orders")
        .update({
          status: "placed",
          paid_at: new Date().toISOString(),
          stripe_payment_intent: session.payment_intent,
        })
        .eq("id", orderId);

      // Send confirmation email
      try {
        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-order-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId }),
        });
      } catch (_) { /* ignore */ }
    }
    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response((e as Error).message, { status: 500 });
  }
});
