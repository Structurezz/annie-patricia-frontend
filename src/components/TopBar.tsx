"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { motion, AnimatePresence } from "framer-motion";
import { categories as productCategories } from "../components/data/products";

// --- SVG ICONS ---
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <line x1="3" y1="12" x2="21" y2="12" strokeWidth={2} />
    <line x1="3" y1="6" x2="21" y2="6" strokeWidth={2} />
    <line x1="3" y1="18" x2="21" y2="18" strokeWidth={2} />
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="11" cy="11" r="8" strokeWidth={2} />
    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2} />
  </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="7" r="4" strokeWidth={2} />
    <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" strokeWidth={2} />
  </svg>
);

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth={2} />
  </svg>
);

const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="9" cy="21" r="1" strokeWidth={2} />
    <circle cx="20" cy="21" r="1" strokeWidth={2} />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeWidth={2} />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <line x1="18" y1="6" x2="6" y2="18" strokeWidth={2} />
    <line x1="6" y1="6" x2="18" y2="18" strokeWidth={2} />
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
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ALL CATEGORIES – NO SLICE
  const currentSubNav = productCategories.map(cat => cat.toUpperCase());

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ---------- MOBILE TOPBAR – ASOS STYLE ---------- */}
      <div className="sm:hidden flex items-center justify-between p-3 bg-black text-white">
        <button onClick={toggleMobileMenu} aria-label="Open menu">
          <MenuIcon className="h-6 w-6" />
        </button>

        <Link to="/" className="text-xl font-bold">
          Annie Patricia
        </Link>

        <div className="flex items-center gap-4">
          <button className="p-1">
            <SearchIcon className="h-6 w-6" />
          </button>
          <Link to="/account" className="p-1">
            <UserIcon className="h-6 w-6" />
          </Link>
          <Link to="/wishlist" className="p-1">
            <HeartIcon className="h-6 w-6" />
          </Link>
          <Link to="/cart" className="relative p-1">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ---------- MOBILE MENU – FULL SCROLL + NO FOOTER OVERLAY ---------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-0 bg-white z-50 sm:hidden flex flex-col max-h-screen"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveGender("WOMEN")}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                      activeGender === "WOMEN" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    WOMEN
                  </button>
                  <button
                    onClick={() => setActiveGender("MEN")}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                      activeGender === "MEN" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    MEN
                  </button>
                </div>
                <button onClick={toggleMobileMenu} className="p-2">
                  <XIcon className="h-6 w-6 text-gray-700" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pb-safe"> {/* ← FIX: pb-safe */}
                <div className="p-4 space-y-6">

                  {/* HOME */}
                  <Link to="/" onClick={toggleMobileMenu} className="flex items-center gap-3 py-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      <img src="/api/placeholder/48/48" alt="Home" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium">HOME</span>
                  </Link>

                  {/* Sale Banner */}
                  <div className="bg-black text-white p-4 rounded-lg">
                    <p className="text-xs uppercase tracking-wider opacity-80">GET UP TO 30% OFF!</p>
                    <h3 className="text-lg font-bold mt-1">Sale</h3>
                    <p className="text-sm mt-1">Up to 60% off</p>
                  </div>

                  {/* ALL CATEGORIES – NO LIMIT */}
                  {currentSubNav.map((cat) => (
                    <Link
                      key={cat}
                      to={`/category?gender=${activeGender}&category=${cat}`}
                      onClick={toggleMobileMenu}
                      className="flex items-center gap-3 py-2"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        <img src={`/api/placeholder/48/48`} alt={cat} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium">{cat}</span>
                    </Link>
                  ))}

                  {/* Topshop */}
                  <div className="bg-black text-white p-6 rounded-lg text-center">
                    <h3 className="text-2xl font-bold">TOPSHOP</h3>
                    <div className="flex justify-center gap-2 mt-3">
                      <div className="w-12 h-12 bg-gray-300 rounded"></div>
                      <div className="w-12 h-12 bg-gray-300 rounded"></div>
                      <div className="w-12 h-12 bg-gray-300 rounded"></div>
                    </div>
                    <p className="text-sm mt-3">Gift Vouchers | Download the App</p>
                  </div>

                  {/* Social & Sign In */}
                  <div className="flex justify-center gap-4 py-4">
                    <a href="#" className="p-2"><svg className="w-6 h-6" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="18" cy="6" r="1.5" /></svg></a>
                    <a href="#" className="p-2"><svg className="w-6 h-6" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15h-2.5v-3H8v-2c0-1.1.9-2 2-2h2v3h2.5v3H12v6.8c4.56-.93 8-4.96 8-9.8z" /></svg></a>
                    <a href="#" className="p-2"><svg className="w-6 h-6" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.27 4.27 0 0 0-7.28 3.9A12.12 12.12 0 0 1 3 4.79a4.27 4.27 0 0 0 1.32 5.7 4.22 4.22 0 0 1-1.93-.53v.05a4.27 4.27 0 0 0 3.43 4.18 4.27 4.27 0 0 1-1.92.07 4.27 4.27 0 0 0 3.98 2.96A8.56 8.56 0 0 1 2 19.54a12.07 12.07 0 0 0 6.56 1.92c7.87 0 12.18-6.53 12.18-12.18 0-.19-.01-.37-.02-.55A8.7 8.7 0 0 0 22.46 6z" /></svg></a>
                  </div>

                  <div className="text-center text-sm">
                    <Link to="/login" onClick={toggleMobileMenu} className="font-medium">Sign In</Link>
                    <span className="mx-2">|</span>
                    <Link to="/register" onClick={toggleMobileMenu} className="font-medium">Join</Link>
                  </div>

                  {/* Account Links */}
                  <div className="space-y-3 py-4 border-t">
                    {[
                      { label: "My Account", icon: "User" },
                      { label: "My Orders", icon: "Package" },
                      { label: "Returns Information", icon: "Arrow Left" },
                      { label: "Contact Preferences", icon: "Mail" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to="#"
                        onClick={toggleMobileMenu}
                        className="flex items-center gap-3 py-2 text-sm"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Help & Info */}
                  <div className="space-y-3 py-4 border-t text-sm">
                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer font-medium">
                        Help & Information
                        <span className="group-open:rotate-180 transition">Down Arrow</span>
                      </summary>
                      <div className="mt-2 pl-6 space-y-2 text-gray-600">
                        <Link to="#">Delivery</Link>
                        <Link to="#">Returns</Link>
                        <Link to="#">Help Center</Link>
                      </div>
                    </details>
                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer font-medium">
                        About ASOS
                        <span className="group-open:rotate-180 transition">Down Arrow</span>
                      </summary>
                    </details>
                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer font-medium">
                        More from ASOS
                        <span className="group-open:rotate-180 transition">Down Arrow</span>
                      </summary>
                    </details>
                  </div>

                  {/* Country */}
                  <div className="flex items-center justify-between py-4 border-t text-sm">
                    <span>You're in Nigeria</span>
                    <button className="text-blue-600 font-medium">CHANGE</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------- DESKTOP HEADER – UNCHANGED ---------- */}
      <div className="hidden sm:block bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Annie Patricia
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveGender("WOMEN")}
              className={`px-6 py-3 font-bold text-sm transition-all ${
                activeGender === "WOMEN" ? "bg-white text-black" : "hover:bg-white/10"
              }`}
            >
              WOMEN
            </button>
            <button
              onClick={() => setActiveGender("MEN")}
              className={`px-6 py-3 font-bold text-sm transition-all ${
                activeGender === "MEN" ? "bg-white text-black" : "hover:bg-white/10"
              }`}
            >
              MEN
            </button>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items and brands"
                className="w-full bg-white text-black rounded-full py-3 px-6 pr-12 text-sm focus:outline-none"
              />
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/account" className="hover:text-gray-300 transition">
              <UserIcon className="h-6 w-6" />
            </Link>
            <Link to="/wishlist" className="hover:text-gray-300 transition">
              <HeartIcon className="h-6 w-6" />
            </Link>
            <Link to="/cart" className="relative hover:text-gray-300 transition">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="bg-gray-100 text-black">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-6 py-2 text-sm font-medium">
              {currentSubNav.map((cat) => (
                <Link
                  key={cat}
                  to={`/category?gender=${activeGender}&category=${cat}`}
                  className="hover:text-red-600 transition"
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