"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { allProducts } from "../components/data/products";

const newProducts = allProducts.filter(p => p.badge === "NEW" || p.badge === "FEATURED");
const SORTS = ["Newest","Price: Low to High","Price: High to Low"];
const CATS = ["All", ...Array.from(new Set(newProducts.map(p => p.category).filter(Boolean)))];

export default function NewArrivals() {
  const dispatch = useAppDispatch();
  const [sort, setSort] = useState("Newest");
  const [cat, setCat] = useState("All");
  const [addedId, setAddedId] = useState<number|null>(null);
  const [wishlist, setWishlist] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist")||"[]")); } catch { return new Set(); }
  });

  const products = useMemo(() => {
    let list = cat === "All" ? newProducts : newProducts.filter(p => p.category === cat);
    if (sort === "Price: Low to High") list = [...list].sort((a,b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a,b) => b.price - a.price);
    return list;
  }, [sort, cat]);

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

      {/* Hero */}
      <div className="relative bg-[#F7F5F2] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80" alt="" className="w-full h-full object-cover opacity-15" />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-6 lg:px-16 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-3">SS 2025</p>
            <h1 className="font-playfair text-5xl md:text-7xl font-semibold text-[#111] mb-4">New Arrivals</h1>
            <p className="text-gray-500 font-inter max-w-md">{products.length} newly added pieces, crafted by Nigeria's finest artisans.</p>
          </motion.div>
        </div>
      </div>

      {/* Filter + Sort bar */}
      <div className="sticky top-[104px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`flex-shrink-0 px-4 py-2 text-xs font-medium border transition-all ${cat === c ? "border-[#111] bg-[#111] text-white" : "border-gray-200 text-gray-600 hover:border-[#111]"}`}>
                {c}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="flex-shrink-0 text-xs border border-gray-200 px-3 py-2 text-[#111] focus:outline-none focus:border-[#111] bg-white cursor-pointer">
            {SORTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-12 pb-28 md:pb-12">
        <AnimatePresence mode="popLayout">
          <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => (
              <motion.article key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i*0.04, duration: .4 }} className="group">
                <Link to={`/product/${p.id}`}>
                  <div className="relative overflow-hidden bg-[#F5F4F0] aspect-[3/4] mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-106" loading="lazy" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="bg-[#111] text-white text-[10px] font-bold px-2.5 py-1 tracking-widest">NEW</span>
                    </div>
                    {/* Action strip */}
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button onClick={e => handleAdd(p, e)}
                        className={`flex-1 py-3 text-[11px] font-semibold tracking-widest transition-colors ${addedId===p.id ? "bg-[#B8860B] text-white" : "bg-white/95 text-[#111] hover:bg-[#111] hover:text-white"}`}>
                        {addedId===p.id ? "✓ ADDED" : "ADD TO BAG"}
                      </button>
                      <button onClick={e => toggleWish(p.id, e)}
                        className={`px-4 bg-white/95 border-l border-gray-100 text-base transition-colors hover:bg-gray-50 ${wishlist.has(p.id)?"text-red-400":"text-gray-400"}`}>
                        {wishlist.has(p.id)?"♥":"♡"}
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-inter mb-0.5">{p.designer}</p>
                  <h3 className="text-sm font-inter font-medium text-[#111] line-clamp-1 mb-1">{p.name}</h3>
                  <p className="text-sm font-semibold text-[#111]">₦{p.price.toLocaleString()}</p>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {products.length === 0 && (
          <div className="text-center py-24">
            <p className="font-playfair text-2xl text-gray-300 mb-3">No pieces in this category yet</p>
            <button onClick={() => setCat("All")} className="text-sm text-[#B8860B] underline">View all new arrivals</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
