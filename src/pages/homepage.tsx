"use client";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { allProducts } from "../components/data/products";

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: .6 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: .08 } } };

const featured    = allProducts.filter(p => p.badge === "BESTSELLER").slice(0, 8);
const newArrivals = allProducts.filter(p => p.badge === "NEW").slice(0, 8);
const saleItems   = allProducts.filter(p => p.badge === "SALE").slice(0, 4);

const CATEGORIES = [
  { label: "Dresses",      href: "/category?category=Dresses",              img: "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=500&q=80" },
  { label: "Kaftans",      href: "/category?category=Kaftan",               img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80" },
  { label: "Sets",         href: "/category?category=Kimono and pant sets", img: "https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=500&q=80" },
  { label: "Agbada",       href: "/category?category=Agbada",               img: "https://images.unsplash.com/photo-1591400073680-d4a22e58efd8?w=500&q=80" },
  { label: "Bags",         href: "/category?category=Bags",                 img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80" },
  { label: "Accessories",  href: "/category?category=Accessories",          img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80" },
];

/* ── product card ── */
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
          <span className={`badge absolute top-3 left-3 ${badgeStyle[p.badge]}`}>{p.badge}</span>
        )}
        <button onClick={handleWish}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-sm transition-colors ${wish ? "text-red-500" : "text-[#7A7571] hover:text-red-400"}`}>
          {wish ? "♥" : "♡"}
        </button>
        <div className="card-actions absolute inset-x-0 bottom-0">
          <button onClick={handleCart}
            className={`w-full py-3 text-[11px] font-inter font-semibold tracking-[.18em] transition-colors ${added ? "bg-[#C9A84C] text-[#0B0A09]" : "bg-white text-[#0B0A09] hover:bg-[#0B0A09] hover:text-white"}`}>
            {added ? "✓ ADDED" : "ADD TO BAG"}
          </button>
        </div>
      </div>
      <div className="pt-3 pb-4">
        <p className="text-[10px] uppercase tracking-[.2em] text-[#7A7571] font-inter mb-0.5">{p.designer}</p>
        <p className="text-[13px] font-inter text-[#1A1916] leading-snug line-clamp-2 mb-1.5">{p.name}</p>
        <p className="text-sm font-semibold font-inter text-[#0B0A09]">₦{p.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

function SectionHead({ eyebrow, title, sub, cta, href }: { eyebrow?: string; title: string; sub?: string; cta?: string; href?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={fadeUp}
      className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
      <div>
        {eyebrow && <p className="text-[10px] tracking-[.4em] text-[#C9A84C] font-inter uppercase mb-2">{eyebrow}</p>}
        <h2 className="font-cormorant text-[clamp(1.9rem,4.5vw,3.2rem)] font-light text-[#0B0A09] leading-none">{title}</h2>
        {sub && <p className="text-[13px] text-[#7A7571] font-inter mt-1.5">{sub}</p>}
      </div>
      {cta && href && (
        <Link to={href} className="shrink-0 text-[11px] font-inter font-medium tracking-[.18em] text-[#0B0A09] border-b border-[#0B0A09] pb-px hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors">
          {cta} →
        </Link>
      )}
    </motion.div>
  );
}

export default function Home() {
  const r1 = useRef(null); const v1 = useInView(r1, { once: true, margin: "-80px" });
  const r2 = useRef(null); const v2 = useInView(r2, { once: true, margin: "-80px" });
  const r3 = useRef(null); const v3 = useInView(r3, { once: true, margin: "-80px" });

  return (
    <div className="bg-white min-h-screen">
      <Topbar />

      {/* HERO */}
      <section className="relative h-[88vh] min-h-[520px] max-h-[860px] flex overflow-hidden">
        <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=85"
          alt="Hero" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09]/80 via-[#0B0A09]/45 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-2xl">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}
            className="text-[10px] tracking-[.5em] text-[#C9A84C] font-inter uppercase mb-4">SS 2025 Collection</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .1 }}
            className="font-cormorant text-[clamp(3rem,8vw,6rem)] font-light text-white leading-[1.05] mb-6">
            Nigerian Luxury,<br /><em className="italic text-[#C9A84C]">Globally Crafted.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }}
            className="text-white/55 font-inter text-sm leading-relaxed mb-8 max-w-xs">
            Master artisans, heritage fabrics, and contemporary silhouettes.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45 }} className="flex flex-wrap gap-3">
            <Link to="/women" className="px-8 py-3.5 bg-[#C9A84C] text-[#0B0A09] text-[11px] font-inter font-semibold tracking-[.2em] hover:bg-[#E2C97E] transition-colors">SHOP WOMEN</Link>
            <Link to="/men" className="px-8 py-3.5 border border-white/50 text-white text-[11px] font-inter font-medium tracking-[.2em] hover:border-white hover:bg-white/10 transition-colors">SHOP MEN</Link>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] tracking-[.4em] text-white/30 font-inter uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-[#0B0A09] py-3.5 overflow-hidden">
        <div className="marquee-track">
          {[...Array(3)].flatMap(() => ["FREE DELIVERY OVER ₦50,000","·","ARTISAN CRAFTED IN NIGERIA","·","SECURE PAYSTACK CHECKOUT","·","NEW DROPS EVERY WEEK","·"]).map((t, i) => (
            <span key={i} className={`px-7 whitespace-nowrap font-inter text-[10px] tracking-[.25em] ${t === "·" ? "text-[#C9A84C]" : "text-white/45"}`}>{t}</span>
          ))}
        </div>
      </div>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-screen-xl mx-auto px-5 lg:px-10 py-16 md:py-20">
        <SectionHead eyebrow="Explore" title="Shop by Category" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06, duration: .5 }}>
              <Link to={cat.href} className="group block relative overflow-hidden aspect-[3/4] bg-[#F2EDE4]">
                <img src={cat.img} alt={cat.label} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/80 via-transparent to-transparent" />
                <p className="absolute bottom-4 w-full text-center font-cormorant text-[1.25rem] font-light text-white">{cat.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-[#F7F4EF] py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <SectionHead eyebrow="Just Landed" title="New Arrivals" sub={`${newArrivals.length} fresh pieces this season`} cta="View all" href="/new-arrivals" />
          <motion.div ref={r1} initial="hidden" animate={v1 ? "show" : "hidden"} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {newArrivals.map(p => (
              <motion.div key={p.id} variants={fadeUp}><ProductCard p={p} /></motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EDITORIAL — Women */}
      <section className="relative overflow-hidden h-[480px] md:h-[600px]">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=85" alt="Women" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0B0A09]/55" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
            <p className="text-[10px] tracking-[.5em] text-[#C9A84C] font-inter uppercase mb-4">Women's Collection</p>
            <h2 className="font-cormorant text-[clamp(2.8rem,7vw,5.5rem)] font-light text-white mb-6 leading-tight">
              She Wears <em className="italic text-[#C9A84C]">Heritage.</em>
            </h2>
            <Link to="/women" className="inline-block px-10 py-3.5 border border-[#C9A84C] text-[#C9A84C] text-[11px] font-inter font-medium tracking-[.25em] hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-colors">
              EXPLORE WOMEN
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="max-w-screen-xl mx-auto px-5 lg:px-10 py-16 md:py-20">
        <SectionHead eyebrow="Customer Favourites" title="Bestsellers" sub="The pieces everyone loves" cta="View all" href="/bestsellers" />
        <motion.div ref={r2} initial="hidden" animate={v2 ? "show" : "hidden"} variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {featured.map(p => (
            <motion.div key={p.id} variants={fadeUp}><ProductCard p={p} /></motion.div>
          ))}
        </motion.div>
      </section>

      {/* PROMO BANNERS */}
      <section className="max-w-screen-xl mx-auto px-5 lg:px-10 pb-16">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden h-[380px] bg-[#0B0A09]">
            <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=85" alt="Men"
              className="w-full h-full object-cover opacity-65 hover:opacity-80 transition-opacity duration-500" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <p className="text-[10px] tracking-[.4em] text-[#C9A84C] font-inter uppercase mb-2">Men's Edit</p>
              <h3 className="font-cormorant text-4xl font-light text-white mb-5">The Gentleman's<br />Collection</h3>
              <Link to="/men" className="self-start px-7 py-2.5 border border-white/40 text-white text-[10px] font-inter tracking-[.2em] hover:bg-white hover:text-[#0B0A09] transition-colors">
                SHOP MEN →
              </Link>
            </div>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="relative overflow-hidden h-[180px] bg-[#F2EDE4]">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="New Arrivals"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09]/70 to-transparent flex items-center px-7">
                <div>
                  <p className="text-[9px] tracking-[.35em] text-[#C9A84C] font-inter uppercase mb-1">SS 2025</p>
                  <p className="font-cormorant text-2xl text-white mb-3">New Arrivals</p>
                  <Link to="/new-arrivals" className="text-[10px] font-inter text-white/65 underline underline-offset-2 hover:text-[#C9A84C] transition-colors">Shop Now</Link>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden h-[180px] bg-[#0B0A09]">
              <img src="https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=800&q=80" alt="Bestsellers"
                className="w-full h-full object-cover opacity-50 hover:opacity-65 transition-opacity duration-500" />
              <div className="absolute inset-0 flex items-center px-7">
                <div>
                  <p className="text-[9px] tracking-[.35em] text-[#C9A84C] font-inter uppercase mb-1">Top Picks</p>
                  <p className="font-cormorant text-2xl text-white mb-3">Bestsellers</p>
                  <Link to="/bestsellers" className="text-[10px] font-inter text-white/65 underline underline-offset-2 hover:text-[#C9A84C] transition-colors">View All</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-[#0B0A09] py-16 md:py-20">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-[10px] tracking-[.45em] text-[#C9A84C] font-inter uppercase mb-3">Why Choose Us</p>
            <h2 className="font-cormorant text-[clamp(1.9rem,4.5vw,3.2rem)] font-light text-white">The Annie Patricia Promise</h2>
          </motion.div>
          <motion.div ref={r3} initial="hidden" animate={v3 ? "show" : "hidden"} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: "🎨", title: "Artisan Crafted",  desc: "Every piece made by skilled Nigerian artisans." },
              { icon: "🚚", title: "Free Delivery",    desc: "Free on all orders over ₦50,000 nationwide." },
              { icon: "↩",  title: "Easy Returns",    desc: "Return within 30 days for a full refund." },
              { icon: "🔒", title: "Secure Payment",  desc: "Checkout safely via Paystack." },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="text-3xl mb-4">{item.icon}</div>
                <p className="font-cormorant text-[1.3rem] text-white mb-2">{item.title}</p>
                <p className="text-[12px] text-white/40 font-inter leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
