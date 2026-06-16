import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { ContactSection } from './components/ContactSection';
import { AboutSection } from './components/AboutSection';
import { AuthModal } from './components/AuthModal';
import { UserDashboard } from './components/UserDashboard';
import { Coupon, Product } from './types';
import {
  Sparkles, Award, ShieldCheck, Zap, Handshake, Star, ArrowRight, Mail,
  ShoppingBag, PhoneCall, ChevronRight, Check, CheckCircle2, MessageSquare, Tag, Filter, SlidersHorizontal, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { products, settings, user, wishlist, cart } = useApp();

  // Navigation and Filtering State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [subcatFilter, setSubcatFilter] = useState<string>('All');
  
  // Sorting & Filtering Options
  const [priceSortFilter, setPriceSortFilter] = useState<'default' | 'low-high' | 'high-low'>('default');
  const [stockOnlyFilter, setStockOnlyFilter] = useState<boolean>(false);

  // Overlay Open Triggers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [checkoutActive, setCheckoutActive] = useState<boolean>(false);

  // Applied Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmt, setDiscountAmt] = useState<number>(0);

  // Visual Theme Preference
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Newsletter Subscriptions
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSuccess, setNewsletterSuccess] = useState<boolean>(false);

  // Apply visual background dark class to html document
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle active catalog items filtering
  const getFilteredProducts = () => {
    let result = [...products];

    // Search query match
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        p => p.name.toLowerCase().includes(query) || 
             p.category.toLowerCase().includes(query) ||
             p.subcategory.toLowerCase().includes(query) ||
             (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Subcategory filter
    if (subcatFilter !== 'All') {
      result = result.filter(p => p.subcategory === subcatFilter);
    }

    // Out of Stock Filter
    if (stockOnlyFilter) {
      result = result.filter(p => p.stockQuantity > 0);
    }

    // Prices Ranking
    if (priceSortFilter === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSortFilter === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  };

  const filteredProducts = getFilteredProducts();

  // Featured and Best-Sellers list
  const featuredGoods = products.filter(p => p.isFeatured);
  const bestSellerGoods = products.filter(p => p.isBestSeller);

  // Auto-collect unique subcategories from active category list
  const getSubcategories = () => {
    if (categoryFilter === 'All') return [];
    const filtered = products.filter(p => p.category === categoryFilter);
    const setOfSubs = new Set(filtered.map(p => p.subcategory));
    return Array.from(setOfSubs);
  };

  const handleApplyNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const handleCategorySelection = (catName: string) => {
    setCategoryFilter(catName);
    setSubcatFilter('All');
    setActiveTab('shop');
  };

  // Preset categories mock cards
  const categoryCards = [
    {
      name: "Food Items",
      desc: "Rice, premium honey beans, Ijebu white Garri, and standard spices.",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Phones",
      desc: "Original factory-sealed Apple iPhones, Samsung flagships, Infinix, and Tecno.",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Laptops",
      desc: "Enterprise workstations HP, Dell Latitude, Apple MacBook M3, Lenovo Book.",
      img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Header Navigation segment */}
      <Navbar
        currentTab={activeTab}
        setTab={(tabId) => {
          setActiveTab(tabId);
          // If moving between segments, clear localized filters
          if (tabId !== 'shop') {
            setCategoryFilter('All');
            setSubcatFilter('All');
          }
        }}
        openCart={() => setCartOpen(true)}
        openAuth={() => setAuthOpen(true)}
        setCategoryFilter={(cat) => {
          setCategoryFilter(cat);
          setSubcatFilter('All');
          setActiveTab('shop');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main viewport area */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOMEPAGE PORTFOLIO */}
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {/* Luxury Slideshow Hero */}
              <HeroSection setTab={setActiveTab} />

              {/* Promotional Brand Slogan block */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 px-3 py-1 rounded-full text-xs font-black tracking-widest font-mono">
                  OUR TRADEMARK PROMISE
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">"Quality You Can Trust"</h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Blessed Multi-Products caters to individuals, catering establishments, corporate bodies and wholesale distributors. We curate the benchmark of Nigerian nutritional products alongside fully sealed mobile technology products. 
                </p>
              </section>

              {/* Featured Goods Showcase */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b dark:border-slate-800 border-gray-200 pb-4">
                  <div>
                    <span className="text-[10px] tracking-widest font-mono font-black text-amber-500 uppercase">EXCLUSIVE PREMIUM PICKS</span>
                    <h3 className="text-2xl font-black mt-1">Our Featured Products</h3>
                  </div>
                  <button
                    onClick={() => {
                      setCategoryFilter('All');
                      setActiveTab('shop');
                    }}
                    className="p-1 hover:text-amber-500 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Browse All catalog</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredGoods.slice(0, 4).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onViewDetail={setSelectedProduct}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              </section>

              {/* Best Selling Products */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b dark:border-slate-800 border-gray-200 pb-4">
                  <div>
                    <span className="text-[10px] tracking-widest font-mono font-black text-amber-500 uppercase">HIGH DEMAND DEALS</span>
                    <h3 className="text-2xl font-black mt-1">Best Selling Products</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bestSellerGoods.slice(0, 4).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onViewDetail={setSelectedProduct}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              </section>

              {/* Categorical lookups visual preview */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="text-center space-y-1">
                  <span className="text-[10px] tracking-widest font-mono font-black text-amber-500 uppercase">EASY BROWSING</span>
                  <h3 className="text-2xl font-black">Browse Store Categories</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {categoryCards.map((cc) => (
                    <div
                      key={cc.name}
                      onClick={() => handleCategorySelection(cc.name)}
                      className={`group relative rounded-3xl overflow-hidden h-72 border cursor-pointer hover:shadow-xl hover:border-amber-400 transition-all ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                      }`}
                    >
                      {/* background */}
                      <div className="absolute inset-x-0 top-0 h-44 overflow-hidden bg-slate-950">
                        <img
                          src={cc.img}
                          alt={cc.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform opacity-75"
                        />
                      </div>
                      <div className="absolute top-36 left-4 right-4 p-4 rounded-2xl bg-blue-950/95 text-white border border-amber-500/30">
                        <h4 className="text-sm font-black uppercase text-amber-400">{cc.name}</h4>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {cc.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Why Choose us section */}
              <section className={`py-12 border-y ${
                darkMode ? 'bg-slate-900/45 border-slate-800/40' : 'bg-slate-100/50 border-gray-150'
              }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] tracking-widest font-mono font-black text-amber-500 uppercase">CORPORATE VALUES</span>
                    <h3 className="text-2xl font-black">Why Customers Choose Blessed</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                      darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-105'
                    }`}>
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-500">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-amber-500">100% Vetted Grains</h4>
                        <p className="text-xs text-slate-450 leading-relaxed">Stone-free white & parboiled rice, honey beans, and white Ijebu Garri curated through local agricultural checks.</p>
                      </div>
                    </div>

                    <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                      darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-105'
                    }`}>
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-500">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-amber-500">Authenticsealed Mobile Tech</h4>
                        <p className="text-xs text-slate-450 leading-relaxed">Apple smartphones and performance laptops are authenticated, factory-sealed and come with full standard guarantees.</p>
                      </div>
                    </div>

                    <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                      darkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-105'
                    }`}>
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-500">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-amber-500">Rapid Delivery Response</h4>
                        <p className="text-xs text-slate-450 leading-relaxed">Orders are coupled, verified instantly using Zenith systems and dispatched, sending logistics reports straight to your phone list.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Newsletter Subscribtions */}
              <section className="max-w-4xl mx-auto px-4 text-center">
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-blue-950 via-slate-950 to-blue-950 border border-amber-500/20 text-white shadow-xl space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] tracking-widest font-mono font-black text-amber-400 uppercase">MONTHLY OFFERS DISCOUNTS</span>
                    <h3 className="text-xl sm:text-2xl font-black">Subscribe to Blessed Newsletter</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Receive notifications on catalog pricing drops, newly arrived Honeywell grain shipments and mobile tech coupon releases.
                    </p>
                  </div>

                  <form onSubmit={handleApplyNewsletter} className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-2 rounded-2xl overflow-hidden p-1.5 bg-black/45 hover:bg-black/60 border border-slate-800 focus-within:ring-2 focus-within:ring-amber-500">
                      <input
                        type="email"
                        required
                        placeholder="Type your active email address..."
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs text-white py-1.5 px-3 focus:ring-0 font-medium"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black rounded-xl uppercase tracking-wider text-[11px] leading-none text-nowrap select-none hover:brightness-105 active:scale-95 transition-all"
                      >
                        Subscribe Now
                      </button>
                    </div>
                    {newsletterSuccess && (
                      <p className="text-[10px] text-emerald-400 font-bold block mt-3">
                        ✓ Excellent! Your subscription has been verified successfully.
                      </p>
                    )}
                  </form>
                </div>
              </section>

            </motion.div>
          )}

          {/* TAB 2: SHOP CATALOG */}
          {activeTab === 'shop' && (
            <motion.div
              key="tab-shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans"
            >
              {/* Header banner */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b dark:border-slate-800 border-gray-200">
                <div>
                  <span className="text-[10px] tracking-widest font-mono font-black text-amber-500 uppercase">PREMIUM INVENTORY CATALOG</span>
                  <h2 className="text-2xl md:text-3xl font-black mt-1">
                    Blessed Storefront
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Filtering matches: <span className="text-amber-500 font-bold">{filteredProducts.length} Items</span> currently active</p>
                </div>

                {/* Micro search stats */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Category dropdown filters */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setSubcatFilter('All');
                    }}
                    className={`text-xs px-3.5 py-2 rounded-xl focus:outline-none border font-bold ${
                      darkMode ? 'bg-slate-900 border-slate-850 text-slate-300' : 'bg-white border-gray-200 text-slate-808'
                    }`}
                  >
                    <option value="All">All Categories</option>
                    <option value="Food Items">🌾 Food Items</option>
                    <option value="Phones">📱 Phones</option>
                    <option value="Laptops">💻 Laptops</option>
                  </select>

                  {/* Stock Availability toggles */}
                  <button
                    onClick={() => setStockOnlyFilter(!stockOnlyFilter)}
                    className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      stockOnlyFilter
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : darkMode ? 'bg-slate-900 border-slate-850 text-slate-350 hover:bg-slate-850' : 'bg-white border-gray-150 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {stockOnlyFilter ? 'In Stock Only' : 'Show Out of Stock'}
                  </button>

                  {/* Price range ranking */}
                  <select
                    value={priceSortFilter}
                    onChange={(e: any) => setPriceSortFilter(e.target.value)}
                    className={`text-xs px-3.5 py-2 rounded-xl focus:outline-none border font-bold ${
                      darkMode ? 'bg-slate-900 border-slate-850 text-slate-300' : 'bg-white border-gray-200 text-slate-808'
                    }`}
                  >
                    <option value="default">Sort by: Default</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Subcategory Pill options row */}
              {categoryFilter !== 'All' && getSubcategories().length > 0 && (
                <div className="flex flex-wrap gap-2.5 items-center bg-blue-950/20 p-3 rounded-2xl border dark:border-slate-805 border-gray-150">
                  <span className="text-[10px] uppercase font-black text-amber-500/80 mr-1.5 tracking-wider block font-mono">Custom Subcategories:</span>
                  <button
                    onClick={() => setSubcatFilter('All')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      subcatFilter === 'All'
                        ? 'bg-amber-500 text-blue-900 font-extrabold'
                        : 'bg-slate-950/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    All Sub-categories
                  </button>
                  {getSubcategories().map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSubcatFilter(sub)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        subcatFilter === sub
                          ? 'bg-amber-505 bg-amber-500 text-blue-900 font-extrabold'
                          : 'bg-slate-950/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}

              {/* Main product showcase loops */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                  {filteredProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewDetail={setSelectedProduct}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 space-y-4 max-w-sm mx-auto">
                  <div className="w-16 h-16 rounded-full bg-slate-950/20 dark:bg-slate-800/20 text-slate-400 flex items-center justify-center p-4 mx-auto text-2xl">
                    🔍
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase">No Products Found</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      We couldn't detect any merchandise matching your current filtration query inside the store. Try resetting filters.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCategoryFilter('All');
                      setSubcatFilter('All');
                      setSearchQuery('');
                      setPriceSortFilter('default');
                      setStockOnlyFilter(false);
                    }}
                    className="px-5 py-2 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black rounded-xl tracking-wider text-[10px] uppercase shadow-md leading-none"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: CATEGORIES DIRECT SELECTION */}
          {activeTab === 'categories' && (
            <motion.div
              key="tab-categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12 animate-fade-in font-sans"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] tracking-widest font-mono font-black text-amber-500 uppercase">CHOOSE CLASSIFICATION</span>
                <h2 className="text-2xl md:text-3xl font-black">Merchandise Department Directory</h2>
                <p className="text-xs text-slate-450 max-w-md mx-auto">Click into any department category to view available subcategory stocks.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categoryCards.map((cc) => (
                  <div
                    key={cc.name}
                    onClick={() => handleCategorySelection(cc.name)}
                    className={`group relative rounded-3xl overflow-hidden h-96 border cursor-pointer hover:shadow-2xl hover:border-amber-400 transition-all ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-105 shadow-sm'
                    }`}
                  >
                    {/* background */}
                    <div className="absolute inset-0 w-full h-full bg-slate-950">
                      <img
                        src={cc.img}
                        alt={cc.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform opacity-60"
                      />
                    </div>
                    {/* Gradient content overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-blue-950 via-blue-950/90 to-transparent pt-12 text-white border-t border-amber-500/10">
                      <h4 className="text-base font-black uppercase text-amber-400">{cc.name}</h4>
                      <p className="text-xs text-slate-350 mt-1 lines-clamp-3 leading-normal">
                        {cc.desc}
                      </p>
                      
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black text-amber-400/90 mt-4 border-b border-amber-400/40 pb-0.5">
                        <span>Click to Enter Department</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: ABOUT US story page */}
          {activeTab === 'about' && (
            <motion.div
              key="tab-about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AboutSection darkMode={darkMode} />
            </motion.div>
          )}

          {/* TAB 5: CONTACT US details form */}
          {activeTab === 'contact' && (
            <motion.div
              key="tab-contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ContactSection darkMode={darkMode} />
            </motion.div>
          )}

          {/* TAB 6: ADMIN CONTROL DASHBOARD Panel */}
          {activeTab === 'admin' && (
            <motion.div
              key="tab-admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminPanel darkMode={darkMode} setTab={setActiveTab} />
            </motion.div>
          )}

          {/* TAB 7: USER CUSTOMER DASHBOARD status orders */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <UserDashboard darkMode={darkMode} setTab={setActiveTab} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER AREA COMPONENT */}
      <Footer darkMode={darkMode} setTab={setActiveTab} />

      {/* FLOATING WHATSAPP BUTTON ADMIN SUPPORT ROUTING */}
      <a
        href={settings.whatsappLink}
        target="_blank"
        referrerPolicy="no-referrer"
        className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl transition-transform hover:scale-110 border-2 border-emerald-400 active:scale-90 flex items-center justify-center group"
        title="Inquire immediately on WhatsApp"
        id="floating-whatsapp-trigger"
      >
        <MessageSquare className="w-6.5 h-6.5 fill-white/10" />
        <span className="absolute right-14 whitespace-nowrap bg-blue-950 text-white border border-amber-400/40 font-bold text-[10px] tracking-wide uppercase px-3 py-1.5 rounded-xl pointer-events-none scale-0 group-hover:scale-100 origin-right transition-transform shadow-lg shadow-black/40">
          Need help? Chat Blessed WhatsApp Direct!
        </span>
      </a>

      {/* SLIDE-DRAWER: CART OVERLAY */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer
            onClose={() => setCartOpen(false)}
            darkMode={darkMode}
            onCheckout={(coupon, discount) => {
              setAppliedCoupon(coupon);
              setDiscountAmt(discount);
              setCartOpen(false);
              setCheckoutActive(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* MODAL: AUTH LOGINS AND REGISTRATION CODES */}
      <AnimatePresence>
        {authOpen && (
          <AuthModal
            onClose={() => setAuthOpen(false)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* MODAL: CHECKOUT CHANNELS */}
      <AnimatePresence>
        {checkoutActive && (
          <CheckoutModal
            onClose={() => setCheckoutActive(false)}
            appliedCoupon={appliedCoupon}
            discountAmount={discountAmt}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* MODAL: SINGLE PRODUCT QUICK-VIEW SPECIFICATIONS */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
