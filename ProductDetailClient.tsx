'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Zap, ChevronLeft, ChevronRight,
  MessageCircle, Star, Package, RotateCcw, Shield,
  Share2, Heart, ZoomIn
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, calculateDiscount, generateWhatsAppMessage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  const images = product.images ?? [];
  const availableSizes = product.sizes?.filter((s) => s.stock > 0) ?? [];
  const discount = calculateDiscount(product.price, product.original_price);
  const isOutOfStock = product.stock === 0;
  const currentImage = images[selectedImage];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '24177000000';

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Veuillez choisir une taille');
      return;
    }
    addItem({
      product_id: product.id,
      product_name: product.name,
      product_image: currentImage?.url ?? null,
      product_slug: product.slug,
      size: selectedSize,
      quantity,
      unit_price: product.price,
      stock: product.stock,
      available_sizes: availableSizes.map((s) => s.size),
    });
    toast.success(`${product.name} ajouté au panier !`, { icon: '🛒' });
  };

  const handleBuyNow = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Veuillez choisir une taille');
      return;
    }
    const cartItem = {
      id: 'temp',
      product_id: product.id,
      product_name: product.name,
      product_image: currentImage?.url ?? null,
      product_slug: product.slug,
      size: selectedSize,
      quantity,
      unit_price: product.price,
      stock: product.stock,
      available_sizes: availableSizes.map((s) => s.size),
    };
    const msg = generateWhatsAppMessage(
      [cartItem],
      { name: '', phone: '', city: '', neighborhood: '' },
      product.price * quantity
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
  };

  const prevImage = () => setSelectedImage((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setSelectedImage((i) => (i + 1) % images.length);

  return (
    <div className="container-main py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-light-subtle mb-8">
        <Link href="/" className="hover:text-brand-green transition-colors">Accueil</Link>
        <ChevronRight size={12} />
        <Link href="/catalogue" className="hover:text-brand-green transition-colors">Catalogue</Link>
        {product.category && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/catalogue?category=${product.category.slug}`}
              className="hover:text-brand-green transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-white font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
        {/* ——— Gallery ——— */}
        <div>
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-200 mb-4 group">
            {currentImage ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentImage.url}
                      alt={currentImage.alt ?? product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className={cn(
                        'object-cover transition-transform duration-500',
                        zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                      )}
                      onClick={() => setZoomed(!zoomed)}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Zoom icon */}
                <button
                  onClick={() => setZoomed(!zoomed)}
                  className="absolute top-4 right-4 w-9 h-9 glass rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <ZoomIn size={16} />
                </button>

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-brand-green"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-brand-green"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {discount > 0 && (
                    <span className="badge-red text-sm font-black">-{discount}%</span>
                  )}
                  {product.is_new && <span className="badge-new text-xs font-bold">NOUVEAU</span>}
                  {product.is_featured && <span className="badge-yellow text-xs font-bold">⭐ TOP</span>}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-8xl font-black text-dark-400 uppercase">
                  {product.name.slice(0, 2)}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto hide-scrollbar">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200',
                    i === selectedImage
                      ? 'border-brand-green scale-95'
                      : 'border-dark-300 opacity-60 hover:opacity-100'
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? product.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ——— Info ——— */}
        <div className="space-y-6">
          {/* Category */}
          {product.category && (
            <Link
              href={`/catalogue?category=${product.category.slug}`}
              className="text-xs uppercase tracking-widest text-brand-green font-bold hover:text-brand-green-light"
            >
              {product.category.name}
            </Link>
          )}

          {/* Name */}
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white uppercase leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="font-display font-black text-4xl text-white">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xl text-light-subtle line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
            {discount > 0 && (
              <span className="badge-red text-base font-black">-{discount}%</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full',
                isOutOfStock ? 'bg-red-500' : product.stock <= 5 ? 'bg-orange-400' : 'bg-brand-green'
              )}
            />
            <span className={cn(
              'text-sm font-semibold',
              isOutOfStock ? 'text-red-400' : product.stock <= 5 ? 'text-orange-400' : 'text-brand-green'
            )}>
              {isOutOfStock
                ? 'Rupture de stock'
                : product.stock <= 5
                ? `Plus que ${product.stock} en stock !`
                : `${product.stock} en stock`}
            </span>
          </div>

          <hr className="border-dark-300" />

          {/* Sizes */}
          {availableSizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white uppercase tracking-wide">
                  Taille
                </label>
                {selectedSize && (
                  <span className="text-brand-green text-sm font-semibold">
                    Sélectionné: <strong>{selectedSize}</strong>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s.size === selectedSize ? null : s.size)}
                    className={cn(
                      'w-14 h-10 rounded-xl text-sm font-bold border-2 transition-all duration-200',
                      selectedSize === s.size
                        ? 'bg-brand-green border-brand-green text-dark scale-105 shadow-green-glow'
                        : 'bg-dark-100 border-dark-300 text-white hover:border-brand-green/50 hover:text-brand-green'
                    )}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              {product.sizes?.some((s) => s.stock === 0) && (
                <p className="text-xs text-light-subtle mt-2">
                  Certaines tailles sont épuisées
                </p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="text-sm font-bold text-white uppercase tracking-wide mb-3 block">
              Quantité
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-dark-100 border border-dark-300 text-white hover:border-brand-green hover:text-brand-green transition-all duration-200 font-bold text-lg"
              >
                −
              </button>
              <span className="w-12 text-center font-display font-black text-xl text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="w-10 h-10 rounded-xl bg-dark-100 border border-dark-300 text-white hover:border-brand-green hover:text-brand-green transition-all duration-200 font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 btn-primary text-base py-4"
            >
              <ShoppingCart size={20} />
              {isOutOfStock ? 'Épuisé' : 'Ajouter au panier'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-[#25D366] text-white font-display font-bold uppercase tracking-wide rounded-full hover:bg-[#1fbd5c] active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MessageCircle size={20} />
              Commander via WhatsApp
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-light-muted text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Package, label: 'Livraison\nLibreville' },
              { icon: RotateCcw, label: 'Retour\n7 jours' },
              { icon: Shield, label: '100%\nAuthentique' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-3 bg-dark-100 rounded-xl border border-dark-200 text-center"
              >
                <Icon size={18} className="text-brand-green" />
                <span className="text-[10px] text-light-subtle leading-tight font-medium whitespace-pre">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
