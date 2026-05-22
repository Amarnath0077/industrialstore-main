import Stripe from "stripe";

// ─── Stripe client (server-side secret key) ───────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe is not configured on the server." });
  }

  // Route: /api/get-checkout-session/[sessionId]
  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Missing session ID." });
  }

  try {
    console.log("[Stripe] Fetching session:", sessionId);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "customer_details"],
    });

    console.log("[Stripe] Session status:", session.payment_status);
    return res.status(200).json(session);

  } catch (error) {
    console.error("[Stripe] Error fetching session:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
