"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Topbar from "../components/TopBar";

const WOMEN_IMAGES = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=90",
  "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=1200&q=90",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=90",
];
const MEN_IMAGES = [
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=90",
  "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1200&q=90",
  "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1200&q=90",
];

export default function Home() {
  const [hovered, setHovered] = useState<"women" | "men" | null>(null);
  const [wImgIdx, setWImgIdx] = useState(0);
  const [mImgIdx, setMImgIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const t = setInterval(() => setWImgIdx(i => (i + 1) % WOMEN_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setMImgIdx(i => (i + 1) % MEN_IMAGES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0908] overflow-hidden">
      <Topbar />

      {/* ── SPLIT GENDER HERO ── */}
      <div
        className="relative flex h-[calc(100vh-104px)]"
        style={{ minHeight: 500 }}
      >
        {/* WOMEN SIDE */}
        <Link
          to="/women"
          onMouseEnter={() => setHovered("women")}
          onMouseLeave={() => setHovered(null)}
          className="relative overflow-hidden cursor-pointer group"
          style={{
            flex: hovered === "men" ? "0 0 36%" : hovered === "women" ? "0 0 64%" : "0 0 50%",
            transition: "flex .65s cubic-bezier(.77,0,.175,1)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={wImgIdx}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              src={WOMEN_IMAGES[wImgIdx]}
              alt="Women"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/75" />
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: "rgba(10,9,8,0.3)", opacity: hovered === "women" ? 0 : 0.2 }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: .4, duration: .8 }}>
              <p className="text-[#C9A84C] text-[10px] tracking-[0.45em] font-inter uppercase mb-3">The Collection</p>
              <h2 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl font-light text-white italic leading-none mb-4">Women</h2>
              <div className="w-8 h-px bg-[#C9A84C] mx-auto mb-4" />
              <p className="text-white/50 text-xs font-inter tracking-wider mb-6">Luxury • Heritage • Power</p>
              <div className={`inline-flex items-center gap-2 border border-white/30 text-white text-xs tracking-[0.25em] px-6 py-3 transition-all duration-300 ${hovered === "women" ? "bg-[#C9A84C] border-[#C9A84C]" : ""}`}>
                ENTER →
              </div>
            </motion.div>
          </div>
        </Link>

        {/* DIVIDER */}
        <div className="relative z-10 w-px bg-[#C9A84C]/40 shrink-0 flex items-center justify-center">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent" />
          {/* Central brand badge */}
          <motion.div
            initial={{ opacity: 0, scale: .8 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: .8, duration: .6 }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 bg-[#0A0908] border border-[#C9A84C]/40 px-4 py-5 flex flex-col items-center gap-1 whitespace-nowrap hidden lg:flex"
          >
            <div className="w-px h-8 bg-[#C9A84C]/50 mb-1" />
            <p className="font-cormorant text-white text-sm tracking-[0.35em] font-light">ANNIE</p>
            <p className="font-cormorant text-white text-sm tracking-[0.35em] font-light">PATRICIA</p>
            <div className="w-5 h-px bg-[#C9A84C] my-0.5" />
            <p className="text-[#C9A84C] text-[9px] tracking-[0.3em] font-inter">LAGOS</p>
            <div className="w-px h-8 bg-[#C9A84C]/50 mt-1" />
          </motion.div>
        </div>

        {/* MEN SIDE */}
        <Link
          to="/men"
          onMouseEnter={() => setHovered("men")}
          onMouseLeave={() => setHovered(null)}
          className="relative overflow-hidden cursor-pointer group"
          style={{
            flex: hovered === "women" ? "0 0 36%" : hovered === "men" ? "0 0 64%" : "0 0 50%",
            transition: "flex .65s cubic-bezier(.77,0,.175,1)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={mImgIdx}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              src={MEN_IMAGES[mImgIdx]}
              alt="Men"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/75" />
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: "rgba(10,9,8,0.3)", opacity: hovered === "men" ? 0 : 0.2 }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: .6, duration: .8 }}>
              <p className="text-[#C9A84C] text-[10px] tracking-[0.45em] font-inter uppercase mb-3">The Edit</p>
              <h2 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl font-light text-white italic leading-none mb-4">Men</h2>
              <div className="w-8 h-px bg-[#C9A84C] mx-auto mb-4" />
              <p className="text-white/50 text-xs font-inter tracking-wider mb-6">Elegance • Tradition • Craft</p>
              <div className={`inline-flex items-center gap-2 border border-white/30 text-white text-xs tracking-[0.25em] px-6 py-3 transition-all duration-300 ${hovered === "men" ? "bg-[#C9A84C] border-[#C9A84C]" : ""}`}>
                ENTER →
              </div>
            </motion.div>
          </div>
        </Link>

        {/* Mobile: stack vertically */}
        <style>{`@media (max-width:640px){.gender-row{flex-direction:column!important;}.gender-row>a{flex:1!important;min-height:50vh;}}`}</style>
      </div>

      {/* ── BOTTOM BRAND STRIP ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: .8 }}
        className="bg-[#0A0908] border-t border-[#C9A84C]/20 py-5"
      >
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left label */}
          <p className="text-[#C9A84C]/40 text-[10px] tracking-[0.4em] font-inter hidden sm:block">EST. LAGOS 2020</p>
          {/* Center brand */}
          <div className="text-center">
            <p className="font-cormorant text-white text-lg tracking-[0.5em] font-light">ANNIE PATRICIA</p>
            <p className="text-[#C9A84C]/50 text-[9px] tracking-[0.5em] font-inter mt-0.5">NIGERIAN LUXURY FASHION</p>
          </div>
          {/* Right nav */}
          <div className="flex gap-6">
            {[{label:"New In",href:"/new-arrivals"},{label:"Bestsellers",href:"/bestsellers"},{label:"Contact",href:"/contact"}].map(l => (
              <Link key={l.label} to={l.href} className="text-[#C9A84C]/40 hover:text-[#C9A84C] text-[10px] tracking-[0.3em] font-inter uppercase transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
