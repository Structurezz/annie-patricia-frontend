"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { removeFromCart } from "../store/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { allProducts, categories as productCategories } from "../components/data/products";
import { useAppSelector as useAuth } from "../store/hooks";
import { logoutUser } from "../store/authSlice";

/* ─────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────── */
const SearchIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="10.5" cy="10.5" r="6.5" /><path d="M19 19l-3-3" strokeLinecap="round" />
  </svg>
);
const BagIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const TrashIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const UserIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const HeartIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const ChevronDown = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const ArrowRight = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  "✦  FREE DELIVERY ON ALL ORDERS OVER ₦50,000",
  "✦  SS 2025 COLLECTION — LIVE NOW",
  "✦  USE CODE WELCOME10 FOR 10% OFF",
  "✦  SECURE CHECKOUT VIA PAYSTACK",
  "✦  NEW DROPS EVERY WEEK",
];

const NAV_ITEMS = [
  {
    label: "Women",
    href: "/women",
    mega: {
      cols: [
        { heading: "Clothing", links: [
          { label: "All Women's", href: "/women/shop" },
          { label: "Dresses",    href: "/category?category=Dresses" },
          { label: "Jumpsuits",  href: "/category?category=Jumpsuits" },
          { label: "Skirts",     href: "/category?category=Skirts" },
          { label: "Tops",       href: "/category?category=Tops" },
          { label: "Trousers",   href: "/category?category=Trousers" },
          { label: "Bubus",      href: "/category?category=Bubus" },
        ]},
        { heading: "Sets & Coords", links: [
          { label: "Kimono Sets",    href: "/category?category=Kimono and pant sets" },
          { label: "Aso Ebi",        href: "/category?category=Aso Ebi" },
          { label: "Aso-oke",        href: "/category?category=Asoeke" },
        ]},
        { heading: "Accessories", links: [
          { label: "All Bags",       href: "/category?category=Bags" },
          { label: "Accessories",    href: "/category?category=Accessories" },
          { label: "Saved",          href: "/saved" },
        ]},
      ],
      featured: {
        img: "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=500&q=80",
        title: "New Women's Arrivals",
        sub: "SS 2025 Collection",
        href: "/women/shop",
      },
    },
  },
  {
    label: "Men",
    href: "/men",
    mega: {
      cols: [
        { heading: "Clothing", links: [
          { label: "All Men's",   href: "/men/shop" },
          { label: "Agbada",      href: "/category?category=Agbada" },
          { label: "Kaftan",      href: "/category?category=Kaftan" },
          { label: "Shirts",      href: "/category?category=Tops" },
          { label: "Trousers",    href: "/category?category=Trousers" },
        ]},
        { heading: "Accessories", links: [
          { label: "Bags",        href: "/category?category=Bags" },
          { label: "Accessories", href: "/category?category=Accessories" },
        ]},
      ],
      featured: {
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80",
        title: "Men's Edit",
        sub: "Traditional meets modern",
        href: "/men/shop",
      },
    },
  },
  { label: "New In",      href: "/new-arrivals", accent: true },
  { label: "Bestsellers", href: "/bestsellers" },
  { label: "Shop All",    href: "/category" },
  { label: "About",       href: "/about" },
];

const TRENDING_SEARCHES = ["Ankara Dress", "Aso-oke Set", "Kaftan", "Kente", "Adire Top", "Agbada", "Beaded Bag"];

/* ─────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────── */
const TopBar: React.FC = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useAppDispatch();

  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [query,      setQuery]      = useState("");

  const menuTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef  = useRef<HTMLInputElement>(null);

  const cartItems = useAppSelector(s => s.cart.items);
  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0);
  const cartTotal = cartItems.reduce((n, i) => n + i.price * i.quantity, 0);
  const authUser  = useAuth(s => s.auth.user);

  /* scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close overlays on route change */
  useEffect(() => {
    setMobileOpen(false); setSearchOpen(false); setCartOpen(false); setActiveMenu(null);
  }, [location.pathname]);

  /* focus search */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [searchOpen]);

  /* ESC key */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setCartOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  /* body lock */
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen || cartOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen, cartOpen]);

  const openMenu  = (i: number) => { if (menuTimer.current) clearTimeout(menuTimer.current); setActiveMenu(i); };
  const delayClose = () => { menuTimer.current = setTimeout(() => setActiveMenu(null), 180); };
  const keepMenu  = () => { if (menuTimer.current) clearTimeout(menuTimer.current); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/category?search=${encodeURIComponent(query.trim())}`); setSearchOpen(false); setQuery(""); }
  };

  const suggestions = query.trim().length > 1
    ? allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || (p.category ?? "").toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  /* ── RENDER ── */
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          ANNOUNCEMENT MARQUEE — white text on deep black
      ══════════════════════════════════════════════════════ */}
      <div className="bg-[#0A0908] h-8 overflow-hidden flex items-center select-none">
        <div className="marquee-track flex">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className="whitespace-nowrap px-10 text-[10px] tracking-[0.25em] font-inter text-white/60">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MAIN HEADER
      ══════════════════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_#e5e2dc,0_4px_30px_rgba(0,0,0,0.07)]" : "border-b border-[#EDEAE4]"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-5 lg:px-12">
          <div className="flex items-center h-[58px] gap-6">

            {/* ─ Mobile: hamburger ─ */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden shrink-0 flex flex-col gap-[5px] py-2 pr-2"
              aria-label="Menu"
            >
              <span className="block w-[22px] h-[1.5px] bg-[#0A0908]" />
              <span className="block w-[14px] h-[1.5px] bg-[#0A0908]" />
              <span className="block w-[22px] h-[1.5px] bg-[#0A0908]" />
            </button>

            {/* ─ Desktop nav ─ */}
            <nav className="hidden md:flex items-center gap-0 mr-auto">
              {NAV_ITEMS.map((item, idx) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.mega ? openMenu(idx) : undefined}
                  onMouseLeave={() => item.mega ? delayClose() : undefined}
                >
                  <Link
                    to={item.href}
                    className={`group relative flex items-center gap-1 px-3.5 py-2 text-[12.5px] font-inter tracking-[0.04em] transition-colors ${
                      (item as any).accent
                        ? "text-[#C9A84C] hover:text-[#A6891F] font-medium"
                        : isActive(item.href)
                          ? "text-[#0A0908] font-medium"
                          : "text-[#6B6560] hover:text-[#0A0908]"
                    }`}
                  >
                    {item.label}
                    {item.mega && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${activeMenu === idx ? "rotate-180 text-[#0A0908]" : ""}`}
                      />
                    )}
                    {/* underline indicator */}
                    <span
                      className={`absolute bottom-0 left-3.5 right-3.5 h-[1.5px] bg-[#0A0908] transition-transform duration-200 origin-left ${
                        isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>

                  {/* ─ Mega menu dropdown ─ */}
                  {item.mega && (
                    <AnimatePresence>
                      {activeMenu === idx && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          onMouseEnter={keepMenu}
                          onMouseLeave={delayClose}
                          className="fixed left-0 right-0 top-[calc(var(--header-h,88px))] z-50 bg-white border-t border-[#EDEAE4] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
                          style={{ "--header-h": "88px" } as React.CSSProperties}
                        >
                          <div className="max-w-screen-2xl mx-auto px-12 py-10">
                            <div className="flex gap-16">
                              {/* columns */}
                              <div className="flex gap-12 flex-1">
                                {item.mega.cols.map(col => (
                                  <div key={col.heading} className="min-w-[140px]">
                                    <p className="text-[10px] tracking-[0.3em] text-[#C9A84C] font-inter font-semibold uppercase mb-4">
                                      {col.heading}
                                    </p>
                                    <ul className="space-y-2.5">
                                      {col.links.map(link => (
                                        <li key={link.href}>
                                          <Link
                                            to={link.href}
                                            className="group/link text-[13px] font-inter text-[#6B6560] hover:text-[#0A0908] transition-colors flex items-center gap-1.5"
                                          >
                                            <span className="block w-0 group-hover/link:w-3 h-[1px] bg-[#C9A84C] transition-all duration-200" />
                                            {link.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              {/* featured card */}
                              <Link to={item.mega.featured.href} className="group/feat shrink-0 w-56 block">
                                <div className="relative overflow-hidden aspect-[4/5] bg-[#F0EDE8] mb-3">
                                  <img
                                    src={item.mega.featured.img}
                                    alt={item.mega.featured.title}
                                    className="w-full h-full object-cover group-hover/feat:scale-105 transition-transform duration-600"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/60 to-transparent" />
                                  <div className="absolute bottom-4 left-4 right-4">
                                    <p className="font-cormorant text-lg text-white font-light leading-tight">
                                      {item.mega.featured.title}
                                    </p>
                                    <p className="text-[10px] font-inter text-white/60 mt-1 tracking-wider flex items-center gap-1 group-hover/feat:text-[#C9A84C] transition-colors">
                                      Shop now <ArrowRight className="w-3 h-3 inline" />
                                    </p>
                                  </div>
                                </div>
                                <p className="text-xs font-inter text-[#7A7571]">{item.mega.featured.sub}</p>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* ─ Logo ─ */}
            <Link
              to="/"
              className="absolute left-1/2 md:static md:translate-x-0 -translate-x-1/2 flex flex-col items-center group"
            >
              <span className="font-cormorant text-[20px] font-light tracking-[0.35em] text-[#0A0908] leading-none transition-all duration-500 group-hover:tracking-[0.45em]">
                ANNIE PATRICIA
              </span>
              <span className="text-[7.5px] font-inter tracking-[0.5em] text-[#C9A84C] uppercase mt-[3px] leading-none">
                Lagos
              </span>
            </Link>

            {/* ─ Actions ─ */}
            <div className="flex items-center gap-0.5 ml-auto">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-[#6B6560] hover:text-[#0A0908] transition-colors"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* Wishlist — desktop */}
              <Link to="/saved" className="hidden md:block p-2.5 text-[#6B6560] hover:text-[#0A0908] transition-colors" aria-label="Saved">
                <HeartIcon className="w-5 h-5" />
              </Link>

              {/* Account — desktop */}
              {authUser ? (
                <div className="hidden md:flex items-center gap-1 px-3 py-1.5 group">
                  <UserIcon className="w-4.5 h-4.5 text-[#6B6560]" />
                  <span className="text-[11px] font-inter text-[#6B6560] max-w-[80px] truncate">{authUser.name?.split(" ")[0]}</span>
                  <button
                    onClick={() => dispatch(logoutUser())}
                    className="text-[10px] font-inter text-[#C9A84C] hover:text-[#A6891F] ml-1 transition-colors"
                  >
                    Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex items-center gap-1.5 p-2.5 text-[#6B6560] hover:text-[#0A0908] transition-colors">
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative ml-1 flex items-center gap-2 pl-3.5 pr-4 py-2 bg-[#0A0908] text-white text-[11px] font-inter font-medium tracking-[0.1em] hover:bg-[#1C1C1A] transition-colors"
                aria-label="Cart"
              >
                <BagIcon className="w-4 h-4" />
                <span className="hidden md:inline">
                  {cartCount > 0 ? `BAG (${cartCount})` : "BAG"}
                </span>
                {/* mobile badge */}
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="md:hidden absolute -top-1.5 -right-1.5 w-[15px] h-[15px] bg-[#C9A84C] text-white text-[8px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          SEARCH OVERLAY
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-[#0A0908]/95 backdrop-blur-sm"
          >
            {/* backdrop close */}
            <div className="absolute inset-0" onClick={() => { setSearchOpen(false); setQuery(""); }} />

            <div className="relative z-10 max-w-2xl mx-auto px-6 pt-24 md:pt-28">
              {/* close */}
              <button
                onClick={() => { setSearchOpen(false); setQuery(""); }}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>

              {/* form */}
              <form onSubmit={handleSearch}>
                <div className="flex items-end gap-4 border-b-2 border-white/20 pb-4 mb-2">
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search pieces, fabrics, styles…"
                    className="flex-1 bg-transparent font-cormorant text-3xl md:text-4xl font-light text-white placeholder-white/20 outline-none"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery("")} className="text-white/30 hover:text-white pb-1 transition-colors">
                      <XIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </form>

              {/* live suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {suggestions.map(p => (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        onClick={() => { setSearchOpen(false); setQuery(""); }}
                        className="flex items-center gap-4 py-3.5 border-b border-white/6 group"
                      >
                        <div className="w-9 h-11 bg-white/5 overflow-hidden shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-inter text-white/70 group-hover:text-white truncate transition-colors">{p.name}</p>
                          <p className="text-[10px] text-white/30 font-inter mt-0.5">{p.category}</p>
                        </div>
                        <p className="text-sm font-inter text-white/40 shrink-0">₦{p.price.toLocaleString()}</p>
                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#C9A84C] transition-colors" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* no query state */}
              {!query && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-8">
                  <p className="text-[10px] tracking-[0.35em] text-white/30 font-inter uppercase mb-4">Trending</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {TRENDING_SEARCHES.map(t => (
                      <button
                        key={t}
                        onClick={() => setQuery(t)}
                        className="px-4 py-2 text-xs font-inter text-white/50 border border-white/10 hover:border-[#C9A84C] hover:text-white transition-all"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] tracking-[0.35em] text-white/30 font-inter uppercase mb-3">Categories</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {productCategories.slice(0, 6).map(cat => (
                      <Link
                        key={cat}
                        to={`/category?category=${cat}`}
                        onClick={() => setSearchOpen(false)}
                        className="px-4 py-3 border border-white/8 hover:border-white/25 group transition-colors flex items-center justify-between"
                      >
                        <span className="text-[11px] font-inter text-white/40 group-hover:text-white/80 transition-colors">{cat}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#C9A84C] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          CART SIDEBAR
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-[#0A0908] z-[70]"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-[80] flex flex-col"
            >
              {/* header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDEAE4]">
                <div>
                  <h2 className="font-cormorant text-xl font-light text-[#0A0908] tracking-wider">Your Bag</h2>
                  <p className="text-[10px] font-inter text-[#7A7571] tracking-wider mt-0.5">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 text-[#7A7571] hover:text-[#0A0908] transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* delivery progress */}
              {cartCount > 0 && (
                <div className="px-6 py-3.5 bg-[#FAFAF8] border-b border-[#EDEAE4]">
                  {cartTotal >= 50000 ? (
                    <p className="text-xs font-inter text-green-600">You qualify for free delivery!</p>
                  ) : (
                    <>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[10px] font-inter text-[#7A7571]">Free delivery at ₦50,000</span>
                        <span className="text-[10px] font-inter text-[#0A0908] font-medium">₦{cartTotal.toLocaleString()} / ₦50,000</span>
                      </div>
                      <div className="h-[2px] bg-[#EDEAE4] rounded-full overflow-hidden">
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
                    <div className="w-16 h-16 bg-[#F5F0E8] rounded-full flex items-center justify-center mb-5">
                      <BagIcon className="w-7 h-7 text-[#C9C4BC]" />
                    </div>
                    <p className="font-cormorant text-2xl text-[#0A0908] mb-1">Your bag is empty</p>
                    <p className="text-xs font-inter text-[#7A7571] mb-8">Discover something beautiful</p>
                    <button
                      onClick={() => { setCartOpen(false); navigate("/category"); }}
                      className="text-[11px] font-inter tracking-[0.2em] text-white bg-[#0A0908] px-8 py-3 hover:bg-[#C9A84C] transition-colors"
                    >
                      SHOP NOW
                    </button>
                  </div>
                ) : (
                  <ul className="divide-y divide-[#F5F2EE] px-6">
                    <AnimatePresence initial={false}>
                      {cartItems.map(item => (
                        <motion.li
                          key={item.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-4 py-5"
                        >
                          <Link to={`/product/${item.id}`} onClick={() => setCartOpen(false)}
                            className="shrink-0 w-[68px] h-[88px] bg-[#F0EDE8] overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#7A7571] font-inter mb-0.5">{item.designer}</p>
                            <Link to={`/product/${item.id}`} onClick={() => setCartOpen(false)}>
                              <p className="text-sm font-inter text-[#0A0908] line-clamp-2 leading-snug hover:text-[#C9A84C] transition-colors">{item.name}</p>
                            </Link>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-sm font-semibold font-inter text-[#0A0908]">₦{(item.price * item.quantity).toLocaleString()}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-[#7A7571] font-inter">Qty {item.quantity}</span>
                                <button
                                  onClick={() => dispatch(removeFromCart(item.id))}
                                  className="text-[#C9C4BC] hover:text-red-400 transition-colors p-0.5"
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

              {/* checkout footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-[#EDEAE4] px-6 py-5 space-y-3 bg-[#FAFAF8]">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] tracking-[0.15em] font-inter text-[#7A7571] uppercase">Subtotal</span>
                    <span className="text-base font-semibold font-inter text-[#0A0908]">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] font-inter text-[#7A7571]">Shipping calculated at checkout</p>
                  <Link
                    to="/cart"
                    onClick={() => setCartOpen(false)}
                    className="block w-full text-center py-3.5 bg-[#0A0908] text-white text-[11px] font-inter font-medium tracking-[0.2em] hover:bg-[#C9A84C] transition-colors"
                  >
                    VIEW BAG & CHECKOUT
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="block w-full text-center py-3 border border-[#EDEAE4] text-[#0A0908] text-[11px] font-inter tracking-[0.2em] hover:border-[#0A0908] transition-colors"
                  >
                    QUICK CHECKOUT →
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          MOBILE MENU — full-screen slide-down
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[75] bg-white flex flex-col"
          >
            {/* close bar */}
            <div className="flex items-center justify-between px-5 h-[58px] border-b border-[#EDEAE4]">
              <Link to="/" onClick={() => setMobileOpen(false)}
                className="font-cormorant text-lg tracking-[0.3em] text-[#0A0908] font-light">
                ANNIE PATRICIA
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-[#7A7571] hover:text-[#0A0908] transition-colors">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* links */}
            <nav className="flex-1 overflow-y-auto px-6 py-4">
              {NAV_ITEMS.map(({ label, href, accent }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                >
                  <Link
                    to={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-4 border-b border-[#F0EDE8] font-inter text-[15px] font-medium transition-colors ${
                      accent ? "text-[#C9A84C]" : "text-[#0A0908] hover:text-[#C9A84C]"
                    }`}
                  >
                    {label}
                    <ArrowRight className="w-4 h-4 text-[#C9C4BC]" />
                  </Link>
                </motion.div>
              ))}

              {/* account row */}
              <div className="pt-6 flex gap-6">
                <Link to={authUser ? "/account" : "/login"} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-inter text-[#7A7571] hover:text-[#0A0908] transition-colors">
                  <UserIcon className="w-4 h-4" /> {authUser ? `Hi, ${authUser.name?.split(" ")[0]}` : "Sign In"}
                </Link>
                <Link to="/saved" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-inter text-[#7A7571] hover:text-[#0A0908] transition-colors">
                  <HeartIcon className="w-4 h-4" /> Saved
                </Link>
              </div>
            </nav>

            {/* bottom CTA */}
            <div className="px-6 pb-8 pt-4 border-t border-[#EDEAE4] space-y-2">
              <Link
                to="/category"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3.5 bg-[#0A0908] text-white text-[11px] font-inter font-medium tracking-[0.2em] hover:bg-[#C9A84C] transition-colors"
              >
                SHOP ALL
              </Link>
              <Link
                to="/new-arrivals"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 border border-[#EDEAE4] text-[#0A0908] text-[11px] font-inter tracking-[0.2em] hover:border-[#0A0908] transition-colors"
              >
                NEW IN
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
