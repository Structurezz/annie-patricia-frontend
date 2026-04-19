"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { allProducts, categories as productCategories } from "../components/data/products";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart } from "../store/cartSlice";

/* ── Icons ─────────────────────────────────────────────────────────────── */
const FilterIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeWidth={1.5} d="M3 4h18M7 10h10M11 16h2" />
  </svg>
);
const GridIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
    <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
    <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
  </svg>
);
const ListIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const ChevLeft = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
);
const ChevRight = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
);

const ITEMS_PER_PAGE = 16;
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const subcategories = [
  "All",
  ...Array.from(new Set(allProducts.map((p) => p.subcategory).filter(Boolean))).sort(),
];

const Shop: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist") || "[]")); } catch { return new Set(); }
  });

  // Sync category from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("category");
    if (!raw) { setSelectedCategory("ALL"); setCurrentPage(1); return; }
    const normalised = raw.trim().toUpperCase().replace(/\s+/g, "");
    const match = allProducts.find((p) => (p.category || "").trim().toUpperCase().replace(/\s+/g, "") === normalised);
    setSelectedCategory(match?.category ?? "ALL");
    setCurrentPage(1);
  }, [location.search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory, sortBy, currentPage]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify([...wishlist]));
  }, [wishlist]);

  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWishlist((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const handleAddToCart = (product: typeof allProducts[0], e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    dispatch(addToCart({ id: product.id, name: product.name, designer: product.designer, price: product.price, image: product.image }));
    setToastMsg(product.name.slice(0, 30));
    setTimeout(() => setToastMsg(null), 2200);
  };

  const filteredAndSorted = useMemo(() => {
    let list = allProducts;
    if (selectedCategory !== "ALL") list = list.filter((p) => p.category === selectedCategory);
    if (selectedSubcategory !== "All") list = list.filter((p) => p.subcategory === selectedSubcategory);
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    return [...list].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "newest") return b.id - a.id;
      return 0;
    });
  }, [selectedCategory, selectedSubcategory, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  const clearFilters = () => {
    setSelectedCategory("ALL");
    setSelectedSubcategory("All");
    setPriceRange([0, 500000]);
    setCurrentPage(1);
    window.history.replaceState({}, "", "/category");
  };

  const activeFilterCount = [
    selectedCategory !== "ALL",
    selectedSubcategory !== "All",
    priceRange[1] < 500000,
  ].filter(Boolean).length;

  return (
    <>
      <Topbar />

      {/* Cart Toast */}
      {toastMsg && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] bg-[#111111] text-white px-5 py-3 text-sm font-inter shadow-xl flex items-center gap-3"
        >
          <span className="text-[#B8860B]">✓</span>
          <span>Added: <strong>{toastMsg}</strong></span>
          <Link to="/cart" className="underline text-[#D4A017] ml-1 text-xs">View bag →</Link>
        </motion.div>
      )}

      {/* ── PAGE HEADER ── */}
      <div className="bg-[#F7F5F2] border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-10">
          <p className="text-[#B8860B] text-xs tracking-[0.3em] uppercase font-inter mb-1">
            {selectedCategory !== "ALL" ? "Category" : "All Products"}
          </p>
          <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-[#111111]">
            {selectedCategory !== "ALL" ? selectedCategory : "Shop All"}
          </h1>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="sticky top-[104px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile filter trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-xs font-medium text-[#111111] border border-gray-200 px-3 py-2 hover:border-[#111111] transition-colors"
            >
              <FilterIcon className="w-3.5 h-3.5" />
              Filters {activeFilterCount > 0 && <span className="bg-[#111111] text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>}
            </button>

            {/* Category chips (desktop) */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              <button
                onClick={() => { setSelectedCategory("ALL"); setCurrentPage(1); window.history.replaceState({}, "", "/category"); }}
                className={`text-xs font-medium px-3 py-1.5 border transition-all ${selectedCategory === "ALL" ? "border-[#111111] bg-[#111111] text-white" : "border-gray-200 text-gray-600 hover:border-[#111111]"}`}
              >
                All
              </button>
              {productCategories.slice(0, 7).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); window.history.pushState({}, "", `/category?category=${cat}`); }}
                  className={`text-xs font-medium px-3 py-1.5 border transition-all ${selectedCategory === cat ? "border-[#B8860B] bg-[#B8860B] text-white" : "border-gray-200 text-gray-600 hover:border-[#111111]"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 font-inter hidden md:block">
              {filteredAndSorted.length} items
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="text-xs font-inter border border-gray-200 text-[#111111] px-3 py-2 focus:outline-none focus:border-[#111111] bg-white transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* View toggle (desktop) */}
            <div className="hidden md:flex items-center gap-1 border border-gray-200 p-1">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-[#111111] text-white" : "text-gray-400 hover:text-[#111111]"}`}>
                <GridIcon className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-[#111111] text-white" : "text-gray-400 hover:text-[#111111]"}`}>
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Clear (if filtered) */}
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="hidden md:block text-xs text-gray-400 hover:text-red-500 transition-colors">
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-8 flex gap-8">

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="sticky top-48 space-y-8">
            {/* Category */}
            <div>
              <h3 className="text-xs tracking-[0.25em] text-[#B8860B] uppercase font-inter font-medium mb-4">Category</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => { setSelectedCategory("ALL"); setCurrentPage(1); window.history.replaceState({}, "", "/category"); }}
                    className={`text-sm font-inter block w-full text-left transition-colors ${selectedCategory === "ALL" ? "text-[#111111] font-semibold" : "text-gray-500 hover:text-[#111111]"}`}
                  >
                    All Products
                  </button>
                </li>
                {productCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => { setSelectedCategory(cat); setCurrentPage(1); window.history.pushState({}, "", `/category?category=${cat}`); }}
                      className={`text-sm font-inter block w-full text-left transition-colors ${selectedCategory === cat ? "text-[#B8860B] font-semibold" : "text-gray-500 hover:text-[#111111]"}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs tracking-[0.25em] text-[#B8860B] uppercase font-inter font-medium mb-4">Price</h3>
              <p className="text-xs text-gray-500 font-inter mb-3">
                ₦{priceRange[0].toLocaleString()} — ₦{priceRange[1].toLocaleString()}
              </p>
              <input
                type="range"
                min="0"
                max="500000"
                step="5000"
                value={priceRange[1]}
                onChange={(e) => { setPriceRange([0, +e.target.value]); setCurrentPage(1); }}
                className="w-full gold-range"
                style={{
                  height: "2px",
                  appearance: "none",
                  outline: "none",
                  cursor: "pointer",
                  background: `linear-gradient(to right, #B8860B 0%, #B8860B ${(priceRange[1] / 500000) * 100}%, #E5E7EB ${(priceRange[1] / 500000) * 100}%, #E5E7EB 100%)`,
                }}
              />
            </div>

            {/* Clear */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="w-full border border-gray-200 text-xs text-gray-600 py-2.5 hover:border-[#111111] hover:text-[#111111] transition-all font-inter"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Product Area */}
        <main className="flex-1 min-w-0 pb-24 md:pb-6">
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-32">
              <p className="font-playfair text-2xl text-gray-400 mb-3">No products found</p>
              <p className="text-sm text-gray-400 font-inter mb-8">Try adjusting your filters</p>
              <button onClick={clearFilters} className="border border-[#111111] text-[#111111] text-xs font-medium px-8 py-3 hover:bg-[#111111] hover:text-white transition-all">
                CLEAR FILTERS
              </button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((product, i) => (
                      <motion.article
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.4 }}
                        className="group"
                      >
                        <Link to={`/product/${product.id}`} className="block">
                          {/* Image */}
                          <div className="relative overflow-hidden bg-[#F5F4F0] aspect-[3/4] mb-3">
                            {product.badge && (
                              <span className="absolute top-2.5 left-2.5 z-10 bg-[#111111] text-white text-[10px] font-bold px-2 py-1 tracking-wider">
                                {product.badge}
                              </span>
                            )}
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                <span className="text-xs tracking-widest font-medium text-gray-400">SOLD OUT</span>
                              </div>
                            )}
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            {/* Hover actions */}
                            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-250 flex items-stretch">
                              {product.inStock && (
                                <button
                                  onClick={(e) => handleAddToCart(product, e)}
                                  className="flex-1 bg-[#111111]/90 text-white text-[11px] font-medium py-3 hover:bg-[#B8860B] transition-colors tracking-wider backdrop-blur-sm"
                                >
                                  ADD TO BAG
                                </button>
                              )}
                              <button
                                onClick={(e) => toggleWishlist(product.id, e)}
                                className={`px-3 bg-white/90 text-base backdrop-blur-sm border-l border-white/20 transition-colors ${wishlist.has(product.id) ? "text-[#B8860B]" : "text-gray-600 hover:text-[#B8860B]"}`}
                              >
                                {wishlist.has(product.id) ? "♥" : "♡"}
                              </button>
                            </div>
                          </div>

                          {/* Info */}
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-inter mb-0.5">{product.designer}</p>
                            <h3 className="text-sm text-[#111111] font-inter line-clamp-2 leading-snug mb-1">{product.name}</h3>
                            <p className="text-sm font-semibold text-[#111111]">₦{product.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedProducts.map((product, i) => (
                    <motion.article
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex gap-5 bg-white border border-gray-100 hover:border-gray-300 transition-colors p-4 group"
                    >
                      <Link to={`/product/${product.id}`} className="flex gap-5 flex-1">
                        <div className="w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0 overflow-hidden bg-[#F5F4F0]">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 py-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-inter mb-1">{product.designer}</p>
                          <h3 className="text-base font-inter font-medium text-[#111111] mb-1">{product.name}</h3>
                          <p className="text-base font-semibold text-[#111111]">₦{product.price.toLocaleString()}</p>
                          {product.badge && (
                            <span className="inline-block mt-2 bg-[#111111] text-white text-[10px] font-bold px-2.5 py-1 tracking-widest">{product.badge}</span>
                          )}
                        </div>
                      </Link>
                      {product.inStock && (
                        <button
                          onClick={(e) => { e.preventDefault(); handleAddToCart(product, e); }}
                          className="self-center border border-[#111111] text-[#111111] text-xs font-medium px-5 py-2.5 hover:bg-[#111111] hover:text-white transition-all tracking-wider flex-shrink-0"
                        >
                          ADD
                        </button>
                      )}
                    </motion.article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-12">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-[#111111] disabled:opacity-30 transition-colors"
                  >
                    <ChevLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 text-xs font-medium font-inter transition-all ${
                        currentPage === page
                          ? "bg-[#111111] text-white"
                          : "text-gray-500 hover:text-[#111111] border border-gray-200 hover:border-[#111111]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 7 && <span className="px-2 text-gray-400">...</span>}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-[#111111] disabled:opacity-30 transition-colors"
                  >
                    <ChevRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setMobileFiltersOpen(false)} className="fixed inset-0 bg-black z-[55]" />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.26, ease: "easeOut" }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[60] flex flex-col"
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                <h2 className="font-playfair text-xl font-semibold text-[#111111]">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-[#111111] transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-7">
                {/* Category */}
                <div>
                  <h3 className="text-xs tracking-[0.25em] text-[#B8860B] uppercase font-inter mb-4">Category</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["ALL", ...productCategories].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          const val = cat === "ALL" ? "ALL" : cat;
                          setSelectedCategory(val);
                          setCurrentPage(1);
                          setMobileFiltersOpen(false);
                          if (val === "ALL") window.history.replaceState({}, "", "/category");
                          else window.history.pushState({}, "", `/category?category=${val}`);
                        }}
                        className={`text-xs py-2.5 px-3 border font-inter text-left transition-all ${
                          (cat === "ALL" ? selectedCategory === "ALL" : selectedCategory === cat)
                            ? "border-[#B8860B] bg-[#B8860B] text-white"
                            : "border-gray-200 text-gray-600 hover:border-[#111111]"
                        }`}
                      >
                        {cat === "ALL" ? "All Products" : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-xs tracking-[0.25em] text-[#B8860B] uppercase font-inter mb-4">Price Range</h3>
                  <p className="text-xs text-gray-500 font-inter mb-3">₦{priceRange[0].toLocaleString()} — ₦{priceRange[1].toLocaleString()}</p>
                  <input
                    type="range" min="0" max="500000" step="5000" value={priceRange[1]}
                    onChange={(e) => { setPriceRange([0, +e.target.value]); setCurrentPage(1); }}
                    className="w-full gold-range"
                    style={{ height: "2px", appearance: "none", outline: "none", cursor: "pointer",
                      background: `linear-gradient(to right, #B8860B 0%, #B8860B ${(priceRange[1] / 500000) * 100}%, #E5E7EB ${(priceRange[1] / 500000) * 100}%, #E5E7EB 100%)`,
                    }}
                  />
                </div>

                {activeFilterCount > 0 && (
                  <button onClick={() => { clearFilters(); setMobileFiltersOpen(false); }} className="w-full border border-gray-200 text-xs text-gray-600 py-3 hover:border-[#111111] hover:text-[#111111] transition-all font-inter">
                    Clear All Filters
                  </button>
                )}
              </div>

              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-[#111111] text-white text-sm font-medium py-3 tracking-wider hover:bg-[#B8860B] transition-colors"
                >
                  View {filteredAndSorted.length} Items
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default Shop;
