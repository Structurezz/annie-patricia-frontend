"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { motion, AnimatePresence } from "framer-motion";

// --- SVG ICONS ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="11" cy="11" r="8" strokeWidth={2} />
    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2} />
  </svg>
);

const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="9" cy="21" r="1" strokeWidth={2} />
    <circle cx="20" cy="21" r="1" strokeWidth={2} />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" strokeWidth={2} />
  </svg>
);

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <line x1="3" y1="12" x2="21" y2="12" strokeWidth={2} />
    <line x1="3" y1="6" x2="21" y2="6" strokeWidth={2} />
    <line x1="3" y1="18" x2="21" y2="18" strokeWidth={2} />
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
  const searchRef = useRef<HTMLDivElement>(null);

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/category", label: "Shop" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ---------- MOBILE HEADER ---------- */}
      <div className="sm:hidden flex justify-between items-center p-4 border-b">
        <button onClick={toggleMobileMenu} aria-label="Open menu">
          <MenuIcon className="h-7 w-7" />
        </button>

        <Link to="/" className="text-xl font-bold">
          Annie Patricia
        </Link>

        <Link to="/checkout" className="relative">
          <ShoppingCartIcon className="h-7 w-7" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* ---------- FULLY LOADED MOBILE MENU ---------- */}
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
              className="fixed inset-0 bg-white z-50 sm:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                      Annie Patricia
                    </h1>
                  </Link>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all hover:scale-110"
                  >
                    <XIcon className="h-6 w-6 text-gray-700" />
                  </button>
                </div>

                <nav className="flex-1 p-6">
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 400 }}
                        className="group"
                      >
                        <Link
                          to={link.path}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`
                            relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300
                            ${isActive(link.path)
                              ? "bg-red-600/10 text-red-600 shadow-lg ring-2 ring-red-600/20"
                              : "bg-gray-50 text-gray-800 hover:bg-red-600/5 hover:text-red-600"
                            }
                            group-hover:shadow-xl group-hover:-translate-y-1
                          `}
                        >
                          <div className="mb-2">
                            {link.label === "Home" && (
                              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                              </svg>
                            )}
                            {link.label === "Shop" && (
                              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 3v2h6V3h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V3h2zm0 4v2h6V7H9zm0 4v2h6v-2H9zm0 4v2h6v-2H9z" />
                              </svg>
                            )}
                            {link.label === "About" && (
                              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M12 14c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
                              </svg>
                            )}
                            {link.label === "Contact" && (
                              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-semibold tracking-wide">{link.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-10 px-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Latest News</h3>
                    <div className="space-y-2">
                      {[
                        { title: "Summer Collection 2025", date: "Nov 10" },
                        { title: "Behind the Scenes: Photoshoot", date: "Nov 5" },
                        { title: "New Store Opening Soon!", date: "Oct 30" },
                      ].map((news, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition"
                        >
                          <span className="text-sm font-medium text-gray-800">{news.title}</span>
                          <span className="text-xs text-gray-500">{news.date}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 px-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Stay Updated</h3>
                    <form className="flex flex-col gap-3">
                      <input
                        type="email"
                        placeholder="Your email"
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600/30 text-sm"
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>

                  <div className="mt-8 flex justify-center gap-6">
                    {[
                      { icon: "instagram", href: "#" },
                      { icon: "facebook", href: "#" },
                      { icon: "twitter", href: "#" },
                      { icon: "pinterest", href: "#" },
                    ].map((social, i) => (
                      <motion.a
                        key={i}
                        href={social.href}
                        target="_blank"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                        className="p-3 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        {social.icon === "instagram" && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="5" />
                            <circle cx="18" cy="6" r="1.5" />
                          </svg>
                        )}
                        {social.icon === "facebook" && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15h-2.5v-3H8v-2c0-1.1.9-2 2-2h2v3h2.5v3H12v6.8c4.56-.93 8-4.96 8-9.8z" />
                          </svg>
                        )}
                        {social.icon === "twitter" && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.27 4.27 0 0 0-7.28 3.9A12.12 12.12 0 0 1 3 4.79a4.27 4.27 0 0 0 1.32 5.7 4.22 4.22 0 0 1-1.93-.53v.05a4.27 4.27 0 0 0 3.43 4.18 4.27 4.27 0 0 1-1.92.07 4.27 4.27 0 0 0 3.98 2.96A8.56 8.56 0 0 1 2 19.54a12.07 12.07 0 0 0 6.56 1.92c7.87 0 12.18-6.53 12.18-12.18 0-.19-.01-.37-.02-.55A8.7 8.7 0 0 0 22.46 6z" />
                          </svg>
                        )}
                        {social.icon === "pinterest" && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49-.09-.82-.17-2.07.04-2.96.19-.8 1.27-5.39 1.27-5.39s-.32-.65-.32-1.61c0-1.51.88-2.63 1.97-2.63.93 0 1.38.7 1.38 1.54 0 .94-.6 2.34-.91 3.64-.26 1.09.55 1.98 1.63 1.98 1.96 0 3.46-2.07 3.46-5.05 0-2.64-1.9-4.48-4.61-4.48-3.14 0-4.98 2.35-4.98 4.78 0 .95.37 1.97.83 2.52.09.11.1.2.07.31-.09.35-.3 1.12-.34 1.28-.05.21-.17.25-.39.15-1.44-.64-2.34-2.65-2.34-4.27 0-3.48 2.53-6.68 7.3-6.68 3.83 0 6.81 2.73 6.81 6.39 0 3.81-2.4 6.87-5.73 6.87-1.12 0-2.17-.58-2.53-1.27 0 0-.55 2.1-.69 2.61-.25.96-1.03 2.16-1.54 2.89C10.63 22.88 11.31 23 12 23c5.52 0 10-4.48 10-10S17.52 3 12 3z" />
                          </svg>
                        )}
                      </motion.a>
                    ))}
                  </div>
                </nav>

                <div className="p-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} Annie Patricia. Crafted with love.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------- DESKTOP HEADER (UNCHANGED) ---------- */}
      <div className="hidden sm:flex justify-between items-center max-w-7xl mx-auto px-6 py-2 border-b">
        <Link to="/" className="text-2xl font-bold hover:text-red-600 transition">
          Annie Patricia
        </Link>

        <nav className="flex items-center space-x-8 font-medium text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`py-3 ${
                isActive(link.path)
                  ? "text-red-600 border-b-2 border-red-600"
                  : "hover:text-red-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-6">
          <div ref={searchRef} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-64 border border-gray-300 rounded-full py-2.5 px-5 pr-11 text-sm focus:outline-none focus:border-red-500 transition"
            />
            <SearchIcon className="h-5 w-5 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none -mt-2" />
          </div>

          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-7 w-7 hover:text-red-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;