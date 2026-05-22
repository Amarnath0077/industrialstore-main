import {
  Lock,
  ShieldCheck,
  Undo2,
  Loader2,
  Banknote,
} from "lucide-react";

import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { useAuth } from "../lib/AuthContext";

import { dbService } from "../lib/dbService";

import { CartItem } from "../lib/types";

export default function Checkout() {

  const navigate = useNavigate();

  const { user, login } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [placing, setPlacing] = useState(false);

  const [shippingOption, setShippingOption] =
    useState("std");

  const [paymentMethod, setPaymentMethod] =
    useState("card");

  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "IL",
    zip: "",
    phone: "",
  });

  useEffect(() => {

    let unsubscribeFn: any;

    const loadData = async () => {

      try {

        unsubscribeFn =
          dbService.getCartItems(
            user?.uid || null,
            (cartItems) => {
              setItems(cartItems || []);
              setLoading(false);
            }
          );

      } catch (err) {

        console.error(err);

        setLoading(false);
      }
    };

    loadData();

    return () => {
      if (typeof unsubscribeFn === "function") {
        unsubscribeFn();
      }
    };

  }, [user]);

  const deliveryOptions = [
    {
      id: "std",
      title: "Standard Delivery",
      price: 0,
    },
    {
      id: "exp",
      title: "Expedited Delivery",
      price: 14.99,
    },
    {
      id: "next",
      title: "Next Day Air",
      price: 29.99,
    },
  ];

  const subtotal = items.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const shippingCharge =
    deliveryOptions.find(
      (o) => o.id === shippingOption
    )?.price || 0;

  const tax = subtotal * 0.06;

  const total =
    subtotal + shippingCharge + tax;

  const handlePlaceOrder = async () => {

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (
      !formData.fullName ||
      !formData.street ||
      !formData.city ||
      !formData.zip
    ) {
      alert("Please fill all address fields.");
      return;
    }

    setPlacing(true);

    try {

      // STRIPE PAYMENT
      if (paymentMethod === "card") {

        const response = await fetch(
          "/api/create-checkout-session",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              items: items.map((item) => ({
                name: item.title,
                price: item.price,
                quantity: item.quantity,
                img: item.img,
              })),

              successUrl:
                `${window.location.origin}/order-success`,

              cancelUrl:
                `${window.location.origin}/checkout`,
            }),
          }
        );

        const session =
          await response.json();

        if (session.error) {
          throw new Error(session.error);
        }

        // OPEN STRIPE CARD PAGE
        if (session.url) {

          window.location.href =
            session.url;

          return;
        }

        throw new Error(
          "Stripe checkout failed."
        );
      }

      // CASH ON DELIVERY ONLY
      if (paymentMethod === "cod") {

        const orderPayload = {
          items,
          subtotal,
          tax,
          total,
          shippingAddress: formData,
          paymentMethod,
          status: "pending",
        };

        const orderId =
          await dbService.placeOrder(
            user.uid,
            orderPayload
          );

        navigate("/order-success", {
          state: {
            orderId,
            total,
          },
        });
      }

    } catch (error: any) {

      console.error(error);

      alert(
        error.message ||
        "Checkout failed."
      );

    } finally {

      setPlacing(false);

    }
  };

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-slate-900 text-white py-4 px-6">

        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <Link
            to="/"
            className="text-3xl font-black"
          >
            IndustrialStore
          </Link>

          <div className="flex items-center gap-2">

            <Lock className="w-5 h-5" />

            <span className="font-semibold">
              Secure Checkout
            </span>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-8 space-y-8">

          {/* SHIPPING */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >

            <h2 className="text-2xl font-bold mb-6">
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                  })
                }
                className="border p-3 rounded-lg"
              />

              <input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                className="border p-3 rounded-lg"
              />

              <input
                placeholder="Street"
                value={formData.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    street: e.target.value,
                  })
                }
                className="border p-3 rounded-lg md:col-span-2"
              />

              <input
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city: e.target.value,
                  })
                }
                className="border p-3 rounded-lg"
              />

              <input
                placeholder="ZIP"
                value={formData.zip}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    zip: e.target.value,
                  })
                }
                className="border p-3 rounded-lg"
              />

            </div>
          </motion.section>

          {/* DELIVERY */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >

            <h2 className="text-2xl font-bold mb-6">
              Delivery Options
            </h2>

            <div className="space-y-4">

              {deliveryOptions.map((opt) => (

                <label
                  key={opt.id}
                  className="flex items-center justify-between border rounded-lg p-4 cursor-pointer"
                >

                  <div className="flex items-center gap-3">

                    <input
                      type="radio"
                      checked={
                        shippingOption === opt.id
                      }
                      onChange={() =>
                        setShippingOption(opt.id)
                      }
                    />

                    <span className="font-medium">
                      {opt.title}
                    </span>

                  </div>

                  <span className="font-bold">
                    ${opt.price}
                  </span>

                </label>
              ))}
            </div>
          </motion.section>

          {/* PAYMENT */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >

            <h2 className="text-2xl font-bold mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">

              <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">

                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  onChange={() =>
                    setPaymentMethod("card")
                  }
                />

                <span className="font-medium">
                  Credit/Debit Card
                </span>

              </label>

              <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">

                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() =>
                    setPaymentMethod("cod")
                  }
                />

                <div className="flex items-center gap-2">

                  <Banknote className="w-5 h-5 text-green-600" />

                  <span className="font-medium">
                    Cash on Delivery
                  </span>

                </div>
              </label>
            </div>
          </motion.section>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4">

          <aside className="sticky top-24">

            <div className="bg-white rounded-xl p-6 shadow-sm">

              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-3">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    ${shippingCharge.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-2xl font-black pt-4 border-t">
                  <span>Total</span>

                  <span>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {!user ? (

                <button
                  onClick={login}
                  className="w-full mt-8 bg-orange-500 text-white py-4 rounded-xl font-bold"
                >
                  Sign In
                </button>

              ) : (

                <button
                  onClick={handlePlaceOrder}
                  disabled={
                    placing ||
                    items.length === 0
                  }
                  className="w-full mt-8 bg-orange-500 text-white py-4 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >

                  {placing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}

                  {placing
                    ? "Processing..."
                    : paymentMethod === "card"
                    ? "Pay with Stripe"
                    : "Place Order"}

                </button>
              )}

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-2 text-gray-500">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm">
                    Secure Checkout
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  <Undo2 className="w-5 h-5" />
                  <span className="text-sm">
                    Easy Returns
                  </span>
                </div>

              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
