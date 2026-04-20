"use client";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { womenProducts, womenCategories } from "../components/data/products";

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: .6 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: .07 } } };

function ProductCard({ p }: { p: typeof womenProducts[0] }) {
  const dispatch = useAppDispatch();
  const [wish, setWish] = useState(() => {
    try { return (JSON.parse(localStorage.getItem("wishlist") || "[]") as number[]).includes(p.id); } catch { return false; }
  });
  const [added, setAdded] = useState(false);
  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({ id: p.id, name: p.name, designer: p.designer, price: p.price, image: p.image }));
    setAdded(true); setTimeout(() => setAdded(false), 1400);
  };
  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    const stored: number[] = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const next = wish ? stored.filter(id => id !== p.id) : [...stored, p.id];
    localStorage.setItem("wishlist", JSON.stringify(next));
    setWish(!wish);
  };
  const badgeStyle: Record<string, string> = { NEW: "bg-[#0B0A09] text-white", BESTSELLER: "bg-[#C9A84C] text-[#0B0A09]", SALE: "bg-red-500 text-white" };
  return (
    <Link to={`/product/${p.id}`} className="product-card group block">
      <div className="relative overflow-hidden bg-[#F2EDE4] aspect-[3/4]">
        <img src={p.image} alt={p.name} loading="lazy" className="card-img w-full h-full object-cover" />
        {p.badge && badgeStyle[p.badge] && <span className={`badge absolute top-2.5 left-2.5 ${badgeStyle[p.badge]}`}>{p.badge}</span>}
        <button onClick={handleWish} className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-xs ${wish ? "text-red-500" : "text-[#7A7571] hover:text-red-400"}`}>{wish ? "♥" : "♡"}</button>
        <div className="card-actions absolute inset-x-0 bottom-0">
          <button onClick={handleCart} className={`w-full py-2.5 text-[10px] font-inter font-semibold tracking-[.18em] transition-colors ${added ? "bg-[#C9A84C] text-[#0B0A09]" : "bg-white text-[#0B0A09] hover:bg-[#0B0A09] hover:text-white"}`}>{added ? "✓ ADDED" : "ADD TO BAG"}</button>
        </div>
      </div>
      <div className="pt-2.5 pb-3">
        <p className="text-[9px] uppercase tracking-[.2em] text-[#7A7571] font-inter mb-0.5">{p.designer}</p>
        <p className="text-[12.5px] font-inter text-[#1A1916] line-clamp-2 mb-1">{p.name}</p>
        <p className="text-[13px] font-semibold font-inter text-[#0B0A09]">₦{p.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

export default function WomenHome() {
  const r1 = useRef(null); const v1 = useInView(r1, { once: true, margin: "-80px" });
  const r2 = useRef(null); const v2 = useInView(r2, { once: true, margin: "-80px" });
  const bestsellers = womenProducts.filter(p => p.badge === "BESTSELLER").slice(0, 8);
  const newArrivals = womenProducts.filter(p => p.badge === "NEW").slice(0, 8);
  const cats = womenCategories.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Topbar />

      {/* HERO */}
      <section className="relative h-[82vh] min-h-[500px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=1600&q=85" alt="Women" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09]/80 via-[#0B0A09]/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-xl">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}
            className="text-[10px] tracking-[.5em] text-[#C9A84C] font-inter uppercase mb-4">Women's Collection · SS 2025</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .1 }}
            className="font-cormorant text-[clamp(3rem,7vw,5.5rem)] font-light text-white leading-[1.05] mb-6">
            She Wears<br /><em className="italic text-[#C9A84C]">Heritage.</em>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }} className="flex gap-3">
            <Link to="/women/shop" className="px-8 py-3.5 bg-[#C9A84C] text-[#0B0A09] text-[11px] font-inter font-semibold tracking-[.2em] hover:bg-[#E2C97E] transition-colors">SHOP ALL WOMEN</Link>
            <Link to="/new-arrivals" className="px-8 py-3.5 border border-white/40 text-white text-[11px] font-inter tracking-[.2em] hover:border-white hover:bg-white/10 transition-colors">NEW IN</Link>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <div className="bg-[#F7F4EF] border-b border-[#E6E1DA]">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {cats.map(cat => (
            <Link key={cat} to={`/category?category=${cat}`}
              className="flex-shrink-0 px-4 py-2 text-[10px] font-inter tracking-[.15em] border border-[#E6E1DA] text-[#7A7571] hover:border-[#0B0A09] hover:text-[#0B0A09] transition-colors">
              {cat.toUpperCase()}
            </Link>
          ))}
          <Link to="/women/shop" className="flex-shrink-0 px-4 py-2 text-[10px] font-inter tracking-[.15em] bg-[#0B0A09] text-white">VIEW ALL →</Link>
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <section className="max-w-screen-xl mx-auto px-5 lg:px-10 py-14 md:py-18">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[.4em] text-[#C9A84C] font-inter uppercase mb-2">Just Landed</p>
            <h2 className="font-cormorant text-[clamp(1.8rem,4vw,3rem)] font-light text-[#0B0A09]">New Arrivals</h2>
          </div>
          <Link to="/new-arrivals" className="text-[11px] font-inter font-medium tracking-[.18em] text-[#0B0A09] border-b border-[#0B0A09] pb-px hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">View all →</Link>
        </div>
        <motion.div ref={r1} initial="hidden" animate={v1 ? "show" : "hidden"} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {newArrivals.map(p => <motion.div key={p.id} variants={fadeUp}><ProductCard p={p} /></motion.div>)}
        </motion.div>
      </section>

      {/* EDITORIAL */}
      <section className="relative overflow-hidden h-[420px] md:h-[500px] mx-5 lg:mx-10 mb-14 md:mb-18">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85" alt="Editorial" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09]/75 via-[#0B0A09]/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-16 max-w-lg">
          <p className="text-[10px] tracking-[.4em] text-[#C9A84C] font-inter uppercase mb-3">Aso-oke Collection</p>
          <h2 className="font-cormorant text-[clamp(2.2rem,5vw,4rem)] font-light text-white mb-5">Nigerian fashion deserves a seat at the global table.</h2>
          <Link to="/category?category=Asoeke" className="self-start px-8 py-3 border border-[#C9A84C] text-[#C9A84C] text-[10px] font-inter tracking-[.2em] hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-colors">SHOP ASO-OKE</Link>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bg-[#F7F4EF] py-14 md:py-18">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] tracking-[.4em] text-[#C9A84C] font-inter uppercase mb-2">Customer Favourites</p>
              <h2 className="font-cormorant text-[clamp(1.8rem,4vw,3rem)] font-light text-[#0B0A09]">Bestsellers</h2>
            </div>
            <Link to="/bestsellers" className="text-[11px] font-inter font-medium tracking-[.18em] text-[#0B0A09] border-b border-[#0B0A09] pb-px hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">View all →</Link>
          </div>
          <motion.div ref={r2} initial="hidden" animate={v2 ? "show" : "hidden"} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {bestsellers.map(p => <motion.div key={p.id} variants={fadeUp}><ProductCard p={p} /></motion.div>)}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
