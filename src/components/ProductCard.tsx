import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, ShoppingCart, Heart, Phone, Eye, ExternalLink, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onViewDetail: (p: Product) => void;
  darkMode: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail, darkMode }) => {
  const { addToCart, toggleWishlist, wishlist, settings } = useApp();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const outOfStock = product.stockQuantity <= 0;

  // Format currency in Naira style (₦)
  const formatNaira = (num: number) => {
    return '₦' + num.toLocaleString('en-NG');
  };

  // Preset WhatsApp Message
  const getWhatsAppInquiryLink = () => {
    const textMsg = `Hello Blessed Multi-Products, I am interested in purchasing ${product.name}. Please provide more details.`;
    return `https://wa.me/2349053656282?text=${encodeURIComponent(textMsg)}`;
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    // Directly trigger view detail or cart modal
    const cartBtn = document.getElementById('navbar-cart-btn');
    if (cartBtn) cartBtn.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => {
        setHovered(true);
        if (product.images.length > 1) {
          setActiveImageIdx(1);
        }
      }}
      onMouseLeave={() => {
        setHovered(false);
        setActiveImageIdx(0);
      }}
      className={`group relative rounded-2xl transition-all duration-300 flex flex-col justify-between border overflow-hidden ${
        darkMode 
          ? 'bg-slate-900 border-slate-800 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-slate-950/50' 
          : 'bg-white border-slate-100 hover:border-amber-400 hover:shadow-xl'
      }`}
    >
      <div>
        {/* Badge Indicator tags Top bar */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-blue-900 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg border border-blue-700">
              Featured
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-amber-400 text-blue-950 font-black text-[9px] uppercase tracking-wider rounded-lg border border-amber-300">
              Best Seller
            </span>
          )}
          {outOfStock ? (
            <span className="px-2 py-0.5 bg-rose-500 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-0.5 animate-pulse">
              <ShieldAlert className="w-2.5 h-2.5" />
              <span>Sold Out</span>
            </span>
          ) : product.stockQuantity <= 5 ? (
            <span className="px-2 py-0.5 bg-indigo-500 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg">
              Low Stock: {product.stockQuantity}
            </span>
          ) : null}
        </div>

        {/* Favorite Wishlist Icon Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all active:scale-90 ${
            isWishlisted 
              ? 'bg-amber-500 text-white' 
              : darkMode ? 'bg-slate-950/60 text-slate-350 hover:bg-slate-800' : 'bg-white/80 text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image Section */}
        <div className="relative w-full h-[190px] overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onViewDetail(product)}>
          <img
            src={product.images[activeImageIdx] || product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Quick-view Eye hover indicator overlay */}
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <span className="px-4 py-2 bg-blue-950/90 text-white text-xs font-bold rounded-full border border-amber-500/50 flex items-center gap-1.5 shadow-lg">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Quick View Spec
            </span>
          </div>

          {/* Multiple Image indicators bar */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeImageIdx === idx ? 'bg-amber-400 w-3' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Meta Body */}
        <div className="p-4 space-y-1.5 cursor-pointer" onClick={() => onViewDetail(product)}>
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-500/90 uppercase tracking-widest">
            <span>{product.category}</span>
            {product.brand && <span className="font-mono text-[9px] dark:text-slate-400 text-slate-500">{product.brand}</span>}
          </div>
          
          <h3 className={`text-sm font-extrabold line-clamp-1 group-hover:text-amber-500 transition-colors ${
            darkMode ? 'text-white' : 'text-slate-950'
          }`}>
            {product.name}
          </h3>

          {/* Ratings & reviews row */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-450">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              ({product.rating} / 5)
            </span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing and CTAs area */}
      <div className="px-4 pb-4.5 space-y-3">
        {/* Price Tag Row */}
        <div className="flex items-end justify-between border-t dark:border-slate-800 border-slate-100 pt-3">
          <div>
            <span className="text-[9px] uppercase tracking-wider block font-bold text-slate-400">Our Price:</span>
            <span className="text-base sm:text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-400 leading-none">
              {formatNaira(product.price)}
            </span>
          </div>
          {/* Solder out label or standard state indicator */}
          {!outOfStock && (
            <span className="text-[10px] text-green-500 font-extrabold">
              ✓ In Stock
            </span>
          )}
        </div>

        {/* Buttons Action grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Add to Cart logic */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            disabled={outOfStock}
            className={`py-2 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 px-1.5 transition-all ${
              outOfStock 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-850 dark:text-slate-600' 
                : 'bg-blue-900/10 text-blue-900 border border-blue-900/20 hover:bg-gradient-to-tr hover:from-blue-900 hover:to-indigo-800 hover:text-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-750 dark:hover:bg-slate-750'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          {/* Buy Now logic */}
          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className={`py-2 text-[11px] font-extrabold rounded-lg px-1.5 transition-all uppercase tracking-wide ${
              outOfStock 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600' 
                : 'bg-gradient-to-tr from-amber-500 to-amber-400 text-blue-950 font-black hover:brightness-110 active:scale-95'
            }`}
          >
            Buy Now
          </button>
        </div>

        {/* WhatsApp Inquiry Button - REQUIRED INTEGRATION */}
        <a
          href={getWhatsAppInquiryLink()}
          target="_blank"
          referrerPolicy="no-referrer"
          onClick={(e) => e.stopPropagation()} // Stop clicking card triggers views
          className="w-full py-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-800 hover:text-white dark:text-emerald-400 dark:hover:text-white rounded-lg border border-emerald-600/25 flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
        >
          <Phone className="w-3.5 h-3.5 fill-current" />
          <span>Inquire on WhatsApp</span>
        </a>
      </div>
    </motion.div>
  );
};
