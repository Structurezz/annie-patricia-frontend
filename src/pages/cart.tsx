"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const TrashIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
        <TopBar />
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
            🛍️
          </div>
          <h2 className="font-cormorant text-4xl font-light text-[#0A0908]">Your bag is empty</h2>
          <p className="text-[#7A7571] mt-3 mb-10 max-w-xs">Add some beautiful pieces to get started.</p>
          <Link 
            to="/category" 
            className="bg-[#0A0908] hover:bg-black text-white px-12 py-4 text-sm tracking-widest transition-all"
          >
            START SHOPPING
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <TopBar />

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 lg:px-12 xl:px-16 py-12">
        <div className="mb-12">
          <h1 className="font-cormorant text-5xl font-light tracking-tight text-[#0A0908]">
            Shopping Bag
          </h1>
          <p className="text-[#7A7571] mt-2">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Cart Items Section */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="bg-white border border-[#E0DBD4] p-6 flex gap-6 group"
                >
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-28 h-36 bg-[#F5F4F0] overflow-hidden rounded">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <div>
                      <p className="text-xs tracking-[1px] text-[#C9A84C] uppercase font-medium">{item.designer}</p>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-lg font-medium leading-tight mt-1 hover:text-[#C9A84C] transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <div className="flex border border-[#E0DBD4]">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-[#FAFAF8] text-xl text-[#7A7571] hover:text-black"
                        >
                          −
                        </button>
                        <span className="w-12 flex items-center justify-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-[#FAFAF8] text-xl text-[#7A7571] hover:text-black"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-5">
                        <p className="font-semibold text-lg">₦{(item.price * item.quantity).toLocaleString()}</p>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link to="/category" className="inline-flex text-sm text-[#7A7571] hover:text-black mt-4 transition-colors">
              ← Continue Shopping
            </Link>
          </div>

          {/* FIXED STICKY ORDER SUMMARY - This is the important part */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-8 bg-white border border-[#E0DBD4] p-8 shadow-sm">
              <h2 className="font-cormorant text-3xl font-light mb-8">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A7571]">Subtotal ({cartCount} items)</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A7571]">Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600" : ""}>
                    {shipping === 0 ? "FREE" : `₦${shipping.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {subtotal < 50000 && (
                <p className="text-xs text-[#C9A84C] mt-4">
                  Add ₦{(50000 - subtotal).toLocaleString()} more for free delivery
                </p>
              )}

              <div className="border-t border-[#E0DBD4] my-8" />

              <div className="flex justify-between items-baseline mb-8">
                <span className="text-lg">Total</span>
                <span className="text-2xl font-semibold">₦{total.toLocaleString()}</span>
              </div>

              {/* Coupon */}
              <div className="mb-8">
                <div className="flex border border-[#E0DBD4] focus-within:border-black">
                  <input 
                    type="text" 
                    placeholder="Coupon code" 
                    className="flex-1 px-4 py-3 text-sm outline-none" 
                  />
                  <button className="px-6 text-xs tracking-widest text-[#C9A84C] hover:text-black font-medium">
                    APPLY
                  </button>
                </div>
              </div>

              <Link to="/checkout">
                <button className="w-full bg-[#0A0908] hover:bg-black py-4 text-white tracking-[1.5px] text-sm font-medium transition-all">
                  PROCEED TO CHECKOUT
                </button>
              </Link>

              <div className="text-center text-[10px] tracking-widest text-[#C9C4BC] mt-8">
                SECURE CHECKOUT • EASY RETURNS
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