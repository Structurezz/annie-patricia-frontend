"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";
import {
  HeartIcon as HeartOutline,
  ShoppingBagIcon,
  SparklesIcon,
  ArrowDownIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import CategoryModal from "../components/CategoryModal";
import { categories as productCategories } from "../components/data/products";


// ---------- REDUX ----------
import { useAppDispatch, useAppSelector } from "../store/hooks";   // <-- create this file
import { addToCart, removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
// ---------------------------

// Import real products
import { allProducts, FLOATING_CATEGORIES } from "../components/data/products";

// Filter NEW & BESTSELLERS for home
const featuredProducts = allProducts
  .filter(p => p.badge === "NEW" || p.badge === "BESTSELLER")
  .slice(0, 12);

interface Category {
  name: string;
  image: string;
  href: string;
}

interface Look {
  title: string;
  description: string;
  image: string;
}

const generatePlaceholder = (text: string, width = 400, height = 600) => {
  const encodedText = encodeURIComponent(text || "No Image");
  return `https://via.placeholder.com/${width}x${height}/eeeeee/999999?text=${encodedText}`;
};
// Helper: safely get image
function getSafeImage(img) {
  if (!img || typeof img !== "string" || img.trim() === "") {
    return "/images/placeholder-book.png"; // your existing placeholder asset
  }
  return img;
}


const Home: React.FC = () => {
  // ---------- WISHLIST (localStorage) ----------
  const [wishlist, setWishlist] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // ---------- CART FROM REDUX ----------
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [modalOpen, setModalOpen] = useState(false);
const [selectedCat, setSelectedCat] = useState<{ label: string; value: string } | null>(null);

  // ---------- SCROLL ----------
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  // ---------- WISHLIST HANDLERS ----------
  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(Array.from(wishlist)));
  }, [wishlist]);

  // ---------- SCROLL ----------
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------- ADD TO CART ----------
  const handleAddToCart = (product: typeof allProducts[0], e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        designer: product.designer,
        price: product.price,
        image: product.image,
      })
    );
  };

  // ---------- CATEGORIES ----------
  const categories: Category[] = [
    { name: "NEW IN", image: "https://media.istockphoto.com/id/1366262019/vector/vector-illustration-new-arrival-sticker-tag-or-banner-with-megaphone.jpg?s=612x612&w=0&k=20&c=43JBcUsV2OjmsWWNvuJd-wUT3IOgY-r-p0TY6yiPOqg=", href: "/shop?category=NEW" },
    { name: "KIMONO SETS", image: "https://debrasgrace.com/wp-content/uploads/2023/05/DGL10MAY230685.jpg", href: "/shop?category=SETS" },
    { name: "ASO OKE", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/African_Lace_VLM_04.jpg/250px-African_Lace_VLM_04.jpg", href: "/shop?category=ASOOKE" },
    { name: "DRESSES", image: "https://media.istockphoto.com/id/2208803520/photo/young-woman-choosing-clothes-in-a-second-hand-shop-promoting-sustainable-fashion.jpg?s=612x612&w=0&k=20&c=xstd7XTW0BHBhZFuRaNjVDy5DusUHWrzJbNpy1fQN0E=", href: "/shop?category=DRESSES" },
    { name: "BAGS", image: "https://anjoo.com.ng/public/uploads/all/7swgzDTWrQT1Btw4mpsr2JJniR32LV7rRh021LGD.jpg", href: "/shop?category=BAGS" },
  ];

  const looks: Look[] = [
    { title: "Ankara Autumn", description: "Bold prints, warm tones", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80" },
    { title: "Lagos Luxe", description: "Minimal lines, maximal impact", image: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=1200&q=80" },
    { title: "Evening Aso Ebi", description: "Timeless glamour, reimagined", image: "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=1200&q=80" },
  ];

  const instagramPosts = [
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3519b396dd?w=600&q=80",
    "https://images.unsplash.com/photo-1441986300917-6467269125f2?w=600&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Pass live counts to Topbar */}
      <Topbar wishlistCount={wishlist.size} cartCount={cartCount} />
      


      {/* HERO VIDEO SECTION */}
      <section className="relative h-screen overflow-hidden">
        <motion.video
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          src="/hero_vid.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 text-white z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-5xl md:text-7xl font-light tracking-tight mb-6"
          >
            Annie Patricia
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-xl max-w-xl mb-10 opacity-90"
          >
            Nigerian luxury. Global craft. Timeless design.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="/category"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-10 py-4 font-medium tracking-wider rounded-md shadow-lg hover:bg-gray-100 transition"
            >
              SHOP WOMEN
            </motion.a>
            <motion.a
              href="/category"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white px-10 py-4 font-medium tracking-wider rounded-md hover:bg-white hover:text-black transition"
            >
              SHOP MEN
            </motion.a>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
        >
          <ArrowDownIcon className="w-6 h-6" />
        </motion.div>
      </section>

      {/* FLOATING CATEGORY PILLS */}
      <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.2 }}
  className={`fixed top-32 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
    scrolled ? "top-20 bg-white/90 backdrop-blur-lg shadow-md" : "top-32 bg-white/100"
  } rounded-full px-6 py-3 hidden md:flex gap-6`}
>
  {FLOATING_CATEGORIES.map((cat) => (
    <button
      key={cat.value}
      onClick={() => {
        setSelectedCat({ label: cat.label, value: cat.value });
        setModalOpen(true);
      }}
      className={`text-sm font-medium tracking-widest transition-colors ${
        scrolled ? "text-gray-800 hover:text-black" : "text-black hover:text-black"
      }`}
    >
      {cat.label}
    </button>
  ))}
</motion.div>

{/* MODAL */}
{selectedCat && (
  <CategoryModal
    isOpen={modalOpen}
    onClose={() => {
      setModalOpen(false);
      setSelectedCat(null);
    }}
    category={selectedCat.value}
    label={selectedCat.label}
  />
)}

      {/* SHOP BY CATEGORY CAROUSEL */}





      {/* NEW ARRIVALS GRID */}
    {/* NEW ARRIVALS GRID */}
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-stone-50">
  <div className="max-w-7xl mx-auto">

    {/* SECTION TITLE */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
        New Arrivals
      </h2>
      <p className="text-gray-600 text-lg">Curated for the modern wardrobe</p>
    </motion.div>

    {/* PRODUCT GRID */}
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      {featuredProducts.map((product, index) => (
        <motion.article
          key={product.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <Link to={`/product/${product.id}`} className="block">

            {/* IMAGE */}
            <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-5">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md z-20 tracking-wider">
                  {product.badge}
                </span>
              )}

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* WISHLIST BUTTON */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product.id, e);
                }}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
              >
                {wishlist.has(product.id) ? (
                  <HeartSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartOutline className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {/* QUICK ADD */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(product, e);
                  }}
                  className="w-full text-white font-medium text-sm tracking-wider hover:underline"
                >
                  QUICK ADD +
                </button>
              </div>
            </div>

            {/* INFO */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500 tracking-wider">{product.designer}</p>
              <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
              <p className="text-lg font-medium">₦{product.price.toLocaleString()}</p>
            </div>

          </Link>
        </motion.article>
      ))}
    </div>

    {/* VIEW ALL BUTTON */}
    <div className="text-center mt-16">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/category?category=New%20Arrivals"
          className="inline-block border border-black px-12 py-4 font-medium tracking-wider hover:bg-black hover:text-white transition"
        >
          VIEW ALL NEW ARRIVALS
        </Link>
      </motion.div>
    </div>

  </div>
</section>


      {/* EDITORIAL LOOKBOOK */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">The Edit</h2>
            <p className="text-gray-600 text-lg">Seasonal stories, styled</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {looks.map((look, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-[4/5] mb-6">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>
                <h3 className="text-xl font-medium mb-2">{look.title}</h3>
                <p className="text-gray-600">{look.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM / UGC SECTION */}
      <section className="py-24 px-6 md:px-12 bg-stone-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              @ANNIEPATRICIA
            </h2>
            <p className="text-gray-600">Tag us in your looks</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
            {instagramPosts.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square overflow-hidden group cursor-pointer"
              >
                <img
                  src={post}
                  alt="Instagram post"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              </motion.div>
            ))}
          </div>

          <motion.a
            href="https://instagram.com/anniepatricia"
            target="_blank"
            rel="noopener"
            whileHover={{ scale: 1.05 }}
            className="inline-block mt-10 text-sm tracking-widest hover:underline"
          >
            FOLLOW ON INSTAGRAM
          </motion.a>
        </div>
      </section>

      {/* NEWSLETTER SIGNUP */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <SparklesIcon className="w-10 h-10 mx-auto mb-6 text-yellow-400" />
            <h3 className="text-2xl md:text-3xl font-light mb-4">Join the Inner Circle</h3>
            <p className="text-gray-300 mb-8">First access to drops, private sales, and styling notes.</p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/30 rounded-md placeholder-gray-400 focus:outline-none focus:border-white transition"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white text-black font-medium rounded-md hover:bg-gray-100 transition"
              >
                SUBSCRIBE
              </motion.button>
            </form>
            <p className="text-xs text-gray-400 mt-4">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* FLOATING CART & WISHLIST */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-16 right-8 flex flex-col gap-3 z-60"
      >
        <Link
          to="/cart"
          className="relative p-4 bg-black text-white rounded-full shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingBagIcon className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>

        <Link
          to="/saved"
          className="relative p-4 bg-white border border-gray-300 rounded-full shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {wishlist.size > 0 ? (
            <HeartSolid className="w-6 h-6 text-red-500" />
          ) : (
            <HeartOutline className="w-6 h-6 text-gray-800" />
          )}
          {wishlist.size > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
              {wishlist.size}
            </span>
          )}
        </Link>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Home;