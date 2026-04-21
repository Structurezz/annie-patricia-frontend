"use client";

import React, { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { useProducts, AdaptedProduct } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } }
};

const CATEGORIES = [
  { label: "Dresses", href: "/category?category=Dresses", img: "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=600&q=80" },
  { label: "Kaftans", href: "/category?category=Kaftan", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80" },
  { label: "Sets", href: "/category?category=Kimono and pant sets", img: "https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=600&q=80" },
  { label: "Agbada", href: "/category?category=Agbada", img: "https://images.unsplash.com/photo-1591400073680-d4a22e58efd8?w=600&q=80" },
  { label: "Bags", href: "/category?category=Bags", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" },
  { label: "Accessories", href: "/category?category=Accessories", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80" },
];

/* ── Modern Product Card ── */


function SectionHead({ eyebrow, title, sub, cta, href }: {
  eyebrow?: string;
  title: string;
  sub?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
      <div>
        {eyebrow && <p className="uppercase tracking-[3px] text-amber-600 text-xs font-medium">{eyebrow}</p>}
        <h2 className="font-serif text-[2.8rem] md:text-[3.4rem] leading-none font-light tracking-tight">{title}</h2>
        {sub && <p className="text-neutral-500 mt-2">{sub}</p>}
      </div>
      {cta && href && (
        <Link 
          to={href} 
          className="text-sm font-medium tracking-widest border-b border-black pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors"
        >
          {cta} →
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const r1 = useRef(null);
  const r2 = useRef(null);
  const v1 = useInView(r1, { once: true, margin: "-100px" });
  const v2 = useInView(r2, { once: true, margin: "-100px" });

  const [hoveredSide, setHoveredSide] = useState<"women" | "men" | null>(null);

  const { products } = useProducts();
  const featured    = useMemo(() => products.filter(p => p.badge === "BESTSELLER").slice(0, 8), [products]);
  const newArrivals = useMemo(() => products.filter(p => p.badge === "NEW").slice(0, 8), [products]);

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <Topbar />

      {/* STYLISH SPLIT SCREEN GATEWAY */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="flex h-full flex-col md:flex-row">

          {/* WOMEN SIDE */}
          <Link
            to="/women"
            onMouseEnter={() => setHoveredSide("women")}
            onMouseLeave={() => setHoveredSide(null)}
            className="relative flex-1 h-1/2 md:h-full group overflow-hidden"
          >
            <motion.div
              animate={{
                scale: hoveredSide === "women" ? 1.06 : 1,
                filter: hoveredSide === "men" ? "grayscale(85%) brightness(0.75)" : "none"
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2070&auto=format&fit=crop"
                alt="Women's Collection"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 group-hover:from-black/50 transition-all duration-700" />

            <div className="relative h-full flex flex-col items-center justify-center z-20 text-white text-center px-6">
              <h2 className="text-6xl md:text-8xl lg:text-[100px] font-light tracking-tighter italic">
                Women
              </h2>
              <motion.div 
                animate={{ opacity: hoveredSide === "women" ? 1 : 0.6 }}
                className="mt-6"
              >
                <span className="block text-[#C9A84C] text-sm tracking-[0.4em] uppercase font-medium">
                  DISCOVER THE COLLECTION
                </span>
              </motion.div>
            </div>
          </Link>

          {/* MEN SIDE */}
          <Link
            to="/men"
            onMouseEnter={() => setHoveredSide("men")}
            onMouseLeave={() => setHoveredSide(null)}
            className="relative flex-1 h-1/2 md:h-full group overflow-hidden"
          >
            <motion.div
              animate={{
                scale: hoveredSide === "men" ? 1.06 : 1,
                filter: hoveredSide === "women" ? "grayscale(85%) brightness(0.75)" : "none"
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2070&auto=format&fit=crop"
                alt="Men's Collection"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 group-hover:from-black/50 transition-all duration-700" />

            <div className="relative h-full flex flex-col items-center justify-center z-20 text-white text-center px-6">
              <h2 className="text-6xl md:text-8xl lg:text-[100px] font-light tracking-tighter italic">
                Men
              </h2>
              <motion.div 
                animate={{ opacity: hoveredSide === "men" ? 1 : 0.6 }}
                className="mt-6"
              >
                <span className="block text-[#C9A84C] text-sm tracking-[0.4em] uppercase font-medium">
                  DISCOVER THE COLLECTION
                </span>
              </motion.div>
            </div>
          </Link>
        </div>

        {/* Center Elegant Divider */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:block">
          <div className="flex items-center gap-6">
            <div className="h-px w-12 bg-white/40" />
            <div className="text-white/70 text-xs tracking-[0.4em] font-light">OR</div>
            <div className="h-px w-12 bg-white/40" />
          </div>
        </div>

        {/* Top Brand Overlay */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40 text-center">
          <div className="text-white text-4xl md:text-5xl tracking-[0.2em] font-light">ANNIE PATRICIA</div>
        </div>
      </div>

      {/* TICKER */}
      <div className="bg-black py-4 overflow-hidden border-b border-white/10">
        <div className="marquee-track flex whitespace-nowrap text-white/60 text-xs tracking-widest font-light">
          {[...Array(3)].flatMap(() => [
            "FREE DELIVERY OVER ₦50,000",
            "•",
            "ARTISAN CRAFTED IN LAGOS",
            "•",
            "SPRING / SUMMER 2026",
            "•",
            "SECURE PAYSTACK CHECKOUT",
            "•"
          ]).map((text, i) => (
            <span key={i} className="px-8">{text}</span>
          ))}
        </div>
      </div>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-20">
        <SectionHead eyebrow="Discover" title="Shop by Category" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link to={cat.href} className="group relative block overflow-hidden aspect-[4/5] rounded-3xl">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-xl font-light tracking-tight">
                  {cat.label}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-neutral-50 py-20">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <SectionHead eyebrow="Fresh from the atelier" title="New Arrivals" cta="View all" href="/new-arrivals" />
          <motion.div
            ref={r1}
            initial="hidden"
            animate={v1 ? "show" : "hidden"}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
          {newArrivals.map((p) => (
  <motion.div key={p.id} variants={fadeUp}>
    <ProductCard product={p} animate delay={0.05} />
  </motion.div>
))}
          </motion.div>
        </div>
      </section>

      {/* EDITORIAL - Women Passage */}
      <section className="relative h-[520px] md:h-[620px] overflow-hidden">
        <img
          src="https://media.istockphoto.com/id/2268149155/photo/african-woman-fashion-designer-entrepreneur-packing-vibrant-ankara-print-clothes-into-a.jpg?s=612x612&w=0&k=20&c=BnFrOvGZ7x5JSNOLVuA8TrZjrqZmBcSMq5ygpNcc-bg="
          alt="Women Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p className="uppercase text-amber-400 tracking-[4px] text-sm mb-4">The Feminine Legacy</p>
          <h2 className="font-serif text-6xl md:text-7xl text-white font-light tracking-tighter leading-none mb-8">
            She wears her story.
          </h2>
          <Link
            to="/women"
            className="px-12 py-4 border border-white/70 text-white hover:bg-white hover:text-black transition-all tracking-widest text-sm"
          >
            EXPLORE WOMEN'S COLLECTION
          </Link>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-20">
        <SectionHead eyebrow="Loved by many" title="Bestsellers" cta="View all" href="/bestsellers" />
        <motion.div
          ref={r2}
          initial="hidden"
          animate={v2 ? "show" : "hidden"}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
       {featured.map((p) => (
  <motion.div key={p.id} variants={fadeUp}>
    <ProductCard product={p} animate delay={0.05} />
  </motion.div>
))}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}