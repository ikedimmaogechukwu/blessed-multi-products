import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, PhoneCall, ChevronLeft, ChevronRight, MessageSquare, ArrowRight, Award, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSectionProps {
  setTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setTab }) => {
  const { settings } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Blessed Multi-Products",
      subtitle: "Quality You Can Trust",
      description: "Discover premium grade Nigerian agricultural food products sourced directly from selected arable farms. Clean, stone-free grain rice, honey beans, premium Ijebu crunchy Garri, refined healthy vegetable oil, and spicy kitchen seasonings.",
      tag: "GRAINS, FLOURS & OILS",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
      cta: "Explore Food Stuff"
    },
    {
      title: "The Latest Flagship Smartphones",
      subtitle: "Authentic Apple & Samsung Devices",
      description: "Step into the future with original mobile technology. Authenticated, factory-sealed iPhone 15 Pro Max models, Samsung S24 Ultra boasting cutting-edge Galaxy AI, Xiaomi, Infinix, and Tecno hardware at unbeatable local rates.",
      tag: "ORIGINAL MOBILE DEVICES",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
      cta: "Shop Mobiles"
    },
    {
      title: "High Performance Laptops",
      subtitle: "Power up your productivity",
      description: "Upgrade your workstation with original enterprise and gaming laptop computers. Professional Apple MacBook Pros with custom M3 processors, Dell Latitude, HP Pavilion, Lenovo Yoga dual touchscreens, and ASUS gaming machines.",
      tag: "ENTERPRISE WORKSTATIONS",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
      cta: "Browse Computers"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative overflow-hidden w-full h-[620px] bg-slate-950 text-white">
      {/* Slideshow background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.45, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat select-none"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        />
      </AnimatePresence>

      {/* Gold & Navy gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

      {/* Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-black/30 hover:bg-amber-500 hover:text-blue-950 rounded-full border border-white/15 hover:border-amber-400 transition-all text-white"
      >
        <ChevronLeft className="w-5.5 h-5.5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-black/30 hover:bg-amber-500 hover:text-blue-950 rounded-full border border-white/15 hover:border-amber-400 transition-all text-white"
      >
        <ChevronRight className="w-5.5 h-5.5" />
      </button>

      {/* Main Slide Content layout */}
      <div className="absolute inset-0 flex items-center justify-start z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl md:max-w-2xl space-y-6">
            
            {/* Tag Badges */}
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              key={`tag-${currentSlide}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/40 rounded-full text-xs font-black tracking-widest text-amber-400 uppercase font-mono"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{slides[currentSlide].tag}</span>
            </motion.span>

            {/* Main Slide Headings */}
            <div className="space-y-2">
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                key={`title-${currentSlide}`}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-300 font-sans"
              >
                {slides[currentSlide].title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                key={`subtitle-${currentSlide}`}
                className="text-lg sm:text-xl font-bold text-amber-400 tracking-wide flex items-center gap-2 font-handwritten"
              >
                — {slides[currentSlide].subtitle}
              </motion.p>
            </div>

            {/* Slide Body Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              key={`desc-${currentSlide}`}
              className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal"
            >
              {slides[currentSlide].description}
            </motion.p>

            {/* Big Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              key={`btngrp-${currentSlide}`}
              className="flex flex-wrap items-center gap-3.5 pt-4"
            >
              {/* Shop Now CTA */}
              <button
                onClick={() => setTab('shop')}
                className="px-6 py-3.5 bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 text-sm font-black tracking-wide rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 group"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                <span>Shop Catalog Online</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              {/* Chat on WhatsApp CTA */}
              <a
                href={settings.whatsappLink}
                target="_blank"
                referrerPolicy="no-referrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl active:scale-95 transition-all flex items-center gap-2 border border-emerald-500 shadow-lg shadow-emerald-600/10"
              >
                <MessageSquare className="w-4.5 h-4.5 fill-white/10" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Contact Us CTA */}
              <button
                onClick={() => setTab('contact')}
                className="px-6 py-3.5 bg-blue-900/40 hover:bg-blue-800/60 text-slate-200 hover:text-white text-sm font-bold rounded-xl border border-blue-700 active:scale-95 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Contact Office</span>
              </button>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Slide Index circles */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3.5 h-3.5 rounded-full transition-all border ${
              currentSlide === idx
                ? 'bg-amber-400 border-amber-400 w-8'
                : 'bg-white/30 border-transparent hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
