"use client";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { menProducts } from "../components/data/products";

const newIn    = menProducts.filter(p => p.badge === "NEW").slice(0, 6);
const bestSell = menProducts.filter(p => p.badge === "BESTSELLER").slice(0, 5);
const allMen   = menProducts.slice(0, 12);

const MEN_CATS = [
  { label:"Kaftan",   sub:"Modern Traditional",  href:"/men/shop?category=Kaftan",   img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=85" },
  { label:"Agbada",   sub:"Regal Heritage",       href:"/men/shop?category=Agbada",   img:"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=85" },
  { label:"Jackets",  sub:"Contemporary Edge",    href:"/men/shop?category=Jackets",  img:"https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=85" },
  { label:"Bags",     sub:"Crafted in Nigeria",   href:"/men/shop?category=Bags",     img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85" },
];

function FadeUp({ children, delay=0, className="" }: { children:React.ReactNode; delay?:number; className?:string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  return (
    <motion.div ref={ref} initial={{opacity:0,y:32}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:.75,delay,ease:[.25,.1,.25,1]}} className={className}>
      {children}
    </motion.div>
  );
}

function ProductCard({ p, delay=0 }: { p: typeof menProducts[0]; delay?:number }) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);
  const [wish, setWish] = useState(false);
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    dispatch(addToCart({ id:p.id, name:p.name, designer:p.designer, price:p.price, image:p.image }));
    setAdded(true); setTimeout(()=>setAdded(false), 1800);
  };
  return (
    <motion.article initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay,duration:.6}} className="group">
      <Link to={`/product/${p.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4] bg-[#1C1C1A] mb-3">
          {p.badge && <span className="absolute top-3 left-3 z-10 bg-[#C9A84C] text-[#0A0908] text-[9px] font-bold tracking-[0.2em] px-2.5 py-1">{p.badge}</span>}
          <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <button onClick={handleAdd} className={`flex-1 py-3 text-[11px] font-semibold tracking-[0.15em] transition-colors ${added?"bg-[#C9A84C] text-[#0A0908]":"bg-[#0A0908] text-white hover:bg-[#C9A84C] hover:text-[#0A0908]"}`}>
              {added ? "✓ ADDED" : "ADD TO BAG"}
            </button>
          </div>
        </div>
        <p className="text-[9px] uppercase tracking-[0.25em] text-[#7A7571] font-inter mb-0.5">{p.designer}</p>
        <h3 className="text-sm font-inter text-[#0A0908] line-clamp-1 mb-1">{p.name}</h3>
        <p className="font-inter text-sm font-semibold text-[#0A0908]">₦{p.price.toLocaleString()}</p>
      </Link>
    </motion.article>
  );
}

export default function MenHome() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target:heroRef, offset:["start start","end start"] });
  const bgY = useTransform(scrollYProgress, [0,1], ["0%","20%"]);
  const opacity = useTransform(scrollYProgress, [0,.7], [1,0]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Topbar />

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[600px] overflow-hidden bg-[#0A0908]">
        <motion.div style={{y:bgY}} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1800&q=90"
            alt="Men's Collection"
            className="w-full h-[115%] object-cover opacity-55"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0908]/50 via-transparent to-[#0A0908]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0908]/40" />

        <motion.div style={{opacity}} className="relative z-10 h-full flex items-center justify-end pr-6 lg:pr-16">
          <div className="max-w-xl text-right">
            <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.3}}
              className="text-[#C9A84C] text-[10px] tracking-[0.55em] font-inter uppercase mb-5 flex items-center justify-end gap-3">
              SS 2025 Men's Edit <span className="w-8 h-px bg-[#C9A84C]" />
            </motion.p>
            <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:.5,duration:.9}}
              className="font-cormorant text-[clamp(3.5rem,9vw,7rem)] font-light text-white leading-[0.95] mb-6">
              The <em className="italic text-[#C9A84C]">Gentleman's</em><br />Edit.
            </motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9}}
              className="text-white/50 font-inter text-base leading-relaxed mb-10 max-w-sm ml-auto">
              Power. Refinement. Culture. Nigerian menswear for the man who knows his worth.
            </motion.p>
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:1.1}} className="flex flex-wrap gap-4 justify-end">
              <Link to="/men/shop" className="group bg-[#C9A84C] text-[#0A0908] px-9 py-4 text-xs font-semibold tracking-[0.3em] hover:bg-white transition-all duration-300 flex items-center gap-3">
                SHOP MEN <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/bestsellers" className="border border-white/30 text-white px-9 py-4 text-xs font-medium tracking-[0.3em] hover:border-white hover:bg-white/10 transition-all duration-300">
                BESTSELLERS
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══ FEATURED CATEGORIES ══ */}
      <section className="section-pad px-6 lg:px-16 max-w-screen-xl mx-auto">
        <FadeUp className="mb-14">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] font-inter uppercase mb-2">The Collection</p>
          <h2 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-light text-[#0A0908] leading-none">Shop <em className="italic">His</em> World</h2>
        </FadeUp>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MEN_CATS.map((cat, i) => (
            <FadeUp key={cat.label} delay={i*0.08}>
              <Link to={cat.href} className="group block relative overflow-hidden aspect-[3/4] bg-[#1C1C1A]">
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-[#C9A84C] text-[8px] tracking-[0.35em] font-inter uppercase mb-0.5">{cat.sub}</p>
                  <h3 className="font-cormorant text-xl font-light text-white">{cat.label}</h3>
                </div>
                <div className="absolute top-3 right-3 w-7 h-7 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-[#C9A84C]">
                  <span className="text-white text-xs">→</span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ DARK EDITORIAL CAMPAIGN ══ */}
      <section className="bg-[#0A0908] py-24 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 grid md:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=900&q=85" alt="" className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6 bg-[#C9A84C] text-[#0A0908] text-[9px] font-bold tracking-[0.3em] px-4 py-2">SS 2025</div>
            </div>
          </FadeUp>
          <FadeUp delay={.2}>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] font-inter uppercase mb-6">The Agbada Edit</p>
            <h2 className="font-cormorant text-[clamp(2.5rem,5vw,4.5rem)] font-light text-white leading-[1.0] mb-6">
              Ceremonial wear,<br /><em className="italic">reimagined</em> for the<br />modern man.
            </h2>
            <div className="w-10 h-px bg-[#C9A84C] mb-6" />
            <p className="text-white/40 font-inter text-sm leading-relaxed mb-8">
              Hand-woven by master artisans in Iseyin, Oyo State. Each agbada takes up to 40 hours to complete. This is not fashion — it is inheritance.
            </p>
            <Link to="/men/shop?category=Agbada" className="inline-flex items-center gap-3 border border-[#C9A84C]/40 text-[#C9A84C] text-xs tracking-[0.35em] px-8 py-4 hover:bg-[#C9A84C] hover:text-[#0A0908] transition-all duration-300 group">
              SHOP AGBADA <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ══ NEW ARRIVALS ══ */}
      <section className="section-pad px-6 lg:px-16 max-w-screen-xl mx-auto">
        <FadeUp className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] font-inter uppercase mb-2">Just In</p>
            <h2 className="font-cormorant text-[clamp(2.5rem,5vw,4rem)] font-light text-[#0A0908] leading-none">New <em className="italic">Arrivals</em></h2>
          </div>
          <Link to="/new-arrivals" className="hidden md:flex items-center gap-2 text-xs font-inter font-medium text-[#0A0908] hover:text-[#C9A84C] transition-colors group">
            View All <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </FadeUp>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {(newIn.length > 0 ? newIn : allMen).slice(0,8).map((p,i) => <ProductCard key={p.id} p={p} delay={i*0.06} />)}
        </div>
      </section>

      {/* ══ NEWSLETTER ══ */}
      <section className="py-20 bg-[#F5F0E8] border-t border-[#E0DBD4]">
        <FadeUp className="max-w-lg mx-auto text-center px-6">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.5em] font-inter uppercase mb-3">The Edit</p>
          <h3 className="font-cormorant text-[clamp(2rem,4vw,3rem)] font-light text-[#0A0908] mb-2">Stay in the Know</h3>
          <p className="text-[#7A7571] text-sm font-inter mb-8">Exclusive previews, private sales, and styling from Lagos.</p>
          <form onSubmit={e=>e.preventDefault()} className="flex border border-[#E0DBD4] hover:border-[#C9A84C] focus-within:border-[#C9A84C] transition-colors">
            <input type="email" placeholder="Your email address" className="flex-1 px-5 py-4 bg-transparent text-[#0A0908] placeholder-[#C4BFBA] text-sm font-inter outline-none" />
            <button className="px-7 py-4 bg-[#0A0908] text-white text-[10px] font-semibold tracking-[0.3em] hover:bg-[#C9A84C] hover:text-[#0A0908] transition-colors whitespace-nowrap">JOIN</button>
          </form>
        </FadeUp>
      </section>

      <Footer />
    </div>
  );
}
