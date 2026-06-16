import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  CheckCircle,
  ShieldCheck,
  Truck,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useApp();
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim() && newsEmail.includes('@')) {
      setSubscribed(true);
      setNewsEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-amber-500/25">
      {/* Upper Features / Trust Badges Banner */}
      <div className="bg-gradient-to-r from-blue-950 to-indigo-950 border-b border-amber-500/10 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm tracking-wide uppercase">100% Guaranteed Quality</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Every single item we stock represents premium standards. "Quality You Can Trust" is our daily commitment.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
              <Truck className="w-8 h-8 rotate-12" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm tracking-wide uppercase">Fast & Secure Delivery</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Rapid packing and secure transit across Lagos and nationwide. Your merchandise is pristine and intact!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm tracking-wide uppercase">WhatsApp Quick Orders</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Connect directly with Blessed administrators on WhatsApp. Inquire, negotiate bulk rates, and place orders in 1-click.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-lg flex items-center justify-center border border-amber-400">
              <span className="text-blue-950 font-black text-2xl">B</span>
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">BLESSED</h2>
              <p className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400 -mt-1 leading-none">
                Multi-Products
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">
            "Quality You Can Trust." Your premier merchant partner for high-grade foods, smartphones, enterprise laptops, and premium general merchandise.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="p-2 bg-slate-900 hover:bg-amber-500 rounded-lg text-slate-400 hover:text-slate-950 border border-slate-800 hover:border-amber-400 transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-slate-900 hover:bg-amber-500 rounded-lg text-slate-400 hover:text-slate-950 border border-slate-800 hover:border-amber-400 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-slate-900 hover:bg-amber-500 rounded-lg text-slate-400 hover:text-slate-950 border border-slate-800 hover:border-amber-400 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-slate-900 hover:bg-amber-500 rounded-lg text-slate-400 hover:text-slate-950 border border-slate-800 hover:border-amber-400 transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6 pb-2 border-b border-slate-800/80">
            Catalog Collections
          </h3>
          <ul className="space-y-3.5 text-xs">
            <li>
              <a href="#shop" className="hover:text-amber-400 text-slate-400 transition-colors block">
                🌾 Food Items (Rice, Beans, Oils)
              </a>
            </li>
            <li>
              <a href="#shop" className="hover:text-amber-400 text-slate-400 transition-colors block">
                📱 Smartphones (iPhone, Samsung)
              </a>
            </li>
            <li>
              <a href="#shop" className="hover:text-amber-400 text-slate-400 transition-colors block">
                💻 Professional & Gaming Laptops
              </a>
            </li>
            <li>
              <a href="#shop" className="hover:text-amber-400 text-slate-400 transition-colors block">
                ⚡ Beverages, Noodles & Kitchen Spices
              </a>
            </li>
            <li>
              <a href="#shop" className="hover:text-amber-400 text-slate-400 transition-colors block">
                🌟 Weekly Featured Deals
              </a>
            </li>
          </ul>
        </div>

        {/* Contact info column */}
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6 pb-2 border-b border-slate-800/80">
            Corporate Contact
          </h3>
          <ul className="space-y-4 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-slate-350 leading-relaxed">
                {settings.businessAddress}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={`tel:${settings.whatsappNumber}`} className="text-slate-350 hover:text-amber-400 transition-colors font-semibold">
                {settings.whatsappNumber}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={`mailto:${settings.emailAddress}`} className="text-slate-350 hover:text-amber-400 transition-colors font-semibold truncate block">
                {settings.emailAddress}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-slate-400 leading-none block">
                {settings.businessHours}
              </span>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-6 pb-2 border-b border-slate-800/80">
            Subscribe & Save
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Sign up for our newsletter to receive stock replenishment alerts, discount codes, and special promotional offers first!
          </p>
          <form onSubmit={handleSubscribe} className="relative flex flex-col gap-2">
            <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-amber-400 rounded-xl overflow-hidden px-3.5 py-1 transition-all">
              <input
                type="email"
                placeholder="Enter email address"
                required
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-2 text-xs placeholder-slate-500 text-white font-medium focus:ring-0"
              />
              <button
                type="submit"
                className="p-1.5 bg-gradient-to-tr from-amber-500 to-amber-400 text-blue-950 font-bold rounded-lg hover:brightness-110 transition-transform active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {subscribed && (
              <p className="text-[10px] text-emerald-400 font-bold animate-pulse">
                ✓ Thank you! You've successfully subscribed to our newsletter.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Credit Badges and License Bottom Bar */}
      <div className="bg-slate-990 border-t border-slate-900 text-slate-500 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="text-center md:text-left leading-normal font-medium text-slate-400">
            <span>© {new Date().getFullYear()} Blessed Multi-Products. All Rights Reserved. </span>
            <span className="block md:inline mt-1 md:mt-0 text-[10px] text-slate-500">
              Designed with premium aesthetics in Lagos, Nigeria.
            </span>
          </div>

          {/* Secure Payment Badges Vectors */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase mr-1">
              Secure Checkouts:
            </span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-900 rounded font-black tracking-tighter text-indigo-400 text-[10px] uppercase border border-slate-800">
                Paystack
              </span>
              <span className="px-2 py-1 bg-slate-900 rounded font-black tracking-tighter text-amber-500 text-[10px] uppercase border border-slate-800">
                Flutterwave
              </span>
              <span className="px-2 py-1 bg-slate-900 rounded font-semibold tracking-tighter text-slate-300 text-[10px] uppercase border border-slate-800">
                Transfer
              </span>
              <span className="px-2 py-1 bg-slate-900 rounded font-black tracking-tighter text-blue-400 text-[10px] uppercase border border-slate-800">
                VISA
              </span>
              <span className="px-2 py-1 bg-slate-900 rounded font-black tracking-tighter text-rose-400 text-[10px] uppercase border border-slate-800">
                MC
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
