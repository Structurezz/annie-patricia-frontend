// src/components/CategoryModal.tsx
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Fragment, useCallback } from "react";
import { Link } from "react-router-dom";
import { allProducts } from "../components/data/products";

// Redux
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  label: string;
}

export default function CategoryModal({ isOpen, onClose, category, label }: CategoryModalProps) {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.items);

  const products = category === "NEW"
    ? allProducts.filter(p => p.badge === "NEW")
    : allProducts.filter(p => p.category === category);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-medium tracking-wider">{label}</Dialog.Title>
                  <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {products.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {products.map((product) => {
  const toggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isCurrentlyInWishlist = wishlist.includes(product.id);
    if (isCurrentlyInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product.id));
    }
  }, [dispatch, product.id, wishlist]);

  const isInWishlist = wishlist.includes(product.id);

  return (
    <motion.article
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
    >
      <Link to={`/product/${product.id}`} onClick={onClose}>
        <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3 rounded-lg">

          {product.badge && (
            <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2.5 py-1 rounded-md z-10">
              {product.badge}
            </span>
          )}

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Heart Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-all duration-200"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isInWishlist ? (
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.5l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500">{product.designer}</p>
        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
        <p className="font-medium">₦{product.price.toLocaleString()}</p>
      </Link>
    </motion.article>
  );
})}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">No products found.</p>
                )}

                <div className="mt-8 text-center">
                  <Link
                    to={`/category?category=${encodeURIComponent(category)}`}
                    onClick={onClose}
                    className="inline-block px-8 py-3 border border-black rounded-md font-medium hover:bg-black hover:text-white transition"
                  >
                    VIEW ALL IN {label}
                  </Link>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}