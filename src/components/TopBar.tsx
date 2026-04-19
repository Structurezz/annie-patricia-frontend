"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { removeFromCart } from "../store/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { categories as productCategories } from "../components/data/products";
import { allProducts } from "../components/data/products";

/* ═══════════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════════ */
const Icon = {
  Menu: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeWidth={1.5} d="M4 5h16M4 12h10M4 19h16" />
    </svg>
  ),
  Search: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="11" cy="11" r="7" strokeWidth={1.5} />
      <path d="M20 20l-3.5-3.5" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  ),
  Heart: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Bag: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  User: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  X: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronDown: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  ChevronRight: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Arrow: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  Trash: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Package: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  MapPin: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const ANNOUNCEMENTS = [
  "🚚 FREE DELIVERY ON ALL ORDERS OVER ₦50,000",
  "✨ NEW ARRIVALS — SS 2025 COLLECTION IS LIVE",
  "🎁 USE CODE WELCOME10 FOR 10% OFF YOUR FIRST ORDER",
  "💳 SECURE CHECKOUT · PAYSTACK PROTECTED",
];

const MEGA_MENU = {
  women: {
    label: "Women",
    sections: [
      { heading: "Clothing", links: ["Dresses", "Tops", "Trousers", "Sets", "Knitwear", "Abayas"] },
      { heading: "Accessories", links: ["Bags", "Jewellery", "Head Wraps", "Scarves", "Belts"] },
      { heading: "Occasion", links: ["Bridal", "Formal", "Casual", "Aso-ebi", "Work Wear"] },
    ],
    featured: {
      label: "New This Week",
      img: "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=400&q=80",
      href: "/category?badge=NEW",
    },
  },
  men: {
    label: "Men",
    sections: [
      { heading: "Clothing", links: ["Agbada", "Dashiki", "Kaftan", "Trousers", "Shirts"] },
      { heading: "Accessories", links: ["Caps", "Bags", "Belts", "Cufflinks"] },
      { heading: "Occasion", links: ["Bridal", "Formal", "Casual", "Traditional"] },
    ],
    featured: {
      label: "Men's Edit",
      img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
      href: "/category?gender=MEN",
    },
  },
  collections: {
    label: "Collections",
    sections: [
      { heading: "By Fabric", links: ["Aso-oke", "Ankara", "Adire", "Kente", "Linen", "Lace"] },
      { heading: "By Season", links: ["SS 2025", "AW 2024", "Resort", "Bridal 2025"] },
    ],
    featured: {
      label: "Editorial Edit",
      img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
      href: "/category",
    },
  },
};

const TRENDING_SEARCHES = ["Ankara Dress", "Aso-oke Set", "Kaftan", "Beaded Bag", "Kente", "Adire Top"];

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const TopBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* State */
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);
  const menuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Redux */
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  /* Announcement cycling */
  useEffect(() => {
    const t = setInterval(() => setAnnouncementIdx((i) => (i + 1) % ANNOUNCEMENTS.length), 3500);
    return () => clearInterval(t);
  }, []);

  /* Scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
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

  /* Search focus */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  /* Keyboard close */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setCartOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  /* Mega menu helpers */
  const openMenu = (key: string) => {
    if (menuTimer.current) clearTimeout(menuTimer.current);
    setActiveMenu(key);
  };
  const closeMenu = () => {
    menuTimer.current = setTimeout(() => setActiveMenu(null), 160);
  };
  const keepMenu = () => {
    if (menuTimer.current) clearTimeout(menuTimer.current);
  };

  /* Account dropdown helpers */
  const openAccount = () => {
    if (accountTimer.current) clearTimeout(accountTimer.current);
    setAccountOpen(true);
  };
  const closeAccount = () => {
    accountTimer.current = setTimeout(() => setAccountOpen(false), 160);
  };

  /* Search submit */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  /* Search suggestions from product data */
  const searchSuggestions = searchQuery.trim().length > 1
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  /* ── RENDER ── */
  return (
    <>
      {/* ════════════════════════════════════════
          ANNOUNCEMENT BAR
      ════════════════════════════════════════ */}
      <div className="bg-[#0A0908] text-white overflow-hidden h-9 flex items-center">
        <div className="flex-1 text-center relative h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={announcementIdx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="text-[11px] font-inter tracking-[0.18em] font-medium"
            >
              {ANNOUNCEMENTS[announcementIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 pr-4 shrink-0">
          {ANNOUNCEMENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setAnnouncementIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === announcementIdx ? "w-4 h-1.5 bg-[#C9A84C]" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          MAIN HEADER
      ════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-200 ${
          scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : "border-b border-gray-100"
        }`}
      >
        {/* ── TOP ROW ── */}
        <div className="max-w-screen-2xl mx-auto px-5 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between h-16">

            {/* LEFT: Hamburger (mobile) + nav (desktop) */}
            <div className="flex items-center gap-6">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex flex-col gap-[5px] p-1 group"
                aria-label="Open menu"
              >
                <span className="block w-6 h-[1.5px] bg-[#0A0908] transition-all group-hover:w-5" />
                <span className="block w-4 h-[1.5px] bg-[#0A0908] transition-all group-hover:w-6" />
                <span className="block w-6 h-[1.5px] bg-[#0A0908] transition-all group-hover:w-4" />
              </button>

              {/* Desktop nav links */}
              <nav className="hidden md:flex items-center gap-0.5">
                <Link to="/women" className={`px-3 py-2 text-[13px] font-inter font-medium tracking-wide transition-colors ${isActive("/women") ? "text-[#0A0908]" : "text-[#7A7571] hover:text-[#0A0908]"}`}>Women</Link>
                <Link to="/men"   className={`px-3 py-2 text-[13px] font-inter font-medium tracking-wide transition-colors ${isActive("/men")   ? "text-[#0A0908]" : "text-[#7A7571] hover:text-[#0A0908]"}`}>Men</Link>
                {(["collections"] as const).map((key) => (
                  <div key={key} className="relative" onMouseEnter={() => openMenu(key)} onMouseLeave={closeMenu}>
                    <button className={`px-3 py-2 text-[13px] font-inter font-medium tracking-wide transition-colors flex items-center gap-1 ${activeMenu === key ? "text-[#0A0908]" : "text-[#7A7571] hover:text-[#0A0908]"}`}>
                      {MEGA_MENU[key].label}
                      <Icon.ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMenu === key ? "rotate-180" : ""}`} />
                    </button>
                    {activeMenu === key && <motion.div layoutId="nav-underline" className="absolute bottom-0 inset-x-3 h-[1.5px] bg-[#C9A84C]" />}
                  </div>
                ))}
                <Link to="/new-arrivals" className={`px-3 py-2 text-[13px] font-inter font-medium tracking-wide transition-colors ${isActive("/new-arrivals") ? "text-[#C9A84C]" : "text-[#7A7571] hover:text-[#C9A84C]"}`}>New In</Link>
                <Link to="/bestsellers"  className={`px-3 py-2 text-[13px] font-inter font-medium tracking-wide transition-colors ${isActive("/bestsellers")  ? "text-[#0A0908]" : "text-[#7A7571] hover:text-[#0A0908]"}`}>Bestsellers</Link>
                <Link to="/about"        className={`px-3 py-2 text-[13px] font-inter font-medium tracking-wide transition-colors ${isActive("/about")        ? "text-[#0A0908]" : "text-[#7A7571] hover:text-[#0A0908]"}`}>About</Link>
              </nav>
            </div>

            {/* CENTER: Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-center group">
              <div className="flex flex-col items-center">
                <span className="font-cormorant text-xl md:text-2xl font-light tracking-[0.3em] text-[#0A0908] leading-none group-hover:tracking-[0.38em] transition-all duration-500">
                  ANNIE PATRICIA
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-px w-5 bg-[#C9A84C]" />
                  <span className="text-[8px] font-inter tracking-[0.45em] text-[#C9A84C] uppercase">Lagos</span>
                  <div className="h-px w-5 bg-[#C9A84C]" />
                </div>
              </div>
            </Link>

            {/* RIGHT: Search + account + wishlist + cart */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="group flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-[#0A0908] transition-colors"
                aria-label="Search"
              >
                <Icon.Search className="w-[18px] h-[18px]" />
                <span className="hidden lg:block text-xs font-inter text-gray-400 group-hover:text-[#0A0908] transition-colors">Search</span>
              </button>

              {/* Account */}
              <div
                className="relative hidden md:block"
                onMouseEnter={openAccount}
                onMouseLeave={closeAccount}
              >
                <button className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:text-[#0A0908] transition-colors">
                  <Icon.User className="w-[18px] h-[18px]" />
                  <span className="hidden lg:block text-xs font-inter text-gray-400 hover:text-[#0A0908] transition-colors">Account</span>
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={openAccount}
                      onMouseLeave={closeAccount}
                      className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 shadow-xl z-50"
                    >
                      {/* Account header */}
                      <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-[#FAFAF8]">
                        <p className="text-xs text-gray-400 font-inter tracking-wider mb-2">Welcome back</p>
                        <div className="flex gap-2">
                          <Link to="/login" className="flex-1 text-center text-xs font-medium py-2 bg-[#0A0908] text-white hover:bg-[#C9A84C] transition-colors">
                            Sign In
                          </Link>
                          <Link to="/register" className="flex-1 text-center text-xs font-medium py-2 border border-[#0A0908] text-[#0A0908] hover:bg-[#0A0908] hover:text-white transition-colors">
                            Register
                          </Link>
                        </div>
                      </div>
                      {/* Links */}
                      <div className="py-2">
                        {[
                          { icon: Icon.User, label: "My Profile", href: "/account" },
                          { icon: Icon.Package, label: "My Orders", href: "/orders" },
                          { icon: Icon.Heart, label: "Saved Items", href: "/saved" },
                          { icon: Icon.MapPin, label: "Addresses", href: "/account" },
                        ].map(({ icon: Ic, label, href }) => (
                          <Link
                            key={label}
                            to={href}
                            className="flex items-center gap-3 px-5 py-3 text-sm font-inter text-gray-600 hover:text-[#0A0908] hover:bg-gray-50 transition-colors"
                          >
                            <Ic className="w-4 h-4 text-gray-400" />
                            {label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link to="/saved" className="px-3 py-2 text-gray-500 hover:text-[#0A0908] transition-colors" aria-label="Wishlist">
                <Icon.Heart className="w-[18px] h-[18px]" />
              </Link>

              {/* Cart trigger */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-3 py-2 ml-1 bg-[#0A0908] text-white hover:bg-[#C9A84C] transition-colors duration-200 group"
                aria-label="Cart"
              >
                <Icon.Bag className="w-[18px] h-[18px]" />
                <span className="hidden lg:block text-xs font-medium tracking-wide">
                  {cartCount > 0 ? `Bag (${cartCount})` : "Bag"}
                </span>
                {cartCount > 0 && (
                  <span className="lg:hidden absolute -top-1.5 -right-1.5 bg-[#C9A84C] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── CATEGORY SUB-NAV ── */}
        <div className="hidden md:block border-t border-gray-100">
          <div className="max-w-screen-2xl mx-auto px-5 lg:px-10 xl:px-16">
            <nav className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              <Link
                to="/new-arrivals"
                className="flex-shrink-0 px-4 py-2.5 text-[11px] font-semibold text-[#C9A84C] tracking-[0.15em] hover:text-[#0A0908] transition-colors border-b-2 border-[#C9A84C] hover:border-[#0A0908]"
              >
                NEW IN
              </Link>
              {productCategories.slice(0, 10).map((cat) => (
                <Link
                  key={cat}
                  to={`/category?category=${cat}`}
                  className="flex-shrink-0 px-4 py-2.5 text-[11px] font-medium text-gray-500 tracking-[0.12em] hover:text-[#0A0908] hover:border-b-2 hover:border-[#0A0908] transition-all border-b-2 border-transparent"
                >
                  {cat.toUpperCase()}
                </Link>
              ))}
              <Link
                to="/category?category=SALE"
                className="flex-shrink-0 px-4 py-2.5 text-[11px] font-bold text-red-500 tracking-[0.15em] hover:text-red-600 transition-colors ml-auto"
              >
                SALE
              </Link>
            </nav>
          </div>
        </div>

        {/* ── MEGA MENU ── */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              onMouseEnter={keepMenu}
              onMouseLeave={closeMenu}
              className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.10)] z-40"
            >
              <div className="max-w-screen-2xl mx-auto px-5 lg:px-10 xl:px-16 py-8">
                <div className="flex gap-12">
                  {/* Category sections */}
                  <div className="flex gap-10 flex-1">
                    {MEGA_MENU[activeMenu as keyof typeof MEGA_MENU].sections.map((section) => (
                      <div key={section.heading} className="min-w-[140px]">
                        <p className="text-[10px] font-semibold tracking-[0.25em] text-[#C9A84C] uppercase mb-4 font-inter">
                          {section.heading}
                        </p>
                        <ul className="space-y-2.5">
                          {section.links.map((link) => (
                            <li key={link}>
                              <Link
                                to={`/category?category=${link}`}
                                className="text-[13px] font-inter text-gray-600 hover:text-[#0A0908] hover:translate-x-0.5 transition-all inline-block"
                              >
                                {link}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-px bg-gray-100 self-stretch" />

                  {/* Featured image card */}
                  <div className="w-64 shrink-0">
                    <Link
                      to={MEGA_MENU[activeMenu as keyof typeof MEGA_MENU].featured.href}
                      className="group block"
                    >
                      <div className="relative overflow-hidden aspect-[4/5] bg-[#F5F4F0] mb-3">
                        <img
                          src={MEGA_MENU[activeMenu as keyof typeof MEGA_MENU].featured.img}
                          alt="Featured"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-playfair text-base leading-tight">
                            {MEGA_MENU[activeMenu as keyof typeof MEGA_MENU].featured.label}
                          </p>
                          <p className="text-white/70 text-[11px] font-inter mt-1 tracking-wider group-hover:text-[#D4A017] transition-colors flex items-center gap-1">
                            Shop now <Icon.Arrow className="w-3 h-3 inline" />
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Quick links */}
                  <div className="w-44 shrink-0 space-y-2">
                    <p className="text-[10px] font-semibold tracking-[0.25em] text-[#C9A84C] uppercase mb-4 font-inter">Highlights</p>
                    {["New Arrivals", "Bestsellers", "Sale", "Gift Cards"].map((item) => (
                      <Link
                        key={item}
                        to={`/category?highlight=${encodeURIComponent(item)}`}
                        className="flex items-center justify-between group px-3 py-2.5 border border-gray-100 hover:border-[#0A0908] transition-colors"
                      >
                        <span className="text-[12px] font-inter text-gray-600 group-hover:text-[#0A0908] transition-colors">{item}</span>
                        <Icon.ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0A0908] group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ════════════════════════════════════════
          SEARCH OVERLAY
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-white/98 backdrop-blur-sm"
          >
            {/* Close backdrop */}
            <div className="absolute inset-0" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} />

            <div className="relative z-10 max-w-2xl mx-auto px-6 pt-24 md:pt-28">
              {/* Search input */}
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-4 border-b-2 border-[#0A0908] pb-4 mb-2">
                  <Icon.Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="flex-1 text-xl font-inter text-[#0A0908] placeholder-gray-200 outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="text-gray-300 hover:text-[#0A0908] transition-colors">
                      <Icon.X className="w-5 h-5" />
                    </button>
                  )}
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-gray-400 hover:text-[#0A0908] transition-colors pl-3 border-l border-gray-200">
                    <Icon.X className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Live suggestions */}
              <AnimatePresence>
                {searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white border border-gray-100 shadow-lg mb-6"
                  >
                    {searchSuggestions.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="w-10 h-12 bg-[#F5F4F0] overflow-hidden shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-inter font-medium text-[#0A0908] truncate">{p.name}</p>
                          <p className="text-xs text-gray-400 font-inter">{p.category}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#0A0908] shrink-0">₦{p.price.toLocaleString()}</p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trending + categories */}
              {!searchQuery && (
                <div className="grid md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-gray-400 font-inter uppercase mb-4">Trending Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => { setSearchQuery(term); }}
                          className="px-3.5 py-2 text-xs font-inter text-gray-700 border border-gray-200 hover:border-[#0A0908] hover:text-[#0A0908] transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-gray-400 font-inter uppercase mb-4">Browse Categories</p>
                    <div className="space-y-1">
                      {productCategories.slice(0, 5).map((cat) => (
                        <Link
                          key={cat}
                          to={`/category?category=${cat}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between py-2 text-sm font-inter text-gray-600 hover:text-[#0A0908] transition-colors group"
                        >
                          <span>{cat}</span>
                          <Icon.ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A0908] group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════
          MINI CART SIDEBAR
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black z-[65]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-[70] flex flex-col shadow-2xl"
            >
              {/* Cart header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div>
                  <h2 className="font-playfair text-xl font-semibold text-[#0A0908]">Your Bag</h2>
                  <p className="text-xs text-gray-400 font-inter mt-0.5">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 text-gray-400 hover:text-[#0A0908] hover:bg-gray-50 transition-colors">
                  <Icon.X className="w-5 h-5" />
                </button>
              </div>

              {/* Free shipping bar */}
              {cartTotal < 50000 && cartCount > 0 && (
                <div className="px-6 py-3 bg-amber-50 border-b border-amber-100">
                  <p className="text-xs font-inter text-amber-700 mb-1.5">
                    Add <strong>₦{(50000 - cartTotal).toLocaleString()}</strong> more for free delivery
                  </p>
                  <div className="h-1 bg-amber-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#C9A84C] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (cartTotal / 50000) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
              {cartTotal >= 50000 && cartCount > 0 && (
                <div className="px-6 py-2.5 bg-green-50 border-b border-green-100">
                  <p className="text-xs font-inter text-green-700 font-medium">🎉 You qualify for free delivery!</p>
                </div>
              )}

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Icon.Bag className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="font-playfair text-lg text-gray-400 mb-2">Your bag is empty</p>
                    <p className="text-sm text-gray-300 font-inter mb-6">Add something beautiful</p>
                    <button
                      onClick={() => { setCartOpen(false); navigate("/category"); }}
                      className="text-sm font-medium text-[#0A0908] border border-[#0A0908] px-6 py-2.5 hover:bg-[#0A0908] hover:text-white transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50 px-6">
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex gap-4 py-4"
                        >
                          <Link to={`/product/${item.id}`} onClick={() => setCartOpen(false)} className="shrink-0">
                            <div className="w-18 h-22 w-[72px] h-[88px] bg-[#F5F4F0] overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          </Link>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-inter">{item.designer}</p>
                            <Link to={`/product/${item.id}`} onClick={() => setCartOpen(false)}>
                              <p className="text-sm font-inter font-medium text-[#0A0908] line-clamp-2 leading-snug mt-0.5 hover:text-[#C9A84C] transition-colors">{item.name}</p>
                            </Link>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-sm font-semibold text-[#0A0908]">₦{(item.price * item.quantity).toLocaleString()}</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-400 font-inter">Qty: {item.quantity}</span>
                                <button
                                  onClick={() => dispatch(removeFromCart(item.id))}
                                  className="ml-2 text-gray-300 hover:text-red-400 transition-colors p-1"
                                  aria-label="Remove"
                                >
                                  <Icon.Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Cart footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-5 space-y-3 bg-[#FAFAF8]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-inter text-gray-500">Subtotal</span>
                    <span className="text-base font-semibold font-inter text-[#0A0908]">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-inter">Shipping calculated at checkout</p>
                  <Link
                    to="/cart"
                    onClick={() => setCartOpen(false)}
                    className="block w-full text-center py-3.5 bg-[#0A0908] text-white text-sm font-medium tracking-wide hover:bg-[#C9A84C] transition-colors"
                  >
                    VIEW BAG & CHECKOUT
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="block w-full text-center py-3 border border-gray-200 text-[#0A0908] text-sm font-medium hover:border-[#0A0908] transition-colors"
                  >
                    QUICK CHECKOUT
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════
          MOBILE DRAWER
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => { setMobileOpen(false); setMobileSection(null); }}
              className="fixed inset-0 bg-black z-[65]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-[70] flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                {mobileSection ? (
                  <button
                    onClick={() => setMobileSection(null)}
                    className="flex items-center gap-2 text-sm font-inter text-gray-600 hover:text-[#0A0908] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <div className="flex flex-col">
                    <span className="font-playfair text-base tracking-[0.15em] font-semibold text-[#0A0908]">ANNIE PATRICIA</span>
                    <span className="text-[9px] tracking-[0.35em] text-[#C9A84C] font-inter uppercase">Lagos Luxury</span>
                  </div>
                )}
                <button onClick={() => { setMobileOpen(false); setMobileSection(null); }} className="p-2 text-gray-400 hover:text-[#0A0908] transition-colors">
                  <Icon.X className="w-5 h-5" />
                </button>
              </div>

              {/* Main nav */}
              <AnimatePresence mode="wait">
                {!mobileSection ? (
                  <motion.div
                    key="main"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    className="flex-1 overflow-y-auto"
                  >
                    {/* Gender toggle */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/category?gender=WOMEN"
                          onClick={() => setMobileOpen(false)}
                          className="text-center py-2.5 text-xs font-semibold tracking-widest bg-[#0A0908] text-white"
                        >
                          WOMEN
                        </Link>
                        <Link
                          to="/category?gender=MEN"
                          onClick={() => setMobileOpen(false)}
                          className="text-center py-2.5 text-xs font-semibold tracking-widest border border-[#0A0908] text-[#0A0908] hover:bg-[#0A0908] hover:text-white transition-colors"
                        >
                          MEN
                        </Link>
                      </div>
                    </div>

                    {/* Category images grid */}
                    <div className="px-5 py-4 border-b border-gray-50">
                      <p className="text-[10px] tracking-[0.25em] text-[#C9A84C] uppercase font-inter mb-3">Shop By Category</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Dresses", img: "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=300&q=70", href: "/category?category=Dresses" },
                          { label: "Sets", img: "https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=300&q=70", href: "/category?category=Sets" },
                          { label: "Bags", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70", href: "/category?category=Bags" },
                          { label: "Accessories", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=70", href: "/category?category=Accessories" },
                        ].map((cat) => (
                          <Link
                            key={cat.label}
                            to={cat.href}
                            onClick={() => setMobileOpen(false)}
                            className="group relative overflow-hidden aspect-square"
                          >
                            <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <p className="absolute bottom-2 left-2 text-white text-xs font-semibold tracking-wide font-inter">{cat.label}</p>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Nav links */}
                    <div className="px-5 py-2">
                      {(["women", "men", "collections"] as const).map((key) => (
                        <button
                          key={key}
                          onClick={() => setMobileSection(key)}
                          className="w-full flex items-center justify-between py-3.5 border-b border-gray-50 text-sm font-medium text-[#0A0908] hover:text-[#C9A84C] transition-colors"
                        >
                          <span className="font-inter">{MEGA_MENU[key].label}</span>
                          <Icon.ChevronRight className="w-4 h-4 text-gray-300" />
                        </button>
                      ))}
                      <Link to="/about" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-3.5 border-b border-gray-50 text-sm font-medium text-[#0A0908] hover:text-[#C9A84C] transition-colors">
                        <span className="font-inter">About</span>
                        <Icon.ChevronRight className="w-4 h-4 text-gray-300" />
                      </Link>
                      <Link to="/contact" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-3.5 text-sm font-medium text-[#0A0908] hover:text-[#C9A84C] transition-colors">
                        <span className="font-inter">Contact</span>
                        <Icon.ChevronRight className="w-4 h-4 text-gray-300" />
                      </Link>
                    </div>

                    {/* Account links */}
                    <div className="px-5 py-4 border-t border-gray-100 mt-2 bg-[#FAFAF8]">
                      <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-inter mb-3">My Account</p>
                      {[
                        { icon: Icon.User, label: "Profile", href: "/account" },
                        { icon: Icon.Package, label: "My Orders", href: "/orders" },
                        { icon: Icon.Heart, label: "Saved Items", href: "/saved" },
                      ].map(({ icon: Ic, label, href }) => (
                        <Link
                          key={label}
                          to={href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 py-2.5 text-sm font-inter text-gray-600 hover:text-[#0A0908] transition-colors"
                        >
                          <Ic className="w-4 h-4 text-gray-400" />
                          {label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={mobileSection}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.22 }}
                    className="flex-1 overflow-y-auto px-5 py-4"
                  >
                    <p className="text-[10px] tracking-[0.25em] text-[#C9A84C] uppercase font-inter mb-4">
                      {MEGA_MENU[mobileSection as keyof typeof MEGA_MENU].label}
                    </p>
                    {MEGA_MENU[mobileSection as keyof typeof MEGA_MENU].sections.map((section) => (
                      <div key={section.heading} className="mb-6">
                        <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase font-inter mb-2">{section.heading}</p>
                        {section.links.map((link) => (
                          <Link
                            key={link}
                            to={`/category?category=${link}`}
                            onClick={() => { setMobileOpen(false); setMobileSection(null); }}
                            className="block py-2.5 text-sm font-inter text-gray-700 hover:text-[#C9A84C] border-b border-gray-50 transition-colors"
                          >
                            {link}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-gray-100 space-y-2">
                <Link
                  to="/category"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-3 bg-[#0A0908] text-white text-sm font-medium tracking-widest hover:bg-[#C9A84C] transition-colors font-inter"
                >
                  SHOP ALL
                </Link>
                <Link
                  to="/category?category=SALE"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-2.5 border border-red-400 text-red-500 text-xs font-bold tracking-widest hover:bg-red-50 transition-colors font-inter"
                >
                  SALE ↗
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
