import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { newsletter as newsletterApi } from "../services/api";

const HomeIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const ShopIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const HeartIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const OrderIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const UserIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Footer: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subMsg, setSubMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubState("loading");
    try {
      await newsletterApi.subscribe(email.trim());
      setSubState("success");
      setSubMsg("You're subscribed!");
      setEmail("");
    } catch (err: any) {
      setSubState("error");
      setSubMsg(err.message ?? "Something went wrong.");
    }
  };

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const navTabs = [
    { href: "/", label: "Home", Icon: HomeIcon },
    { href: "/category", label: "Shop", Icon: ShopIcon },
    { href: "/saved", label: "Saved", Icon: HeartIcon },
    { href: "/orders", label: "Orders", Icon: OrderIcon },
    { href: "/account", label: "Account", Icon: UserIcon },
  ];

  return (
    <>
      {/* ── MOBILE BOTTOM TAB NAV ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-50 safe-bottom">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navTabs.map(({ href, label, Icon }) => (
            <Link
              key={label}
              to={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
                isActive(href)
                  ? "text-[#C9A84C]"
                  : "text-gray-400 hover:text-[#0A0908]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[9px] tracking-wider font-inter uppercase ${isActive(href) ? "font-semibold" : ""}`}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* ── DESKTOP FOOTER ── */}
      <footer className="hidden md:block bg-[#0A0908] text-white">
        {/* Upper footer */}
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16 pt-16 pb-10">
          <div className="grid md:grid-cols-5 gap-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-5">
                <p className="font-cormorant text-2xl tracking-[0.3em] text-white font-light mb-1">ANNIE PATRICIA</p>
                <div className="w-8 h-0.5 bg-[#C9A84C] mb-4" />
                <p className="text-xs text-gray-400 font-inter leading-relaxed tracking-wider max-w-xs">
                  Nigerian luxury, globally crafted. We work with master artisans across Nigeria to
                  bring you garments that honor tradition while speaking to the modern wardrobe.
                </p>
              </div>
              {/* Social */}
              <div className="flex gap-4">
                {[
                  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                  { label: "Twitter/X", path: "M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.27 4.27 0 00-7.28 3.9A12.12 12.12 0 013 4.79a4.27 4.27 0 001.32 5.7 4.22 4.22 0 01-1.93-.53v.05a4.27 4.27 0 003.43 4.18 4.27 4.27 0 01-1.92.07 4.27 4.27 0 003.98 2.96A8.56 8.56 0 012 19.54a12.07 12.07 0 006.56 1.92c7.87 0 12.18-6.53 12.18-12.18 0-.19-.01-.37-.02-.55A8.7 8.7 0 0022.46 6z" },
                ].map((s) => (
                  <a key={s.label} href="#" className="text-gray-500 hover:text-[#C9A84C] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-xs tracking-[0.25em] text-gray-400 uppercase font-inter mb-5">Shop</h4>
              <ul className="space-y-2.5">
                {["New Arrivals", "Dresses", "Kente Sets", "Accessories", "Bags", "Sale"].map((item) => (
                  <li key={item}>
                    <Link to={`/category?category=${item}`} className="text-xs text-gray-500 hover:text-white transition-colors font-inter">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-xs tracking-[0.25em] text-gray-400 uppercase font-inter mb-5">Help</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Contact", href: "/contact" },
                  { label: "My Orders", href: "/orders" },
                  { label: "Shipping Info", href: "/shipping" },
                  { label: "Returns", href: "#" },
                  { label: "FAQ", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.href} className="text-xs text-gray-500 hover:text-white transition-colors font-inter">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs tracking-[0.25em] text-gray-400 uppercase font-inter mb-5">Stay Updated</h4>
              <p className="text-xs text-gray-500 font-inter mb-4 leading-relaxed">
                Get early access to drops and exclusive offers.
              </p>
              {subState === "success" ? (
                <p className="text-xs font-inter text-[#C9A84C]">{subMsg}</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-gray-700 text-white placeholder-gray-600 text-xs font-inter focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                  {subState === "error" && (
                    <p className="text-[10px] font-inter text-red-400">{subMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={subState === "loading"}
                    className="w-full py-2.5 bg-[#C9A84C] text-white text-xs font-medium tracking-wider hover:bg-[#D4A017] transition-colors font-inter disabled:opacity-60"
                  >
                    {subState === "loading" ? "SUBSCRIBING…" : "SUBSCRIBE"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/5">
          <div className="max-w-screen-xl mx-auto px-8 lg:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-600 font-inter">© 2025 Annie Patricia. All rights reserved.</p>
            <div className="flex items-center gap-5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors font-inter">
                  {item}
                </a>
              ))}
            </div>
            {/* Payment icons */}
            <div className="flex items-center gap-2">
              {["VISA", "MC", "PAYSTACK"].map((p) => (
                <span key={p} className="text-[9px] font-bold text-gray-600 border border-gray-700 px-2 py-1 tracking-wider">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile bottom spacer */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default Footer;
