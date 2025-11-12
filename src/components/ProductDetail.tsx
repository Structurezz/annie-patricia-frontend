// src/components/ProductDetail.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, Link , useLocation } from "react-router-dom";
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { allProducts } from "../components/data/products";
import { toast } from "react-hot-toast";

// Redux
import { useAppDispatch } from "../hooks/redux";
import { addToCart } from "../store/cartSlice";

// Layout
import Topbar from "./TopBar";
import Footer from "./Footer";

// ──────────────────────────────────────
// Types & Size Chart
// ──────────────────────────────────────
interface SizeOption {
  label: string;
  available: boolean;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const sizeChart: Record<string, SizeOption[]> = {
  Bubus: [
    { label: "S", available: true },
    { label: "M", available: true },
    { label: "L", available: false },
    { label: "XL", available: true },
  ],
  Kaftan: [{ label: "One Size", available: true }],
  Dresses: [
    { label: "UK 6", available: true },
    { label: "UK 8", available: true },
    { label: "UK 10", available: false },
    { label: "UK 12", available: true },
    { label: "UK 14", available: true },
  ],
  Shoes: [
    { label: "UK 3", available: true },
    { label: "UK 4", available: true },
    { label: "UK 5", available: false },
    { label: "UK 6", available: true },
    { label: "UK 7", available: true },
    { label: "UK 8", available: true },
  ],
  default: [
    { label: "XS", available: true },
    { label: "S", available: true },
    { label: "M", available: true },
    { label: "L", available: false },
    { label: "XL", available: true },
    { label: "XXL", available: true },
  ],
};

const mockReviews: Review[] = [
  {
    id: 1,
    name: "Chioma Okeke",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely stunning! The fabric is premium and the fit is perfect.",
    verified: true,
  },
  {
    id: 2,
    name: "Aisha Mohammed",
    rating: 4,
    date: "1 week ago",
    comment: "Beautiful design, but runs slightly large. Order one size down.",
    verified: true,
  },
  {
    id: 3,
    name: "Tolu Adebayo",
    rating: 5,
    date: "2 weeks ago",
    comment: "Worth every kobo. The embroidery is exquisite. Fast delivery!",
    verified: true,
  },
];



export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  // Load product
  useEffect(() => {
    const found = allProducts.find((p) => p.id === Number(id));
    if (found) {
      setProduct(found);
      const sizes = sizeChart[found.category] || sizeChart.default;
      const available = sizes.find((s) => s.available);
      if (available) setSelectedSize(available.label);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────
  // ADD TO CART – MATCHES SHOP.TSX
  // ──────────────────────────────────────
  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!product.inStock) {
      toast.error("This item is out of stock");
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        designer: product.designer,
        price: product.price,
        image: product.image,
        quantity,
        size: selectedSize,
      })
    );

    toast.success(`${product.name} (${selectedSize}) ×${quantity} added to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  const sizes = sizeChart[product.category] || sizeChart.default;

  const galleryImages = [
    product.image,
    product.image.replace("600x800", "601x800"),
    product.image.replace("600x800", "602x800"),
    product.image.replace("600x800", "603x800"),
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Topbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center space-x-1 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
            <Link to="/" className="text-gray-500 hover:text-black">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to={`/category`} className="text-gray-500 hover:text-black">{product.category}</Link>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section – Mobile-first */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:gap-12">
          {/* ────── Image Gallery ────── */}
          <div className="flex-1 space-y-3">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              <img
                src={galleryImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {product.badge && (
                <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 z-10">
                  {product.badge}
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                  <span className="text-sm font-medium">Sold Out</span>
                </div>
              )}
              <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-black text-black" : "text-gray-700"}`}
                />
              </button>
            </div>

            {/* Thumbnails – hidden on mobile, visible on md+ */}
            <div className="hidden md:grid md:grid-cols-4 gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? "border-black" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ────── Product Info ────── */}
          <div className="mt-6 lg:mt-0 lg:flex-1 space-y-5">
            <div>
              <p className="text-xs text-gray-500 tracking-wider uppercase">{product.designer}</p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium mt-1 line-clamp-2">
                {product.name}
              </h1>
              <p className="text-lg sm:text-xl font-medium mt-2">
                ₦{product.price.toLocaleString()}
              </p>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Size</label>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs sm:text-sm underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => size.available && setSelectedSize(size.label)}
                    disabled={!size.available || !product.inStock}
                    className={`py-2 px-2 sm:px-3 rounded-md border text-xs sm:text-sm font-medium transition ${
                      selectedSize === size.label
                        ? "bg-black text-white border-black"
                        : size.available
                        ? "border-gray-300 hover:border-black"
                        : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-3 items-center">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50"
                  disabled={!product.inStock}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3 sm:px-4 font-medium min-w-[2.5rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50"
                  disabled={!product.inStock}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {product.inStock ? (
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`flex-1 py-3 px-4 border text-sm font-medium transition rounded-md ${
                    selectedSize
                      ? "border-black hover:bg-black hover:text-white"
                      : "border-gray-300 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {selectedSize ? "ADD TO CART" : "SELECT SIZE"}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-400 border border-gray-300 text-sm font-medium rounded-md cursor-not-allowed"
                >
                  OUT OF STOCK
                </button>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 pt-5 border-t text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>7-Day Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>100% Authentic</span>
              </div>
            </div>
          </div>
        </div>

        {/* ────── Reviews ────── */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-lg sm:text-xl font-medium mb-5">Customer Reviews</h2>
          <div className="space-y-5">
            {mockReviews.map((review) => (
              <div key={review.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <div className="font-medium">{review.name}</div>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs sm:text-sm text-gray-500 ml-1">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm sm:text-base text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
          <button className="mt-5 text-xs sm:text-sm underline">Read all 124 reviews</button>
        </div>

        {/* ────── Related Products ────── */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-lg sm:text-xl font-medium mb-5">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {allProducts
              .filter((p: any) => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((related: any) => (
                <Link key={related.id} to={`/product/${related.id}`} className="group">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-medium truncate">{related.name}</p>
                  <p className="text-xs text-gray-500">{related.designer}</p>
                  <p className="text-xs sm:text-sm font-medium">
                    ₦{related.price.toLocaleString()}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Size Guide</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-2xl">×</button>
            </div>
            <p className="text-sm text-gray-600">Please refer to our size chart before ordering.</p>
          </div>
        </div>
      )}
    </div>
  );
}