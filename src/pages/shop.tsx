"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useProducts, ProductQueryParams } from "../hooks/useProducts";

// ── Backend-exact categories ───────────────────────────────────────────────
const ALL_CATEGORIES = [
  "Dresses", "Bubus", "Jumpsuits", "Skirts", "Tops", "Trousers",
  "Kimono and pant sets", "Aso Ebi", "Asoeke",
  "Agbada", "Kaftan",
  "Bags", "Accessories",
];

const SORT_OPTIONS = [
  { label: "Newest",          sort: "createdAt", order: "desc" },
  { label: "Most Popular",    sort: "soldCount",  order: "desc" },
  { label: "Top Rated",       sort: "rating",     order: "desc" },
  { label: "Price: Low–High", sort: "price",      order: "asc"  },
  { label: "Price: High–Low", sort: "price",      order: "desc" },
  { label: "Name A–Z",        sort: "name",       order: "asc"  },
] as const;

const GENDERS = [
  { label: "All",   value: "" },
  { label: "Women", value: "WOMEN" },
  { label: "Men",   value: "MEN" },
  { label: "Unisex",value: "UNISEX" },
];

const BADGES = [
  { label: "All",        value: "" },
  { label: "New In",     value: "NEW" },
  { label: "Bestseller", value: "BESTSELLER" },
  { label: "Sale",       value: "SALE" },
];

const PER_PAGE = 24;

// ── Skeleton card ──────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] bg-[#F0EBE3] rounded-sm" />
    <div className="mt-3 space-y-2">
      <div className="h-3 bg-[#F0EBE3] rounded w-3/4" />
      <div className="h-3 bg-[#F0EBE3] rounded w-1/2" />
    </div>
  </div>
);

export default function Shop() {
  const location = useLocation();

  const [category, setCategory]     = useState("");
  const [gender, setGender]         = useState("");
  const [badge, setBadge]           = useState("");
  const [sortIdx, setSortIdx]       = useState(0);
  const [maxPrice, setMaxPrice]     = useState(500_000);
  const [inStock, setInStock]       = useState(false);
  const [page, setPage]             = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch]         = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Read ?category= from URL on mount
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const cat = p.get("category") || "";
    if (cat) setCategory(cat);
  }, [location.search]);

  const resetPage = useCallback(() => setPage(1), []);

  const sortOpt = SORT_OPTIONS[sortIdx];

  const queryParams = useMemo<ProductQueryParams>(() => ({
    page,
    limit: PER_PAGE,
    ...(category  && { category }),
    ...(gender    && { gender }),
    ...(badge     && { badge }),
    ...(search    && { search }),
    ...(inStock   && { inStock: true }),
    sort:  sortOpt.sort,
    order: sortOpt.order,
    maxPrice,
  }), [page, category, gender, badge, search, inStock, sortOpt, maxPrice]);

  const { products, loading, total, pages } = useProducts(queryParams);

  const handleCategory = (cat: string) => { setCategory(cat); resetPage(); };
  const handleGender   = (g: string)   => { setGender(g);    resetPage(); };
  const handleBadge    = (b: string)   => { setBadge(b);     resetPage(); };
  const handleSort     = (i: number)   => { setSortIdx(i);   resetPage(); };
  const handleSearch   = (e: React.FormEvent) => {
    e.preventDefault(); setSearch(searchInput); resetPage();
  };
  const clearAll = () => {
    setCategory(""); setGender(""); setBadge(""); setSortIdx(0);
    setMaxPrice(500_000); setInStock(false); setSearch(""); setSearchInput(""); setPage(1);
  };

  const activeFilters = [category, gender, badge, search, inStock ? "In Stock" : ""].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white font-inter">
      <Topbar />

      {/* ── Page header ── */}
      <div className="border-b border-[#ECEAE6] bg-[#FAF8F5]">
        <div className="max-w-screen-2xl mx-auto px-5 lg:px-12 pt-28 pb-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[10px] tracking-[0.45em] text-[#C9A84C] uppercase font-medium mb-2">
              {category || "Full Collection"}
            </p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h1 className="font-cormorant text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none text-[#0B0A09]">
                {category || "All Pieces"}
              </h1>
              <p className="text-sm text-[#7A7571]">
                {loading ? "—" : total.toLocaleString()} {total === 1 ? "piece" : "pieces"}
              </p>
            </div>
          </motion.div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-5 flex gap-2 max-w-sm">
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search pieces, designers, tags…"
              className="flex-1 border border-[#ECEAE6] bg-white px-4 py-2.5 text-[12px] font-inter text-[#0B0A09] placeholder-[#B0A898] outline-none focus:border-[#C9A84C] transition-colors"
            />
            <button type="submit" className="px-5 py-2.5 bg-[#0B0A09] text-white text-[11px] tracking-widest hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-colors">
              GO
            </button>
            {search && (
              <button type="button" onClick={() => { setSearch(""); setSearchInput(""); resetPage(); }}
                className="px-3 text-[#7A7571] hover:text-[#0B0A09] border border-[#ECEAE6] text-xs">✕</button>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-5 lg:px-12 py-8 flex gap-8">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col gap-7 w-56 flex-shrink-0 pt-1">

          {/* Active filter count + clear */}
          {activeFilters > 0 && (
            <button onClick={clearAll} className="flex items-center gap-2 text-[10px] tracking-widest text-[#C9A84C] uppercase font-semibold border-b border-[#C9A84C] pb-1 self-start">
              ✕ Clear all ({activeFilters})
            </button>
          )}

          {/* Categories */}
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3 font-semibold">Category</p>
            <div className="flex flex-col gap-1">
              <button onClick={() => handleCategory("")}
                className={`text-left text-[12px] py-1 transition-colors ${!category ? "text-[#0B0A09] font-semibold" : "text-[#7A7571] hover:text-[#0B0A09]"}`}>
                All
              </button>
              {ALL_CATEGORIES.map(c => (
                <button key={c} onClick={() => handleCategory(c)}
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
                <button key={g.value} onClick={() => handleGender(g.value)}
                  className={`text-left text-[12px] py-1 transition-colors ${gender === g.value ? "text-[#C9A84C] font-semibold" : "text-[#7A7571] hover:text-[#0B0A09]"}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badge */}
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3 font-semibold">Collection</p>
            <div className="flex flex-col gap-1">
              {BADGES.map(b => (
                <button key={b.value} onClick={() => handleBadge(b.value)}
                  className={`text-left text-[12px] py-1 transition-colors ${badge === b.value ? "text-[#C9A84C] font-semibold" : "text-[#7A7571] hover:text-[#0B0A09]"}`}>
                  {b.label}
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
              <span>₦5,000</span>
              <span className="text-[#0B0A09] font-semibold">₦{maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* In Stock */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div onClick={() => { setInStock(s => !s); resetPage(); }}
              className={`w-9 h-5 rounded-full flex items-center transition-colors duration-300 px-0.5 ${inStock ? "bg-[#0B0A09]" : "bg-[#E0DBD4]"}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${inStock ? "translate-x-4" : ""}`} />
            </div>
            <span className="text-[12px] text-[#7A7571] group-hover:text-[#0B0A09] transition-colors">In Stock Only</span>
          </label>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">

            {/* Mobile: filter toggle */}
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-[#ECEAE6] px-4 py-2 text-[11px] tracking-widest text-[#0B0A09] hover:border-[#0B0A09] transition-colors">
              ⊞ Filter {activeFilters > 0 && <span className="bg-[#C9A84C] text-[#0B0A09] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilters}</span>}
            </button>

            {/* Category quick-pills (desktop top bar) */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {["", ...ALL_CATEGORIES].slice(0, 7).map(c => (
                <button key={c || "all"} onClick={() => handleCategory(c)}
                  className={`px-3 py-1.5 text-[10px] tracking-wider border transition-all ${category === c ? "bg-[#0B0A09] text-white border-[#0B0A09]" : "border-[#ECEAE6] text-[#7A7571] hover:border-[#0B0A09] hover:text-[#0B0A09]"}`}>
                  {c || "All"}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[10px] text-[#7A7571] hidden sm:block">Sort:</span>
              <select value={sortIdx} onChange={e => handleSort(Number(e.target.value))}
                className="text-[11px] border border-[#ECEAE6] px-3 py-2 text-[#0B0A09] bg-white focus:outline-none focus:border-[#C9A84C] cursor-pointer">
                {SORT_OPTIONS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
                {Array.from({ length: PER_PAGE }).map((_, i) => <Skeleton key={i} />)}
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center">
                <p className="font-cormorant text-4xl text-[#E0DBD4] mb-4">No pieces found</p>
                <p className="text-sm text-[#7A7571] mb-6">Try adjusting your filters.</p>
                <button onClick={clearAll} className="px-8 py-3 bg-[#0B0A09] text-white text-[11px] tracking-widest hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-colors">
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
            <div className="mt-16 flex items-center justify-center gap-2 flex-wrap">
              <button disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                className="px-4 py-2 border border-[#ECEAE6] text-[11px] tracking-widest text-[#0B0A09] disabled:opacity-30 hover:border-[#0B0A09] transition-colors">
                ← Prev
              </button>
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                const n = i + 1;
                return (
                  <button key={n} onClick={() => { setPage(n); window.scrollTo(0, 0); }}
                    className={`w-9 h-9 text-[11px] border transition-all ${page === n ? "bg-[#0B0A09] text-white border-[#0B0A09]" : "border-[#ECEAE6] text-[#7A7571] hover:border-[#0B0A09] hover:text-[#0B0A09]"}`}>
                    {n}
                  </button>
                );
              })}
              {pages > 7 && <span className="text-[#7A7571] text-sm">… {pages}</span>}
              <button disabled={page >= pages} onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                className="px-4 py-2 border border-[#ECEAE6] text-[11px] tracking-widest text-[#0B0A09] disabled:opacity-30 hover:border-[#0B0A09] transition-colors">
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile sidebar drawer ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
            <motion.div key="drawer" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 overflow-y-auto p-7 flex flex-col gap-7 lg:hidden">
              <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-[0.4em] uppercase font-semibold">Filters</p>
                <button onClick={() => setSidebarOpen(false)} className="text-xl text-[#7A7571]">✕</button>
              </div>
              {activeFilters > 0 && (
                <button onClick={() => { clearAll(); setSidebarOpen(false); }}
                  className="text-[10px] tracking-widest text-[#C9A84C] uppercase font-semibold self-start border-b border-[#C9A84C] pb-0.5">
                  Clear all ({activeFilters})
                </button>
              )}
              {/* Category */}
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3 font-semibold">Category</p>
                <div className="flex flex-wrap gap-2">
                  {["", ...ALL_CATEGORIES].map(c => (
                    <button key={c || "all"} onClick={() => { handleCategory(c); setSidebarOpen(false); }}
                      className={`px-3 py-1.5 text-[10px] tracking-wide border transition-all ${category === c ? "bg-[#0B0A09] text-white border-[#0B0A09]" : "border-[#ECEAE6] text-[#7A7571]"}`}>
                      {c || "All"}
                    </button>
                  ))}
                </div>
              </div>
              {/* Gender */}
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3 font-semibold">Gender</p>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map(g => (
                    <button key={g.value} onClick={() => { handleGender(g.value); setSidebarOpen(false); }}
                      className={`px-3 py-1.5 text-[10px] tracking-wide border transition-all ${gender === g.value ? "bg-[#0B0A09] text-white border-[#0B0A09]" : "border-[#ECEAE6] text-[#7A7571]"}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Badge */}
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3 font-semibold">Collection</p>
                <div className="flex flex-wrap gap-2">
                  {BADGES.map(b => (
                    <button key={b.value} onClick={() => { handleBadge(b.value); setSidebarOpen(false); }}
                      className={`px-3 py-1.5 text-[10px] tracking-wide border transition-all ${badge === b.value ? "bg-[#0B0A09] text-white border-[#0B0A09]" : "border-[#ECEAE6] text-[#7A7571]"}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#7A7571] mb-3 font-semibold">Max Price</p>
                <input type="range" min={5_000} max={500_000} step={5_000} value={maxPrice}
                  onChange={e => { setMaxPrice(Number(e.target.value)); resetPage(); }}
                  className="w-full accent-[#C9A84C]" />
                <div className="flex justify-between mt-2 text-[10px] text-[#7A7571]">
                  <span>₦5,000</span>
                  <span className="text-[#0B0A09] font-semibold">₦{maxPrice.toLocaleString()}</span>
                </div>
              </div>
              {/* In Stock */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => { setInStock(s => !s); resetPage(); }}
                  className={`w-9 h-5 rounded-full flex items-center transition-colors px-0.5 ${inStock ? "bg-[#0B0A09]" : "bg-[#E0DBD4]"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${inStock ? "translate-x-4" : ""}`} />
                </div>
                <span className="text-[12px] text-[#7A7571]">In Stock Only</span>
              </label>
              <button onClick={() => setSidebarOpen(false)}
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
