import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, MapPin, Phone, Mail, User, ShieldCheck, CheckCircle, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';

interface UserDashboardProps {
  darkMode: boolean;
  setTab: (tab: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ darkMode, setTab }) => {
  const { userProfile, orders, saveAddress, updateProfileDetails } = useApp();
  
  // Local forms state
  const [newAddress, setNewAddress] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [loading, setLoading] = useState(false);

  if (!userProfile) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-900/10 text-blue-900 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto shadow-lg text-2xl">
          👤
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Access Prohibited</h2>
          <p className="text-xs text-slate-500 mt-2">
            Please log in or register to inspect your order statuses, manage shipping address cards, and track dispatches.
          </p>
        </div>
        <button
          onClick={() => {
            const loginBtn = document.getElementById('navbar-login-btn');
            if (loginBtn) loginBtn.click();
          }}
          className="px-6 py-3 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black rounded-xl text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all"
        >
          Authenticate Account
        </button>
      </div>
    );
  }

  // Find orders matching current logged client
  const myOrders = orders.filter(o => o.userId === userProfile.id);

  const formatNaira = (num: number) => {
    return '₦' + num.toLocaleString('en-NG');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    await saveAddress(newAddress.trim());
    setNewAddress('');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateProfileDetails(fullName.trim(), phone.trim());
    setEditingProfile(false);
    setLoading(false);
  };

  // WhatsApp status inquiry link generator
  const getWhatsAppOrderStatusText = (orderId: string, status: string, amt: number) => {
    const textMsg = `Hello Blessed Multi-Products, I am inquiring about the delivery status of my Order ${orderId} (Status: ${status}, Total: ${formatNaira(amt)}). Please help verify logistics.`;
    return `https://wa.me/2349053656282?text=${encodeURIComponent(textMsg)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      
      {/* Title greeting card */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-blue-950 p-6 rounded-3xl border border-amber-500/10 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] tracking-widest font-black uppercase text-amber-500 font-mono">Customer Account Dashboard</span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none mt-1">Hello, {userProfile.fullName || 'Valued Customer'}</h2>
            <p className="text-xs text-slate-400 mt-2 font-mono">User Unique Key ID: {userProfile.id}</p>
          </div>
          {userProfile.isAdmin && (
            <span className="px-3 py-1 bg-amber-500 text-blue-950 font-black text-[10px] uppercase tracking-wider rounded-full border border-amber-300">
              ✓ Verified Store Admin
            </span>
          )}
        </div>
      </div>

      {/* Profile Info and Address split grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Profile & Addresses */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Profile metadata info */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <div className="flex justify-between items-baseline pb-1.5 border-b dark:border-slate-800 border-slate-100">
              <h3 className="text-xs font-black uppercase text-amber-500 tracking-wider">
                👤 Contact Information
              </h3>
              {!editingProfile ? (
                <button
                  onClick={() => {
                    setFullName(userProfile.fullName || '');
                    setPhone(userProfile.phone || '');
                    setEditingProfile(true);
                  }}
                  className="text-[10px] text-amber-500 font-bold hover:underline"
                >
                  Edit Profile
                </button>
              ) : (
                <button onClick={() => setEditingProfile(false)} className="text-[10px] text-rose-500 font-bold hover:underline">
                  Cancel
                </button>
              )}
            </div>

            {!editingProfile ? (
              <div className="space-y-3.5 text-xs font-semibold">
                <p className="flex justify-between">
                  <span className="text-slate-450 uppercase text-[9px] font-bold">Email address:</span>
                  <span className="text-slate-300 select-all font-mono">{userProfile.email}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-450 uppercase text-[9px] font-bold">Mobile Phone:</span>
                  <span className="text-slate-300 font-mono">{userProfile.phone || 'Not recorded'}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-450 uppercase text-[9px] font-bold">Billing Status:</span>
                  <span className="text-emerald-500 font-bold">Active secure credentials</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-455">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-800'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider block font-bold text-slate-455">Phone Number:</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-800'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black rounded-lg uppercase tracking-wider text-[10px]"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>

          {/* Addresses lists Management */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-105 shadow-sm'
          }`}>
            <h3 className="text-xs font-black uppercase text-amber-500 tracking-wider pb-1.5 border-b dark:border-slate-800 border-slate-100">
              📍 Saved Shipping Addresses
            </h3>

            {/* List addresses cards */}
            <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
              {userProfile.savedAddresses && userProfile.savedAddresses.length > 0 ? (
                userProfile.savedAddresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs leading-normal leading-relaxed ${
                      darkMode ? 'bg-slate-950 border-slate-850 text-slate-350' : 'bg-slate-50 border-gray-150 text-slate-800 font-medium'
                    }`}
                  >
                    {addr}
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-500 italic">No saved delivery address cards yet. Type one below.</p>
              )}
            </div>

            {/* Add Address Form */}
            <form onSubmit={handleAddAddress} className="space-y-2">
              <textarea
                required
                rows={2}
                placeholder="Type complete shipping address coordinates (suite, street, city)"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className={`w-full p-2 rounded-xl text-xs border focus:outline-none ${
                  darkMode ? 'bg-slate-950 border-slate-850 text-white' : 'bg-white border-gray-200 text-slate-800 font-medium'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-900 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider shadow-sm hover:bg-blue-950 transition-colors"
              >
                Register Shipping Address
              </button>
            </form>
          </div>

        </div>

        {/* Right Side: Order Invoices tracker Logs */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-105 shadow-sm'
          }`}>
            <h3 className="text-xs font-black uppercase text-amber-500 tracking-wider pb-1.5 border-b dark:border-slate-800 border-slate-100 flex items-center gap-1.5">
              <ShoppingBag className="w-4.5 h-4.5 text-amber-400" />
              <span>Historic Order Ledger ({myOrders.length})</span>
            </h3>

            {myOrders.length > 0 ? (
              <div className="space-y-4">
                {myOrders.map(o => (
                  <div
                    key={o.id}
                    className={`p-4 rounded-xl border space-y-3 text-xs ${
                      darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-gray-150'
                    }`}
                  >
                    <div className="flex justify-between items-baseline pb-2 border-b dark:border-slate-850 border-gray-150">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Date Placed: {o.createdAt?.split('T')[0]}</span>
                        <span className="font-extrabold text-blue-950 dark:text-white font-mono">ID: {o.id}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${
                        o.orderStatus === 'Delivered' ? 'bg-emerald-500/15 text-emerald-400' :
                        o.orderStatus === 'Shipped' ? 'bg-indigo-500/15 text-indigo-400' :
                        o.orderStatus === 'Cancelled' ? 'bg-rose-500/15 text-rose-450' :
                        'bg-amber-500/15 text-amber-400 animate-pulse'
                      }`}>
                        {o.orderStatus}
                      </span>
                    </div>

                    {/* Order products names */}
                    <div className="space-y-1">
                      {o.items?.map((item, id) => (
                        <div key={id} className="flex justify-between font-medium">
                          <span className="truncate max-w-[280px]">{item.name} <span className="font-mono text-slate-500 text-[10px]">(x{item.quantity})</span></span>
                          <span className="font-mono text-slate-500">{formatNaira(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-end border-t dark:border-slate-850 border-gray-200 pt-2 font-bold select-none">
                      <div>
                        <span className="text-[10px] text-slate-450 uppercase mr-1">Receipt Status: </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-black font-mono ${o.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {o.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                      <span className="text-amber-500 font-mono text-sm leading-none font-black">{formatNaira(o.totalAmount)}</span>
                    </div>

                    {/* WHATSAPP ORDER DISPATCH TRACKING - REQUIRED */}
                    <div className="pt-2">
                      <a
                        href={getWhatsAppOrderStatusText(o.id, o.orderStatus, o.totalAmount)}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-750 text-white rounded-lg flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-white/10" />
                        <span>Inquire Delivery Status On WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <p className="text-xs text-slate-500 italic block">You haven't placed any orders in our marketplace yet.</p>
                <button
                  onClick={() => setTab('shop')}
                  className="px-4 py-2 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black rounded-lg uppercase tracking-wider text-[10px]"
                >
                  Browse Store Catalog
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
