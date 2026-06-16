import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, CreditCard, Landmark, Truck, MessageSquare, Check, Sparkles, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Coupon, OrderItem, Order } from '../types';

interface CheckoutModalProps {
  onClose: () => void;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  darkMode: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  onClose,
  appliedCoupon,
  discountAmount,
  darkMode
}) => {
  const { cart, userProfile, submitOrder, clearCart, settings } = useApp();

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping details, 2: Payment processing, 3: Success Invoice
  const [paymentMethod, setPaymentMethod] = useState<'Paystack' | 'Flutterwave' | 'Bank Transfer'>('Paystack');
  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Shipping Forms Form details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Payment Mock Form Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [transferSenderName, setTransferSenderName] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Pre-populate if user logged in
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setEmail(userProfile.email || '');
      setPhone(userProfile.phone || '');
      if (userProfile.savedAddresses && userProfile.savedAddresses.length > 0) {
        setAddress(userProfile.savedAddresses[0]);
      }
    }
  }, [userProfile]);

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const finalTotal = Math.max(0, getSubtotal() - discountAmount);

  const formatNaira = (num: number) => {
    return '₦' + num.toLocaleString('en-NG');
  };

  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address) return;
    setStep(2);
  };

  // Handle secure payment verification and order submission
  const handleProcessPayment = async () => {
    setLoading(true);
    
    try {
      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
      }));

      let paymentStatus = 'pending_confirmation';
      let reference = '';

      if (paymentMethod === 'Bank Transfer') {
        const senderSlug = transferSenderName.trim().toUpperCase().replace(/\s+/g, '-');
        reference = `BANK-${senderSlug}-${Date.now().toString().slice(-6)}`;
      } else {
        // For card payments (Paystack or Flutterwave), generate a unique payment reference
        const randomRef = Math.floor(1000000 + Math.random() * 9000000);
        reference = `BLESSED-SANDBOX-${randomRef}`;

        // Call the backend payment verification API. The backend securely uses the Secret Key.
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reference,
            paymentMethod,
            amount: finalTotal,
            orderId: `order-pending-${Date.now().toString().slice(-4)}`
          })
        });

        if (!verifyRes.ok) {
          const errData = await verifyRes.json().catch(() => ({}));
          throw new Error(errData.message || `Server returned error status ${verifyRes.status}`);
        }

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          paymentStatus = 'paid';
        } else {
          throw new Error(verifyData.message || 'The payment gateway could not verify this transaction.');
        }
      }

      const orderPayload: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: userProfile?.id || 'guest',
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        paymentMethod,
        paymentStatus,
        orderStatus: 'Pending',
        items: orderItems,
        totalAmount: finalTotal,
        discountAmount,
        couponUsed: appliedCoupon?.code || undefined
      };

      const orderId = await submitOrder(orderPayload);
      setCreatedOrderId(orderId);
      setLoading(false);
      setStep(3);
      
      // Clear global shopping cart
      clearCart();
    } catch (err: any) {
      console.error("Order payment verification failed:", err);
      setLoading(false);
      alert(err.message || "Could not complete secure checkout payment. Please try again.");
    }
  };

  // Preset WhatsApp Message link after success order placement
  const getWhatsAppOrderLink = () => {
    const textMsg = `Hello Blessed Multi-Products, I just placed an order (Order ID: ${createdOrderId}) with total amount ${formatNaira(finalTotal)} via ${paymentMethod}. Please verify packing and delivery.`;
    return `https://wa.me/2349053656282?text=${encodeURIComponent(textMsg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={step < 3 ? onClose : undefined} />

      {/* Modal Card */}
      <div className={`relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[92vh] ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-slate-800'
      } z-10 duration-350 transition-all`}>
        
        {/* Header (Hide close on final success slide) */}
        <div className="px-6 py-5 border-b dark:border-slate-800 border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-950/15 to-transparent">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              {step === 1 && '1. Shipping & Customer Details'}
              {step === 2 && '2. Choose Secure Payment Gateway'}
              {step === 3 && '🎉 Checkout Completed successfully!'}
            </h2>
          </div>
          {step < 3 && (
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full hover:bg-slate-500/10 ${
                darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Box */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          
          {/* STEP 1: SHIPPING DETAIL FORM */}
          {step === 1 && (
            <form onSubmit={handleGoToPayment} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wide font-extrabold text-slate-450 block">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Ogechukwu Blessing"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wide font-extrabold text-slate-450 block">Primary Email Address:</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g., oge@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wide font-extrabold text-slate-450 block">Mobile Phone Number (WhatsApp Enabled):</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., 09053656282"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wide font-extrabold text-slate-450 block">Shipping Delivery Address:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide detailed shop number, apartment name, street and city for delivery. E.g., Suite 12, Alaba Int'l Market, Ojo, Lagos."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200'
                  }`}
                />
              </div>

              {/* Order Ledger Recap inside shipping */}
              <div className={`p-4 rounded-2xl border ${
                darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-gray-100'
              }`}>
                <h4 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-450">Order Summary:</h4>
                <div className="divide-y dark:divide-slate-850 divide-gray-150 space-y-2 text-xs">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between py-1.5 font-medium">
                      <span className="truncate max-w-[350px]">{item.product.name} (x{item.quantity})</span>
                      <span className="font-mono text-slate-500">{formatNaira(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500 font-semibold">Subtotal:</span>
                    <span className="font-mono">{formatNaira(getSubtotal())}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between pt-1.5 text-emerald-500 font-bold">
                      <span>Applied Code ({appliedCoupon?.code}):</span>
                      <span className="font-mono">- {formatNaira(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-sm font-black text-amber-500">
                    <span>Payable Net Total:</span>
                    <span className="font-mono">{formatNaira(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Submit triggers Step 2 */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black uppercase tracking-wider rounded-xl hover:brightness-115 transition-all text-xs flex items-center justify-center gap-1"
              >
                <span>Continue to Secure Payment</span>
                <Landmark className="w-4 h-4 ml-1" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT CHANNELS SELECTOR */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Payment Methods option buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Paystack')}
                  className={`p-4 rounded-2xl border text-center font-bold tracking-wide transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'Paystack'
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                      : darkMode ? 'border-slate-800 bg-slate-950 hover:bg-slate-850' : 'border-gray-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-indigo-400" />
                  <span className="text-xs uppercase">Paystack</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Flutterwave')}
                  className={`p-4 rounded-2xl border text-center font-bold tracking-wide transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'Flutterwave'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : darkMode ? 'border-slate-800 bg-slate-950 hover:bg-slate-850' : 'border-gray-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-amber-450" />
                  <span className="text-xs uppercase">Flutterwave</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Bank Transfer')}
                  className={`p-4 rounded-2xl border text-center font-bold tracking-wide transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'Bank Transfer'
                      ? 'border-slate-400 bg-slate-400/10 text-slate-350'
                      : darkMode ? 'border-slate-800 bg-slate-950 hover:bg-slate-850' : 'border-gray-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <Landmark className="w-6 h-6 text-slate-400" />
                  <span className="text-xs uppercase">Bank Transfer</span>
                </button>
              </div>

              {/* CARD SIMULATION FOR PAYSTACK & FLUTTERWAVE */}
              {(paymentMethod === 'Paystack' || paymentMethod === 'Flutterwave') && (
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-gray-150'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Secure {paymentMethod} API Frame
                    </span>
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 font-mono text-[9px] uppercase rounded">Sandbox Test Mode</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-400">ATM Credit/Debit Card Number (Mock):</label>
                      <input
                        type="text"
                        placeholder="4512 •••• •••• 1234"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength={19}
                        className={`w-full px-3.5 py-3 rounded-xl border text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                          darkMode ? 'bg-slate-900 border-slate-750' : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-450">Card Expiry (MM/YY):</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength={5}
                          className={`w-full px-3.5 py-3 rounded-xl border text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                            darkMode ? 'bg-slate-900 border-slate-750' : 'bg-white border-gray-200'
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-450">Security Code CVV (3 Digits):</label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value)}
                          maxLength={3}
                          className={`w-full px-3.5 py-3 rounded-xl border text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                            darkMode ? 'bg-slate-900 border-slate-750' : 'bg-white border-gray-200'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-450 mt-1 leading-normal">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <p>Enter any mock digits to test. The application safely utilizes pre-authenticated test routing to execute orders without using live credentials.</p>
                  </div>
                </div>
              )}

              {/* BANK TRANSFER VIEW */}
              {paymentMethod === 'Bank Transfer' && (
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-gray-150'
                }`}>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">
                    <Landmark className="w-4 h-4 text-amber-400" />
                    <span>Blessed Corporate Bank Accounts</span>
                  </div>

                  <div className="p-4 bg-blue-950/35 border border-amber-500/15 rounded-xl space-y-2.5 text-xs text-slate-300 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-450 font-bold uppercase text-[10px]">Beneficiary Bank:</span>
                      <span className="font-extrabold text-white">Zenith Bank Plc</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 font-bold uppercase text-[10px]">Account Name:</span>
                      <span className="font-extrabold text-white">Blessed Multi-Products Enterprise</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-450 font-bold uppercase text-[10px]">Account Number:</span>
                      <span className="font-black text-amber-400 font-mono tracking-widest text-sm bg-black/40 px-2 py-0.5 rounded border border-white/5">
                        1224567890
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-2 text-amber-400 font-bold">
                      <span>Total to Transfer:</span>
                      <span className="font-mono text-sm">{formatNaira(finalTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-400">Depositor Sender's Name: (For confirmation)</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter the name on the bank account used to transfer"
                      value={transferSenderName}
                      onChange={(e) => setTransferSenderName(e.target.value)}
                      className={`w-full px-3.5 py-3 rounded-xl border text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                        darkMode ? 'bg-slate-900 border-slate-750' : 'bg-white border-gray-200'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 leading-normal leading-relaxed pt-1.5">
                    <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0 border border-emerald-400/20 p-0.5 rounded-full" />
                    <p>Once you make the transfer, click "Confirm Order Submission" below. Our finance desk verifies the Zenith transaction immediately.</p>
                  </div>
                </div>
              )}

              {/* Progress and Submission buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={loading || (paymentMethod === 'Bank Transfer' && !transferSenderName.trim())}
                  className="w-full py-4 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black uppercase text-xs tracking-wider rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      <span>Validating Secure {paymentMethod} Connection...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <span>
                        {paymentMethod === 'Bank Transfer' 
                          ? 'Confirm Bank Transfer Submission' 
                          : `Authorize Secure Payment ${formatNaira(finalTotal)}`}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="w-full py-2.5 hover:bg-slate-500/10 text-slate-400 font-bold rounded-xl text-xs"
                >
                  &larr; Go Back & Edit Shipping Details
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: SUCCESS INVOICE */}
          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              {/* Star sparkles visual center area */}
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/15 rounded-full scale-110 blur-xl animate-pulse" />
                <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-amber-400 text-blue-950 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl relative z-10">
                  <Check className="w-10 h-10 stroke-[3.5]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                  Transaction Authenticated!
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Thank you for shopping with Blessed Multi-Products. Your order has been registered securely inside the cloud database.
                </p>
              </div>

              {/* Invoice block */}
              <div className={`p-5 rounded-2xl border text-left space-y-3 mx-auto max-w-md ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-gray-150'
              }`}>
                <div className="flex justify-between items-center pb-2 border-b border-dashed dark:border-slate-850 border-gray-250">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Order ID Record:</span>
                  <span className="font-mono text-xs font-black text-white bg-blue-950 border border-slate-750 px-2 py-0.5 rounded uppercase tracking-wider">{createdOrderId}</span>
                </div>

                <div className="space-y-1.5 text-xs font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer Name:</span>
                    <span className="font-bold">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selected Method:</span>
                    <span className="font-bold">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Status:</span>
                    <span className={`font-black ${paymentMethod === 'Bank Transfer' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {paymentMethod === 'Bank Transfer' ? 'Pending Verification' : 'Verified (Paid)'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t dark:border-slate-850 border-gray-200 pt-2 text-sm font-extrabold text-amber-500">
                    <span>Total Credited:</span>
                    <span className="font-mono">{formatNaira(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Action delivery indicators */}
              <div className="space-y-3 max-w-md mx-auto pt-2">
                {/* WHATSAPP CONFIRMATION CTA - REQUIRED ON MOBILES */}
                <a
                  href={getWhatsAppOrderLink()}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-full py-4.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border-l-4 border-emerald-400 shadow-lg shadow-emerald-600/10"
                >
                  <MessageSquare className="w-5 h-5 fill-white/10" />
                  <span>Send WhatsApp Delivery Update</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className={`w-full py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-colors ${
                    darkMode ? 'border-slate-800 text-slate-300 hover:bg-slate-850' : 'border-gray-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Continue Shopping Store
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
