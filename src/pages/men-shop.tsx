"use client";
import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { menProducts, menCategories } from "../components/data/products";

const SORTS = ["Newest","Price: Low–High","Price: High–Low","Most Popular"];

export default function MenShop() {
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const [cat, setCat]     = useState(params.get("category") || "All");
  const [sort, setSort]   = useState("Newest");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [addedId, setAddedId]   = useState<number|null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const cats = ["All", ...menCategories];

  const products = useMemo(() => {
    let list = cat === "All" ? menProducts : menProducts.filter(p => p.category === cat);
    list = list.filter(p => p.price <= maxPrice);
    if (sort === "Price: Low–High")  list = [...list].sort((a,b) => a.price - b.price);
    if (sort === "Price: High–Low")  list = [...list].sort((a,b) => b.price - a.price);
    if (sort === "Most Popular")     list = [...list].filter(p => p.badge === "BESTSELLER").concat(list.filter(p => p.badge !== "BESTSELLER"));
    return list;
  }, [cat, sort, maxPrice]);

  const handleAdd = (p: typeof menProducts[0], e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    dispatch(addToCart({ id:p.id, name:p.name, designer:p.designer, price:p.price, image:p.image }));
    setAddedId(p.id); setTimeout(()=>setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Topbar />

      {/* Hero banner */}
      <div className="relative bg-[#0A0908] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-6 lg:px-16 py-16 md:py-20">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
            <div className="flex items-center gap-3 mb-3">
              <Link to="/men" className="text-[9px] tracking-[0.4em] text-[#C9A84C] font-inter uppercase hover:text-white transition-colors">Men</Link>
              <span className="text-white/20">/</span>
              <span className="text-[9px] tracking-[0.4em] text-white/40 font-inter uppercase">Shop</span>
            </div>
            <h1 className="font-cormorant text-[clamp(3rem,7vw,5.5rem)] font-light text-white leading-none mb-3">
              The Men's <em className="italic text-[#C9A84C]">Edit</em>
            </h1>
            <p className="text-white/40 font-inter text-sm">{products.length} pieces of Nigerian craftsmanship</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
        {/* Sticky filter bar */}
        <div className="sticky top-[104px] z-30 bg-white border-b border-[#E0DBD4] py-3 -mx-6 lg:-mx-16 px-6 lg:px-16">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`flex-shrink-0 px-4 py-2 text-[11px] font-inter tracking-wider transition-all ${cat===c ? "bg-[#0A0908] text-white" : "border border-[#E0DBD4] text-[#7A7571] hover:border-[#0A0908] hover:text-[#0A0908]"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select value={sort} onChange={e=>setSort(e.target.value)} className="text-[11px] border border-[#E0DBD4] px-3 py-2 text-[#0A0908] font-inter focus:outline-none focus:border-[#0A0908] bg-white cursor-pointer">
                {SORTS.map(s => <option key={s}>{s}</option>)}
              </select>
              <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-2 border border-[#E0DBD4] px-3 py-2 text-[11px] font-inter text-[#0A0908] hover:border-[#0A0908] transition-colors">
                ⊞ Filter
              </button>
            </div>
          </div>
          <AnimatePresence>
            {filterOpen && (
              <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} style={{overflow:"hidden"}}>
                <div className="pt-4 pb-2 flex items-center gap-4 max-w-sm">
                  <span className="text-[11px] font-inter text-[#7A7571] whitespace-nowrap">Max Price:</span>
                  <input type="range" min={10000} max={500000} step={5000} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} className="flex-1 gold-range" />
                  <span className="text-[11px] font-inter text-[#0A0908] whitespace-nowrap font-semibold">₦{maxPrice.toLocaleString()}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Grid */}
        <div className="py-10 pb-28 md:pb-14">
          <AnimatePresence mode="popLayout">
            <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.map((p, i) => (
                <motion.article key={p.id} layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:(i%4)*0.05,duration:.4}} className="group">
                  <Link to={`/product/${p.id}`}>
                    <div className="relative overflow-hidden bg-[#1C1C1A] aspect-[3/4] mb-3">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" loading="lazy" />
                      {p.badge && (
                        <span className={`absolute top-3 left-3 text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 ${p.badge==="SALE"?"bg-red-500 text-white":p.badge==="BESTSELLER"?"bg-[#C9A84C] text-[#0A0908]":"bg-white text-[#0A0908]"}`}>
                          {p.badge}
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                        <button onClick={e=>handleAdd(p,e)} className={`w-full py-3 text-[10px] font-semibold tracking-[0.2em] transition-colors ${addedId===p.id?"bg-[#C9A84C] text-[#0A0908]":"bg-[#0A0908] text-white hover:bg-[#C9A84C] hover:text-[#0A0908]"}`}>
                          {addedId===p.id?"✓ ADDED":"ADD TO BAG"}
                        </button>
                      </div>
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#7A7571] font-inter mb-0.5">{p.designer}</p>
                    <h3 className="text-sm font-inter text-[#0A0908] line-clamp-1 mb-1">{p.name}</h3>
                    <p className="text-sm font-semibold font-inter text-[#0A0908]">₦{p.price.toLocaleString()}</p>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
          {products.length === 0 && (
            <div className="text-center py-24">
              <p className="font-cormorant text-3xl text-[#E0DBD4] mb-3">No pieces found</p>
              <button onClick={()=>{setCat("All");setMaxPrice(500000);}} className="text-sm text-[#C9A84C] font-inter underline">Clear filters</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
