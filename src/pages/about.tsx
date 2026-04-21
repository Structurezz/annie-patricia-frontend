"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";

// --- Specialized Animation Components ---
const RevealText = ({ children, delay = 0 }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  </div>
);

const ParallaxImage = ({ src, alt, speed = 0.1 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative overflow-hidden w-full h-full">
      <motion.img style={{ scale: 1.2, y }} src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default function AboutDetailed() {
  return (
    <div className="bg-[#F9F7F4] text-[#1A1A1A] font-inter selection:bg-[#B8860B] selection:text-white">
      <Topbar />

      {/* 1. CINEMATIC HERO */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-60">
          <ParallaxImage 
            src="https://images.unsplash.com/photo-1590736962031-6ec68d0674f1?auto=format&fit=crop&q=80&w=2000" 
            alt="Lagos Atelier" 
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <RevealText>
            <span className="text-[#B8860B] uppercase tracking-[0.4em] text-[11px] font-medium mb-4 block">
              The House of Annie Patricia
            </span>
          </RevealText>
          <RevealText delay={0.1}>
            <h1 className="text-5xl md:text-8xl font-playfair italic text-white leading-tight mb-6">
              A Love Letter <br /> to Nigeria
            </h1>
          </RevealText>
        </div>
        <div className="absolute bottom-12 left-12 hidden md:block">
          <p className="text-white/40 text-[10px] tracking-widest leading-loose uppercase">
            Est. 2020 <br /> Lagos, Nigeria
          </p>
        </div>
      </section>

      {/* 2. THE ORIGIN STORY (The Founder's Journey) */}
      <section className="py-24 lg:py-40 px-6">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[3/4] w-full md:w-4/5">
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" 
                alt="Annie Patricia" 
              />
            </div>
            <div className="absolute -bottom-10 -right-4 md:right-0 bg-[#111] text-white p-8 md:p-12 max-w-sm">
              <h3 className="font-playfair italic text-2xl mb-4">"The London degree taught me technique; Lagos taught me soul."</h3>
              <p className="text-xs text-white/50 tracking-widest uppercase">— Annie Patricia, Founder</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <span className="text-[#B8860B] text-xs font-bold tracking-widest uppercase">The Genesis</span>
            <h2 className="text-4xl md:text-5xl font-playfair leading-[1.1]">From Ikoyi to Mayfair: A Return to Roots.</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed font-light text-lg">
              <p>
                In 2019, after eight years climbing the ranks of luxury houses in London and Paris, Annie returned to her childhood home in Ikoyi. She found her mother’s vintage Aso-Oke collection—hand-woven fabrics that had survived forty years with their luster intact.
              </p>
              <p>
                Seeing the disconnect between Nigeria's rich textile history and the fast-fashion influx, Annie Patricia was founded. Not just as a label, but as a preservation project. 
              </p>
              <p>
                What started with a single tailor in a converted garage is now a multi-continental bridge between West African artistry and global high-fashion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDUCATION: THE TEXTILE GLOSSARY (Interactive Cards) */}
      <section className="bg-white py-24 px-6 border-y border-gray-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-playfair text-4xl md:text-5xl mb-4 italic">Understanding Our Canvas</h2>
            <p className="text-gray-500 font-light max-w-xl mx-auto">We don't just use fabric; we use heritage. Learn about the centuries-old techniques behind every AP garment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Aso-Oke", origin: "Yoruba Heritage", desc: "A prestigious hand-loomed cloth. We use 'Sanyan' and 'Alaari' variants, woven by families who have held the craft for five generations." },
              { name: "Adire", origin: "Egba Artistry", desc: "Indigo-dyed cloth using resist-dyeing techniques. Every pattern represents a proverb or a blessing from the maker." },
              { name: "Kente", origin: "West African Gold", desc: "A royal silk and cotton fabric of the Akan people. We source ours from master weavers to ensure authentic thread counts." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 border border-gray-50 hover:shadow-2xl hover:shadow-[#B8860B]/5 transition-all bg-[#FDFCFB]"
              >
                <span className="text-[#B8860B] text-[10px] tracking-[0.3em] uppercase block mb-4">{item.origin}</span>
                <h4 className="font-playfair text-2xl mb-4">{item.name}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-light">{item.desc}</p>
                <div className="mt-8 h-px bg-gray-100 w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE AP ACADEMY (Social Impact / Education) */}
      <section className="py-24 px-6 lg:px-24">
        <div className="max-w-screen-xl mx-auto bg-[#111] rounded-[40px] overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center">
            <h2 className="text-white font-playfair text-4xl md:text-5xl mb-6 italic">The AP Artisan Academy</h2>
            <p className="text-white/60 font-light leading-relaxed mb-8">
              True luxury is sustainable only if the skills are passed on. Since 2022, we have invested 15% of our profits into our Lagos-based academy, training the next generation of master tailors and weavers in traditional techniques and modern garment construction.
            </p>
            <div className="grid grid-cols-2 gap-8 text-white">
              <div>
                <span className="text-3xl font-playfair text-[#B8860B]">45+</span>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mt-2">Graduates to date</p>
              </div>
              <div>
                <span className="text-3xl font-playfair text-[#B8860B]">100%</span>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mt-2">Fair Wage Certified</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 h-[400px] lg:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1544441893-675973e31d85?w=800&q=80" 
              className="w-full h-full object-cover" 
              alt="Artisans at work"
            />
          </div>
        </div>
      </section>

      {/* 5. CRAFT STATS (The "Why") */}
      <section className="py-24 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Hours per Garment", value: "72+" },
            { label: "Partner Ateliers", value: "14" },
            { label: "Zero-Waste Policy", value: "Since 2021" },
            { label: "Global Presence", value: "12 Countries" }
          ].map((stat, i) => (
            <div key={i}>
              <h5 className="text-3xl font-playfair italic mb-2">{stat.value}</h5>
              <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINAL MANIFESTO */}
      <section className="py-40 relative overflow-hidden bg-[#FDFCFB]">
        <div className="max-w-3xl mx-auto text-center px-6 relative z-10">
          <RevealText>
            <p className="font-playfair text-3xl md:text-5xl leading-tight">
              We don't follow trends. <br /> 
              <span className="text-[#B8860B] italic">We follow the thread.</span> <br />
              Back to where we began.
            </p>
          </RevealText>
          <div className="mt-12">
            <Link 
              to="/collections" 
              className="inline-block px-12 py-5 border border-[#111] text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#111] hover:text-white transition-all duration-500"
            >
              Enter the Collection
            </Link>
          </div>
        </div>
        {/* Subtle Watermark Decorative Text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-playfair opacity-[0.02] whitespace-nowrap pointer-events-none">
          ANNIE PATRICIA ANNIE PATRICIA
        </div>
      </section>

      <Footer />
    </div>
  );
}