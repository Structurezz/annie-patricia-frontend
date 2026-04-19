"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { allProducts } from "../components/data/products";

/* ── data ── */
const newArrivals = allProducts.filter(p => p.badge === "NEW").slice(0, 8);
const bestsellers = allProducts.filter(p => p.badge === "BESTSELLER").slice(0, 6);
const PRESS = ["VOGUE AFRICA","ELLE","GUARDIAN STYLE","BUSINESS DAY","PUNCH FASHION","ARISE","CNN STYLE","AFAR"];
const CATEGORIES = [
  { label:"Dresses", sub:"49 pieces", img:"https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=600&q=80", href:"/category?category=Dresses" },
  { label:"Sets", sub:"32 pieces", img:"https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=600&q=80", href:"/category?category=Sets" },
  { label:"Bags", sub:"18 pieces", img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", href:"/category?category=Bags" },
  { label:"Accessories", sub:"41 pieces", img:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", href:"/category?category=Accessories" },
];
const TESTIMONIALS = [
  { name:"Adaeze O.", loc:"Lagos, Nigeria", text:"The quality is absolutely stunning. Every detail on my Aso-oke set was perfection. Annie Patricia has become my go-to for every special occasion.", rating:5, img:"https://i.pravatar.cc/60?img=47" },
  { name:"Kemi A.", loc:"Abuja, Nigeria", text:"I wore the Ankara wrap dress to my sister's wedding and received so many compliments. The craftsmanship is second to none.", rating:5, img:"https://i.pravatar.cc/60?img=45" },
  { name:"Ngozi B.", loc:"London, UK", text:"Living abroad, Annie Patricia keeps me connected to my heritage. The packaging alone feels luxurious — you know you're buying something special.", rating:5, img:"https://i.pravatar.cc/60?img=44" },
];
const STATS = [
  { value:"5,000+", label:"Happy Customers" },
  { value:"159", label:"Unique Pieces" },
  { value:"5", label:"Years of Craft" },
  { value:"12", label:"Countries Shipped" },
];

/* ── animated counter ── */
function AnimCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView) return;
    const dur = 1800; const steps = 60;
    const step = target / steps; let cur = 0;
    const t = setInterval(() => { cur = Math.min(cur + step, target); setCount(Math.floor(cur)); if (cur >= target) clearInterval(t); }, dur / steps);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── product card ── */
function ProductCard({ product, delay = 0 }: { product: typeof allProducts[0]; delay?: number }) {
  const dispatch = useAppDispatch();
  const [wishlisted, setWishlisted] = useState(() => {
    try { return new Set<number>(JSON.parse(localStorage.getItem("wishlist") || "[]")).has(product.id); } catch { return false; }
  });
  const [added, setAdded] = useState(false);
  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    dispatch(addToCart({ id: product.id, name: product.name, designer: product.designer, price: product.price, image: product.image }));
    setAdded(true); setTimeout(() => setAdded(false), 1800);
  };
  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWishlisted(w => {
      const next = !w;
      const set = new Set<number>(JSON.parse(localStorage.getItem("wishlist") || "[]"));
      next ? set.add(product.id) : set.delete(product.id);
      localStorage.setItem("wishlist", JSON.stringify([...set])); return next;
    });
  };
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: .5 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-[#F5F4F0] aspect-[3/4] mb-3">
          {product.badge && (
            <span className="absolute top-3 left-3 z-10 bg-[#111] text-white text-[10px] font-bold tracking-widest px-2.5 py-1">{product.badge}</span>
          )}
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106" loading="lazy" />
          {/* Actions overlay */}
          <div className="absolute inset-x-0 bottom-0 flex items-stretch translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleCart}
              className={`flex-1 py-3 text-[11px] font-semibold tracking-widest transition-colors ${added ? "bg-[#B8860B] text-white" : "bg-white/95 text-[#111] hover:bg-[#111] hover:text-white"}`}>
              {added ? "✓ ADDED" : "ADD TO BAG"}
            </button>
            <button onClick={handleWish} className={`px-4 bg-white/95 border-l border-gray-100 text-lg transition-colors hover:bg-[#F5F4F0] ${wishlisted ? "text-red-400" : "text-gray-400"}`}>
              {wishlisted ? "♥" : "♡"}
            </button>
          </div>
          {/* Wishlist always visible on mobile */}
          <button onClick={handleWish} className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100 transition-all ${wishlisted ? "text-red-400" : "text-gray-500"}`}>
            {wishlisted ? "♥" : "♡"}
          </button>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-inter mb-0.5">{product.designer}</p>
          <h3 className="text-sm font-inter font-medium text-[#111] line-clamp-1 mb-1">{product.name}</h3>
          <p className="text-sm font-semibold text-[#111]">₦{product.price.toLocaleString()}</p>
        </div>
      </Link>
    </motion.article>
  );
}

/* ══════════════════ HOME PAGE ══════════════════ */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, .7], [1, 0]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  /* Auto-rotate testimonials */
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const quickAdd = (product: typeof allProducts[0]) => {
    dispatch(addToCart({ id: product.id, name: product.name, designer: product.designer, price: product.price, image: product.image }));
    setToast(product.name); setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Topbar />

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[80] bg-[#111] text-white px-6 py-3 text-sm font-inter shadow-2xl flex items-center gap-3 min-w-[280px]">
            <span className="text-[#B8860B] text-base">✓</span>
            <span className="truncate max-w-[200px]">{toast.slice(0,30)} added</span>
            <Link to="/cart" className="ml-auto text-[#B8860B] underline text-xs whitespace-nowrap">View bag →</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ HERO ════ */}
      <section ref={heroRef} className="relative h-[95vh] min-h-[600px] overflow-hidden bg-[#0D0C0A]">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=90" alt="" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex items-center">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-16 w-full">
            <div className="max-w-2xl">
              <motion.div initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: .3, duration: .8 }} className="h-[2px] bg-[#B8860B] mb-6" />
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}
                className="text-[#B8860B] text-xs font-inter tracking-[0.4em] uppercase mb-4">SS 2025 Collection</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, duration: .8, ease: "easeOut" }}
                className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-semibold leading-[1.0] mb-6">
                Wear Your<br /><span className="italic font-normal text-[#B8860B]">Heritage</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }}
                className="text-white/60 font-inter text-base md:text-lg mb-10 leading-relaxed max-w-md">
                Curated luxury from Lagos' finest artisans — where Nigerian tradition meets the modern wardrobe.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-wrap gap-4">
                <Link to="/new-arrivals" className="group flex items-center gap-3 bg-[#B8860B] text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-[#D4A017] transition-all duration-300">
                  New Arrivals
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link to="/category" className="flex items-center gap-2 border border-white/40 text-white px-8 py-4 text-sm font-medium tracking-wide hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  Shop All
                </Link>
              </motion.div>

              {/* Scroll cue */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-5 h-8 border border-white/30 rounded-full flex items-start justify-center p-1.5">
                  <div className="w-1 h-1.5 bg-white/60 rounded-full" />
                </motion.div>
                <p className="text-[10px] tracking-[0.3em] font-inter">SCROLL</p>
              </motion.div>
            </div>

            {/* Hero stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
              className="absolute bottom-12 right-6 lg:right-16 hidden md:flex gap-8">
              {[["159+","Pieces"],["5K+","Customers"],["5yr","Legacy"]].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="font-playfair text-2xl font-semibold text-white">{n}</p>
                  <p className="text-[10px] text-white/40 font-inter tracking-wider mt-0.5">{l}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ════ MARQUEE PRESS ════ */}
      <div className="bg-[#F7F5F2] border-y border-gray-100 py-4 overflow-hidden">
        <div className="flex gap-12 marquee-track whitespace-nowrap">
          {[...PRESS, ...PRESS].map((name, i) => (
            <span key={i} className="text-xs font-inter font-semibold tracking-[0.25em] text-gray-300 uppercase">{name}</span>
          ))}
        </div>
      </div>

      {/* ════ NEW ARRIVALS ════ */}
      <section className="section-pad px-6 lg:px-16 max-w-screen-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#B8860B] text-xs tracking-[0.35em] uppercase font-inter mb-2">Just Dropped</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#111]">New Arrivals</h2>
          </div>
          <Link to="/new-arrivals" className="hidden md:flex items-center gap-2 text-sm font-medium text-[#111] hover:text-[#B8860B] transition-colors group">
            View all <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.06} />)}
        </div>
        <div className="text-center mt-10 md:hidden">
          <Link to="/new-arrivals" className="inline-block border border-[#111] text-[#111] text-sm font-medium px-10 py-3 hover:bg-[#111] hover:text-white transition-all">View All New In</Link>
        </div>
      </section>

      {/* ════ CATEGORIES ════ */}
      <section className="section-pad bg-[#F7F5F2]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-[#B8860B] text-xs tracking-[0.35em] uppercase font-inter mb-2">Explore</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#111]">Shop by Category</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.label} initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .08 }}>
                <Link to={cat.href} className="group block relative overflow-hidden aspect-[3/4] bg-[#EAE8E4]">
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <p className="text-white font-playfair text-xl font-semibold">{cat.label}</p>
                    <p className="text-white/60 text-xs font-inter mt-0.5 group-hover:text-[#D4A017] transition-colors">{cat.sub}</p>
                    <div className="mt-3 flex items-center gap-1 text-white/0 group-hover:text-white/90 transition-colors text-xs font-medium tracking-wide">
                      Explore <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ STATS COUNTER ════ */}
      <section className="py-20 bg-[#111] text-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {STATS.map((s, i) => {
              const num = parseInt(s.value.replace(/\D/g, ""));
              const suffix = s.value.replace(/[0-9,]/g, "");
              return (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }} className="text-center">
                  <p className="font-playfair text-4xl md:text-5xl font-semibold text-[#B8860B] mb-2">
                    <AnimCounter target={num} suffix={suffix} />
                  </p>
                  <div className="w-8 h-[1px] bg-[#B8860B]/40 mx-auto mb-2" />
                  <p className="text-sm text-white/50 font-inter tracking-wider">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ BESTSELLERS ════ */}
      <section className="section-pad px-6 lg:px-16 max-w-screen-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#B8860B] text-xs tracking-[0.35em] uppercase font-inter mb-2">Customer Picks</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#111]">Bestsellers</h2>
          </div>
          <Link to="/bestsellers" className="hidden md:flex items-center gap-2 text-sm font-medium text-[#111] hover:text-[#B8860B] transition-colors group">
            View all <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
        {/* Featured 2-col + 4-col grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {bestsellers[0] && (
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="group relative overflow-hidden bg-[#F5F4F0] aspect-[4/5]">
              <img src={bestsellers[0].image} alt={bestsellers[0].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <span className="inline-block bg-[#B8860B] text-white text-[10px] font-bold px-3 py-1 tracking-widest mb-3">#{1} BESTSELLER</span>
                <p className="text-white/60 text-xs font-inter uppercase tracking-wider mb-0.5">{bestsellers[0].designer}</p>
                <h3 className="font-playfair text-xl text-white font-semibold mb-1">{bestsellers[0].name}</h3>
                <p className="text-[#B8860B] font-semibold mb-4">₦{bestsellers[0].price.toLocaleString()}</p>
                <button onClick={() => quickAdd(bestsellers[0])}
                  className="bg-white text-[#111] text-xs font-semibold tracking-widest px-6 py-2.5 hover:bg-[#B8860B] hover:text-white transition-colors">
                  ADD TO BAG
                </button>
              </div>
            </motion.div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {bestsellers.slice(1, 5).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }} className="group relative overflow-hidden bg-[#F5F4F0] aspect-square">
                <Link to={`/product/${p.id}`}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-107" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                    <div className="p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full">
                      <p className="text-white text-xs font-inter font-medium truncate">{p.name}</p>
                      <p className="text-[#B8860B] text-xs font-semibold">₦{p.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 bg-[#111]/80 text-white text-[9px] font-bold px-2 py-0.5">#{i+2}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ STORY BANNER ════ */}
      <section className="relative h-[70vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1600&q=85" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#111]/65" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8 }}>
              <p className="text-[#B8860B] text-xs tracking-[0.4em] font-inter uppercase mb-4">Our Heritage</p>
              <h2 className="font-playfair text-4xl md:text-6xl text-white font-semibold mb-5 leading-tight">
                Born in Lagos,<br /><em className="font-normal">Loved Worldwide</em>
              </h2>
              <p className="text-white/50 font-inter text-sm mb-8 leading-relaxed">Every piece tells the story of Nigerian craftsmanship, culture, and contemporary elegance.</p>
              <Link to="/about" className="inline-block border border-white/40 text-white text-sm font-medium px-10 py-3.5 hover:bg-white hover:text-[#111] transition-all duration-300 tracking-wide">
                OUR STORY
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════ TESTIMONIALS ════ */}
      <section className="section-pad bg-[#FAFAF8]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[#B8860B] text-xs tracking-[0.35em] uppercase font-inter mb-2">Real Customers</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#111]">What They Say</h2>
            <div className="flex justify-center mt-4 gap-1">
              {[...Array(5)].map((_, i) => <span key={i} className="text-[#B8860B] text-lg">★</span>)}
            </div>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: .4 }} className="bg-white border border-gray-100 p-8 md:p-12 text-center shadow-sm">
                <div className="flex justify-center gap-0.5 mb-6">
                  {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => <span key={i} className="text-[#B8860B]">★</span>)}
                </div>
                <p className="font-playfair text-xl md:text-2xl text-[#111] italic leading-relaxed mb-8">
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <img src={TESTIMONIALS[activeTestimonial].img} alt="" className="w-11 h-11 rounded-full object-cover" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#111] font-inter">{TESTIMONIALS[activeTestimonial].name}</p>
                    <p className="text-xs text-gray-400 font-inter">{TESTIMONIALS[activeTestimonial].loc}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`rounded-full transition-all duration-300 ${i === activeTestimonial ? "w-6 h-2 bg-[#B8860B]" : "w-2 h-2 bg-gray-200 hover:bg-gray-400"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ INSTAGRAM GRID ════ */}
      <section className="section-pad px-6 lg:px-16 max-w-screen-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <p className="text-[#B8860B] text-xs tracking-[0.35em] uppercase font-inter mb-2">Community</p>
          <h2 className="font-playfair text-4xl font-semibold text-[#111]">@AnniePatricia</h2>
          <p className="text-sm text-gray-400 font-inter mt-2">Tag us in your looks</p>
        </motion.div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
          {[
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&q=75",
            "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=400&q=75",
            "https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=400&q=75",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=75",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=75",
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=75",
          ].map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: .95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .06 }}
              className="group aspect-square overflow-hidden relative cursor-pointer">
              <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">✦</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════ NEWSLETTER ════ */}
      <section className="py-20 bg-[#111]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mx-auto text-center px-6">
          <p className="text-[#B8860B] text-xs tracking-[0.35em] uppercase font-inter mb-3">Inner Circle</p>
          <h3 className="font-playfair text-3xl md:text-4xl text-white font-semibold mb-3">First to Know</h3>
          <p className="text-white/40 text-sm font-inter mb-8">New drops, private sales, and styling notes from Lagos.</p>
          <form onSubmit={e => e.preventDefault()} className="flex border border-white/10 hover:border-[#B8860B]/60 focus-within:border-[#B8860B]/80 transition-colors">
            <input type="email" placeholder="Your email address"
              className="flex-1 px-5 py-4 bg-transparent text-white placeholder-white/20 text-sm font-inter outline-none" />
            <button className="px-8 py-4 bg-[#B8860B] text-white text-xs font-semibold tracking-widest hover:bg-[#D4A017] transition-colors whitespace-nowrap">
              JOIN
            </button>
          </form>
          <p className="text-[11px] text-white/20 mt-3 font-inter">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
