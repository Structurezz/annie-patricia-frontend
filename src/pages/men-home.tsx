"use client";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

/* ── Animation variants ────────────────────────────────────────────────────── */
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

// Masked text reveal (child slides up inside overflow-hidden parent)
const maskReveal = {
  hidden: { y: "108%" },
  show:   { y: 0, transition: { duration: 1.1, ease: EASE_EXPO } },
};

// Fade + rise
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Line draw (scaleX from origin-left)
const lineDraw = {
  hidden: { scaleX: 0 },
  show:   { scaleX: 1, transition: { duration: 1.1, ease: EASE_EXPO } },
};

/* ── Hero stagger container ────────────────────────────────────────────────── */
const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 0.6 },
  },
};

/* ── Category grid ─────────────────────────────────────────────────────────── */
const MEN_CATEGORIES = [
  { label: "Agbada",      href: "/men/shop?category=Agbada",      desc: "Command every room" },
  { label: "Kaftan",      href: "/men/shop?category=Kaftan",       desc: "Timeless comfort" },
  { label: "Bags",        href: "/men/shop?category=Bags",         desc: "Carry with intent" },
  { label: "Accessories", href: "/men/shop?category=Accessories",  desc: "The final touch" },
];

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] rounded-sm bg-[#EDE7DF]" />
    <div className="mt-3 space-y-2">
      <div className="h-3 rounded w-3/4 bg-[#EDE7DF]" />
      <div className="h-3 rounded w-1/2 bg-[#EDE7DF]" />
    </div>
  </div>
);

export default function MenHome() {
  const newRef  = useRef(null);
  const bestRef = useRef(null);
  const newInView  = useInView(newRef,  { once: true, margin: "-60px" });
  const bestInView = useInView(bestRef, { once: true, margin: "-60px" });

  const { products: newArrivals, loading: loadingNew } = useProducts({
    gender: "MEN", badge: "NEW", limit: 8, sort: "createdAt", order: "desc",
  });
  const { products: bestsellers, loading: loadingBest } = useProducts({
    gender: "MEN", badge: "BESTSELLER", limit: 8, sort: "soldCount", order: "desc",
  });

  return (
    <div className="min-h-screen font-inter">
      <Topbar />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Cinematic
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">

        {/* ── Ken Burns image ── */}
        <motion.img
          src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1800&q=90"
          alt="Men's Collection"
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ scale: 1.18, x: "2%" }}
          animate={{ scale: 1.02, x: 0 }}
          transition={{ duration: 14, ease: "easeOut" }}
        />

        {/* ── Film grain overlay ── */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        />

        {/* ── Gradients ── */}
        <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#0B0A09] via-[#0B0A09]/75 to-[#0B0A09]/10" />
        <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[#0B0A09] via-transparent to-[#0B0A09]/40" />

        {/* ── Cinematic top bar slides away ── */}
        <motion.div
          initial={{ height: "10vh" }}
          animate={{ height: 0 }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          className="absolute top-0 left-0 right-0 bg-[#0B0A09] z-[15]"
        />
        {/* ── Cinematic bottom bar slides away ── */}
        <motion.div
          initial={{ height: "10vh" }}
          animate={{ height: 0 }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          className="absolute bottom-0 left-0 right-0 bg-[#0B0A09] z-[15]"
        />

        {/* ── Hero content ── */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-8 md:px-16 lg:px-24"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >

          {/* Eyebrow row */}
          <motion.div variants={fadeUp} className="flex items-center gap-5 mb-10">
            <motion.div
              variants={lineDraw}
              style={{ originX: 0 }}
              className="w-14 h-px bg-[#C9A84C]"
            />
            <p className="text-[10px] tracking-[0.65em] text-[#C9A84C] uppercase font-medium">
              Men's Collection · SS 2025
            </p>
          </motion.div>

          {/* Main headline — each line masked */}
          <h1 className="font-cormorant font-bold leading-[0.87] tracking-tight mb-12 select-none"
              style={{ fontSize: "clamp(4.5rem, 13vw, 11.5rem)" }}>

            <div className="overflow-hidden">
              <motion.span variants={maskReveal} className="block">
                Dressed
              </motion.span>
            </div>

            <div className="overflow-hidden">
              <motion.span
                variants={maskReveal}
                className="block italic text-[#C9A84C]"
                style={{ WebkitTextStroke: "0px" }}
              >
                for Power.
              </motion.span>
            </div>
          </h1>

          {/* Gold separator line */}
          <motion.div
            variants={lineDraw}
            style={{ originX: 0 }}
            className="w-24 h-[1.5px] bg-[#C9A84C] mb-10"
          />

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-16">
            <Link to="/men/shop"
              className="relative overflow-hidden group px-10 py-4 bg-[#C9A84C] text-[#0B0A09] text-[11px] font-bold tracking-[0.35em] uppercase transition-colors hover:bg-[#E2C97E]">
              <span className="relative z-10">SHOP THE EDIT</span>
            </Link>
            <Link to="/men/shop?category=Agbada"
              className="px-10 py-4 border border-white/25 text-white text-[11px] tracking-[0.35em] uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors duration-300">
              AGBADA
            </Link>
          </motion.div>

          {/* Stat bar */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-10 md:gap-16 pt-8 border-t border-white/10"
          >
            {[
              { n: "4",     label: "Signature Categories" },
              { n: "100%",  label: "Nigerian Crafted" },
              { n: "SS25",  label: "Latest Season" },
            ].map(s => (
              <div key={s.label}>
                <p className="font-cormorant text-[2rem] font-bold text-[#C9A84C] leading-none">{s.n}</p>
                <p className="text-[9px] tracking-[0.32em] text-white/30 uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Vertical scroll cue ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="absolute right-8 bottom-10 z-10 flex flex-col items-center gap-4"
        >
          <span className="text-[8px] tracking-[0.55em] text-white/20 uppercase [writing-mode:vertical-rl]">
            Scroll
          </span>
          {/* Animated dot */}
          <div className="relative w-px h-16">
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
            <motion.div
              animate={{ y: [0, 48, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-[#C9A84C]"
            />
          </div>
        </motion.div>

        {/* ── Corner label ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute top-28 right-8 z-10 hidden lg:flex flex-col items-center gap-3"
        >
          <div className="w-px h-12 bg-white/10" />
          <span className="text-[8px] tracking-[0.5em] text-white/15 uppercase [writing-mode:vertical-rl]">
            Annie Patricia
          </span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY GRID
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0B0A09] border-t border-white/[0.06]">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {MEN_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_EXPO }}
            >
              <Link to={cat.href}
                className="group relative flex flex-col justify-end h-56 md:h-72 bg-[#0F0E0B] border-r border-b border-white/[0.06] p-7 overflow-hidden hover:bg-[#181610] transition-colors duration-500">
                {/* Gold corner lines */}
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#C9A84C] group-hover:w-full transition-all duration-500 ease-out" />
                <div className="absolute top-0 left-0 h-0 w-[2px] bg-[#C9A84C] group-hover:h-full transition-all duration-700 ease-out delay-150" />

                {/* Glow */}
                <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/[0.03] transition-all duration-700" />

                <p className="text-[9px] tracking-[0.38em] text-[#C9A84C] uppercase mb-2">
                  {cat.desc}
                </p>
                <h3 className="font-cormorant text-3xl md:text-[2.6rem] font-bold leading-none tracking-tight">
                  {cat.label}
                </h3>
                <div className="flex items-center gap-3 mt-5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400">
                  <span className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Shop</span>
                  <div className="h-px w-8 bg-[#C9A84C]" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          NEW ARRIVALS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#FAF8F5] px-5 lg:px-12 py-20">
        <div className="max-w-screen-xl mx-auto">
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE_EXPO }}
                style={{ originX: 0 }}
                className="w-8 h-px bg-[#C9A84C]"
              />
              <p className="text-[10px] tracking-[0.45em] text-[#C9A84C] uppercase">Just Dropped</p>
            </div>
            <h2 className="font-cormorant text-[#0B0A09] font-bold text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link to="/new-arrivals?gender=MEN"
            className="group flex items-center gap-3 text-[11px] tracking-[0.2em] text-[#7A7571] uppercase hover:text-[#0B0A09] transition-colors">
            View all
            <div className="w-8 h-px bg-[#ECEAE6] group-hover:bg-[#C9A84C] group-hover:w-12 transition-all duration-300" />
          </Link>
        </motion.div>

        <div ref={newRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {loadingNew
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : newArrivals.map((p, i) => (
                <motion.div key={p._id || p.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={newInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.11, ease: EASE_EXPO }}>
                  <ProductCard product={p} />
                </motion.div>
              ))
          }
        </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          AGBADA EDITORIAL
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[72vh] min-h-[540px] overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=85"
          alt="Agbada"
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1.0 }}
          viewport={{ once: true }}
          transition={{ duration: 10, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09] via-[#0B0A09]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/80 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } } }}
          >
            <motion.p variants={fadeUp} className="text-[10px] tracking-[0.5em] text-[#C9A84C] uppercase mb-6 flex items-center gap-4">
              <span className="w-8 h-px bg-[#C9A84C]" /> Traditional Wear
            </motion.p>

            <div className="overflow-hidden mb-2">
              <motion.h2
                variants={maskReveal}
                className="font-cormorant font-bold leading-[0.9] tracking-tight"
                style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
              >
                Command
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h2
                variants={maskReveal}
                className="font-cormorant font-bold italic text-[#C9A84C] leading-[0.9] tracking-tight"
                style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
              >
                the room.
              </motion.h2>
            </div>

            <motion.p variants={fadeUp} className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm">
              Hand-crafted Agbada — where Nigerian heritage meets commanding presence.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link to="/men/shop?category=Agbada"
                className="inline-flex items-center gap-4">
                <span className="px-10 py-4 border border-[#C9A84C] text-[#C9A84C] text-[11px] tracking-[0.35em] uppercase hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-colors duration-300">
                  SHOP AGBADA
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right-side label */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
          <div className="h-20 w-px bg-white/10" />
          <span className="text-[9px] tracking-[0.5em] text-white/15 uppercase [writing-mode:vertical-rl]">
            Agbada Collection
          </span>
          <div className="h-20 w-px bg-white/10" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BESTSELLERS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-[#ECEAE6] px-5 lg:px-12 py-20">
        <div className="max-w-screen-xl mx-auto">
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE_EXPO }}
                style={{ originX: 0 }}
                className="w-8 h-px bg-[#C9A84C]"
              />
              <p className="text-[10px] tracking-[0.45em] text-[#C9A84C] uppercase">Most Wanted</p>
            </div>
            <h2 className="font-cormorant text-[#0B0A09] font-bold text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-tight">
              Bestsellers
            </h2>
          </div>
          <Link to="/bestsellers?gender=MEN"
            className="group flex items-center gap-3 text-[11px] tracking-[0.2em] text-[#7A7571] uppercase hover:text-[#0B0A09] transition-colors">
            View all
            <div className="w-8 h-px bg-[#ECEAE6] group-hover:bg-[#C9A84C] group-hover:w-12 transition-all duration-300" />
          </Link>
        </motion.div>

        <div ref={bestRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {loadingBest
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : bestsellers.map((p, i) => (
                <motion.div key={p._id || p.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={bestInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.11, ease: EASE_EXPO }}>
                  <ProductCard product={p} />
                </motion.div>
              ))
          }
        </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0D0C09] border-t border-white/[0.06] overflow-hidden">
        {/* Diagonal accent lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-16 w-px h-[200%] bg-[#C9A84C]/[0.07] rotate-[14deg]" />
          <div className="absolute -top-1/2 right-8 w-px h-[200%] bg-[#C9A84C]/[0.04] rotate-[14deg]" />
          <div className="absolute -top-1/2 -right-40 w-px h-[200%] bg-[#C9A84C]/[0.04] rotate-[14deg]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE_EXPO }}
          className="relative z-10 max-w-screen-xl mx-auto px-8 md:px-16 py-28 flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <div>
            <p className="text-[10px] tracking-[0.55em] text-[#C9A84C] uppercase mb-4">The Full Edit</p>
            <h2 className="font-cormorant font-bold text-black text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-tight">
              Every piece.<br />Every craft.
            </h2>
          </div>
          <Link to="/men/shop"
            className="flex-shrink-0 px-14 py-5 border border-[#C9A84C] text-black text-[11px] font-bold tracking-[0.45em] uppercase hover:bg-[#C9A84C] hover:text-[#0B0A09] transition-all duration-300">
            SHOP ALL MEN'S
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
