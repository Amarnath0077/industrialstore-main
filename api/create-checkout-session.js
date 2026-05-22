import Stripe from "stripe";

// ─── Stripe client (server-side secret key) ───────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

export default async function handler(req, res) {
  // ─── CORS ────────────────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // ─── Only POST ───────────────────────────────────────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ─── Guard: secret key must be set ───────────────────────────────────────────
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("[Stripe] STRIPE_SECRET_KEY is not set");
    return res.status(500).json({ error: "Stripe is not configured on the server." });
  }

  try {
    const { items, successUrl, cancelUrl } = req.body;

    console.log("[Stripe] Creating session for", items?.length, "item(s)");

    // ─── Validate payload ─────────────────────────────────────────────────────
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    // ─── Build Stripe line_items ──────────────────────────────────────────────
    const line_items = items.map((item) => {
      const unitAmount = Math.round(Number(item.price) * 100);
      if (unitAmount <= 0) throw new Error(`Invalid price for item: ${item.name}`);

      const productData = { name: item.name || item.title || "Product" };

      // Stripe rejects non-HTTPS or localhost image URLs – skip them safely
      if (
        item.img &&
        item.img.startsWith("https://") &&
        !item.img.includes("localhost")
      ) {
        productData.images = [item.img];
      }

      return {
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount: unitAmount,
        },
        quantity: Math.max(1, Number(item.quantity) || 1),
      };
    });

    // ─── Derive redirect URLs ─────────────────────────────────────────────────
    const origin =
      req.headers.origin ||
      req.headers.referer?.replace(/\/$/, "") ||
      "https://industrialstore-main.vercel.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url:
        successUrl ||
        `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/checkout`,
      // Collect shipping address on Stripe's hosted page
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "IN", "GB", "AU"],
      },
    });

    console.log("[Stripe] Session created:", session.id);
    return res.status(200).json({ id: session.id, url: session.url });

  } catch (error) {
    console.error("[Stripe] Error creating session:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
