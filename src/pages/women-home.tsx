"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { womenProducts } from "../components/data/products";

const newIn    = womenProducts.filter(p => p.badge === "NEW").slice(0, 8);
const bestSell = womenProducts.filter(p => p.badge === "BESTSELLER").slice(0, 6);
const featured = womenProducts.filter(p => p.inStock).slice(0, 1)[0];

const PRESS = ["VOGUE AFRICA","ELLE MAGAZINE","CNN STYLE","GUARDIAN","BUSINESS DAY","ARISE FASHION","AFAR","L'OFFICIEL"];

const CATEGORIES = [
  { label:"Dresses",      sub:"Occasion & Everyday", href:"/women/shop?category=Dresses",      img:"https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=800&q=85" },
  { label:"Bubus",        sub:"Heritage Silhouettes", href:"/women/shop?category=Bubus",        img:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=85" },
  { label:"Kimono Sets",  sub:"Contemporary Fusion",  href:"/women/shop?category=Kimono",       img:"https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=800&q=85" },
  { label:"Accessories",  sub:"Complete the Look",    href:"/women/shop?category=Jewelry",      img:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85" },
  { label:"Bags",         sub:"Crafted in Nigeria",   href:"/women/shop?category=Bags",         img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85" },
];

const TESTIMONIALS = [
  { name:"Adaeze O.", loc:"Victoria Island, Lagos", quote:"Annie Patricia redefined what luxury means to me. Every stitch speaks of heritage.", avatar:"https://i.pravatar.cc/80?img=47" },
  { name:"Ngozi B.", loc:"Mayfair, London",        quote:"Living abroad, this brand keeps me connected to home. Unmatched in quality and story.", avatar:"https://i.pravatar.cc/80?img=45" },
  { name:"Kemi A.", loc:"Maitama, Abuja",          quote:"I wore the Ankara wrap to my sister's wedding and couldn't stop receiving compliments.", avatar:"https://i.pravatar.cc/80?img=44" },
];

function FadeUp({ children, delay=0, className="" }: { children:React.ReactNode; delay?:number; className?:string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:32 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:.75, delay, ease:[.25,.1,.25,1] }} className={className}>
      {children}
    </motion.div>
  );
}

function ProductCard({ p, delay=0 }: { p: typeof womenProducts[0]; delay?:number }) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);
  const [wish, setWish] = useState(() => {
    try { return new Set<number>(JSON.parse(localStorage.getItem("wishlist")||"[]")).has(p.id); } catch { return false; }
  });
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    dispatch(addToCart({ id:p.id, name:p.name, designer:p.designer, price:p.price, image:p.image }));
    setAdded(true); setTimeout(()=>setAdded(false), 1800);
  };
  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const s = new Set<number>(JSON.parse(localStorage.getItem("wishlist")||"[]"));
    wish ? s.delete(p.id) : s.add(p.id);
    localStorage.setItem("wishlist", JSON.stringify([...s]));
    setWish(!wish);
  };
  return (
    <motion.article initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay,duration:.6}} className="group">
      <Link to={`/product/${p.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4] bg-[#F0EDE8] mb-3">
          {p.badge && <span className="absolute top-3 left-3 z-10 bg-[#0A0908] text-white text-[9px] font-semibold tracking-[0.2em] px-2.5 py-1">{p.badge}</span>}
          <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button onClick={handleAdd} className={`flex-1 py-3 text-[11px] font-semibold tracking-[0.15em] transition-colors ${added?"bg-[#C9A84C] text-white":"bg-white text-[#0A0908] hover:bg-[#0A0908] hover:text-white"}`}>
              {added ? "✓ ADDED" : "ADD TO BAG"}
            </button>
            <button onClick={handleWish} className={`px-4 bg-white border-l border-[#E0DBD4] text-base hover:bg-[#F0EDE8] transition-colors ${wish?"text-rose-500":"text-[#0A0908]"}`}>
              {wish ? "♥" : "♡"}
            </button>
          </div>
          <button onClick={handleWish} className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100 transition-all z-10 ${wish?"text-rose-500":"text-[#0A0908]"}`}>
            {wish ? "♥" : "♡"}
          </button>
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#7A7571] font-inter mb-0.5">{p.designer}</p>
        <h3 className="text-sm font-inter text-[#0A0908] line-clamp-1 mb-1">{p.name}</h3>
        <p className="font-inter text-sm font-semibold text-[#0A0908]">₦{p.price.toLocaleString()}</p>
      </Link>
    </motion.article>
  );
}

export default function WomenHome() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset:["start start","end start"] });
  const bgY = useTransform(scrollYProgress, [0,1], ["0%","25%"]);
  const textY = useTransform(scrollYProgress, [0,1], ["0%","40%"]);
  const opacity = useTransform(scrollYProgress, [0,.7], [1,0]);
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTIdx(i => (i+1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Topbar />

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[600px] overflow-hidden bg-[#0A0908]">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=90"
            alt="Women's Collection"
            className="w-full h-[115%] object-cover opacity-60"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/80 via-[#0A0908]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/60 via-transparent to-transparent" />

        <motion.div style={{ y: textY, opacity }} className="relative z-10 h-full flex items-center">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-16 w-full">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3 }}
                className="text-[#C9A84C] text-[10px] tracking-[0.55em] font-inter uppercase mb-5 flex items-center gap-3"
              >
                <span className="w-8 h-px bg-[#C9A84C]" /> SS 2025 Women's Collection
              </motion.p>
              <motion.h1
                initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5, duration:.9 }}
                className="font-cormorant text-[clamp(3.5rem,9vw,7rem)] font-light text-white leading-[0.95] mb-6"
              >
                She Wears<br /><em className="italic text-[#C9A84C]">Heritage.</em>
              </motion.h1>
              <motion.p
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.9 }}
                className="text-white/55 font-inter text-base leading-relaxed mb-10 max-w-sm"
              >
                Crafted for the woman who commands every room — in aso-oke, ankara, and adire, reimagined.
              </motion.p>
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.1 }} className="flex flex-wrap gap-4">
                <Link to="/women/shop" className="group bg-[#C9A84C] text-[#0A0908] px-9 py-4 text-xs font-semibold tracking-[0.3em] hover:bg-white transition-all duration-300 flex items-center gap-3">
                  SHOP WOMEN <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link to="/new-arrivals" className="border border-white/30 text-white px-9 py-4 text-xs font-medium tracking-[0.3em] hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  NEW ARRIVALS
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.6}} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <motion.div animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:2}} className="w-5 h-8 border border-white/25 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-1.5 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ PRESS MARQUEE ══ */}
      <div className="bg-[#F5F0E8] border-y border-[#E0DBD4] py-3.5 overflow-hidden">
        <div className="flex gap-14 marquee-track whitespace-nowrap">
          {[...PRESS,...PRESS].map((n,i) => (
            <span key={i} className="text-[10px] font-inter font-semibold tracking-[0.35em] text-[#C9A84C]/60 uppercase">{n}</span>
          ))}
        </div>
      </div>

      {/* ══ NEW IN ══ */}
      <section className="section-pad px-6 lg:px-16 max-w-screen-xl mx-auto">
        <FadeUp className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] font-inter uppercase mb-2">Just Arrived</p>
            <h2 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-light text-[#0A0908] leading-none">New <em className="italic">In</em></h2>
          </div>
          <Link to="/new-arrivals" className="hidden md:flex items-center gap-2 text-xs font-inter font-medium text-[#0A0908] hover:text-[#C9A84C] transition-colors group">
            View All <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </FadeUp>

        {/* Editorial grid: 1 tall + 3 square */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {newIn.slice(0,1).map((p, i) => (
            <motion.article key={p.id} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7}} className="group md:col-span-1 md:row-span-2">
              <Link to={`/product/${p.id}`} className="block">
                <div className="relative overflow-hidden aspect-[3/4] md:aspect-[3/5] bg-[#F0EDE8]">
                  {p.badge && <span className="absolute top-3 left-3 z-10 bg-[#0A0908] text-white text-[9px] tracking-[0.2em] px-2.5 py-1">{p.badge}</span>}
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#7A7571] font-inter mt-2 mb-0.5">{p.designer}</p>
                <h3 className="font-cormorant text-base text-[#0A0908] line-clamp-1">{p.name}</h3>
                <p className="font-inter text-sm font-semibold text-[#0A0908]">₦{p.price.toLocaleString()}</p>
              </Link>
            </motion.article>
          ))}
          {newIn.slice(1,7).map((p, i) => <ProductCard key={p.id} p={p} delay={i*0.06} />)}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link to="/new-arrivals" className="inline-block border border-[#0A0908] text-[#0A0908] text-xs font-semibold tracking-[0.3em] px-10 py-3.5 hover:bg-[#0A0908] hover:text-white transition-all">
            VIEW ALL NEW IN
          </Link>
        </div>
      </section>

      {/* ══ CATEGORY TILES ══ */}
      <section className="section-pad bg-[#F5F0E8]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
          <FadeUp className="mb-14">
            <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] font-inter uppercase mb-2">Discover</p>
            <h2 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-light text-[#0A0908] leading-none">Shop by Category</h2>
          </FadeUp>
          {/* Asymmetric layout */}
          <div className="grid grid-cols-12 gap-3">
            {/* Large left tile */}
            <FadeUp className="col-span-12 md:col-span-5" delay={0}>
              <Link to={CATEGORIES[0].href} className="group block relative overflow-hidden aspect-[4/5] bg-[#E8E3DA]">
                <img src={CATEGORIES[0].img} alt={CATEGORIES[0].label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/75 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <p className="text-[#C9A84C] text-[9px] tracking-[0.35em] font-inter uppercase mb-1">{CATEGORIES[0].sub}</p>
                  <h3 className="font-cormorant text-3xl font-light text-white">{CATEGORIES[0].label}</h3>
                </div>
              </Link>
            </FadeUp>
            {/* Right column: 2+2 grid */}
            <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-3">
              {CATEGORIES.slice(1,5).map((cat,i) => (
                <FadeUp key={cat.label} delay={i*0.08}>
                  <Link to={cat.href} className="group block relative overflow-hidden aspect-square bg-[#E8E3DA]">
                    <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/70 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-4">
                      <p className="text-[#C9A84C] text-[8px] tracking-[0.3em] font-inter uppercase mb-0.5">{cat.sub}</p>
                      <h3 className="font-cormorant text-xl font-light text-white">{cat.label}</h3>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ EDITORIAL CAMPAIGN ══ */}
      <section className="relative h-[75vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1800&q=85" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0A0908]/60" />
        <div className="relative z-10 h-full flex items-center px-6 lg:px-16">
          <div className="max-w-screen-xl mx-auto w-full">
            <FadeUp className="max-w-lg">
              <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] font-inter uppercase mb-4">Born in Lagos</p>
              <h2 className="font-cormorant text-[clamp(3rem,6vw,5.5rem)] font-light text-white leading-[1.0] mb-6">
                "Nigerian fashion<br />deserves a seat at the<br /><em className="italic text-[#C9A84C]">global luxury table."</em>
              </h2>
              <div className="w-10 h-px bg-[#C9A84C] mb-5" />
              <p className="text-white/50 font-inter text-sm leading-relaxed mb-8 max-w-sm">
                Every piece is a conversation between tradition and the contemporary. Hand-crafted by Nigeria's finest artisans.
              </p>
              <Link to="/about" className="inline-block border border-[#C9A84C]/50 text-[#C9A84C] text-xs tracking-[0.35em] px-8 py-3.5 hover:bg-[#C9A84C] hover:text-[#0A0908] transition-all duration-300">
                OUR STORY
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ══ BESTSELLERS ══ */}
      <section className="section-pad px-6 lg:px-16 max-w-screen-xl mx-auto">
        <FadeUp className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] font-inter uppercase mb-2">Customer Favourites</p>
            <h2 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-light text-[#0A0908] leading-none">Best<em className="italic">sellers</em></h2>
          </div>
          <Link to="/bestsellers" className="hidden md:flex items-center gap-2 text-xs font-inter font-medium text-[#0A0908] hover:text-[#C9A84C] transition-colors group">
            View All <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </FadeUp>

        {/* Featured bestseller + grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {bestSell[0] && (
            <FadeUp>
              <Link to={`/product/${bestSell[0].id}`} className="group block relative overflow-hidden aspect-[3/4] bg-[#F0EDE8]">
                <img src={bestSell[0].image} alt={bestSell[0].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/75 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#C9A84C] text-[#0A0908] text-[9px] font-bold tracking-[0.2em] px-3 py-1">№1 BESTSELLER</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <p className="text-white/50 text-[10px] tracking-widest font-inter uppercase mb-1">{bestSell[0].designer}</p>
                  <h3 className="font-cormorant text-2xl font-light text-white mb-1">{bestSell[0].name}</h3>
                  <p className="text-[#C9A84C] font-semibold font-inter text-sm">₦{bestSell[0].price.toLocaleString()}</p>
                </div>
              </Link>
            </FadeUp>
          )}
          <div className="grid grid-cols-2 gap-3">
            {bestSell.slice(1,5).map((p, i) => <ProductCard key={p.id} p={p} delay={i*0.07} />)}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="section-pad bg-[#0A0908]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <FadeUp>
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_,i) => <span key={i} className="text-[#C9A84C] text-lg">★</span>)}
            </div>
          </FadeUp>
          <AnimatePresence mode="wait">
            <motion.div key={tIdx} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} transition={{duration:.5}}>
              <p className="font-cormorant text-[clamp(1.5rem,3.5vw,2.5rem)] font-light text-white italic leading-snug mb-8">
                "{TESTIMONIALS[tIdx].quote}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img src={TESTIMONIALS[tIdx].avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-[#C9A84C]/30" />
                <div className="text-left">
                  <p className="text-white text-sm font-semibold font-inter">{TESTIMONIALS[tIdx].name}</p>
                  <p className="text-white/30 text-xs font-inter">{TESTIMONIALS[tIdx].loc}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_,i) => (
              <button key={i} onClick={() => setTIdx(i)} className={`rounded-full transition-all ${i===tIdx?"w-6 h-1.5 bg-[#C9A84C]":"w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ INSTAGRAM STRIP ══ */}
      <section className="py-16 overflow-hidden">
        <FadeUp className="text-center mb-8 px-6">
          <p className="text-[10px] tracking-[0.45em] font-inter text-[#7A7571] uppercase mb-1">Community</p>
          <h3 className="font-cormorant text-3xl text-[#0A0908]"><em className="italic">@AnniePatricia</em></h3>
        </FadeUp>
        <div className="flex gap-2 px-2">
          {[
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=75",
            "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=500&q=75",
            "https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=500&q=75",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=75",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=75",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=75",
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=75",
          ].map((src,i) => (
            <motion.div key={i} initial={{opacity:0,scale:.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.06}} className="flex-shrink-0 w-[28vw] sm:w-[18vw] md:w-[14vw] aspect-square overflow-hidden group cursor-pointer relative">
              <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" />
              <div className="absolute inset-0 bg-[#0A0908]/0 group-hover:bg-[#0A0908]/25 transition-colors flex items-center justify-center">
                <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">✦</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ NEWSLETTER ══ */}
      <section className="py-20 bg-[#F5F0E8] border-t border-[#E0DBD4]">
        <FadeUp className="max-w-lg mx-auto text-center px-6">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] font-inter uppercase mb-3">Inner Circle</p>
          <h3 className="font-cormorant text-[clamp(2rem,4vw,3rem)] font-light text-[#0A0908] mb-2">Be First to Know</h3>
          <p className="text-[#7A7571] text-sm font-inter mb-8">New drops, private sales, and editorial notes from Lagos.</p>
          <form onSubmit={e=>e.preventDefault()} className="flex border border-[#E0DBD4] hover:border-[#C9A84C] focus-within:border-[#C9A84C] transition-colors">
            <input type="email" placeholder="Your email address" className="flex-1 px-5 py-4 bg-transparent text-[#0A0908] placeholder-[#C4BFBA] text-sm font-inter outline-none" />
            <button className="px-7 py-4 bg-[#0A0908] text-white text-[10px] font-semibold tracking-[0.3em] hover:bg-[#C9A84C] transition-colors whitespace-nowrap">JOIN</button>
          </form>
          <p className="text-[10px] text-[#C4BFBA] font-inter mt-3">No spam. Unsubscribe anytime.</p>
        </FadeUp>
      </section>

      <Footer />
    </div>
  );
}
