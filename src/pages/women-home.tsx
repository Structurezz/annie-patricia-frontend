"use client";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

// Exact backend category names for women
const WOMEN_CATEGORIES = [
  "Dresses", "Bubus", "Jumpsuits", "Skirts",
  "Tops", "Trousers", "Kimono and pant sets", "Aso Ebi", "Asoeke",
];

export default function WomenHome() {
  const newRef  = useRef(null);
  const bestRef = useRef(null);
  const newInView  = useInView(newRef,  { once: true, margin: "-80px" });
  const bestInView = useInView(bestRef, { once: true, margin: "-80px" });

  // Targeted backend queries — no client-side filtering
  const { products: newArrivals, loading: loadingNew } = useProducts({
    gender: "WOMEN", badge: "NEW", limit: 8, sort: "createdAt", order: "desc",
  });
  const { products: bestsellers, loading: loadingBest } = useProducts({
    gender: "WOMEN", badge: "BESTSELLER", limit: 8, sort: "soldCount", order: "desc",
  });

  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-[#EDE7DF] rounded-sm" />
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-[#EDE7DF] rounded w-3/4" />
        <div className="h-3 bg-[#EDE7DF] rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-inter">
      <Topbar />

      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85"
          alt="Women's Collection"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09]/85 via-[#0B0A09]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/40 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-[10px] tracking-[0.55em] text-[#C9A84C] uppercase mb-5"
          >
            Women's Collection · SS 2025
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-cormorant text-[clamp(3.5rem,8vw,6.5rem)] font-light text-white leading-[0.95] mb-8"
          >
            She Wears<br />
            <em className="italic text-[#C9A84C]">Heritage.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-white/50 text-sm max-w-xs mb-8 leading-relaxed"
          >
            Bubus, Dresses, Asoeke and beyond — crafted by Nigeria's finest artisans.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <Link to="/women/shop"
              className="px-8 py-3.5 bg-[#C9A84C] text-[#0B0A09] text-[11px] font-semibold tracking-[0.2em] hover:bg-[#E2C97E] transition-colors">
              SHOP ALL WOMEN
            </Link>
            <Link to="/women/shop?badge=NEW"
              className="px-8 py-3.5 border border-white/30 text-white text-[11px] tracking-[0.2em] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
              NEW IN
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.4em] text-white/30 uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ── Category strip ── */}
      <div className="bg-white border-y border-[#ECEAE6]">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-12 py-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {WOMEN_CATEGORIES.map(cat => (
            <Link key={cat} to={`/women/shop?category=${encodeURIComponent(cat)}`}
              className="flex-shrink-0 px-5 py-2.5 text-[10px] tracking-[0.2em] border border-[#ECEAE6] text-[#7A7571] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors whitespace-nowrap">
              {cat.toUpperCase()}
            </Link>
          ))}
          <Link to="/women/shop"
            className="flex-shrink-0 ml-auto px-5 py-2.5 text-[10px] tracking-[0.2em] bg-[#0B0A09] text-white font-semibold whitespace-nowrap">
            VIEW ALL →
          </Link>
        </div>
      </div>

      {/* ── New Arrivals ── */}
      <section className="max-w-screen-xl mx-auto px-5 lg:px-12 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.45em] text-[#C9A84C] uppercase mb-2">Just Landed</p>
            <h2 className="font-cormorant text-[clamp(2rem,4vw,3rem)] font-light text-[#0B0A09]">New Arrivals</h2>
          </div>
          <Link to="/women/shop?badge=NEW"
            className="text-[11px] tracking-[0.18em] text-[#0B0A09] border-b border-[#0B0A09] pb-px hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">
            View all →
          </Link>
        </div>

        <div ref={newRef} className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {loadingNew
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : newArrivals.map((p, i) => (
                <motion.div key={p._id || p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={newInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))
          }
        </div>
      </section>

      {/* ── Asoeke editorial ── */}
      <section className="relative h-[480px] md:h-[560px] mx-5 lg:mx-12 mb-16 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85"
          alt="Asoeke Collection" className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09]/80 via-[#0B0A09]/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-16 max-w-lg">
          <p className="text-[10px] tracking-[0.45em] text-[#C9A84C] uppercase mb-4">Aso-oke Collection</p>
          <h2 className="font-cormorant text-[clamp(2.2rem,5vw,4rem)] font-light text-white leading-tight mb-6">
            Nigerian fashion deserves a seat at the global table.
          </h2>
          <Link to="/women/shop?category=Asoeke"
            className="self-start px-8 py-3 border border-[#C9A84C] text-[#C9A84C] text-[10px] tracking-[0.25em] hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-colors">
            SHOP ASO-OKE
          </Link>
        </div>
      </section>

      {/* ── Bestsellers ── */}
      <section className="bg-white py-16 border-t border-[#ECEAE6]">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.45em] text-[#C9A84C] uppercase mb-2">Customer Favourites</p>
              <h2 className="font-cormorant text-[clamp(2rem,4vw,3rem)] font-light text-[#0B0A09]">Bestsellers</h2>
            </div>
            <Link to="/women/shop?badge=BESTSELLER"
              className="text-[11px] tracking-[0.18em] text-[#0B0A09] border-b border-[#0B0A09] pb-px hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">
              View all →
            </Link>
          </div>

          <div ref={bestRef} className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {loadingBest
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : bestsellers.map((p, i) => (
                  <motion.div key={p._id || p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={bestInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 text-center bg-[#FAF8F5] border-t border-[#ECEAE6]">
        <p className="text-[10px] tracking-[0.5em] text-[#C9A84C] uppercase mb-4">The Full Collection</p>
        <h2 className="font-cormorant text-[clamp(2rem,5vw,3.5rem)] font-light text-[#0B0A09] mb-8">
          Every stitch. Every story.
        </h2>
        <Link to="/women/shop"
          className="inline-block px-12 py-4 bg-[#0B0A09] text-white text-[11px] tracking-[0.3em] hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-colors">
          SHOP ALL WOMEN'S
        </Link>
      </section>

      <Footer />
    </div>
  );
}
