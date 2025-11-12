
"use client";

import React, { useMemo } from "react";
import { Link, useLocation  } from "react-router-dom";
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
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

import { allProducts, categories as productCategories } from "../components/data/products";
import { useAppDispatch } from "../hooks/redux";
import { addToCart } from "../store/cartSlice";

// Subcategories
const subcategories = [
  "All Subcategories",
  ...new Set(allProducts.map(p => p.subcategory).filter(Boolean))
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
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      designer: product.designer,
      price: product.price,
      image: product.image,
    }));
  };

React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromURL = params.get("category");
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    }
  }, [location.search]);

  return (
    <>
      {/* Top Navigation */}
      <Topbar />

      {/* HERO BANNER – Starts below Topbar */}
      <section className="relative h-64 md:h-40 overflow-hidden bg-black">
        <img
          src="https://media.istockphoto.com/id/2180538528/photo/colorful-shopping-bags-on-a-bed.jpg?s=612x612&w=0&k=20&c=Iv6x7bK3f-XSiRRWn6o9VAXNt_lCxwquU-vVtmBB7H0="
          alt="Shop"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-light text-white tracking-widest"
          >
            SHOP
          </motion.h1>
        </div>
      </section>

      {/* FILTERS BAR – Sticky BELOW Topbar */}
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm"> {/* 64px = Topbar height */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-sm font-medium"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Filters
            </button>
            <p className="text-sm text-gray-600">
              {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-black"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="hidden md:flex items-center gap-1.5 border-l pl-3">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-gray-100" : ""}`}
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT – Starts below Filters */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-6 md:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider mb-4">CATEGORY</h3>
                <ul className="space-y-2">
                  {productCategories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentPage(1);
                        }}
                        className={`block w-full text-left text-sm ${
                          selectedCategory === cat ? "font-medium text-black" : "text-gray-600 hover:text-black"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold tracking-wider mb-4">SUBCATEGORY</h3>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                >
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-sm font-semibold tracking-wider mb-4">
                  PRICE: ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                </h3>
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
                  className="w-full"
                />
              </div>
            </div>
          </aside>

          {/* Product Grid / List */}
          <main className="flex-1 pb-20 md:pb-0">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("ALL");
                    setSelectedSubcategory("All Subcategories");
                    setPriceRange([0, 500000]);
                    setCurrentPage(1);
                  }}
                  className="mt-4 text-sm underline"
                >
                  Clear filters
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
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.05 }}
                          className="group cursor-pointer"
                        >
                          <Link to={`/product/${product.id}`} className="block">
                            <div className="flex flex-col h-full">
                              <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3 rounded-lg">
                                {product.badge && (
                                  <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 z-10 rounded">
                                    {product.badge}
                                  </span>
                                )}
                                {!product.inStock && (
                                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                                    <span className="text-sm font-medium">Sold Out</span>
                                  </div>
                                )}
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                              </div>

                              <div className="flex flex-col flex-1">
                                <p className="text-xs text-gray-500 tracking-wider uppercase">{product.designer}</p>
                                <h3 className="font-medium text-sm line-clamp-2 mt-1">{product.name}</h3>
                                <p className="text-base font-medium mt-2">
                                  ₦{product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </Link>

                          {product.inStock && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product);
                              }}
                              className="mt-3 w-full px-4 py-2 border border-black text-sm font-medium hover:bg-black hover:text-white transition rounded-md"
                            >
                              ADD TO CART
                            </button>
                          )}
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <AnimatePresence mode="popLayout">
                      {paginatedProducts.map((product, i) => (
                        <motion.article
                          key={product.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="group flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Link to={`/product/${product.id}`} className="flex gap-4 flex-1">
                            <div className="w-28 h-36 sm:w-32 sm:h-40 flex-shrink-0 overflow-hidden bg-gray-100 rounded-md">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 tracking-wider">{product.designer}</p>
                              <h3 className="font-medium text-base sm:text-lg mt-1">{product.name}</h3>
                              <p className="text-lg font-medium mt-2">
                                ₦{product.price.toLocaleString()}
                              </p>
                              {product.badge && (
                                <span className="inline-block mt-2 bg-black text-white text-xs px-2 py-1 rounded">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                          </Link>
                          {product.inStock && (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="self-start px-4 py-2 border border-black text-sm font-medium hover:bg-black hover:text-white transition rounded-md"
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
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md disabled:opacity-50"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-9 h-9 rounded-md text-sm font-medium ${
                            currentPage === page
                              ? "bg-black text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }).concat(
                      totalPages > 5 ? (
                        <span key="ellipsis" className="px-2 text-gray-500">...</span>
                      ) : []
                    ).concat(
                      totalPages > 5 ? (
                        <button
                          key={totalPages}
                          onClick={() => goToPage(totalPages)}
                          className={`w-9 h-9 rounded-md text-sm font-medium ${
                            currentPage === totalPages
                              ? "bg-black text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {totalPages}
                        </button>
                      ) : []
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md disabled:opacity-50"
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

      {/* MOBILE FILTERS – Opens under Topbar */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto pt-16" // ← Starts below Topbar
          >
            <div className="sticky top-0 bg-white border-b z-10 p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-7">
              {/* Category */}
              <div>
                <h3 className="text-sm font-semibold tracking-wider mb-3">CATEGORY</h3>
                <div className="space-y-2">
                  {productCategories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => {
                          setSelectedCategory(cat);
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 text-black focus:ring-black"
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategory */}
              <div>
                <h3 className="text-sm font-semibold tracking-wider mb-3">SUBCATEGORY</h3>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                >
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold tracking-wider mb-3">
                  PRICE: ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                </h3>
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      </>
  );
};

export default Shop;