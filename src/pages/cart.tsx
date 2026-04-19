"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const TrashIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <TopBar />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24">
          <div className="w-16 h-16 border-2 border-gray-200 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl">🛍️</span>
          </div>
          <h2 className="font-playfair text-2xl font-semibold text-[#111111] mb-2">Your bag is empty</h2>
          <p className="text-gray-400 text-sm font-inter mb-8">Add some pieces to get started</p>
          <Link to="/category" className="bg-[#111111] text-white text-sm font-medium px-10 py-3.5 hover:bg-[#B8860B] transition-colors tracking-wide">
            START SHOPPING
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 lg:px-16 py-10 pb-28 md:pb-10">
        <h1 className="font-playfair text-3xl font-semibold text-[#111111] mb-2">Shopping Bag</h1>
        <p className="text-sm text-gray-400 font-inter mb-10">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 sm:gap-6 p-4 sm:p-5 border border-gray-100 hover:border-gray-200 transition-colors bg-white"
                >
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-32 sm:w-28 sm:h-36 bg-[#F5F4F0] overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-inter mb-0.5">{item.designer}</p>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-sm sm:text-base font-inter font-medium text-[#111111] hover:text-[#B8860B] transition-colors line-clamp-2">{item.name}</h3>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty */}
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#111111] hover:bg-gray-50 transition-colors text-lg leading-none"
                        >
                          −
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center text-sm font-medium font-inter border-x border-gray-200">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#111111] hover:bg-gray-50 transition-colors text-lg leading-none"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="text-sm font-semibold font-inter text-[#111111]">₦{(item.price * item.quantity).toLocaleString()}</p>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link to="/category" className="inline-block text-sm text-gray-500 hover:text-[#111111] transition-colors font-inter mt-2">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#FAFAF8] border border-gray-100 p-6 sticky top-32">
              <h2 className="font-playfair text-xl font-semibold text-[#111111] mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-gray-500">Subtotal ({cartCount} items)</span>
                  <span className="text-[#111111] font-medium">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "text-[#111111] font-medium"}>
                    {shipping === 0 ? "FREE" : `₦${shipping.toLocaleString()}`}
                  </span>
                </div>
                {subtotal < 50000 && (
                  <p className="text-[11px] text-[#B8860B] font-inter">
                    Add ₦{(50000 - subtotal).toLocaleString()} more for free delivery
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-inter font-semibold text-[#111111]">Total</span>
                  <span className="font-inter font-bold text-lg text-[#111111]">₦{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon code */}
              <div className="mb-5">
                <div className="flex border border-gray-200 focus-within:border-[#111111] transition-colors">
                  <input type="text" placeholder="Coupon code" className="flex-1 px-3 py-2.5 text-sm font-inter text-[#111111] placeholder-gray-300 outline-none bg-transparent" />
                  <button className="px-4 text-xs font-medium text-[#B8860B] hover:text-[#111111] transition-colors border-l border-gray-200 font-inter">
                    APPLY
                  </button>
                </div>
              </div>

              <Link to="/checkout" className="block w-full">
                <button className="w-full bg-[#111111] text-white py-4 text-sm font-medium tracking-wider hover:bg-[#B8860B] transition-colors font-inter">
                  PROCEED TO CHECKOUT
                </button>
              </Link>

              {/* Trust badges */}
              <div className="mt-5 flex items-center justify-center gap-4 text-[10px] text-gray-400 font-inter">
                <span>🔒 Secure Payment</span>
                <span>•</span>
                <span>↩️ Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
