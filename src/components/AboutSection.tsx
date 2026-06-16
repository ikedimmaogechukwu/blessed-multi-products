import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, ShieldCheck, Zap, Handshake, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutSectionProps {
  darkMode: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ darkMode }) => {
  const { testimonials } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Title block */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-widest font-black text-amber-500 uppercase font-mono">Our Corporate Journey</span>
        <h2 className="text-3xl font-black tracking-tight leading-none">Blessed Multi-Products</h2>
        <p className="text-xs text-slate-450 font-handwritten text-lg text-amber-500 font-bold mt-1">— "Quality You Can Trust"</p>
        <p className="text-xs text-slate-450 max-w-xl mx-auto leading-relaxed pt-2">
          Providing consistent Nigerian household foodstuffs and authentic flagship electronics in one unified premium marketplace.
        </p>
      </div>

      {/* Banner Story Row split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-blue-950/20 to-transparent p-6 sm:p-8 rounded-3xl border border-amber-500/10">
        <div className="space-y-4">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] uppercase font-bold rounded-full">Established with Excellence</span>
          <h3 className="text-xl font-black">Our Founding Slogan & Vision</h3>
          
          <p className="text-xs text-slate-400 leading-relaxed">
            At Blessed Multi-Products, we believe premium procurement does not require outrageous pricing. We have built robust, direct pathways which bridge premium Nigerian arable food farms with your commercial table, alongside shipping original, authenticated factory-sealed Apple & Samsung smartphones and work laptops.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every bag of stone-free long grain parboiled rice, crunchy premium Garri, golden yellow Honey Beans reflects our trademark quality vetting. Furthermore, all electronic catalog items carry genuine dealer serial numbers and validation.
          </p>
        </div>

        {/* Dynamic Image Illustration Block */}
        <div className="relative h-[280px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
            alt="Premium merchandise food stuffs marketplace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-blue-950/90 border border-amber-500/25 rounded-xl text-center">
            <span className="text-[10px] font-mono tracking-wider text-amber-400 font-bold block uppercase">TRADEMARK GUARANTEE</span>
            <p className="text-xs text-white font-extrabold mt-1">100% Stone-Free Grains & Sealed Flagship Electronics</p>
          </div>
        </div>
      </div>

      {/* Pillars Section block */}
      <div className="space-y-6 pt-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 text-center block">Why Thousands of Clients Choose Blessed</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm">Vetted Quality</h4>
            <p className="text-xs text-slate-450 leading-relaxed">Every batch of Nigeria Honeywell beans, ground flours, and oils passes high sorting checks. 100% stone-free.</p>
          </div>

          {/* Pillar 2 */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm">Genuine Sealed Devices</h4>
            <p className="text-xs text-slate-450 leading-relaxed">Apple MacBooks and Samsung mobile phones ship factory-sealed with full local dealer warranty protections.</p>
          </div>

          {/* Pillar 3 */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm">Instant Delivery Update</h4>
            <p className="text-xs text-slate-450 leading-relaxed">We sync with shipping partners and open direct-click WhatsApp trackers for your order fulfillment.</p>
          </div>

          {/* Pillar 4 */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
              <Handshake className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm">Corporate Integrity</h4>
            <p className="text-xs text-slate-450 leading-relaxed">We honor Zenith/Bank details instantly and operate fully licensed under Nigerian corporate laws.</p>
          </div>

        </div>
      </div>

      {/* Testimonials Bento Cards Section */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <span className="text-[10px] tracking-widest font-black text-amber-500 uppercase font-mono">Real Customer Feedback</span>
          <h3 className="text-xl font-black">Client Voices & Testimonials</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div
              key={t.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                darkMode ? 'bg-slate-900 border-slate-800 hover:border-amber-500/20' : 'bg-white border-gray-150 shadow-sm hover:border-amber-400'
              } transition-all duration-300`}
            >
              <div className="space-y-2">
                {/* 5 stars */}
                <div className="flex text-amber-450 scale-90 origin-left">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t dark:border-slate-850 border-gray-100">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs text-amber-500 font-extrabold">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="leading-none">
                  <span className="text-xs font-extrabold block">{t.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
