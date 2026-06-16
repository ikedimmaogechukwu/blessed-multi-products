import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, ShoppingCart, Heart, Phone, X, Share2, Clipboard, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  darkMode: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, darkMode }) => {
  const { addToCart, toggleWishlist, wishlist, submitReview, user } = useApp();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const isInWishlist = wishlist.includes(product.id);
  const outOfStock = product.stockQuantity <= 0;

  const formatNaira = (num: number) => {
    return '₦' + num.toLocaleString('en-NG');
  };

  const getWhatsAppLink = () => {
    const textMsg = `Hello Blessed Multi-Products, I am interested in purchasing ${product.name}. Please provide more details.`;
    return `https://wa.me/2349053656282?text=${encodeURIComponent(textMsg)}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#product-${product.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;

    setSubmittingReview(true);
    try {
      await submitReview(product.id, reviewRating, reviewContent.trim());
      setReviewContent('');
      setReviewRating(5);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    onClose();
    // Click cart icon to open drawer
    const cartBtn = document.getElementById('navbar-cart-btn');
    if (cartBtn) cartBtn.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className={`relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col md:flex-row max-h-[90vh] ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-slate-800'
      } z-10 transition-all duration-300`}>
        
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full border transition-transform hover:rotate-90 ${
            darkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 border-gray-250'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images Swapper slide */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between border-r dark:border-slate-800 border-slate-100">
          <div className="relative w-full h-[280px] sm:h-[350px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src={product.images[activeImgIdx]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            
            {/* Out of Stock banner overlay on details */}
            {outOfStock && (
              <div className="absolute inset-x-0 bottom-4 bg-rose-600/90 py-2.5 text-center text-xs tracking-widest font-black uppercase flex items-center justify-center gap-1.5 shadow-lg">
                <ShieldAlert className="w-4 h-4 animate-bounce" />
                <span>Sold Out of Stock</span>
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                    activeImgIdx === idx ? 'border-amber-500 shadow-md' : 'border-transparent hover:border-slate-350'
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Reviews */}
        <div className="w-full md:w-1/2 p-6 pb-8 overflow-y-auto max-h-[85vh] md:max-h-[88vh] space-y-6">
          
          {/* Header metadata */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2.5 py-1 rounded-full">
              {product.category} &gt; {product.subcategory}
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight leading-snug mt-3">
              {product.name}
            </h2>
            
            {/* Star average rating details */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-450">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-300 dark:text-slate-705'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400">
                {product.rating} / 5 Rating ({product.reviews?.length || 0} reviews)
              </span>
            </div>
          </div>

          {/* Pricing & Stock Details section */}
          <div className="flex items-center justify-between py-4 border-y dark:border-slate-800 border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-450 block">Exclusive Price:</span>
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">
                {formatNaira(product.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-450 block">Stock Availability:</span>
              <span className={`text-xs font-extrabold ${outOfStock ? 'text-rose-500' : 'text-emerald-500'}`}>
                {outOfStock ? 'Unavailable' : `${product.stockQuantity} Items Left`}
              </span>
            </div>
          </div>

          {/* Description snippet */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Product Overview:
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Main Action buttons row */}
          <div className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product, 1)}
                disabled={outOfStock}
                className={`py-3 bg-blue-900 border border-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  outOfStock
                    ? 'bg-slate-800 border-slate-850 text-slate-500 cursor-not-allowed'
                    : 'hover:bg-blue-950 active:scale-95'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>

              {/* Buy Now directly */}
              <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className={`py-3 bg-gradient-to-tr from-amber-500 to-amber-400 text-blue-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                  outOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'hover:brightness-110 active:scale-95'
                }`}
              >
                Buy Instantly Now
              </button>
            </div>

            {/* Minor Options: Wishlist & Share buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`py-2 px-4 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                  isInWishlist
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                    : darkMode ? 'border-slate-800 hover:bg-slate-850' : 'border-gray-200 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-current' : ''}`} />
                <span>{isInWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={handleShare}
                className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  copiedLink
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                    : darkMode ? 'border-slate-800 hover:bg-slate-850' : 'border-gray-200 hover:bg-slate-50'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied Link!' : 'Share Product'}</span>
              </button>
            </div>

            {/* Premium WhatsApp Button Inquiry - REQUIRED INTEGRATION */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              referrerPolicy="no-referrer"
              className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-extrabold tracking-wide border-l-4 border-emerald-400 font-sans shadow-lg transition-transform active:scale-95 text-center block"
            >
              <Phone className="w-4 h-4 fill-white/10" />
              <span>Send WhatsApp Inquiry for Order</span>
            </a>
          </div>

          <hr className={`my-4 ${darkMode ? 'border-slate-800' : 'border-gray-100'}`} />

          {/* Reviews section */}
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Customer Reviews ({product.reviews?.length || 0})</span>
              </h3>
            </div>

            {/* List Reviews */}
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-gray-150'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-blue-900 dark:text-amber-400">{rev.reviewerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                    </div>
                    {/* Stars */}
                    <div className="flex text-amber-500 scale-90 origin-left">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-805'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-slate-450 leading-relaxed font-medium`}>{rev.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-6">
                  No reviews posted for this product yet. Be the first to share your experience!
                </p>
              )}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handlePostReview} className="space-y-3 pt-3 border-t border-slate-800/50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Write a Review:
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Your Rating:</span>
                <div className="flex text-amber-450">
                  {[...Array(5)].map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setReviewRating(i + 1)}
                      className="p-0.5 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          i < reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-350 dark:text-slate-755'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className={`flex items-center rounded-xl p-2.5 border overflow-hidden ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-200'
              }`}>
                <input
                  type="text"
                  required
                  placeholder={
                    user 
                      ? "Share your honest feedback about this product..." 
                      : "Type your review here (Guests welcome!)"
                  }
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs text-slate-850 dark:text-white pb-1 focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="p-2 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all shrink-0 ml-2"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {reviewSuccess && (
                <p className="text-[10px] text-emerald-400 font-bold">
                  ✓ Success! Your product review has been submitted.
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
