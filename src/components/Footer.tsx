// src/components/Footer.tsx
import {
    HomeIcon,
    ShoppingBagIcon,
    UserIcon,
    HeartIcon,
    ArchiveBoxIcon,   // ← NEW: Orders icon
  } from "@heroicons/react/24/outline";
  import { Link } from "react-router-dom";
  
  const Footer = () => {
    return (
      <>
        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
          <div className="flex justify-around py-0.3">
            {/* HOME */}
            <Link
              to="/"
              className="flex flex-col items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition"
            >
              <HomeIcon className="w-6 h-6" />
              <span>HOME</span>
            </Link>
  
            {/* SHOP */}
            <Link
              to="/category"
              className="flex flex-col items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              <span>SHOP</span>
            </Link>
  
            {/* SAVED */}
            <Link
              to="/saved"
              className="flex flex-col items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition"
            >
              <HeartIcon className="w-6 h-6" />
              <span>SAVED</span>
            </Link>
  
            {/* ORDERS (under Shipping) */}
            <Link
              to="/orders"
              className="flex flex-col items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition"
            >
              <ArchiveBoxIcon className="w-6 h-6" />
              <span>ORDERS</span>
            </Link>
  
            {/* ACCOUNT */}
            <Link
              to="/account"
              className="flex flex-col items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition"
            >
              <UserIcon className="w-6 h-6" />
              <span>ACCOUNT</span>
            </Link>
          </div>
        </nav>
  
        {/* ── DESKTOP FOOTER ── */}
        <footer className="hidden md:block py-16 bg-gray-50 border-t">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {/* Brand */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Annie Patricia</h3>
                <p className="text-sm text-gray-600">Timeless luxury, redefined.</p>
              </div>
  
              {/* Shop */}
              <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-black transition">New Arrivals</a></li>
                  <li><a href="#" className="hover:text-black transition">Dresses</a></li>
                  <li><a href="#" className="hover:text-black transition">Knitwear</a></li>
                  <li><a href="#" className="hover:text-black transition">Accessories</a></li>
                </ul>
              </div>
  
              {/* Info */}
              <div>
                <h4 className="font-semibold mb-4">Info</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/about" className="hover:text-black transition">About</a></li>
                  <li><a href="/contact" className="hover:text-black transition">Contact</a></li>
                  <li><Link to="/orders" className="hover:text-black transition">Orders</Link></li>
                  <li><a href="/shipping" className="hover:text-black transition">Shipping</a></li>
                </ul>
              </div>
  
              {/* Newsletter */}
              <div>
                <h4 className="font-semibold mb-4">Stay Connected</h4>
                <p className="text-sm text-gray-600 mb-4">Join our exclusive list</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none"
                  />
                  <button className="px-6 py-2 bg-black text-white rounded-r-lg text-sm font-medium hover:bg-gray-800 transition">
                    Join
                  </button>
                </div>
              </div>
            </div>
  
            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-gray-300 text-center text-xs text-gray-500">
              © 2025 Annie Patricia. All rights reserved.
            </div>
          </div>
        </footer>
      </>
    );
  };
  
  export default Footer;