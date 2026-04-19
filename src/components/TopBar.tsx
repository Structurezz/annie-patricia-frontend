"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { motion, AnimatePresence } from "framer-motion";
import { categories as productCategories } from "../components/data/products";

import {
  ChevronDownIcon,
  UserIcon as UserOutline,
  ArchiveBoxIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  TruckIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  BuildingStorefrontIcon,
  GiftIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <line x1="3" y1="12" x2="21" y2="12" strokeWidth={1.5} />
    <line x1="3" y1="6" x2="21" y2="6" strokeWidth={1.5} />
    <line x1="3" y1="18" x2="21" y2="18" strokeWidth={1.5} />
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="11" cy="11" r="8" strokeWidth={1.5} />
    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={1.5} />
  </svg>
);

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth={1.5} />
  </svg>
);

const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="9" cy="21" r="1" strokeWidth={1.5} />
    <circle cx="20" cy="21" r="1" strokeWidth={1.5} />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeWidth={1.5} />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <line x1="18" y1="6" x2="6" y2="18" strokeWidth={1.5} />
    <line x1="6" y1="6" x2="18" y2="18" strokeWidth={1.5} />
  </svg>
);

const TopBar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGender, setActiveGender] = useState<"WOMEN" | "MEN">("WOMEN");
  const searchRef = useRef<HTMLDivElement>(null);

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSubNav = productCategories.map((cat) => cat.toUpperCase());

  return (
    <header className="sticky top-0 z-50">
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="hidden sm:block bg-brand text-gold text-xs tracking-widest text-center py-2 font-inter">
        Free delivery on orders over ₦50,000 &nbsp;·&nbsp; Nigerian luxury, globally crafted
      </div>

      {/* ── MOBILE TOPBAR ── */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 bg-brand text-white">
        <button onClick={toggleMobileMenu} aria-label="Open menu" className="text-cream hover:text-gold transition-colors">
          <MenuIcon className="h-6 w-6" />
        </button>

        <Link to="/" className="flex items-center">
          <img
            src="/annielogo.png"
            alt="Annie Patricia"
            className="max-h-16 w-auto object-contain brightness-200"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (e.currentTarget.parentElement as HTMLElement).innerHTML =
                '<span class="font-playfair text-lg tracking-[0.2em] text-cream">ANNIE PATRICIA</span>';
            }}
          />
        </Link>

        <div className="flex items-center gap-3">
          <button className="text-cream hover:text-gold transition-colors p-1">
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link to="/cart" className="relative text-cream hover:text-gold transition-colors p-1">
            <ShoppingCartIcon className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-brand text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/70 z-40 sm:hidden backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-0 bg-brand z-50 sm:hidden flex flex-col max-h-screen"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-gold/20">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveGender("WOMEN")}
                    className={`px-4 py-1.5 text-xs tracking-widest font-inter font-medium transition-all border ${
                      activeGender === "WOMEN"
                        ? "bg-gold text-brand border-gold"
                        : "border-gold/40 text-gold/70 hover:border-gold hover:text-gold"
                    }`}
                  >
                    WOMEN
                  </button>
                  <button
                    onClick={() => setActiveGender("MEN")}
                    className={`px-4 py-1.5 text-xs tracking-widest font-inter font-medium transition-all border ${
                      activeGender === "MEN"
                        ? "bg-gold text-brand border-gold"
                        : "border-gold/40 text-gold/70 hover:border-gold hover:text-gold"
                    }`}
                  >
                    MEN
                  </button>
                </div>
                <button onClick={toggleMobileMenu} className="text-cream/70 hover:text-gold transition-colors p-1">
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pb-10">
                <div className="p-5 space-y-1">
                  {/* Logo */}
                  <div className="py-6 text-center border-b border-gold/20 mb-4">
                    <span className="font-playfair text-2xl tracking-[0.3em] text-cream">ANNIE PATRICIA</span>
                    <p className="text-gold/70 text-xs tracking-widest mt-1 font-inter">LUXURY NIGERIAN FASHION</p>
                  </div>

                  {/* HOME */}
                  <Link
                    to="/"
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 py-3 border-b border-white/5 text-cream hover:text-gold transition-colors"
                  >
                    <span className="font-inter text-sm tracking-widest">HOME</span>
                  </Link>

                  {/* CATEGORIES */}
                  {currentSubNav.map((cat) => (
                    <Link
                      key={cat}
                      to={`/category?category=${cat}`}
                      onClick={toggleMobileMenu}
                      className="flex items-center gap-3 py-3 border-b border-white/5 text-cream hover:text-gold transition-colors"
                    >
                      <span className="font-inter text-sm tracking-widest">{cat}</span>
                    </Link>
                  ))}

                  {/* Sale Banner */}
                  <div className="mt-6 border border-gold/40 p-5 text-center">
                    <p className="text-xs tracking-widest text-gold/70 font-inter uppercase">Limited Time</p>
                    <h3 className="font-playfair text-2xl text-cream mt-1">Sale</h3>
                    <p className="text-sm text-gold mt-1 font-inter">Up to 60% off selected pieces</p>
                  </div>

                  {/* Social & Sign In */}
                  <div className="flex justify-center gap-6 py-6 border-t border-gold/20 mt-4">
                    <a href="#" className="text-cream/50 hover:text-gold transition-colors">
                      <GlobeAltIcon className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-cream/50 hover:text-gold transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15h-2.5v-3H8v-2c0-1.1.9-2 2-2h2v3h2.5v3H12v6.8c4.56-.93 8-4.96 8-9.8z" />
                      </svg>
                    </a>
                    <a href="#" className="text-cream/50 hover:text-gold transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.27 4.27 0 0 0-7.28 3.9A12.12 12.12 0 0 1 3 4.79a4.27 4.27 0 0 0 1.32 5.7 4.22 4.22 0 0 1-1.93-.53v.05a4.27 4.27 0 0 0 3.43 4.18 4.27 4.27 0 0 1-1.92.07 4.27 4.27 0 0 0 3.98 2.96A8.56 8.56 0 0 1 2 19.54a12.07 12.07 0 0 0 6.56 1.92c7.87 0 12.18-6.53 12.18-12.18 0-.19-.01-.37-.02-.55A8.7 8.7 0 0 0 22.46 6z" />
                      </svg>
                    </a>
                  </div>

                  <div className="text-center text-xs font-inter tracking-widest">
                    <Link to="/login" onClick={toggleMobileMenu} className="text-gold hover:text-gold-light transition">Sign In</Link>
                    <span className="mx-2 text-cream/30">|</span>
                    <Link to="/register" onClick={toggleMobileMenu} className="text-gold hover:text-gold-light transition">Join</Link>
                  </div>

                  {/* Account Links */}
                  <div className="space-y-1 py-4 border-t border-gold/20 mt-4">
                    {[
                      { label: "My Account", Icon: UserOutline },
                      { label: "My Orders", Icon: ArchiveBoxIcon },
                      { label: "Returns", Icon: ArrowPathIcon },
                      { label: "Contact", Icon: EnvelopeIcon },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to="#"
                        onClick={toggleMobileMenu}
                        className="flex items-center gap-3 py-3 text-sm font-inter text-cream/70 hover:text-gold transition-colors"
                      >
                        <item.Icon className="w-4 h-4 text-gold/50" />
                        <span className="tracking-wider">{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Help & Info */}
                  <div className="space-y-2 py-4 border-t border-gold/20 text-sm font-inter">
                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer font-medium text-cream/80 tracking-wider py-2">
                        Help & Information
                        <ChevronDownIcon className="w-4 h-4 text-gold/50 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-1 pl-4 space-y-2 text-cream/50">
                        <Link to="#" className="flex items-center gap-2 py-1 hover:text-gold transition-colors"><TruckIcon className="w-4 h-4" /> Delivery</Link>
                        <Link to="#" className="flex items-center gap-2 py-1 hover:text-gold transition-colors"><ArrowPathIcon className="w-4 h-4" /> Returns</Link>
                        <Link to="#" className="flex items-center gap-2 py-1 hover:text-gold transition-colors"><QuestionMarkCircleIcon className="w-4 h-4" /> Help Center</Link>
                      </div>
                    </details>

                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer font-medium text-cream/80 tracking-wider py-2">
                        About Annie Patricia
                        <ChevronDownIcon className="w-4 h-4 text-gold/50 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-1 pl-4 space-y-2 text-cream/50">
                        <Link to="#" className="flex items-center gap-2 py-1 hover:text-gold transition-colors"><BuildingStorefrontIcon className="w-4 h-4" /> Our Story</Link>
                        <Link to="#" className="flex items-center gap-2 py-1 hover:text-gold transition-colors"><GiftIcon className="w-4 h-4" /> Gift Cards</Link>
                      </div>
                    </details>
                  </div>

                  {/* Country */}
                  <div className="flex items-center justify-between py-4 border-t border-gold/20 text-xs font-inter tracking-wider">
                    <span className="text-cream/50">You're in Nigeria</span>
                    <button className="text-gold hover:text-gold-light font-medium transition-colors">CHANGE</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── DESKTOP HEADER ── */}
      <div className="hidden sm:block bg-brand">
        {/* Main header row */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          {/* Left nav links */}
          <nav className="flex items-center gap-6">
            <button
              onClick={() => setActiveGender("WOMEN")}
              className={`text-xs tracking-[0.2em] font-inter font-medium transition-all gold-underline ${
                activeGender === "WOMEN" ? "text-gold" : "text-cream/70 hover:text-gold"
              }`}
            >
              WOMEN
            </button>
            <button
              onClick={() => setActiveGender("MEN")}
              className={`text-xs tracking-[0.2em] font-inter font-medium transition-all gold-underline ${
                activeGender === "MEN" ? "text-gold" : "text-cream/70 hover:text-gold"
              }`}
            >
              MEN
            </button>
            <Link to="/category?category=COLLECTIONS" className="text-xs tracking-[0.2em] font-inter text-cream/70 hover:text-gold transition-colors gold-underline">
              COLLECTIONS
            </Link>
            <Link to="/category?category=SALE" className="text-xs tracking-[0.2em] font-inter text-burgundy hover:text-gold transition-colors gold-underline">
              SALE
            </Link>
          </nav>

          {/* Centered Logo */}
          <Link to="/" className="flex-shrink-0 text-center">
            <img
              src="/annielogo.png"
              alt="Annie Patricia"
              className="max-h-16 w-auto object-contain brightness-200 mx-auto"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="font-playfair text-xl tracking-[0.3em] text-cream hidden logo-text">ANNIE PATRICIA</span>
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-5" ref={searchRef}>
            <div className="relative">
              <button className="text-cream/70 hover:text-gold transition-colors p-1">
                <SearchIcon className="h-5 w-5" />
              </button>
            </div>
            <Link to="/saved" className="text-cream/70 hover:text-gold transition-colors p-1">
              <HeartIcon className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="relative text-cream/70 hover:text-gold transition-colors p-1">
              <ShoppingCartIcon className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-brand text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Category sub-nav */}
        <div className="bg-cream border-t border-gold/10">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-8 py-2.5 text-xs font-inter font-medium tracking-widest overflow-x-auto">
              {currentSubNav.map((cat) => (
                <Link
                  key={cat}
                  to={`/category?category=${cat}`}
                  className="whitespace-nowrap text-text-dark hover:text-gold transition-colors gold-underline py-1"
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
