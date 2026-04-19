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
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart, removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
// ---------------------------

// Import real products
import { allProducts, FLOATING_CATEGORIES } from "../components/data/products";

// Filter NEW & BESTSELLERS for home
const featuredProducts = allProducts
  .filter((p) => p.badge === "NEW" || p.badge === "BESTSELLER")
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

function getSafeImage(img: string) {
  if (!img || typeof img !== "string" || img.trim() === "") {
    return "/images/placeholder-book.png";
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
  const cartItems = useAppSelector((state) => state.cart.items);
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
    setWishlist((prev) => {
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
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Pass live counts to Topbar */}
      <Topbar wishlistCount={wishlist.size} cartCount={cartCount} />

      {/* ── HERO VIDEO SECTION ── */}
      <section className="relative h-screen overflow-hidden">
        <motion.video
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          src="/hero_vid.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay with warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand/30 via-transparent to-brand/30" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 text-white z-10">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="text-gold text-xs md:text-sm tracking-[0.4em] mb-6 font-inter uppercase"
          >
            Nigerian Luxury Fashion
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
            className="font-playfair text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-6 leading-none"
          >
            WEAR YOUR
            <br />
            <span className="italic text-gold">HERITAGE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="font-inter text-base md:text-lg max-w-md mb-12 text-cream/80 tracking-wider"
          >
            Luxury Nigerian Fashion
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.a
              href="/category"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="border border-gold text-gold px-10 py-4 font-inter text-xs tracking-[0.3em] hover:bg-gold hover:text-brand transition-all duration-300"
            >
              SHOP WOMEN
            </motion.a>
            <motion.a
              href="/category"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="border border-cream/40 text-cream px-10 py-4 font-inter text-xs tracking-[0.3em] hover:border-gold hover:text-gold transition-all duration-300"
            >
              SHOP MEN
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/70 z-10"
        >
          <ArrowDownIcon className="w-5 h-5" />
        </motion.div>
      </section>

      {/* ── FLOATING CATEGORY PILLS ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className={`fixed top-32 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
          scrolled ? "top-20 bg-brand/95 backdrop-blur-lg shadow-lg shadow-black/20 border border-gold/20" : "top-32 bg-brand/80 backdrop-blur-md"
        } px-8 py-3 hidden md:flex gap-8`}
      >
        {FLOATING_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setSelectedCat({ label: cat.label, value: cat.value });
              setModalOpen(true);
            }}
            className="text-xs font-inter font-medium tracking-[0.2em] text-cream/70 hover:text-gold transition-colors gold-underline"
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

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-cream">
        <div className="max-w-7xl mx-auto">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-gold text-xs tracking-[0.4em] mb-4 font-inter uppercase">Curated Collection</p>
            <h2 className="font-playfair text-5xl md:text-6xl font-light text-text-dark mb-4">
              New Arrivals
            </h2>
            <div className="w-16 h-px bg-gold mx-auto mt-6" />
          </motion.div>

          {/* Product grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 lg:gap-12">
            {featuredProducts.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                className="group"
              >
                <Link to={`/product/${product.id}`} className="block">
                  {/* Image container */}
                  <div className="relative overflow-hidden bg-warm-white aspect-[3/4] mb-5">
                    {product.badge && (
                      <span className="absolute top-4 left-4 bg-brand text-gold text-xs font-inter font-medium px-3 py-1.5 z-20 tracking-[0.15em]">
                        {product.badge}
                      </span>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-700"
                      loading="lazy"
                    />

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-brand/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <p className="font-playfair text-lg text-cream mb-1">{product.name}</p>
                      <p className="text-gold font-inter text-sm mb-4">₦{product.price.toLocaleString()}</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product, e);
                        }}
                        className="w-full border border-gold text-gold text-xs tracking-[0.2em] py-2.5 hover:bg-gold hover:text-brand transition-all duration-300 font-inter"
                      >
                        ADD TO BAG
                      </button>
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id, e);
                      }}
                      className="absolute top-4 right-4 p-2 bg-brand/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand z-30"
                    >
                      {wishlist.has(product.id) ? (
                        <HeartSolid className="w-4 h-4 text-gold" />
                      ) : (
                        <HeartOutline className="w-4 h-4 text-cream" />
                      )}
                    </button>
                  </div>

                  {/* Product info */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-inter text-text-muted tracking-[0.15em] uppercase">{product.designer}</p>
                    <h3 className="font-playfair text-base text-text-dark line-clamp-1">{product.name}</h3>
                    <p className="text-gold font-inter text-sm font-medium">₦{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* View all */}
          <div className="text-center mt-16">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/category?category=New%20Arrivals"
                className="inline-block border border-brand text-brand px-14 py-4 font-inter text-xs tracking-[0.3em] hover:bg-brand hover:text-cream transition-all duration-300"
              >
                VIEW ALL NEW ARRIVALS
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80"
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative gold border offset */}
              <div className="absolute -bottom-4 -right-4 w-3/4 h-3/4 border border-gold/40 -z-10" />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Gold accent line */}
              <div className="w-12 h-0.5 bg-gold" />
              <p className="text-gold text-xs tracking-[0.4em] font-inter uppercase">Our Heritage</p>
              <h2 className="font-playfair text-4xl md:text-5xl text-text-dark leading-tight">
                Where Lagos Meets
                <br />
                <span className="italic">Luxury</span>
              </h2>
              <p className="font-inter text-text-muted leading-relaxed">
                Annie Patricia was born from the intersection of Nigerian heritage and contemporary luxury.
                Every piece tells a story — of Aso-oke craftsmanship, of Lagos streets at golden hour,
                of a culture that dresses to celebrate.
              </p>
              <p className="font-inter text-text-muted leading-relaxed">
                We work with master artisans across Nigeria to bring you garments that honor tradition
                while speaking fluently to the modern wardrobe. This is not just fashion. This is identity.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                <Link
                  to="/about"
                  className="inline-block border border-gold text-gold px-10 py-3 font-inter text-xs tracking-[0.3em] hover:bg-gold hover:text-brand transition-all duration-300"
                >
                  READ OUR STORY
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL LOOKBOOK ── */}
      <section className="py-24 px-6 md:px-12 bg-brand">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold text-xs tracking-[0.4em] mb-4 font-inter uppercase">Editorial</p>
            <h2 className="font-playfair text-5xl md:text-6xl font-light text-cream">The Edit</h2>
            <div className="w-16 h-px bg-gold mx-auto mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {looks.map((look, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-[4/5] mb-5">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-playfair text-xl text-cream mb-1">{look.title}</h3>
                    <p className="font-inter text-xs text-gold/80 tracking-wider">{look.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM / UGC ── */}
      <section className="py-24 px-6 md:px-12 bg-cream">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-gold text-xs tracking-[0.4em] mb-3 font-inter uppercase">Community</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-light text-text-dark">
              @ANNIEPATRICIA
            </h2>
            <p className="font-inter text-text-muted mt-3 text-sm tracking-wider">Tag us in your looks</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
            {instagramPosts.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="aspect-square overflow-hidden group cursor-pointer relative"
              >
                <img
                  src={post}
                  alt="Instagram post"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                />
                <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/30 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>

          <motion.a
            href="https://instagram.com/anniepatricia"
            target="_blank"
            rel="noopener"
            whileHover={{ scale: 1.02 }}
            className="inline-block mt-10 text-xs font-inter tracking-[0.3em] text-text-muted hover:text-gold transition-colors border-b border-text-muted hover:border-gold pb-0.5"
          >
            FOLLOW ON INSTAGRAM
          </motion.a>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-24 px-6 bg-brand">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-px bg-gold mx-auto mb-8" />
            <p className="text-gold text-xs tracking-[0.4em] mb-4 font-inter uppercase">Inner Circle</p>
            <h3 className="font-playfair text-3xl md:text-4xl text-cream font-light mb-4">
              Join the Conversation
            </h3>
            <p className="font-inter text-cream/60 mb-10 tracking-wider text-sm">
              First access to drops, private sales, and styling notes from Lagos.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border border-gold/40"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-transparent text-cream placeholder-cream/30 focus:outline-none font-inter text-sm border-r border-gold/40"
              />
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="px-8 py-4 bg-gold text-brand font-inter text-xs tracking-[0.2em] font-medium hover:bg-gold-light transition-colors whitespace-nowrap"
              >
                SUBSCRIBE
              </motion.button>
            </form>
            <p className="text-xs font-inter text-cream/30 mt-4 tracking-wider">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* ── FLOATING CART & WISHLIST ── */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-16 right-6 flex flex-col gap-3 z-50"
      >
        <Link
          to="/cart"
          className="relative p-4 bg-brand border border-gold/40 text-gold rounded-none shadow-2xl hover:bg-gold hover:text-brand transition-all duration-300"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-brand text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        <Link
          to="/saved"
          className="relative p-4 bg-brand border border-gold/40 text-gold rounded-none shadow-2xl hover:bg-gold hover:text-brand transition-all duration-300"
        >
          {wishlist.size > 0 ? (
            <HeartSolid className="w-5 h-5" />
          ) : (
            <HeartOutline className="w-5 h-5" />
          )}
          {wishlist.size > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-brand text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
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
