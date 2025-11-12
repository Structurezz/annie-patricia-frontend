// src/pages/OrderDetail.tsx
"use client";

import React from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { SiVisa } from "react-icons/si";

import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppSelector } from "../store/hooks";

export default function OrderDetail() {
  const location = useLocation();
  const order = location.state as any;
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar wishlistCount={wishlistCount} cartCount={0} />
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h1 className="text-3xl font-light mb-2">Order {order.id}</h1>
          </motion.div>

          {/* Reuse Order.tsx layout here */}
          {/* ... (copy from Order.tsx body) */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" /> Shipping Address
            </h2>
            <p className="font-medium">Chioma Okeke</p>
            <p className="text-sm text-gray-600">12 Adeola Odeku, Lagos, Lagos 100001</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-medium mb-4">Items</h2>
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between py-3 border-b last:border-0">
                <span>{item.name} × {item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t font-medium text-lg">
              Total: ₦{order.total.toLocaleString()}
            </div>
          </div>

          <div className="text-center">
            <Link to="/orders" className="text-black hover:underline">
              ← Back to Orders
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}