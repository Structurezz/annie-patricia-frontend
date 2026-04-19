"use client";

import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import {
  HeartIcon as HeartOutline,
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

import { allProducts, categories as productCategories } from "../components/data/products";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart } from "../store/cartSlice";

// Subcategories
const subcategories = [
  "All Subcategories",
  ...new Set(allProducts.map((p) => p.subcategory).filter(Boolean)),
].sort();

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
];

const ITEMS_PER_PAGE = 12;

const Shop: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");
  const [selectedSubcategory, setSelectedSubcategory] = React.useState("All Subcategories");
  const [sortBy, setSortBy] = React.useState("featured");
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 500000]);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [wishlist, setWishlist] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Always scroll to top whenever filters, sorting, category, or page changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory, selectedSubcategory, priceRange, sortBy, viewMode, currentPage, location.search]);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let filtered = allProducts;

    if (selectedCategory !== "ALL") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (selectedSubcategory !== "All Subcategories") {
      filtered = filtered.filter((p) => p.subcategory === selectedSubcategory);
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "newest": return b.id - a.id;
        default: return 0;
      }
    });

    return sorted;
  }, [selectedCategory, selectedSubcategory, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product: typeof allProducts[0]) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        designer: product.designer,
        price: product.price,
        image: product.image,
      })
    );
  };

  // Read category from URL on every change
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get("category");

    if (!raw) {
      setSelectedCategory("ALL");
      setCurrentPage(1);
      return;
    }

    const normalised = raw.trim().toUpperCase().replace(/\s+/g, "");

    const matchingProduct = allProducts.find((p) => {
      const prodCat = (p.category || "").trim().toUpperCase().replace(/\s+/g, "");
      return prodCat === normalised;
    });

    if (matchingProduct) {
      setSelectedCategory(matchingProduct.category);
      setCurrentPage(1);
    } else {
      setSelectedCategory("ALL");
      setCurrentPage(1);
    }
  }, [location.search]);

  return (
    <>
      {/* Top Navigation */}
      <Topbar />

      {/* ── SHOP HERO BANNER ── */}
      <section className="relative h-56 md:h-48 overflow-hidden bg-brand">
        <img
          src="https://media.istockphoto.com/id/2180538528/photo/colorful-shopping-bags-on-a-bed.jpg?s=612x612&w=0&k=20&c=Iv6x7bK3f-XSiRRWn6o9VAXNt_lCxwquU-vVtmBB7H0="
          alt="Shop"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-gold text-xs tracking-[0.4em] mb-3 font-inter uppercase">Discover</p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-5xl md:text-7xl font-light text-cream tracking-widest"
          >
            SHOP
          </motion.h1>
          <div className="w-12 h-px bg-gold mt-5" />
        </div>
      </section>

      {/* ── FILTERS BAR ── */}
      <div className="sticky top-16 z-40 bg-warm-white border-b border-gold/15 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-xs font-inter tracking-widest text-text-dark hover:text-gold transition-colors"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              FILTERS
            </button>
            <p className="font-inter text-xs text-text-muted tracking-wider">
              {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-inter border border-gold/30 bg-transparent text-text-dark px-4 py-2 focus:outline-none focus:border-gold tracking-wider"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="hidden md:flex items-center gap-1.5 border-l border-gold/20 pl-4">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${viewMode === "grid" ? "text-gold" : "text-text-muted hover:text-gold"}`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${viewMode === "list" ? "text-gold" : "text-text-muted hover:text-gold"}`}
              >
                <Bars3Icon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="space-y-10 sticky top-40">

              {/* Category */}
              <div>
                <h3 className="font-inter text-xs tracking-[0.3em] text-gold mb-5 uppercase">Category</h3>
                <ul className="space-y-2.5">
                  {productCategories.map((cat) => (
                    <li key={cat}>
                      <Link
                        to={`/category?category=${cat}`}
                        replace={selectedCategory === cat}
                        className={`block font-inter text-xs tracking-wider transition-colors ${
                          selectedCategory === cat
                            ? "text-gold font-medium"
                            : "text-text-muted hover:text-gold"
                        }`}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentPage(1);
                        }}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subcategory */}
              <div>
                <h3 className="font-inter text-xs tracking-[0.3em] text-gold mb-5 uppercase">Subcategory</h3>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full font-inter text-xs border border-gold/30 bg-transparent text-text-dark px-3 py-2.5 focus:outline-none focus:border-gold"
                >
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-inter text-xs tracking-[0.3em] text-gold mb-5 uppercase">
                  Price Range
                </h3>
                <p className="font-inter text-xs text-text-muted mb-3 tracking-wider">
                  ₦{priceRange[0].toLocaleString()} — ₦{priceRange[1].toLocaleString()}
                </p>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    setPriceRange([priceRange[0], Number(e.target.value)]);
                    setCurrentPage(1);
                  }}
                  className="w-full gold-range"
                  style={{
                    background: `linear-gradient(to right, #C9A96E 0%, #C9A96E ${(priceRange[1] / 500000) * 100}%, #E8C98A20 ${(priceRange[1] / 500000) * 100}%, #E8C98A20 100%)`,
                    height: "2px",
                    appearance: "none",
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
              </div>

              {/* Clear */}
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedSubcategory("All Subcategories");
                  setPriceRange([0, 500000]);
                  setCurrentPage(1);
                  window.history.replaceState({}, "", "/category");
                }}
                className="w-full border border-gold/40 text-gold text-xs font-inter tracking-[0.2em] py-2.5 hover:bg-gold hover:text-brand transition-all duration-300"
              >
                CLEAR FILTERS
              </button>
            </div>
          </aside>

          {/* Product Grid / List */}
          <main className="flex-1 pb-24 md:pb-0">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-playfair text-2xl text-text-muted mb-4">No pieces found</p>
                <p className="font-inter text-sm text-text-muted mb-8 tracking-wider">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSelectedCategory("ALL");
                    setSelectedSubcategory("All Subcategories");
                    setPriceRange([0, 500000]);
                    setCurrentPage(1);
                    window.history.replaceState({}, "", "/category");
                  }}
                  className="border border-gold text-gold text-xs font-inter tracking-[0.3em] px-8 py-3 hover:bg-gold hover:text-brand transition-all"
                >
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
                    <AnimatePresence mode="popLayout">
                      {paginatedProducts.map((product, i) => (
                        <motion.article
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: i * 0.04 }}
                          className="group cursor-pointer"
                        >
                          <Link to={`/product/${product.id}`} className="block">
                            <div className="flex flex-col h-full">
                              {/* Image */}
                              <div className="relative overflow-hidden bg-warm-white aspect-[3/4] mb-4">
                                {product.badge && (
                                  <span className="absolute top-3 left-3 bg-brand text-gold text-xs font-inter px-2.5 py-1 z-10 tracking-[0.1em]">
                                    {product.badge}
                                  </span>
                                )}
                                {!product.inStock && (
                                  <div className="absolute inset-0 bg-cream/80 flex items-center justify-center z-20">
                                    <span className="font-inter text-xs tracking-[0.2em] text-text-muted">SOLD OUT</span>
                                  </div>
                                )}
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-brand/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                  {product.inStock && (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToCart(product);
                                      }}
                                      className="w-full border-t border-gold/40 text-gold text-xs font-inter tracking-[0.2em] py-3 hover:bg-gold hover:text-brand transition-all duration-200"
                                    >
                                      QUICK ADD
                                    </button>
                                  )}
                                </div>

                                {/* Wishlist */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setWishlist((prev) => {
                                      const next = new Set(prev);
                                      next.has(product.id) ? next.delete(product.id) : next.add(product.id);
                                      return next;
                                    });
                                  }}
                                  className="absolute top-3 right-3 p-2 opacity-0 group-hover:opacity-100 bg-brand/60 transition-all z-20"
                                >
                                  {wishlist.has(product.id) ? (
                                    <HeartSolid className="w-3.5 h-3.5 text-gold" />
                                  ) : (
                                    <HeartOutline className="w-3.5 h-3.5 text-cream" />
                                  )}
                                </button>
                              </div>

                              {/* Info */}
                              <div className="space-y-1">
                                <p className="font-inter text-xs text-text-muted tracking-[0.15em] uppercase">{product.designer}</p>
                                <h3 className="font-playfair text-sm text-text-dark line-clamp-2">{product.name}</h3>
                                <p className="text-gold font-inter text-sm font-medium">₦{product.price.toLocaleString()}</p>
                              </div>
                            </div>
                          </Link>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {paginatedProducts.map((product, i) => (
                        <motion.article
                          key={product.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="group flex gap-6 items-start bg-warm-white p-5 hover:shadow-md transition-shadow border border-gold/10"
                        >
                          <Link to={`/product/${product.id}`} className="flex gap-5 flex-1">
                            <div className="w-28 h-36 sm:w-32 sm:h-40 flex-shrink-0 overflow-hidden bg-cream">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-inter text-xs text-text-muted tracking-[0.15em] uppercase mb-1">{product.designer}</p>
                              <h3 className="font-playfair text-lg text-text-dark">{product.name}</h3>
                              <p className="text-gold font-inter font-medium mt-2">₦{product.price.toLocaleString()}</p>
                              {product.badge && (
                                <span className="inline-block mt-2 bg-brand text-gold text-xs font-inter px-2 py-1 tracking-wider">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                          </Link>
                          {product.inStock && (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="self-center border border-gold text-gold text-xs font-inter tracking-[0.15em] px-5 py-2.5 hover:bg-gold hover:text-brand transition-all"
                            >
                              ADD
                            </button>
                          )}
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 text-text-muted hover:text-gold transition-colors disabled:opacity-30"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-9 h-9 font-inter text-xs tracking-wider transition-all ${
                            currentPage === page
                              ? "bg-gold text-brand"
                              : "text-text-muted hover:text-gold border border-gold/20 hover:border-gold"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })
                      .concat(
                        totalPages > 5
                          ? [<span key="ellipsis" className="px-2 font-inter text-text-muted">...</span>]
                          : []
                      )
                      .concat(
                        totalPages > 5
                          ? [
                              <button
                                key={totalPages}
                                onClick={() => goToPage(totalPages)}
                                className={`w-9 h-9 font-inter text-xs tracking-wider transition-all ${
                                  currentPage === totalPages
                                    ? "bg-gold text-brand"
                                    : "text-text-muted hover:text-gold border border-gold/20 hover:border-gold"
                                }`}
                              >
                                {totalPages}
                              </button>,
                            ]
                          : []
                      )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 text-text-muted hover:text-gold transition-colors disabled:opacity-30"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ── MOBILE FILTERS DRAWER ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-0 bg-brand z-50 md:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gold/20">
                  <div>
                    <p className="text-gold text-xs tracking-[0.3em] font-inter uppercase mb-1">Refine</p>
                    <h2 className="font-playfair text-2xl text-cream">Filters</h2>
                  </div>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 text-cream/50 hover:text-gold transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex-1 p-6 space-y-8">
                  {/* Category Grid */}
                  <div>
                    <h3 className="font-inter text-xs tracking-[0.3em] text-gold mb-5 uppercase">Category</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {productCategories.map((cat, index) => (
                        <motion.button
                          key={cat}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.06 }}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCurrentPage(1);
                            setMobileFiltersOpen(false);
                            window.history.pushState({}, "", `/category?category=${cat}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`p-4 font-inter text-xs tracking-widest transition-all border ${
                            selectedCategory === cat
                              ? "bg-gold text-brand border-gold"
                              : "border-gold/25 text-cream/60 hover:border-gold hover:text-gold"
                          }`}
                        >
                          {cat}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <h3 className="font-inter text-xs tracking-[0.3em] text-gold mb-4 uppercase">Subcategory</h3>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => {
                        setSelectedSubcategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full font-inter text-xs border border-gold/30 bg-transparent text-cream/70 px-4 py-3 focus:outline-none focus:border-gold"
                    >
                      {subcategories.map((sub) => (
                        <option key={sub} value={sub} className="bg-brand text-cream">
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-inter text-xs tracking-[0.3em] text-gold mb-4 uppercase">Price Range</h3>
                    <p className="font-inter text-xs text-cream/50 mb-4 tracking-wider">
                      ₦{priceRange[0].toLocaleString()} — ₦{priceRange[1].toLocaleString()}
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        setPriceRange([priceRange[0], Number(e.target.value)]);
                        setCurrentPage(1);
                      }}
                      className="w-full gold-range"
                      style={{
                        background: `linear-gradient(to right, #C9A96E 0%, #C9A96E ${(priceRange[1] / 500000) * 100}%, rgba(232,201,138,0.2) ${(priceRange[1] / 500000) * 100}%, rgba(232,201,138,0.2) 100%)`,
                        height: "2px",
                        appearance: "none",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  {/* Clear All */}
                  <button
                    onClick={() => {
                      setSelectedCategory("ALL");
                      setSelectedSubcategory("All Subcategories");
                      setPriceRange([0, 500000]);
                      setCurrentPage(1);
                      setMobileFiltersOpen(false);
                      window.history.replaceState({}, "", "/category");
                    }}
                    className="w-full border border-gold/40 text-gold font-inter text-xs tracking-[0.3em] py-3.5 hover:bg-gold hover:text-brand transition-all duration-300"
                  >
                    CLEAR ALL FILTERS
                  </button>
                </nav>

                <div className="p-6 border-t border-gold/20 text-center">
                  <p className="font-inter text-xs text-cream/40 tracking-wider">
                    {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "item" : "items"} found
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FLOATING CART & WISHLIST ── */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-20 right-6 flex flex-col gap-3 z-50"
      >
        <Link
          to="/cart"
          className="relative p-4 bg-brand border border-gold/40 text-gold shadow-2xl hover:bg-gold hover:text-brand transition-all duration-300"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-brand text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        <Link
          to="/saved"
          className="relative p-4 bg-brand border border-gold/40 text-gold shadow-2xl hover:bg-gold hover:text-brand transition-all duration-300"
        >
          {wishlist.size > 0 ? (
            <HeartSolid className="w-5 h-5" />
          ) : (
            <HeartOutline className="w-5 h-5" />
          )}
          {wishlist.size > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-brand text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {wishlist.size}
            </span>
          )}
        </Link>
      </motion.div>

      <Footer />
    </>
  );
};

export default Shop;
