// src/pages/Shipping.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,   // ← REPLACED ShieldIcon
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppSelector } from "../store/hooks";

export default function Shipping() {
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
  const cartCount = useAppSelector((state) => state.cart.items.reduce((s, i) => s + i.quantity, 0));

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Topbar wishlistCount={wishlistCount} cartCount={cartCount} />

      <main className="flex-1 pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <TruckIcon className="w-16 h-16 mx-auto text-black mb-4" />
            <h1 className="text-4xl md:text-5xl font-light mb-4">Shipping & Delivery</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fast, reliable delivery across Nigeria. From Lagos to Kano, your order arrives safely.
            </p>
          </motion.section>

          {/* Delivery Timeline */}
          <section className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { city: "Lagos & Ogun", time: "1–2 business days", icon: ClockIcon, color: "bg-green-100" },
              { city: "Abuja, PH, Ibadan", time: "2–3 business days", icon: ClockIcon, color: "bg-blue-100" },
              { city: "Rest of Nigeria", time: "3–5 business days", icon: ClockIcon, color: "bg-purple-100" },
            ].map((zone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 text-center"
              >
                <div className={`w-12 h-12 ${zone.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <zone.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-medium text-lg mb-2">{zone.city}</h3>
                <p className="text-2xl font-bold">{zone.time}</p>
              </motion.div>
            ))}
          </section>

          {/* Free Shipping – FIXED ICON */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-black text-white rounded-2xl p-10 text-center mb-16"
          >
            <CheckCircleIcon className="w-12 h-12 mx-auto mb-4" /> {/* ← REPLACED */}
            <h2 className="text-3xl font-light mb-4">Free Shipping on Orders Over ₦50,000</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Spend ₦50,000 or more and enjoy complimentary delivery to any address in Nigeria.
            </p>
          </motion.section>

          {/* Partners */}
          <section className="mb-16">
            <h2 className="text-2xl font-medium text-center mb-8">Our Logistics Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "DHL", logo: "DHL" },
                { name: "NIPOST", logo: "NIPOST" },
                { name: "GIG Logistics", logo: "GIG" },
                { name: "Red Star Express", logo: "RedStar" },
              ].map((partner) => (
                <div
                  key={partner.name}
                  className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center h-24"
                >
                  <span className="text-xl font-bold text-gray-700">{partner.logo}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How to Track */}
          <section className="bg-white rounded-2xl shadow-sm p-8 mb-16">
            <h2 className="text-2xl font-medium mb-6 flex items-center gap-3">
              <MapPinIcon className="w-7 h-7" />
              How to Track Your Order
            </h2>
            <ol className="space-y-4 text-gray-700">
              <li className="flex gap-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span>Receive your order confirmation email with tracking number</span>
              </li>
              <li className="flex gap-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span>Click the tracking link or visit our <Link to="/orders" className="underline font-medium">Orders page</Link></span>
              </li>
              <li className="flex gap-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span>Get real-time updates until delivery</span>
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-2xl font-medium text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I change my delivery address?",
                  a: "Yes! Contact us within 2 hours of placing your order.",
                },
                {
                  q: "Do you ship to PO Boxes?",
                  a: "No, we require a physical address for secure delivery.",
                },
                {
                  q: "What if I’m not home?",
                  a: "Our partners will attempt delivery 2 more times or call you.",
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="bg-white rounded-lg shadow-sm p-6 cursor-pointer"
                >
                  <summary className="font-medium flex justify-between items-center">
                    {faq.q}
                    <span className="text-2xl">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Support */}
          <section className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-light mb-4">Need Help?</h2>
            <p className="text-lg mb-8 opacity-90">
              Our Lagos team is here 9am–6pm WAT, Monday–Saturday
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+2348012345678"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-100 transition"
              >
                <PhoneIcon className="w-5 h-5" />
                Call 080 1234 5678
              </a>
              <a
                href="mailto:support@anniepatricia.com"
                className="flex items-center justify-center gap-2 px-8 py-3 border border-white rounded-md font-medium hover:bg-white/10 transition"
              >
                <EnvelopeIcon className="w-5 h-5" />
                Email Us
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}