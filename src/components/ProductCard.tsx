"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "../store/hooks";
import { addToCartServer } from "../store/cartSlice";
import type { AdaptedProduct } from "../hooks/useProducts";

const BADGE_STYLE: Record<string, string> = {
  NEW:        "bg-white text-[#0B0A09]",
  BESTSELLER: "bg-[#C9A84C] text-[#0B0A09]",
  SALE:       "bg-red-500 text-white",
};

export interface ProductCardProps {
  product: AdaptedProduct;
  variant?: "default" | "featured";
  rank?: number;
  medal?: string;
  aspectClass?: string;
  className?: string;
  animate?: boolean;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product: p,
  rank,
  medal,
  aspectClass = "aspect-[3/4]",
  className = "",
  animate = false,
  delay = 0,
}) => {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(() => {
    try {
      return (JSON.parse(localStorage.getItem("wishlist") || "[]") as number[]).includes(p._id);
    } catch {
      return false;
    }
  });

  const handleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  
    try {
      await dispatch(
        addToCartServer({
          id: p._id,
          quantity: 1,
        })
      ).unwrap();
  
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const stored: number[] = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const next = wished
      ? stored.filter((id) => id !== p._id)
      : [...stored, p.id];

    localStorage.setItem("wishlist", JSON.stringify(next));
    setWished(!wished);
  };

  const card = (
    <Link to={`/product/${p._id}`} className={`group block ${className}`}>

      {/* Image Container */}
      <div className={`relative overflow-hidden ${aspectClass} bg-[#F0EBE3]`}>

        <img
          src={p.image}                    // ← Now always has a good image from products.ts
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge - Top Left */}
        {(medal || rank != null || p.badge) && (
          <div className="absolute top-3 left-3 z-10">
            {medal ? (
              <span className="text-xl drop-shadow">{medal}</span>
            ) : rank != null ? (
              <span className="font-inter text-[9px] font-bold tracking-[0.2em] text-[#0B0A09] bg-[#C9A84C] px-2.5 py-1 block">
                #{rank}
              </span>
            ) : p.badge && BADGE_STYLE[p.badge] ? (
              <span
                className={`font-inter text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 block ${BADGE_STYLE[p.badge]}`}
              >
                {p.badge}
              </span>
            ) : null}
          </div>
        )}

        {/* Wishlist Button - Top Right */}
        <button
          onClick={handleWish}
          aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
          className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
            wished
              ? "bg-white text-red-500 scale-100 opacity-100"
              : "bg-white/0 text-white opacity-0 group-hover:opacity-100 group-hover:bg-white/20 group-hover:backdrop-blur-sm"
          }`}
        >
          <span className="text-sm leading-none">{wished ? "♥" : "♡"}</span>
        </button>

        {/* Quick Add Button */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-10">
          <button
            onClick={handleCart}
            className={`w-full py-4 font-inter text-[11px] font-semibold tracking-[0.3em] uppercase transition-colors duration-200 ${
              added
                ? "bg-[#C9A84C] text-[#0B0A09]"
                : "bg-white text-[#0B0A09] hover:bg-[#C9A84C] hover:text-[#0B0A09]"
            }`}
          >
            {added ? "✓ Added to Bag" : "Quick Add"}
          </button>
        </div>

        {/* Sold Out Overlay */}
        {!p.inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="font-inter text-xs tracking-[0.3em] uppercase text-[#7A7571]">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="h-[68px] pt-3 flex flex-col justify-between overflow-hidden">
        <div className="overflow-hidden">
          <p className="font-inter text-[11px] text-[#0B0A09] font-medium truncate leading-none tracking-wide">
            {p.name}
          </p>
          <p className="font-inter text-[10px] text-[#A89880] truncate mt-1 leading-none tracking-[0.12em]">
            {p.designer || "\u00A0"}
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <p className="font-inter text-[13px] font-semibold text-[#0B0A09] tracking-wide">
            ₦{p.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Gold Hover Underline */}
      <div className="h-px bg-[#E8E2DA] relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-0 bg-[#C9A84C] group-hover:w-full transition-all duration-500 ease-out" />
      </div>
    </Link>
  );

  if (!animate) return card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {card}
    </motion.div>
  );
};

export default ProductCard;