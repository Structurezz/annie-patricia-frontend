"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { allProducts } from "../components/data/products";

const bestsellers = allProducts.filter(p => p.badge === "BESTSELLER");
const allBest = bestsellers.length > 0 ? bestsellers : allProducts.slice(0, 20);

export default function Bestsellers() {
  const dispatch = useAppDispatch();
  const [addedId, setAddedId] = useState<number|null>(null);
  const [wishlist, setWishlist] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist")||"[]")); } catch { return new Set(); }
  });

  const handleAdd = (p: typeof allProducts[0], e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    dispatch(addToCart({ id: p.id, name: p.name, designer: p.designer, price: p.price, image: p.image }));
    setAddedId(p.id); setTimeout(() => setAddedId(null), 1500);
  };
  const toggleWish = (id: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWishlist(prev => {
      const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id);
      localStorage.setItem("wishlist", JSON.stringify([...s])); return s;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Topbar />

      {/* Hero banner */}
      <div className="relative bg-[#111] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1441986300917-6467269125f2?w=1400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative max-w-screen-xl mx-auto px-6 lg:px-16 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-3">Customer Favourites</p>
            <h1 className="font-playfair text-5xl md:text-7xl font-semibold text-white mb-4">Bestsellers</h1>
            <p className="text-white/40 font-inter max-w-md">Our most-loved pieces — chosen by thousands of customers across Nigeria and beyond.</p>
          </motion.div>
          {/* Trust strip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }} className="flex flex-wrap gap-6 mt-10">
            {["★ 4.9/5 Average Rating","🚚 Free Delivery Over ₦50k","↩️ 30-Day Easy Returns"].map(t => (
              <span key={t} className="text-xs text-white/50 font-inter">{t}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-16">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-xs tracking-[0.3em] text-[#B8860B] uppercase font-inter text-center mb-10">
          This Week's Top Picks
        </motion.p>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {allBest.slice(0,3).map((p, i) => {
            const medals = ["🥇","🥈","🥉"];
            const heights = ["aspect-[3/4]","aspect-[3/5]","aspect-[3/4]"];
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*.12 }} className="group">
                <Link to={`/product/${p.id}`} className="block">
                  <div className={`relative overflow-hidden bg-[#F5F4F0] ${heights[i]} mb-4`}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Rank badge */}
                    <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg">
                      {medals[i]}
                    </div>
                    {/* Add to bag overlay */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button onClick={e => handleAdd(p, e)}
                        className={`w-full py-3.5 text-xs font-semibold tracking-widest transition-colors ${addedId===p.id ? "bg-[#B8860B] text-white":"bg-white text-[#111] hover:bg-[#111] hover:text-white"}`}>
                        {addedId===p.id ? "✓ ADDED" : "ADD TO BAG"}
                      </button>
                    </div>
                    {/* Wishlist */}
                    <button onClick={e => toggleWish(p.id, e)}
                      className={`absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow transition-colors ${wishlist.has(p.id)?"text-red-400":"text-gray-400 hover:text-red-400"}`}>
                      {wishlist.has(p.id)?"♥":"♡"}
                    </button>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-inter mb-0.5">{p.designer}</p>
                  <h3 className="font-playfair text-base font-semibold text-[#111] line-clamp-1 mb-1">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#111]">₦{p.price.toLocaleString()}</p>
                    <div className="flex gap-0.5">{[...Array(5)].map((_,x)=><span key={x} className="text-[#B8860B] text-xs">★</span>)}</div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gray-100" />
          <p className="text-xs tracking-[0.3em] text-gray-400 font-inter uppercase whitespace-nowrap">All Bestsellers</p>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Full grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-24 md:pb-6">
          {allBest.map((p, i) => (
            <motion.article key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i%4)*.06 }} className="group">
              <Link to={`/product/${p.id}`}>
                <div className="relative overflow-hidden bg-[#F5F4F0] aspect-[3/4] mb-3">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-106" loading="lazy" />
                  <span className="absolute top-2.5 left-2.5 bg-[#B8860B] text-white text-[10px] font-bold px-2.5 py-1 tracking-widest">#{i+1}</span>
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button onClick={e => handleAdd(p, e)}
                      className={`flex-1 py-3 text-[11px] font-semibold tracking-widest ${addedId===p.id?"bg-[#B8860B] text-white":"bg-white/95 text-[#111] hover:bg-[#111] hover:text-white"} transition-colors`}>
                      {addedId===p.id?"✓":"ADD TO BAG"}
                    </button>
                    <button onClick={e => toggleWish(p.id, e)}
                      className={`px-4 bg-white/95 border-l border-gray-100 text-base hover:bg-gray-50 ${wishlist.has(p.id)?"text-red-400":"text-gray-400"}`}>
                      {wishlist.has(p.id)?"♥":"♡"}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">{p.designer}</p>
                <h3 className="text-sm font-medium text-[#111] line-clamp-1 mb-1">{p.name}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#111]">₦{p.price.toLocaleString()}</p>
                  <div className="flex gap-0.5">{[...Array(5)].map((_,x)=><span key={x} className="text-[#B8860B] text-[10px]">★</span>)}</div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
