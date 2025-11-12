// src/components/CategoryModal.tsx
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { allProducts } from "../components/data/products";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  label: string;
}

export default function CategoryModal({ isOpen, onClose, category, label }: CategoryModalProps) {
  const products = category === "NEW"
    ? allProducts.filter(p => p.badge === "NEW")
    : allProducts.filter(p => p.category === category);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-medium tracking-wider">
                    {label}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <motion.article
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ staggerChildren: 0.05 }}
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
                          </div>
                          <p className="text-xs text-gray-500">{product.designer}</p>
                          <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                          <p className="font-medium">₦{product.price.toLocaleString()}</p>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">No products found.</p>
                )}

                {/* View All */}
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