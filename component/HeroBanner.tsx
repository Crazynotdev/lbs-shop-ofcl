'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_SLIDES = [
  {
    id: '1',
    badge: '🏆 Collection 2026',
    title: 'MAILLOTS\nOFFICIELS',
    subtitle: 'Les plus grands clubs européens',
    description: 'PSG, Real Madrid, Man City, Inter Milan — authentiques et premium',
    cta_primary: { label: 'Voir les maillots', href: '/catalogue?tag=europe' },
    cta_secondary: { label: 'Tout le catalogue', href: '/catalogue' },
    gradient: 'from-[#003087] via-[#0A0A0A] to-[#0A0A0A]',
    accent: '#00D084',
    pattern: '⚽',
  },
  {
    id: '2',
    badge: '🌍 Sélections africaines',
    title: 'FIERS DE\nNOS COULEURS',
    subtitle: 'Équipes nationales africaines',
    description: 'Gabon, Sénégal, Cameroun, Côte d\'Ivoire, Égypte et plus encore',
    cta_primary: { label: 'Découvrir', href: '/catalogue?tag=afrique' },
    cta_secondary: { label: 'Tous les maillots', href: '/catalogue' },
    gradient: 'from-[#006B3F] via-[#0A0A0A] to-[#0A0A0A]',
    accent: '#FFD700',
    pattern: '🏆',
  },
  {
    id: '3',
    badge: '🔥 Promotions',
    title: 'OFFRES\nSPÉCIALES',
    subtitle: 'Jusqu\'à -40% sur une sélection',
    description: 'Profitez de nos prix réduits sur les maillots et accessoires',
    cta_primary: { label: 'Voir les promos', href: '/catalogue?has_promotion=true' },
    cta_secondary: { label: 'Commander sur WhatsApp', href: 'https://wa.me/24177000000' },
    gradient: 'from-[#8B0000] via-[#0A0A0A] to-[#0A0A0A]',
    accent: '#FF4444',
    pattern: '🎯',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const total = DEFAULT_SLIDES.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [autoplay, next]);

  const slide = DEFAULT_SLIDES[current];

  return (
    <section
      className="relative min-h-[88vh] flex items-center overflow-hidden bg-dark"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Background gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + '-bg'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={cn('absolute inset-0 bg-gradient-to-r', slide.gradient)}
        />
      </AnimatePresence>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Big pattern emoji — decorative */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + '-emoji'}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 0.06, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.8 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[30rem] select-none pointer-events-none leading-none translate-x-1/3"
        >
          {slide.pattern}
        </motion.div>
      </AnimatePresence>

      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-all duration-700"
        style={{ background: slide.accent }}
      />

      {/* Content */}
      <div className="container-main relative z-10 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/10 text-white text-sm font-medium mb-6"
            >
              {slide.badge}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white uppercase leading-[0.9] tracking-tight"
              style={{ textShadow: `0 0 80px ${slide.accent}30` }}
            >
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className={cn('block', i === 1 && 'text-gradient-green')}>
                  {line}
                </span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="font-display font-semibold text-xl sm:text-2xl text-white/70 uppercase tracking-wide mt-4"
            >
              {slide.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-light-muted text-base mt-3 max-w-xl"
            >
              {slide.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              <Link href={slide.cta_primary.href} className="btn-primary text-base px-8 py-4">
                <ShoppingBag size={18} />
                {slide.cta_primary.label}
              </Link>
              <Link
                href={slide.cta_secondary.href}
                target={slide.cta_secondary.href.startsWith('http') ? '_blank' : undefined}
                className="btn-secondary text-base px-8 py-4"
              >
                {slide.cta_secondary.href.includes('wa.me') && <MessageCircle size={18} />}
                {slide.cta_secondary.label}
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-8 mt-12"
            >
              {[
                { value: '500+', label: 'Produits' },
                { value: '100%', label: 'Authentic' },
                { value: '24h', label: 'Livraison LBV' },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="font-display font-black text-3xl text-brand-green">{stat.value}</p>
                  <p className="text-xs text-light-subtle uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-8 right-8 sm:right-16 flex items-center gap-3 z-10">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:text-brand-green hover:border-brand-green transition-all duration-200 active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:text-brand-green hover:border-brand-green transition-all duration-200 active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {DEFAULT_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === current
                ? 'w-6 h-2 bg-brand-green'
                : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            )}
          />
        ))}
      </div>
    </section>
  );
}
