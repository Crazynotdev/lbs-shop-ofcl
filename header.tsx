'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, Menu, X, ChevronDown,
  Zap, Package, Tag, Star
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Catalogue', href: '/catalogue' },
  {
    label: 'Maillots',
    href: '/catalogue?category=maillots',
    sub: [
      { label: 'Clubs européens', href: '/catalogue?tag=europe', icon: '⚽' },
      { label: 'Clubs africains', href: '/catalogue?tag=afrique', icon: '🌍' },
      { label: 'Sélections nationales', href: '/catalogue?tag=national', icon: '🏆' },
      { label: 'Basketball', href: '/catalogue?tag=basket', icon: '🏀' },
      { label: 'Éditions rétro', href: '/catalogue?tag=retro', icon: '🕹️' },
    ],
  },
  {
    label: 'Accessoires',
    href: '/catalogue?category=accessoires',
    sub: [
      { label: 'Casquettes', href: '/catalogue?tag=casquettes', icon: '🧢' },
      { label: 'Chaussettes', href: '/catalogue?tag=chaussettes', icon: '🧦' },
      { label: 'Sacs', href: '/catalogue?tag=sacs', icon: '🎒' },
      { label: 'Écharpes', href: '/catalogue?tag=echarpes', icon: '🧣' },
      { label: 'Gourdes & Autres', href: '/catalogue?tag=autres', icon: '💧' },
    ],
  },
  { label: 'Promotions', href: '/catalogue?has_promotion=true', icon: <Tag size={14} /> },
];

export default function Header() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogue?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'glass shadow-2xl' : 'bg-transparent'
        )}
      >
        {/* Top bar — promotions */}
        <div className="bg-brand-green text-dark text-center py-2 text-xs font-semibold tracking-wider uppercase">
          <span className="hidden sm:inline">🏆 Livraison à Libreville — </span>
          Commandez via WhatsApp, livraison rapide &nbsp;⚡
        </div>

        <div className="container-main">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="relative w-10 h-10">
                {/* Fallback logo si pas d'asset */}
                <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center font-display font-black text-dark text-lg group-hover:scale-105 transition-transform">
                  LBS
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-black text-xl text-white uppercase tracking-tight">
                  LBS <span className="text-brand-green">Shop</span>
                </span>
                <p className="text-[9px] text-light-subtle tracking-widest uppercase -mt-0.5">
                  Maillots & Accessoires
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('?')[0]))
                        ? 'text-brand-green bg-brand-green/10'
                        : 'text-light-muted hover:text-white hover:bg-dark-200'
                    )}
                  >
                    {link.icon}
                    {link.label}
                    {link.sub && (
                      <ChevronDown
                        size={12}
                        className={cn(
                          'transition-transform duration-200',
                          activeDropdown === link.label ? 'rotate-180' : ''
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.sub && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 glass rounded-2xl overflow-hidden shadow-2xl"
                      >
                        {link.sub.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-light-muted hover:text-white hover:bg-dark-200/60 transition-colors"
                          >
                            <span className="text-base">{sub.icon}</span>
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="btn-icon"
                aria-label="Rechercher"
              >
                <Search size={18} />
              </button>

              {/* Cart */}
              <Link href="/cart" className="btn-icon relative" aria-label="Panier">
                <ShoppingCart size={18} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-brand-green text-dark text-xs font-black rounded-full flex items-center justify-center"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="btn-icon lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pb-3"
              >
                <form onSubmit={handleSearch} className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light-subtle" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un maillot, club, taille..."
                    className="input pl-11 pr-24"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-4 text-xs rounded-lg">
                    Chercher
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass border-t border-dark-300 overflow-hidden"
            >
              <div className="container-main py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-light-muted hover:text-white hover:bg-dark-200 transition-all"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                    {link.sub && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {link.sub.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-light-subtle hover:text-white hover:bg-dark-200 transition-all"
                          >
                            <span>{sub.icon}</span>
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer pour le contenu sous le header fixe */}
      <div className="h-16 pt-8" />
    </>
  );
}
