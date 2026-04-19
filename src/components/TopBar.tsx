"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { motion, AnimatePresence } from "framer-motion";
import { categories as productCategories } from "../components/data/products";

/* ── Icon components ─────────────────────────────────────────────────────────── */
const MenuIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const SearchIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="11" cy="11" r="7.5" strokeWidth={1.5} />
    <line x1="20.5" y1="20.5" x2="16.3" y2="16.3" strokeWidth={1.5} strokeLinecap="round" />
  </svg>
);
const HeartIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const BagIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const UserIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const ChevronDown = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
  </svg>
);

/* ── Component ───────────────────────────────────────────────────────────────── */
const TopBar: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [shopHover, setShopHover] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [searchOpen]);

  const handleShopEnter = () => {
    if (shopTimer.current) clearTimeout(shopTimer.current);
    setShopHover(true);
  };
  const handleShopLeave = () => {
    shopTimer.current = setTimeout(() => setShopHover(false), 180);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/category", hasDropdown: true },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-[#111111] text-white text-center py-2.5 px-4 text-xs font-inter tracking-widest">
        <span className="hidden sm:inline">
          FREE DELIVERY ON ORDERS OVER ₦50,000 &nbsp;·&nbsp; AUTHENTIC NIGERIAN LUXURY
        </span>
        <span className="sm:hidden">Free delivery over ₦50,000</span>
      </div>

      {/* ── MAIN HEADER ── */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "shadow-[0_1px_8px_rgba(0,0,0,0.08)]" : "border-b border-gray-100"
        }`}
      >
        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between px-8 lg:px-16 py-4 max-w-screen-2xl mx-auto">
          {/* Left nav */}
          <nav className="flex items-center gap-8">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={handleShopEnter}
                  onMouseLeave={handleShopLeave}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 text-sm font-inter font-medium transition-colors hover-underline ${
                      isActive(link.href) ? "text-[#111111]" : "text-gray-500 hover:text-[#111111]"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${shopHover ? "rotate-180" : ""}`} />
                  </Link>

                  {/* Mega drop */}
                  <AnimatePresence>
                    {shopHover && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-3 bg-white border border-gray-100 shadow-xl rounded-none w-56 z-50 py-2"
                        onMouseEnter={handleShopEnter}
                        onMouseLeave={handleShopLeave}
                      >
                        <Link
                          to="/category"
                          className="block px-5 py-2.5 text-xs font-medium text-gray-900 hover:text-[#B8860B] hover:bg-gray-50 tracking-wider transition-colors"
                        >
                          ALL PRODUCTS
                        </Link>
                        <div className="h-px bg-gray-100 my-1" />
                        {productCategories.slice(0, 10).map((cat) => (
                          <Link
                            key={cat}
                            to={`/category?category=${cat}`}
                            className="block px-5 py-2 text-xs text-gray-600 hover:text-[#B8860B] hover:bg-gray-50 tracking-wide transition-colors"
                          >
                            {cat}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-inter font-medium transition-colors hover-underline ${
                    isActive(link.href) ? "text-[#111111]" : "text-gray-500 hover:text-[#111111]"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Logo (center) */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center">
              <span className="font-playfair text-xl font-semibold tracking-[0.18em] text-[#111111] leading-tight">
                ANNIE PATRICIA
              </span>
              <span className="text-[9px] font-inter tracking-[0.35em] text-[#B8860B] uppercase mt-0.5">
                Lagos Luxury
              </span>
            </div>
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-500 hover:text-[#111111] transition-colors"
              aria-label="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            <Link to="/saved" className="text-gray-500 hover:text-[#111111] transition-colors" aria-label="Wishlist">
              <HeartIcon className="w-5 h-5" />
            </Link>
            <Link to="/orders" className="text-gray-500 hover:text-[#111111] transition-colors" aria-label="Account">
              <UserIcon className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-[#111111] transition-colors" aria-label="Cart">
              <BagIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#111111] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 w-[18px] h-[18px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3.5">
          <button onClick={() => setMobileOpen(true)} className="text-gray-700 hover:text-[#111111] p-1">
            <MenuIcon className="w-6 h-6" />
          </button>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="font-playfair text-base font-semibold tracking-[0.15em] text-[#111111]">
              ANNIE PATRICIA
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} className="text-gray-600 p-1">
              <SearchIcon className="w-5 h-5" />
            </button>
            <Link to="/cart" className="relative text-gray-600 p-1">
              <BagIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#111111] text-white text-[9px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop sub-nav */}
        <div className="hidden md:block border-t border-gray-100 bg-white">
          <div className="max-w-screen-2xl mx-auto px-8 lg:px-16">
            <nav className="flex items-center gap-8 py-2.5 overflow-x-auto">
              <Link to="/category" className="text-xs font-medium text-gray-900 hover:text-[#B8860B] whitespace-nowrap tracking-wider transition-colors hover-underline">
                NEW IN
              </Link>
              {productCategories.slice(0, 9).map((cat) => (
                <Link
                  key={cat}
                  to={`/category?category=${cat}`}
                  className="text-xs text-gray-500 hover:text-[#B8860B] whitespace-nowrap tracking-wider transition-colors hover-underline"
                >
                  {cat}
                </Link>
              ))}
              <Link to="/category?category=SALE" className="text-xs font-semibold text-red-600 hover:text-red-700 whitespace-nowrap tracking-wider transition-colors">
                SALE
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ── SEARCH OVERLAY ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white"
          >
            <div className="max-w-2xl mx-auto px-6 pt-20">
              <div className="flex items-center gap-4 border-b-2 border-[#111111] pb-3">
                <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, styles, designers..."
                  className="flex-1 text-lg font-inter text-[#111111] placeholder-gray-300 outline-none bg-transparent"
                />
                <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-[#111111] transition-colors">
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-10">
                <p className="text-xs tracking-[0.2em] text-gray-400 font-inter uppercase mb-5">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Ankara Dresses", "Aso-oke", "Kente Sets", "Adire", "Bridal Wear", "Bags"].map((term) => (
                    <Link
                      key={term}
                      to={`/category?search=${encodeURIComponent(term)}`}
                      onClick={() => setSearchOpen(false)}
                      className="px-4 py-2 text-sm font-inter border border-gray-200 text-gray-700 hover:border-[#111111] hover:text-[#111111] transition-all"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-[55]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[60] flex flex-col shadow-2xl"
            >
              {/* Drawer head */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <span className="font-playfair text-lg tracking-[0.15em] text-[#111111]">ANNIE PATRICIA</span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-[#111111] transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-6 space-y-1">
                  <Link to="/" onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-medium text-[#111111] border-b border-gray-50 hover:text-[#B8860B] transition-colors">
                    Home
                  </Link>
                  <div className="py-3 border-b border-gray-50">
                    <p className="text-sm font-medium text-[#111111] mb-3">Shop</p>
                    <div className="ml-3 space-y-2">
                      <Link to="/category" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-600 hover:text-[#B8860B] transition-colors py-1">
                        All Products
                      </Link>
                      {productCategories.map((cat) => (
                        <Link
                          key={cat}
                          to={`/category?category=${cat}`}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm text-gray-500 hover:text-[#B8860B] transition-colors py-1"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-medium text-[#111111] border-b border-gray-50 hover:text-[#B8860B] transition-colors">
                    About
                  </Link>
                  <Link to="/contact" onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-medium text-[#111111] border-b border-gray-50 hover:text-[#B8860B] transition-colors">
                    Contact
                  </Link>
                </div>

                {/* Account section */}
                <div className="px-6 mt-6 pt-5 border-t border-gray-100 space-y-3">
                  <p className="text-xs tracking-[0.2em] text-gray-400 uppercase font-inter mb-3">Account</p>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#111111] transition-colors py-1">
                    <UserIcon className="w-4 h-4" /> My Orders
                  </Link>
                  <Link to="/saved" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#111111] transition-colors py-1">
                    <HeartIcon className="w-4 h-4" /> Saved Items
                  </Link>
                  <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#111111] transition-colors py-1">
                    <BagIcon className="w-4 h-4" /> Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="p-6 border-t border-gray-100">
                <Link
                  to="/category"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-3 bg-[#111111] text-white text-sm font-medium tracking-wider hover:bg-[#222] transition-colors"
                >
                  SHOP NOW
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
