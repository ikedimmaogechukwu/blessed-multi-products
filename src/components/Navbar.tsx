import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  openCart: () => void;
  openAuth: () => void;
  setCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setTab,
  openCart,
  openAuth,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode
}) => {
  const { userProfile, logout, cart, wishlist, dbMode, setDbMode } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const cartCount = cart.reduce((tot, item) => tot + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'categories', label: 'Categories' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (id: string) => {
    setTab(id);
    setMobileMenuOpen(false);
    if (id === 'categories') {
      setCategoryFilter('All');
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${
      darkMode ? 'bg-slate-900 border-b border-amber-500/20 text-white' : 'bg-white border-b border-gray-100 text-slate-800'
    } shadow-md`}>
      {/* Top Welcome Micro-Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-950 to-blue-900 border-b border-amber-400/30 text-amber-400 py-1.5 px-4 text-center text-xs tracking-wider uppercase font-medium flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 justify-center w-full sm:w-auto">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Blessed Multi-Products — Quality You Can Trust</span>
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 shrink-0 justify-center w-full sm:w-auto">
          <span className="text-[10px] text-slate-300 normal-case">Database Engine:</span>
          <button
            onClick={() => {
              const newMode = dbMode === 'local' ? 'firebase' : 'local';
              setDbMode(newMode);
            }}
            className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-black font-mono transition-all flex items-center gap-1 cursor-pointer select-none border ${
              dbMode === 'local'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/35 hover:bg-amber-500/20'
                : 'bg-blue-600/10 text-blue-400 border-blue-500/35 hover:bg-blue-600/20'
            }`}
            title="Click to toggle Storage and Auth backend instantly!"
          >
            <span>{dbMode === 'local' ? '📦 Local Sandbox' : '☁️ Cloud Firestore'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand */}
          <div className="cursor-pointer flex items-center gap-2.5" onClick={() => handleNavClick('home')} id="nav-logo">
            <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-lg flex items-center justify-center shadow-lg border border-amber-400 shadow-amber-400/10">
              <span className="text-blue-950 font-extrabold text-2xl tracking-tighter">B</span>
            </div>
            <div>
              <h1 className="text-xl font-black font-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-amber-500 dark:from-blue-400 dark:to-amber-400">
                BLESSED
              </h1>
              <span className="text-[9px] block text-amber-500/80 uppercase tracking-widest font-bold -mt-1 leading-none">
                Multi-Products
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className={`relative w-full flex items-center rounded-full transition-all duration-300 ${
              searchFocused 
                ? 'ring-2 ring-amber-500 bg-amber-500/5' 
                : darkMode ? 'bg-slate-800 hover:bg-slate-700/80' : 'bg-slate-100 hover:bg-slate-200/80'
            }`}>
              <Search className="w-5 h-5 ml-4 dark:text-gray-400 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab !== 'shop') {
                    setTab('shop');
                  }
                }}
                className="w-full bg-transparent px-3 py-2.5 text-sm font-medium focus:outline-none placeholder-slate-400 text-slate-800 dark:text-slate-100"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mr-3 p-1 rounded-full dark:hover:bg-slate-700 hover:bg-slate-300 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-2 py-1 text-sm font-semibold tracking-wide transition-colors ${
                  currentTab === item.id
                    ? 'text-amber-500 dark:text-amber-400'
                    : darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {currentTab === item.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Right Actions Icons */}
          <div className="flex items-center gap-3.5">
            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-full transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Toggle Theme"
            >
              {darkMode ? '🌙' : '☀️'}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className={`relative p-2.5 rounded-full transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-600'
              } ${currentTab === 'wishlist' ? 'text-amber-500 bg-amber-500/10' : ''}`}
            >
              <Heart className="w-5.5 h-5.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-blue-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 dark:ring-slate-900 ring-white scale-90">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon */}
            <button
              onClick={openCart}
              className={`relative p-2.5 rounded-full transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-600'
              }`}
              id="navbar-cart-btn"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-tr from-amber-500 to-amber-400 text-blue-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 dark:ring-slate-900 ring-white transform scale-90 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Admin or login Trigger */}
            {userProfile ? (
              <div className="relative group flex items-center">
                <button
                  onClick={() => handleNavClick(userProfile.isAdmin ? 'admin' : 'dashboard')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                    darkMode 
                      ? 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-amber-400' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-blue-950'
                  }`}
                >
                  {userProfile.isAdmin ? (
                    <Settings className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: '6s' }} />
                  ) : (
                    <User className="w-4.5 h-4.5" />
                  )}
                  <span className="text-xs font-bold truncate max-w-[90px]">
                    {userProfile.isAdmin ? 'Admin' : userProfile.fullName.split(' ')[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className={`w-48 shadow-xl rounded-xl p-2 border ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-slate-800'
                  }`}>
                    {userProfile.isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs leading-none font-bold transition-colors ${
                          darkMode ? 'hover:bg-slate-700 text-amber-400' : 'hover:bg-slate-100 text-blue-900'
                        }`}
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs leading-none font-bold transition-colors ${
                        darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                      }`}
                    >
                      My Dashboard
                    </button>
                    <button
                      onClick={() => handleNavClick('wishlist')}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs leading-none font-semibold transition-colors ${
                        darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                      }`}
                    >
                      Saved Wishlist
                    </button>
                    <hr className={`my-1.5 ${darkMode ? 'border-slate-700' : 'border-gray-100'}`} />
                    <button
                      onClick={() => {
                        logout();
                        handleNavClick('home');
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs leading-none font-bold text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center justify-between"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={openAuth}
                className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-950 hover:to-blue-900 text-white shadow-md shadow-blue-950/20 px-5 py-2 rounded-full text-sm font-bold border border-amber-500/30 hover:border-amber-400 transition-all flex items-center gap-1.5"
                id="navbar-login-btn"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Hamburger Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-full ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Slide list */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-t ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-gray-200'
            }`}
          >
            <div className="px-4 py-4 space-y-3">
              {/* Search mobile */}
              <div className={`relative flex items-center rounded-xl px-3 py-2 ${
                darkMode ? 'bg-slate-800' : 'bg-white border border-gray-200'
              }`}>
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentTab !== 'shop') {
                      setTab('shop');
                    }
                  }}
                  className="w-full bg-transparent ml-2 text-sm focus:outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Links */}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${
                    currentTab === item.id
                      ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-l-4 border-amber-500'
                      : darkMode ? 'text-slate-300 hover:bg-slate-850' : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <hr className={`my-2 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`} />

              {/* Dashboard / Auth elements inside mobile bar */}
              {userProfile ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center font-bold text-blue-950">
                      {userProfile.fullName[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold truncate">{userProfile.fullName}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{userProfile.email}</p>
                    </div>
                  </div>
                  {userProfile.isAdmin && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-2 text-amber-500 ${
                        darkMode ? 'hover:bg-slate-800' : 'hover:bg-white shadow-sm'
                      }`}
                    >
                      <Settings className="w-4.5 h-4.5" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold ${
                      darkMode ? 'hover:bg-slate-800' : 'hover:bg-white shadow-sm'
                    }`}
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      handleNavClick('home');
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl font-bold text-rose-500 flex items-center justify-between"
                  >
                    <span>Sign Out</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={openAuth}
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl py-3 text-center font-bold flex items-center justify-center gap-2"
                >
                  <User className="w-4.5 h-4.5 text-amber-400" />
                  <span>Login / Register</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
