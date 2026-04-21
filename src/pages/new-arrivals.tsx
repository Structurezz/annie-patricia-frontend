"use client";
import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useProducts, ProductQueryParams } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

const ALL_CATEGORIES = [
  "Dresses", "Bubus", "Jumpsuits", "Skirts", "Tops", "Trousers",
  "Kimono and pant sets", "Aso Ebi", "Asoeke",
  "Agbada", "Kaftan", "Bags", "Accessories",
];

const SORT_OPTIONS = [
  { label: "Newest",          sort: "createdAt", order: "desc" },
  { label: "Most Popular",    sort: "soldCount",  order: "desc" },
  { label: "Price: Low–High", sort: "price",      order: "asc"  },
  { label: "Price: High–Low", sort: "price",      order: "desc" },
] as const;

const GENDERS = [
  { label: "All",    value: "" },
  { label: "Women",  value: "WOMEN" },
  { label: "Men",    value: "MEN" },
  { label: "Unisex", value: "UNISEX" },
];

const PER_PAGE = 24;

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] bg-[#F0EBE3] rounded-sm" />
    <div className="mt-3 space-y-2">
      <div className="h-3 bg-[#EDE7DF] rounded w-3/4" />
      <div className="h-3 bg-[#EDE7DF] rounded w-1/2" />
    </div>
  </div>
);

export default function NewArrivals() {
  const [category, setCategory] = useState("");
  const [gender, setGender]     = useState("");
  const [sortIdx, setSortIdx]   = useState(0);
  const [maxPrice, setMaxPrice] = useState(500_000);
  const [page, setPage]         = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const resetPage = useCallback(() => setPage(1), []);
  const sortOpt = SORT_OPTIONS[sortIdx];

  const queryParams = useMemo<ProductQueryParams>(() => ({
    badge: "NEW",
    page,
    limit: PER_PAGE,
    sort:  sortOpt.sort,
    order: sortOpt.order,
    maxPrice,
    ...(category && { category }),
    ...(gender   && { gender }),
  }), [page, category, gender, sortOpt, maxPrice]);

  const { products, loading, total, pages } = useProducts(queryParams);

  const activeFilters = [category, gender].filter(Boolean).length;

  const clearAll = () => {
    setCategory(""); setGender(""); setSortIdx(0); setMaxPrice(500_000); setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-inter">
      <Topbar />

      {/* ── Hero ── */}
      <div className="relative bg-[#F5F0E8] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80"
          alt="" className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12 py-20 md:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.55em] uppercase mb-3 flex items-center gap-3">
              <span className="w-6 h-px bg-[#C9A84C]" /> SS 2025
            </p>
            <h1 className="font-cormorant text-[clamp(3rem,8vw,6rem)] font-light text-[#0B0A09] leading-none mb-3">
              New <em className="italic text-[#C9A84C]">Arrivals</em>
            </h1>
            <p className="text-[#7A7571] text-sm">
              {loading ? "—" : total.toLocaleString()} freshly crafted pieces
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 lg:px-12 py-8 flex gap-8">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col gap-7 w-52 flex-shrink-0 pt-1">
          {activeFilters > 0 && (
            <button onClick={clearAll}
              className="text-[10px] tracking-widest text-[#C9A84C] uppercase font-semibold border-b border-[#C9A84C] pb-1 self-start">
              ✕ Clear ({activeFilters})
            </button>
          )}

          {/* Category */}
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3 font-semibold">Category</p>
            <div className="flex flex-col gap-1">
              <button onClick={() => { setCategory(""); resetPage(); }}
                className={`text-left text-[12px] py-1 transition-colors ${!category ? "text-[#0B0A09] font-semibold" : "text-[#7A7571] hover:text-[#0B0A09]"}`}>
                All
              </button>
              {ALL_CATEGORIES.map(c => (
                <button key={c} onClick={() => { setCategory(c); resetPage(); }}
                  className={`text-left text-[12px] py-1 transition-colors ${category === c ? "text-[#C9A84C] font-semibold" : "text-[#7A7571] hover:text-[#0B0A09]"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3 font-semibold">Gender</p>
            <div className="flex flex-col gap-1">
              {GENDERS.map(g => (
                <button key={g.value} onClick={() => { setGender(g.value); resetPage(); }}
                  className={`text-left text-[12px] py-1 transition-colors ${gender === g.value ? "text-[#C9A84C] font-semibold" : "text-[#7A7571] hover:text-[#0B0A09]"}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3 font-semibold">Max Price</p>
            <input type="range" min={5_000} max={500_000} step={5_000} value={maxPrice}
              onChange={e => { setMaxPrice(Number(e.target.value)); resetPage(); }}
              className="w-full accent-[#C9A84C] cursor-pointer" />
            <div className="flex justify-between mt-2 text-[10px] text-[#7A7571]">
              <span>₦5k</span>
              <span className="text-[#0B0A09] font-semibold">₦{maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            {/* Mobile filter */}
            <button onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-[#ECEAE6] px-4 py-2 text-[11px] tracking-widest text-[#0B0A09] hover:border-[#0B0A09] transition-colors">
              ⊞ Filter {activeFilters > 0 && (
                <span className="bg-[#C9A84C] text-[#0B0A09] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>

            {/* Category quick pills */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {["", ...ALL_CATEGORIES].slice(0, 7).map(c => (
                <button key={c || "all"} onClick={() => { setCategory(c); resetPage(); }}
                  className={`px-3 py-1.5 text-[10px] tracking-wider border transition-all ${category === c ? "bg-[#0B0A09] text-white border-[#0B0A09]" : "border-[#ECEAE6] text-[#7A7571] hover:border-[#0B0A09] hover:text-[#0B0A09]"}`}>
                  {c || "All"}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[10px] text-[#7A7571] hidden sm:block">Sort:</span>
              <select value={sortIdx} onChange={e => { setSortIdx(Number(e.target.value)); resetPage(); }}
                className="text-[11px] border border-[#ECEAE6] px-3 py-2 text-[#0B0A09] bg-white focus:outline-none focus:border-[#C9A84C] cursor-pointer">
                {SORT_OPTIONS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
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
                <p className="font-cormorant text-4xl text-[#E0DBD4] mb-4">No new arrivals found</p>
                <p className="text-sm text-[#7A7571] mb-6">Try adjusting your filters.</p>
                <button onClick={clearAll}
                  className="px-8 py-3 bg-[#0B0A09] text-white text-[11px] tracking-widest hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-colors">
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div key={`grid-${page}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
                {products.map((p, i) => (
                  <ProductCard key={p._id || p.id} product={p} animate delay={(i % 4) * 0.05} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {!loading && pages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2 flex-wrap">
              <button disabled={page === 1}
                onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                className="px-4 py-2 border border-[#ECEAE6] text-[11px] tracking-widest text-[#0B0A09] disabled:opacity-30 hover:border-[#0B0A09] transition-colors">
                ← Prev
              </button>
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => { setPage(n); window.scrollTo(0, 0); }}
                  className={`w-9 h-9 text-[11px] border transition-all ${page === n ? "bg-[#0B0A09] text-white border-[#0B0A09]" : "border-[#ECEAE6] text-[#7A7571] hover:border-[#0B0A09] hover:text-[#0B0A09]"}`}>
                  {n}
                </button>
              ))}
              {pages > 7 && <span className="text-[#7A7571] text-sm">… {pages}</span>}
              <button disabled={page >= pages}
                onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                className="px-4 py-2 border border-[#ECEAE6] text-[11px] tracking-widest text-[#0B0A09] disabled:opacity-30 hover:border-[#0B0A09] transition-colors">
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
            <motion.div key="dr" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#FAF8F5] border-r border-[#ECEAE6] z-50 overflow-y-auto p-7 flex flex-col gap-7 lg:hidden">
              <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-[0.4em] uppercase text-[#0B0A09]">Filters</p>
                <button onClick={() => setDrawerOpen(false)} className="text-[#7A7571] text-xl">✕</button>
              </div>
              {activeFilters > 0 && (
                <button onClick={() => { clearAll(); setDrawerOpen(false); }}
                  className="text-[10px] tracking-widest text-[#C9A84C] uppercase self-start border-b border-[#C9A84C] pb-0.5">
                  Clear all ({activeFilters})
                </button>
              )}
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  {["", ...ALL_CATEGORIES].map(c => (
                    <button key={c || "all"} onClick={() => { setCategory(c); resetPage(); setDrawerOpen(false); }}
                      className={`px-3 py-1.5 text-[10px] border transition-all ${category === c ? "bg-[#0B0A09] text-white border-[#0B0A09]" : "border-[#ECEAE6] text-[#7A7571]"}`}>
                      {c || "All"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3">Gender</p>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map(g => (
                    <button key={g.value} onClick={() => { setGender(g.value); resetPage(); setDrawerOpen(false); }}
                      className={`px-3 py-1.5 text-[10px] border transition-all ${gender === g.value ? "bg-[#0B0A09] text-white border-[#0B0A09]" : "border-[#ECEAE6] text-[#7A7571]"}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3">Max Price</p>
                <input type="range" min={5_000} max={500_000} step={5_000} value={maxPrice}
                  onChange={e => { setMaxPrice(Number(e.target.value)); resetPage(); }}
                  className="w-full accent-[#C9A84C]" />
                <div className="flex justify-between mt-2 text-[10px] text-[#7A7571]">
                  <span>₦5k</span>
                  <span className="text-[#0B0A09] font-semibold">₦{maxPrice.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)}
                className="mt-auto py-3 bg-[#0B0A09] text-white text-[11px] tracking-widest hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-colors">
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
