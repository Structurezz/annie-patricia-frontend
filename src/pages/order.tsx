// src/pages/Orders.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArchiveBoxIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppSelector } from "../store/hooks";
// ── Mock Orders (in real app: from Redux / API) ──
interface OrderSummary {
  id: string;
  date: string;
  status: "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  itemCount: number;
  items: Array<{
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
}

const mockOrders: OrderSummary[] = [
  {
    id: "ORD-ABC123XYZ",
    date: "Nov 8, 2025",
    status: "delivered",
    total: 81000,
    itemCount: 3,
    items: [
      { id: 1, name: "Silk Gown", image: "/api/placeholder/100/100", price: 45000, quantity: 1 },
      { id: 2, name: "Beaded Clutch", image: "/api/placeholder/100/100", price: 18000, quantity: 2 },
    ],
  },
  {
    id: "ORD-DEF456UVW",
    date: "Nov 5, 2025",
    status: "shipped",
    total: 52000,
    itemCount: 1,
    items: [
      { id: 3, name: "Ankara Maxi Dress", image: "/api/placeholder/100/100", price: 52000, quantity: 1 },
    ],
  },
  {
    id: "ORD-GHI789RST",
    date: "Oct 30, 2025",
    status: "processing",
    total: 125000,
    itemCount: 2,
    items: [
      { id: 4, name: "Leather Handbag", image: "/api/placeholder/100/100", price: 75000, quantity: 1 },
      { id: 5, name: "Gold Earrings", image: "/api/placeholder/100/100", price: 50000, quantity: 1 },
    ],
  },
];

export default function Orders() {
  const navigate = useNavigate();
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
  }, []);

  const statusConfig = {
    paid: { color: "bg-green-100 text-green-800", icon: CheckCircleIcon },
    processing: { color: "bg-yellow-100 text-yellow-800", icon: ClockIcon },
    shipped: { color: "bg-blue-100 text-blue-800", icon: TruckIcon },
    delivered: { color: "bg-purple-100 text-purple-800", icon: ArchiveBoxIcon }, 
    cancelled: { color: "bg-red-100 text-red-800", icon: XCircleIcon },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Topbar wishlistCount={wishlistCount} cartCount={0} />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Topbar wishlistCount={wishlistCount} cartCount={0} />
        <main className="flex-1 pt-24 pb-12 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8"
            >
             <ArchiveBoxIcon className="w-24 h-24 mx-auto text-gray-300" />
            </motion.div>
            <h2 className="text-2xl font-light mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping and your orders will appear here.</p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition"
            >
              Shop Now
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar wishlistCount={wishlistCount} cartCount={0} />

      <main className="flex-1 pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-light text-center mb-10"
          >
            My Orders
          </motion.h1>

          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, idx) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/order/${order.id}`, { state: order })}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-mono text-lg font-medium">{order.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              statusConfig[order.status].color
                            }`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <div className="text-sm text-gray-600">
                            {order.date}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col md:flex-row gap-6">
                        {/* Items Preview */}
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <div
                              key={i}
                              className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden border"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {order.itemCount > 3 && (
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 border">
                              +{order.itemCount - 3}
                            </div>
                          )}
                        </div>

                        {/* Summary */}
                        <div className="flex-1 flex items-center justify-between md:justify-end gap-6 text-sm">
                          <div className="text-right">
                            <p className="text-gray-500">Total</p>
                            <p className="font-medium text-lg">₦{order.total.toLocaleString()}</p>
                          </div>
                          <button className="text-black font-medium hover:underline">
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Continue Shopping */}
          <div className="mt-12 text-center">
            <Link
              to="/category"
              className="inline-block px-8 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}