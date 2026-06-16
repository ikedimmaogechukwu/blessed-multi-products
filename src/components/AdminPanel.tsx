import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus, Edit, Trash2, Sliders, CheckCircle, Clock, Package, DollarSign,
  TrendingUp, Users, Settings, Database, MessageSquare, PlusCircle, Calendar,
  RefreshCw, Upload, AlertCircle, ShoppingBag, Eye, Tag, Trash, Star, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, StoreSettings, Coupon, Testimonial } from '../types';

interface AdminPanelProps {
  darkMode: boolean;
  setTab: (tab: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ darkMode, setTab }) => {
  const {
    user,
    userProfile,
    products,
    orders,
    contacts,
    testimonials,
    coupons,
    settings,
    dbMode,
    addProduct,
    editProduct,
    deleteProduct,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateSettings,
    seedDatabase,
    addTestimonial,
    deleteTestimonial,
    addCoupon,
    deleteCoupon,
    updateContactStatus
  } = useApp();

  // Selected subtab
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'orders' | 'messages' | 'settings'>('products');

  // Dynamic image input methods states
  const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload');
  const [quickImageInputMethod, setQuickImageInputMethod] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isQuickDragging, setIsQuickDragging] = useState(false);

  // Helper to convert files to beautiful downscaled base64 data URLs for storage compatibility
  const processImageFile = (file: File, callback: (base64: string) => void) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_DIM = 600;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const quality = 0.75;
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            callback(dataUrl);
          } else {
            callback(event.target?.result as string);
          }
          resolve();
        };
        img.onerror = () => {
          callback(event.target?.result as string);
          resolve();
        };
      };
      reader.readAsDataURL(file);
    });
  };

  // Product edit form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormCat, setProdFormCat] = useState('Food Items');
  const [prodFormSub, setProdFormSub] = useState('Rice');
  const [prodFormPrice, setProdFormPrice] = useState(0);
  const [prodFormStock, setProdFormStock] = useState(0);
  const [prodFormDesc, setProdFormDesc] = useState('');
  const [prodFormImages, setProdFormImages] = useState<string[]>(['']);
  const [prodFormBrand, setProdFormBrand] = useState('');
  const [prodFormFeatured, setProdFormFeatured] = useState(false);
  const [prodFormBestseller, setProdFormBestseller] = useState(false);

  // Quick direct inline editing states
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickEditPrice, setQuickEditPrice] = useState<number>(0);
  const [quickEditImage, setQuickEditImage] = useState<string>('');

  // Settings form states
  const [whatsappNum, setWhatsappNum] = useState(settings.whatsappNumber);
  const [whatsappLnk, setWhatsappLnk] = useState(settings.whatsappLink);
  const [emailAddr, setEmailAddr] = useState(settings.emailAddress);
  const [bizAddr, setBizAddr] = useState(settings.businessAddress);
  const [bizHours, setBizHours] = useState(settings.businessHours);
  const [promoT, setPromoT] = useState(settings.promoTitle);
  const [promoST, setPromoST] = useState(settings.promoSubtitle);
  const [bannerImgs, setBannerImgs] = useState<string[]>(settings.bannerImages);

  // General state feedback
  const [couponFormCode, setCouponFormCode] = useState('');
  const [couponFormVal, setCouponFormVal] = useState(0);
  const [testFormName, setTestFormName] = useState('');
  const [testFormRole, setTestFormRole] = useState('');
  const [testFormContent, setTestFormContent] = useState('');

  // Validate admin ownership
  const isAdmin = user?.email === 'ogechukwublessing009@gmail.com' || userProfile?.isAdmin;

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
          <AlertCircle className="w-10 h-10 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight uppercase">Admin Access Restricted</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You must log in using the verified administrator email <span className="font-extrabold text-amber-500">ogechukwublessing009@gmail.com</span> to configure catalog items, settings, and view customer ledger metrics.
          </p>
        </div>
        <button
          onClick={() => {
            const loginBtn = document.getElementById('navbar-login-btn');
            if (loginBtn) loginBtn.click();
          }}
          className="px-6 py-3 bg-gradient-to-tr from-amber-500 to-amber-400 text-blue-950 font-black rounded-xl text-xs uppercase tracking-wider hover:brightness-105 active:scale-95"
        >
          Authenticate Admin Account
        </button>
      </div>
    );
  }

  const formatNaira = (num: number) => {
    return '₦' + num.toLocaleString('en-NG');
  };

  const getGrossSales = () => {
    return orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  };

  // Clear & Open product form
  const handleOpenProductCreate = () => {
    setEditingProduct(null);
    setProdFormName('');
    setProdFormCat('Food Items');
    setProdFormSub('Rice');
    setProdFormPrice(0);
    setProdFormStock(0);
    setProdFormDesc('');
    setProdFormImages(['https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80']);
    setImageInputMethod('upload');
    setProdFormBrand('');
    setProdFormFeatured(false);
    setProdFormBestseller(false);
    setShowProductForm(true);
  };

  // Open Edit Product form
  const handleOpenProductEdit = (product: Product) => {
    setEditingProduct(product);
    setProdFormName(product.name);
    setProdFormCat(product.category);
    setProdFormSub(product.subcategory);
    setProdFormPrice(product.price);
    setProdFormStock(product.stockQuantity);
    setProdFormDesc(product.description);
    setProdFormImages(product.images && product.images.length > 0 ? product.images : ['']);
    const isBase64 = product.images && product.images[0] && product.images[0].startsWith('data:');
    setImageInputMethod(isBase64 ? 'upload' : 'url');
    setProdFormBrand(product.brand || '');
    setProdFormFeatured(product.isFeatured);
    setProdFormBestseller(product.isBestSeller);
    setShowProductForm(true);
  };

  // Submit product creation/update
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodFormName || !prodFormPrice || !prodFormImages[0]) return;

    const filteredImages = prodFormImages.filter(img => img.trim());

    if (editingProduct) {
      const updatedProduct: Product = {
        ...editingProduct,
        name: prodFormName,
        category: prodFormCat,
        subcategory: prodFormSub,
        price: Number(prodFormPrice),
        stockQuantity: Number(prodFormStock),
        description: prodFormDesc,
        images: filteredImagesStrArr(filteredImages),
        brand: prodFormBrand,
        isFeatured: prodFormFeatured,
        isBestSeller: prodFormBestseller
      };
      await editProduct(updatedProduct);
    } else {
      const productPayload = {
        name: prodFormName,
        category: prodFormCat,
        subcategory: prodFormSub,
        price: Number(prodFormPrice),
        stockQuantity: Number(prodFormStock),
        description: prodFormDesc,
        images: filteredImagesStrArr(filteredImages),
        brand: prodFormBrand,
        isFeatured: prodFormFeatured,
        isBestSeller: prodFormBestseller
      };
      await addProduct(productPayload);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const filteredImagesStrArr = (arr: any) => {
    return arr.map((item: any) => String(item));
  };

  const handleQuickSave = async (product: Product) => {
    if (!quickEditImage.trim()) {
      alert("Please provide a valid product image link.");
      return;
    }
    if (quickEditPrice < 0) {
      alert("Product price must be a non-negative number.");
      return;
    }
    
    // Construct updated product with edited price & image
    const updatedModel: Product = {
      ...product,
      price: Number(quickEditPrice),
      images: [quickEditImage, ...product.images.slice(1)].map(img => String(img))
    };

    try {
      await editProduct(updatedModel);
      setQuickEditId(null);
    } catch (err) {
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleUpdateStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const storeSettings: StoreSettings = {
      whatsappNumber: whatsappNum,
      whatsappLink: whatsappLnk,
      emailAddress: emailAddr,
      businessAddress: bizAddr,
      businessHours: bizHours,
      promoTitle: promoT,
      promoSubtitle: promoST,
      bannerImages: bannerImgs
    };
    await updateSettings(storeSettings);
    alert(`Corporate settings files synced successfully inside ${dbMode === 'local' ? 'Local Sandbox Storage' : 'Firestore'}!`);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponFormCode.trim() || !couponFormVal) return;
    await addCoupon({
      code: couponFormCode.trim().toUpperCase(),
      discountType: 'percentage',
      value: Number(couponFormVal),
      minPurchase: 10000,
      active: true
    });
    setCouponFormCode('');
    setCouponFormVal(0);
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testFormName || !testFormContent) return;
    await addTestimonial({
      name: testFormName,
      role: testFormRole || 'Blessed Customer',
      content: testFormContent,
      rating: 5
    });
    setTestFormName('');
    setTestFormRole('');
    setTestFormContent('');
  };

  // Quick categories lookup
  const categoriesList = ['Food Items', 'Phones', 'Laptops'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-950 via-slate-950 to-blue-950 p-6 rounded-3xl border border-amber-500/20 text-white shadow-xl shadow-amber-500/5">
        <div>
          <span className="text-[10px] tracking-widest font-black uppercase text-amber-400 font-mono">Control Panel Dashboard</span>
          <h2 className="text-2xl font-black tracking-tight leading-none mt-1">Blessed Management Suite</h2>
          <p className="text-xs text-slate-400 mt-2">Logged in as: <span className="text-white font-bold">{user?.email}</span> ({dbMode === 'local' ? 'Local Sandbox Administrator' : 'Administrator status validated'})</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={seedDatabase}
            className="px-4 py-2.5 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-transform"
            title="Populates Firestore tables with template catalog products"
            id="seed-database-btn"
          >
            <Database className="w-4 h-4 text-blue-950" />
            <span>Seed Database Tables</span>
          </button>
        </div>
      </div>

      {dbMode === 'local' && (
        <div className="p-4.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-500">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider">📦 Offline-Safe local Sandbox Mode Active</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              To satisfy your local development needs with zero Firebase cloud connection dependencies, Blessed is configured inside its offline local state engine. All catalog and settings modifications you execute will persist safely in your browser storage and will be immediately reflected in real-time across the storefront!
            </p>
          </div>
        </div>
      )}

      {/* Metrics Bar Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Gross Sales */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase block">Total Sales Net:</span>
            <span className="text-2xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-400">
              {formatNaira(getGrossSales())}
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-500">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Orders Count */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase block">Placed Orders Log:</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">
              {orders.length}
            </span>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Products Count */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase block">Registered products:</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">
              {products.length}
            </span>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Alerts */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase block">Urgent Client Messages:</span>
            <span className={`text-2xl font-black tracking-tight ${contacts.filter(c => c.status === 'Unread').length > 0 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
              {contacts.filter(c => c.status === 'Unread').length} Unread
            </span>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/25 text-rose-500">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sub-tabs Links panel */}
      <div className="flex border-b dark:border-slate-800 border-gray-150 overflow-x-auto gap-1">
        {[
          { id: 'products', label: '🌾 Products Settings', icon: Package },
          { id: 'orders', label: '🚚 Orders Dispatcher', icon: ShoppingBag },
          { id: 'messages', label: '💬 Client Inquiries', icon: MessageSquare },
          { id: 'settings', label: '⚙ Web Page Configs', icon: Settings }
        ].map(tb => {
          const Icon = tb.icon;
          return (
            <button
              key={tb.id}
              onClick={() => setActiveSubTab(tb.id as any)}
              className={`px-5 py-3 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 shrink-0 border-b-2 transition-colors ${
                activeSubTab === tb.id
                  ? 'border-amber-500 text-amber-500 font-black'
                  : 'border-transparent text-slate-450 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB SUBSECTIONS CONTENT AREA */}
      <div>
        
        {/* SUBTAB 1: PRODUCTS INVENTORY CATALOG */}
        {activeSubTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-950/20 to-transparent p-4.5 rounded-2xl border dark:border-slate-800 border-slate-100">
              <div>
                <h3 className="text-sm font-black uppercase text-amber-450 tracking-wider">Product Inventory Management</h3>
                <p className="text-[10px] text-slate-450 leading-relaxed">Add, modify listing properties, photos, adjust Naira prices, and adjust stock quantities.</p>
              </div>
              <button
                onClick={handleOpenProductCreate}
                className="px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md shadow-blue-900/10"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Editing Product form overlay card modal */}
            {showProductForm && (
              <div className="p-6 rounded-2xl border dark:bg-slate-950 dark:border-slate-850 bg-slate-50 border-gray-250 space-y-4 animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b dark:border-slate-850 border-gray-200">
                  <h4 className="text-sm font-black uppercase text-amber-500">
                    {editingProduct ? '✏ Edit Catalog Product' : '🌾 Register New Product'}
                  </h4>
                  <button onClick={() => setShowProductForm(false)} className="text-xs text-rose-500 font-bold hover:underline">
                    Cancel Form
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Product Brand Name:</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g., Royal Stallion Long Grain, iPhone 15 Pro Max, ASUS Zenbook 14"
                        value={prodFormName}
                        onChange={(e) => setProdFormName(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                          darkMode ? 'bg-slate-900 border-slate-750 text-white' : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Producer Brand Label (Optional):</label>
                      <input
                        type="text"
                        placeholder="E.g., Apple, Samsung, Indomie, local Farms"
                        value={prodFormBrand}
                        onChange={(e) => setProdFormBrand(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                          darkMode ? 'bg-slate-900 border-slate-750 text-white' : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Category:</label>
                      <select
                        value={prodFormCat}
                        onChange={(e) => setProdFormCat(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                          darkMode ? 'bg-slate-900 border-slate-750 text-white' : 'bg-white border-gray-200 text-slate-800'
                        }`}
                      >
                        {categoriesList.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Subcategory:</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Rice, Beans, HP, Samsung"
                        value={prodFormSub}
                        onChange={(e) => setProdFormSub(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                          darkMode ? 'bg-slate-900 border-slate-750 text-white' : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Price Tag (₦):</label>
                      <input
                        type="number"
                        required
                        value={prodFormPrice}
                        onChange={(e) => setProdFormPrice(Number(e.target.value))}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                          darkMode ? 'bg-slate-900 border-slate-750 text-white' : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Starting Stock qty:</label>
                      <input
                        type="number"
                        required
                        value={prodFormStock}
                        onChange={(e) => setProdFormStock(Number(e.target.value))}
                        className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                          darkMode ? 'bg-slate-900 border-slate-750 text-white' : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Product Photo / Image:</label>
                      <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border dark:border-slate-850 border-gray-200">
                        <button
                          type="button"
                          onClick={() => setImageInputMethod('upload')}
                          className={`px-3 py-1 text-[10px] font-black uppercase rounded-md tracking-wider transition-all select-none ${
                            imageInputMethod === 'upload'
                              ? 'bg-amber-500 text-blue-950 shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          📷 Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMethod('url')}
                          className={`px-3 py-1 text-[10px] font-black uppercase rounded-md tracking-wider transition-all select-none ${
                            imageInputMethod === 'url'
                              ? 'bg-amber-500 text-blue-950 shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          🔗 Web Link
                        </button>
                      </div>
                    </div>

                    {imageInputMethod === 'upload' ? (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={async (e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const files = e.dataTransfer.files;
                          if (files && files.length > 0) {
                            const file = files[0];
                            if (file.type.startsWith('image/')) {
                              await processImageFile(file, (base64) => {
                                setProdFormImages([base64]);
                              });
                            } else {
                              alert("Please upload a valid image file.");
                            }
                          }
                        }}
                        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
                          isDragging
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-slate-350 dark:border-slate-800 bg-slate-500/5'
                        }`}
                        onClick={() => document.getElementById('prod-file-upload')?.click()}
                      >
                        <input
                          id="prod-file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const file = files[0];
                              await processImageFile(file, (base64) => {
                                setProdFormImages([base64]);
                              });
                            }
                          }}
                        />
                        {prodFormImages[0] && prodFormImages[0].startsWith('data:image') ? (
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={prodFormImages[0]}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-xl border border-slate-700/50 shadow-md"
                              referrerPolicy="no-referrer"
                            />
                            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold uppercase font-mono">
                              <CheckCircle className="w-3.5 h-3.5" /> File Loaded successfully
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold">Click or drag a new image to replace</p>
                          </div>
                        ) : prodFormImages[0] ? (
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={prodFormImages[0]}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-xl border border-slate-705/10 shadow-md"
                              referrerPolicy="no-referrer"
                            />
                            <p className="text-[10px] text-amber-500 flex items-center gap-1 font-bold uppercase font-mono">
                              🔗 Image URL Link Active
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold">Click or drag an image file to upload as file</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-slate-400 animate-pulse" />
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold leading-none">Drag & Drop Product Image Here</p>
                              <p className="text-[10px] text-slate-400">or click to browse local files</p>
                            </div>
                            <span className="text-[9px] text-slate-500 uppercase font-mono">PNG, JPG, BMP accepted (Compressed offline)</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <input
                          type="text"
                          required
                          placeholder="Paste HTTPS Image URL Link..."
                          value={prodFormImages[0].startsWith('data:image') ? '' : prodFormImages[0]}
                          onChange={(e) => setProdFormImages([e.target.value])}
                          className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                            darkMode ? 'bg-slate-900 border-slate-750 text-white' : 'bg-white border-gray-200'
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Complete Specs / Description:</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write rich product description detail specifications..."
                      value={prodFormDesc}
                      onChange={(e) => setProdFormDesc(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        darkMode ? 'bg-slate-900 border-slate-750 text-white' : 'bg-white border-gray-200'
                      }`}
                    />
                  </div>

                  {/* Highlights Checkbox */}
                  <div className="flex gap-6 pt-1">
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodFormFeatured}
                        onChange={(e) => setProdFormFeatured(e.target.checked)}
                        className="rounded border-gray-200 text-amber-500 focus:ring-amber-500 h-4 w-4"
                      />
                      <span>Promote to Featured sections</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodFormBestseller}
                        onChange={(e) => setProdFormBestseller(e.target.checked)}
                        className="rounded border-gray-200 text-amber-500 focus:ring-amber-500 h-4 w-4"
                      />
                      <span>Mark as Best-Seller Deal</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 text-xs tracking-wider uppercase font-black rounded-xl hover:brightness-105 active:scale-95 transition-transform"
                    >
                      Save Catalog Record
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Inventory table */}
            <div className={`rounded-2xl border overflow-hidden ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-150'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className={`uppercase font-extrabold pb-1 ${
                    darkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'
                  }`}>
                    <tr>
                      <th className="p-4">Item Detail</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Deals Promo</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-850 divide-gray-150 font-medium">
                    {products.map(p => (
                      <tr key={p.id} className={darkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                        {quickEditId === p.id ? (
                          <>
                            <td className="p-4">
                              <div className="flex flex-col gap-2 min-w-[280px]">
                                <div className="flex items-center gap-3">
                                  <img src={quickEditImage || p.images[0]} alt="" referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-md border border-slate-800/10 shrink-0" />
                                  <div>
                                    <p className="font-extrabold line-clamp-1">{p.name}</p>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold font-mono">{p.id}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-450 block">Image Input:</span>
                                    <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-md border dark:border-slate-805 border-gray-200 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => setQuickImageInputMethod('upload')}
                                        className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-sm transition-all select-none ${
                                          quickImageInputMethod === 'upload'
                                            ? 'bg-amber-500 text-blue-950 font-black shadow-sm'
                                            : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                      >
                                        📷 File
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setQuickImageInputMethod('url')}
                                        className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-sm transition-all select-none ${
                                          quickImageInputMethod === 'url'
                                            ? 'bg-amber-500 text-blue-950 font-black shadow-sm'
                                            : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                      >
                                        🔗 Link
                                      </button>
                                    </div>
                                  </div>

                                  {quickImageInputMethod === 'upload' ? (
                                    <div
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsQuickDragging(true);
                                      }}
                                      onDragLeave={() => setIsQuickDragging(false)}
                                      onDrop={async (e) => {
                                        e.preventDefault();
                                        setIsQuickDragging(false);
                                        const files = e.dataTransfer.files;
                                        if (files && files.length > 0) {
                                          const file = files[0];
                                          if (file.type.startsWith('image/')) {
                                            await processImageFile(file, (base64) => {
                                              setQuickEditImage(base64);
                                            });
                                          } else {
                                            alert("Please upload a valid image file.");
                                          }
                                        }
                                      }}
                                      className={`border border-dashed rounded-lg p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 relative overflow-hidden ${
                                        isQuickDragging
                                          ? 'border-amber-500 bg-amber-500/10'
                                          : 'border-slate-350 dark:border-slate-805 bg-slate-500/5'
                                      }`}
                                      onClick={() => document.getElementById(`quick-file-upload-${p.id}`)?.click()}
                                    >
                                      <input
                                        id={`quick-file-upload-${p.id}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const files = e.target.files;
                                          if (files && files.length > 0) {
                                            const file = files[0];
                                            await processImageFile(file, (base64) => {
                                              setQuickEditImage(base64);
                                            });
                                          }
                                        }}
                                      />
                                      {quickEditImage && quickEditImage.startsWith('data:image') ? (
                                        <div className="flex items-center gap-1.5 justify-center">
                                          <p className="text-[10px] text-emerald-400 font-extrabold uppercase flex items-center gap-0.5">
                                            <CheckCircle className="w-3.5 h-3.5 animate-pulse" /> Loaded Upload
                                          </p>
                                          <span className="text-[8px] text-slate-400">(Click to repl)</span>
                                        </div>
                                      ) : quickEditImage ? (
                                        <div className="flex items-center gap-1.5 justify-center">
                                          <p className="text-[10px] text-amber-500 font-bold uppercase flex items-center gap-0.5">
                                            🔗 Link Active
                                          </p>
                                          <span className="text-[8px] text-slate-400">(Click to upload)</span>
                                        </div>
                                      ) : (
                                        <>
                                          <Upload className="w-4 h-4 text-slate-400 animate-bounce" />
                                          <p className="text-[9px] font-bold leading-tight">Drag or Click to upload</p>
                                        </>
                                      )}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      value={quickEditImage.startsWith('data:image') ? '' : quickEditImage}
                                      onChange={(e) => setQuickEditImage(e.target.value)}
                                      className={`w-full px-2 py-1.5 rounded-lg border text-[11px] focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                                        darkMode ? 'bg-slate-950 border-slate-805 text-white' : 'bg-white border-gray-300 text-slate-850'
                                      }`}
                                      placeholder="Paste product photo web url..."
                                    />
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 uppercase text-[10px] font-bold text-slate-450">{p.subcategory}</td>
                            <td className="p-4">
                              <div className="space-y-1 min-w-[120px]">
                                <span className="text-[9px] uppercase tracking-wider block font-bold text-slate-400">Edit Price (₦):</span>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={quickEditPrice || 0}
                                  onChange={(e) => setQuickEditPrice(Number(e.target.value))}
                                  className={`w-full px-2 py-1.5 rounded-lg border text-[11px] font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                                    darkMode ? 'bg-slate-950 border-slate-805 text-amber-450' : 'bg-white border-gray-300 text-amber-600 font-bold'
                                  }`}
                                />
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-slate-450 font-bold">{p.stockQuantity} Left</span>
                            </td>
                            <td className="p-4 space-y-1">
                              {p.isFeatured && (
                                <span className="px-1.5 py-0.5 bg-blue-900/40 text-blue-400 text-[9px] uppercase font-bold rounded block w-max">Featured</span>
                              )}
                              {p.isBestSeller && (
                                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] uppercase font-extrabold rounded block w-max">Best Seller</span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex flex-col gap-1 md:flex-row md:justify-end">
                                <button
                                  onClick={() => handleQuickSave(p)}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-black tracking-wider rounded-lg shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1 shrink-0"
                                  title="Save changes"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={() => setQuickEditId(null)}
                                  className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:brightness-110 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-transform active:scale-95 shrink-0"
                                  title="Cancel changes"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-4 flex items-center gap-3">
                              <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-md border border-slate-800/10" />
                              <div>
                                <p className="font-extrabold line-clamp-1">{p.name}</p>
                                <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">{p.id}</span>
                              </div>
                            </td>
                            <td className="p-4 uppercase text-[10px] font-bold text-slate-450">{p.subcategory}</td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1 items-start">
                                <span className="font-black font-mono text-amber-500">{formatNaira(p.price)}</span>
                                <button
                                  onClick={() => {
                                    setQuickEditId(p.id);
                                    setQuickEditPrice(p.price);
                                    setQuickEditImage(p.images[0]);
                                    const isBase64 = p.images && p.images[0] && p.images[0].startsWith('data:');
                                    setQuickImageInputMethod(isBase64 ? 'upload' : 'url');
                                  }}
                                  className="text-[9px] uppercase tracking-wider font-extrabold text-blue-500 dark:text-blue-400 hover:underline hover:text-amber-500 flex items-center gap-0.5"
                                  title="Quick edit price and image URL"
                                >
                                  ✏ Quick Edit
                                </button>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`font-bold ${p.stockQuantity <= 5 ? 'text-rose-500 animate-pulse font-extrabold' : 'text-slate-400'}`}>
                                {p.stockQuantity <= 0 ? 'SOLD OUT' : `${p.stockQuantity} Left`}
                              </span>
                            </td>
                            <td className="p-4 space-x-1.5">
                              {p.isFeatured && (
                                <span className="px-1.5 py-0.5 bg-blue-900/40 text-blue-400 text-[9px] uppercase font-bold rounded">Featured</span>
                              )}
                              {p.isBestSeller && (
                                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] uppercase font-extrabold rounded">Best Seller</span>
                              )}
                            </td>
                            <td className="p-4 text-right space-x-1.5">
                              <button
                                onClick={() => handleOpenProductEdit(p)}
                                className="p-1.5 bg-blue-900/10 hover:bg-blue-900 text-blue-900 hover:text-white dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 rounded transition-colors"
                                title="Full Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Confirm physical deletion of ${p.name}?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: ORDERS MANAGEMENT DISPATCHER */}
        {activeSubTab === 'orders' && (
          <div className="space-y-6">
            <div className="p-4.5 bg-gradient-to-r from-blue-950/15 to-transparent rounded-2xl border dark:border-slate-800 border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-black uppercase text-amber-450 tracking-wider">Customer Order Fulfilments</h3>
                <p className="text-[10px] text-slate-450">Track customer purchases, billing locations, payments, and ship/dispatch order statuses.</p>
              </div>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-750' : 'bg-white border-gray-150 shadow-sm'
                    }`}
                  >
                    {/* Upper order state headers */}
                    <div className="flex flex-wrap justify-between items-baseline gap-2 pb-3 border-b border-dashed dark:border-slate-850 border-gray-200">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Placed: {o.createdAt?.split('T')[0] || 'Recently'}</span>
                        <h4 className="text-sm font-extrabold flex items-center gap-2">
                          <span>Order ID:</span>
                          <span className="font-mono text-xs text-amber-500 uppercase">{o.id}</span>
                        </h4>
                      </div>
                      
                      {/* Status selectors */}
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${
                          o.orderStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                          o.orderStatus === 'Shipped' ? 'bg-indigo-500/10 text-indigo-400' :
                          o.orderStatus === 'Cancelled' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-amber-500/10 text-amber-500 animate-pulse'
                        }`}>
                          {o.orderStatus}
                        </span>

                        <select
                          value={o.orderStatus}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className={`text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 focus:outline-none ${
                            darkMode ? 'text-slate-300' : 'text-slate-800 bg-slate-50 border-gray-250'
                          }`}
                        >
                          <option value="Pending">Set Pending</option>
                          <option value="Processing">Set Processing</option>
                          <option value="Shipped">Set Shipped</option>
                          <option value="Delivered">Set Delivered</option>
                          <option value="Cancelled">Set Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Details Body grids */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
                      {/* Customer contact details */}
                      <div className="space-y-1">
                        <h5 className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Billing Details:</h5>
                        <p className="font-black text-sm">{o.customerName}</p>
                        <p className="text-slate-450">📞 {o.customerPhone}</p>
                        <p className="text-slate-400 font-mono truncate">{o.customerEmail}</p>
                        <p className="text-slate-450 leading-relaxed max-w-xs block mt-1.5">📍 {o.shippingAddress}</p>
                      </div>

                      {/* Items listed */}
                      <div className="space-y-1.5 md:border-x md:px-6 dark:border-slate-850 border-gray-150">
                        <h5 className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Purchased Products (x{o.items?.reduce((t, i) => t + i.quantity, 0)}):</h5>
                        <div className="space-y-2">
                          {o.items?.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <img src={item.image} alt="" className="w-8 h-8 object-cover rounded" referrerPolicy="no-referrer" />
                              <div className="flex-1 truncate leading-none">
                                <span className="font-extrabold text-[12px]">{item.name}</span>
                                <span className="text-[10px] block text-slate-500 font-mono">Qty {item.quantity} x {formatNaira(item.price)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ledger cost parameters */}
                      <div className="space-y-2 font-medium">
                        <h5 className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Receipt Status:</h5>
                        <div className="space-y-1.5 pb-1">
                          <p className="flex justify-between">
                            <span className="text-slate-500">Method Used:</span>
                            <span className="font-extrabold">{o.paymentMethod}</span>
                          </p>
                          <p className="flex justify-between items-center">
                            <span className="text-slate-500">Receipt Verified:</span>
                            <span className={`font-black uppercase text-[10px] ${o.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {o.paymentStatus === 'paid' ? 'Paid (Secure)' : 'Unverified / pending'}
                            </span>
                          </p>
                          {o.paymentStatus !== 'paid' && (
                            <button
                              id={`mark-paid-btn-${o.id}`}
                              onClick={() => {
                                if (window.confirm(`Verify you have received payment for Order ${o.id}?`)) {
                                  updateOrderPaymentStatus(o.id, 'paid');
                                }
                              }}
                              className="mt-1 w-full text-center text-[10px] uppercase font-bold tracking-wider py-1 bg-emerald-500 hover:bg-emerald-600 text-blue-950 rounded cursor-pointer transition-colors"
                            >
                              Authorize & Mark Paid
                            </button>
                          )}
                        </div>
                        <div className="flex justify-between border-t dark:border-slate-850 border-gray-200 pt-2 text-sm font-extrabold text-amber-500">
                          <span>Total Collected:</span>
                          <span className="font-mono">{formatNaira(o.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-10">No customer orders recorded in Firestore database yet.</p>
            )}
          </div>
        )}

        {/* SUBTAB 3: CONTACT FORM SUBMISSIONS */}
        {activeSubTab === 'messages' && (
          <div className="space-y-6">
            <div className="p-4.5 bg-gradient-to-r from-blue-950/15 to-transparent rounded-2xl border dark:border-slate-800 border-slate-100">
              <h3 className="text-sm font-black uppercase text-amber-450 tracking-wider">Customer Messages Inquiries</h3>
              <p className="text-[10px] text-slate-450">Read comments submitted from our Contact Us forms. Mark resolved to manage records.</p>
            </div>

            {contacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map(c => (
                  <div
                    key={c.id}
                    className={`p-5 rounded-2xl border space-y-3 relative overflow-hidden ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-150'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
                    
                    <div className="flex justify-between items-baseline border-b dark:border-slate-850 border-slate-100 pb-2">
                      <div>
                        <h4 className="font-black text-sm text-amber-400">{c.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{c.email}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded ${
                        c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400 animate-pulse'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-2">
                      <p className="font-bold block uppercase text-[10px] text-slate-500">Subject: <span className="normal-case text-white dark:text-amber-300">{c.subject}</span></p>
                      <p className="text-slate-450 mt-1 leading-relaxed leading-normal">{c.message}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-[10px] border-t dark:border-slate-850 border-slate-105">
                      <span className="text-slate-500 font-mono">Date: {c.createdAt?.split('T')[0]}</span>
                      {c.status !== 'Resolved' && (
                        <button
                          onClick={() => updateContactStatus(c.id, 'Resolved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors scale-90"
                        >
                          Resolve Inquiry
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-10">No customer message entries recorded in Firestore.</p>
            )}
          </div>
        )}

        {/* SUBTAB 4: SETTINGS, BANNER & COUPON CONFIGURATOR */}
        {activeSubTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Store Information Form */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-150'
            }`}>
              <h4 className="text-sm font-black uppercase text-amber-500 pb-2 border-b dark:border-slate-800 border-gray-100">
                ✏ Global Store Information
              </h4>
              <form onSubmit={handleUpdateStoreSettings} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase block font-bold text-slate-400">WhatsApp Number Setting (Plain text):</label>
                    <input
                      type="text"
                      required
                      value={whatsappNum}
                      onChange={(e) => setWhatsappNum(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-255'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase block font-bold text-slate-400">WhatsApp URL Link (wa.me format):</label>
                    <input
                      type="text"
                      required
                      value={whatsappLnk}
                      onChange={(e) => setWhatsappLnk(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-255'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase block font-bold text-slate-400">Corporate Email Address:</label>
                  <input
                    type="email"
                    required
                    value={emailAddr}
                    onChange={(e) => setEmailAddr(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-255'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase block font-bold text-slate-400">Office Business address:</label>
                  <input
                    type="text"
                    required
                    value={bizAddr}
                    onChange={(e) => setBizAddr(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-255'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase block font-bold text-slate-400">Opening Corporate Hours:</label>
                  <input
                    type="text"
                    required
                    value={bizHours}
                    onChange={(e) => setBizHours(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-255'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase block font-bold text-slate-400">Hero Slogan Bold Title:</label>
                  <input
                    type="text"
                    required
                    value={promoT}
                    onChange={(e) => setPromoT(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-255'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase block font-bold text-slate-400">Hero Slogan Subtitle desc:</label>
                  <textarea
                    rows={2}
                    required
                    value={promoST}
                    onChange={(e) => setPromoST(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-255'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl active:scale-95 transition-transform"
                >
                  Save Store Information
                </button>
              </form>
            </div>

            {/* Coupons and Testimonials setup */}
            <div className="space-y-6">
              
              {/* Promo Coupon Register form */}
              <div className={`p-6 rounded-2xl border space-y-4 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-150'
              }`}>
                <h4 className="text-sm font-black uppercase text-amber-500 pb-1 border-b dark:border-slate-800 border-gray-100 flex items-center gap-1.5">
                  <Tag className="w-4.5 h-4.5 text-amber-400" />
                  <span>Promo Coupons Registry</span>
                </h4>
                
                <form onSubmit={handleCreateCoupon} className="flex gap-2 text-xs font-bold">
                  <input
                    type="text"
                    required
                    placeholder="CODE (e.g., MEGA50)"
                    value={couponFormCode}
                    onChange={(e) => setCouponFormCode(e.target.value.toUpperCase())}
                    className={`px-3 py-2 rounded-xl border focus:outline-none max-w-[140px] ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-800'
                    }`}
                  />
                  <input
                    type="number"
                    required
                    placeholder="Val (%) e.g. 15"
                    value={couponFormVal || ''}
                    onChange={(e) => setCouponFormVal(Number(e.target.value))}
                    className={`px-3 py-2 rounded-xl border focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-800'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black rounded-xl uppercase tracking-wider text-[10px]"
                  >
                    Add
                  </button>
                </form>

                {/* Coupons applied list */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {coupons.map((c) => (
                    <span
                      key={c.code}
                      className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2.5 py-1 text-[10px] font-bold rounded-lg font-mono relative group"
                    >
                      <span>{c.code} ({c.value}%)</span>
                      <button
                        onClick={() => deleteCoupon(c.code)}
                        className="text-rose-500 hover:text-rose-700 ml-1 font-semibold focus:outline-none border-l pl-1 border-amber-500/20"
                        title="Delete code"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Testimonials Modifier form */}
              <div className={`p-6 rounded-2xl border space-y-4 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-150'
              }`}>
                <h4 className="text-sm font-black uppercase text-amber-500 pb-1 border-b dark:border-slate-800 border-gray-100 flex items-center gap-1.5">
                  <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400/20" />
                  <span>Client Testimonials Modifier</span>
                </h4>

                <form onSubmit={handleCreateTestimonial} className="space-y-3 text-xs font-semibold">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Customer Name"
                      value={testFormName}
                      onChange={(e) => setTestFormName(e.target.value)}
                      className={`px-3 py-2 rounded-xl border focus:outline-none ${
                        darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-gray-200'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Lagos Resident)"
                      value={testFormRole}
                      onChange={(e) => setTestFormRole(e.target.value)}
                      className={`px-3 py-2 rounded-xl border focus:outline-none ${
                        darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-gray-200'
                      }`}
                    />
                  </div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Write beautiful feedback content here..."
                    value={testFormContent}
                    onChange={(e) => setTestFormContent(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-gray-200'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black rounded-xl uppercase tracking-wider text-[10px]"
                  >
                    Register Testimonial
                  </button>
                </form>

                {/* Testimonial preview scrolling list */}
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {testimonials.map(t => (
                    <div key={t.id} className="flex justify-between items-center bg-slate-950/20 p-2.5 rounded-lg border dark:border-slate-850 border-slate-105 text-[11px]">
                      <div>
                        <p className="font-extrabold">{t.name} <span className="text-slate-500 font-normal">({t.role})</span></p>
                        <p className="text-slate-450 line-clamp-1 italic mt-0.5">"{t.content}"</p>
                      </div>
                      <button
                        onClick={() => deleteTestimonial(t.id)}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                        title="Delete feedback"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
