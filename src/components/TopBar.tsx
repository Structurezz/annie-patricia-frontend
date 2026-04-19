"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { removeFromCart } from "../store/cartSlice";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { allProducts, categories as productCategories } from "../components/data/products";

/* ─── icons ─────────────────────────────────────────────── */
const SearchIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="10.5" cy="10.5" r="6.5" strokeWidth={1.4} />
    <path d="M19 19l-3-3" strokeWidth={1.4} strokeLinecap="round" />
  </svg>
);
const BagIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const HeartIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeWidth={1.4} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const TrashIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeWidth={1.4}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const ArrowRight = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeWidth={1.4} d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const UserIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

/* ─── marquee data ───────────────────────────────────────── */
const TICKER = [
  "FREE DELIVERY ON ORDERS OVER ₦50,000",
  "SS 2025 COLLECTION — LIVE NOW",
  "WELCOME10 — 10% OFF YOUR FIRST ORDER",
  "SECURE CHECKOUT · PAYSTACK PROTECTED",
  "NEW ARRIVALS EVERY WEEK",
];

/* ─── nav links ──────────────────────────────────────────── */
const NAV = [
  { label: "Women",      href: "/women" },
  { label: "Men",        href: "/men" },
  { label: "New In",     href: "/new-arrivals", accent: true },
  { label: "Bestsellers",href: "/bestsellers" },
  { label: "Shop All",   href: "/category" },
  { label: "About",      href: "/about" },
];

const TRENDING = ["Ankara Dress", "Aso-oke Set", "Kaftan", "Kente", "Adire Top", "Beaded Bag"];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
const TopBar: React.FC = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useAppDispatch();

  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [cartOpen,    setCartOpen]    = useState(false);
  const [query,       setQuery]       = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  /* redux */
  const cartItems = useAppSelector(s => s.cart.items);
  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0);
  const cartTotal = cartItems.reduce((n, i) => n + i.price * i.quantity, 0);

  /* scroll detection */
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", v => setScrolled(v > 10));

  /* close on route change */
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
  }, [location.pathname]);

  /* focus search input */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [searchOpen]);

  /* keyboard ESC */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setCartOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  /* lock scroll when overlays open */
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen || cartOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen, cartOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/category?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const suggestions = query.trim().length > 1
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.category ?? "").toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  /* ── render ── */
  return (
    <>
      {/* ══════════════════════════════════════
          ANNOUNCEMENT TICKER
      ══════════════════════════════════════ */}
      <div className="bg-[#0A0908] h-8 overflow-hidden flex items-center">
        <div className="marquee-track flex gap-0 select-none">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="whitespace-nowrap text-[10px] font-inter tracking-[0.22em] text-white/70 px-10">
              {t} <span className="text-[#C9A84C] mx-2">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN HEADER
      ══════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.05)]"
            : "bg-white border-b border-[#F0EDE8]"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-3 items-center h-[60px]">

            {/* ── LEFT: hamburger (mobile) / nav (desktop) ── */}
            <div className="flex items-center">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex flex-col gap-[5px] p-1.5"
                aria-label="Menu"
              >
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  className="block w-5 h-[1.5px] bg-[#0A0908] origin-center"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
                  className="block w-3.5 h-[1.5px] bg-[#0A0908]"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  className="block w-5 h-[1.5px] bg-[#0A0908] origin-center"
                />
              </button>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-0">
                {NAV.map(({ label, href, accent }) => (
                  <Link
                    key={href}
                    to={href}
                    className={`relative px-3.5 py-2 text-[12px] font-inter tracking-[0.08em] transition-colors group ${
                      accent
                        ? isActive(href)
                          ? "text-[#C9A84C]"
                          : "text-[#C9A84C] hover:text-[#A6891F]"
                        : isActive(href)
                          ? "text-[#0A0908] font-medium"
                          : "text-[#7A7571] hover:text-[#0A0908]"
                    }`}
                  >
                    {label}
                    <span
                      className={`absolute bottom-0 left-3.5 right-3.5 h-[1.5px] bg-current transition-transform duration-200 origin-left ${
                        isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                ))}
              </nav>
            </div>

            {/* ── CENTER: Logo ── */}
            <Link to="/" className="flex flex-col items-center justify-center group">
              <span className="font-cormorant text-[19px] md:text-[21px] font-light tracking-[0.32em] text-[#0A0908] leading-none transition-all duration-500 group-hover:tracking-[0.42em]">
                ANNIE PATRICIA
              </span>
              <div className="flex items-center gap-1.5 mt-[3px]">
                <span className="block h-px w-4 bg-[#C9A84C]" />
                <span className="text-[7.5px] font-inter tracking-[0.4em] text-[#C9A84C] uppercase leading-none">
                  Lagos
                </span>
                <span className="block h-px w-4 bg-[#C9A84C]" />
              </div>
            </Link>

            {/* ── RIGHT: actions ── */}
            <div className="flex items-center justify-end gap-0.5">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-2.5 text-[#7A7571] hover:text-[#0A0908] transition-colors"
              >
                <SearchIcon className="w-[18px] h-[18px]" />
              </button>

              <Link to="/saved" aria-label="Saved" className="p-2.5 text-[#7A7571] hover:text-[#0A0908] transition-colors hidden md:block">
                <HeartIcon className="w-[18px] h-[18px]" />
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                aria-label="Cart"
                className="relative p-2.5 text-[#7A7571] hover:text-[#0A0908] transition-colors"
              >
                <BagIcon className="w-[18px] h-[18px]" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1 right-1 w-[15px] h-[15px] bg-[#C9A84C] text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Account — desktop only, minimal */}
              <Link to="/account" aria-label="Account" className="p-2.5 text-[#7A7571] hover:text-[#0A0908] transition-colors hidden md:block">
                <UserIcon className="w-[18px] h-[18px]" />
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          SEARCH OVERLAY — full-screen dark
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[80] bg-[#0A0908]/96 backdrop-blur-sm flex flex-col"
          >
            {/* close btn */}
            <div className="flex justify-end px-6 pt-5">
              <button
                onClick={() => { setSearchOpen(false); setQuery(""); }}
                className="p-2 text-white/40 hover:text-white transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* search form */}
            <div className="flex-1 flex flex-col items-center justify-start pt-12 md:pt-20 px-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08, duration: 0.3 }}
                className="w-full max-w-2xl"
              >
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center gap-4 border-b border-white/20 pb-4">
                    <SearchIcon className="w-5 h-5 text-white/30 shrink-0" />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search pieces, fabrics, occasions…"
                      className="flex-1 bg-transparent text-2xl font-cormorant font-light text-white placeholder-white/20 outline-none"
                    />
                    {query && (
                      <button type="button" onClick={() => setQuery("")}
                        className="text-white/30 hover:text-white transition-colors">
                        <XIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>

                {/* live suggestions */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2"
                    >
                      {suggestions.map(p => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          onClick={() => { setSearchOpen(false); setQuery(""); }}
                          className="flex items-center gap-4 py-3.5 border-b border-white/6 group"
                        >
                          <div className="w-9 h-11 shrink-0 overflow-hidden bg-white/5">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-inter text-white/80 group-hover:text-white truncate transition-colors">{p.name}</p>
                            <p className="text-[10px] text-white/30 font-inter mt-0.5">{p.category}</p>
                          </div>
                          <p className="text-sm font-inter text-white/50 shrink-0">₦{p.price.toLocaleString()}</p>
                          <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#C9A84C] transition-colors" />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* trending when empty */}
                {!query && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mt-10"
                  >
                    <p className="text-[10px] tracking-[0.3em] text-white/30 font-inter uppercase mb-4">Trending Now</p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map(t => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="px-4 py-2 text-xs font-inter text-white/50 border border-white/10 hover:border-[#C9A84C] hover:text-white transition-all"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {productCategories.slice(0, 6).map(cat => (
                        <Link
                          key={cat}
                          to={`/category?category=${cat}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between px-4 py-3 border border-white/8 hover:border-white/25 group transition-colors"
                        >
                          <span className="text-[11px] font-inter text-white/40 group-hover:text-white/80 transition-colors">{cat}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#C9A84C] transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          CART SIDEBAR
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-[#0A0908] z-[70]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-[80] flex flex-col"
            >
              {/* header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0EDE8]">
                <div>
                  <h2 className="font-cormorant text-xl font-light tracking-wider text-[#0A0908]">Your Bag</h2>
                  <p className="text-[10px] font-inter text-[#7A7571] tracking-wider mt-0.5">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={() => setCartOpen(false)}
                  className="p-2 text-[#7A7571] hover:text-[#0A0908] transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* free delivery bar */}
              {cartCount > 0 && (
                <div className="px-6 py-3 bg-[#FAFAF8] border-b border-[#F0EDE8]">
                  {cartTotal >= 50000 ? (
                    <p className="text-[11px] font-inter text-green-600">You qualify for free delivery</p>
                  ) : (
                    <>
                      <p className="text-[11px] font-inter text-[#7A7571] mb-1.5">
                        ₦{(50000 - cartTotal).toLocaleString()} away from free delivery
                      </p>
                      <div className="h-[2px] bg-[#F0EDE8] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[#C9A84C] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (cartTotal / 50000) * 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* items */}
              <div className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-8">
                    <div className="w-14 h-14 border border-[#E0DBD4] rounded-full flex items-center justify-center mb-5">
                      <BagIcon className="w-6 h-6 text-[#C9C4BC]" />
                    </div>
                    <p className="font-cormorant text-xl text-[#0A0908] mb-1">Your bag is empty</p>
                    <p className="text-xs font-inter text-[#7A7571] mb-6">Discover something beautiful</p>
                    <button
                      onClick={() => { setCartOpen(false); navigate("/category"); }}
                      className="text-xs font-inter text-[#0A0908] border border-[#0A0908] px-6 py-2.5 hover:bg-[#0A0908] hover:text-white transition-colors tracking-widest"
                    >
                      SHOP NOW
                    </button>
                  </div>
                ) : (
                  <ul className="divide-y divide-[#F0EDE8] px-6">
                    <AnimatePresence initial={false}>
                      {cartItems.map(item => (
                        <motion.li
                          key={item.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22 }}
                          className="flex gap-4 py-5"
                        >
                          <Link to={`/product/${item.id}`} onClick={() => setCartOpen(false)}
                            className="shrink-0 w-16 h-20 bg-[#F0EDE8] overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#7A7571] font-inter">{item.designer}</p>
                            <Link to={`/product/${item.id}`} onClick={() => setCartOpen(false)}>
                              <p className="text-sm font-inter text-[#0A0908] line-clamp-2 leading-snug mt-0.5 hover:text-[#C9A84C] transition-colors">{item.name}</p>
                            </Link>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-sm font-semibold font-inter text-[#0A0908]">₦{(item.price * item.quantity).toLocaleString()}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-[#7A7571] font-inter">Qty {item.quantity}</span>
                                <button
                                  onClick={() => dispatch(removeFromCart(item.id))}
                                  className="text-[#C9C4BC] hover:text-red-400 transition-colors"
                                  aria-label="Remove"
                                >
                                  <TrashIcon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {/* footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-[#F0EDE8] px-6 py-5 space-y-3 bg-[#FAFAF8]">
                  <div className="flex justify-between">
                    <span className="text-xs font-inter text-[#7A7571] tracking-wider">SUBTOTAL</span>
                    <span className="text-base font-semibold font-inter text-[#0A0908]">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] font-inter text-[#7A7571]">Shipping calculated at checkout</p>
                  <Link to="/cart" onClick={() => setCartOpen(false)}
                    className="block w-full text-center py-3.5 bg-[#0A0908] text-white text-[11px] font-inter font-medium tracking-[0.18em] hover:bg-[#C9A84C] transition-colors">
                    VIEW BAG & CHECKOUT
                  </Link>
                  <Link to="/checkout" onClick={() => setCartOpen(false)}
                    className="block w-full text-center py-3 border border-[#E0DBD4] text-[#0A0908] text-[11px] font-inter tracking-[0.18em] hover:border-[#0A0908] transition-colors">
                    QUICK CHECKOUT
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          MOBILE FULL-SCREEN MENU
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[75] bg-[#0A0908] flex flex-col"
          >
            {/* top bar */}
            <div className="flex items-center justify-between px-5 py-4">
              <Link to="/" onClick={() => setMobileOpen(false)}
                className="font-cormorant text-lg tracking-[0.3em] text-white font-light">
                ANNIE PATRICIA
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white/50 hover:text-white transition-colors">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* divider */}
            <div className="h-px bg-white/8 mx-5" />

            {/* nav links */}
            <nav className="flex-1 flex flex-col justify-center px-6 gap-1">
              {NAV.map(({ label, href, accent }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3.5 font-cormorant text-4xl font-light leading-none transition-colors ${
                      accent ? "text-[#C9A84C]" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* bottom strip */}
            <div className="px-6 pb-10 pt-6 border-t border-white/8">
              <div className="flex gap-5 mb-5">
                <Link to="/saved"    onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-xs font-inter text-white/40 hover:text-white/80 transition-colors">
                  <HeartIcon className="w-4 h-4" /> Saved
                </Link>
                <Link to="/orders"   onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-xs font-inter text-white/40 hover:text-white/80 transition-colors">
                  Orders
                </Link>
                <Link to="/account"  onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-xs font-inter text-white/40 hover:text-white/80 transition-colors">
                  <UserIcon className="w-4 h-4" /> Account
                </Link>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="block h-px w-4 bg-[#C9A84C]" />
                <span className="text-[9px] font-inter tracking-[0.4em] text-[#C9A84C] uppercase">Lagos Luxury</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
