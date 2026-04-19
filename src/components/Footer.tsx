// src/components/Footer.tsx
import {
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  HeartIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand border-t border-gold/20 z-50 shadow-2xl">
        <div className="flex justify-around py-3">
          {/* HOME */}
          <Link
            to="/"
            className="flex flex-col items-center gap-1 text-xs font-inter font-medium text-cream/50 hover:text-gold transition-colors tracking-wider"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px]">HOME</span>
          </Link>

          {/* SHOP */}
          <Link
            to="/category"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex flex-col items-center gap-1 text-xs font-inter font-medium text-cream/50 hover:text-gold transition-colors tracking-wider"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            <span className="text-[10px]">SHOP</span>
          </Link>

          {/* SAVED */}
          <Link
            to="/saved"
            className="flex flex-col items-center gap-1 text-xs font-inter font-medium text-cream/50 hover:text-gold transition-colors tracking-wider"
          >
            <HeartIcon className="w-5 h-5" />
            <span className="text-[10px]">SAVED</span>
          </Link>

          {/* ORDERS */}
          <Link
            to="/orders"
            className="flex flex-col items-center gap-1 text-xs font-inter font-medium text-cream/50 hover:text-gold transition-colors tracking-wider"
          >
            <ArchiveBoxIcon className="w-5 h-5" />
            <span className="text-[10px]">ORDERS</span>
          </Link>

          {/* ACCOUNT */}
          <Link
            to="/account"
            className="flex flex-col items-center gap-1 text-xs font-inter font-medium text-cream/50 hover:text-gold transition-colors tracking-wider"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px]">ACCOUNT</span>
          </Link>
        </div>
      </nav>

      {/* ── DESKTOP FOOTER ── */}
      <footer className="hidden md:block bg-brand border-t border-gold/15">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-6">
                <span className="font-playfair text-2xl tracking-[0.25em] text-cream">ANNIE PATRICIA</span>
                <div className="w-8 h-px bg-gold mt-3 mb-4" />
                <p className="font-inter text-xs text-cream/50 leading-relaxed tracking-wider">
                  Nigerian luxury. Global craft.<br />Timeless design.
                </p>
              </div>

              {/* Social icons */}
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-cream/40 hover:text-gold transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
                <a href="#" className="text-cream/40 hover:text-gold transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15h-2.5v-3H8v-2c0-1.1.9-2 2-2h2v3h2.5v3H12v6.8c4.56-.93 8-4.96 8-9.8z" />
                  </svg>
                </a>
                <a href="#" className="text-cream/40 hover:text-gold transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.27 4.27 0 0 0-7.28 3.9A12.12 12.12 0 0 1 3 4.79a4.27 4.27 0 0 0 1.32 5.7 4.22 4.22 0 0 1-1.93-.53v.05a4.27 4.27 0 0 0 3.43 4.18 4.27 4.27 0 0 1-1.92.07 4.27 4.27 0 0 0 3.98 2.96A8.56 8.56 0 0 1 2 19.54a12.07 12.07 0 0 0 6.56 1.92c7.87 0 12.18-6.53 12.18-12.18 0-.19-.01-.37-.02-.55A8.7 8.7 0 0 0 22.46 6z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-inter text-xs tracking-[0.3em] text-gold mb-6 uppercase">Shop</h4>
              <ul className="space-y-3">
                {["New Arrivals", "Dresses", "Knitwear", "Accessories", "Bags", "Sale"].map((item) => (
                  <li key={item}>
                    <a href="#" className="font-inter text-xs text-cream/50 hover:text-gold transition-colors tracking-wider">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-inter text-xs tracking-[0.3em] text-gold mb-6 uppercase">Help</h4>
              <ul className="space-y-3">
                {[
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                  { label: "Orders", href: "/orders" },
                  { label: "Shipping", href: "/shipping" },
                  { label: "Returns", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.href} className="font-inter text-xs text-cream/50 hover:text-gold transition-colors tracking-wider">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-inter text-xs tracking-[0.3em] text-gold mb-6 uppercase">Connect</h4>
              <p className="font-inter text-xs text-cream/50 mb-5 leading-relaxed tracking-wider">
                Join our exclusive list for first access to new drops and private sales.
              </p>
              <div className="flex border border-gold/30">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-3 bg-transparent text-cream/70 placeholder-cream/25 text-xs font-inter focus:outline-none border-r border-gold/30"
                />
                <button className="px-5 py-3 bg-gold text-brand text-xs font-inter font-medium hover:bg-gold-light transition-colors tracking-wider">
                  JOIN
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-gold/15 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-inter text-xs text-cream/25 tracking-wider">
              © 2025 Annie Patricia. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="font-inter text-xs text-cream/25 hover:text-gold transition-colors tracking-wider">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
