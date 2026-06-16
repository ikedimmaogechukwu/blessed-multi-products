import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Sparkles, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactSectionProps {
  darkMode: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ darkMode }) => {
  const { settings, submitContactMessage } = useApp();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    try {
      await submitContactMessage({
        name,
        email,
        subject: subject || 'General Store inquiry',
        message
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Title Header area */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-widest font-black text-amber-500 uppercase font-mono">Get In Touch</span>
        <h2 className="text-3xl font-black tracking-tight leading-none">Contact Our Corporate Desk</h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Inquire about bulk products pricing, delivery details, status tracking, or coordinate general merchandise partnerships directly.
        </p>
      </div>

      {/* Main Split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-2xl border space-y-6 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <h3 className="text-sm font-black uppercase text-amber-500 tracking-wider flex items-center gap-1.5 pb-2 border-b dark:border-slate-800 border-slate-100">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/10" />
              <span>Office Connections</span>
            </h3>

            {/* Address */}
            <div className="flex items-start gap-3 text-xs leading-normal">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-blue-900 dark:text-white uppercase text-[10px] tracking-wider">Business address:</h4>
                <p className="text-slate-400 mt-0.5 leading-relaxed font-semibold">
                  {settings.businessAddress}
                </p>
              </div>
            </div>

            {/* Mobile / Phone click triggers */}
            <div className="flex items-start gap-3 text-xs">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-blue-900 dark:text-white uppercase text-[10px] tracking-wider">Phone Calls & WhatsApp:</h4>
                <a href={`tel:${settings.whatsappNumber}`} className="text-amber-500 hover:underline mt-0.5 text-sm font-black block">
                  {settings.whatsappNumber}
                </a>
                <p className="text-[10px] text-slate-500 font-bold block mt-0.5 font-mono">WhatsApp Admin support link: wa.me/2349053656282</p>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-start gap-3 text-xs">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-blue-900 dark:text-white uppercase text-[10px] tracking-wider">Official Email desk:</h4>
                <a href={`mailto:${settings.emailAddress}`} className="text-slate-400 hover:text-amber-400 mt-0.5 font-semibold text-xs leading-none">
                  {settings.emailAddress}
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start gap-3 text-xs">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-blue-900 dark:text-white uppercase text-[10px] tracking-wider">Business Operating Hours:</h4>
                <p className="text-slate-400 mt-0.5 leading-none block">
                  {settings.businessHours}
                </p>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Inquiry trigger Direct Dial */}
          <a
            href={settings.whatsappLink}
            target="_blank"
            referrerPolicy="no-referrer"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl border-l-4 border-emerald-400 flex items-center justify-center gap-2.5 text-sm font-black tracking-wide shadow-lg transition-transform active:scale-95 block text-center"
          >
            <MessageSquare className="w-5 h-5 fill-white/10" />
            <span>Open Direct WhatsApp Chat</span>
          </a>
        </div>

        {/* Right Side: Contact message submission form */}
        <div className="lg:col-span-7">
          <div className={`p-6 rounded-3xl border space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <h3 className="text-sm font-black uppercase text-amber-500 tracking-wider">
              Send an Email Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold block text-slate-450">Your Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Musa Ibrahim"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-800'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold block text-slate-450">Your Email Email:</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g., musa@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-extrabold block text-slate-450">Subject Title:</label>
                <input
                  type="text"
                  placeholder="E.g., Bulk purchase quotation of Royal Stallion Rice"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-extrabold block text-slate-450">Detailed Message:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain your requirements or transaction reference numbers in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-200 text-slate-800'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 font-black uppercase text-xs tracking-wider rounded-xl hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting secure message...' : 'Submit Contact Inquiry'}</span>
              </button>

              {success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold animate-pulse">
                  <Check className="w-4 h-4" />
                  <span>Your comment has been delivered! Our administrators will look up your entry in Firestore.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Embedded Google Map Section */}
      <div className={`p-4 rounded-3xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-150'
      }`}>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block">
          📍 Embedded Market map Location:
        </h3>
        <div className="w-full h-[320px] rounded-2xl overflow-hidden bg-slate-950 grayscale opacity-90 hover:grayscale-0 transition-all duration-300">
          <iframe
            title="Blessed Multi-Products Market Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m4!2s3.3792!3d6.5244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae35f3dfd%3A0x2daedb6c31034f55!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sae!4v1680000000000!5m2!1sen!2sae"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

    </div>
  );
};
