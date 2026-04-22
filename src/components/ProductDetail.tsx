"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useAppDispatch } from "../hooks/redux";
import { useProduct, AdaptedProduct, useProducts } from "../hooks/useProducts";
import { addToCartServer } from "../store/cartSlice";
import Topbar from "./TopBar";
import Footer from "./Footer";
import ProductCard from "./ProductCard";

interface Review { id: number; name: string; rating: number; date: string; comment: string; verified: boolean; avatar: string; }
interface SizeOption { label: string; available: boolean; }

const sizeChart: Record<string, SizeOption[]> = {
  Bubus: [{ label:"S",available:true },{ label:"M",available:true },{ label:"L",available:false },{ label:"XL",available:true }],
  Kaftan: [{ label:"One Size",available:true }],
  Dresses: [{ label:"UK 6",available:true },{ label:"UK 8",available:true },{ label:"UK 10",available:false },{ label:"UK 12",available:true },{ label:"UK 14",available:true }],
  Shoes: [{ label:"UK 3",available:true },{ label:"UK 4",available:true },{ label:"UK 5",available:false },{ label:"UK 6",available:true },{ label:"UK 7",available:true },{ label:"UK 8",available:true }],
  default: [{ label:"XS",available:true },{ label:"S",available:true },{ label:"M",available:true },{ label:"L",available:false },{ label:"XL",available:true },{ label:"XXL",available:true }],
};

const mockReviews: Review[] = [
  { id:1, name:"Chioma Okeke", rating:5, date:"2 days ago", comment:"Absolutely stunning! The fabric is premium and the fit is perfect. I wore it to my friend's wedding and received so many compliments.", verified:true, avatar:"https://i.pravatar.cc/80?img=9" },
  { id:2, name:"Aisha Mohammed", rating:4, date:"1 week ago", comment:"Beautiful design, but runs slightly large. Order one size down. The quality is exceptional — worth the price.", verified:true, avatar:"https://i.pravatar.cc/80?img=25" },
  { id:3, name:"Tolu Adebayo", rating:5, date:"2 weeks ago", comment:"Worth every kobo. The embroidery is exquisite and fast delivery! Will definitely be ordering more pieces.", verified:true, avatar:"https://i.pravatar.cc/80?img=47" },
];

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const s = size === "lg" ? "text-base" : "text-xs";
  return (
    <span className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`${s} ${i < rating ? "text-[#B8860B]" : "text-gray-200"}`}>★</span>
      ))}
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [selectedSize, setSelectedSize] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<"details"|"care"|"shipping">("details");
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const reviewRef = useRef<HTMLDivElement>(null);
  const reviewInView = useInView(reviewRef, { once: true, margin: "-80px" });

  const { product, loading: productLoading } = useProduct(id as string);
  const { products: allProductsFromHook } = useProducts();
  const [cartLoading, setCartLoading] = useState(false);


  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [location.pathname]);

  useEffect(() => {
    if (!product) return;
    const sizes = sizeChart[product.category] || sizeChart.default;
    const first = sizes.find(s => s.available);
    if (first) setSelectedSize(first.label);
    // sync wishlist
    try {
      const saved = new Set<string>(JSON.parse(localStorage.getItem("wishlist") || "[]"));
      setWishlisted(saved.has(product._id));
    } catch {}
  }, [product]);

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !product.inStock) return;
  
    if (cartLoading) return;
    setCartLoading(true);
  
    try {
      await dispatch(
        addToCartServer({
          id: product._id,       // ✅ FIXED (_id not id)
          quantity: qty,
          size: selectedSize,
        })
      ).unwrap();
  
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlist = () => {
    if (!product) return;
    const set = new Set<number>(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    wishlisted ? set.delete(product.id) : set.add(product.id);
    localStorage.setItem("wishlist", JSON.stringify([...set]));
    setWishlisted(!wishlisted);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  if (productLoading || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-[#111] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400 font-inter">{productLoading ? "Loading…" : "Product not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  const sizes = sizeChart[product.category] || sizeChart.default;
  const galleryImages = [product.image, product.image, product.image, product.image];
  const related = allProductsFromHook.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const tabContent = {
    details: `Handcrafted from premium ${product.category === "Bubus" ? "aso-oke" : "ankara"} fabric sourced directly from master weavers. Each piece features hand-finished seams, custom embroidery details, and a fully lined interior. Designed by Annie Patricia in Lagos.`,
    care: "Dry clean recommended for aso-oke and kente fabrics. Hand wash cold for ankara pieces using mild detergent. Do not tumble dry. Store folded in a cool, dry place away from direct sunlight.",
    shipping: "Lagos Metro: 1–2 business days (₦2,500). Nationwide Nigeria: 3–5 business days (₦4,000). International: 7–14 business days (from ₦15,000). Free delivery on orders over ₦50,000.",
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Topbar />

      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400 font-inter overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-[#111] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/category" className="hover:text-[#111] transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-[#111] font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </motion.div>

      {/* Main product section */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">

          {/* ── Gallery ── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7 }} className="space-y-3">
            {/* Main image */}
            <div
              className="relative overflow-hidden bg-[#F7F5F2] aspect-[4/5] cursor-zoom-in"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <motion.img
                key={activeImg}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: zoom ? 1.12 : 1 }}
                transition={{ duration: .4, ease: "easeOut" }}
                src={galleryImages[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={zoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
              />
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="bg-[#111] text-white text-[10px] font-bold px-3 py-1.5 tracking-widest">{product.badge}</span>
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-sm">
                  <span className="font-playfair text-xl text-[#111]">Sold Out</span>
                </div>
              )}
              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: .9 }}
                onClick={handleWishlist}
                className={`absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center transition-colors ${wishlisted ? "text-red-400" : "text-gray-400 hover:text-red-400"}`}
              >
                {wishlisted ? "♥" : "♡"}
              </motion.button>
              {/* Zoom hint */}
              <div className="absolute bottom-3 right-3 text-[10px] text-white/60 font-inter bg-black/30 px-2 py-1 pointer-events-none">
                Hover to zoom
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((img, i) => (
                <motion.button key={i} whileHover={{ scale: 1.03 }} onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden border-2 transition-colors ${activeImg === i ? "border-[#111]" : "border-transparent hover:border-gray-300"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── Info ── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .1 }} className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <p className="text-[#B8860B] text-xs tracking-[0.35em] uppercase font-inter mb-2">{product.designer}</p>
              <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-[#111] leading-tight mb-3">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <Stars rating={4.8} size="sm" />
                <span className="text-xs text-gray-400 font-inter">4.8 (124 reviews)</span>
              </div>
              <p className="font-playfair text-3xl text-[#111]">₦{product.price.toLocaleString()}</p>
              <p className="text-xs text-gray-400 font-inter mt-1">Or pay in 4 instalments of ₦{Math.round(product.price/4).toLocaleString()}</p>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-[#111] font-inter tracking-wider">SELECT SIZE</p>
                <button onClick={() => setShowSizeGuide(true)} className="text-xs text-[#B8860B] font-inter underline underline-offset-2">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <motion.button key={size.label} whileHover={size.available ? { scale: 1.04 } : {}} whileTap={size.available ? { scale: .96 } : {}}
                    onClick={() => size.available && setSelectedSize(size.label)}
                    disabled={!size.available || !product.inStock}
                    className={`px-5 py-2.5 text-xs font-medium border transition-all font-inter ${
                      selectedSize === size.label
                        ? "border-[#111] bg-[#111] text-white"
                        : size.available && product.inStock
                        ? "border-gray-200 text-[#111] hover:border-[#111]"
                        : "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                    }`}
                  >
                    {size.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Qty + CTA */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* Qty stepper */}
                <div className="flex items-center border border-gray-200">
                  <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-4 py-3 text-lg text-[#111] hover:bg-[#F7F5F2] transition-colors">−</button>
                  <span className="w-10 text-center text-sm font-medium font-inter">{qty}</span>
                  <button onClick={() => setQty(q => q+1)} className="px-4 py-3 text-lg text-[#111] hover:bg-[#F7F5F2] transition-colors">+</button>
                </div>

                {/* Add to bag */}
                <motion.button
                  whileHover={product.inStock ? { scale: 1.01 } : {}}
                  whileTap={product.inStock ? { scale: .99 } : {}}
                  onClick={handleAddToCart}
                  disabled={!product.inStock || !selectedSize}
                  className={`flex-1 py-4 text-sm font-semibold tracking-widest transition-all font-inter ${
                    added
                      ? "bg-[#B8860B] text-white"
                      : product.inStock && selectedSize
                      ? "bg-[#111] text-white hover:bg-[#B8860B]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    <motion.span key={added ? "added" : "default"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="block">
                      {added ? "✓ ADDED TO BAG" : !product.inStock ? "OUT OF STOCK" : !selectedSize ? "SELECT A SIZE" : "ADD TO BAG"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Wishlist text button */}
              <button onClick={handleWishlist} className="w-full py-3.5 border border-gray-200 text-sm font-medium text-[#111] hover:border-[#111] transition-colors font-inter flex items-center justify-center gap-2">
                <span className={wishlisted ? "text-red-400" : ""}>{wishlisted ? "♥" : "♡"}</span>
                {wishlisted ? "SAVED TO WISHLIST" : "SAVE TO WISHLIST"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🚚", label: "Free Delivery", sub: "Over ₦50k" },
                { icon: "↩️", label: "30-Day Returns", sub: "Hassle-free" },
                { icon: "✦", label: "100% Authentic", sub: "Guaranteed" },
              ].map(b => (
                <div key={b.label} className="bg-[#F7F5F2] p-3 text-center">
                  <span className="text-xl block mb-1">{b.icon}</span>
                  <p className="text-[10px] font-semibold text-[#111] font-inter">{b.label}</p>
                  <p className="text-[10px] text-gray-400 font-inter">{b.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-gray-100">
                {(["details","care","shipping"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-medium tracking-wider uppercase font-inter transition-colors relative ${activeTab === tab ? "text-[#111]" : "text-gray-400 hover:text-[#111]"}`}>
                    {tab}
                    {activeTab === tab && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B8860B]" />}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}
                  className="pt-4 text-sm text-gray-500 font-inter leading-relaxed">
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── Reviews ── */}
        <div ref={reviewRef} className="mt-20 lg:mt-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={reviewInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .6 }} className="mb-10">
            <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-3">What Customers Say</p>
            <div className="flex items-end gap-6 flex-wrap">
              <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#111]">Reviews</h2>
              <div className="flex items-center gap-3 pb-1">
                <Stars rating={5} size="lg" />
                <span className="font-playfair text-2xl text-[#111]">4.8</span>
                <span className="text-sm text-gray-400 font-inter">· 124 reviews</span>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {mockReviews.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 24 }} animate={reviewInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .5, delay: i * .1 }}
                className="bg-[#F7F5F2] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-[#111] font-inter">{r.name}</p>
                    <div className="flex items-center gap-2">
                      <Stars rating={r.rating} />
                      {r.verified && <span className="text-[10px] text-green-600 font-inter">✓ Verified</span>}
                    </div>
                  </div>
                  <span className="ml-auto text-[10px] text-gray-400 font-inter">{r.date}</span>
                </div>
                <p className="text-sm text-gray-600 font-inter leading-relaxed">"{r.comment}"</p>
              </motion.div>
            ))}
          </div>

          <motion.button initial={{ opacity: 0 }} animate={reviewInView ? { opacity: 1 } : {}} transition={{ delay: .4 }}
            className="mt-6 text-sm font-inter text-[#B8860B] underline underline-offset-4 hover:text-[#111] transition-colors">
            Read all 124 reviews →
          </motion.button>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <div className="flex items-center gap-4 mb-10">
              <div>
                <p className="text-[#B8860B] text-xs tracking-[0.4em] uppercase font-inter mb-2">From the Same Collection</p>
                <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#111]">You May Also Like</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} animate delay={i * 0.08} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowSizeGuide(false)}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()} className="bg-white w-full max-w-md p-7">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-playfair text-xl font-semibold text-[#111]">Size Guide</h3>
                <button onClick={() => setShowSizeGuide(false)} className="text-gray-400 hover:text-[#111] text-2xl leading-none">×</button>
              </div>
              <table className="w-full text-sm font-inter">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-gray-400 font-normal text-xs uppercase tracking-wider">Size</th>
                    <th className="text-left py-2 text-gray-400 font-normal text-xs uppercase tracking-wider">Bust (cm)</th>
                    <th className="text-left py-2 text-gray-400 font-normal text-xs uppercase tracking-wider">Waist (cm)</th>
                    <th className="text-left py-2 text-gray-400 font-normal text-xs uppercase tracking-wider">Hips (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[["XS","80","62","88"],["S","84","66","92"],["M","88","70","96"],["L","92","74","100"],["XL","96","78","104"]].map(r => (
                    <tr key={r[0]} className="border-b border-gray-50">
                      <td className="py-2.5 font-semibold text-[#111]">{r[0]}</td>
                      <td className="py-2.5 text-gray-600">{r[1]}</td>
                      <td className="py-2.5 text-gray-600">{r[2]}</td>
                      <td className="py-2.5 text-gray-600">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 font-inter mt-4">If between sizes, we recommend sizing up. For assistance, contact us at hello@anniepatricia.ng</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
