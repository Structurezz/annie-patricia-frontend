"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { clearCart } from "../store/cartSlice";  
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../hooks/useProducts";
import { useAppSelector as useAuth } from "../store/hooks";
import { logoutUser } from "../store/authSlice";
import { createPortal } from "react-dom";

/* ─────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────── */
const SearchIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const BagIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 00-7.5 0v4.5m11.356-1.993l1.263 12.08a1.125 1.125 0 01-1.12 1.313H4.5a1.125 1.125 0 01-1.12-1.313L4.635 8.507A1.125 1.125 0 015.76 7.5h12.48c.576 0 1.064.435 1.12 1.007z" />
  </svg>
);

const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TrashIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const UserIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const HeartIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const ChevronDown = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ArrowRight = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  "✦ FREE DELIVERY ON ALL ORDERS OVER ₦50,000",
  "✦ SPRING/SUMMER 2026 COLLECTION — LIVE NOW",
  "✦ USE CODE WELCOME10 FOR 10% OFF",
  "✦ SECURE CHECKOUT VIA PAYSTACK",
  "✦ NEW DROPS EVERY WEEK",
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
        img: "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=600&q=80",
        title: "New Arrivals",
        sub: "Spring/Summer 2026",
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
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
        title: "Men's Edit",
        sub: "Tradition reimagined",
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
   FULL REDESIGNED TOPBAR
───────────────────────────────────────────────────────────────────── */
const TopBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const menuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const cartItems = useAppSelector(s => s.cart.items);
  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0);
  const cartTotal = cartItems.reduce((n, i) => n + i.price * i.quantity, 0);
  const authUser = useAuth(s => s.auth.user);
  const { products: allProducts } = useProducts();

  useEffect(() => {
    if (mobileOpen) {
      setSearchOpen(false);
      setCartOpen(false);
    }
  }, [mobileOpen]);

  const MobileLink = ({
    label,
    href,
    onClick,
  }: {
    label: string;
    href: string;
    onClick: () => void;
  }) => (
    <Link
      to={href}
      onClick={onClick}
      className="flex items-center justify-between py-4 border-b border-neutral-100 text-lg"
    >
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 text-neutral-400" />
    </Link>
  );
  
  const MobileSection = ({
    title,
    icon,
    links,
    onNavigate,
  }: {
    title: string;
    icon: string;
    links: { label: string; href: string }[];
    onNavigate: () => void;
  }) => {
    const [open, setOpen] = useState(false);
  
    return (
      <div className="border-b border-neutral-100 pb-2">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full py-4 text-lg"
        >
          <span className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            {title}
          </span>
  
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
  
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-10 space-y-3 pb-3"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={onNavigate}
                  className="block text-sm text-neutral-600 hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  /* Scroll Effect */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Close overlays on route change */
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  /* Focus search input */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  /* ESC Key */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setCartOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen || cartOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen, cartOpen]);

  const openMenu = (i: number) => {
    if (menuTimer.current) clearTimeout(menuTimer.current);
    setActiveMenu(i);
  };

  const delayClose = () => {
    menuTimer.current = setTimeout(() => setActiveMenu(null), 250);
  };

  const keepMenu = () => {
    if (menuTimer.current) clearTimeout(menuTimer.current);
  };

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

  return (
    <>
      {/* Announcement Ticker */}
      <div className="bg-black h-9 flex items-center overflow-hidden text-white">
        <div className="marquee-track flex whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="px-12 text-xs tracking-[0.125em] font-light text-white/70">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Redesigned Header with Improved Spacing */}
      <header
        className={`sticky top-0 z-50 bg-white border-b border-black/5 transition-all duration-300 ${
          scrolled ? "shadow-xl shadow-black/5" : ""
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-20 md:h-24">

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-3 -ml-2"
              aria-label="Open menu"
            >
              <div className="space-y-1.5">
                <div className="w-6 h-px bg-black" />
                <div className="w-5 h-px bg-black" />
                <div className="w-6 h-px bg-black" />
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-10 lg:gap-x-12 text-sm tracking-widest font-light">
              {NAV_ITEMS.map((item, idx) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.mega && openMenu(idx)}
                  onMouseLeave={() => item.mega && delayClose()}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 py-2 transition-colors duration-200 ${
                      item.accent
                        ? "text-amber-600 hover:text-amber-700"
                        : isActive(item.href)
                          ? "text-black font-medium"
                          : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    {item.label}
                    {item.mega && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeMenu === idx ? "rotate-180" : ""}`} />
                    )}
                  </Link>

                  {/* Mega Menu */}
                  {item.mega && (
                    <AnimatePresence>
                      {activeMenu === idx && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          onMouseEnter={keepMenu}
                          onMouseLeave={delayClose}
                          className="fixed left-0 right-0 top-[95px] bg-white border-t border-black/5 shadow-2xl z-50"
                        >
                          <div className="max-w-screen-2xl mx-auto px-12 xl:px-16 py-16">
                            <div className="flex gap-20">
                              <div className="flex gap-16 flex-1">
                                {item.mega.cols.map((col) => (
                                  <div key={col.heading} className="min-w-[170px]">
                                    <p className="text-amber-600 text-xs tracking-[0.125em] font-medium uppercase mb-7">
                                      {col.heading}
                                    </p>
                                    <ul className="space-y-4 text-[15px]">
                                      {col.links.map((link) => (
                                        <li key={link.href}>
                                          <Link
                                            to={link.href}
                                            className="text-neutral-600 hover:text-black transition-colors"
                                          >
                                            {link.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              {/* Featured */}
                              <Link to={item.mega.featured.href} className="group w-80 block">
                                <div className="relative overflow-hidden aspect-[4/5] rounded-3xl">
                                  <img
                                    src={item.mega.featured.img}
                                    alt={item.mega.featured.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                  <div className="absolute bottom-8 left-8 right-8">
                                    <p className="text-white text-3xl font-light tracking-tight">
                                      {item.mega.featured.title}
                                    </p>
                                    <p className="text-white/70 mt-2 flex items-center gap-2 text-sm">
                                      {item.mega.featured.sub} <ArrowRight className="w-4 h-4" />
                                    </p>
                                  </div>
                                </div>
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

            {/* Logo */}
            <Link to="/" className="flex flex-col items-center">
              <span className="font-serif text-[28px] md:text-[32px] tracking-[-0.6px] font-light text-black">
                ANNIE PATRICIA
              </span>
              <span className="text-[10px] tracking-[4.5px] text-amber-600 -mt-1">LAGOS</span>
            </Link>

            {/* Right Side Actions - Improved Spacing */}
        {/* Right Side Actions */}
<div className="flex items-center gap-x-1 md:gap-x-2">
  <button
    onClick={() => setSearchOpen(true)}
    className="p-3.5 text-neutral-600 hover:text-black rounded-full hover:bg-neutral-100 transition-all"
    aria-label="Search"
  >
    <SearchIcon className="w-5 h-5" />
  </button>

  <Link
    to="/saved"
    className="hidden md:block p-3.5 text-neutral-600 hover:text-black rounded-full hover:bg-neutral-100 transition-all"
    aria-label="Wishlist"
  >
    <HeartIcon className="w-5 h-5" />
  </Link>

  {authUser ? (
    <Link
      to="/account"
      className="hidden md:flex items-center gap-2.5 px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-all"
    >
      <UserIcon className="w-5 h-5 text-neutral-600" />
      <span className="text-sm text-neutral-700 truncate max-w-28">
        {authUser.name?.split(" ")[0]}
      </span>
    </Link>
  ) : (
    <Link
      to="/login"
      className="hidden md:block p-3.5 text-neutral-600 hover:text-black rounded-full hover:bg-neutral-100 transition-all"
    >
      <UserIcon className="w-5 h-5" />
    </Link>
  )}

  {/* FIXED Cart Button - Now opens sidebar instead of going directly to checkout */}
  <button
  onClick={() => navigate("/checkout")}
  className="flex items-center gap-3 bg-black hover:bg-neutral-900 text-white text-sm font-light tracking-wider px-7 py-3 rounded-full transition-all active:scale-[0.97]"
  aria-label="Cart"
>
  <BagIcon className="w-5 h-5" />
  <span className="hidden md:inline">
    BAG {cartCount > 0 && `(${cartCount})`}
  </span>

  {cartCount > 0 && (
    <span className="md:hidden bg-amber-500 text-black text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full">
      {cartCount}
    </span>
  )}
</button>
</div>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-2xl"
          >
            <div className="absolute inset-0" onClick={() => { setSearchOpen(false); setQuery(""); }} />

            <div className="relative max-w-2xl mx-auto px-6 pt-28 md:pt-36">
              <button
                onClick={() => { setSearchOpen(false); setQuery(""); }}
                className="absolute top-10 right-6 text-white/60 hover:text-white transition-colors"
              >
                <XIcon className="w-7 h-7" />
              </button>

              <form onSubmit={handleSearch}>
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search dresses, kaftans, aso-oke..."
                  className="w-full bg-transparent text-4xl md:text-5xl font-light text-white placeholder:text-white/30 outline-none pb-8 border-b border-white/20"
                />
              </form>

              {query ? (
                <div className="mt-12 space-y-8">
                  {suggestions.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      onClick={() => { setSearchOpen(false); setQuery(""); }}
                      className="flex gap-6 group"
                    >
                      <div className="w-20 h-24 bg-neutral-800 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-white group-hover:text-amber-400 transition-colors">{p.name}</p>
                        <p className="text-white/50 text-sm mt-1">{p.category}</p>
                      </div>
                      <p className="text-white/70 self-center">₦{p.price.toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-14">
                  <p className="text-xs tracking-[2px] text-white/40 mb-6">TRENDING SEARCHES</p>
                  <div className="flex flex-wrap gap-3">
                    {TRENDING_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-6 py-3 border border-white/10 hover:border-amber-500 text-white/70 hover:text-white rounded-2xl text-sm transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CART SIDEBAR — backdrop */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black z-[75]"
          />
        )}
      </AnimatePresence>

      {/* CART SIDEBAR — panel */}
      <AnimatePresence>
        {cartOpen && (
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[80] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <div>
                <h2 className="text-xl font-light tracking-wide">Your Bag</h2>
                <p className="text-xs text-neutral-400 mt-0.5 tracking-wide">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-5">
                  <BagIcon className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-lg font-light">Your bag is empty</p>
                <p className="text-sm text-neutral-400 mt-1 mb-8">Add some beautiful pieces to get started.</p>
                <button
                  onClick={() => { setCartOpen(false); navigate("/category"); }}
                  className="bg-black text-white px-10 py-3 rounded-full text-xs tracking-widest hover:bg-neutral-900 transition-colors"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4 pb-5 border-b border-neutral-100 last:border-0 last:pb-0"
                      >
                        <Link
                          to={`/product/${item.id}`}
                          onClick={() => setCartOpen(false)}
                          className="shrink-0"
                        >
                          <div className="w-20 h-[104px] bg-neutral-100 rounded-xl overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] tracking-[1.5px] text-amber-600 uppercase font-medium truncate">
                            {item.designer}
                          </p>
                          <Link
                            to={`/product/${item.id}`}
                            onClick={() => setCartOpen(false)}
                          >
                            <p className="text-sm font-medium leading-snug mt-0.5 line-clamp-2 hover:text-amber-600 transition-colors">
                              {item.name}
                            </p>
                          </Link>
                          <p className="text-sm font-semibold mt-2">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>

                          {/* Quantity + Remove */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-neutral-200 rounded-full overflow-hidden">
                              <button
                                onClick={() =>
                                  dispatch(
                                    item.quantity === 1
                                      ? removeFromCart(item.id)
                                      : updateQuantity({ id: item.id, quantity: item.quantity - 1 })
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors text-base"
                              >
                                −
                              </button>
                              <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                                }
                                className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors text-base"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => dispatch(removeFromCart(item.id))}
                              className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-neutral-100 px-6 py-5 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-neutral-500">Subtotal</span>
                    <span className="font-semibold">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-4">Shipping calculated at checkout</p>
                  <Link
                    to="/cart"
                    onClick={() => setCartOpen(false)}
                    className="block w-full py-3.5 bg-black text-white text-center rounded-full tracking-widest text-xs font-medium hover:bg-neutral-900 transition-colors"
                  >
                    VIEW BAG & CHECKOUT
                  </Link>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="block w-full text-center text-xs text-neutral-400 hover:text-black mt-3 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

    {/* MOBILE MENU */}
{/* MOBILE MENU (PORTAL FIX) */}
<AnimatePresence>
  {mobileOpen &&
    typeof window !== "undefined" &&
    createPortal(
      <>
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black z-[9998]"
        />

        {/* PANEL */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[9999] flex flex-col shadow-2xl"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-200">
            <span className="font-serif text-xl tracking-tight">MENU</span>
            <button onClick={() => setMobileOpen(false)}>
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

            {/* WOMEN */}
            <MobileSection
              title="Women"
              icon="👗"
              links={[
                { label: "All Women", href: "/women/shop" },
                { label: "Dresses", href: "/category?category=Dresses" },
                { label: "Tops", href: "/category?category=Tops" },
                { label: "Skirts", href: "/category?category=Skirts" },
                { label: "Bubus", href: "/category?category=Bubus" },
              ]}
              onNavigate={() => setMobileOpen(false)}
            />

            {/* MEN */}
            <MobileSection
              title="Men"
              icon="🧥"
              links={[
                { label: "All Men", href: "/men/shop" },
                { label: "Agbada", href: "/category?category=Agbada" },
                { label: "Kaftan", href: "/category?category=Kaftan" },
                { label: "Shirts", href: "/category?category=Tops" },
              ]}
              onNavigate={() => setMobileOpen(false)}
            />

            {/* QUICK LINKS */}
            <MobileLink label="✨ New Arrivals" href="/new-arrivals" onClick={() => setMobileOpen(false)} />
            <MobileLink label="🔥 Bestsellers" href="/bestsellers" onClick={() => setMobileOpen(false)} />
            <MobileLink label="🛍 Shop All" href="/category" onClick={() => setMobileOpen(false)} />
            <MobileLink label="❤️ Saved Items" href="/saved" onClick={() => setMobileOpen(false)} />
            <MobileLink label="👤 Account" href="/account" onClick={() => setMobileOpen(false)} />

          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-neutral-200 space-y-3">
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/checkout");
              }}
              className="w-full py-4 bg-black text-white rounded-full tracking-widest text-sm"
            >
              VIEW BAG ({cartCount})
            </button>

            {authUser && (
              <button
                onClick={() => {
                  dispatch(logoutUser());
                  setMobileOpen(false);
                }}
                className="w-full py-3 text-sm text-neutral-500"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      </>,
      document.body
    )}
</AnimatePresence>
    </>
  );
};

export default TopBar;