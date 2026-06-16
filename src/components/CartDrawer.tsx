import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, Ticket, CheckCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Coupon } from '../types';

interface CartDrawerProps {
  onClose: () => void;
  onCheckout: (appliedCoupon: Coupon | null, discountAmt: number) => void;
  darkMode: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onClose, onCheckout, darkMode }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, applyCoupon } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const formatNaira = (num: number) => {
    return '₦' + num.toLocaleString('en-NG');
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const validated = applyCoupon(couponCode.trim());
    const sub = getSubtotal();

    if (validated) {
      if (sub < validated.minPurchase) {
        setCouponMessage({
          text: `Minimum purchase of ${formatNaira(validated.minPurchase)} required for this coupon.`,
          isError: true
        });
        setActiveCoupon(null);
      } else {
        setActiveCoupon(validated);
        setCouponMessage({
          text: `✓ Coupon "${validated.code}" applied successfully!`,
          isError: false
        });
      }
    } else {
      setCouponMessage({
        text: "Invalid or expired coupon code.",
        isError: true
      });
      setActiveCoupon(null);
    }
  };

  // Calculate discount
  const getDiscountAmount = () => {
    if (!activeCoupon) return 0;
    const sub = getSubtotal();
    if (activeCoupon.discountType === 'percentage') {
      return (sub * activeCoupon.value) / 100;
    } else {
      return activeCoupon.value;
    }
  };

  const finalTotal = Math.max(0, getSubtotal() - getDiscountAmount());

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onClose} />

      {/* Slide out Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md flex flex-col h-full shadow-2xl overflow-hidden border-l ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-850'
        }`}>
          {/* Header */}
          <div className="p-6 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-950/20 to-transparent">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                Shopping Cart ({cart.reduce((tot, i) => tot + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full border transition-all hover:bg-slate-500/10 ${
                darkMode ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-gray-150 text-slate-500 hover:text-slate-800'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Contents list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className={`flex gap-3 p-3 rounded-2xl border transition-colors ${
                    darkMode ? 'bg-slate-950/55 border-slate-800 hover:border-slate-750' : 'bg-slate-50 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-950 border border-slate-800/30">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Body details */}
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-black truncate leading-none mb-1 max-w-[210px]" title={item.product.name}>
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                      {item.product.subcategory}
                    </span>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xs font-black text-amber-500">
                        {formatNaira(item.product.price)}
                      </span>
                      {/* Quantity Selectors */}
                      <div className="flex items-center border dark:border-slate-800 border-gray-200 rounded-lg overflow-hidden bg-white dark:bg-slate-900 scale-90 origin-right">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 dark:hover:bg-slate-800 hover:bg-slate-100 text-slate-500 dark:text-slate-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-black dark:text-white text-blue-950 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 dark:hover:bg-slate-800 hover:bg-slate-100 text-slate-500 dark:text-slate-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <div className="flex flex-col justify-between items-end shrink-0">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center text-slate-500 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-950/20 dark:bg-slate-800/20 flex items-center justify-center p-3 text-slate-400">
                  🛒
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider dark:text-slate-300 text-slate-700">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Add some premium items from our store catalog to proceed.</p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gradient-to-tr from-amber-500 to-amber-400 text-blue-950 font-black rounded-lg text-xs leading-none active:scale-95 transition-transform"
                >
                  Browse Storefront
                </button>
              </div>
            )}
          </div>

          {/* Footer Area with subtotal & coupons applied */}
          {cart.length > 0 && (
            <div className={`p-6 border-t dark:border-slate-800 border-slate-100 space-y-4 bg-gradient-to-t from-blue-950/5 to-transparent`}>
              
              {/* Coupon Form input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-450 uppercase pb-0.5">
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5 text-amber-500" />
                    Have a promo coupon?
                  </span>
                  <span className="text-[10px] text-amber-500 lowercase">e.g. BLESSED10</span>
                </div>
                <div className={`flex rounded-xl overflow-hidden border px-3 py-1 transition-all focus-within:ring-2 focus-within:ring-amber-500 bg-white dark:bg-slate-950 ${
                  darkMode ? 'border-slate-850' : 'border-gray-200'
                }`}>
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-transparent border-none outline-none text-xs text-slate-850 dark:text-white py-1 focus:ring-0 font-bold"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black rounded-lg text-[10px] leading-none uppercase tracking-wider shadow-sm hover:brightness-105 active:scale-95"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[10px] font-bold ${couponMessage.isError ? 'text-rose-500' : 'text-emerald-500 animate-pulse'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </form>

              {/* Ledger Summary */}
              <div className="space-y-2 text-xs border-t dark:border-slate-800 border-slate-100 pt-3">
                <div className="flex justify-between font-semibold dark:text-slate-400 text-slate-500">
                  <span>Cart Items Subtotal:</span>
                  <span className="font-mono">{formatNaira(getSubtotal())}</span>
                </div>
                
                {activeCoupon && (
                  <div className="flex justify-between text-emerald-500 font-extrabold items-center">
                    <span>Discount Coupon ({activeCoupon.code}):</span>
                    <span className="font-mono">- {formatNaira(getDiscountAmount())}</span>
                  </div>
                )}

                <div className="flex justify-between dark:text-slate-400 text-slate-500">
                  <span>Shipping Delivery:</span>
                  <span className="text-emerald-500 font-bold font-mono">FREE SHIPPING</span>
                </div>

                <div className="flex justify-between items-end border-t dark:border-slate-800 border-slate-100 pt-3 text-blue-950 dark:text-white">
                  <span className="text-sm font-black uppercase">Computed Net Total:</span>
                  <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300 font-mono tracking-tight leading-none">
                    {formatNaira(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Action checkout buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onCheckout(activeCoupon, getDiscountAmount())}
                  className="w-full py-3.5 bg-gradient-to-tr from-amber-500 to-amber-300 hover:from-amber-600 hover:to-amber-500 text-blue-950 font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/10 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>Secure Pay & Checkout</span>
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full py-2.5 hover:bg-slate-300/10 text-slate-400 hover:text-rose-500 rounded-xl transition-colors font-bold text-xs"
                >
                  Clear All Cart Items
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
