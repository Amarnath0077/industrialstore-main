import {
  Wrench,
  ShieldCheck,
  Fan,
  Zap,
  Truck,
  Droplets,
  Construction,
  Trash2,
  Building2,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Power Tools",
    icon: Wrench,
    items: [
      "Drills & Drivers",
      "Saws & Cutting",
      "Grinders & Polishers",
      "Pneumatic Tools",
      "Sanders & Finishers",
    ],
    link: "#",
    cta: "Shop All Power Tools",
  },
  {
    title: "Safety Equipment",
    icon: ShieldCheck,
    items: [
      "Protective Eyewear",
      "Hard Hats & Helmets",
      "Respiratory Protection",
      "Work Gloves & Hand Protection",
      "Fall Protection Harnesses",
    ],
    link: "#",
    cta: "Shop All PPE",
  },
  {
    title: "HVAC",
    icon: Fan,
    items: [
      "Air Conditioners & Units",
      "Fans & Ventilation",
      "Heating Equipment",
      "Ducting & Fittings",
      "Thermostats & Controls",
    ],
    link: "#",
    cta: "Shop All HVAC",
  },
  {
    title: "Electrical",
    icon: Zap,
    items: [
      "Conduit & Raceway",
      "Wire & Cable",
      "Circuit Breakers & Panels",
      "Industrial Lighting",
      "Test & Measurement",
    ],
    link: "/circuit-breakers",
    cta: "Shop All Electrical",
  },
  {
    title: "Material Handling",
    icon: Truck,
    items: [
      "Carts & Trucks",
      "Conveyors",
      "Lifting & Rigging",
      "Storage Shelving",
      "Packaging & Shipping",
    ],
    link: "#",
    cta: "Shop All Material Handling",
  },
  {
    title: "Plumbing",
    icon: Droplets,
    items: [
      "Pipes & Tubing",
      "Valves & Fittings",
      "Pumps & Accessories",
      "Hoses & Couplings",
      "Water Heaters",
    ],
    link: "#",
    cta: "Shop All Plumbing",
  },
  {
    title: "Building Materials",
    icon: Construction,
    items: [
      "Fasteners & Anchors",
      "Structural Steel",
      "Lumber & Sheet Goods",
      "Insulation & Sealants",
      "Roofing & Siding",
    ],
    link: "#",
    cta: "Shop All Materials",
  },
  {
    title: "Janitorial",
    icon: Trash2,
    items: [
      "Cleaning Chemicals",
      "Floor Care Equipment",
      "Trash Cans & Liners",
      "Paper Products",
      "Spill Control",
    ],
    link: "#",
    cta: "Shop All Janitorial",
  },
];

export default function Departments() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="relative mb-12 rounded-xl overflow-hidden h-64 flex items-end p-10 bg-gray-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1600&auto=format&fit=crop')",
          }}
        />

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black mb-3"
          >
            All Departments
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-sm text-gray-200"
          >
            Browse our complete catalog of industrial supplies,
            safety equipment, heavy machinery, and precision tools.
          </motion.p>
        </div>
      </section>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 border-b pb-3 mb-4">
              <cat.icon className="w-5 h-5 text-orange-500" />

              <h2 className="text-lg font-bold">{cat.title}</h2>
            </div>

            <ul className="space-y-2 min-h-[160px]">
              {cat.items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-700 hover:text-orange-500 transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            <Link
              to={cat.link}
              className="text-sm font-semibold text-orange-500 flex items-center gap-1 mt-4"
            >
              {cat.cta}

              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom Cards */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="md:col-span-2 bg-orange-500 text-white p-8 rounded-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">
              Wholesale Accounts
            </h3>

            <p className="text-sm mb-6 max-w-md">
              Apply for industrial-grade credit lines and
              tax-exempt status for your enterprise.
            </p>

            <Link
              to="/pro-account"
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold inline-block"
            >
              Request Account
            </Link>
          </div>

          <Building2 className="absolute right-0 bottom-0 w-32 h-32 opacity-10" />
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white border rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm"
        >
          <Truck className="w-12 h-12 text-orange-500 mb-3" />

          <h3 className="text-lg font-bold">
            Same Day Delivery
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            Order before 10 AM for same-day site delivery.
          </p>
        </motion.div>
      </section>
    </div>
  );
}