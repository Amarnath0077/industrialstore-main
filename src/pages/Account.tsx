import {
  Package,
  Lock,
  Award,
  MapPin,
  CreditCard,
  Gift,
  Mail,
} from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const accountLinks = [
  {
    title: "Your Orders",
    desc: "Track, return, or buy things again",
    icon: Package,
    href: "/history",
  },
  {
    title: "Login & Security",
    desc: "Edit login, name, and mobile number",
    icon: Lock,
    href: "#",
  },
  {
    title: "Prime",
    desc: "View benefits and payment settings",
    icon: Award,
    href: "#",
  },
  {
    title: "Your Addresses",
    desc: "Edit addresses for orders and gifts",
    icon: MapPin,
    href: "#",
  },
  {
    title: "Payment Options",
    desc: "Edit or add payment methods",
    icon: CreditCard,
    href: "#",
  },
  {
    title: "Gift Cards",
    desc: "View balance or redeem a card",
    icon: Gift,
    href: "#",
  },
  {
    title: "Message Center",
    desc: "View messages from us and sellers",
    icon: Mail,
    href: "#",
  },
];

const recentlyViewed = [
  {
    id: 1,
    title: "Professional Grade Digital Precision Tool",
    price: 149.99,
    img: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Noise Cancelling Studio Headphones",
    price: 299.0,
    img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Compact Industrial Visual Capture System",
    price: 89.95,
    img: "https://images.unsplash.com/photo-1581092919535-7146ff1a590e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Mechanical Heavy-Duty Interface Device",
    price: 124.0,
    img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Account() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Your Account
      </h1>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {accountLinks.map((link, idx) => (
          <Link key={link.title} to={link.href}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border rounded-xl p-6 hover:shadow-lg transition cursor-pointer flex items-start gap-4 h-full"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <link.icon className="w-8 h-8 text-orange-500" />
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-1">
                  {link.title}
                </h2>

                <p className="text-sm text-gray-600">
                  {link.desc}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recently Viewed */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Recently Viewed
          </h2>

          <button className="text-orange-500 font-semibold hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recentlyViewed.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="aspect-square overflow-hidden rounded-lg mb-3">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-sm font-medium mb-2 min-h-[40px]">
                {product.title}
              </p>

              <span className="text-xl font-bold">
                ${product.price}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Inspired by your browsing history
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <Package className="w-12 h-12 text-gray-400" />
              </div>

              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded font-semibold">
                Best Seller
              </span>

              <p className="text-sm font-medium mt-3 mb-2 min-h-[40px]">
                Industrial Product Recommendation {i}
              </p>

              <span className="text-lg font-bold">
                $450.00
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}