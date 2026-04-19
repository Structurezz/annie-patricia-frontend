"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { allProducts } from "../components/data/products";

// Filter products for sections
const newArrivals = allProducts.filter((p) => p.badge === "NEW").slice(0, 8);
const bestsellers = allProducts.filter((p) => p.badge === "BESTSELLER").slice(0, 4);
const featured = allProducts.slice(0, 4);

const TRUST_BADGES = [
  { icon: "🚚", title: "Free Delivery", sub: "On orders over ₦50,000" },
  { icon: "↩️", title: "Easy Returns", sub: "30-day free returns" },
  { icon: "🔒", title: "Secure Payment", sub: "Paystack encrypted checkout" },
  { icon: "✨", title: "100% Authentic", sub: "Verified Nigerian craftsmanship" },
];

const CATEGORY_TILES = [
  { label: "Dresses", img: "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=600&q=80", href: "/category?category=Dresses" },
  { label: "Kente Sets", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", href: "/category?category=SETS" },
  { label: "Accessories", img: "https://images.unsplash.com/photo-1441986300917-6467269125f2?w=600&q=80", href: "/category?category=Accessories" },
  { label: "Bags", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", href: "/category?category=Bags" },
];

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const [wishlist, setWishlist] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist") || "[]")); } catch { return new Set(); }
  });
  const [toastProduct, setToastProduct] = useState<string | null>(null);

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
    setToastProduct(product.name);
    setTimeout(() => setToastProduct(null), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Topbar />

      {/* ── CART TOAST ── */}
      {toastProduct && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] bg-[#111111] text-white px-6 py-3 text-sm font-inter shadow-xl flex items-center gap-3"
        >
          <span className="text-[#B8860B]">✓</span>
          <span>Added to cart — <strong>{toastProduct.slice(0, 28)}</strong></span>
          <Link to="/cart" className="underline ml-2 text-[#D4A017]">View bag</Link>
        </motion.div>
      )}

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden bg-[#F7F5F2]" style={{ minHeight: "92vh" }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=85"
            alt="Hero"
            className="w-full h-full object-cover object-top opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center h-full" style={{ minHeight: "92vh" }}>
          <div className="max-w-screen-xl mx-auto w-full px-8 lg:px-16 py-24 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-[#B8860B] text-xs tracking-[0.35em] uppercase font-inter font-medium mb-5"
              >
                New Season · SS 2025
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
                className="font-playfair text-5xl md:text-6xl lg:text-7xl font-semibold text-[#111111] leading-[1.05] mb-6"
              >
                Nigerian
                <br />
                <span className="italic font-normal text-[#B8860B]">Heritage</span>
                <br />
                Reimagined
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-gray-500 font-inter text-base leading-relaxed mb-10 max-w-sm"
              >
                Curated luxury from Lagos' finest artisans — where tradition meets the modern wardrobe.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/category"
                  className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-[#222] transition-colors"
                >
                  Shop New Arrivals
                  <span className="text-[#B8860B]">→</span>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border border-gray-300 text-[#111111] px-8 py-3.5 text-sm font-medium tracking-wide hover:border-[#111111] transition-colors"
                >
                  Our Story
                </Link>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="flex gap-10 mt-14 pt-8 border-t border-gray-200"
              >
                {[["150+", "Products"], ["5K+", "Happy Customers"], ["100%", "Authentic"]].map(([num, label]) => (
                  <div key={label}>
                    <p className="font-playfair text-2xl font-semibold text-[#111111]">{num}</p>
                    <p className="text-xs text-gray-400 font-inter tracking-wider mt-0.5">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero product card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden bg-[#F0EDE8] max-w-md ml-auto">
                  <img
                    src={newArrivals[0]?.image || "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=800&q=80"}
                    alt="Featured"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Product overlay card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 shadow-lg">
                  <p className="text-xs text-gray-400 font-inter tracking-wider uppercase mb-0.5">{newArrivals[0]?.designer}</p>
                  <p className="font-playfair text-base text-[#111111] line-clamp-1">{newArrivals[0]?.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-inter font-semibold text-[#111111]">₦{newArrivals[0]?.price.toLocaleString()}</p>
                    <button
                      onClick={(e) => newArrivals[0] && handleAddToCart(newArrivals[0], e)}
                      className="text-xs font-medium bg-[#111111] text-white px-4 py-2 hover:bg-[#B8860B] transition-colors tracking-wide"
                    >
                      ADD TO BAG
                    </button>
                  </div>
                </div>
                {/* NEW badge */}
                <div className="absolute top-4 right-4 bg-[#B8860B] text-white text-[10px] font-bold px-3 py-1.5 tracking-wider">
                  NEW
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="border-y border-gray-100 bg-[#FAFAF8]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map((b) => (
              <div key={b.title} className="flex items-center gap-3 py-1">
                <span className="text-xl">{b.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-[#111111] font-inter">{b.title}</p>
                  <p className="text-[11px] text-gray-400 font-inter">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-16 md:py-24 px-6 lg:px-16 max-w-screen-xl mx-auto w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] text-[#B8860B] uppercase font-inter mb-2">Just Dropped</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#111111]">New Arrivals</h2>
          </div>
          <Link to="/category" className="text-sm font-medium text-[#111111] hover:text-[#B8860B] transition-colors hover-underline hidden md:block">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.slice(0, 8).map((product, i) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group"
            >
              <Link to={`/product/${product.id}`} className="block">
                {/* Image */}
                <div className="relative overflow-hidden bg-[#F5F4F0] aspect-[3/4] mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                    loading="lazy"
                  />
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-[#111111] text-white text-[10px] font-bold px-2.5 py-1 tracking-widest">
                      {product.badge}
                    </span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 p-3 flex gap-2">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="flex-1 text-[11px] font-medium bg-[#111111] text-white py-2.5 hover:bg-[#B8860B] transition-colors tracking-wider"
                    >
                      ADD TO BAG
                    </button>
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="px-3 border border-gray-200 text-gray-600 hover:border-[#B8860B] hover:text-[#B8860B] transition-colors text-base"
                    >
                      {wishlist.has(product.id) ? "♥" : "♡"}
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div>
                  <p className="text-[11px] text-gray-400 font-inter uppercase tracking-wider mb-1">{product.designer}</p>
                  <h3 className="text-sm font-inter font-medium text-[#111111] line-clamp-1 mb-1">{product.name}</h3>
                  <p className="text-sm font-semibold text-[#111111] font-inter">₦{product.price.toLocaleString()}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link to="/category" className="inline-block border border-[#111111] text-[#111111] text-sm font-medium px-10 py-3 hover:bg-[#111111] hover:text-white transition-all">
            View All Products
          </Link>
        </div>
      </section>

      {/* ── CATEGORY TILES ── */}
      <section className="py-8 pb-20 px-6 lg:px-16 max-w-screen-xl mx-auto w-full">
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] text-[#B8860B] uppercase font-inter mb-2">Browse By Category</p>
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#111111]">Shop the Collection</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {CATEGORY_TILES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link to={cat.href} className="group block relative overflow-hidden aspect-square bg-[#F5F4F0]">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-white font-playfair text-lg font-semibold">{cat.label}</p>
                  <p className="text-white/70 text-xs font-inter tracking-wider mt-0.5 group-hover:text-[#D4A017] transition-colors">Shop now →</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      <section className="py-16 md:py-24 bg-[#F7F5F2]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs tracking-[0.3em] text-[#B8860B] uppercase font-inter mb-2">Customer Favourites</p>
              <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#111111]">Bestsellers</h2>
            </div>
            <Link to="/category?badge=BESTSELLER" className="text-sm font-medium text-[#111111] hover:text-[#B8860B] transition-colors hidden md:block">
              View all →
            </Link>
          </div>

          {/* Big feature layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestsellers.map((product, i) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden aspect-[3/4]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                    />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 px-4 py-3">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full text-[11px] font-medium bg-[#111111] text-white py-2.5 hover:bg-[#B8860B] transition-colors tracking-wider"
                      >
                        QUICK ADD
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider font-inter mb-0.5">{product.designer}</p>
                    <h3 className="text-sm font-medium text-[#111111] line-clamp-1">{product.name}</h3>
                    <p className="text-sm font-semibold mt-1 text-[#111111]">₦{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER: OUR STORY ── */}
      <section className="py-16 md:py-0 md:h-[480px] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1600&q=85"
          alt="Our story"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#111111]/70" />
        <div className="relative z-10 flex items-center justify-center h-full text-center px-6 py-16 md:py-0">
          <div className="max-w-xl">
            <p className="text-[#B8860B] text-xs tracking-[0.35em] font-inter uppercase mb-4">Our Heritage</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-semibold mb-5 leading-tight">
              Born in Lagos,<br />
              <span className="italic font-normal">Loved Worldwide</span>
            </h2>
            <p className="text-white/60 font-inter text-sm mb-8 leading-relaxed">
              Every piece tells a story of Nigerian craftsmanship, culture, and contemporary elegance.
            </p>
            <Link
              to="/about"
              className="inline-block border border-white/50 text-white text-sm font-medium px-10 py-3.5 hover:bg-white hover:text-[#111111] transition-all tracking-wide"
            >
              READ OUR STORY
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-20 bg-white">
        <div className="max-w-xl mx-auto text-center px-6">
          <p className="text-[#B8860B] text-xs tracking-[0.3em] uppercase font-inter mb-3">Stay in the loop</p>
          <h3 className="font-playfair text-3xl md:text-4xl font-semibold text-[#111111] mb-3">
            Join the Inner Circle
          </h3>
          <p className="text-gray-400 text-sm font-inter mb-8">
            First access to new drops, exclusive offers, and styling notes from Lagos.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex border border-gray-200 hover:border-[#111111] transition-colors">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 text-sm font-inter text-[#111111] placeholder-gray-300 outline-none bg-white"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#111111] text-white text-xs font-medium tracking-wider hover:bg-[#B8860B] transition-colors whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </form>
          <p className="text-xs text-gray-300 mt-3 font-inter">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
