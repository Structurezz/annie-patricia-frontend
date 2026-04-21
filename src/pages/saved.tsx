// src/pages/Saved.tsx
"use client";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { removeFromWishlist } from "../store/wishlistSlice";
import { useProducts } from "../hooks/useProducts";
import Topbar from "../components/TopBar";
import Footer from "../components/Footer";

export default function Saved() {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((state) => state.wishlist.items);
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const { products: allProducts } = useProducts();

  // Match IDs to real products
  const wishlistProducts = wishlistIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean);

  const handleRemove = (id: number) => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Topbar */}
      <Topbar wishlistCount={wishlistIds.length} cartCount={cartCount} />

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12"> {/* pt-24 = space for fixed Topbar */}
        <h1 className="text-3xl md:text-4xl font-light mb-8 text-center tracking-tight">
          Your Saved Items
        </h1>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No items saved yet.</p>
            <a
              href="/category"
              className="mt-6 inline-block text-black font-medium hover:underline"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {wishlistProducts.map((product) => (
              <div
                key={product!.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden group relative hover:shadow-md transition-shadow"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(product!.id)}
                  className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  aria-label="Remove from wishlist"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Product Image */}
                <a href={`/product/${product!.id}`} className="block">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={product!.image}
                      alt={product!.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </a>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 tracking-wider">{product!.designer}</p>
                  <h3 className="font-medium text-sm line-clamp-2 mt-1">{product!.name}</h3>
                  <p className="text-lg font-medium mt-2">₦{product!.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}