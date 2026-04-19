"use client";
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";

const STORES = [
  { city: "Lagos", flag: "🇳🇬", address: "14 Bourdillon Road, Ikoyi, Lagos Island", phone: "+234 (0) 801 234 5678", email: "lagos@anniepatricia.ng", hours: "Mon–Sat 10am–7pm · Sun 12pm–5pm", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80" },
  { city: "London", flag: "🇬🇧", address: "12 Mount Street, Mayfair, London W1K 2RH", phone: "+44 (0) 20 7123 4567", email: "london@anniepatricia.ng", hours: "Mon–Fri 10am–6pm · Sat 10am–5pm", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
];
const FAQS = [
  { q: "How long does delivery take?", a: "Lagos Metro: 1–2 days. Nationwide Nigeria: 3–5 days. International: 7–14 business days. Express shipping available at checkout." },
  { q: "Do you accept returns?", a: "Yes. We offer hassle-free 30-day returns on all full-price items. Simply contact us and we'll arrange collection at no extra charge." },
  { q: "How do I care for my garment?", a: "All our pieces come with care labels. For aso-oke and kente fabrics we recommend dry-clean only. Our customer care team can advise on specific pieces." },
  { q: "Can I customise a piece?", a: "Yes — we offer bespoke commissions for weddings and special occasions. Minimum lead time is 4 weeks. Contact us to discuss your vision." },
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setSending(true);
    setTimeout(() => { setSending(false); setSubmitted(true); }, 1600);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Topbar />

      {/* HERO */}
      <section className="relative bg-[#F7F5F2] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=80" alt="" className="w-full h-full object-cover opacity-10" />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-6 lg:px-16 py-20 md:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-3">We'd Love to Hear From You</p>
            <h1 className="font-playfair text-5xl md:text-7xl font-semibold text-[#111] mb-4">Get in Touch</h1>
            <p className="text-gray-500 font-inter max-w-md mx-auto">Questions about an order, styling advice, or a bespoke commission — we're here.</p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "📧", title: "Email Us", body: "hello@anniepatricia.ng", sub: "We reply within 24 hours" },
            { icon: "📞", title: "Call Us", body: "+234 801 234 5678", sub: "Mon–Fri, 9am–6pm WAT" },
            { icon: "💬", title: "WhatsApp", body: "Chat instantly", sub: "Available 9am–9pm" },
          ].map((c, i) => (
            <FadeIn key={c.title} delay={i * .1}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-center p-8 bg-[#F7F5F2] hover:bg-[#F0EDE7] transition-colors cursor-pointer border border-transparent hover:border-[#B8860B]/20">
                <span className="text-3xl mb-4 block">{c.icon}</span>
                <h3 className="font-playfair text-lg font-semibold text-[#111] mb-1">{c.title}</h3>
                <p className="text-sm font-medium text-[#111] font-inter mb-0.5">{c.body}</p>
                <p className="text-xs text-gray-400 font-inter">{c.sub}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FORM + STORES */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 grid md:grid-cols-2 gap-16">
          {/* Form */}
          <FadeIn>
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-4">Send a Message</p>
            <h2 className="font-playfair text-3xl font-semibold text-[#111] mb-8">Let's Talk</h2>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 font-inter mb-1.5 tracking-wider">Full Name</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full border border-gray-200 px-4 py-3 text-sm font-inter text-[#111] focus:outline-none focus:border-[#B8860B] transition-colors bg-white"
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-inter mb-1.5 tracking-wider">Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full border border-gray-200 px-4 py-3 text-sm font-inter text-[#111] focus:outline-none focus:border-[#B8860B] transition-colors bg-white"
                      placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-inter mb-1.5 tracking-wider">Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-3 text-sm font-inter text-[#111] focus:outline-none focus:border-[#B8860B] transition-colors bg-white cursor-pointer">
                    <option value="">Select a topic</option>
                    {["Order enquiry","Product question","Returns & exchanges","Bespoke commission","Press & media","General"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-inter mb-1.5 tracking-wider">Message</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-3 text-sm font-inter text-[#111] focus:outline-none focus:border-[#B8860B] transition-colors resize-none bg-white"
                    placeholder="Tell us how we can help..." />
                </div>
                <motion.button type="submit" disabled={sending}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: .99 }}
                  className="w-full py-4 bg-[#111] text-white text-sm font-semibold tracking-widest hover:bg-[#B8860B] transition-colors disabled:opacity-60">
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: .8, ease: "linear" }} className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      SENDING...
                    </span>
                  ) : "SEND MESSAGE"}
                </motion.button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 bg-[#F7F5F2] px-8">
                <div className="w-14 h-14 bg-[#B8860B] rounded-full flex items-center justify-center mx-auto mb-5 text-white text-2xl">✓</div>
                <h3 className="font-playfair text-2xl font-semibold text-[#111] mb-2">Message Sent</h3>
                <p className="text-gray-500 font-inter text-sm mb-6">Thank you, {form.name}. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name:"",email:"",subject:"",message:"" }); }}
                  className="text-sm font-medium text-[#B8860B] underline underline-offset-2">
                  Send another message
                </button>
              </motion.div>
            )}
          </FadeIn>

          {/* Store locations */}
          <FadeIn delay={.2}>
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-4">Visit Us</p>
            <h2 className="font-playfair text-3xl font-semibold text-[#111] mb-8">Our Stores</h2>
            <div className="space-y-6">
              {STORES.map(s => (
                <div key={s.city} className="group border border-gray-100 overflow-hidden hover:border-[#B8860B]/30 transition-colors">
                  <div className="h-40 overflow-hidden">
                    <img src={s.img} alt={s.city} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{s.flag}</span>
                      <h3 className="font-playfair text-lg font-semibold text-[#111]">{s.city}</h3>
                    </div>
                    <div className="space-y-1.5 text-sm font-inter text-gray-500">
                      <p>📍 {s.address}</p>
                      <p>📞 {s.phone}</p>
                      <p>✉️ {s.email}</p>
                      <p>🕐 {s.hours}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#F7F5F2]">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-3">Quick Answers</p>
            <h2 className="font-playfair text-4xl font-semibold text-[#111]">FAQs</h2>
          </FadeIn>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FadeIn key={i} delay={i * .06}>
                <div className="border border-gray-200 bg-white overflow-hidden">
                  <button className="w-full flex items-center justify-between px-6 py-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-sm font-medium text-[#111] font-inter">{faq.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: .2 }} className="text-[#B8860B] text-lg ml-4 flex-shrink-0">+</motion.span>
                  </button>
                  <motion.div initial={false} animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: .25 }} style={{ overflow: "hidden" }}>
                    <p className="px-6 pb-5 text-sm text-gray-500 font-inter leading-relaxed">{faq.a}</p>
                  </motion.div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
