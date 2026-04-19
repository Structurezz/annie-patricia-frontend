"use client";
import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { allProducts, categories } from "../components/data/products";

const newProducts = allProducts.filter(p => p.badge === "NEW" || p.badge === "BESTSELLER" || p.badge === "SALE");
const SORTS = ["Newest","Price: Low–High","Price: High–Low"];
const CATS  = ["All", ...new Set(newProducts.map(p => p.category))].slice(0,10);

export default function NewArrivals() {
  const dispatch = useAppDispatch();
  const [cat, setCat]   = useState("All");
  const [sort, setSort] = useState("Newest");
  const [addedId, setAddedId] = useState<number|null>(null);
  const [wish, setWish] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist")||"[]")); } catch { return new Set(); }
  });

  const products = useMemo(() => {
    let list = cat === "All" ? newProducts : newProducts.filter(p => p.category === cat);
    if (sort === "Price: Low–High") list = [...list].sort((a,b) => a.price - b.price);
    if (sort === "Price: High–Low") list = [...list].sort((a,b) => b.price - a.price);
    return list;
  }, [cat, sort]);

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
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Topbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#F5F0E8]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80" alt="" className="w-full h-full object-cover opacity-10" />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-6 lg:px-16 py-16 md:py-24">
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.55em] font-inter uppercase mb-3 flex items-center gap-3">
              <span className="w-6 h-px bg-[#C9A84C]" /> SS 2025
            </p>
            <h1 className="font-cormorant text-[clamp(3rem,8vw,6.5rem)] font-light text-[#0A0908] leading-none mb-4">
              New <em className="italic text-[#C9A84C]">Arrivals</em>
            </h1>
            <p className="text-[#7A7571] font-inter text-sm max-w-md">{products.length} freshly crafted pieces — drop the mundane.</p>
          </motion.div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[104px] z-30 bg-white border-b border-[#E0DBD4]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`flex-shrink-0 px-4 py-2 text-[11px] font-inter tracking-wider transition-all ${cat===c ? "bg-[#0A0908] text-white" : "border border-[#E0DBD4] text-[#7A7571] hover:border-[#0A0908] hover:text-[#0A0908]"}`}>
                {c}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="flex-shrink-0 text-[11px] border border-[#E0DBD4] px-3 py-2 text-[#0A0908] focus:outline-none focus:border-[#0A0908] bg-white cursor-pointer font-inter">
            {SORTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Hero 3-column feature */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-12">
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {products.slice(0,3).map((p,i) => (
            <motion.div key={p.id} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:i*.12,duration:.7}} className="group">
              <Link to={`/product/${p.id}`}>
                <div className="relative overflow-hidden bg-[#F0EDE8] aspect-[3/4] mb-3">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#0A0908] text-white text-[9px] font-bold tracking-[0.2em] px-2.5 py-1">NEW</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button onClick={e=>handleAdd(p,e)} className={`flex-1 py-3 text-[11px] font-semibold tracking-[0.2em] transition-colors ${addedId===p.id?"bg-[#C9A84C] text-[#0A0908]":"bg-white text-[#0A0908] hover:bg-[#0A0908] hover:text-white"}`}>
                      {addedId===p.id?"✓ ADDED":"ADD TO BAG"}
                    </button>
                    <button onClick={e=>toggleWish(p.id,e)} className={`px-4 bg-white border-l border-[#E0DBD4] text-base transition-colors hover:bg-[#F0EDE8] ${wish.has(p.id)?"text-rose-500":"text-[#0A0908]"}`}>
                      {wish.has(p.id)?"♥":"♡"}
                    </button>
                  </div>
                </div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#7A7571] font-inter mb-0.5">{p.designer}</p>
                <h3 className="font-cormorant text-lg text-[#0A0908] line-clamp-1 mb-0.5">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="font-inter text-sm font-semibold text-[#0A0908]">₦{p.price.toLocaleString()}</p>
                  <div className="flex gap-0.5">{[...Array(5)].map((_,x)=><span key={x} className="text-[#C9A84C] text-[10px]">★</span>)}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-5 mb-12">
          <div className="flex-1 h-px bg-[#E0DBD4]" />
          <p className="text-[10px] tracking-[0.4em] text-[#7A7571] font-inter uppercase whitespace-nowrap">All New Pieces</p>
          <div className="flex-1 h-px bg-[#E0DBD4]" />
        </div>

        {/* Full grid */}
        <AnimatePresence mode="popLayout">
          <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 pb-24 md:pb-12">
            {products.slice(3).map((p,i) => (
              <motion.article key={p.id} layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:(i%4)*.05,duration:.4}} className="group">
                <Link to={`/product/${p.id}`}>
                  <div className="relative overflow-hidden bg-[#F0EDE8] aspect-[3/4] mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" loading="lazy" />
                    {p.badge && (
                      <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold tracking-[0.2em] px-2 py-0.5 ${p.badge==="SALE"?"bg-red-500 text-white":p.badge==="BESTSELLER"?"bg-[#C9A84C] text-[#0A0908]":"bg-[#0A0908] text-white"}`}>{p.badge}</span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button onClick={e=>handleAdd(p,e)} className={`flex-1 py-3 text-[10px] font-semibold tracking-[0.2em] transition-colors ${addedId===p.id?"bg-[#C9A84C] text-[#0A0908]":"bg-white/95 text-[#0A0908] hover:bg-[#0A0908] hover:text-white"}`}>
                        {addedId===p.id?"✓":"ADD TO BAG"}
                      </button>
                      <button onClick={e=>toggleWish(p.id,e)} className={`px-4 bg-white/95 border-l border-[#E0DBD4] text-sm hover:bg-[#F0EDE8] ${wish.has(p.id)?"text-rose-500":"text-[#0A0908]"}`}>
                        {wish.has(p.id)?"♥":"♡"}
                      </button>
                    </div>
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#7A7571] mb-0.5">{p.designer}</p>
                  <h3 className="text-sm font-inter text-[#0A0908] line-clamp-1 mb-0.5">{p.name}</h3>
                  <p className="text-sm font-semibold font-inter text-[#0A0908]">₦{p.price.toLocaleString()}</p>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
