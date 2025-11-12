"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";   // <-- Redux hook

// --- SVG ICONS ---
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <circle cx="11" cy="11" r="8" strokeWidth={2} />
    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2} />
  </svg>
);

const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <circle cx="9" cy="21" r="1" strokeWidth={2} />
    <circle cx="20" cy="21" r="1" strokeWidth={2} />
    <path
      d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
      strokeWidth={2}
    />
  </svg>
);

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <line x1="3" y1="12" x2="21" y2="12" strokeWidth={2} />
    <line x1="3" y1="6" x2="21" y2="6" strokeWidth={2} />
    <line x1="3" y1="18" x2="21" y2="18" strokeWidth={2} />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <line x1="18" y1="6" x2="6" y2="18" strokeWidth={2} />
    <line x1="6" y1="6" x2="18" y2="18" strokeWidth={2} />
  </svg>
);

const TopBar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // ---- REDUX CART COUNT ----
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

  // Close search when clicking outside
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

      {/* ---------- MOBILE FULLSCREEN MENU ---------- */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 sm:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <h1 className="text-2xl font-bold">Annie Patricia</h1>
            </Link>
            <button onClick={toggleMobileMenu} aria-label="Close menu">
              <XIcon className="h-8 w-8" />
            </button>
          </div>

          <nav className="flex flex-col p-8 space-y-6 text-2xl font-medium">
            {navLinks.map((link) => (
            <Link
            key={link.path}
            to={link.path}
            onClick={() => {
              setIsMobileMenuOpen(false); // close mobile menu
              window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
            }}
            className={`${
              isActive(link.path) ? "text-red-600" : "text-gray-800"
            } hover:text-red-600 transition`}
          >
            {link.label}
          </Link>
          
            ))}
          </nav>
        </div>
      </div>

      {/* ---------- DESKTOP HEADER ---------- */}
      <div className="hidden sm:flex justify-between items-center max-w-7xl mx-auto px-6 py-2 border-b">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-red-600 transition">
          Annie Patricia
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center space-x-8 font-medium text-gray-600">
          {navLinks.map((link) => (
       <Link
       key={link.path}
       to={link.path}
       onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} // <-- Scroll to top
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

        {/* Search + Cart */}
        <div className="flex items-center space-x-6">
          {/* Search */}
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

          {/* Cart */}
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