"use client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { allProducts } from "../components/data/products";

const bestsellers = allProducts.filter(p => p.badge === "BESTSELLER");
const allBest = bestsellers.length > 0 ? bestsellers : allProducts.slice(0, 24);

export default function Bestsellers() {
  const dispatch = useAppDispatch();
  const [addedId, setAddedId] = useState<number|null>(null);
  const [wish, setWish] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist")||"[]")); } catch { return new Set(); }
  });

  const handleAdd = (p: typeof allProducts[0], e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    dispatch(addToCart({ id:p.id, name:p.name, designer:p.designer, price:p.price, image:p.image }));
    setAddedId(p.id); setTimeout(()=>setAddedId(null), 1500);
  };
  const toggleWish = (id: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWish(prev => {
      const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id);
      localStorage.setItem("wishlist", JSON.stringify([...s])); return s;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Topbar />

      {/* Hero */}
      <div className="relative bg-[#0A0908] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1441986300917-6467269125f2?w=1400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="relative max-w-screen-xl mx-auto px-6 lg:px-16 py-16 md:py-24">
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.55em] font-inter uppercase mb-3 flex items-center gap-3">
              <span className="w-6 h-px bg-[#C9A84C]" /> Customer Favourites
            </p>
            <h1 className="font-cormorant text-[clamp(3rem,8vw,6.5rem)] font-light text-white leading-none mb-4">
              Best<em className="italic text-[#C9A84C]">sellers</em>
            </h1>
            <p className="text-white/40 font-inter text-sm max-w-md">{allBest.length} pieces loved by thousands across Nigeria and beyond.</p>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}} className="flex flex-wrap gap-6 mt-8">
            {["★ 4.9/5 Average Rating","🚚 Free Delivery Over ₦50k","↩️ 30-Day Returns"].map(t => (
              <span key={t} className="text-[10px] text-white/30 font-inter">{t}</span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-16">
        {/* Top 3 podium */}
        <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} className="text-[10px] tracking-[0.45em] text-[#C9A84C] font-inter uppercase text-center mb-10">
          This Season's Top Picks
        </motion.p>
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {allBest.slice(0,3).map((p,i) => {
            const medals = ["🥇","🥈","🥉"];
            const heights = ["aspect-[3/4]","aspect-[3/5]","aspect-[3/4]"];
            return (
              <motion.div key={p.id} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}} className="group">
                <Link to={`/product/${p.id}`}>
                  <div className={`relative overflow-hidden bg-[#F0EDE8] ${heights[i]} mb-3`}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center text-lg shadow">
                      {medals[i]}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button onClick={e=>handleAdd(p,e)} className={`w-full py-3.5 text-[11px] font-semibold tracking-[0.2em] transition-colors ${addedId===p.id?"bg-[#C9A84C] text-[#0A0908]":"bg-white text-[#0A0908] hover:bg-[#0A0908] hover:text-white"}`}>
                        {addedId===p.id?"✓ ADDED":"ADD TO BAG"}
                      </button>
                    </div>
                    <button onClick={e=>toggleWish(p.id,e)} className={`absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow transition-colors ${wish.has(p.id)?"text-rose-400":"text-[#0A0908] hover:text-rose-400"}`}>
                      {wish.has(p.id)?"♥":"♡"}
                    </button>
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#7A7571] font-inter mb-0.5">{p.designer}</p>
                  <h3 className="font-cormorant text-lg text-[#0A0908] line-clamp-1 mb-1">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="font-inter text-sm font-semibold text-[#0A0908]">₦{p.price.toLocaleString()}</p>
                    <div className="flex gap-0.5">{[...Array(5)].map((_,x)=><span key={x} className="text-[#C9A84C] text-xs">★</span>)}</div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-5 mb-12">
          <div className="flex-1 h-px bg-[#E0DBD4]" />
          <p className="text-[10px] tracking-[0.4em] text-[#7A7571] font-inter uppercase whitespace-nowrap">All Bestsellers</p>
          <div className="flex-1 h-px bg-[#E0DBD4]" />
        </div>

        {/* Full ranked grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 pb-24 md:pb-12">
          {allBest.map((p,i) => (
            <motion.article key={p.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%4)*0.06}} className="group">
              <Link to={`/product/${p.id}`}>
                <div className="relative overflow-hidden bg-[#F0EDE8] aspect-[3/4] mb-3">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" loading="lazy" />
                  <span className="absolute top-2.5 left-2.5 bg-[#C9A84C] text-[#0A0908] text-[9px] font-bold px-2 py-0.5 tracking-wide">№{i+1}</span>
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button onClick={e=>handleAdd(p,e)} className={`flex-1 py-3 text-[10px] font-semibold tracking-[0.2em] transition-colors ${addedId===p.id?"bg-[#C9A84C] text-[#0A0908]":"bg-white/95 text-[#0A0908] hover:bg-[#0A0908] hover:text-white"}`}>
                      {addedId===p.id?"✓":"ADD TO BAG"}
                    </button>
                    <button onClick={e=>toggleWish(p.id,e)} className={`px-4 bg-white/95 border-l border-[#E0DBD4] text-sm hover:bg-[#F0EDE8] ${wish.has(p.id)?"text-rose-400":"text-[#0A0908]"}`}>
                      {wish.has(p.id)?"♥":"♡"}
                    </button>
                  </div>
                </div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#7A7571] mb-0.5">{p.designer}</p>
                <h3 className="text-sm font-inter text-[#0A0908] line-clamp-1 mb-0.5">{p.name}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold font-inter text-[#0A0908]">₦{p.price.toLocaleString()}</p>
                  <div className="flex gap-0.5">{[...Array(5)].map((_,x)=><span key={x} className="text-[#C9A84C] text-[9px]">★</span>)}</div>
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
