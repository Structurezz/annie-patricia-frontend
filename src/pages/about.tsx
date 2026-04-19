"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";

const VALUES = [
  { icon: "🌿", title: "Heritage Materials", body: "We source only the finest aso-oke, ankara, adire and kente fabrics directly from master weavers across Nigeria's six geopolitical zones." },
  { icon: "🤝", title: "Artisan-First", body: "Every garment is hand-crafted by skilled Nigerian tailors, paid fairly and given creative recognition. We list artisan credits on every piece." },
  { icon: "♻️", title: "Considered Production", body: "Small-batch drops. Zero overproduction. Fabric offcuts become accessories. We're working toward full carbon-neutral shipping by 2026." },
  { icon: "✦", title: "Radical Authenticity", body: "We never compromise on the cultural integrity of our designs. Every motif has meaning, every pattern has a story we share openly." },
];
const TEAM = [
  { name: "Annie Patricia", role: "Founder & Creative Director", img: "https://i.pravatar.cc/300?img=47", bio: "Born in Ikoyi, educated in London, drawn back to Lagos. Annie founded AP in 2020 after 8 years in European luxury fashion." },
  { name: "Chidi Nwosu", role: "Head of Craft & Production", img: "https://i.pravatar.cc/300?img=12", bio: "Third-generation tailor from Aba, Abia State. Chidi leads our 14-person atelier and oversees quality across all collections." },
  { name: "Sade Afolabi", role: "Head of Design", img: "https://i.pravatar.cc/300?img=45", bio: "SCAD-trained textile designer with a specialisation in traditional Nigerian print techniques and contemporary silhouette design." },
];
const TIMELINE = [
  { year: "2020", title: "Founded in Lagos", body: "Annie Patricia launches from a small studio in Victoria Island with 12 pieces." },
  { year: "2021", title: "First Collection", body: "The debut 'Heritage Reborn' collection sells out in 72 hours." },
  { year: "2022", title: "Vogue Africa Feature", body: "Named one of West Africa's most exciting emerging luxury brands." },
  { year: "2023", title: "London Flagship Opens", body: "Our Mayfair showroom opens, bringing Nigerian luxury to the global stage." },
  { year: "2024", title: "5,000 Customers", body: "Milestone reached. Shipping to 12 countries across 4 continents." },
  { year: "2025", title: "SS 2025 Collection", body: "Our biggest and most critically acclaimed collection to date." },
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .65, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Topbar />

      {/* HERO */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[500px] overflow-hidden bg-[#0D0C0A]">
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1600&q=85" alt="" className="w-full h-full object-cover opacity-40" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div>
            <motion.div initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: .4, duration: .8 }} className="h-[2px] bg-[#B8860B] mx-auto mb-6" />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }} className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-4">Est. Lagos 2020</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6, duration: .8 }}
              className="font-playfair text-6xl md:text-8xl text-white font-semibold leading-none mb-6">Our Story</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-white/50 font-inter max-w-md mx-auto">Five years of craft, culture, and conscious luxury.</motion.p>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-6">Our Mission</p>
            <h2 className="font-playfair text-3xl md:text-5xl font-semibold text-[#111] leading-tight mb-8">
              "Nigerian fashion deserves a seat at the global luxury table —{" "}
              <em className="font-normal text-[#B8860B]">we're pulling up the chair.</em>"
            </h2>
            <div className="w-12 h-[2px] bg-[#B8860B] mx-auto mb-8" />
            <p className="text-gray-500 font-inter text-lg leading-relaxed">
              Annie Patricia was born from a simple belief: that the fabrics, skills, and stories of Nigeria belong on the world stage. We build garments that celebrate heritage without compromise — luxurious, contemporary, and proudly Nigerian.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SPLIT STORY */}
      <section className="bg-[#F7F5F2] py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -right-5 w-2/3 aspect-square border-2 border-[#B8860B]/30 -z-10" />
              <div className="absolute top-6 left-6 bg-white p-4 shadow-xl">
                <p className="font-playfair text-3xl font-semibold text-[#111]">2020</p>
                <p className="text-xs text-[#B8860B] font-inter tracking-wider">Founded in Lagos</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={.2}>
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-4">The Beginning</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#111] leading-tight mb-6">From a Victoria Island Studio to the World</h2>
            <div className="space-y-4 text-gray-500 font-inter leading-relaxed">
              <p>In 2020, Annie Patricia Okonkwo returned to Lagos after nearly a decade in European luxury fashion, carrying a singular idea: Nigerian craftsmanship is among the finest in the world — it just needed the right platform.</p>
              <p>She started with 12 pieces, handmade by four artisans in a small Victoria Island studio. The collection sold out in 72 hours, shared entirely by word of mouth.</p>
              <p>Today, we work with over 30 artisans across Nigeria, ship to 12 countries, and remain committed to the same founding principle: <strong className="text-[#111]">make things properly, honour the people who make them, and never compromise on cultural integrity.</strong></p>
            </div>
            <Link to="/category" className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-[#111] border-b border-[#111] pb-0.5 hover:text-[#B8860B] hover:border-[#B8860B] transition-colors">
              Explore the Collection <span>→</span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
          <FadeIn className="text-center mb-16">
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-3">What We Stand For</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#111]">Our Values</h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * .1}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-[#F7F5F2] p-7 h-full border border-transparent hover:border-[#B8860B]/20 transition-colors">
                  <span className="text-3xl mb-5 block">{v.icon}</span>
                  <h3 className="font-playfair text-lg font-semibold text-[#111] mb-3">{v.title}</h3>
                  <p className="text-sm text-gray-500 font-inter leading-relaxed">{v.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 bg-[#111] text-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
          <FadeIn className="text-center mb-16">
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-3">Our Journey</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold">Five Years in the Making</h2>
          </FadeIn>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-8 pl-14">
              {TIMELINE.map((t, i) => (
                <FadeIn key={t.year} delay={i * .08}>
                  <div className="relative">
                    <div className="absolute -left-[37px] w-3 h-3 bg-[#B8860B] rounded-full mt-1.5" />
                    <p className="text-[#B8860B] text-xs font-bold tracking-[0.2em] font-inter mb-0.5">{t.year}</p>
                    <h3 className="font-playfair text-lg font-semibold text-white mb-1">{t.title}</h3>
                    <p className="text-sm text-white/50 font-inter">{t.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 bg-[#F7F5F2]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
          <FadeIn className="text-center mb-16">
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-3">The Faces Behind AP</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#111]">Meet the Team</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((m, i) => (
              <FadeIn key={m.name} delay={i * .1}>
                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 280, damping: 22 }} className="bg-white group">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-playfair text-xl font-semibold text-[#111] mb-0.5">{m.name}</h3>
                    <p className="text-[#B8860B] text-xs font-inter tracking-wider uppercase mb-3">{m.role}</p>
                    <p className="text-sm text-gray-500 font-inter leading-relaxed">{m.bio}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center px-6">
        <FadeIn>
          <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-4">Start Exploring</p>
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#111] mb-6">Wear the Story</h2>
          <Link to="/category" className="inline-block bg-[#111] text-white text-sm font-medium tracking-wider px-12 py-4 hover:bg-[#B8860B] transition-colors duration-300">
            SHOP THE COLLECTION
          </Link>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
}
