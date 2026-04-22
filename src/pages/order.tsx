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
import { get } from "../services/api"; // Importing your API utility

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface OrderSummary {
  id: string;
  date: string;
  status: "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  itemCount: number;
  items: OrderItem[];
}

export default function Orders() {
  const navigate = useNavigate();
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Fetching real orders from your backend
        const data = await get<OrderSummary[]>("/orders");
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
        <Topbar wishlistCount={wishlistCount} cartCount={cartCount} />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">Retrieving your order history...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Topbar wishlistCount={wishlistCount} cartCount={cartCount} />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center p-6">
            <XCircleIcon className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <p className="text-gray-800 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-black text-white rounded-md text-sm"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Topbar wishlistCount={wishlistCount} cartCount={cartCount} />
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
            <p className="text-gray-600 mb-6">Your shopping journey hasn't started yet. Let's change that!</p>
            <Link
              to="/category"
              className="inline-block px-8 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition"
            >
              Explore Collection
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar wishlistCount={wishlistCount} cartCount={cartCount} />

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
                const config = statusConfig[order.status] || statusConfig.processing;
                const StatusIcon = config.icon;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.005 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                    onClick={() => navigate(`/order/${order.id}`, { state: order })}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Order Reference</p>
                          <p className="font-mono text-lg font-medium text-gray-900">{order.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <div className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString('en-NG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col md:flex-row gap-8 items-center">
                        {/* Items Preview */}
                        <div className="flex -space-x-4 overflow-hidden">
                          {order.items.slice(0, 4).map((item, i) => (
                            <div
                              key={i}
                              className="inline-block h-16 w-16 rounded-full ring-4 ring-white bg-gray-100 overflow-hidden border border-gray-100"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                          {order.itemCount > 4 && (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-white ring-4 ring-white text-xs font-bold">
                              +{order.itemCount - 4}
                            </div>
                          )}
                        </div>

                        {/* Summary */}
                        <div className="flex-1 flex w-full items-center justify-between md:justify-end gap-10">
                          <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase font-bold">Total Amount</p>
                            <p className="font-medium text-xl text-gray-900">₦{order.total.toLocaleString()}</p>
                          </div>
                          <div className="hidden sm:block">
                            <button className="px-5 py-2 border border-black text-sm font-medium rounded hover:bg-black hover:text-white transition-colors">
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/category"
              className="text-gray-500 hover:text-black transition-colors text-sm flex items-center justify-center gap-2"
            >
              <ArchiveBoxIcon className="w-4 h-4" />
              Back to Collections
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}