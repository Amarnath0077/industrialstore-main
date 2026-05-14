import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || ""
);

app.post(
  "/api/create-checkout-session",
  async (req, res) => {
    try {
      const {
        items,
        successUrl,
        cancelUrl,
      } = req.body;

      const line_items = items.map(
        (item: any) => ({
          price_data: {
            currency: "usd",

            product_data: {
              name: item.title,
              images: [item.img],
            },

            unit_amount: Math.round(
              item.price * 100
            ),
          },

          quantity: item.quantity,
        })
      );

      const session =
        await stripe.checkout.sessions.create({
          payment_method_types: ["card"],

          mode: "payment",

          line_items,

          success_url: successUrl,

          cancel_url: cancelUrl,
        });

      res.json({
        id: session.id,
        url: session.url,
      });
    } catch (error: any) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

app.listen(3000, () => {
  console.log(
    "Stripe server running on port 3000"
  );
});