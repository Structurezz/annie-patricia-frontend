"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useProducts, ProductQueryParams } from "../hooks/useProducts";

// Men's exact backend categories
const MEN_CATEGORIES = ["Agbada", "Kaftan", "Bags", "Accessories"];

const SORT_OPTIONS = [
  { label: "Newest",          sort: "createdAt", order: "desc" },
  { label: "Most Popular",    sort: "soldCount",  order: "desc" },
  { label: "Top Rated",       sort: "rating",     order: "desc" },
  { label: "Price: Low–High", sort: "price",      order: "asc"  },
  { label: "Price: High–Low", sort: "price",      order: "desc" },
] as const;

const BADGES = [
  { label: "All",        value: "" },
  { label: "New In",     value: "NEW" },
  { label: "Bestseller", value: "BESTSELLER" },
  { label: "Sale",       value: "SALE" },
];

const PER_PAGE = 24;

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] bg-[#1C1A17] rounded-sm" />
    <div className="mt-3 space-y-2">
      <div className="h-3 bg-[#2A2720] rounded w-3/4" />
      <div className="h-3 bg-[#2A2720] rounded w-1/2" />
    </div>
  </div>
);

export default function MenShop() {
  const [category, setCategory]   = useState("");
  const [badge, setBadge]         = useState("");
  const [sortIdx, setSortIdx]     = useState(0);
  const [maxPrice, setMaxPrice]   = useState(500_000);
  const [inStock, setInStock]     = useState(false);
  const [page, setPage]           = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const resetPage = useCallback(() => setPage(1), []);
  const sortOpt = SORT_OPTIONS[sortIdx];

  const queryParams = useMemo<ProductQueryParams>(() => ({
    page, limit: PER_PAGE,
    gender: "MEN",
    ...(category && { category }),
    ...(badge    && { badge }),
    ...(inStock  && { inStock: true }),
    sort:  sortOpt.sort,
    order: sortOpt.order,
    maxPrice,
  }), [page, category, badge, inStock, sortOpt, maxPrice]);

  const { products, loading, total, pages } = useProducts(queryParams);

  const activeFilters = [category, badge, inStock ? "1" : ""].filter(Boolean).length;
  const clearAll = () => {
    setCategory(""); setBadge(""); setInStock(false); setSortIdx(0); setMaxPrice(500_000); setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0B0A09] font-inter text-white">
      <Topbar />

      {/* ── Hero ── */}
      <section className="relative h-[55vh] min-h-[360px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=85"
          alt="Men" className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0A09]/60 via-transparent to-[#0B0A09]" />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 lg:px-12 pb-10 max-w-screen-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[10px] tracking-[0.5em] text-[#C9A84C] uppercase mb-2">
              <Link to="/men" className="hover:opacity-70 transition-opacity">Men</Link> / Shop
            </p>
            <h1 className="font-cormorant text-[clamp(3rem,7vw,5rem)] font-light leading-none">
              The Men's <em className="italic text-[#C9A84C]">Edit</em>
            </h1>
            <p className="text-white/40 text-sm mt-2">
              {loading ? "—" : total.toLocaleString()} pieces · Nigerian craftsmanship
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-5 lg:px-12 py-8 flex gap-8">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col gap-7 w-52 flex-shrink-0 pt-1">
          {activeFilters > 0 && (
            <button onClick={clearAll} className="text-[10px] tracking-widest text-[#C9A84C] uppercase font-semibold border-b border-[#C9A84C] pb-1 self-start">
              ✕ Clear ({activeFilters})
            </button>
          )}

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 mb-3 font-semibold">Category</p>
            <div className="flex flex-col gap-1">
              <button onClick={() => { setCategory(""); resetPage(); }}
                className={`text-left text-[12px] py-1 transition-colors ${!category ? "text-black font-semibold" : "text-white/40 hover:text-black"}`}>
                All
              </button>
              {MEN_CATEGORIES.map(c => (
                <button key={c} onClick={() => { setCategory(c); resetPage(); }}
                  className={`text-left text-[12px] py-1 transition-colors ${category === c ? "text-[#C9A84C] font-semibold" : "text-black hover:text-white"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-black mb-3 font-semibold">Collection</p>
            <div className="flex flex-col gap-1">
              {BADGES.map(b => (
                <button key={b.value} onClick={() => { setBadge(b.value); resetPage(); }}
                  className={`text-left text-[12px] py-1 transition-colors ${badge === b.value ? "text-[#C9A84C] font-semibold" : "text-black hover:text-blacke"}`}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase black mb-3 font-semibold">Max Price</p>
            <input type="range" min={5_000} max={500_000} step={5_000} value={maxPrice}
              onChange={e => { setMaxPrice(Number(e.target.value)); resetPage(); }}
              className="w-full accent-[#C9A84C] cursor-pointer" />
            <div className="flex justify-between mt-2 text-[10px] text-black">
              <span>₦5k</span>
              <span className="text-black font-semibold">₦{maxPrice.toLocaleString()}</span>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => { setInStock(s => !s); resetPage(); }}
              className={`w-9 h-5 rounded-full flex items-center transition-colors px-0.5 ${inStock ? "bg-[#C9A84C]" : "bg-white/10"}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${inStock ? "translate-x-4" : ""}`} />
            </div>
            <span className="text-[12px] text-black">In Stock Only</span>
          </label>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <button onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-white/15 px-4 py-2 text-[11px] tracking-widest text-white/60 hover:border-white/40 transition-colors">
              ⊞ Filter {activeFilters > 0 && <span className="bg-[#C9A84C] text-[#0B0A09] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilters}</span>}
            </button>

            {/* Category pills */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {["", ...MEN_CATEGORIES].map(c => (
                <button key={c || "all"} onClick={() => { setCategory(c); resetPage(); }}
                  className={`px-3 py-1.5 text-[10px] tracking-wider border transition-all ${category === c ? "bg-[#C9A84C] text-[#0B0A09] border-[#C9A84C]" : "border-white/15 text-black hover:border-white/50 hover:text-black"}`}>
                  {c || "All"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <select value={sortIdx} onChange={e => { setSortIdx(Number(e.target.value)); resetPage(); }}
                className="text-[11px] border border-white/15 px-3 py-2 text-black bg-transparent focus:outline-none focus:border-[#C9A84C] cursor-pointer">
                {SORT_OPTIONS.map((s, i) => <option key={i} value={i} className="bg-[#0B0A09]">{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
                {Array.from({ length: PER_PAGE }).map((_, i) => <Skeleton key={i} />)}
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center">
                <p className="font-cormorant text-4xl text-black mb-4">No pieces found</p>
                <button onClick={clearAll} className="px-8 py-3 border border-[#C9A84C] text-[#C9A84C] text-[11px] tracking-widest hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-colors">
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
                {products.map((p, i) => (
                  <ProductCard key={p._id || p.id} product={p} animate delay={(i % 4) * 0.05} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {!loading && pages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <button disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                className="px-4 py-2 border border-white/15 text-[11px] tracking-widest disabled:opacity-20 hover:border-white/50 transition-colors">
                ← Prev
              </button>
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => { setPage(n); window.scrollTo(0, 0); }}
                  className={`w-9 h-9 text-[11px] border transition-all ${page === n ? "bg-[#C9A84C] text-[#0B0A09] border-[#C9A84C]" : "border-white/15 text-black hover:border-white/50"}`}>
                  {n}
                </button>
              ))}
              {pages > 7 && <span className="text-white/30 text-sm">… {pages}</span>}
              <button disabled={page >= pages} onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                className="px-4 py-2 border border-white/15 text-[11px] tracking-widest disabled:opacity-20 hover:border-white/50 transition-colors">
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black/70 z-40 lg:hidden" />
            <motion.div key="dr" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#0B0A09] border-r border-white/10 z-50 overflow-y-auto p-7 flex flex-col gap-7 lg:hidden">
              <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-[0.4em] uppercase">Filters</p>
                <button onClick={() => setDrawerOpen(false)} className="text-white/40 text-xl">✕</button>
              </div>
              {activeFilters > 0 && (
                <button onClick={() => { clearAll(); setDrawerOpen(false); }}
                  className="text-[10px] tracking-widest text-[#C9A84C] uppercase self-start border-b border-[#C9A84C] pb-0.5">
                  Clear all ({activeFilters})
                </button>
              )}
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  {["", ...MEN_CATEGORIES].map(c => (
                    <button key={c || "all"} onClick={() => { setCategory(c); resetPage(); setDrawerOpen(false); }}
                      className={`px-3 py-1.5 text-[10px] border transition-all ${category === c ? "bg-[#C9A84C] text-[#0B0A09] border-[#C9A84C]" : "border-white/15 text-white/40"}`}>
                      {c || "All"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 mb-3">Collection</p>
                <div className="flex flex-wrap gap-2">
                  {BADGES.map(b => (
                    <button key={b.value} onClick={() => { setBadge(b.value); resetPage(); setDrawerOpen(false); }}
                      className={`px-3 py-1.5 text-[10px] border transition-all ${badge === b.value ? "bg-[#C9A84C] text-[#0B0A09] border-[#C9A84C]" : "border-white/15 text-white/40"}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 mb-3">Max Price</p>
                <input type="range" min={5_000} max={500_000} step={5_000} value={maxPrice}
                  onChange={e => { setMaxPrice(Number(e.target.value)); resetPage(); }}
                  className="w-full accent-[#C9A84C]" />
                <div className="flex justify-between mt-2 text-[10px] text-white/30">
                  <span>₦5k</span>
                  <span className="text-white font-semibold">₦{maxPrice.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)}
                className="mt-auto py-3 bg-[#C9A84C] text-[#0B0A09] text-[11px] tracking-widest font-semibold">
                View {total} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
