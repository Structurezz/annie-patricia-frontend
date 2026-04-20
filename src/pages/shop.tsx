"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { allProducts, categories as productCategories } from "../components/data/products";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";

const ITEMS_PER_PAGE = 20;

const SORT_OPTIONS = [
  { label: "Featured",          value: "featured"   },
  { label: "Newest",            value: "newest"     },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc"},
];

function ProductCard({ p }: { p: typeof allProducts[0] }) {
  const dispatch = useAppDispatch();
  const [wish, setWish] = useState(() => {
    try { return (JSON.parse(localStorage.getItem("wishlist") || "[]") as number[]).includes(p.id); }
    catch { return false; }
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

  const badgeStyle: Record<string, string> = {
    NEW: "bg-[#0B0A09] text-white", BESTSELLER: "bg-[#C9A84C] text-[#0B0A09]", SALE: "bg-red-500 text-white",
  };

  return (
    <Link to={`/product/${p.id}`} className="product-card group block">
      <div className="relative overflow-hidden bg-[#F2EDE4] aspect-[3/4]">
        <img src={p.image} alt={p.name} loading="lazy" className="card-img w-full h-full object-cover" />
        {p.badge && badgeStyle[p.badge] && (
          <span className={`badge absolute top-2.5 left-2.5 ${badgeStyle[p.badge]}`}>{p.badge}</span>
        )}
        <button onClick={handleWish}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-xs transition-colors ${wish ? "text-red-500" : "text-[#7A7571] hover:text-red-400"}`}>
          {wish ? "♥" : "♡"}
        </button>
        <div className="card-actions absolute inset-x-0 bottom-0">
          <button onClick={handleCart}
            className={`w-full py-2.5 text-[10px] font-inter font-semibold tracking-[.18em] transition-colors ${added ? "bg-[#C9A84C] text-[#0B0A09]" : "bg-white text-[#0B0A09] hover:bg-[#0B0A09] hover:text-white"}`}>
            {added ? "✓ ADDED" : "ADD TO BAG"}
          </button>
        </div>
      </div>
      <div className="pt-2.5 pb-3">
        <p className="text-[9px] uppercase tracking-[.2em] text-[#7A7571] font-inter mb-0.5">{p.designer}</p>
        <p className="text-[12.5px] font-inter text-[#1A1916] leading-snug line-clamp-2 mb-1">{p.name}</p>
        <p className="text-[13px] font-semibold font-inter text-[#0B0A09]">₦{p.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

const Shop: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy]           = useState("featured");
  const [minPrice, setMinPrice]       = useState(0);
  const [maxPrice, setMaxPrice]       = useState(500000);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (!cat) { setSelectedCategory("ALL"); }
    else {
      const match = allProducts.find(p => (p.category || "").toLowerCase() === cat.toLowerCase());
      setSelectedCategory(match?.category ?? "ALL");
    }
    setCurrentPage(1);
  }, [location.search]);

  const filtered = useMemo(() => {
    let list = selectedCategory === "ALL"
      ? allProducts
      : allProducts.filter(p => p.category === selectedCategory);
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);
    if (sortBy === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "newest")     list = [...list].filter(p => p.badge === "NEW").concat(list.filter(p => p.badge !== "NEW"));
    if (sortBy === "featured")   list = [...list].filter(p => p.badge === "BESTSELLER").concat(list.filter(p => p.badge !== "BESTSELLER"));
    return list;
  }, [selectedCategory, sortBy, minPrice, maxPrice]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCatClick = (cat: string) => { setSelectedCategory(cat); setCurrentPage(1); };

  return (
    <div className="min-h-screen bg-white">
      <Topbar />

      {/* Page header */}
      <div className="bg-[#F7F4EF] border-b border-[#E6E1DA]">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-10">
          <p className="text-[10px] tracking-[.4em] text-[#C9A84C] font-inter uppercase mb-2">Annie Patricia</p>
          <h1 className="font-cormorant text-[clamp(2.2rem,5vw,3.8rem)] font-light text-[#0B0A09]">
            {selectedCategory === "ALL" ? "All Products" : selectedCategory}
          </h1>
          <p className="text-[13px] text-[#7A7571] font-inter mt-1">{filtered.length} pieces</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-8">
        {/* Top bar: filters toggle + sort */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-5 border-b border-[#E6E1DA]">
          <button onClick={() => setSidebarOpen(v => !v)}
            className="flex items-center gap-2 text-[11px] font-inter font-medium tracking-[.15em] text-[#0B0A09] border border-[#E6E1DA] px-4 py-2 hover:border-[#0B0A09] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M3 4h18M7 10h10M11 16h2" />
            </svg>
            FILTER {sidebarOpen ? "▲" : "▼"}
          </button>

          {/* Category pills — scrollable */}
          <div className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 mx-2">
            {["ALL", ...productCategories].map(cat => (
              <button key={cat} onClick={() => handleCatClick(cat)}
                className={`flex-shrink-0 px-3 py-1.5 text-[10px] font-inter tracking-[.12em] border transition-all ${
                  selectedCategory === cat
                    ? "bg-[#0B0A09] text-white border-[#0B0A09]"
                    : "border-[#E6E1DA] text-[#7A7571] hover:border-[#0B0A09] hover:text-[#0B0A09]"
                }`}>
                {cat === "ALL" ? "ALL" : cat.toUpperCase()}
              </button>
            ))}
          </div>

          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="flex-shrink-0 text-[11px] font-inter border border-[#E6E1DA] px-3 py-2 text-[#0B0A09] focus:outline-none focus:border-[#0B0A09] bg-white cursor-pointer">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: .22 }} className="overflow-hidden">
              <div className="grid md:grid-cols-3 gap-6 pb-6 mb-6 border-b border-[#E6E1DA]">
                <div>
                  <p className="text-[10px] tracking-[.3em] text-[#7A7571] font-inter uppercase mb-3">Price Range</p>
                  <div className="flex items-center gap-3">
                    <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))}
                      className="input-base text-[12px] py-2 px-3" placeholder="Min" />
                    <span className="text-[#C9C4BC]">—</span>
                    <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                      className="input-base text-[12px] py-2 px-3" placeholder="Max" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-[.3em] text-[#7A7571] font-inter uppercase mb-3">Badge</p>
                  <div className="flex flex-wrap gap-2">
                    {["NEW", "BESTSELLER", "SALE"].map(b => {
                      const bc = { NEW: "bg-[#0B0A09] text-white", BESTSELLER: "bg-[#C9A84C] text-[#0B0A09]", SALE: "bg-red-500 text-white" }[b];
                      return (
                        <button key={b} className={`badge border border-transparent ${bc}`}>{b}</button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-end">
                  <button onClick={() => { setMinPrice(0); setMaxPrice(500000); setSortBy("featured"); setSelectedCategory("ALL"); }}
                    className="text-[10px] font-inter text-[#7A7571] hover:text-[#0B0A09] underline underline-offset-2 transition-colors">
                    Clear all filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-cormorant text-3xl text-[#7A7571] mb-3">No products found</p>
            <p className="text-sm font-inter text-[#7A7571]">Try adjusting your filters.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              {paginated.map((p, i) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ delay: (i % 5) * .04, duration: .35 }}>
                  <ProductCard p={p} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-12 pb-6">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center border border-[#E6E1DA] text-[#7A7571] hover:border-[#0B0A09] hover:text-[#0B0A09] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              ‹
            </button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const page = currentPage <= 4 ? i + 1 : currentPage - 3 + i;
              if (page > totalPages) return null;
              return (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center text-[12px] font-inter border transition-colors ${
                    currentPage === page ? "bg-[#0B0A09] text-white border-[#0B0A09]" : "border-[#E6E1DA] text-[#7A7571] hover:border-[#0B0A09] hover:text-[#0B0A09]"
                  }`}>
                  {page}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center border border-[#E6E1DA] text-[#7A7571] hover:border-[#0B0A09] hover:text-[#0B0A09] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              ›
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
